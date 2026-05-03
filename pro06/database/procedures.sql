create or replace NONEDITIONABLE PROCEDURE ADJUST_SALARY (
    e_hireDate           IN DATE DEFAULT DATE '2023-01-01',
    p_inflation_rate     IN NUMBER,
    p_employees_updated  OUT NUMBER,
    p_total_increase     OUT NUMBER
) IS
    total_before NUMBER;
    total_after  NUMBER;
BEGIN
    -- Total salary before update
    SELECT SUM(salary) INTO total_before
    FROM employee;
    -- Update employees hired before given date
    UPDATE employee
    SET salary = salary * (1 + p_inflation_rate / 100)
    WHERE hire_date < e_hireDate;

    -- Total salary after update
    SELECT SUM(salary)
    INTO total_after
    FROM employee;

    -- Number of employees updated
    SELECT COUNT(*)
    INTO p_employees_updated
    FROM employee
    WHERE hire_date < e_hireDate;

    -- Total salary increase
    p_total_increase := total_after - total_before;
END;


DECLARE
    v_updated NUMBER;
    v_increase NUMBER;
    v_confirm VARCHAR2(5);
BEGIN
    -- Ask for confirmation
    v_confirm := '&confirm';   -- y or n

    -- Call the procedure
    ADJUST_SALARY(
        e_hireDate => DATE '2023-01-01',
        p_inflation_rate => 5,
        p_employees_updated => v_updated,
        p_total_increase => v_increase
    );

    IF LOWER(v_confirm) = 'y' THEN
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Changes committed.');
    ELSE
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Changes rolled back.');
    END IF;

    DBMS_OUTPUT.PUT_LINE('Employees updated: ' || v_updated);
    DBMS_OUTPUT.PUT_LINE('Total increase: ' || v_increase);
END;
/

/* BEGIN
                ADJUST_SALARY(
                    e_hireDate          => TO_DATE(:dt, 'YYYY-MM-DD'),
                    p_inflation_rate    => :rate,
                    p_employees_updated => :updated,
                    p_total_increase    => :increase
                );
            END;

SELECT employee_id, first_name, last_name, salary as old_salary,
                   hire_date,
                   salary * (1 + :rate / 100) as new_salary
            FROM Employee 
            WHERE hire_date < TO_DATE(:dt, 'YYYY-MM-DD')
            AND is_active = 'Y'
*/




CREATE OR REPLACE PROCEDURE CREATE_BOOKING_SAFE (
                p_customer_id IN NUMBER,
                p_hotel_id    IN NUMBER,
                p_room_id     IN NUMBER,
                p_check_in    IN VARCHAR2,
                p_check_out   IN VARCHAR2,
                p_guests      IN NUMBER,
                p_total_amount IN NUMBER,
                p_booking_id  OUT NUMBER
            ) IS
                v_capacity NUMBER;
                v_count    NUMBER;
                v_check_in DATE;
                v_check_out DATE;
                v_new_id   NUMBER;
            BEGIN
                -- 1. Validate Dates
                v_check_in := TO_DATE(p_check_in, 'YYYY-MM-DD');
                v_check_out := TO_DATE(p_check_out, 'YYYY-MM-DD');

                IF v_check_in >= v_check_out THEN
                    RAISE_APPLICATION_ERROR(-20002, 'Check-in date must be strictly before check-out date.');
                END IF;

                -- 2. Validate Room Exists & Capacity
                BEGIN
                    SELECT max_occupancy INTO v_capacity FROM Room WHERE room_id = p_room_id;
                EXCEPTION
                    WHEN NO_DATA_FOUND THEN
                        RAISE_APPLICATION_ERROR(-20004, 'Room ID ' || p_room_id || ' does not exist.');
                END;

                IF p_guests > v_capacity THEN
                    RAISE_APPLICATION_ERROR(-20003, 'Guest count (' || p_guests || ') exceeds room capacity of ' || v_capacity || '.');
                END IF;

                -- 3. Validate Availability (Overlap Check)
                SELECT COUNT(*) INTO v_count 
                FROM Booking_Room br
                JOIN Booking b ON br.booking_id = b.booking_id
                WHERE br.room_id = p_room_id
                AND b.status != 'Cancelled'
                AND (v_check_in < br.check_out_date AND v_check_out > br.check_in_date);

                IF v_count > 0 THEN
                    RAISE_APPLICATION_ERROR(-20001, 'Room is unavailable for the selected dates.');
                END IF;

                -- 4. Perform Transactional Inserts
                INSERT INTO Booking (customer_id, booking_date, status, total_amount)
                VALUES (p_customer_id, SYSTIMESTAMP, 'Confirmed', p_total_amount)
                RETURNING booking_id INTO v_new_id;

                INSERT INTO Booking_Room (booking_id, room_id, check_in_date, check_out_date, guests)
                VALUES (v_new_id, p_room_id, v_check_in, v_check_out, p_guests);

                INSERT INTO Payment (booking_id, amount, payment_date, method, status)
                VALUES (v_new_id, p_total_amount, SYSTIMESTAMP, 'Credit Card', 'COMPLETED');

                -- 5. Commit & Return ID
                COMMIT;
                p_booking_id := v_new_id;

            EXCEPTION
                WHEN OTHERS THEN
                    ROLLBACK;
                    RAISE; -- Propagate error to Node.js
            END;

4. TRIGGER 1: ADD LOYALTY POINTS ON PAYMENT
 Why: Ensures customers get points immediately upon payment completion, regardless of API source.
        const trgLoyalty = `
            CREATE OR REPLACE TRIGGER TRG_ADD_LOYALTY_POINTS
            AFTER INSERT ON Payment
            FOR EACH ROW
            WHEN (new.status = 'COMPLETED')
            DECLARE
                v_customer_id NUMBER;
            BEGIN
                -- Find customer associated with the booking
                SELECT customer_id INTO v_customer_id 
                FROM Booking 
                WHERE booking_id = :new.booking_id;

                -- Add 1 point per $1 spent
                UPDATE Customer
                SET loyalty_points = loyalty_points + :new.amount
                WHERE customer_id = v_customer_id;
            END;
        `;
        await connection.execute(trgLoyalty);
        console.log("Trigger TRG_ADD_LOYALTY_POINTS updated.");

        // 5. TRIGGER 2: UPDATE CUSTOMER TIER BASED ON POINTS
        // Why: Automates business logic. If points > 1000, they become Silver. If > 5000, Gold.
        const trgTier = `
            CREATE OR REPLACE TRIGGER TRG_UPDATE_CUSTOMER_TIER
            BEFORE UPDATE OF loyalty_points ON Customer
            FOR EACH ROW
            BEGIN
                IF :new.loyalty_points >= 5000 THEN
                    :new.loyalty_tier := 'GOLD';
                ELSIF :new.loyalty_points >= 1000 THEN
                    :new.loyalty_tier := 'SILVER';
                ELSE
                    :new.loyalty_tier := 'BRONZE';
                END IF;
            END;
        `;
        await connection.execute(trgTier);
        console.log("Trigger TRG_UPDATE_CUSTOMER_TIER updated.");

        // 6. TRIGGER 3: AUDIT BOOKING STATUS CHANGES
        // Why: Security. Tracks when a booking is cancelled and captures the timestamp.
        const trgAudit = `
            CREATE OR REPLACE TRIGGER TRG_AUDIT_BOOKING
            AFTER UPDATE OF status ON Booking
            FOR EACH ROW
            BEGIN
                IF :old.status != :new.status THEN
                    INSERT INTO Audit_Log (table_name, record_id, action, old_value, new_value)
                    VALUES ('Booking', :old.booking_id, 'STATUS_CHANGE', :old.status, :new.status);
                END IF;
            END;
        `;
        await connection.execute(trgAudit);
        console.log("Trigger TRG_AUDIT_BOOKING updated.");

    } catch (err) {
        console.error("Init DB Error:", err);
    } finally {
        if (connection) await connection.close();
    }
}
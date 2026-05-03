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





             if (msg.includes("ORA-20001")) {
          return res.status(409).json({ message: "Room is unavailable for the selected dates." });
        } else if (msg.includes("ORA-20002")) {
      return res.status(400).json({ message: "Check-in date must be before check-out date." });
          } else if (msg.includes("ORA-20003")) {
      return res.status(400).json({ message: "Selected room capacity cannot accommodate this many guests." });
          } else if (msg.includes("ORA-20004")) {
      return res.status(404).json({ message: "The selected room type is no longer available." });
          
        }
       
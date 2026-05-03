TRIGGER 1: ADD LOYALTY POINTS ON PAYMENT
 Why: Ensures customers get points immediately upon payment completion, regardless of API source.

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

5. TRIGGER 2: UPDATE CUSTOMER TIER BASED ON POINTS
Why: Automates business logic. If points > 1000, they become Silver. If > 5000, Gold.
        
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
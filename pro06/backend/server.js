const express = require("express");
const oracledb = require("oracledb");
const cors = require("cors");
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER || "system",
  password: process.env.DB_PASSWORD || "rawaa29072005",
  connectString: process.env.DB_CONNECTION || "localhost:1521/XE",
};

async function executeQuery(sql, binds = [], options = {}) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    options.outFormat = oracledb.OUT_FORMAT_OBJECT;
    options.autoCommit = true;
    const result = await connection.execute(sql, binds, options);
    return result;
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

// --- DB INITIALIZATION & STORED PROCEDURE & TRIGGERS SETUP ---
async function initDatabase() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        console.log("Initializing Database Objects...");
       
        // 3. Define the Stored Procedure (Existing)
        const procedureSql = `
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
        `;
        await connection.execute(procedureSql);
        console.log("Stored Procedure updated.");

        // 4. TRIGGER 1: ADD LOYALTY POINTS ON PAYMENT
        // Why: Ensures customers get points immediately upon payment completion, regardless of API source.
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

    } catch (err) {
        console.error("Init DB Error:", err);
    } finally {
        if (connection) await connection.close();
    }
}
// Initialize on startup
initDatabase();


// --- AUTHENTICATION ---
app.post('/api/auth/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    
    if (!firstName || !email || !password) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const sql = `
            INSERT INTO Customer (first_name, last_name, email, password_hash, loyalty_tier, loyalty_points, profile_picture_url)
            VALUES (:fn, :ln, :em, :pw, 'BRONZE', 0, 'https://via.placeholder.com/150')
            RETURNING customer_id INTO :id
        `;
        const result = await executeQuery(sql, {
            fn: firstName,
            ln: lastName,
            em: email,
            pw: passwordHash, 
            id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
        });
        
        const newId = result.outBinds.id[0];
        const user = {
            id: newId,
            firstName,
            lastName,
            email,
            role: 'CUSTOMER',
            loyaltyTier: 'BRONZE',
            loyaltyPoints: 0
        };
        res.json({ success: true, user });
    } catch (err) { 
        if (err.message && err.message.includes('ORA-00001')) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }
        console.error("Register Error:", err);
        res.status(500).json({ message: err.message || "Registration failed" }); 
    }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    let user = null;
    let storedHash = null;

    if (role === 'EMPLOYEE') {
      const sql = `SELECT * FROM Employee WHERE email = :email AND is_active = 'Y'`;
      const result = await executeQuery(sql, [email]);
      
      if (result.rows.length > 0) {
          const row = result.rows[0];
          storedHash = row.PASSWORD_HASH;
          
          if (storedHash) {
              const match = await bcrypt.compare(password, storedHash);
              if (match) {
                  user = {
                      id: row.EMPLOYEE_ID,
                      firstName: row.FIRST_NAME,
                      lastName: row.LAST_NAME,
                      email: row.EMAIL,
                      role: 'EMPLOYEE',
                      employeeRole: row.ROLE,
                      department: row.DEPARTMENT
                  };
              }
          }
      }
    } else {
      const sql = `SELECT * FROM Customer WHERE email = :email`;
      const result = await executeQuery(sql, [email]);
      
      if (result.rows.length > 0) {
          const row = result.rows[0];
          storedHash = row.PASSWORD_HASH;

          if (storedHash) {
              const match = await bcrypt.compare(password, storedHash);
              if (match) {
                  user = {
                      id: row.CUSTOMER_ID,
                      firstName: row.FIRST_NAME,
                      lastName: row.LAST_NAME,
                      email: row.EMAIL,
                      role: 'CUSTOMER',
                      loyaltyTier: row.LOYALTY_TIER,
                      loyaltyPoints: row.LOYALTY_POINTS,
                      profilePictureUrl: row.PROFILE_PICTURE_URL
                  };
              }
          }
      }
    }
    
    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) { 
      console.error("Login Error:", err);
      res.status(500).json({ message: 'Internal server error' }); 
  }
});

// --- HOTELS ---
app.get("/api/hotels", async (req, res) => {
  try {
    const result = await executeQuery(`SELECT * FROM Hotel_Details_View`);
    const hotels = result.rows.map((row) => ({
      hotel_id: row.HOTEL_ID,
      name: row.NAME,
      location: row.LOCATION,
      rating: row.STAR_RATING,
      description: row.DESCRIPTION,
      amenities: row.AMENITIES,
      photo_url: row.PHOTO_URL,
      review_count: row.REVIEW_COUNT,
      average_rating: row.AVERAGE_RATING,
      price_per_night: row.AVG_PRICE || 200,
    }));
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/hotels/:id", async (req, res) => {
  try {
    const result = await executeQuery(
      `SELECT * FROM Hotel_Details_View WHERE hotel_id = :id`,
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Hotel not found" });

    const row = result.rows[0];
    const hotel = {
      hotel_id: row.HOTEL_ID,
      name: row.NAME,
      location: row.LOCATION,
      rating: row.STAR_RATING,
      description: row.DESCRIPTION,
      amenities: row.AMENITIES,
      photo_url: row.PHOTO_URL,
      review_count: row.REVIEW_COUNT,
      average_rating: row.AVERAGE_RATING,
      price_per_night: row.AVG_PRICE || 200,
    };
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ROOMS ---
app.get('/api/hotels/:id/rooms', async (req, res) => {
    try {
        const sql = `SELECT * FROM Room WHERE hotel_id = :id`;
        const result = await executeQuery(sql, [req.params.id]);
        res.json(result.rows.map(r => ({
            room_id: r.ROOM_ID,
            hotel_id: r.HOTEL_ID,
            room_number: r.ROOM_NUMBER,
            room_type: r.ROOM_TYPE,
            price_per_night: r.PRICE_PER_NIGHT,
            max_occupancy: r.MAX_OCCUPANCY,
            amenities: r.AMENITIES,
            description: r.DESCRIPTION,
            room_size: r.ROOM_SIZE,
            bed_type: r.BED_TYPE,
            photo_url: r.PHOTO_URL 
        })));
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/hotels/:id/rooms/:type/reviews', async (req, res) => {
    try {
        const sql = `
            SELECT hr.review_id, c.first_name || ' ' || c.last_name as customer_name,
                   hr.rating, hr.review_text, hr.review_date
            FROM Hotel_Reviews hr
            JOIN Customer c ON hr.customer_id = c.customer_id
            WHERE hr.hotel_id = :hid 
            AND UPPER(hr.room_type_reviewed) LIKE '%' || UPPER(:type) || '%'
            FETCH FIRST 5 ROWS ONLY
        `;
        const result = await executeQuery(sql, { hid: req.params.id, type: req.params.type });
        res.json(result.rows.map(r => ({
            review_id: r.REVIEW_ID,
            customer_name: r.CUSTOMER_NAME,
            rating: r.RATING,
            review_text: r.REVIEW_TEXT,
            review_date: r.REVIEW_DATE,
            room_type_reviewed: req.params.type
        })));
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- FLIGHTS ---
app.get("/api/flights", async (req, res) => {
  try {
    const result = await executeQuery(`SELECT * FROM Flight`);
    res.json(
      result.rows.map((r) => ({
        flight_id: r.FLIGHT_ID,
        flight_number: r.FLIGHT_NUMBER,
        airline: r.AIRLINE,
        departure_airport: r.DEPARTURE_AIRPORT,
        arrival_airport: r.ARRIVAL_AIRPORT,
        departure_time: r.DEPARTURE_TIME,
        arrival_time: r.ARRIVAL_TIME,
        price: r.PRICE,
        available_seats: r.AVAILABLE_SEATS,
        duration: "N/A",
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- PACKAGES ---
app.get("/api/packages", async (req, res) => {
  try {
    const result = await executeQuery(
      `SELECT * FROM Package WHERE is_active = 'Y'`
    );
    res.json(
      result.rows.map((p) => ({
        package_id: p.PACKAGE_ID,
        package_name: p.PACKAGE_NAME,
        price: p.PRICE,
        description: p.DESCRIPTION,
        duration_days: p.DURATION_DAYS,
        photo_url: "../../public/images/hotels/hotel_1/lobby_luxury.jpg",
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/packages/:id/details", async (req, res) => {
    try {
        const id = req.params.id;
        
        // Query to join Package with Package_Detail, Flight, and Hotel Info
        const sql = `
            SELECT
                p.package_id, p.package_name, p.price as pkg_price, p.description as pkg_desc, p.duration_days,
                f.flight_id, f.flight_number, f.airline, f.departure_airport, f.arrival_airport, f.departure_time, f.arrival_time, f.price as flt_price,
                h.hotel_id, h.name as hotel_name, h.location, h.star_rating, h.description as hotel_desc, h.amenities, hp.photo_url as hotel_photo, h.avg_price, h.review_count, h.average_rating
            FROM Package p
            LEFT JOIN Package_Detail pd ON p.package_id = pd.package_id
            LEFT JOIN Flight f ON pd.flight_id = f.flight_id
            LEFT JOIN Room r ON pd.room_id = r.room_id
            LEFT JOIN Hotel_Details_View h ON r.hotel_id = h.hotel_id
            LEFT JOIN Hotel_Photos hp on r.hotel_id = hp.hotel_id
            WHERE p.package_id = :id
            FETCH FIRST 1 ROWS ONLY
        `;

        const result = await executeQuery(sql, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Package not found" });
        }

        const row = result.rows[0];

        // Construct Response Object
        const response = {
            package: {
                package_id: row.PACKAGE_ID,
                package_name: row.PACKAGE_NAME,
                price: row.PKG_PRICE,
                description: row.PKG_DESC,
                duration_days: row.DURATION_DAYS,
                photo_url: "../../public/images/hotels/hotel_1/lobby_luxury.jpg"
            },
            hotel: row.HOTEL_ID ? {
                hotel_id: row.HOTEL_ID,
                name: row.HOTEL_NAME,
                location: row.LOCATION,
                rating: row.STAR_RATING,
                description: row.HOTEL_DESC,
                amenities: row.AMENITIES,
                photo_url: row.HOTEL_PHOTO,
                review_count: row.REVIEW_COUNT,
                average_rating: row.AVERAGE_RATING,
                price_per_night: row.AVG_PRICE
            } : null,
            flight: row.FLIGHT_ID ? {
                flight_id: row.FLIGHT_ID,
                flight_number: row.FLIGHT_NUMBER,
                airline: row.AIRLINE,
                departure_airport: row.DEPARTURE_AIRPORT,
                arrival_airport: row.ARRIVAL_AIRPORT,
                departure_time: row.DEPARTURE_TIME,
                arrival_time: row.ARRIVAL_TIME,
                price: row.FLT_PRICE,
                duration: "N/A"
            } : null
        };

        res.json(response);

    } catch (err) {
        console.error("Package Details Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// --- REVIEWS ---
app.get('/api/hotels/:id/reviews', async (req, res) => {
    try {
        const sql = `
            SELECT hr.review_id, c.first_name || ' ' || c.last_name as customer_name,
                   hr.rating, hr.review_text, hr.review_date, hr.room_type_reviewed
            FROM Hotel_Reviews hr
            JOIN Customer c ON hr.customer_id = c.customer_id
            WHERE hr.hotel_id = :id
            ORDER BY hr.review_date DESC
            FETCH FIRST 20 ROWS ONLY
        `;
        const result = await executeQuery(sql, [req.params.id]);
        res.json(result.rows.map(r => ({
            review_id: r.REVIEW_ID,
            customer_name: r.CUSTOMER_NAME,
            rating: r.RATING,
            review_text: r.REVIEW_TEXT,
            review_date: r.REVIEW_DATE,
            room_type_reviewed: r.ROOM_TYPE_REVIEWED
        })));
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/reviews', async (req, res) => {
    const { hotel_id, customer_id, rating, review_text, room_type_reviewed } = req.body;
    try {
        const sql = `
            INSERT INTO Hotel_Reviews (hotel_id, customer_id, rating, review_text, room_type_reviewed, review_date, is_public)
            VALUES (:hid, :cid, :rat, :txt, :rt, SYSTIMESTAMP, 'Y')
        `;
        await executeQuery(sql, {
            hid: hotel_id,
            cid: customer_id,
            rat: rating,
            txt: review_text,
            rt: room_type_reviewed || 'General'
        });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- BOOKINGS ---
app.get("/api/bookings", async (req, res) => {
  try {
    const sql = `
        SELECT b.booking_id, c.customer_id, c.first_name || ' ' || c.last_name as customer_name,
               h.name as hotel_name, b.booking_date, b.status, b.total_amount,
               br.check_in_date as check_in, br.check_out_date as check_out, br.guests
        FROM Booking b
        JOIN Customer c ON b.customer_id = c.customer_id
        LEFT JOIN Booking_Room br ON b.booking_id = br.booking_id
        LEFT JOIN Room r ON br.room_id = r.room_id
        LEFT JOIN Hotel h ON r.hotel_id = h.hotel_id
        ORDER BY b.booking_date DESC
    `;
    const result = await executeQuery(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/bookings/flights/:id", async (req, res) => {
  try {
    const sql = `
        SELECT b.booking_id, b.status, b.total_amount, 
               f.flight_number, f.airline, f.departure_airport, f.arrival_airport,
               f.departure_time, f.arrival_time, bf.seat_class, bf.passengers
        FROM Booking b
        JOIN Booking_Flight bf ON b.booking_id = bf.booking_id
        JOIN Flight f ON bf.flight_id = f.flight_id
        WHERE b.customer_id = :id
        ORDER BY f.departure_time DESC
    `;
    const result = await executeQuery(sql, [req.params.id]);
    res.json(
      result.rows.map((r) => ({
        booking_id: r.BOOKING_ID,
        status: r.STATUS,
        total_amount: r.TOTAL_AMOUNT,
        flight_number: r.FLIGHT_NUMBER,
        airline: r.AIRLINE,
        departure_airport: r.DEPARTURE_AIRPORT,
        arrival_airport: r.ARRIVAL_AIRPORT,
        departure_time: r.DEPARTURE_TIME,
        arrival_time: r.ARRIVAL_TIME,
        seat_class: r.SEAT_CLASS,
        passengers: r.PASSENGERS,
      }))
    );
    // Map uppercase Oracle keys to lowercase for frontend consistency
    const bookings = result.rows.map(row => ({
        booking_id: row.BOOKING_ID,
        customer_id: row.CUSTOMER_ID,
        customer_name: row.CUSTOMER_NAME,
        hotel_name: row.HOTEL_NAME,
        booking_date: row.BOOKING_DATE,
        status: row.STATUS,
        total_amount: row.TOTAL_AMOUNT,
        check_in: row.CHECK_IN,
        check_out: row.CHECK_OUT,
        guests: row.GUESTS
    }));

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- MAIN BOOKING ENDPOINT (Uses PL/SQL Procedure with Exception Handling) ---
app.post("/api/bookings", async (req, res) => {
    const { customer_id, hotel_id, room_id, check_in, check_out, guests, total_amount } = req.body;
    
    try {
        let finalRoomId = room_id;

        // If no room_id was provided, find a default room
        if (!finalRoomId) {
            const roomSql = `SELECT room_id FROM Room WHERE hotel_id = :hid FETCH FIRST 1 ROWS ONLY`;
            const roomResult = await executeQuery(roomSql, [hotel_id]);
            if (roomResult.rows.length > 0) {
                finalRoomId = roomResult.rows[0].ROOM_ID;
            } else {
                return res.status(404).json({ success: false, message: "No rooms available for this hotel." });
            }
        }

        const sql = `
            BEGIN
                CREATE_BOOKING_SAFE(
                    p_customer_id => :cid,
                    p_hotel_id    => :hid,
                    p_room_id     => :rid,
                    p_check_in    => :cin,
                    p_check_out   => :cout,
                    p_guests      => :g,
                    p_total_amount=> :amt,
                    p_booking_id  => :bid
                );
            END;
        `;
        
        const result = await executeQuery(sql, {
            cid: customer_id,
            hid: hotel_id,
            rid: finalRoomId,
            cin: check_in,
            cout: check_out,
            g: guests,
            amt: total_amount,
            bid: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT } 
        });
        
        // Handle outBind array from driver
        const bookingId = result.outBinds.bid; // Often just the value, or array [val] depending on driver version
        
        res.json({ success: true, bookingId });

    } catch (err) { 
        // Catch PL/SQL Application Errors (ORA-20xxx)
        const msg = err.message || "";
        
        if (msg.includes("ORA-20001")) {
          return res.status(409).json({ message: "Room is unavailable for the selected dates." });
        } else if (msg.includes("ORA-20002")) {
      return res.status(400).json({ message: "Check-in date must be before check-out date." });
          } else if (msg.includes("ORA-20003")) {
      return res.status(400).json({ message: "Selected room capacity cannot accommodate this many guests." });
          } else if (msg.includes("ORA-20004")) {
      return res.status(404).json({ message: "The selected room type is no longer available." });
          
        }
        
        console.error("Booking Error:", err);
        res.status(500).json({ message: "An unexpected error occurred during booking.", details: msg }); 
    }
});

app.post("/api/bookings/flight", async (req, res) => {
  const { customer_id, flight_id, seat_class, passengers, total_amount } = req.body;
  try {
    const bookingSql = `
            INSERT INTO Booking (customer_id, booking_date, status, total_amount)
            VALUES (:id, SYSTIMESTAMP, 'Confirmed', :amt)
            RETURNING booking_id INTO :bid
        `;
    const bookingResult = await executeQuery(bookingSql, {
      id: customer_id,
      amt: total_amount,
      bid: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT },
    });
    const bookingId = bookingResult.outBinds.bid[0];

    const flightSql = `
            INSERT INTO Booking_Flight (booking_id, flight_id, seat_class, passengers)
            VALUES (:bid, :fid, :cls, :pax)
        `;
    await executeQuery(flightSql, {
      bid: bookingId,
      fid: flight_id,
      cls: seat_class,
      pax: passengers,
    });

    const updateFlightSql = `UPDATE Flight SET available_seats = available_seats - :pax WHERE flight_id = :fid`;
    await executeQuery(updateFlightSql, { pax: passengers, fid: flight_id });

    const paySql = `
            INSERT INTO Payment (booking_id, amount, payment_date, method, status)
            VALUES (:bid, :amt, SYSTIMESTAMP, 'Credit Card', 'COMPLETED')
        `;
    await executeQuery(paySql, { bid: bookingId, amt: total_amount });

    res.json({ success: true, bookingId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/bookings/:id", async (req, res) => {
  const { status, checkIn, checkOut } = req.body;
  try {
    const sql = `UPDATE Booking SET status = :status WHERE booking_id = :id`;
    await executeQuery(sql, { status: status, id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- CUSTOMERS & EMPLOYEES ---
app.get("/api/customers", async (req, res) => {
  try {
    const result = await executeQuery(`SELECT * FROM Customer`);
    res.json(
      result.rows.map((c) => ({
        id: c.CUSTOMER_ID,
        firstName: c.FIRST_NAME,
        lastName: c.LAST_NAME,
        email: c.EMAIL,
        loyaltyTier: c.LOYALTY_TIER,
        loyaltyPoints: c.LOYALTY_POINTS,
        profilePictureUrl: c.PROFILE_PICTURE_URL,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/customers/:id/dashboard", async (req, res) => {
  try {
    const summary = await executeQuery(
      `SELECT * FROM Customer_Booking_Summary WHERE customer_id = :id`,
      [req.params.id]
    );
    const bookingsSql = `
             SELECT b.booking_id, h.name as hotel_name, b.booking_date, b.status, b.total_amount,
               br.check_in_date as check_in, br.check_out_date as check_out, br.guests,
               r.room_type, r.photo_url
            FROM Booking b
            LEFT JOIN Booking_Room br ON b.booking_id = br.booking_id
            LEFT JOIN Room r ON br.room_id = r.room_id
            LEFT JOIN Hotel h ON r.hotel_id = h.hotel_id
            WHERE b.customer_id = :id
            ORDER BY b.booking_date DESC
        `;
    const bookings = await executeQuery(bookingsSql, [req.params.id]);
    
    const mappedBookings = bookings.rows.map(row => ({
        booking_id: row.BOOKING_ID,
        hotel_name: row.HOTEL_NAME,
        booking_date: row.BOOKING_DATE,
        status: row.STATUS,
        total_amount: row.TOTAL_AMOUNT,
        check_in: row.CHECK_IN,
        check_out: row.CHECK_OUT,
        guests: row.GUESTS,
        room_type: row.ROOM_TYPE,
        photo_url: row.PHOTO_URL
    }));

    res.json({
      summary: summary.rows[0] || {},
      bookings: mappedBookings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- EMPLOYEES ---
app.get('/api/employees', async (req, res) => {
    try {
        const result = await executeQuery(`SELECT * FROM Employee WHERE is_active = 'Y' ORDER BY employee_id`);
        res.json(result.rows.map(e => ({
            id: e.EMPLOYEE_ID,
            firstName: e.FIRST_NAME,
            lastName: e.LAST_NAME,
            email: e.EMAIL,
            role: 'EMPLOYEE',
            employeeRole: e.ROLE,
            department: e.DEPARTMENT,
            hireDate: e.HIRE_DATE,
            salary: e.SALARY
        })));
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/employees', async (req, res) => {
    const { firstName, lastName, email, role, department } = req.body;
    try {
        const sql = `
            INSERT INTO Employee (first_name, last_name, email, password_hash, role, department, hire_date, is_active)
            VALUES (:fn, :ln, :em, 'default_hash', :role, :dept, SYSDATE, 'Y')
        `;
        await executeQuery(sql, { fn: firstName, ln: lastName, em: email, role, dept: department });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/employees/:id', async (req, res) => {
    const { role } = req.body;
    try {
        const sql = `UPDATE Employee SET role = :role WHERE employee_id = :id`;
        await executeQuery(sql, [role, req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.delete('/api/employees/:id', async (req, res) => {
    try {
        const sql = `UPDATE Employee SET is_active = 'N' WHERE employee_id = :id`;
        await executeQuery(sql, [req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- SALARY ADJUSTMENT ---
app.post('/api/employees/preview-raise', async (req, res) => {
    const { rate, date } = req.body;
    try {
        const sql = `
            SELECT employee_id, first_name, last_name, salary as old_salary,
                   hire_date,
                   salary * (1 + :rate / 100) as new_salary
            FROM Employee 
            WHERE hire_date < TO_DATE(:dt, 'YYYY-MM-DD')
            AND is_active = 'Y'
        `;
        const result = await executeQuery(sql, { rate: rate, dt: date });
        res.json(result.rows.map(r => ({
            id: r.EMPLOYEE_ID,
            name: `${r.FIRST_NAME} ${r.LAST_NAME}`,
            hireDate: r.HIRE_DATE,
            oldSalary: r.OLD_SALARY,
            newSalary: Math.round(r.NEW_SALARY * 100) / 100
        })));
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.post('/api/employees/apply-raise', async (req, res) => {
    const { rate, date } = req.body;
    try {
        const sql = `
            BEGIN
                ADJUST_SALARY(
                    e_hireDate          => TO_DATE(:dt, 'YYYY-MM-DD'),
                    p_inflation_rate    => :rate,
                    p_employees_updated => :updated,
                    p_total_increase    => :increase
                );
            END;
        `;
        const binds = {
            dt: date,
            rate: rate,
            updated: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
            increase: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        };
        const result = await executeQuery(sql, binds);
        
        res.json({ 
            success: true, 
            updatedCount: result.outBinds.updated, 
            totalIncrease: result.outBinds.increase 
        });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// --- INQUIRIES & WISHLIST ---
app.get("/api/inquiries", async (req, res) => {
  try {
    const sql = `
        SELECT n.notification_id, n.customer_id, n.title, n.message, n.notification_data, 
               n.is_read, n.created_date,
               c.first_name || ' ' || c.last_name as customer_name
        FROM Notifications n
        JOIN Customer c ON n.customer_id = c.customer_id
        WHERE n.notification_type = 'INQUIRY'
        ORDER BY n.created_date DESC
    `;
    const result = await executeQuery(sql);
    
    const inquiries = result.rows.map(row => {
        let details = {};
        try {
            details = row.NOTIFICATION_DATA ? JSON.parse(row.NOTIFICATION_DATA) : {};
        } catch (e) {
            console.error("Failed to parse notification_data", e);
        }

        return {
            id: row.NOTIFICATION_ID,
            customer_id: row.CUSTOMER_ID,
            customer_name: row.CUSTOMER_NAME,
            destination: details.destination || row.TITLE,
            dates: details.dates || 'Flexible',
            budget: details.budget || 'Not Specified',
            travelers: details.travelers || 1,
            notes: row.MESSAGE,
            status: row.IS_READ === 'Y' ? 'Resolved' : 'New',
            created_at: row.CREATED_DATE
        };
    });

    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/inquiries", async (req, res) => {
  const { customer_id, destination, notes, dates, budget, travelers } = req.body;
  
  try {
    // Construct rich data object
    const notificationData = JSON.stringify({
        destination,
        dates,
        budget,
        travelers
    });

    const title = `Trip Inquiry: ${destination}`;

    const sql = `
        INSERT INTO Notifications (
            customer_id, notification_type, title, message, notification_data, is_read, created_date
        ) VALUES (
            :cid, 'INQUIRY', :title, :msg, :data, 'N', SYSTIMESTAMP
        )
    `;
    
    await executeQuery(sql, { 
        cid: customer_id, 
        title: title,
        msg: notes,
        data: notificationData
    });
    
    res.json({ success: true });
  } catch (err) {
    console.error("Inquiry Error:", err);
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/inquiries/:id", async (req, res) => {
    // Used to mark as resolved (is_read = 'Y')
    const { status } = req.body;
    try {
        const isRead = status === 'Resolved' ? 'Y' : 'N';
        const sql = `UPDATE Notifications SET is_read = :is_read WHERE notification_id = :id`;
        await executeQuery(sql, { is_read: isRead, id: req.params.id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post("/api/wishlist", async (req, res) => {
  const { customer_id, hotel_id } = req.body;
  try {
    const sql = `INSERT INTO Wishlist (customer_id, hotel_id) VALUES (:cid, :hid)`;
    await executeQuery(sql, [customer_id, hotel_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/wishlist", async (req, res) => {
  const { customer_id, hotel_id } = req.body;
  try {
    const sql = `DELETE FROM Wishlist WHERE customer_id = :cid AND hotel_id = :hid`;
    await executeQuery(sql, [customer_id, hotel_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ADMIN & ANALYTICS ---
app.get("/api/finance/transactions", async (req, res) => {
  try {
    const sql = `
            SELECT p.payment_id, p.payment_date, p.amount, p.method, p.status, 
                   b.booking_id,
                   c.first_name || ' ' || c.last_name as customer_name,
                   c.email,
                   h.name as hotel_name,
                   r.room_type
            FROM Payment p 
            JOIN Booking b ON p.booking_id = b.booking_id
            JOIN Customer c ON b.customer_id = c.customer_id
            LEFT JOIN Booking_Room br ON b.booking_id = br.booking_id
            LEFT JOIN Room r ON br.room_id = r.room_id
            LEFT JOIN Hotel h ON r.hotel_id = h.hotel_id
            ORDER BY p.payment_date DESC
        `;
    const result = await executeQuery(sql);
    res.json(
      result.rows.map((r) => ({
        id: r.PAYMENT_ID,
        date: r.PAYMENT_DATE,
        amount: r.AMOUNT,
        method: r.METHOD,
        status: r.STATUS,
        customerName: r.CUSTOMER_NAME,
        customerEmail: r.EMAIL,
        hotelName: r.HOTEL_NAME || 'Flight/Package',
        roomType: r.ROOM_TYPE,
        bookingId: r.BOOKING_ID
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/analytics", async (req, res) => {
  try {
    // 1. Monthly Revenue & Bookings
    const monthly = await executeQuery(`SELECT * FROM Monthly_Revenue_Trend FETCH FIRST 6 ROWS ONLY`);
    
    // 2. Hotel Performance
    const hotelPerf = await executeQuery(`SELECT * FROM Hotel_Performance_Comparison FETCH FIRST 5 ROWS ONLY`);
    
    // 3. KPI: Total Revenue
    const revenueRes = await executeQuery(`SELECT NVL(SUM(total_amount), 0) as TOTAL FROM Booking WHERE status != 'Cancelled'`);
    const totalRevenue = revenueRes.rows[0].TOTAL;

    // 4. KPI: Total Bookings
    const bookingRes = await executeQuery(`SELECT COUNT(*) as TOTAL FROM Booking`);
    const totalBookings = bookingRes.rows[0].TOTAL;

    // 5. KPI: Active Users
    const userRes = await executeQuery(`SELECT COUNT(*) as TOTAL FROM Customer`);
    const activeUsers = userRes.rows[0].TOTAL;

    // 6. KPI: Top Destination (Hotel Name with most bookings)
    const topDestRes = await executeQuery(`
        SELECT h.name as NAME
        FROM Hotel h
        JOIN Room r ON h.hotel_id = r.hotel_id
        JOIN Booking_Room br ON r.room_id = br.room_id
        GROUP BY h.name
        ORDER BY COUNT(br.booking_id) DESC
        FETCH FIRST 1 ROWS ONLY
    `);
    const topDest = topDestRes.rows.length > 0 ? topDestRes.rows[0].NAME : 'N/A';

    res.json({
      monthlyData: monthly.rows.map((r) => ({
        name: r.PAYMENT_MONTH,
        sales: r.TOTAL_REVENUE,
        visitors: r.TOTAL_BOOKINGS * 2,
      })),
      hotelTypeData: hotelPerf.rows.map((r) => ({
        name: r.HOTEL_NAME,
        value: r.TOTAL_BOOKINGS,
      })),
      kpi: {
        revenue: totalRevenue,
        bookings: totalBookings,
        users: activeUsers,
        topDestination: topDest
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
app.get("/api/employee/dashboard", async (req, res) => {
  try {
    const bookings = await executeQuery(
      `SELECT * FROM Booking_Timeline FETCH FIRST 20 ROWS ONLY`
    );
    const revenue = await executeQuery(`SELECT * FROM Monthly_Revenue_Trend`);
    res.json({
      recentBookings: bookings.rows,
      revenueStats: revenue.rows,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Odyssey OracleDB Backend running on port ${PORT}`);
});


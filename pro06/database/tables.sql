---- Drop existing tables
DROP TABLE Hotel_Photos CASCADE CONSTRAINT;
DROP TABLE Review_Helpful_Votes CASCADE CONSTRAINT;
DROP TABLE Hotel_Reviews CASCADE CONSTRAINT;
DROP TABLE Hotel_Amenities CASCADE CONSTRAINT;
DROP TABLE Customer_Preferences CASCADE CONSTRAINT;
DROP TABLE Search_History CASCADE CONSTRAINT;
DROP TABLE Notifications CASCADE CONSTRAINT;
DROP TABLE Wishlist CASCADE CONSTRAINT;
DROP TABLE Favorites CASCADE CONSTRAINT;
DROP TABLE Visited_Places CASCADE CONSTRAINT;
DROP TABLE Package_Detail CASCADE CONSTRAINT;
DROP TABLE Booking_Flight CASCADE CONSTRAINT;
DROP TABLE Booking_Room CASCADE CONSTRAINT;
DROP TABLE Payment CASCADE CONSTRAINT;
DROP TABLE Booking CASCADE CONSTRAINT;
DROP TABLE Package CASCADE CONSTRAINT;
DROP TABLE Flight CASCADE CONSTRAINT;
DROP TABLE Room CASCADE CONSTRAINT;
DROP TABLE Hotel CASCADE CONSTRAINT;
DROP TABLE Employee CASCADE CONSTRAINT;
DROP TABLE Customer CASCADE CONSTRAINT;

---- ============================================
---- CREATE ALL TABLES
---- ============================================
--
---- Customer table with enhanced columns
CREATE TABLE Customer (
    customer_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    first_name VARCHAR2(255) NOT NULL,
    last_name VARCHAR2(255) NOT NULL,
    email VARCHAR2(255) UNIQUE NOT NULL,
    phone_number VARCHAR2(20),
    address VARCHAR2(255),
    password_hash VARCHAR2(255),
    created_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    last_login TIMESTAMP,
    is_active VARCHAR2(1) DEFAULT 'Y',
    email_verified VARCHAR2(1) DEFAULT 'N',
    phone_verified VARCHAR2(1) DEFAULT 'N',
    date_of_birth DATE,
    nationality VARCHAR2(100),
    passport_number VARCHAR2(50),
    loyalty_points INT DEFAULT 0,
    loyalty_tier VARCHAR2(20) DEFAULT 'BRONZE',
    preferences VARCHAR2(1000),
    newsletter_subscribed VARCHAR2(1) DEFAULT 'Y',
    profile_picture_url VARCHAR2(500),
    CONSTRAINT chk_loyalty_points CHECK (loyalty_points >= 0),
    CONSTRAINT chk_email_format CHECK (REGEXP_LIKE(email, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'))
);

---- Employee table with enhanced security
CREATE TABLE Employee (
    employee_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR2(255) UNIQUE NOT NULL,
    password_hash VARCHAR2(255) NOT NULL,
    role VARCHAR2(50) NOT NULL,
    department VARCHAR2(100),
    hire_date DATE,
    salary NUMBER(10,2),
    is_active VARCHAR2(1) DEFAULT 'Y',
    last_login TIMESTAMP,
    created_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT chk_employee_email CHECK (REGEXP_LIKE(email, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'))
);

---- Hotel table with enhanced columns
CREATE TABLE Hotel (
    hotel_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    photo_count INT DEFAULT 0,
    review_count INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    amenities VARCHAR2(1000),
    description VARCHAR2(4000),
    website_url VARCHAR2(500),
    phone_number VARCHAR2(20),
    email_address VARCHAR2(255),
    check_in_time VARCHAR2(10) DEFAULT '15:00',
    check_out_time VARCHAR2(10) DEFAULT '11:00',
    cancellation_policy VARCHAR2(1000),
    pet_friendly VARCHAR2(1) DEFAULT 'N',
    parking_available VARCHAR2(1) DEFAULT 'Y',
    wifi_available VARCHAR2(1) DEFAULT 'Y',
    breakfast_included VARCHAR2(1) DEFAULT 'N',
    gym_available VARCHAR2(1) DEFAULT 'N',
    spa_available VARCHAR2(1) DEFAULT 'N',
    pool_available VARCHAR2(1) DEFAULT 'N',
    restaurant_available VARCHAR2(1) DEFAULT 'N',
    CONSTRAINT chk_hotel_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT chk_avg_rating CHECK (average_rating BETWEEN 0.00 AND 5.00)
);

---- Room table with enhanced columns
CREATE TABLE Room (
    room_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    hotel_id INT,
    room_number VARCHAR(20) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    max_occupancy INT DEFAULT 2,
    amenities VARCHAR2(1000),
    description VARCHAR2(1000),
    room_size VARCHAR2(50),
    bed_type VARCHAR2(50),
    photo_url VARCHAR2(500),
    smoking_allowed VARCHAR2(1) DEFAULT 'N',
    minibar_available VARCHAR2(1) DEFAULT 'N',
    balcony_available VARCHAR2(1) DEFAULT 'N',
    sea_view VARCHAR2(1) DEFAULT 'N',
    city_view VARCHAR2(1) DEFAULT 'N',
    mountain_view VARCHAR2(1) DEFAULT 'N',
    air_conditioning VARCHAR2(1) DEFAULT 'Y',
    heating VARCHAR2(1) DEFAULT 'Y',
    tv_available VARCHAR2(1) DEFAULT 'Y',
    work_desk VARCHAR2(1) DEFAULT 'Y',
    coffee_tea_facilities VARCHAR2(1) DEFAULT 'N',
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id) ON DELETE CASCADE,
    CONSTRAINT chk_room_occupancy CHECK (max_occupancy > 0)
);

---- Flight table
CREATE TABLE Flight (
    flight_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    flight_number VARCHAR2(20) NOT NULL,
    departure_airport VARCHAR2(50) NOT NULL,
    arrival_airport VARCHAR2(50) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    price NUMBER(10, 2) NOT NULL,
    airline VARCHAR2(100),
    capacity INT,
    available_seats INT
);

---- Package table
CREATE TABLE Package (
    package_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    package_name VARCHAR2(255) NOT NULL,
    price NUMBER(10, 2) NOT NULL,
    description VARCHAR2(4000),
    duration_days INT,
    is_active VARCHAR2(1) DEFAULT 'Y',
    created_date TIMESTAMP DEFAULT SYSTIMESTAMP
);

---- Booking table
CREATE TABLE Booking (
    booking_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    customer_id INT,
    employee_id INT,
    booking_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_amount NUMBER(10,2),
    notes VARCHAR2(1000),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

---- Payment table
CREATE TABLE Payment (
    payment_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    booking_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR2(100),
    status VARCHAR2(50) DEFAULT 'COMPLETED',
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);

---- Booking_Flight junction table
CREATE TABLE Booking_Flight (
    booking_id INT,
    flight_id INT,
    passengers INT DEFAULT 1,
    seat_class VARCHAR2(20),
    PRIMARY KEY (booking_id, flight_id),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id) ON DELETE CASCADE
);

---- Booking_Room junction table
CREATE TABLE Booking_Room (
    booking_id INT,
    room_id INT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests INT DEFAULT 1,
    special_requests VARCHAR2(500),
    PRIMARY KEY (booking_id, room_id),
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES Room(room_id) ON DELETE CASCADE
);

---- Package_Detail junction table with booking_id
CREATE TABLE Package_Detail (
    package_id INT,
    flight_id INT,
    room_id INT,
    booking_id INT,
    PRIMARY KEY (package_id, flight_id, room_id),
    FOREIGN KEY (package_id) REFERENCES Package(package_id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES Flight(flight_id) ON DELETE SET NULL,
    FOREIGN KEY (room_id) REFERENCES Room(room_id) ON DELETE SET NULL,
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id)
);

---- Hotel_Photos table
CREATE TABLE Hotel_Photos (
    photo_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    hotel_id INT NOT NULL,
    photo_url VARCHAR2(500) NOT NULL,
    photo_description VARCHAR2(255),
    is_primary VARCHAR2(1) DEFAULT 'N',
    photo_type VARCHAR2(50) DEFAULT 'GENERAL',
    upload_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    uploaded_by VARCHAR2(100),
    file_size INT,
    width INT,
    height INT,
    alt_text VARCHAR2(255),
    display_order INT DEFAULT 0,
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id) ON DELETE CASCADE
);

---- Wishlist table
CREATE TABLE Wishlist (
    wishlist_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    customer_id INT NOT NULL,
    hotel_id INT,
    package_id INT,
    wishlist_name VARCHAR2(100) DEFAULT 'My Wishlist',
    notes VARCHAR2(500),
    target_date DATE,
    budget_range VARCHAR2(50),
    created_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    is_public VARCHAR2(1) DEFAULT 'N',
    share_token VARCHAR2(100),
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES Package(package_id) ON DELETE CASCADE
);



---- Hotel_Reviews table
CREATE TABLE Hotel_Reviews (
    review_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    hotel_id INT NOT NULL,
    customer_id INT NOT NULL,
    booking_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text VARCHAR2(2000),
    review_title VARCHAR2(200),
    review_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    helpful_count INT DEFAULT 0,
    not_helpful_count INT DEFAULT 0,
    verified_stay VARCHAR2(1) DEFAULT 'N',
    stay_date_from DATE,
    stay_date_to DATE,
    room_type_reviewed VARCHAR2(50),
    travel_type VARCHAR2(50),
    response_text VARCHAR2(2000),
    response_date TIMESTAMP,
    responded_by VARCHAR2(100),
    is_public VARCHAR2(1) DEFAULT 'Y',
    report_count INT DEFAULT 0,
    edited_date TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES Booking(booking_id) ON DELETE SET NULL
);

---- Review_Helpful_Votes table
CREATE TABLE Review_Helpful_Votes (
    vote_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    review_id INT NOT NULL,
    customer_id INT NOT NULL,
    vote_type VARCHAR2(10) CHECK (vote_type IN ('HELPFUL', 'NOT_HELPFUL')),
    vote_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES Hotel_Reviews(review_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE,
    UNIQUE(review_id, customer_id)
);

---- Hotel_Amenities table
CREATE TABLE Hotel_Amenities (
    amenity_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    hotel_id INT NOT NULL,
    amenity_type VARCHAR2(50) NOT NULL,
    amenity_name VARCHAR2(100) NOT NULL,
    description VARCHAR2(500),
    is_free VARCHAR2(1) DEFAULT 'Y',
    price_info VARCHAR2(100),
    available_24_7 VARCHAR2(1) DEFAULT 'N',
    seasonal_availability VARCHAR2(1) DEFAULT 'N',
    created_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES Hotel(hotel_id) ON DELETE CASCADE
);

---- Customer_Preferences table
CREATE TABLE Customer_Preferences (
    preference_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    customer_id INT NOT NULL,
    preference_type VARCHAR2(50) NOT NULL,
    preference_value VARCHAR2(255) NOT NULL,
    priority INT DEFAULT 1,
    created_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    updated_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
);

---- Notifications table
CREATE TABLE Notifications (
    notification_id INT GENERATED AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    customer_id INT,
    notification_type VARCHAR2(50) NOT NULL,
    title VARCHAR2(200) NOT NULL,
    message VARCHAR2(1000) NOT NULL,
    notification_data VARCHAR2(2000),
    is_read VARCHAR2(1) DEFAULT 'N',
    email_sent VARCHAR2(1) DEFAULT 'N',
    created_date TIMESTAMP DEFAULT SYSTIMESTAMP,
    read_date TIMESTAMP,
    expires_date TIMESTAMP,
    action_url VARCHAR2(500),
    priority INT DEFAULT 1,
    FOREIGN KEY (customer_id) REFERENCES Customer(customer_id) ON DELETE CASCADE
);

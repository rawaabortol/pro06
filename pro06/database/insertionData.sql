---- ============================================
---- INSERT SAMPLE DATA - CUSTOMERS (Row by Row)
---- ============================================

INSERT INTO Customer (first_name, last_name, email, phone_number, address, password_hash, loyalty_points, loyalty_tier) VALUES ('John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St, Anytown', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 1500, 'SILVER');
INSERT INTO Customer (first_name, last_name, email, phone_number, address, password_hash, loyalty_points, loyalty_tier) VALUES ('Jane', 'Smith', 'jane.smith@example.com', '123-456-7891', '456 Oak Ave, Anycity', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 800, 'BRONZE');
INSERT INTO Customer (first_name, last_name, email, phone_number, address, password_hash, loyalty_points, loyalty_tier) VALUES ('Peter', 'Jones', 'peter.jones@example.com', '123-456-7892', '789 Pine Rd, Anytown', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 2000, 'GOLD');
INSERT INTO Customer (first_name, last_name, email, phone_number, address, password_hash, loyalty_points, loyalty_tier) VALUES ('Mary', 'Williams', 'mary.williams@example.com', '123-456-7893', '101 Maple Ln, Anycity', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 500, 'BRONZE');
INSERT INTO Customer (first_name, last_name, email, phone_number, address, password_hash, loyalty_points, loyalty_tier) VALUES ('Robert', 'Brown', 'robert.brown@example.com', '123-456-7894', '202 Birch Blvd, Anytown', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 3000, 'GOLD');
INSERT INTO Customer (first_name, last_name, email, phone_number, address, password_hash, loyalty_points, loyalty_tier) VALUES ('Jennifer', 'Davis', 'jennifer.davis@example.com', '123-456-7895', '303 Cedar Dr, Anycity', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 1200, 'SILVER');
INSERT INTO Customer (first_name, last_name, email, phone_number, address, password_hash, loyalty_points, loyalty_tier) VALUES ('William', 'Miller', 'william.miller@example.com', '123-456-7896', '404 Elm St, Anytown', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 700, 'BRONZE');
INSERT INTO Customer (first_name, last_name, email, phone_number, address, password_hash, loyalty_points, loyalty_tier) VALUES ('Patricia', 'Wilson', 'patricia.wilson@example.com', '123-456-7897', '505 Aspen Rd, Anycity', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 2500, 'GOLD');
INSERT INTO Customer (first_name, last_name, email, phone_number, address, password_hash, loyalty_points, loyalty_tier) VALUES ('Charles', 'Moore', 'charles.moore@example.com', '123-456-7898', '606 Spruce Ave, Anytown', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 900, 'BRONZE');
INSERT INTO Customer (first_name, last_name, email, phone_number, address, password_hash, loyalty_points, loyalty_tier) VALUES ('Linda', 'Taylor', 'linda.taylor@example.com', '123-456-7899', '707 Cypress Ln, Anycity', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 1800, 'SILVER');

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - EMPLOYEES (Row by Row)
---- ============================================

INSERT INTO Employee (first_name, last_name, email, password_hash, role, department, hire_date, salary) VALUES ('Michael', 'Alpha', 'michael.alpha@travelagency.com', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 'Travel Agent', 'Sales', TO_DATE('2020-01-15', 'YYYY-MM-DD'), 45000);
INSERT INTO Employee (first_name, last_name, email, password_hash, role, department, hire_date, salary) VALUES ('Sarah', 'Beta', 'sarah.beta@travelagency.com', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 'Senior Travel Agent', 'Sales', TO_DATE('2021-03-20', 'YYYY-MM-DD'), 52000);
INSERT INTO Employee (first_name, last_name, email, password_hash, role, department, hire_date, salary) VALUES ('David', 'Charlie', 'david.charlie@travelagency.com', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 'Sales Manager', 'Management', TO_DATE('2019-07-01', 'YYYY-MM-DD'), 75000);
INSERT INTO Employee (first_name, last_name, email, password_hash, role, department, hire_date, salary) VALUES ('Emily', 'Delta', 'emily.delta@travelagency.com', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 'Travel Consultant', 'Customer Service', TO_DATE('2022-05-10', 'YYYY-MM-DD'), 42000);
INSERT INTO Employee (first_name, last_name, email, password_hash, role, department, hire_date, salary) VALUES ('James', 'Eve', 'james.eve@travelagency.com', '$2a$12$zRBcEioth8c.uOrM5WIXke5hvDoLdirgHyDx4JhJ7c73Ri261vBO6', 'System Administrator', 'IT', TO_DATE('2018-09-01', 'YYYY-MM-DD'), 68000);


COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - HOTELS (Row by Row)
---- ============================================

INSERT INTO Hotel (name, location, rating, description, amenities, phone_number, email_address) VALUES ('Grand Plaza', 'Paris', 5, 'Experience luxury at its finest in the heart of Paris. The Grand Plaza offers stunning Eiffel Tower views, world-class dining, and impeccable service.', 'Free WiFi, 24-Hour Room Service, Fine Dining Restaurant, Rooftop Bar, Fitness Center, Full-Service Spa, Concierge, Business Center, Valet Parking, Pet-Friendly, Airport Shuttle', '+33-1-42-68-12-34', 'info@grandplazaparis.com');
INSERT INTO Hotel (name, location, rating, description, amenities, phone_number, email_address) VALUES ('Ocean View Resort', 'Bali', 4, 'Escape to paradise at our beachfront oasis in Bali. The Ocean View Resort combines traditional Balinese architecture with modern luxury.', 'Beach Access, Private Beach Cabanas, Infinity Pool, Oceanfront Restaurant, Beach Bar, Spa, Yoga Pavilion, Water Sports, Free WiFi, Airport Transfer', '+62-361-755-123', 'reservations@oceanviewbali.com');
INSERT INTO Hotel (name, location, rating, description, amenities, phone_number, email_address) VALUES ('City Center Inn', 'London', 3, 'Perfectly located in the heart of London, City Center Inn offers affordable comfort with easy access to major attractions.', 'Free WiFi, Continental Breakfast, 24-Hour Front Desk, Luggage Storage, Business Center, Concierge Service, Underground Station Nearby', '+44-20-7555-1234', 'info@citycenterlondon.com');
INSERT INTO Hotel (name, location, rating, description, amenities, phone_number, email_address) VALUES ('Mountain Lodge', 'Zurich', 4, 'Nestled in the Swiss Alps, Mountain Lodge offers breathtaking mountain views and year-round outdoor activities.', 'Ski-in/Ski-out Access, Heated Indoor Pool, Sauna, Fitness Center, Mountain View Restaurant, Bar with Fireplace, Free WiFi, Ski Storage, Equipment Rental', '+41-44-123-4567', 'info@mountainlodgezurich.com');
INSERT INTO Hotel (name, location, rating, description, amenities, phone_number, email_address) VALUES ('Sunset Hotel', 'Miami', 5, 'Miami''s premier beachfront hotel offering Art Deco elegance with modern luxury. Enjoy stunning ocean views, vibrant nightlife, and South Beach attractions.', 'Beach Access, Rooftop Pool with Ocean Views, Poolside Bar, Fitness Center, Spa, Restaurant, Nightclub, Free WiFi, Valet Parking, Beach Concierge', '+1-305-555-0123', 'reservations@sunsethotelmiami.com');
INSERT INTO Hotel (name, location, rating, description, amenities, phone_number, email_address) VALUES ('Budget Stay', 'Berlin', 2, 'Affordable accommodation in central Berlin with basic amenities and comfortable rooms for budget-conscious travelers.', 'Free WiFi, Shared Kitchen, Laundry Facilities, 24-Hour Reception, Luggage Storage', '+49-30-123-4567', 'info@budgetstayberlin.com');
INSERT INTO Hotel (name, location, rating, description, amenities, phone_number, email_address) VALUES ('Luxury Suites', 'Tokyo', 5, 'Ultra-luxurious suites in the heart of Tokyo with panoramic city views, personalized butler service, and exclusive amenities.', 'Butler Service, Private Limousine, Michelin-star Restaurant, Rooftop Bar, Infinity Pool, Luxury Spa, Business Center, Concierge', '+81-3-1234-5678', 'reservations@luxurysuitestokyo.com');
INSERT INTO Hotel (name, location, rating, description, amenities, phone_number, email_address) VALUES ('Coastal Inn', 'Lisbon', 3, 'Charming coastal hotel in Lisbon with traditional Portuguese architecture and modern comforts, close to historic sites and beaches.', 'Free WiFi, Restaurant, Bar, Terrace, Tour Desk, Car Rental, Airport Shuttle', '+351-21-123-4567', 'info@coastalinnlisbon.com');
INSERT INTO Hotel (name, location, rating, description, amenities, phone_number, email_address) VALUES ('Lakeside Cabin', 'Geneva', 4, 'Rustic luxury cabins on the shores of Lake Geneva offering peaceful retreat with modern amenities and stunning lake views.', 'Lake Access, Private Beach, Boat Rental, Restaurant, Bar, Fireplace, Free WiFi, Parking', '+41-22-123-4567', 'reservations@lakesidegeneva.com');
INSERT INTO Hotel (name, location, rating, description, amenities, phone_number, email_address) VALUES ('Historic Hotel', 'Rome', 4, 'Beautifully restored historic hotel in the center of Rome, blending classical architecture with contemporary luxury near major attractions.', 'Free WiFi, Rooftop Restaurant, Bar, Concierge, Tour Desk, Valet Parking, Business Center', '+39-06-123-4567', 'info@historichotelrome.com');

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - ROOMS (Row by Row)
---- ============================================

INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (1, '101', 'Suite', 500.00, 3, 'King Bed, Marble Bathroom, Rain Shower, Bathrobes, Mini Bar, Safe, 55" Smart TV, Nespresso Machine, Work Desk, Air Conditioning', 'Elegant suite with Eiffel Tower view, separate living area, and luxury marble bathroom');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (1, '102', 'Deluxe', 350.00, 2, 'Queen Bed, Premium Bathroom, Hair Dryer, Mini Bar, Safe, 48" Smart TV, Work Desk, Air Conditioning', 'Deluxe room with city view and modern amenities');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (2, '201', 'Standard', 150.00, 2, 'King Bed, Outdoor Bathroom, Rain Shower, Mini Bar, Safe, 50" Smart TV, Private Terrace, Beach Towels, Air Conditioning', 'Beachfront bungalow with ocean view and private terrace');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (2, '202', 'Standard', 150.00, 2, 'Queen Bed, Private Bathroom, Mini Bar, Safe, TV, Air Conditioning', 'Comfortable standard room with garden view');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (3, '301', 'Single', 80.00, 1, 'Single Bed, Private Bathroom, Desk, TV, Free WiFi, Air Conditioning', 'Compact single room perfect for solo travelers');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (3, '302', 'Double', 100.00, 2, 'Double Bed, Private Bathroom, Desk, TV, Free WiFi, Air Conditioning', 'Comfortable double room for couples or friends');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (4, '401', 'Standard', 200.00, 2, 'Queen Bed, Private Bathroom, Fireplace, Mini Bar, TV, Free WiFi', 'Cozy standard room with mountain views');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (4, '402', 'Double', 250.00, 2, 'King Bed, Private Bathroom, Fireplace, Mini Bar, TV, Free WiFi, Balcony', 'Double room with balcony and stunning alpine views');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (5, '501', 'Suite', 600.00, 3, 'King Bed, Living Area, Marble Bathroom, Mini Bar, Safe, Smart TV, Balcony, Ocean View', 'Luxury suite with ocean view and separate living area');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (5, '502', 'Standard', 250.00, 2, 'Queen Bed, Private Bathroom, Mini Bar, TV, Free WiFi', 'Comfortable standard room with city view');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (6, '601', 'Single', 60.00, 1, 'Single Bed, Shared Bathroom, Desk, Free WiFi', 'Basic single room with shared facilities');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (6, '602', 'Double', 80.00, 2, 'Double Bed, Private Bathroom, Desk, TV, Free WiFi', 'Affordable double room with private bathroom');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (7, '701', 'Suite', 800.00, 3, 'King Bed, Living Room, Dining Area, Kitchenette, Luxury Bathroom, Mini Bar, Smart TV, Balcony, City View', 'Premium suite with panoramic city views');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (7, '702', 'Deluxe', 550.00, 2, 'King Bed, Luxury Bathroom, Mini Bar, Smart TV, Work Desk, City View', 'Deluxe room with modern amenities and city view');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (8, '801', 'Double', 120.00, 2, 'Double Bed, Private Bathroom, TV, Free WiFi, Terrace', 'Comfortable double room with terrace');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (8, '802', 'Single', 90.00, 1, 'Single Bed, Private Bathroom, TV, Free WiFi', 'Cozy single room with private bathroom');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (9, '901', 'Suite', 400.00, 3, 'King Bed, Living Area, Fireplace, Private Bathroom, Mini Bar, TV, Balcony, Lake View', 'Lakeside suite with fireplace and balcony');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (9, '902', 'Standard', 250.00, 2, 'Queen Bed, Private Bathroom, TV, Free WiFi, Lake View', 'Standard room with beautiful lake views');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (10, '1001', 'Deluxe', 300.00, 2, 'King Bed, Luxury Bathroom, Mini Bar, Smart TV, Free WiFi, Historic View', 'Deluxe room with views of historic landmarks');
INSERT INTO Room (hotel_id, room_number, room_type, price_per_night, max_occupancy, amenities, description) VALUES (10, '1002', 'Standard', 180.00, 2, 'Queen Bed, Private Bathroom, TV, Free WiFi', 'Comfortable standard room in historic building');

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - FLIGHTS (Row by Row)
---- ============================================

INSERT INTO Flight (flight_number, departure_airport, arrival_airport, departure_time, arrival_time, price, airline, capacity, available_seats) VALUES ('F101', 'JFK', 'CDG', TO_DATE('2025-11-01 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2025-11-01 17:00:00', 'YYYY-MM-DD HH24:MI:SS'), 750.00, 'Air France', 300, 45);
INSERT INTO Flight (flight_number, departure_airport, arrival_airport, departure_time, arrival_time, price, airline, capacity, available_seats) VALUES ('F102', 'CDG', 'JFK', TO_DATE('2025-11-10 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2025-11-10 19:00:00', 'YYYY-MM-DD HH24:MI:SS'), 800.00, 'Air France', 300, 52);
INSERT INTO Flight (flight_number, departure_airport, arrival_airport, departure_time, arrival_time, price, airline, capacity, available_seats) VALUES ('F201', 'LHR', 'DPS', TO_DATE('2025-12-05 22:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2025-12-06 18:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1200.00, 'British Airways', 350, 28);
INSERT INTO Flight (flight_number, departure_airport, arrival_airport, departure_time, arrival_time, price, airline, capacity, available_seats) VALUES ('F202', 'DPS', 'LHR', TO_DATE('2025-12-15 20:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2025-12-16 16:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1100.00, 'British Airways', 350, 35);
INSERT INTO Flight (flight_number, departure_airport, arrival_airport, departure_time, arrival_time, price, airline, capacity, available_seats) VALUES ('F301', 'MIA', 'ZRH', TO_DATE('2025-12-20 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2025-12-20 18:00:00', 'YYYY-MM-DD HH24:MI:SS'), 950.00, 'Swiss International', 280, 15);
INSERT INTO Flight (flight_number, departure_airport, arrival_airport, departure_time, arrival_time, price, airline, capacity, available_seats) VALUES ('F302', 'ZRH', 'MIA', TO_DATE('2025-12-28 12:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2025-12-28 21:00:00', 'YYYY-MM-DD HH24:MI:SS'), 900.00, 'Swiss International', 280, 22);
INSERT INTO Flight (flight_number, departure_airport, arrival_airport, departure_time, arrival_time, price, airline, capacity, available_seats) VALUES ('F401', 'BER', 'HND', TO_DATE('2025-10-10 15:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2025-10-11 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1500.00, 'Lufthansa', 400, 8);
INSERT INTO Flight (flight_number, departure_airport, arrival_airport, departure_time, arrival_time, price, airline, capacity, available_seats) VALUES ('F402', 'HND', 'BER', TO_DATE('2025-10-18 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2025-10-19 06:00:00', 'YYYY-MM-DD HH24:MI:SS'), 1400.00, 'Lufthansa', 400, 12);
INSERT INTO Flight (flight_number, departure_airport, arrival_airport, departure_time, arrival_time, price, airline, capacity, available_seats) VALUES ('F501', 'LIS', 'ROM', TO_DATE('2025-11-20 07:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2025-11-20 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 250.00, 'TAP Portugal', 180, 65);
INSERT INTO Flight (flight_number, departure_airport, arrival_airport, departure_time, arrival_time, price, airline, capacity, available_seats) VALUES ('F502', 'ROM', 'LIS', TO_DATE('2025-11-25 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), TO_DATE('2025-11-25 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), 220.00, 'TAP Portugal', 180, 72);

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - PACKAGES (Row by Row)
---- ============================================

INSERT INTO Package (package_name, price, description, duration_days) VALUES ('Parisian Romance', 1500.00, 'Includes flights and a 5-star hotel stay in Paris. Experience the city of love with luxury accommodation and romantic experiences.', 7);
INSERT INTO Package (package_name, price, description, duration_days) VALUES ('Bali Adventure', 1800.00, 'Flights, hotel, and activities in Bali. Explore tropical paradise with cultural tours and beach activities.', 10);
INSERT INTO Package (package_name, price, description, duration_days) VALUES ('Swiss Ski Trip', 1150.00, 'Flights and a mountain lodge stay in Zurich. Perfect for skiing enthusiasts with access to world-class slopes.', 8);
INSERT INTO Package (package_name, price, description, duration_days) VALUES ('Tokyo Explorer', 2500.00, 'Flights, luxury hotel, and city tours in Tokyo. Discover modern technology and traditional culture.', 9);
INSERT INTO Package (package_name, price, description, duration_days) VALUES ('European Getaway', 500.00, 'Flights and budget hotel in Berlin. Affordable European adventure with city exploration.', 5);

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - BOOKINGS (Row by Row)
---- ============================================

INSERT INTO Booking (customer_id, employee_id, booking_date, status, total_amount) VALUES (1, 1, TO_DATE('2025-09-20 10:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Confirmed', 1500.00);
INSERT INTO Booking (customer_id, employee_id, booking_date, status, total_amount) VALUES (2, 2, TO_DATE('2025-10-01 11:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Confirmed', 1800.00);
INSERT INTO Booking (customer_id, employee_id, booking_date, status, total_amount) VALUES (3, 1, TO_DATE('2025-09-25 14:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Confirmed', 1150.00);
INSERT INTO Booking (customer_id, employee_id, booking_date, status, total_amount) VALUES (4, 3, TO_DATE('2025-10-05 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Pending', 850.00);
INSERT INTO Booking (customer_id, employee_id, booking_date, status, total_amount) VALUES (5, 4, TO_DATE('2025-09-15 16:30:00', 'YYYY-MM-DD HH24:MI:SS'), 'Confirmed', 2500.00);
INSERT INTO Booking (customer_id, employee_id, booking_date, status, total_amount) VALUES (6, 2, TO_DATE('2025-09-28 12:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Confirmed', 500.00);
INSERT INTO Booking (customer_id, employee_id, booking_date, status, total_amount) VALUES (7, 1, TO_DATE('2025-10-02 15:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Confirmed', 750.00);
INSERT INTO Booking (customer_id, employee_id, booking_date, status, total_amount) VALUES (8, 5, TO_DATE('2025-09-18 08:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Confirmed', 1200.00);
INSERT INTO Booking (customer_id, employee_id, booking_date, status, total_amount) VALUES (9, 4, TO_DATE('2025-09-30 17:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Confirmed', 1500.00);
INSERT INTO Booking (customer_id, employee_id, booking_date, status, total_amount) VALUES (10, 3, TO_DATE('2025-10-07 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 'Pending', 950.00);

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - PAYMENTS (Row by Row)
---- ============================================

INSERT INTO Payment (booking_id, amount, payment_date, method, transaction_id) VALUES (1, 1500.00, TO_DATE('2025-09-20 10:35:00', 'YYYY-MM-DD HH24:MI:SS'), 'Credit Card', 'TXN00123456');
INSERT INTO Payment (booking_id, amount, payment_date, method, transaction_id) VALUES (2, 1800.00, TO_DATE('2025-10-01 11:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Credit Card', 'TXN00123457');
INSERT INTO Payment (booking_id, amount, payment_date, method, transaction_id) VALUES (3, 1150.00, TO_DATE('2025-09-25 14:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Credit Card', 'TXN00123458');
INSERT INTO Payment (booking_id, amount, payment_date, method, transaction_id) VALUES (5, 2500.00, TO_DATE('2025-09-15 16:35:00', 'YYYY-MM-DD HH24:MI:SS'), 'PayPal', 'TXN00123459');
INSERT INTO Payment (booking_id, amount, payment_date, method, transaction_id) VALUES (6, 500.00, TO_DATE('2025-09-28 12:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Credit Card', 'TXN00123460');
INSERT INTO Payment (booking_id, amount, payment_date, method, transaction_id) VALUES (7, 750.00, TO_DATE('2025-10-02 15:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Credit Card', 'TXN00123461');
INSERT INTO Payment (booking_id, amount, payment_date, method, transaction_id) VALUES (8, 1200.00, TO_DATE('2025-09-18 08:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'PayPal', 'TXN00123462');
INSERT INTO Payment (booking_id, amount, payment_date, method, transaction_id) VALUES (9, 1500.00, TO_DATE('2025-09-30 17:05:00', 'YYYY-MM-DD HH24:MI:SS'), 'Credit Card', 'TXN00123463');

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - BOOKING_FLIGHT (Row by Row)
---- ============================================

INSERT INTO Booking_Flight (booking_id, flight_id, passengers, seat_class) VALUES (1, 1, 2, 'Economy');
INSERT INTO Booking_Flight (booking_id, flight_id, passengers, seat_class) VALUES (2, 3, 2, 'Premium Economy');
INSERT INTO Booking_Flight (booking_id, flight_id, passengers, seat_class) VALUES (3, 5, 1, 'Business');
INSERT INTO Booking_Flight (booking_id, flight_id, passengers, seat_class) VALUES (5, 7, 2, 'First Class');
INSERT INTO Booking_Flight (booking_id, flight_id, passengers, seat_class) VALUES (6, 9, 1, 'Economy');

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - BOOKING_ROOM (Row by Row)
---- ============================================

INSERT INTO Booking_Room (booking_id, room_id, check_in_date, check_out_date, guests, special_requests) VALUES (1, 1, TO_DATE('2025-11-01', 'YYYY-MM-DD'), TO_DATE('2025-11-09', 'YYYY-MM-DD'), 2, 'Anniversary celebration - please arrange champagne');
INSERT INTO Booking_Room (booking_id, room_id, check_in_date, check_out_date, guests, special_requests) VALUES (2, 3, TO_DATE('2025-12-05', 'YYYY-MM-DD'), TO_DATE('2025-12-14', 'YYYY-MM-DD'), 2, 'Honeymoon suite - rose petals on bed');
INSERT INTO Booking_Room (booking_id, room_id, check_in_date, check_out_date, guests, special_requests) VALUES (3, 4, TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_DATE('2025-12-27', 'YYYY-MM-DD'), 1, 'Ski equipment storage needed');
INSERT INTO Booking_Room (booking_id, room_id, check_in_date, check_out_date, guests, special_requests) VALUES (5, 7, TO_DATE('2025-10-10', 'YYYY-MM-DD'), TO_DATE('2025-10-17', 'YYYY-MM-DD'), 2, 'Business trip - need early check-in');
INSERT INTO Booking_Room (booking_id, room_id, check_in_date, check_out_date, guests, special_requests) VALUES (6, 12, TO_DATE('2025-11-20', 'YYYY-MM-DD'), TO_DATE('2025-11-24', 'YYYY-MM-DD'), 1, 'Quiet room preferred');

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - PACKAGE_DETAIL (Row by Row)
---- ============================================

INSERT INTO Package_Detail (package_id, flight_id, room_id, booking_id) VALUES (1, 1, 1, 1);
INSERT INTO Package_Detail (package_id, flight_id, room_id, booking_id) VALUES (1, 2, 1, 1);
INSERT INTO Package_Detail (package_id, flight_id, room_id, booking_id) VALUES (2, 3, 3, 2);
INSERT INTO Package_Detail (package_id, flight_id, room_id, booking_id) VALUES (2, 4, 3, 2);
INSERT INTO Package_Detail (package_id, flight_id, room_id, booking_id) VALUES (3, 5, 4, 3);
INSERT INTO Package_Detail (package_id, flight_id, room_id, booking_id) VALUES (3, 6, 4, 3);
INSERT INTO Package_Detail (package_id, flight_id, room_id, booking_id) VALUES (4, 7, 7, 5);
INSERT INTO Package_Detail (package_id, flight_id, room_id, booking_id) VALUES (4, 8, 7, 5);
INSERT INTO Package_Detail (package_id, flight_id, room_id, booking_id) VALUES (5, 9, 11, 6);
INSERT INTO Package_Detail (package_id, flight_id, room_id, booking_id) VALUES (5, 10, 11, 6);

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - HOTEL_PHOTOS (Row by Row)
---- ============================================

INSERT INTO Hotel_Photos (hotel_id, photo_url, photo_description, is_primary, photo_type, display_order) VALUES (1, '/images/hotels/hotel_1/main_exterior.jpg', 'Grand Plaza Hotel - Elegant facade on Parisian boulevard', 'Y', 'EXTERIOR', 1);
INSERT INTO Hotel_Photos (hotel_id, photo_url, photo_description, is_primary, photo_type, display_order) VALUES (1, '/images/hotels/hotel_1/lobby_luxury.jpg', 'Grand Plaza Hotel - Opulent lobby with crystal chandeliers', 'N', 'LOBBY', 1);
INSERT INTO Hotel_Photos (hotel_id, photo_url, photo_description, is_primary, photo_type, display_order) VALUES (1, '/images/hotels/hotel_1/suite_deluxe.jpg', 'Grand Plaza Hotel - Deluxe suite with Eiffel Tower view', 'N', 'ROOM', 1);
INSERT INTO Hotel_Photos (hotel_id, photo_url, photo_description, is_primary, photo_type, display_order) VALUES (1, '/images/hotels/hotel_1/restaurant_fine_dining.jpg', 'Grand Plaza Hotel - Michelin-starred restaurant', 'N', 'RESTAURANT', 1);
INSERT INTO Hotel_Photos (hotel_id, photo_url, photo_description, is_primary, photo_type, display_order) VALUES (2, '/images/hotels/hotel_2/beachfront_resort.jpg', 'Ocean View Resort - Tropical beachfront paradise', 'Y', 'EXTERIOR', 1);
INSERT INTO Hotel_Photos (hotel_id, photo_url, photo_description, is_primary, photo_type, display_order) VALUES (2, '/images/hotels/hotel_2/ocean_villa.jpg', 'Ocean View Resort - Private oceanview villa', 'N', 'ROOM', 1);
INSERT INTO Hotel_Photos (hotel_id, photo_url, photo_description, is_primary, photo_type, display_order) VALUES (2, '/images/hotels/hotel_2/infinity_pool.jpg', 'Ocean View Resort - Infinity pool overlooking ocean', 'N', 'POOL', 1);
INSERT INTO Hotel_Photos (hotel_id, photo_url, photo_description, is_primary, photo_type, display_order) VALUES (3, '/images/hotels/hotel_3/london_exterior.jpg', 'City Center Inn - Modern exterior in central London', 'Y', 'EXTERIOR', 1);
INSERT INTO Hotel_Photos (hotel_id, photo_url, photo_description, is_primary, photo_type, display_order) VALUES (3, '/images/hotels/hotel_3/london_room.jpg', 'City Center Inn - Comfortable modern room', 'N', 'ROOM', 1);
INSERT INTO Hotel_Photos (hotel_id, photo_url, photo_description, is_primary, photo_type, display_order) VALUES (4, '/images/hotels/hotel_4/alpine_lodge.jpg', 'Mountain Lodge - Alpine chalet with mountain views', 'Y', 'EXTERIOR', 1);
INSERT INTO Hotel_Photos (hotel_id, photo_url, photo_description, is_primary, photo_type, display_order) VALUES (4, '/images/hotels/hotel_4/ski_room.jpg', 'Mountain Lodge - Cozy room with fireplace', 'N', 'ROOM', 1);
INSERT INTO Hotel_Photos (hotel_id, photo_url, photo_description, is_primary, photo_type, display_order) VALUES (5, '/images/hotels/hotel_5/art_deco_exterior.jpg', 'Sunset Hotel - Art Deco facade on South Beach', 'Y', 'EXTERIOR', 1);
INSERT INTO Hotel_Photos (hotel_id, photo_url, photo_description, is_primary, photo_type, display_order) VALUES (5, '/images/hotels/hotel_5/ocean_suite.jpg', 'Sunset Hotel - Oceanview suite with balcony', 'N', 'ROOM', 1);

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - WISHLIST (Row by Row)
---- ============================================

INSERT INTO Wishlist (customer_id, hotel_id, wishlist_name, notes, target_date, budget_range) VALUES (1, 2, 'Honeymoon Dreams', 'Perfect for our upcoming honeymoon - want the beachfront villa', TO_DATE('2025-12-15', 'YYYY-MM-DD'), '$3000-4000');
INSERT INTO Wishlist (customer_id, hotel_id, wishlist_name, notes, target_date, budget_range) VALUES (1, 4, 'Ski Trip 2026', 'Would love to go skiing here next winter with friends', TO_DATE('2026-02-01', 'YYYY-MM-DD'), '$2000-3000');
INSERT INTO Wishlist (customer_id, hotel_id, wishlist_name, notes, target_date, budget_range) VALUES (2, 1, 'Anniversary Special', 'Surprise trip for our 10th anniversary', TO_DATE('2026-06-20', 'YYYY-MM-DD'), '$4000-5000');
INSERT INTO Wishlist (customer_id, hotel_id, wishlist_name, notes, target_date, budget_range) VALUES (3, 5, 'Girls Weekend', 'Miami beach weekend with college friends', TO_DATE('2025-11-10', 'YYYY-MM-DD'), '$1500-2000');
INSERT INTO Wishlist (customer_id, hotel_id, wishlist_name, notes, target_date, budget_range) VALUES (4, 3, 'London Theater Trip', 'Want to see West End shows and explore London', TO_DATE('2025-11-25', 'YYYY-MM-DD'), '$2000-2500');
INSERT INTO Wishlist (customer_id, hotel_id, wishlist_name, notes, target_date, budget_range) VALUES (5, 1, 'European Adventure', 'Part of our European tour - Paris stop', TO_DATE('2025-11-01', 'YYYY-MM-DD'), '$2500-3500');

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - FAVORITES (Row by Row)
---- ============================================

INSERT INTO Favorites (customer_id, hotel_id, location, favorite_type, category, rating_preference) VALUES (1, 1, 'Paris, France', 'HOTEL', 'Luxury Hotels', 5);
INSERT INTO Favorites (customer_id, hotel_id, location, favorite_type, category, rating_preference) VALUES (1, 2, 'Bali, Indonesia', 'HOTEL', 'Beach Resorts', 5);
INSERT INTO Favorites (customer_id, hotel_id, location, favorite_type, category, rating_preference) VALUES (2, 3, 'London, UK', 'HOTEL', 'City Hotels', 4);
INSERT INTO Favorites (customer_id, hotel_id, location, favorite_type, category, rating_preference) VALUES (3, NULL, 'Tokyo, Japan', 'LOCATION', 'Future Destinations', NULL);
INSERT INTO Favorites (customer_id, hotel_id, location, favorite_type, category, rating_preference) VALUES (4, NULL, 'Miami Beach, Florida', 'LOCATION', 'Beach Destinations', NULL);
INSERT INTO Favorites (customer_id, hotel_id, location, favorite_type, category, rating_preference) VALUES (5, 4, 'Zurich, Switzerland', 'HOTEL', 'Mountain Resorts', 5);

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - VISITED_PLACES (Row by Row)
---- ============================================

INSERT INTO Visited_Places (customer_id, hotel_id, location, visit_date, checkout_date, rating, notes, would_recommend, visit_type, group_size, room_type, booking_id) VALUES (1, 1, 'Paris, France', TO_DATE('2025-09-01', 'YYYY-MM-DD'), TO_DATE('2025-09-08', 'YYYY-MM-DD'), 5, 'Amazing anniversary trip! Eiffel Tower view from our room was breathtaking. Staff went above and beyond to make our stay special.', 'Y', 'COUPLE', 2, 'Deluxe Suite', 1);
INSERT INTO Visited_Places (customer_id, hotel_id, location, visit_date, checkout_date, rating, notes, would_recommend, visit_type, group_size, room_type, booking_id) VALUES (2, 3, 'London, UK', TO_DATE('2025-08-15', 'YYYY-MM-DD'), TO_DATE('2025-08-18', 'YYYY-MM-DD'), 4, 'Great hotel for theater district. Clean rooms, excellent location. Would have liked breakfast included.', 'Y', 'LEISURE', 1, 'Standard Room', 2);
INSERT INTO Visited_Places (customer_id, hotel_id, location, visit_date, checkout_date, rating, notes, would_recommend, visit_type, group_size, room_type, booking_id) VALUES (3, 5, 'Miami Beach, FL', TO_DATE('2025-07-10', 'YYYY-MM-DD'), TO_DATE('2025-07-15', 'YYYY-MM-DD'), 4, 'Beautiful Art Deco hotel with great pool scene. Perfect location for South Beach. Nightlife was amazing but a bit noisy.', 'Y', 'LEISURE', 4, 'Ocean View', 5);
INSERT INTO Visited_Places (customer_id, hotel_id, location, visit_date, checkout_date, rating, notes, would_recommend, visit_type, group_size, room_type, booking_id) VALUES (4, 4, 'Zurich, Switzerland', TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_DATE('2025-12-27', 'YYYY-MM-DD'), 5, 'Perfect ski lodge! Cozy fireplace in our room, great ski-in/ski-out access. Fondue dinner was delicious.', 'Y', 'FAMILY', 3, 'Mountain View', 9);

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - HOTEL_REVIEWS (Row by Row)
---- ============================================

INSERT INTO Hotel_Reviews (hotel_id, customer_id, booking_id, rating, review_title, review_text, stay_date_from, stay_date_to, room_type_reviewed, travel_type, verified_stay) VALUES (1, 1, 1, 5, 'Absolutely Perfect Parisian Experience!', 'From the moment we arrived, the staff at Grand Plaza made us feel like royalty. Our suite had breathtaking Eiffel Tower views, and the turn-down service with macarons was such a lovely touch. The location is unbeatable - walking distance to the Louvre and Champs-Élysées. Worth every penny!', TO_DATE('2025-09-01', 'YYYY-MM-DD'), TO_DATE('2025-09-08', 'YYYY-MM-DD'), 'Deluxe Suite', 'COUPLE', 'Y');
INSERT INTO Hotel_Reviews (hotel_id, customer_id, booking_id, rating, review_title, review_text, stay_date_from, stay_date_to, room_type_reviewed, travel_type, verified_stay) VALUES (1, 2, 2, 4, 'Great Hotel, Minor Service Issues', 'Beautiful hotel with excellent rooms and amenities. The spa was fantastic, and the rooftop bar offers the best views in Paris. Only issue was slow room service one evening. Overall, would recommend and stay again.', TO_DATE('2025-08-15', 'YYYY-MM-DD'), TO_DATE('2025-08-18', 'YYYY-MM-DD'), 'Deluxe Room', 'LEISURE', 'Y');
INSERT INTO Hotel_Reviews (hotel_id, customer_id, booking_id, rating, review_title, review_text, stay_date_from, stay_date_to, room_type_reviewed, travel_type, verified_stay) VALUES (2, 5, 5, 5, 'Paradise Found!', 'This resort is absolute paradise! Our beachfront villa was stunning with direct ocean access. Waking up to the sound of waves was incredible. The staff went above and beyond to make our honeymoon special. Can''t wait to return!', TO_DATE('2025-09-15', 'YYYY-MM-DD'), TO_DATE('2025-09-22', 'YYYY-MM-DD'), 'Beachfront Villa', 'COUPLE', 'Y');
INSERT INTO Hotel_Reviews (hotel_id, customer_id, booking_id, rating, review_title, review_text, stay_date_from, stay_date_to, room_type_reviewed, travel_type, verified_stay) VALUES (2, 6, 6, 5, 'Bali Bliss!', 'Perfect blend of luxury and Balinese culture. The infinity pool seems to merge with the ocean. Spa treatments were amazing, and the restaurant serves incredible local cuisine. Staff are warm and genuine. Already planning our next visit!', TO_DATE('2025-08-10', 'YYYY-MM-DD'), TO_DATE('2025-08-17', 'YYYY-MM-DD'), 'Ocean View Room', 'LEISURE', 'Y');
INSERT INTO Hotel_Reviews (hotel_id, customer_id, booking_id, rating, review_title, review_text, stay_date_from, stay_date_to, room_type_reviewed, travel_type, verified_stay) VALUES (3, 8, 8, 4, 'Great Value in London', 'Excellent location for the price. Clean, comfortable rooms with modern amenities. Walking distance to Oxford Street and theater district. Staff were helpful and friendly. Would stay again.', TO_DATE('2025-09-10', 'YYYY-MM-DD'), TO_DATE('2025-09-13', 'YYYY-MM-DD'), 'Standard Room', 'LEISURE', 'Y');
INSERT INTO Hotel_Reviews (hotel_id, customer_id, booking_id, rating, review_title, review_text, stay_date_from, stay_date_to, room_type_reviewed, travel_type, verified_stay) VALUES (4, 9, 9, 5, 'Mountain Paradise!', 'Perfect ski lodge with cozy atmosphere. Our room had a fireplace and stunning mountain views. Ski-in/ski-out access was so convenient. The fondue restaurant was delicious! Can''t wait to come back in winter.', TO_DATE('2025-12-20', 'YYYY-MM-DD'), TO_DATE('2025-12-27', 'YYYY-MM-DD'), 'Mountain View Room', 'FAMILY', 'Y');

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - HOTEL_AMENITIES (Row by Row)
---- ============================================

INSERT INTO Hotel_Amenities (hotel_id, amenity_type, amenity_name, description, is_free, available_24_7) VALUES (1, 'SPA', 'Luxury Spa', 'Full-service spa with massage, facials, and body treatments', 'N', 'N');
INSERT INTO Hotel_Amenities (hotel_id, amenity_type, amenity_name, description, is_free, available_24_7) VALUES (1, 'FITNESS', 'Fitness Center', 'State-of-the-art gym with personal trainers', 'Y', 'Y');
INSERT INTO Hotel_Amenities (hotel_id, amenity_type, amenity_name, description, is_free, available_24_7) VALUES (1, 'POOL', 'Rooftop Pool', 'Infinity pool with panoramic city views', 'Y', 'N');
INSERT INTO Hotel_Amenities (hotel_id, amenity_type, amenity_name, description, is_free, available_24_7) VALUES (2, 'BEACH', 'Private Beach', 'Exclusive beach access with cabana service', 'Y', 'N');
INSERT INTO Hotel_Amenities (hotel_id, amenity_type, amenity_name, description, is_free, available_24_7) VALUES (2, 'WATER_SPORTS', 'Water Sports', 'Snorkeling, kayaking, and paddleboarding equipment', 'N', 'N');
INSERT INTO Hotel_Amenities (hotel_id, amenity_type, amenity_name, description, is_free, available_24_7) VALUES (3, 'BREAKFAST', 'Continental Breakfast', 'Complimentary breakfast buffet', 'Y', 'N');
INSERT INTO Hotel_Amenities (hotel_id, amenity_type, amenity_name, description, is_free, available_24_7) VALUES (4, 'SKI', 'Ski Storage', 'Heated ski and snowboard storage room', 'Y', 'Y');
INSERT INTO Hotel_Amenities (hotel_id, amenity_type, amenity_name, description, is_free, available_24_7) VALUES (4, 'SKI', 'Equipment Rental', 'Ski and snowboard rental on-site', 'N', 'N');
INSERT INTO Hotel_Amenities (hotel_id, amenity_type, amenity_name, description, is_free, available_24_7) VALUES (5, 'POOL', 'Rooftop Pool', 'Ocean-view pool with bar service', 'Y', 'N');
INSERT INTO Hotel_Amenities (hotel_id, amenity_type, amenity_name, description, is_free, available_24_7) VALUES (5, 'ENTERTAINMENT', 'Nightclub', 'Exclusive nightclub with live DJ', 'N', 'N');

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - CUSTOMER_PREFERENCES (Row by Row)
---- ============================================

INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (1, 'ROOM_TYPE', 'Suite', 5);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (1, 'AMENITY', 'Ocean View', 5);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (1, 'AMENITY', 'Balcony', 4);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (1, 'LOCATION', 'City Center', 4);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (1, 'TRAVEL_STYLE', 'Luxury', 5);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (2, 'ROOM_TYPE', 'Deluxe Room', 4);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (2, 'AMENITY', 'Free Breakfast', 4);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (2, 'LOCATION', 'Near Attractions', 5);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (2, 'PRICE_RANGE', 'Moderate', 5);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (3, 'ROOM_TYPE', 'Beachfront', 5);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (3, 'AMENITY', 'Pool', 5);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (3, 'LOCATION', 'Beach', 5);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (3, 'TRAVEL_STYLE', 'Relaxation', 4);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (4, 'ROOM_TYPE', 'Standard Room', 3);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (4, 'AMENITY', 'Free WiFi', 4);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (4, 'PRICE_RANGE', 'Budget', 5);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (5, 'ROOM_TYPE', 'Mountain View', 5);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (5, 'AMENITY', 'Fireplace', 4);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (5, 'LOCATION', 'Ski Resort', 5);
INSERT INTO Customer_Preferences (customer_id, preference_type, preference_value, priority) VALUES (5, 'TRAVEL_STYLE', 'Adventure', 5);

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - SEARCH_HISTORY (Row by Row)
---- ============================================

INSERT INTO Search_History (customer_id, search_query, search_filters, search_type, results_count, search_date) VALUES (1, 'Paris luxury hotels', '{"rating": "5", "price_range": "500-1000", "amenities": ["spa", "restaurant"]}', 'HOTEL', 15, SYSTIMESTAMP - 7);
INSERT INTO Search_History (customer_id, search_query, search_filters, search_type, results_count, search_date) VALUES (1, 'Bali beachfront resorts', '{"price_range": "200-500", "amenities": ["pool", "spa"]}', 'HOTEL', 23, SYSTIMESTAMP - 5);
INSERT INTO Search_History (customer_id, search_query, search_filters, search_type, results_count, search_date) VALUES (2, 'London hotels near theater', '{"rating": "4+", "price_range": "100-300"}', 'HOTEL', 18, SYSTIMESTAMP - 3);
INSERT INTO Search_History (customer_id, search_query, search_filters, search_type, results_count, search_date) VALUES (3, 'Miami Art Deco hotels', '{"amenities": ["pool", "beach_access"], "price_range": "200-400"}', 'HOTEL', 12, SYSTIMESTAMP - 10);
INSERT INTO Search_History (customer_id, search_query, search_filters, search_type, results_count, search_date) VALUES (4, 'Switzerland ski resorts', '{"amenities": ["ski_in_ski_out", "spa"], "rating": "4+"}', 'HOTEL', 8, SYSTIMESTAMP - 14);

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - NOTIFICATIONS (Row by Row)
---- ============================================

INSERT INTO Notifications (customer_id, notification_type, title, message, notification_data, priority, action_url) VALUES (1, 'BOOKING_CONFIRMED', 'Booking Confirmed', 'Your stay at Grand Plaza Hotel has been confirmed! We''ve sent the details to your email.', '{"booking_id": 1, "hotel_name": "Grand Plaza Hotel", "dates": "Sep 1-8, 2025"}', 5, '/bookings/1');
INSERT INTO Notifications (customer_id, notification_type, title, message, notification_data, priority, action_url) VALUES (1, 'PRICE_DROP', 'Price Alert!', 'Ocean View Resort prices dropped by 15% for your travel dates. Book now to save!', '{"hotel_id": 2, "original_price": 350, "new_price": 298, "savings": 52}', 4, '/hotels/2');
INSERT INTO Notifications (customer_id, notification_type, title, message, notification_data, priority, action_url) VALUES (2, 'REVIEW_REQUEST', 'Share Your Experience', 'How was your stay at City Center Inn? Your feedback helps other travelers!', '{"booking_id": 2, "hotel_name": "City Center Inn"}', 3, '/reviews/new/2');
INSERT INTO Notifications (customer_id, notification_type, title, message, notification_data, priority, action_url) VALUES (3, 'PROMOTION', 'Special Offer!', 'Get 20% off your next stay at any of our luxury hotels. Limited time offer!', '{"discount": "20%", "code": "LUXURY20", "expires": "2025-12-31"}', 4, '/special-offers');
INSERT INTO Notifications (customer_id, notification_type, title, message, notification_data, priority, action_url) VALUES (4, 'REMINDER', 'Trip Reminder', 'Your ski trip to Mountain Lodge is coming up in 2 weeks! Don''t forget to pack warm clothes.', '{"booking_id": 9, "hotel_name": "Mountain Lodge", "trip_date": "2025-12-20"}', 3, '/bookings/9');

COMMIT;

---- ============================================
---- INSERT SAMPLE DATA - REVIEW_HELPFUL_VOTES (Row by Row)
---- ============================================

INSERT INTO Review_Helpful_Votes (review_id, customer_id, vote_type) VALUES (1, 2, 'HELPFUL');
INSERT INTO Review_Helpful_Votes (review_id, customer_id, vote_type) VALUES (1, 3, 'HELPFUL');
INSERT INTO Review_Helpful_Votes (review_id, customer_id, vote_type) VALUES (2, 1, 'HELPFUL');
INSERT INTO Review_Helpful_Votes (review_id, customer_id, vote_type) VALUES (3, 4, 'HELPFUL');
INSERT INTO Review_Helpful_Votes (review_id, customer_id, vote_type) VALUES (4, 5, 'HELPFUL');
INSERT INTO Review_Helpful_Votes (review_id, customer_id, vote_type) VALUES (5, 6, 'HELPFUL');
INSERT INTO Review_Helpful_Votes (review_id, customer_id, vote_type) VALUES (6, 7, 'HELPFUL');

COMMIT;

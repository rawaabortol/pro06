---- ============================================
---- CREATE COMPREHENSIVE VIEWS
---- ============================================
--
---- 1. Sales Report View
CREATE OR REPLACE VIEW Sales_Report AS
SELECT 
    c.first_name || ' ' || c.last_name AS customer_name,
    b.booking_id,
    b.booking_date,
    b.status,
    p.amount,
    p.method AS payment_method
FROM Customer c
JOIN Booking b ON c.customer_id = b.customer_id
LEFT JOIN Payment p ON b.booking_id = p.booking_id;

----2. Hotel Details View
CREATE OR REPLACE VIEW Hotel_Details_View AS
SELECT 
    h.hotel_id,
    h.name,
    h.location,
    h.rating AS star_rating,
    h.description,
    h.amenities,
    h.website_url,
    h.phone_number,
    h.email_address,
    h.photo_count,
    h.review_count,
    h.average_rating,
    h.check_in_time,
    h.check_out_time,
    h.cancellation_policy,
    h.pet_friendly,
    h.parking_available,
    h.wifi_available,
    h.breakfast_included,
    h.gym_available,
    h.spa_available,
    h.pool_available,
    h.restaurant_available,

    MIN(hp.photo_url) AS photo_url,  -- ✅ FIX

    COUNT(DISTINCT r.room_id) AS total_rooms,
    MIN(r.price_per_night) AS min_price,
    MAX(r.price_per_night) AS max_price,
    ROUND(AVG(r.price_per_night), 2) AS avg_price,

    COUNT(DISTINCT hr.review_id) AS actual_review_count,
    COUNT(DISTINCT hp.photo_id) AS actual_photo_count,

    LISTAGG(DISTINCT r.room_type, ', ')
        WITHIN GROUP (ORDER BY r.room_type) AS available_room_types,

    CASE 
        WHEN COUNT(DISTINCT r.room_id) > 20 THEN 'HIGH'
        WHEN COUNT(DISTINCT r.room_id) > 10 THEN 'MEDIUM'
        ELSE 'LOW'
    END AS inventory_level,

    ROUND(
        (h.average_rating * 20) + 
        (COUNT(DISTINCT hr.review_id) * 2) + 
        (COUNT(DISTINCT hp.photo_id) * 1), 2
    ) AS popularity_score

FROM Hotel h
LEFT JOIN Room r ON h.hotel_id = r.hotel_id
LEFT JOIN Hotel_Reviews hr 
    ON h.hotel_id = hr.hotel_id AND hr.is_public = 'Y'
LEFT JOIN Hotel_Photos hp 
    ON h.hotel_id = hp.hotel_id

GROUP BY 
    h.hotel_id, h.name, h.location, h.rating, h.description, h.amenities,
    h.website_url, h.phone_number, h.email_address, h.photo_count,
    h.review_count, h.average_rating, h.check_in_time, h.check_out_time,
    h.cancellation_policy, h.pet_friendly, h.parking_available,
    h.wifi_available, h.breakfast_included, h.gym_available,
    h.spa_available, h.pool_available, h.restaurant_available;

--
---- 3. Customer Booking Summary View
CREATE OR REPLACE VIEW Customer_Booking_Summary AS
SELECT 
    c.customer_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.email,
    c.phone_number,
    c.loyalty_tier,
    c.loyalty_points,
    COUNT(b.booking_id) AS total_bookings,
    COUNT(CASE WHEN b.status = 'Confirmed' THEN 1 END) AS confirmed_bookings,
    COUNT(CASE WHEN b.status = 'Pending' THEN 1 END) AS pending_bookings,
    SUM(p.amount) AS total_spent,
    ROUND(AVG(p.amount), 2) AS avg_booking_value,
    MAX(b.booking_date) AS last_booking_date,
    COUNT(DISTINCT br.room_id) AS different_rooms_booked,
    COUNT(DISTINCT bf.flight_id) AS different_flights_booked
FROM Customer c
LEFT JOIN Booking b ON c.customer_id = b.customer_id
LEFT JOIN Payment p ON b.booking_id = p.booking_id
LEFT JOIN Booking_Room br ON b.booking_id = br.booking_id
LEFT JOIN Booking_Flight bf ON b.booking_id = bf.booking_id
GROUP BY c.customer_id, c.first_name, c.last_name, c.email, c.phone_number, c.loyalty_tier, c.loyalty_points;

---- 4. Hotel Revenue Analysis View
CREATE OR REPLACE VIEW Hotel_Revenue_Analysis AS
SELECT 
    h.hotel_id,
    h.name AS hotel_name,
    h.location,
    h.rating,
    COUNT(DISTINCT b.booking_id) AS total_bookings,
    COUNT(DISTINCT br.room_id) AS rooms_booked,
    SUM(p.amount) AS total_revenue,
    ROUND(AVG(p.amount), 2) AS avg_booking_revenue,
    MIN(p.amount) AS min_booking_revenue,
    MAX(p.amount) AS max_booking_revenue,
    COUNT(DISTINCT c.customer_id) AS unique_customers,
    ROUND(AVG(hr.rating), 2) AS avg_customer_rating,
    COUNT(hr.review_id) AS total_reviews
FROM Hotel h
LEFT JOIN Room r ON h.hotel_id = r.hotel_id
LEFT JOIN Booking_Room br ON r.room_id = br.room_id
LEFT JOIN Booking b ON br.booking_id = b.booking_id
LEFT JOIN Payment p ON b.booking_id = p.booking_id
LEFT JOIN Customer c ON b.customer_id = c.customer_id
LEFT JOIN Hotel_Reviews hr ON h.hotel_id = hr.hotel_id AND hr.is_public = 'Y'
GROUP BY h.hotel_id, h.name, h.location, h.rating;

---- 5. Employee Performance View
CREATE OR REPLACE VIEW Employee_Performance AS
SELECT 
    e.employee_id,
    e.first_name || ' ' || e.last_name AS employee_name,
    e.role,
    e.department,
    e.hire_date,
    COUNT(b.booking_id) AS total_bookings_handled,
    COUNT(CASE WHEN b.status = 'Confirmed' THEN 1 END) AS confirmed_bookings,
    COUNT(CASE WHEN b.status = 'Pending' THEN 1 END) AS pending_bookings,
    SUM(p.amount) AS total_revenue_generated,
    COUNT(DISTINCT b.customer_id) AS unique_customers_served,
    ROUND(AVG(p.amount), 2) AS avg_booking_value,
    MAX(b.booking_date) AS last_booking_date
FROM Employee e
LEFT JOIN Booking b ON e.employee_id = b.employee_id
LEFT JOIN Payment p ON b.booking_id = p.booking_id
GROUP BY e.employee_id, e.first_name, e.last_name, e.role, e.department, e.hire_date;

---- 6. Package Performance View
CREATE OR REPLACE VIEW Package_Performance AS
SELECT 
    p.package_id,
    p.package_name,
    p.price AS package_price,
    p.description,
    COUNT(pd.booking_id) AS times_booked,
    COUNT(DISTINCT pd.flight_id) AS flights_included,
    COUNT(DISTINCT pd.room_id) AS rooms_included,
    COUNT(DISTINCT b.customer_id) AS unique_customers,
    SUM(py.amount) AS total_revenue,
    ROUND(AVG(py.amount), 2) AS avg_booking_value
FROM Package p
LEFT JOIN Package_Detail pd ON p.package_id = pd.package_id
LEFT JOIN Booking b ON pd.booking_id = b.booking_id
LEFT JOIN Payment py ON b.booking_id = py.booking_id
GROUP BY p.package_id, p.package_name, p.price, p.description;

---- 7. Flight Utilization View
CREATE OR REPLACE VIEW Flight_Utilization AS
SELECT 
    f.flight_id,
    f.flight_number,
    f.departure_airport,
    f.arrival_airport,
    f.departure_time,
    f.arrival_time,
    f.price AS flight_price,
    f.airline,
    f.available_seats,
    COUNT(bf.booking_id) AS times_booked,
    COUNT(DISTINCT b.customer_id) AS unique_passengers,
    SUM(p.amount) AS total_revenue_generated,
    ROUND(AVG(p.amount), 2) AS avg_booking_value
FROM Flight f
LEFT JOIN Booking_Flight bf ON f.flight_id = bf.flight_id
LEFT JOIN Booking b ON bf.booking_id = b.booking_id
LEFT JOIN Payment p ON b.booking_id = p.booking_id
GROUP BY f.flight_id, f.flight_number, f.departure_airport, f.arrival_airport, f.departure_time, f.arrival_time, f.price, f.airline, f.available_seats;

---- 8. Customer Preferences Analysis View
CREATE OR REPLACE VIEW Customer_Preferences_Analysis AS
SELECT 
    c.customer_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.loyalty_tier,
    LISTAGG(cp.preference_type || ': ' || cp.preference_value, '; ') WITHIN GROUP (ORDER BY cp.priority DESC) AS preferences,
    COUNT(cp.preference_id) AS total_preferences,
    COUNT(DISTINCT cp.preference_type) AS unique_preference_types,
    MAX(cp.priority) AS highest_priority_level
FROM Customer c
LEFT JOIN Customer_Preferences cp ON c.customer_id = cp.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name, c.loyalty_tier;

-- 9. Hotel Amenities Summary View
CREATE OR REPLACE VIEW Hotel_Amenities_Summary AS
SELECT 
    h.hotel_id,
    h.name AS hotel_name,
    h.location,
    h.rating,
    LISTAGG(ha.amenity_name, ', ') WITHIN GROUP (ORDER BY ha.amenity_type) AS all_amenities,
    COUNT(ha.amenity_id) AS total_amenities,
    COUNT(CASE WHEN ha.is_free = 'Y' THEN 1 END) AS free_amenities,
    COUNT(CASE WHEN ha.available_24_7 = 'Y' THEN 1 END) AS available_24_7_amenities
FROM Hotel h
LEFT JOIN Hotel_Amenities ha ON h.hotel_id = ha.hotel_id
GROUP BY h.hotel_id, h.name, h.location, h.rating;

---- 10. Booking Timeline View
CREATE OR REPLACE VIEW Booking_Timeline AS
SELECT 
    b.booking_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    e.first_name || ' ' || e.last_name AS employee_name,
    b.booking_date,
    b.status,
    MIN(br.check_in_date) AS check_in_date,
    MAX(br.check_out_date) AS check_out_date,
    (MAX(br.check_out_date) - MIN(br.check_in_date)) AS stay_duration,
    LISTAGG(DISTINCT h.name, ', ') WITHIN GROUP (ORDER BY h.name) AS hotels,
    LISTAGG(DISTINCT f.flight_number, ', ') WITHIN GROUP (ORDER BY f.departure_time) AS flights,
    p.amount AS total_payment,
    p.method AS payment_method
FROM Booking b
LEFT JOIN Customer c ON b.customer_id = c.customer_id
LEFT JOIN Employee e ON b.employee_id = e.employee_id
LEFT JOIN Booking_Room br ON b.booking_id = br.booking_id
LEFT JOIN Room r ON br.room_id = r.room_id
LEFT JOIN Hotel h ON r.hotel_id = h.hotel_id
LEFT JOIN Booking_Flight bf ON b.booking_id = bf.booking_id
LEFT JOIN Flight f ON bf.flight_id = f.flight_id
LEFT JOIN Payment p ON b.booking_id = p.booking_id
GROUP BY b.booking_id, c.first_name, c.last_name, e.first_name, e.last_name, b.booking_date, b.status, p.amount, p.method;

---- 11. Review Analysis View
CREATE OR REPLACE VIEW Review_Analysis AS
SELECT 
    hr.review_id,
    h.name AS hotel_name,
    h.location,
    c.first_name || ' ' || c.last_name AS customer_name,
    hr.rating,
    hr.review_title,
    hr.review_date,
    hr.verified_stay,
    hr.travel_type,
    hr.helpful_count,
    hr.not_helpful_count,
    CASE 
        WHEN hr.helpful_count + hr.not_helpful_count = 0 THEN 0
        ELSE ROUND((hr.helpful_count * 100.0 / (hr.helpful_count + hr.not_helpful_count)), 2)
    END AS helpfulness_percentage,
    hr.response_text,
    hr.response_date
FROM Hotel_Reviews hr
JOIN Hotel h ON hr.hotel_id = h.hotel_id
JOIN Customer c ON hr.customer_id = c.customer_id
WHERE hr.is_public = 'Y';

---- 12. Monthly Revenue Trend View
CREATE OR REPLACE VIEW Monthly_Revenue_Trend AS
SELECT 
    TO_CHAR(p.payment_date, 'YYYY-MM') AS payment_month,
    COUNT(p.payment_id) AS total_payments,
    SUM(p.amount) AS total_revenue,
    ROUND(AVG(p.amount), 2) AS avg_payment_amount,
    COUNT(DISTINCT b.customer_id) AS unique_customers,
    COUNT(DISTINCT b.booking_id) AS total_bookings
FROM Payment p
JOIN Booking b ON p.booking_id = b.booking_id
GROUP BY TO_CHAR(p.payment_date, 'YYYY-MM')
ORDER BY payment_month DESC;

---- 13. Customer Loyalty Analysis View
CREATE OR REPLACE VIEW Customer_Loyalty_Analysis AS
SELECT 
    c.customer_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.loyalty_tier,
    c.loyalty_points,
    CASE 
        WHEN c.loyalty_points >= 3000 THEN 'PLATINUM'
        WHEN c.loyalty_points >= 2000 THEN 'GOLD'
        WHEN c.loyalty_points >= 1000 THEN 'SILVER'
        ELSE 'BRONZE'
    END AS calculated_tier,
    COUNT(b.booking_id) AS total_bookings,
    SUM(p.amount) AS total_spent,
    ROUND(SUM(p.amount) / NULLIF(COUNT(b.booking_id), 0), 2) AS avg_booking_value,
    COUNT(DISTINCT TO_CHAR(b.booking_date, 'YYYY-MM')) AS active_months,
    COUNT(w.wishlist_id) AS wishlist_items,
    COUNT(f.favorite_id) AS favorite_items
FROM Customer c
LEFT JOIN Booking b ON c.customer_id = b.customer_id
LEFT JOIN Payment p ON b.booking_id = p.booking_id
LEFT JOIN Wishlist w ON c.customer_id = w.customer_id
LEFT JOIN Favorites f ON c.customer_id = f.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name, c.loyalty_tier, c.loyalty_points;

---- 14. Room Type Performance View
CREATE OR REPLACE VIEW Room_Type_Performance AS
SELECT 
    r.room_type,
    COUNT(DISTINCT r.room_id) AS total_rooms,
    COUNT(DISTINCT br.booking_id) AS times_booked,
    ROUND(AVG(r.price_per_night), 2) AS avg_price_per_night,
    SUM(p.amount) AS total_revenue,
    ROUND(AVG(p.amount), 2) AS avg_booking_value,
    COUNT(DISTINCT h.hotel_id) AS hotels_offering,
    ROUND(AVG(hr.rating), 2) AS avg_rating_for_type
FROM Room r
LEFT JOIN Booking_Room br ON r.room_id = br.room_id
LEFT JOIN Booking b ON br.booking_id = b.booking_id
LEFT JOIN Payment p ON b.booking_id = p.booking_id
LEFT JOIN Hotel h ON r.hotel_id = h.hotel_id
LEFT JOIN Hotel_Reviews hr ON h.hotel_id = hr.hotel_id AND hr.room_type_reviewed = r.room_type
GROUP BY r.room_type;

---- 15. Customer Segmentation View
CREATE OR REPLACE VIEW Customer_Segmentation AS
SELECT 
    c.customer_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.loyalty_tier,
    c.loyalty_points,
    COUNT(b.booking_id) AS booking_frequency,
    SUM(p.amount) AS total_spend,
    ROUND(AVG(p.amount), 2) AS avg_booking_value,
    CASE 
        WHEN COUNT(b.booking_id) >= 5 AND SUM(p.amount) >= 5000 THEN 'VIP'
        WHEN COUNT(b.booking_id) >= 3 AND SUM(p.amount) >= 2000 THEN 'FREQUENT'
        WHEN COUNT(b.booking_id) >= 1 THEN 'OCCASIONAL'
        ELSE 'PROSPECT'
    END AS customer_segment,
    COUNT(w.wishlist_id) AS wishlist_count,
    COUNT(f.favorite_id) AS favorite_count,
    MAX(b.booking_date) AS last_booking_date
FROM Customer c
LEFT JOIN Booking b ON c.customer_id = b.customer_id
LEFT JOIN Payment p ON b.booking_id = p.booking_id
LEFT JOIN Wishlist w ON c.customer_id = w.customer_id
LEFT JOIN Favorites f ON c.customer_id = f.customer_id
GROUP BY c.customer_id, c.first_name, c.last_name, c.loyalty_tier, c.loyalty_points;

---- 16. Seasonal Booking Pattern View
CREATE OR REPLACE VIEW Seasonal_Booking_Pattern AS
SELECT 
    TO_CHAR(b.booking_date, 'MM') AS booking_month,
    TO_CHAR(b.booking_date, 'Month') AS month_name,
    COUNT(b.booking_id) AS total_bookings,
    SUM(p.amount) AS total_revenue,
    ROUND(AVG(p.amount), 2) AS avg_booking_value,
    COUNT(DISTINCT b.customer_id) AS unique_customers,
    ROUND(COUNT(b.booking_id) * 100.0 / (SELECT COUNT(*) FROM Booking), 2) AS percentage_of_total
FROM Booking b
LEFT JOIN Payment p ON b.booking_id = p.booking_id
GROUP BY TO_CHAR(b.booking_date, 'MM'), TO_CHAR(b.booking_date, 'Month')
ORDER BY booking_month;

---- 17. Hotel Performance Comparison View
CREATE OR REPLACE VIEW Hotel_Performance_Comparison AS
SELECT 
    h.hotel_id,
    h.name AS hotel_name,
    h.location,
    h.rating,
    h.average_rating,
    COUNT(DISTINCT b.booking_id) AS total_bookings,
    SUM(p.amount) AS total_revenue,
    ROUND(SUM(p.amount) / NULLIF(COUNT(DISTINCT b.booking_id), 0), 2) AS revenue_per_booking,
    COUNT(hr.review_id) AS total_reviews,
    ROUND(AVG(hr.rating), 2) AS avg_customer_rating,
    COUNT(DISTINCT r.room_id) AS total_rooms,
    ROUND(COUNT(DISTINCT b.booking_id) * 100.0 / NULLIF(COUNT(DISTINCT r.room_id) * 12, 0), 2) AS estimated_occupancy_rate
FROM Hotel h
LEFT JOIN Room r ON h.hotel_id = r.hotel_id
LEFT JOIN Booking_Room br ON r.room_id = br.room_id
LEFT JOIN Booking b ON br.booking_id = b.booking_id
LEFT JOIN Payment p ON b.booking_id = p.booking_id
LEFT JOIN Hotel_Reviews hr ON h.hotel_id = hr.hotel_id
GROUP BY h.hotel_id, h.name, h.location, h.rating, h.average_rating;


CREATE OR REPLACE VIEW hotel_complete_info AS
SELECT 
    h.hotel_id,
    h.name AS hotel_name,
    h.location,
    h.rating,
    h.average_rating,
    h.description,
    h.amenities AS hotel_amenities,
    h.price_per_night AS base_price,
    h.photo_url,
    
    -- Room information
    r.room_id,
    r.room_type,
    r.price_per_night AS room_price,
    r.available_rooms,
    r.max_occupancy,
    r.amenities AS room_amenities,
    
    -- Availability calculation
    CASE 
        WHEN r.available_rooms > 0 THEN 'Available'
        ELSE 'Sold Out'
    END AS availability_status,
    
    -- Price range for the hotel
    (SELECT MIN(price_per_night) FROM rooms WHERE hotel_id = h.hotel_id) AS min_room_price,
    (SELECT MAX(price_per_night) FROM rooms WHERE hotel_id = h.hotel_id) AS max_room_price,
    
    -- Room count by type
    (SELECT COUNT(*) FROM rooms WHERE hotel_id = h.hotel_id AND room_type = r.room_type) AS room_type_count,
    
    -- Total rooms in hotel
    (SELECT COUNT(*) FROM rooms WHERE hotel_id = h.hotel_id) AS total_rooms,
    
    -- Available rooms count
    (SELECT SUM(available_rooms) FROM rooms WHERE hotel_id = h.hotel_id) AS total_available_rooms,
    
    -- Average room rating (if you have room ratings)
    (SELECT AVG(rating) FROM room_reviews WHERE room_id = r.room_id) AS room_avg_rating
    
FROM hotels h
LEFT JOIN rooms r ON h.hotel_id = r.hotel_id
WHERE h.hotel_id IS NOT NULL;



CREATE OR REPLACE VIEW hotel_summary_view AS
SELECT 
    h.hotel_id,
    h.name AS hotel_name,
    h.location,
    h.rating,
    h.average_rating,
    h.description,
    h.amenities,
    h.price_per_night,
    h.website_url,
    (SELECT COUNT(*) FROM room WHERE hotel_id = h.hotel_id) AS total_rooms,
    (SELECT COUNT(DISTINCT room_type) FROM room WHERE hotel_id = h.hotel_id) AS room_types_available,
    (SELECT MIN(price_per_night) FROM room WHERE hotel_id = h.hotel_id) AS starting_price,
    (SELECT MAX(max_occupancy) FROM room WHERE hotel_id = h.hotel_id) AS max_occupancy_available,
    
    
FROM hotel h
ORDER BY h.average_rating DESC;

COMMIT;

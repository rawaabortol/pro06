---- ============================================
---- CREATE INDEXES
---- ============================================
--
---- Hotel Photos indexes
CREATE INDEX idx_hotel_photos_hotel_id ON Hotel_Photos(hotel_id);
CREATE INDEX idx_hotel_photos_primary ON Hotel_Photos(hotel_id, is_primary);
CREATE INDEX idx_hotel_photos_type ON Hotel_Photos(photo_type);

---- Wishlist indexes
CREATE INDEX idx_wishlist_customer_id ON Wishlist(customer_id);
CREATE INDEX idx_wishlist_hotel_id ON Wishlist(hotel_id);
CREATE INDEX idx_wishlist_package_id ON Wishlist(package_id);
CREATE INDEX idx_wishlist_public ON Wishlist(is_public, share_token);

---- Favorites indexes
CREATE INDEX idx_favorites_customer_id ON Favorites(customer_id);
CREATE INDEX idx_favorites_hotel_id ON Favorites(hotel_id);
CREATE INDEX idx_favorites_type ON Favorites(favorite_type);

---- Visited Places indexes
CREATE INDEX idx_visited_customer_id ON Visited_Places(customer_id);
CREATE INDEX idx_visited_hotel_id ON Visited_Places(hotel_id);
CREATE INDEX idx_visited_date ON Visited_Places(visit_date);

---- Hotel Reviews indexes
CREATE INDEX idx_reviews_hotel_id ON Hotel_Reviews(hotel_id);
CREATE INDEX idx_reviews_customer_id ON Hotel_Reviews(customer_id);
CREATE INDEX idx_reviews_rating ON Hotel_Reviews(hotel_id, rating);
CREATE INDEX idx_reviews_date ON Hotel_Reviews(review_date);
CREATE INDEX idx_reviews_verified ON Hotel_Reviews(hotel_id, verified_stay);

---- Review Helpful Votes indexes
CREATE INDEX idx_votes_review_id ON Review_Helpful_Votes(review_id);
CREATE INDEX idx_votes_customer_id ON Review_Helpful_Votes(customer_id);

---- Customer indexes
CREATE INDEX idx_customer_email ON Customer(email);
CREATE INDEX idx_customer_active ON Customer(is_active);
CREATE INDEX idx_customer_loyalty ON Customer(loyalty_tier, loyalty_points);

---- Employee indexes
CREATE INDEX idx_employee_email ON Employee(email);
CREATE INDEX idx_employee_role ON Employee(role);
CREATE INDEX idx_employee_active ON Employee(is_active);

---- Search History indexes
CREATE INDEX idx_search_customer_id ON Search_History(customer_id);
CREATE INDEX idx_search_date ON Search_History(search_date);
CREATE INDEX idx_search_type ON Search_History(search_type);

---- Notifications indexes
CREATE INDEX idx_notifications_customer_id ON Notifications(customer_id);
CREATE INDEX idx_notifications_unread ON Notifications(customer_id, is_read);
CREATE INDEX idx_notifications_type ON Notifications(notification_type);

---- Flight indexes
CREATE INDEX idx_flight_number ON Flight(flight_number);
CREATE INDEX idx_flight_departure ON Flight(departure_airport, departure_time);
CREATE INDEX idx_flight_arrival ON Flight(arrival_airport, arrival_time);

---- Booking indexes
CREATE INDEX idx_booking_customer ON Booking(customer_id, booking_date);
CREATE INDEX idx_booking_status ON Booking(status);
CREATE INDEX idx_booking_employee ON Booking(employee_id);

COMMIT;

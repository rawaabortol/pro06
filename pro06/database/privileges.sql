---- Grant session to roles
GRANT CREATE SESSION TO c##travel_agent_role;
GRANT CREATE SESSION TO c##travel_manager_role;
GRANT CREATE SESSION TO c##travel_reports_role;
GRANT CREATE SESSION TO c##finance_role;
GRANT CREATE SESSION TO c##customer_service_role;
GRANT CREATE SESSION TO c##marketing_role;

---- Assign roles to users
GRANT c##travel_agent_role TO c##agent_alpha;
GRANT c##travel_manager_role TO c##manager_charlie;
GRANT c##travel_reports_role TO c##reports_eve;
GRANT c##finance_role TO c##finance_analyst;
GRANT c##customer_service_role TO c##customer_service;
GRANT c##marketing_role TO c##marketing_team;

---- Set quotas
ALTER USER c##agent_alpha QUOTA UNLIMITED ON users;
ALTER USER c##manager_charlie QUOTA UNLIMITED ON users;
ALTER USER c##reports_eve QUOTA UNLIMITED ON users;
ALTER USER c##finance_analyst QUOTA UNLIMITED ON users;
ALTER USER c##customer_service QUOTA UNLIMITED ON users;
ALTER USER c##marketing_team QUOTA UNLIMITED ON users;

---- ============================================
---- GRANT PRIVILEGES TO ROLES
---- ============================================
--
---- Travel Agent Role Privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON Customer TO c##travel_agent_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON Booking TO c##travel_agent_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON Payment TO c##travel_agent_role;
GRANT SELECT ON Flight TO c##travel_agent_role;
GRANT SELECT ON Hotel TO c##travel_agent_role;
GRANT SELECT ON Room TO c##travel_agent_role;
GRANT SELECT ON Package TO c##travel_agent_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON Booking_Flight TO c##travel_agent_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON Booking_Room TO c##travel_agent_role;
GRANT SELECT ON Customer_Booking_Summary TO c##travel_agent_role;
GRANT SELECT ON Package_Performance TO c##travel_agent_role;
GRANT SELECT ON Flight_Utilization TO c##travel_agent_role;
GRANT SELECT ON Booking_Timeline TO c##travel_agent_role;
GRANT SELECT ON Review_Analysis TO c##travel_agent_role;

---- Travel Manager Role Privileges
GRANT c##travel_agent_role TO c##travel_manager_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON Employee TO c##travel_manager_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON Package_Detail TO c##travel_manager_role;
GRANT SELECT ON Hotel_Revenue_Analysis TO c##travel_manager_role;
GRANT SELECT ON Employee_Performance TO c##travel_manager_role;
GRANT SELECT ON Monthly_Revenue_Trend TO c##travel_manager_role;
GRANT SELECT ON Customer_Loyalty_Analysis TO c##travel_manager_role;
GRANT SELECT ON Room_Type_Performance TO c##travel_manager_role;
GRANT SELECT ON Customer_Segmentation TO c##travel_manager_role;
GRANT SELECT ON Seasonal_Booking_Pattern TO c##travel_manager_role;
GRANT SELECT ON Hotel_Performance_Comparison TO c##travel_manager_role;

---- Travel Reports Role Privileges
GRANT SELECT ON Customer TO c##travel_reports_role;
GRANT SELECT ON Employee TO c##travel_reports_role;
GRANT SELECT ON Hotel TO c##travel_reports_role;
GRANT SELECT ON Room TO c##travel_reports_role;
GRANT SELECT ON Flight TO c##travel_reports_role;
GRANT SELECT ON Package TO c##travel_reports_role;
GRANT SELECT ON Booking TO c##travel_reports_role;
GRANT SELECT ON Payment TO c##travel_reports_role;
GRANT SELECT ON Booking_Flight TO c##travel_reports_role;
GRANT SELECT ON Booking_Room TO c##travel_reports_role;
GRANT SELECT ON Package_Detail TO c##travel_reports_role;
GRANT SELECT ON Sales_Report TO c##travel_reports_role;
GRANT SELECT ON Customer_Booking_Summary TO c##travel_reports_role;
GRANT SELECT ON Hotel_Revenue_Analysis TO c##travel_reports_role;
GRANT SELECT ON Employee_Performance TO c##travel_reports_role;
GRANT SELECT ON Package_Performance TO c##travel_reports_role;
GRANT SELECT ON Flight_Utilization TO c##travel_reports_role;
GRANT SELECT ON Customer_Preferences_Analysis TO c##travel_reports_role;
GRANT SELECT ON Hotel_Amenities_Summary TO c##travel_reports_role;
GRANT SELECT ON Booking_Timeline TO c##travel_reports_role;
GRANT SELECT ON Review_Analysis TO c##travel_reports_role;
GRANT SELECT ON Monthly_Revenue_Trend TO c##travel_reports_role;
GRANT SELECT ON Customer_Loyalty_Analysis TO c##travel_reports_role;
GRANT SELECT ON Room_Type_Performance TO c##travel_reports_role;
GRANT SELECT ON Customer_Segmentation TO c##travel_reports_role;
GRANT SELECT ON Seasonal_Booking_Pattern TO c##travel_reports_role;
GRANT SELECT ON Hotel_Performance_Comparison TO c##travel_reports_role;

---- Finance Role Privileges
GRANT SELECT ON Customer_Booking_Summary TO c##finance_role;
GRANT SELECT ON Hotel_Revenue_Analysis TO c##finance_role;
GRANT SELECT ON Package_Performance TO c##finance_role;
GRANT SELECT ON Flight_Utilization TO c##finance_role;
GRANT SELECT ON Monthly_Revenue_Trend TO c##finance_role;
GRANT SELECT ON Payment TO c##finance_role;
GRANT SELECT ON Booking TO c##finance_role;
GRANT SELECT ON Sales_Report TO c##finance_role;
GRANT SELECT ON Customer_Segmentation TO c##finance_role;
GRANT SELECT ON Seasonal_Booking_Pattern TO c##finance_role;
GRANT SELECT ON Hotel_Performance_Comparison TO c##finance_role;

---- Customer Service Role Privileges
GRANT SELECT ON Customer_Booking_Summary TO c##customer_service_role;
GRANT SELECT ON Booking_Timeline TO c##customer_service_role;
GRANT SELECT ON Review_Analysis TO c##customer_service_role;
GRANT SELECT ON Customer_Preferences_Analysis TO c##customer_service_role;
GRANT SELECT ON Customer TO c##customer_service_role;
GRANT SELECT ON Booking TO c##customer_service_role;
GRANT SELECT ON Hotel_Reviews TO c##customer_service_role;
GRANT UPDATE ON Customer TO c##customer_service_role;
GRANT UPDATE ON Booking TO c##customer_service_role;

-- Marketing Role Privileges
GRANT SELECT ON Customer_Loyalty_Analysis TO c##marketing_role;
GRANT SELECT ON Customer_Preferences_Analysis TO c##marketing_role;
GRANT SELECT ON Package_Performance TO c##marketing_role;
GRANT SELECT ON Monthly_Revenue_Trend TO c##marketing_role;
GRANT SELECT ON Review_Analysis TO c##marketing_role;
GRANT SELECT ON Search_History TO c##marketing_role;
GRANT SELECT ON Customer TO c##marketing_role;
GRANT SELECT ON Notifications TO c##marketing_role;
GRANT INSERT ON Notifications TO c##marketing_role;
GRANT UPDATE ON Notifications TO c##marketing_role;
GRANT SELECT ON Customer_Segmentation TO c##marketing_role;
GRANT SELECT ON Seasonal_Booking_Pattern TO c##marketing_role;

COMMIT;
--

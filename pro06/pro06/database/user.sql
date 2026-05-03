---- Create users
CREATE USER c##agent_alpha IDENTIFIED BY "Agent_Alpha_1" 
DEFAULT TABLESPACE users 
PROFILE c##travel_app_profile;

CREATE USER c##manager_charlie IDENTIFIED BY "Manager_Charlie_1" 
DEFAULT TABLESPACE users 
PROFILE c##manager_profile;

CREATE USER c##reports_eve IDENTIFIED BY "Reports_Eve_1" 
DEFAULT TABLESPACE users 
PROFILE c##travel_app_profile;

CREATE USER c##finance_analyst IDENTIFIED BY "Finance_Analyst1"
DEFAULT TABLESPACE users
PROFILE c##travel_app_profile;

CREATE USER c##customer_service IDENTIFIED BY "Customer_Service1"
DEFAULT TABLESPACE users
PROFILE c##travel_app_profile;

CREATE USER c##marketing_team IDENTIFIED BY "Marketing_Team1"
DEFAULT TABLESPACE users
PROFILE c##travel_app_profile;

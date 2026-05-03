
export enum UserRole {
    CUSTOMER = 'CUSTOMER',
    EMPLOYEE = 'EMPLOYEE'
}

export enum EmployeeRole {
    AGENT = 'Travel Agent',
    SENIOR_AGENT = 'Senior Travel Agent',
    MANAGER = 'Sales Manager',
    CONSULTANT = 'Travel Consultant',
    ADMIN = 'System Administrator'
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    employeeRole?: EmployeeRole;
    department?: string;
    loyaltyTier?: string;
    loyaltyPoints?: number;
    profilePictureUrl?: string;
    hireDate?: string;
    salary?: number;
}

export interface Hotel {
    hotel_id: number;
    name: string;
    location: string;
    rating: number;
    description: string;
    amenities: string;
    price_range?: string;
    price_per_night?: number; 
    photo_url: string;
    review_count: number;
    average_rating: number;
}


export interface Room {
    room_id: number;
    hotel_id: number;
    room_number: string;
    room_type: string;
    price_per_night: number;
    max_occupancy: number;
    amenities: string;
    description: string;
    room_size: string;
    bed_type: string;
    photo_url: string;
    view_type?: string; // Derived from city_view, sea_view columns etc
}

export interface Review {
    review_id: number;
    customer_name: string;
    rating: number;
    review_text: string;
    review_date: string;
    room_type_reviewed: string;
}


export interface Flight {
    flight_id: number;
    flight_number: string;
    airline: string;
    departure_airport: string;
    arrival_airport: string;
    departure_time: string;
    arrival_time: string;
    price: number;
    duration: string; 
    available_seats: number;
}

export interface Package {
    package_id: number;
    package_name: string;
    price: number;
    description: string;
    duration_days: number;
    photo_url: string;
}

export interface PackageDetails {
    package: Package;
    hotel: Hotel | null;
    flight: Flight | null;
}

export interface Booking {
    booking_id: number;
    customer_id: number;
    hotel_name: string; 
    photo_url?: string;
    booking_date: string;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
    total_amount: number;
    check_in: string;
    check_out: string;
    guests?: number;
    room_type?: string;
}

export interface RegisterCredentials {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
}


export interface FlightBooking {
    booking_id: number;
    flight_number: string;
    airline: string;
    departure_airport: string;
    arrival_airport: string;
    departure_time: string;
    arrival_time: string;
    seat_class: string;
    status: string;
    total_amount: number;
    passengers: number;
}

export enum InquiryStatus {
    NEW = 'New',
    IN_PROGRESS = 'In Progress',
    RESOLVED = 'Resolved'
}

export interface Inquiry {
    id: number;
    customer_id: number;
    customer_name: string;
    destination: string;
    dates: string;
    budget: string;
    travelers: number;
    notes: string;
    status: InquiryStatus;
    created_at: string;
}

export interface AnalyticData {
    name: string;
    value: number;
}

export interface Notification {
    id: number;
    title: string;
    message: string;
    isRead: boolean;
    type: string;
    date: string;
}

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    method?: string;
    status: 'COMPLETED' | 'PENDING';
    customerName?: string;
    customerEmail?: string;
    hotelName?: string;
    roomType?: string;
    bookingId?: number;
}

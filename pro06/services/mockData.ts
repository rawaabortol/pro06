
import { User, UserRole, EmployeeRole, Hotel, Booking, Notification, Inquiry, InquiryStatus, Flight, Package } from '../types';

// Simulating Database Tables

export const MOCK_EMPLOYEES: User[] = [
    {
        id: 100,
        firstName: 'James',
        lastName: 'Eve',
        email: 'james.eve@travelagency.com',
        role: UserRole.EMPLOYEE,
        employeeRole: EmployeeRole.ADMIN,
        department: 'IT'
    },
    {
        id: 1,
        firstName: 'Michael',
        lastName: 'Alpha',
        email: 'michael.alpha@travelagency.com',
        role: UserRole.EMPLOYEE,
        employeeRole: EmployeeRole.AGENT,
        department: 'Sales'
    },
    {
        id: 2,
        firstName: 'Sarah',
        lastName: 'Beta',
        email: 'sarah.beta@travelagency.com',
        role: UserRole.EMPLOYEE,
        employeeRole: EmployeeRole.SENIOR_AGENT,
        department: 'Sales'
    },
    {
        id: 3,
        firstName: 'David',
        lastName: 'Charlie',
        email: 'david.charlie@travelagency.com',
        role: UserRole.EMPLOYEE,
        employeeRole: EmployeeRole.MANAGER, 
        department: 'Management'
    },
    {
        id: 4,
        firstName: 'Emily',
        lastName: 'Delta',
        email: 'emily.delta@travelagency.com',
        role: UserRole.EMPLOYEE,
        employeeRole: EmployeeRole.CONSULTANT,
        department: 'Customer Service'
    }
];

export const MOCK_CUSTOMERS: User[] = [
    {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: UserRole.CUSTOMER,
        loyaltyTier: 'SILVER',
        loyaltyPoints: 1500,
        profilePictureUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        role: UserRole.CUSTOMER,
        loyaltyTier: 'BRONZE',
        loyaltyPoints: 800,
        profilePictureUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: 4,
        firstName: 'Robert',
        lastName: 'Brown',
        email: 'robert.brown@example.com',
        role: UserRole.CUSTOMER,
        loyaltyTier: 'GOLD',
        loyaltyPoints: 3200,
        profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
];

export const MOCK_HOTELS: Hotel[] = [
    {
        hotel_id: 1,
        name: 'Grand Plaza',
        location: 'Paris, France',
        rating: 5,
        description: 'Experience luxury at its finest in the heart of Paris. The Grand Plaza offers stunning Eiffel Tower views.',
        amenities: 'Free WiFi, Spa, Pool, Fine Dining',
        photo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
        review_count: 1240,
        average_rating: 4.8,
        price_per_night: 450
    },
    {
        hotel_id: 2,
        name: 'Ocean View Resort',
        location: 'Bali, Indonesia',
        rating: 4,
        description: 'Escape to paradise at our beachfront oasis in Bali. Traditional architecture meets modern luxury.',
        amenities: 'Beach Access, Infinity Pool, Yoga',
        photo_url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1749&q=80',
        review_count: 850,
        average_rating: 4.6,
        price_per_night: 220
    },
    {
        hotel_id: 4,
        name: 'Mountain Lodge',
        location: 'Zurich, Switzerland',
        rating: 4,
        description: 'Nestled in the Swiss Alps, Mountain Lodge offers breathtaking mountain views and skiing.',
        amenities: 'Ski-in/Ski-out, Fireplace, Sauna',
        photo_url: 'https://images.unsplash.com/photo-1519602076789-459dd825da29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
        review_count: 500,
        average_rating: 4.7,
        price_per_night: 380
    },
    {
        hotel_id: 5,
        name: 'Sunset Hotel',
        location: 'Miami, USA',
        rating: 5,
        description: 'Miami\'s premier beachfront hotel offering Art Deco elegance with modern luxury.',
        amenities: 'Rooftop Pool, Nightclub, Valet',
        photo_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
        review_count: 2100,
        average_rating: 4.5,
        price_per_night: 550
    },
     {
        hotel_id: 7,
        name: 'Luxury Suites',
        location: 'Tokyo, Japan',
        rating: 5,
        description: 'Ultra-luxurious suites in the heart of Tokyo with panoramic city views.',
        amenities: 'Butler Service, Infinity Pool, Spa',
        photo_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80',
        review_count: 300,
        average_rating: 4.9,
        price_per_night: 600
    }
];

export const MOCK_FLIGHTS: Flight[] = [
    {
        flight_id: 1,
        flight_number: 'F101',
        airline: 'Air France',
        departure_airport: 'JFK',
        arrival_airport: 'CDG',
        departure_time: '2025-11-01 08:00:00',
        arrival_time: '2025-11-01 17:00:00',
        price: 750.00,
        duration: '9h 00m',
        available_seats: 45
    },
    {
        flight_id: 3,
        flight_number: 'F201',
        airline: 'British Airways',
        departure_airport: 'LHR',
        arrival_airport: 'DPS',
        departure_time: '2025-12-05 22:00:00',
        arrival_time: '2025-12-06 18:00:00',
        price: 1200.00,
        duration: '16h 00m',
        available_seats: 28
    },
    {
        flight_id: 5,
        flight_number: 'F301',
        airline: 'Swiss International',
        departure_airport: 'MIA',
        arrival_airport: 'ZRH',
        departure_time: '2025-12-20 09:00:00',
        arrival_time: '2025-12-20 18:00:00',
        price: 950.00,
        duration: '9h 00m',
        available_seats: 15
    },
    {
        flight_id: 7,
        flight_number: 'F401',
        airline: 'Lufthansa',
        departure_airport: 'BER',
        arrival_airport: 'HND',
        departure_time: '2025-10-10 15:00:00',
        arrival_time: '2025-10-11 10:00:00',
        price: 1500.00,
        duration: '12h 00m',
        available_seats: 8
    }
];

export const MOCK_PACKAGES: Package[] = [
    {
        package_id: 1,
        package_name: 'Parisian Romance',
        price: 1500.00,
        description: 'Includes flights and a 5-star hotel stay in Paris. Experience the city of love with luxury accommodation.',
        duration_days: 7,
        photo_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80'
    },
    {
        package_id: 2,
        package_name: 'Bali Adventure',
        price: 1800.00,
        description: 'Flights, hotel, and activities in Bali. Explore tropical paradise with cultural tours.',
        duration_days: 10,
        photo_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1038&q=80'
    },
    {
        package_id: 3,
        package_name: 'Swiss Ski Trip',
        price: 1150.00,
        description: 'Flights and a mountain lodge stay in Zurich. Perfect for skiing enthusiasts.',
        duration_days: 8,
        photo_url: 'https://images.unsplash.com/photo-1551524559-8af4e6698bce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1026&q=80'
    },
     {
        package_id: 4,
        package_name: 'Tokyo Explorer',
        price: 2500.00,
        description: 'Flights, luxury hotel, and city tours in Tokyo. Discover modern technology and traditional culture.',
        duration_days: 9,
        photo_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80'
    }
];

export const MOCK_BOOKINGS: Booking[] = [
    {
        booking_id: 1,
        customer_id: 1,
        hotel_name: 'Grand Plaza',
        booking_date: '2025-09-20',
        status: 'Confirmed',
        total_amount: 1500.00,
        check_in: '2025-11-01',
        check_out: '2025-11-09',
        guests: 2
    },
    {
        booking_id: 9,
        customer_id: 1, 
        hotel_name: 'Mountain Lodge',
        booking_date: '2025-09-30',
        status: 'Confirmed',
        total_amount: 1500.00,
        check_in: '2025-12-20',
        check_out: '2025-12-27',
        guests: 1
    },
    {
        booking_id: 2,
        customer_id: 2,
        hotel_name: 'Ocean View Resort',
        booking_date: '2025-10-01',
        status: 'Confirmed',
        total_amount: 1800.00,
        check_in: '2025-12-05',
        check_out: '2025-12-14',
        guests: 2
    },
     {
        booking_id: 4,
        customer_id: 4,
        hotel_name: 'Sunset Hotel',
        booking_date: '2025-10-05',
        status: 'Pending',
        total_amount: 850.00,
        check_in: '2025-12-20',
        check_out: '2025-12-27',
        guests: 1
    }
];

export const MOCK_INQUIRIES: Inquiry[] = [
    {
        id: 101,
        customer_id: 1,
        customer_name: "John Doe",
        destination: "Kyoto, Japan",
        dates: "April 2026",
        budget: "$5000 - $7000",
        travelers: 2,
        notes: "Interested in cherry blossom season and traditional Ryokans.",
        status: InquiryStatus.NEW,
        created_at: "2025-10-15"
    },
    {
        id: 102,
        customer_id: 2,
        customer_name: "Jane Smith",
        destination: "Santorini, Greece",
        dates: "Summer 2026",
        budget: "$4000",
        travelers: 4,
        notes: "Looking for a villa with a private pool for a girls' trip.",
        status: InquiryStatus.IN_PROGRESS,
        created_at: "2025-10-18"
    }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    { id: 1, title: "Booking Confirmed", message: "Your stay at Grand Plaza Hotel has been confirmed!", isRead: false, type: "BOOKING", date: "2025-09-20" },
    { id: 2, title: "Price Drop Alert", message: "Ocean View Resort prices dropped by 15%.", isRead: false, type: "PROMO", date: "2025-09-22" }
];

// New Finance Data
export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    status: 'COMPLETED' | 'PENDING';
    category: string;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'TXN-1001', date: '2025-10-15', description: 'Booking #1 - Grand Plaza', amount: 1500.00, type: 'CREDIT', status: 'COMPLETED', category: 'Booking' },
    { id: 'TXN-1002', date: '2025-10-16', description: 'Booking #2 - Ocean View', amount: 1800.00, type: 'CREDIT', status: 'COMPLETED', category: 'Booking' },
    { id: 'TXN-1003', date: '2025-10-16', description: 'Vendor Payment - Hyatt Group', amount: 4500.00, type: 'DEBIT', status: 'COMPLETED', category: 'Vendor Payout' },
    { id: 'TXN-1004', date: '2025-10-17', description: 'Booking #4 - Sunset Hotel', amount: 850.00, type: 'CREDIT', status: 'PENDING', category: 'Booking' },
    { id: 'TXN-1005', date: '2025-10-18', description: 'Software License - Adobe', amount: 120.00, type: 'DEBIT', status: 'COMPLETED', category: 'Operations' },
    { id: 'TXN-1006', date: '2025-10-18', description: 'Marketing Campaign - FB', amount: 500.00, type: 'DEBIT', status: 'COMPLETED', category: 'Marketing' },
    { id: 'TXN-1007', date: '2025-10-19', description: 'Booking #9 - Mountain Lodge', amount: 1500.00, type: 'CREDIT', status: 'COMPLETED', category: 'Booking' },
    { id: 'TXN-1008', date: '2025-10-19', description: 'Refund - Booking #3', amount: 250.00, type: 'DEBIT', status: 'COMPLETED', category: 'Refund' },
    { id: 'TXN-1009', date: '2025-10-20', description: 'Office Utilities', amount: 340.00, type: 'DEBIT', status: 'PENDING', category: 'Operations' },
    { id: 'TXN-1010', date: '2025-10-20', description: 'Booking #7 - Luxury Suites', amount: 2100.00, type: 'CREDIT', status: 'COMPLETED', category: 'Booking' },
];

export const MOCK_ANALYTICS_DATA = {
    monthlyData: [
        { name: 'Jan', sales: 4000, visitors: 2400 },
        { name: 'Feb', sales: 3000, visitors: 1398 },
        { name: 'Mar', sales: 2000, visitors: 9800 },
        { name: 'Apr', sales: 2780, visitors: 3908 },
        { name: 'May', sales: 1890, visitors: 4800 },
        { name: 'Jun', sales: 2390, visitors: 3800 },
    ],
    hotelTypeData: [
        { name: 'Luxury Resort', value: 400 },
        { name: 'City Hotel', value: 300 },
        { name: 'Boutique', value: 300 },
        { name: 'Lodge', value: 200 },
    ]
};

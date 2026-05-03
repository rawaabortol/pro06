
import { RegisterCredentials, UserRole } from '../types';

const API_URL = 'http://localhost:5000/api';

// Generic Fetch Wrapper
async function request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
    }
    return response.json();
}

// export const api = {
//     // Auth
//     login: (email: string, role: UserRole) => request('/auth/login', {
//         method: 'POST',
//         body: JSON.stringify({ email, role })
//     }),


export const api = {
    // Auth
    login: (email: string, role: UserRole, password?: string) => request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, role, password })
    }),
    
    register: (data: RegisterCredentials) => request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

 
    // Read Operations
    getHotels: () => request('/hotels'),
    getHotelById: (id: number) => request(`/hotels/${id}`),
    
    // ROOMS (New)
    getHotelRooms: (hotelId: number) => request(`/hotels/${hotelId}/rooms`),
    getRoomReviews: (hotelId: number, roomType: string) => request(`/hotels/${hotelId}/rooms/${encodeURIComponent(roomType)}/reviews`),


    // REVIEWS (New)
    getHotelReviews: (hotelId: number) => request(`/hotels/${hotelId}/reviews`),
    createReview: (data: any) => request('/reviews', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    getFlights: () => request('/flights'),
    getPackages: () => request('/packages'),
    getPackageDetails: (id: number) => request(`/packages/${id}/details`),
    getBookings: () => request('/bookings'),
    getFlightBookings: (customerId: number) => request(`/bookings/flights/${customerId}`), 
    getCustomers: () => request('/customers'),
    getEmployees: () => request('/employees'),
    getTransactions: () => request('/finance/transactions'),
    getAnalytics: () => request('/analytics'),


    // Dashboards
    getCustomerDashboard: (id: number) => request(`/customers/${id}/dashboard`),
    getEmployeeDashboard: (role: string) => request(`/employee/dashboard?role=${encodeURIComponent(role)}`),

    // Write Operations (Bookings)
    createBooking: (data: any) => request('/bookings', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    createFlightBooking: (data: any) => request('/bookings/flight', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateBooking: (id: number, data: any) => request(`/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    // Employees
    createEmployee: (data: any) => request('/employees', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateEmployeeRole: (id: number, role: string) => request(`/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ role })
    }),
    deleteEmployee: (id: number) => request(`/employees/${id}`, { method: 'DELETE' }),


     // Salary Adjustment
    previewSalaryRaise: (rate: number, date: string) => request('/employees/preview-raise', {
        method: 'POST',
        body: JSON.stringify({ rate, date })
    }),
    applySalaryRaise: (rate: number, date: string) => request('/employees/apply-raise', {
        method: 'POST',
        body: JSON.stringify({ rate, date })
    }),

    
    // Wishlist
    getWishlist: (customerId: number) => request(`/wishlist/${customerId}`),
    addToWishlist: (customerId: number, hotelId: number) => request('/wishlist', {
        method: 'POST',
        body: JSON.stringify({ customer_id: customerId, hotel_id: hotelId })
    }),
    removeFromWishlist: (customerId: number, hotelId: number) => request('/wishlist', {
        method: 'DELETE',
        body: JSON.stringify({ customer_id: customerId, hotel_id: hotelId })
    }),

    // Inquiries
    getInquiries: () => request('/inquiries'),
    createInquiry: (data: any) => request('/inquiries', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};
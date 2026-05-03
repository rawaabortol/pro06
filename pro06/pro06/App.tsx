import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { UserRole, EmployeeRole } from './types';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/Auth';
import { LandingPage } from './pages/Landing';
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { HotelsPage } from './pages/Hotels';
import { FlightsPage } from './pages/Flights';
import { PackagesPage } from './pages/Packages';
import { BookingPage } from './pages/Booking';
import { InquiriesPage } from './pages/Inquiries';
import { HotelDetailsPage } from './pages/HotelDetails';
import { HotelRoomsPage } from './pages/HotelRooms';
import { ManageBookingsPage } from './pages/employee/ManageBookings';
import { CustomerDirectoryPage } from './pages/employee/CustomerDirectory';
import { MyBookingsPage } from './pages/customer/MyBookings';
import { MyFlightsPage } from './pages/customer/MyFlights';
import { WishlistPage } from './pages/customer/Wishlist';
import { AnalyticsPage } from './pages/admin/Analytics';
import { FinancePage } from './pages/admin/Finance';
import { SettingsPage } from './pages/admin/Settings';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole, allowedEmployeeRole }: { children: React.ReactNode, allowedRole?: UserRole, allowedEmployeeRole?: EmployeeRole[] }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (allowedRole && user?.role !== allowedRole) {
        return <Navigate to="/dashboard" replace />;
    }

    if (allowedEmployeeRole && user?.employeeRole && !allowedEmployeeRole.includes(user.employeeRole)) {
         return <Navigate to="/dashboard" replace />;
    }

    return <Layout>{children}</Layout>;
};

// Dynamic Dashboard Routing based on Role
const DashboardRouter = () => {
    const { user } = useAuth();
    if (user?.role === UserRole.EMPLOYEE) {
        return <EmployeeDashboard />;
    }
    return <CustomerDashboard />;
};

function App() {
  return (
    <AuthProvider>
        <WishlistProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/auth" element={<AuthPage />} />

                    {/* Protected Routes - Shared */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardRouter />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/hotels" element={
                        <ProtectedRoute>
                            <HotelsPage />
                        </ProtectedRoute>
                    } />
                    
                    <Route path="/hotels/:id" element={
                        <ProtectedRoute>
                            <HotelDetailsPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/hotels/:id/rooms" element={
                        <ProtectedRoute>
                            <HotelRoomsPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/flights" element={
                        <ProtectedRoute>
                            <FlightsPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/packages" element={
                        <ProtectedRoute>
                            <PackagesPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/inquiries" element={
                        <ProtectedRoute>
                            <InquiriesPage />
                        </ProtectedRoute>
                    } />

                    {/* Customer Specific */}
                    <Route path="/booking" element={
                        <ProtectedRoute allowedRole={UserRole.CUSTOMER}>
                            <BookingPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/my-bookings" element={
                        <ProtectedRoute allowedRole={UserRole.CUSTOMER}>
                            <MyBookingsPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/my-flights" element={
                        <ProtectedRoute allowedRole={UserRole.CUSTOMER}>
                            <MyFlightsPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/wishlist" element={
                        <ProtectedRoute allowedRole={UserRole.CUSTOMER}>
                             <WishlistPage />
                        </ProtectedRoute>
                    } />

                    {/* Employee Routes */}
                    <Route path="/manage-bookings" element={
                        <ProtectedRoute allowedRole={UserRole.EMPLOYEE}>
                            <ManageBookingsPage />
                        </ProtectedRoute>
                    } />
                     <Route path="/customers" element={
                        <ProtectedRoute allowedRole={UserRole.EMPLOYEE}>
                            <CustomerDirectoryPage />
                        </ProtectedRoute>
                    } />
                    
                    {/* Manager / Admin Routes */}
                     <Route path="/analytics" element={
                        <ProtectedRoute allowedRole={UserRole.EMPLOYEE} allowedEmployeeRole={[EmployeeRole.MANAGER, EmployeeRole.ADMIN]}>
                            <AnalyticsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/finance" element={
                        <ProtectedRoute allowedRole={UserRole.EMPLOYEE} allowedEmployeeRole={[EmployeeRole.MANAGER, EmployeeRole.ADMIN]}>
                            <FinancePage />
                        </ProtectedRoute>
                    } />
                     <Route path="/settings" element={
                        <ProtectedRoute allowedRole={UserRole.EMPLOYEE} allowedEmployeeRole={[EmployeeRole.MANAGER, EmployeeRole.ADMIN]}>
                            <SettingsPage />
                        </ProtectedRoute>
                    } />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </WishlistProvider>
    </AuthProvider>
  );
}

export default App;



// import React from 'react';
// import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import { WishlistProvider } from './context/WishlistContext';
// import { UserRole, EmployeeRole } from './types';
// import { Layout } from './components/Layout';
// import { AuthPage } from './pages/Auth';
// import { LandingPage } from './pages/Landing';
// import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
// import { CustomerDashboard } from './pages/customer/CustomerDashboard';
// import { HotelsPage } from './pages/Hotels';
// import { FlightsPage } from './pages/Flights';
// import { PackagesPage } from './pages/Packages';
// import { BookingPage } from './pages/Booking';
// import { InquiriesPage } from './pages/Inquiries';
// import { HotelDetailsPage } from './pages/HotelDetails';
// import { HotelRoomsPage } from './pages/HotelRooms';
// import { ManageBookingsPage } from './pages/employee/ManageBookings';
// import { CustomerDirectoryPage } from './pages/employee/CustomerDirectory';
// import { MyBookingsPage } from './pages/customer/MyBookings';
// import { MyFlightsPage } from './pages/customer/MyFlights';
// import { WishlistPage } from './pages/customer/Wishlist';
// import { AnalyticsPage } from './pages/admin/Analytics';
// import { FinancePage } from './pages/admin/Finance';
// import { SettingsPage } from './pages/admin/Settings';

// // Protected Route Wrapper
// const ProtectedRoute = ({ children, allowedRole, allowedEmployeeRole }: { children: React.ReactNode, allowedRole?: UserRole, allowedEmployeeRole?: EmployeeRole[] }) => {
//     const { user, isAuthenticated } = useAuth();

//     if (!isAuthenticated) {
//         return <Navigate to="/auth" replace />;
//     }

//     if (allowedRole && user?.role !== allowedRole) {
//         return <Navigate to="/dashboard" replace />;
//     }

//     if (allowedEmployeeRole && user?.employeeRole && !allowedEmployeeRole.includes(user.employeeRole)) {
//          return <Navigate to="/dashboard" replace />;
//     }

//     return <Layout>{children}</Layout>;
// };

// // Dynamic Dashboard Routing based on Role
// const DashboardRouter = () => {
//     const { user } = useAuth();
//     if (user?.role === UserRole.EMPLOYEE) {
//         return <EmployeeDashboard />;
//     }
//     return <CustomerDashboard />;
// };

// function App() {
//   return (
//     <AuthProvider>
//         <WishlistProvider>
//             <Router>
//                 <Routes>
//                     {/* Public Routes */}
//                     <Route path="/" element={<LandingPage />} />
//                     <Route path="/auth" element={<AuthPage />} />

//                     {/* Protected Routes - Shared */}
//                     <Route path="/dashboard" element={
//                         <ProtectedRoute>
//                             <DashboardRouter />
//                         </ProtectedRoute>
//                     } />
                    
//                     <Route path="/hotels" element={
//                         <ProtectedRoute>
//                             <HotelsPage />
//                         </ProtectedRoute>
//                     } />
                    
//                     <Route path="/hotels/:id" element={
//                         <ProtectedRoute>
//                             <HotelDetailsPage />
//                         </ProtectedRoute>
//                     } />

//                     <Route path="/hotels/:id/rooms" element={
//                         <ProtectedRoute>
//                             <HotelRoomsPage />
//                         </ProtectedRoute>
//                     } />

//                     <Route path="/flights" element={
//                         <ProtectedRoute>
//                             <FlightsPage />
//                         </ProtectedRoute>
//                     } />

//                     <Route path="/packages" element={
//                         <ProtectedRoute>
//                             <PackagesPage />
//                         </ProtectedRoute>
//                     } />

//                     <Route path="/inquiries" element={
//                         <ProtectedRoute>
//                             <InquiriesPage />
//                         </ProtectedRoute>
//                     } />

//                     {/* Customer Specific */}
//                     <Route path="/booking" element={
//                         <ProtectedRoute allowedRole={UserRole.CUSTOMER}>
//                             <BookingPage />
//                         </ProtectedRoute>
//                     } />

//                     <Route path="/my-bookings" element={
//                         <ProtectedRoute allowedRole={UserRole.CUSTOMER}>
//                             <MyBookingsPage />
//                         </ProtectedRoute>
//                     } />

//                     <Route path="/my-flights" element={
//                         <ProtectedRoute allowedRole={UserRole.CUSTOMER}>
//                             <MyFlightsPage />
//                         </ProtectedRoute>
//                     } />

//                     <Route path="/wishlist" element={
//                         <ProtectedRoute allowedRole={UserRole.CUSTOMER}>
//                              <WishlistPage />
//                         </ProtectedRoute>
//                     } />

//                     {/* Employee Routes */}
//                     <Route path="/manage-bookings" element={
//                         <ProtectedRoute allowedRole={UserRole.EMPLOYEE}>
//                             <ManageBookingsPage />
//                         </ProtectedRoute>
//                     } />
//                      <Route path="/customers" element={
//                         <ProtectedRoute allowedRole={UserRole.EMPLOYEE}>
//                             <CustomerDirectoryPage />
//                         </ProtectedRoute>
//                     } />
                    
//                     {/* Manager / Admin Routes */}
//                      <Route path="/analytics" element={
//                         <ProtectedRoute allowedRole={UserRole.EMPLOYEE} allowedEmployeeRole={[EmployeeRole.MANAGER, EmployeeRole.ADMIN]}>
//                             <AnalyticsPage />
//                         </ProtectedRoute>
//                     } />
//                     <Route path="/finance" element={
//                         <ProtectedRoute allowedRole={UserRole.EMPLOYEE} allowedEmployeeRole={[EmployeeRole.MANAGER, EmployeeRole.ADMIN]}>
//                             <FinancePage />
//                         </ProtectedRoute>
//                     } />
//                      <Route path="/settings" element={
//                         <ProtectedRoute allowedRole={UserRole.EMPLOYEE} allowedEmployeeRole={[EmployeeRole.MANAGER, EmployeeRole.ADMIN]}>
//                             <SettingsPage />
//                         </ProtectedRoute>
//                     } />

//                     {/* Fallback */}
//                     <Route path="*" element={<Navigate to="/" replace />} />
//                 </Routes>
//             </Router>
//         </WishlistProvider>
//     </AuthProvider>
//   );
// }

// export default App;


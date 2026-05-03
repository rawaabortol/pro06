
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, EmployeeRole } from '../types';
import { 
    LayoutDashboard, 
    Hotel, 
    Plane, 
    Users, 
    CreditCard, 
    LogOut, 
    Menu, 
    Map, 
    Heart, 
    Briefcase,
    Settings,
    BarChart3,
    MessageSquare,
    Package
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
    <Link 
        to={to} 
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
            active 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600'
        }`}
    >
        <Icon size={20} className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
        <span className="font-medium">{label}</span>
    </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isEmployee = user?.role === UserRole.EMPLOYEE;
    const isManagement = user?.employeeRole === EmployeeRole.MANAGER || user?.employeeRole === EmployeeRole.ADMIN;
    const isAgent = user?.employeeRole === EmployeeRole.AGENT || user?.employeeRole === EmployeeRole.SENIOR_AGENT;
    const isConsultant = user?.employeeRole === EmployeeRole.CONSULTANT;

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden">
            {/* Sidebar */}
            <aside 
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 xl:w-64'
                }`}
            >
                <div className="h-20 flex items-center px-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-blue-700">
                        <Map size={28} className="fill-blue-700 text-white" />
                        <span className={`text-xl font-bold font-serif tracking-tight ${!isSidebarOpen && 'lg:hidden xl:block'}`}>
                            Odyssey
                        </span>
                    </div>
                </div>

                <div className="p-4 space-y-1 flex flex-col h-[calc(100vh-5rem)] overflow-y-auto">
                    <div className="mb-4">
                         <p className={`px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ${!isSidebarOpen && 'lg:hidden xl:block'}`}>
                            Menu
                        </p>
                        
                        <SidebarItem 
                            to="/dashboard" 
                            icon={LayoutDashboard} 
                            label="Dashboard" 
                            active={location.pathname === '/dashboard'} 
                        />
                        
                        {/* Customer & Agent View */}
                        {(!isManagement && !isConsultant) && (
                            <>
                                <SidebarItem 
                                    to="/hotels" 
                                    icon={Hotel} 
                                    label="Hotels & Resorts" 
                                    active={location.pathname === '/hotels'} 
                                />
                                <SidebarItem 
                                    to="/flights" 
                                    icon={Plane} 
                                    label="Flights" 
                                    active={location.pathname === '/flights'} 
                                />
                                <SidebarItem 
                                    to="/packages" 
                                    icon={Package} 
                                    label="Packages" 
                                    active={location.pathname === '/packages'} 
                                />
                            </>
                        )}

                        {/* Consultant & Agent View */}
                        {(isEmployee) && (
                            <SidebarItem 
                                to="/inquiries" 
                                icon={MessageSquare} 
                                label="Inquiry Board" 
                                active={location.pathname === '/inquiries'} 
                            />
                        )}
                        
                        {/* Customer View */}
                        {!isEmployee && (
                             <SidebarItem 
                                to="/inquiries" 
                                icon={MessageSquare} 
                                label="Tailor My Trip" 
                                active={location.pathname === '/inquiries'} 
                            />
                        )}

                        {/* Customer Specific */}
                        {!isEmployee && (
                            <>
                                <SidebarItem 
                                    to="/my-bookings" 
                                    icon={Briefcase} 
                                    label="My Bookings" 
                                    active={location.pathname === '/my-bookings'} 
                                />
                                <SidebarItem 
                                    to="/my-flights" 
                                    icon={Plane} 
                                    label="My Flights" 
                                    active={location.pathname === '/my-flights'} 
                                />
                                <SidebarItem 
                                    to="/wishlist" 
                                    icon={Heart} 
                                    label="Wishlist" 
                                    active={location.pathname === '/wishlist'} 
                                />
                            </>
                        )}

                        {/* Agent / Manager Specific */}
                        {(isAgent || isManagement) && (
                            <>
                                <SidebarItem 
                                    to="/manage-bookings" 
                                    icon={Briefcase} 
                                    label="Manage Bookings" 
                                    active={location.pathname === '/manage-bookings'} 
                                />
                                <SidebarItem 
                                    to="/customers" 
                                    icon={Users} 
                                    label="Customers" 
                                    active={location.pathname === '/customers'} 
                                />
                            </>
                        )}

                        {/* Management Specific */}
                        {isManagement && (
                            <>
                                <p className={`mt-6 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ${!isSidebarOpen && 'lg:hidden xl:block'}`}>
                                    Administrative
                                </p>
                                <SidebarItem 
                                    to="/analytics" 
                                    icon={BarChart3} 
                                    label="Analytics" 
                                    active={location.pathname === '/analytics'} 
                                />
                                <SidebarItem 
                                    to="/finance" 
                                    icon={CreditCard} 
                                    label="Finance" 
                                    active={location.pathname === '/finance'} 
                                />
                                <SidebarItem 
                                    to="/settings" 
                                    icon={Settings} 
                                    label="System Settings" 
                                    active={location.pathname === '/settings'} 
                                />
                            </>
                        )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        >
                            <LogOut size={20} />
                            <span className={`font-medium ${!isSidebarOpen && 'lg:hidden xl:block'}`}>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-40">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-slate-100 lg:hidden"
                    >
                        <Menu size={24} className="text-slate-600" />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-800">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-slate-500">
                                {isEmployee ? user?.employeeRole : `${user?.loyaltyTier} Member`}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                            {user?.firstName.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
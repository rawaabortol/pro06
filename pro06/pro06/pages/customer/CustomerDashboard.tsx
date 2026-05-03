
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Calendar, ArrowRight, Crown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { HotelCard } from '../../components/HotelCard';
import { SkeletonCard } from '../../components/ui/Loading';
import { Hotel, Booking } from '../../types';

export const CustomerDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<{ summary: any, bookings: Booking[], recommended: Hotel[] } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // Fetch dashboard data (bookings, summary)
                const custData = await api.getCustomerDashboard(user.id);
                // Fetch hotels for recommendation
                const hotels = await api.getHotels();
                
                setDashboardData({
                    summary: custData.summary || user,
                    bookings: custData.bookings || [],
                    recommended: hotels.slice(0, 4)
                });
            } catch (error) {
                console.error("Failed to load dashboard", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);
    
    if (loading || !dashboardData) {
        return (
            <div className="space-y-8">
                <div className="bg-slate-200 h-64 w-full rounded-3xl animate-pulse"></div>
                <div>
                    <div className="h-8 w-48 bg-slate-200 rounded mb-6 animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <div className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
                         <div className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
                         <div className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    const upcomingBookings = dashboardData.bookings.filter(b => {
        const checkIn = b.check_in ? new Date(b.check_in) : new Date();
        return checkIn > new Date();
    });

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 lg:p-12 animate-in fade-in duration-500">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-40"></div>
                <div className="relative z-10">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-serif font-bold mb-4">Dreaming of your <br/> next adventure?</h1>
                            <p className="text-slate-200 text-lg mb-8 max-w-xl">
                                Welcome back, {user?.firstName}. You have {user?.loyaltyPoints} loyalty points available to redeem on your next journey.
                            </p>
                            <Link to="/hotels" className="bg-white text-slate-900 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
                                Explore Hotels <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="hidden md:block text-right bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                            <div className="flex items-center justify-end gap-2 text-yellow-400 mb-1">
                                <Crown size={24} fill="currentColor" />
                                <span className="font-bold tracking-widest text-sm">{user?.loyaltyTier} MEMBER</span>
                            </div>
                            <p className="text-3xl font-bold">{user?.loyaltyPoints}</p>
                            <p className="text-xs text-slate-300 uppercase tracking-wider mt-1">Total Points</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Trips */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif font-bold text-slate-900">Upcoming Trips</h2>
                    <Link to="/my-bookings" className="text-blue-600 font-medium hover:text-blue-800">View All</Link>
                </div>

                {upcomingBookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingBookings.map(booking => {
                            return (
                                <div key={booking.booking_id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                                    <div className="h-48 bg-slate-200 relative overflow-hidden">
                                        <img 
                                            // Use photo from join if available, else placeholder
                                            src={(booking as any).photo_url || 'https://picsum.photos/800/600'} 
                                            alt={booking.hotel_name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900">
                                            {booking.status}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{booking.hotel_name}</h3>
                                        <div className="flex items-center text-slate-500 text-sm mb-4">
                                            <Calendar size={16} className="mr-2" />
                                            {booking.check_in ? new Date(booking.check_in).toLocaleDateString() : 'TBD'}
                                        </div>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                            <span className="text-sm text-slate-400">Booking ID: #{booking.booking_id}</span>
                                            <button 
                                                onClick={() => navigate('/my-bookings')}
                                                className="text-blue-600 font-medium text-sm hover:underline"
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-2xl p-12 text-center border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No upcoming trips</h3>
                        <p className="text-slate-500 mb-6">You haven't booked any adventures yet. Start exploring now!</p>
                        <Link to="/hotels" className="text-blue-600 font-medium hover:underline">Browse Destinations</Link>
                    </div>
                )}
            </div>

             {/* Recommended For You */}
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Recommended For You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardData.recommended.map(hotel => (
                        <HotelCard key={hotel.hotel_id} hotel={hotel} />
                    ))}
                </div>
            </div>
        </div>
    );
};

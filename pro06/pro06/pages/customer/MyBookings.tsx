
// // import React, { useState, useEffect } from 'react';
// // import { useAuth } from '../../context/AuthContext';
// // import { api } from '../../services/api';
// // import { Booking } from '../../types';
// // import { Calendar, MapPin, Clock, CheckCircle2, AlertCircle, Download, XCircle } from 'lucide-react';

// // export const MyBookingsPage: React.FC = () => {
// //     const { user } = useAuth();
// //     const [bookings, setBookings] = useState<Booking[]>([]);
// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => {
// //         const load = async () => {
// //             if (!user) return;
// //             setLoading(true);
// //             try {
// //                 // Using customer dashboard endpoint which returns 'bookings'
// //                 const data = await api.getCustomerDashboard(user.id);
// //                 setBookings(data.bookings);
// //             } catch (e) { console.error(e); } 
// //             finally { setLoading(false); }
// //         };
// //         load();
// //     }, [user]);

// //     const handleCancelBooking = (bookingId: number) => {
// //         if (window.confirm("Confirm cancellation?")) {
// //             setBookings(prev => prev.map(b => b.BOOKING_ID === bookingId ? { ...b, status: 'Cancelled' } : b));
// //         }
// //     };

// //     if (loading) return <div>Loading bookings...</div>;

// //     return (
// //         <div className="max-w-4xl mx-auto space-y-8 pb-12">
// //             <h1 className="text-3xl font-serif font-bold text-slate-900">My Journeys</h1>
// //             <div className="space-y-6">
// //                 {bookings.map((booking) => (
// //                     <div key={booking.BOOKING_ID} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6">
// //                         <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-slate-200">
// //                             <img src={booking.PHOTO_URL || 'https://via.placeholder.com/300'} className="w-full h-full object-cover" alt="Hotel"/>
// //                         </div>
// //                         <div className="flex-1">
// //                             <div className="flex justify-between">
// //                                 <h3 className="text-xl font-bold">{booking.HOTEL_NAME}</h3>
// //                                 <span className="font-bold">{booking.STATUS}</span>
// //                             </div>
// //                             <div className="text-sm text-slate-500 mb-4">Ref: #{booking.BOOKING_ID}</div>
// //                             <div className="flex gap-4 mb-4">
// //                                 <div className="text-sm">In: {booking.CHECK_IN}</div>
// //                                 <div className="text-sm">Out: {booking.CHECK_OUT}</div>
// //                                 <div className="text-sm font-bold">${booking.TOTAL_AMOUNT}</div>
// //                             </div>
// //                             <div className="flex gap-3">
// //                                 <button className="px-4 py-2 bg-slate-900 text-white rounded text-sm"><Download size={14}/> Ticket</button>
// //                                 {booking.STATUS === 'Confirmed' && <button onClick={() => handleCancelBooking(booking.BOOKING_ID)} className="px-4 py-2 border text-red-500 rounded text-sm">Cancel</button>}
// //                             </div>
// //                         </div>
// //                     </div>
// //                 ))}
// //             </div>
// //         </div>
// //     );
// // };
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { api } from '../../services/api';
// import { Booking } from '../../types';
// import { Calendar, MapPin, Clock, CheckCircle2, AlertCircle, Download, XCircle } from 'lucide-react';

// export const MyBookingsPage: React.FC = () => {
//     const { user } = useAuth();
//     const [bookings, setBookings] = useState<Booking[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const load = async () => {
//             if (!user) return;
//             setLoading(true);
//             try {
//                 // Using customer dashboard endpoint which returns 'bookings'
//                 const data = await api.getCustomerDashboard(user.id);
//                 setBookings(data.bookings);
//             } catch (e) { console.error(e); } 
//             finally { setLoading(false); }
//         };
//         load();
//     }, [user]);

//     const handleCancelBooking = async (bookingId: number) => {
//         if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
//             return;
//         }

//         try {
//             // 1. Call API to update status in DB
//             await api.updateBooking(bookingId, { status: 'Cancelled' });

//             // 2. Update local state
//             setBookings(prev => prev.map(b => 
//                 b.booking_id === bookingId ? { ...b, status: 'Cancelled' } : b
//             ));
//         } catch (error) {
//             console.error("Cancellation failed", error);
//             alert("Failed to cancel booking. Please try again.");
//         }
//     };

//     if (loading) return <div>Loading bookings...</div>;

//     return (
//         <div className="max-w-4xl mx-auto space-y-8 pb-12">
//             <h1 className="text-3xl font-serif font-bold text-slate-900">My Journeys</h1>
//             <div className="space-y-6">
//                 {bookings.length > 0 ? bookings.map((booking) => (
//                     <div key={booking.booking_id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
//                         <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-slate-200 relative">
//                             <img src={booking.photo_url || 'https://via.placeholder.com/300'} className="w-full h-full object-cover" alt="Hotel"/>
//                             {booking.status === 'Cancelled' && (
//                                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                                     <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">CANCELLED</span>
//                                 </div>
//                             )}
//                         </div>
//                         <div className="flex-1">
//                             <div className="flex justify-between items-start">
//                                 <div>
//                                     <h3 className="text-xl font-bold text-slate-900">{booking.hotel_name}</h3>
//                                     <div className="text-sm text-slate-500 mb-1">Ref: #{booking.booking_id}</div>
//                                 </div>
//                                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
//                                     booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
//                                     booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
//                                 }`}>
//                                     {booking.status}
//                                 </span>
//                             </div>
                            
//                             <div className="flex flex-wrap gap-4 mb-4 mt-2">
//                                 <div className="text-sm bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
//                                     <span className="text-slate-400 text-xs uppercase font-bold block">Check In</span>
//                                     {booking.check_in ? new Date(booking.check_in).toLocaleDateString() : 'N/A'}
//                                 </div>
//                                 <div className="text-sm bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
//                                     <span className="text-slate-400 text-xs uppercase font-bold block">Check Out</span>
//                                     {booking.check_out ? new Date(booking.check_out).toLocaleDateString() : 'N/A'}
//                                 </div>
//                                 <div className="text-sm bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
//                                     <span className="text-slate-400 text-xs uppercase font-bold block">Total</span>
//                                     ${booking.total_amount}
//                                 </div>
//                             </div>
                            
//                             <div className="flex gap-3 pt-2 border-t border-slate-50">
//                                 <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
//                                     <Download size={14}/> Ticket
//                                 </button>
//                                 {booking.status === 'Confirmed' && (
//                                     <button 
//                                         onClick={() => handleCancelBooking(booking.booking_id)} 
//                                         className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
//                                     >
//                                         <XCircle size={14} /> Cancel
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )) : (
//                     <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
//                         <h3 className="text-lg font-bold text-slate-900">No hotel bookings found</h3>
//                         <p className="text-slate-500">Your planned stays will appear here.</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Booking } from '../../types';
import { Calendar, MapPin, Clock, CheckCircle2, AlertCircle, Download, XCircle, BedDouble, Users } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export const MyBookingsPage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Cancellation State
    const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // Using customer dashboard endpoint which returns 'bookings'
                const data = await api.getCustomerDashboard(user.id);
                setBookings(data.bookings);
            } catch (e) { console.error(e); } 
            finally { setLoading(false); }
        };
        load();
    }, [user]);

    const handleConfirmCancel = async () => {
        if (!bookingToCancel) return;
        setIsCancelling(true);
        try {
            // 1. Call API to update status in DB
            await api.updateBooking(bookingToCancel, { status: 'Cancelled' });

            // 2. Update local state
            setBookings(prev => prev.map(b => 
                b.booking_id === bookingToCancel ? { ...b, status: 'Cancelled' } : b
            ));
        } catch (error) {
            console.error("Cancellation failed", error);
            alert("Failed to cancel booking. Please try again.");
        } finally {
            setIsCancelling(false);
            setBookingToCancel(null);
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-500">Loading your journey details...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <h1 className="text-3xl font-serif font-bold text-slate-900">My Journeys</h1>
            <div className="space-y-6">
                {bookings.length > 0 ? bookings.map((booking) => (
                    <div key={booking.booking_id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 animate-in fade-in duration-500">
                        <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-slate-200 relative">
                            <img src={booking.photo_url || 'https://via.placeholder.com/300'} className="w-full h-full object-cover" alt="Hotel"/>
                            {booking.status === 'Cancelled' && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">CANCELLED</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{booking.hotel_name}</h3>
                                    <div className="text-sm text-slate-500 mb-1">Ref: #{booking.booking_id}</div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                                    booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {booking.status}
                                </span>
                            </div>
                            
                            {/* Room and Guest Details */}
                            <div className="flex items-center gap-4 text-sm text-slate-600 mt-2 mb-3">
                                <div className="flex items-center gap-1.5">
                                    <BedDouble size={16} className="text-blue-500" />
                                    <span className="font-medium">{booking.room_type || 'Standard Room'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Users size={16} className="text-blue-500" />
                                    <span>{booking.guests || 2} Guest(s)</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 mb-4">
                                <div className="text-sm bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                    <span className="text-slate-400 text-xs uppercase font-bold block">Check In</span>
                                    {booking.check_in ? new Date(booking.check_in).toLocaleDateString() : 'N/A'}
                                </div>
                                <div className="text-sm bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                    <span className="text-slate-400 text-xs uppercase font-bold block">Check Out</span>
                                    {booking.check_out ? new Date(booking.check_out).toLocaleDateString() : 'N/A'}
                                </div>
                                <div className="text-sm bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                    <span className="text-slate-400 text-xs uppercase font-bold block">Total Paid</span>
                                    ${booking.total_amount?.toLocaleString() || '0'}
                                </div>
                            </div>
                            
                            <div className="flex gap-3 pt-2 border-t border-slate-50">
                                <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2">
                                    <Download size={14}/> Ticket
                                </button>
                                {booking.status === 'Confirmed' && (
                                    <button 
                                        onClick={() => setBookingToCancel(booking.booking_id)} 
                                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                                    >
                                        <XCircle size={14} /> Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900">No hotel bookings found</h3>
                        <p className="text-slate-500">Your planned stays will appear here.</p>
                    </div>
                )}
            </div>

            {/* Cancel Confirmation Modal */}
            <Modal isOpen={!!bookingToCancel} onClose={() => setBookingToCancel(null)} title="Cancel Booking">
                <div className="space-y-6">
                    <div className="bg-red-50 text-red-800 p-4 rounded-xl flex gap-3">
                        <AlertCircle size={24} className="shrink-0" />
                        <div>
                            <p className="font-bold">Are you sure you want to cancel?</p>
                            <p className="text-sm mt-1">This action cannot be undone. Refund policies may apply based on the hotel's terms.</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setBookingToCancel(null)}
                            className="flex-1 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50"
                        >
                            Keep Reservation
                        </button>
                        <button 
                            onClick={handleConfirmCancel}
                            disabled={isCancelling}
                            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-600/20"
                        >
                            {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
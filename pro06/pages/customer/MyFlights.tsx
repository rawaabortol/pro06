
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { FlightBooking } from '../../types';
import { Plane, Download, AlertCircle, XCircle } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export const MyFlightsPage: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<FlightBooking[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Cancellation State
    const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        const loadFlightBookings = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const data = await api.getFlightBookings(user.id);
                setBookings(data);
            } catch (error) {
                console.error("Failed to fetch flight bookings", error);
            } finally {
                setLoading(false);
            }
        };
        loadFlightBookings();
    }, [user]);

    const handleDownloadTicket = (bookingId: number) => {
        const content = `ODYSSEY AIR E-TICKET\n\nBooking Ref: #FLT-${bookingId}\nPassenger: ${user?.firstName} ${user?.lastName}\n------------------------\nSee your flight details in the app.`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `BoardingPass-${bookingId}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleConfirmCancel = async () => {
        if (!bookingToCancel) return;
        setIsCancelling(true);
        try {
            // Call API to make it persistent
            await api.updateBooking(bookingToCancel, { status: 'Cancelled' });
            
            // Update local state
            setBookings(prev => prev.map(b => 
                b.booking_id === bookingToCancel ? { ...b, status: 'Cancelled' } : b
            ));
        } catch (error) {
            console.error("Failed to cancel flight", error);
            alert("Could not cancel flight. Please try again.");
        } finally {
            setIsCancelling(false);
            setBookingToCancel(null);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading your flights...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">My Flights</h1>
                    <p className="text-slate-500 mt-1">Manage your upcoming air travel.</p>
                </div>
                <div className="text-sm text-slate-500">
                    Total Flights: <span className="font-bold text-slate-900">{bookings.length}</span>
                </div>
            </div>

            <div className="space-y-6">
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking.booking_id} className="bg-white rounded-2xl p-0 border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                {/* Left: Flight Info */}
                                <div className="flex-1 p-6 md:p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                                <Plane size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg">{booking.airline}</h3>
                                                <p className="text-slate-500 text-sm flex items-center gap-2">
                                                    {booking.flight_number} • {booking.seat_class} Class
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                                        <div className="text-center md:text-left">
                                            <div className="text-3xl font-bold text-slate-900">
                                                {new Date(booking.departure_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                            <div className="text-lg font-medium text-blue-600">{booking.departure_airport}</div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                {new Date(booking.departure_time).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center w-full md:w-auto flex-1">
                                            <div className="text-xs text-slate-400 mb-2 uppercase tracking-wider">Direct</div>
                                            <div className="w-full h-0.5 bg-slate-200 relative min-w-[100px]">
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 text-slate-300">
                                                    <Plane size={16} className="rotate-90" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-center md:text-right">
                                            <div className="text-3xl font-bold text-slate-900">
                                                {new Date(booking.arrival_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </div>
                                            <div className="text-lg font-medium text-blue-600">{booking.arrival_airport}</div>
                                             <div className="text-xs text-slate-400 mt-1">
                                                {new Date(booking.arrival_time).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Ticket Action */}
                                <div className="bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 p-6 flex flex-col items-center justify-center gap-4 min-w-[200px]">
                                    <div className="text-center">
                                        <div className="text-xs text-slate-400 uppercase font-bold mb-1">Total Paid</div>
                                        <div className="text-2xl font-bold text-slate-900">${booking.total_amount}</div>
                                        <div className="text-xs text-slate-500 mt-1">{booking.passengers} Passenger(s)</div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleDownloadTicket(booking.booking_id)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/10"
                                    >
                                        <Download size={16} />
                                        Boarding Pass
                                    </button>

                                    {booking.status === 'Confirmed' && (
                                        <button 
                                            onClick={() => setBookingToCancel(booking.booking_id)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
                                        >
                                            <XCircle size={16} />
                                            Cancel Flight
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-slate-50 rounded-2xl p-12 text-center border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plane size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No flights booked</h3>
                        <p className="text-slate-500 mb-6">You haven't booked any flights with us yet.</p>
                    </div>
                )}
            </div>

            {/* Cancel Confirmation Modal */}
            <Modal isOpen={!!bookingToCancel} onClose={() => setBookingToCancel(null)} title="Cancel Flight">
                <div className="space-y-6">
                    <div className="bg-red-50 text-red-800 p-4 rounded-xl flex gap-3">
                        <AlertCircle size={24} className="shrink-0" />
                        <div>
                            <p className="font-bold">Are you sure you want to cancel?</p>
                            <p className="text-sm mt-1">This action cannot be undone. Refund policies may apply based on the airline's terms.</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setBookingToCancel(null)}
                            className="flex-1 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50"
                        >
                            Keep Flight
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

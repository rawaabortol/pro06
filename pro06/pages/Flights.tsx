import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Flight } from '../types';
import { FlightCard } from '../components/FlightCard';
import { Search, Calendar, MapPin, CheckCircle, X, AlertCircle, ArrowRight, CreditCard, Plane, AlertTriangle } from 'lucide-react';
import { SkeletonCard } from '../components/ui/Loading';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';

export const FlightsPage: React.FC = () => {
    const { user } = useAuth();
    const [allFlights, setAllFlights] = useState<Flight[]>([]);
    const [displayedFlights, setDisplayedFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchParams, setSearchParams] = useState({
        from: '',
        to: '',
        date: ''
    });
    
    // Booking State
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingStep, setBookingStep] = useState(1); // 1: Review, 2: Confirm, 3: Success
    const [isBookingLoading, setIsBookingLoading] = useState(false);

    const loadFlights = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getFlights();
            setAllFlights(data);
            setDisplayedFlights(data);
        } catch (error) {
            console.error("Failed to fetch flights", error);
            setError("We couldn't load the flight schedule at this time. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFlights();
    }, []);

    const handleSearch = () => {
        setIsSearching(true);
        setTimeout(() => {
            const filtered = allFlights.filter(flight => {
                const matchFrom = searchParams.from === '' || flight.departure_airport.toLowerCase().includes(searchParams.from.toLowerCase());
                const matchTo = searchParams.to === '' || flight.arrival_airport.toLowerCase().includes(searchParams.to.toLowerCase());
                const matchDate = searchParams.date === '' || flight.departure_time.includes(searchParams.date);
                return matchFrom && matchTo && matchDate;
            });
            setDisplayedFlights(filtered);
            setIsSearching(false);
        }, 800); // Simulate search delay
    };

    const handleBookFlight = (flight: Flight) => {
        if (!user) {
            alert("Please log in to book a flight.");
            return;
        }
        setSelectedFlight(flight);
        setBookingStep(1);
        setIsBookingOpen(true);
    };

    const handleProceedToConfirm = () => {
        setBookingStep(2);
    };

    const handleFinalizeBooking = async () => {
        if (!selectedFlight || !user) return;
        
        setIsBookingLoading(true);
        try {
            await api.createFlightBooking({
                customer_id: user.id,
                flight_id: selectedFlight.flight_id,
                seat_class: 'Economy', // Default for this UI
                passengers: 1, // Default for this UI
                total_amount: selectedFlight.price
            });
            setBookingStep(3);
        } catch (err) {
            console.error(err);
            alert("Failed to complete booking. Please try again.");
        } finally {
            setIsBookingLoading(false);
        }
    };

    const getModalTitle = () => {
        switch(bookingStep) {
            case 1: return "Review Flight Details";
            case 2: return "Confirm & Pay";
            case 3: return "Booking Successful";
            default: return "Flight Booking";
        }
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <div className="bg-red-50 p-6 rounded-full text-red-500 mb-6">
                    <AlertTriangle size={48} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Unable to Load Flights</h2>
                <p className="text-slate-500 mb-8 max-w-md">{error}</p>
                <button 
                    onClick={loadFlights}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="relative rounded-3xl overflow-hidden bg-blue-900 text-white p-8 lg:p-12 shadow-xl">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-4xl font-serif font-bold mb-4">Find Your Wings</h1>
                    <p className="text-blue-100 text-lg mb-8">
                        Search hundreds of airlines and routes to find the perfect flight for your next journey.
                    </p>

                    {/* Search Bar */}
                    <div className="bg-white p-4 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 text-slate-900">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">From</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Departure City (e.g. JFK)" 
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                    value={searchParams.from}
                                    onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">To</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Destination City (e.g. LHR)" 
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                    value={searchParams.to}
                                    onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Date</label>
                            <div className="relative">
                                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="date" 
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                    value={searchParams.date}
                                    onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="flex items-end">
                            <button 
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="h-[42px] w-full md:w-auto px-8 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                <Search size={20} /> {isSearching ? '...' : 'Search'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h2 className="text-xl font-bold text-slate-900">Available Flights</h2>
                    <span className="text-sm text-slate-500">{displayedFlights.length} results found</span>
                </div>

                {loading || isSearching ? (
                    <div className="space-y-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : displayedFlights.length > 0 ? (
                    displayedFlights.map(flight => (
                        <FlightCard key={flight.flight_id} flight={flight} onBook={handleBookFlight} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Search size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No flights found</h3>
                        <p className="text-slate-500">Try adjusting your search criteria to find more results.</p>
                    </div>
                )}
            </div>

            {/* Multi-step Booking Modal */}
            <Modal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} title={getModalTitle()}>
                {/* STEP 1: REVIEW */}
                {bookingStep === 1 && (
                    <div className="space-y-6">
                         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">Airline</p>
                                    <p className="font-bold text-slate-900 text-lg">{selectedFlight?.airline}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 uppercase font-bold">Flight No.</p>
                                    <p className="font-bold text-slate-900">{selectedFlight?.flight_number}</p>
                                </div>
                            </div>
                             <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-3xl font-bold text-slate-900">{selectedFlight?.departure_airport}</p>
                                    <p className="text-sm text-slate-500">{new Date(selectedFlight?.departure_time || '').toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                                <div className="flex-1 px-4 flex flex-col items-center">
                                    <p className="text-xs text-slate-400 mb-1">Direct</p>
                                    <div className="w-full h-px bg-slate-300 relative">
                                        <Plane size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 rotate-90 bg-slate-50" />
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-slate-900">{selectedFlight?.arrival_airport}</p>
                                    <p className="text-sm text-slate-500">{new Date(selectedFlight?.arrival_time || '').toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                            </div>
                             <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                                <span className="text-slate-900 font-medium">Total Price</span>
                                <span className="font-bold text-blue-600 text-2xl">${selectedFlight?.price}</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setIsBookingOpen(false)}
                                className="flex-1 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleProceedToConfirm}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                            >
                                Continue <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: CONFIRMATION */}
                {bookingStep === 2 && (
                    <div className="space-y-6">
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 text-amber-800">
                            <AlertCircle className="shrink-0" size={24} />
                            <div className="text-sm">
                                <p className="font-bold mb-1">Please confirm your booking</p>
                                <p>This is the final step. Your payment method on file will be charged immediately.</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-4">Summary</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Passenger</span>
                                    <span className="font-medium">{user ? `${user.firstName} ${user.lastName}` : 'Guest User'}</span> 
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Flight</span>
                                    <span className="font-medium">{selectedFlight?.airline} ({selectedFlight?.flight_number})</span> 
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Date</span>
                                    <span className="font-medium">{new Date(selectedFlight?.departure_time || '').toLocaleDateString()}</span> 
                                </div>
                                <div className="flex justify-between pt-3 border-t border-slate-100">
                                    <span className="font-bold text-slate-900">Amount Due</span>
                                    <span className="font-bold text-blue-600">${selectedFlight?.price}</span> 
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setBookingStep(1)}
                                className="flex-1 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                                disabled={isBookingLoading}
                            >
                                Back
                            </button>
                            <button 
                                onClick={handleFinalizeBooking}
                                disabled={isBookingLoading}
                                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isBookingLoading ? 'Processing...' : <><CreditCard size={18} /> Finalize Payment</>}
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: SUCCESS */}
                {bookingStep === 3 && (
                    <div className="text-center py-8 animate-in zoom-in">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Flight Confirmed</h3>
                        <p className="text-slate-500 mb-6">
                            Your flight {selectedFlight?.flight_number} to {selectedFlight?.arrival_airport} has been booked successfully.
                        </p>
                        <button 
                            onClick={() => setIsBookingOpen(false)} 
                            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                        >
                            Close & View Ticket
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

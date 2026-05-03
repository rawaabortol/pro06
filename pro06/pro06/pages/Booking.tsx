
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Hotel, Room } from '../types';
import { Calendar, CreditCard, CheckCircle, ShieldCheck, BedDouble, Users } from 'lucide-react';

export const BookingPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as any;
    const hotel = state?.hotel as Hotel;
    const room = state?.room as Room; // Now receiving room object

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        checkIn: '',
        checkOut: '',
        guests: 1,
        cardName: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    useEffect(() => {
        if (!hotel) navigate('/hotels');
    }, [hotel, navigate]);

    if (!hotel) return null;

    // Prioritize room price, fall back to hotel default if room not selected (edge case)
    const basePrice = room ? room.price_per_night : (hotel.price_per_night || 200);

    const calculateTotal = () => {
        if (!formData.checkIn || !formData.checkOut) return basePrice;
        const start = new Date(formData.checkIn);
        const end = new Date(formData.checkOut);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return basePrice * (nights > 0 ? nights : 1);
    };

    const handleBook = async () => {
        if(!formData.checkIn || !formData.checkOut) {
            alert("Please select check-in and check-out dates");
            return;
        }

        setLoading(true);
        try {
            await api.createBooking({
                customer_id: user?.id,
                hotel_id: hotel.hotel_id,
                room_id: room?.room_id, // Critical: Pass room_id to backend
                check_in: formData.checkIn,
                check_out: formData.checkOut,
                guests: formData.guests,
                total_amount: calculateTotal(),
                payment_details: { method: 'Credit Card' }
            });
            setStep(3);
        } catch (error) {
            console.error(error);
            alert("Booking Failed: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
             <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-4 text-slate-500 font-medium hover:text-blue-600">Back</button>
                <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">Secure Checkout</h1>
                
                {step === 3 ? (
                    <div className="bg-white p-12 rounded-3xl text-center shadow-xl border border-green-100 animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
                        <p className="text-slate-500 mb-8">
                            You are all set for your stay at <strong>{hotel.name}</strong>. 
                            {room && <span> You booked a <strong>{room.room_type}</strong>.</span>}
                            <br/>A confirmation email has been sent.
                        </p>
                        <button onClick={()=>navigate('/my-bookings')} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">View My Bookings</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Booking Summary Card */}
                        <div className="md:col-span-2 space-y-6">
                             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                 <h3 className="font-bold text-lg mb-4">Trip Details</h3>
                                 <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Check In</label>
                                        <input type="date" className="w-full border p-3 rounded-xl bg-slate-50" value={formData.checkIn} onChange={e=>setFormData({...formData, checkIn: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Check Out</label>
                                        <input type="date" className="w-full border p-3 rounded-xl bg-slate-50" value={formData.checkOut} onChange={e=>setFormData({...formData, checkOut: e.target.value})} />
                                    </div>
                                 </div>
                                 <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Guests</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="number" 
                                            min="1" 
                                            max={room ? room.max_occupancy : 4} 
                                            className="w-full border p-3 pl-10 rounded-xl bg-slate-50" 
                                            value={formData.guests} 
                                            onChange={e=>setFormData({...formData, guests: parseInt(e.target.value)})} 
                                        />
                                    </div>
                                    {room && <p className="text-xs text-slate-400 mt-1">Max occupancy for this room: {room.max_occupancy} guests</p>}
                                 </div>
                             </div>

                             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                 <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><CreditCard size={20}/> Payment</h3>
                                 <div className="space-y-4">
                                    <input placeholder="Cardholder Name" className="w-full border p-3 rounded-xl bg-slate-50" value={formData.cardName} readOnly />
                                    <input placeholder="Card Number (Mock)" className="w-full border p-3 rounded-xl bg-slate-50" defaultValue="4242 4242 4242 4242" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input placeholder="MM/YY" className="w-full border p-3 rounded-xl bg-slate-50" defaultValue="12/28" />
                                        <input placeholder="CVV" className="w-full border p-3 rounded-xl bg-slate-50" defaultValue="123" />
                                    </div>
                                 </div>
                             </div>
                        </div>

                        {/* Order Summary */}
                        <div className="md:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-24">
                                <h3 className="font-bold text-lg mb-4 text-slate-900">Order Summary</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="flex gap-3">
                                        <img src={hotel.photo_url} className="w-16 h-16 rounded-lg object-cover" alt="Hotel" />
                                        <div>
                                            <div className="font-bold text-sm text-slate-900">{hotel.name}</div>
                                            <div className="text-xs text-slate-500">{hotel.location}</div>
                                        </div>
                                    </div>
                                    
                                    {/* Selected Room Display */}
                                    {room ? (
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                            <div className="flex items-center gap-2 text-sm text-blue-800 font-bold mb-1">
                                                <BedDouble size={16}/> {room.room_type}
                                            </div>
                                            <div className="text-xs text-blue-600 line-clamp-1">{room.description}</div>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 italic">
                                            Run of House (Standard Room)
                                        </div>
                                    )}
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-500">Price/Night</span>
                                        <span className="font-bold">${basePrice}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg font-bold text-slate-900 mt-4">
                                        <span>Total</span>
                                        <span>${calculateTotal().toLocaleString()}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleBook} 
                                    disabled={loading} 
                                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing...' : `Pay $${calculateTotal().toLocaleString()}`}
                                </button>
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                                    <ShieldCheck size={14} /> Secure SSL Encryption
                                </div>
                            </div>
                        </div>
                    </div>
                )}
             </div>
        </div>
    );
};

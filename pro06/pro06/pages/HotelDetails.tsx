
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserRole, Hotel, Review } from '../types';
import { 
    MapPin, Star, ArrowLeft, ArrowRight, User, Wifi, Coffee, Waves, Utensils, Snowflake, 
    Dumbbell, Car, Sparkles, Tv, Wind, CheckCircle, BarChart3, CalendarCheck, Bed
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const HotelDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);

    // Reviews State
    const [reviews, setReviews] = useState<Review[]>([]);

    const [isWritingReview, setIsWritingReview] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [availabilityStatus, setAvailabilityStatus] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if(!id) return;
            setLoading(true);
            try {
                const [hotelData, reviewsData] = await Promise.all([
                    api.getHotelById(Number(id)),
                    api.getHotelReviews(Number(id))
                ]);
                setHotel(hotelData);
                setReviews(reviewsData);
                console.log("Loaded hotel data:", hotelData);
            } catch (error) {
                console.error("Failed to load hotel", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) return <div className="p-12 text-center">Loading hotel details...</div>;
    if (!hotel) return <div className="p-8 text-center">Hotel not found</div>;

    const getAmenityIcon = (text: string) => {
        const lower = text.toLowerCase();
        if (lower.includes('wifi')) return <Wifi size={20} />;
        if (lower.includes('breakfast') || lower.includes('coffee')) return <Coffee size={20} />;
        if (lower.includes('pool') || lower.includes('beach') || lower.includes('ocean')) return <Waves size={20} />;
        if (lower.includes('dining') || lower.includes('restaurant') || lower.includes('bar')) return <Utensils size={20} />;
        if (lower.includes('ski') || lower.includes('mountain')) return <Snowflake size={20} />;
        if (lower.includes('gym') || lower.includes('fitness')) return <Dumbbell size={20} />;
        if (lower.includes('parking') || lower.includes('valet')) return <Car size={20} />;
        if (lower.includes('spa')) return <Sparkles size={20} />;
        if (lower.includes('tv')) return <Tv size={20} />;
        if (lower.includes('air') || lower.includes('heating')) return <Wind size={20} />;
        return <CheckCircle size={20} />;
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("You must be logged in to submit a review.");
            return;
        }

        try {
            await api.createReview({
                hotel_id: Number(id),
                customer_id: user.id,
                rating: newRating,
                review_text: reviewText,
                room_type_reviewed: 'General' 
            });
            // Refresh reviews
            const updated = await api.getHotelReviews(Number(id));
            setReviews(updated);
            setIsWritingReview(false);
            setReviewText("");
        } catch (e) {
            console.error(e);
            alert("Failed to submit review.");
        }
    };

    const handleCheckAvailability = () => {
        setCheckingAvailability(true);
        setTimeout(() => {
            setCheckingAvailability(false);
            setAvailabilityStatus("8 Rooms Available");
        }, 1500);
    };

    const analyticsData = [
        { name: '5 Stars', count: reviews.filter(r => r.rating === 5).length },
        { name: '4 Stars', count: reviews.filter(r => r.rating === 4).length },
        { name: '3 Stars', count: reviews.filter(r => r.rating === 3).length },
        { name: '2 Stars', count: reviews.filter(r => r.rating === 2).length },
        { name: '1 Star', count: reviews.filter(r => r.rating === 1).length },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium">
                <ArrowLeft size={20} className="mr-2" /> Back to Hotels
            </button>
            
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
                {/* Hero Image */}
                <div className="h-[400px] lg:h-[500px] relative">
                    <img src={hotel.photo_url} alt={hotel.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-8 lg:p-12 text-white">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                                        {hotel.rating} Stars
                                    </span>
                                    <div className="flex text-yellow-400">
                                        {[...Array(hotel.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                    </div>
                                </div>
                                <h1 className="text-4xl lg:text-6xl font-serif font-bold mb-2">{hotel.name}</h1>
                                <div className="flex items-center text-slate-200 text-lg">
                                    <MapPin size={20} className="mr-2" /> {hotel.location}
                                </div>
                            </div>
                            <div className="flex flex-col items-start md:items-end">
                                <div className="text-3xl font-bold">${hotel.price_per_night}</div>
                                <div className="text-sm text-slate-300">avg. per night</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Left Content */}
                        <div className="flex-1 space-y-10">
                            <div className="prose prose-slate max-w-none">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">About this stay</h2>
                                <p className="text-slate-600 leading-relaxed text-lg">{hotel.description}</p>
                            </div>
                            
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Popular Amenities</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {hotel.amenities.split(',').map((amenity, idx) => (
                                        <div key={idx} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-blue-50 transition-colors group">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm mr-4 group-hover:scale-110 transition-transform">
                                                {getAmenityIcon(amenity)}
                                            </div>
                                            <span className="font-medium text-slate-700">{amenity.trim()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-8">Guest Reviews</h2>

                                {user?.role === UserRole.EMPLOYEE && (
                                    <div className="bg-slate-50 p-6 rounded-2xl mb-8 border border-slate-200">
                                        <div className="flex items-center gap-2 mb-6 text-blue-700">
                                            <BarChart3 size={20} />
                                            <h3 className="font-bold">Review Analytics (Internal)</h3>
                                        </div>
                                        <div className="h-48 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={analyticsData} layout="vertical">
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" width={50} tick={{fontSize: 12}} />
                                                    <Tooltip cursor={{fill: 'transparent'}} />
                                                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                                                        {analyticsData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={index === 0 ? '#22c55e' : '#3b82f6'} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}

                                {user?.role === UserRole.CUSTOMER && (
                                    <div className="mb-8">
                                        {!isWritingReview ? (
                                            <button onClick={() => setIsWritingReview(true)} className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                                                Write a Review <ArrowRight size={16} />
                                            </button>
                                        ) : (
                                            <form onSubmit={handleSubmitReview} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                                <div className="mb-4">
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button key={star} type="button" onClick={() => setNewRating(star)}>
                                                                <Star size={24} fill={star <= newRating ? "#eab308" : "none"} className="text-yellow-400" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} required rows={3} className="w-full p-3 rounded-xl border border-slate-200" placeholder="Your review..."></textarea>
                                                <div className="flex gap-3 mt-4">
                                                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl">Submit</button>
                                                    <button type="button" onClick={() => setIsWritingReview(false)} className="text-slate-500">Cancel</button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-8">
                                    {reviews.length > 0 ? reviews.map((review) => (
                                        <div key={review.review_id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{review.customer_name}</div>
                                                        <div className="text-xs text-slate-500">{new Date(review.review_date).toLocaleDateString()} • {review.room_type_reviewed || 'General'}</div>
                                                    </div>
                                                </div>
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-slate-200"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-slate-600">"{review.review_text}"</p>
                                        </div>
                                    )) : (
                                        <p className="text-slate-500 italic">No reviews yet. Be the first to share your experience!</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="lg:w-96">
                            <div className="sticky top-24 bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
                                <div className="flex items-end justify-between mb-6">
                                    <div><span className="text-3xl font-bold text-slate-900">Rooms</span></div>
                                </div>

                                {user?.role === UserRole.EMPLOYEE ? (
                                    <div className="space-y-3">
                                        {availabilityStatus && <div className="bg-green-100 text-green-800 p-3 rounded-xl text-center font-bold text-sm"><CheckCircle size={16} className="inline mr-2"/> {availabilityStatus}</div>}
                                        <button onClick={handleCheckAvailability} disabled={checkingAvailability} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                                            {checkingAvailability ? 'Checking...' : 'Check Live Availability'} <CalendarCheck size={20} />
                                        </button>
                                        <div className="text-center text-xs text-slate-400 mt-2">Internal Employee Tool</div>
                                    </div>
                                ) : (
                                    <button onClick={() => navigate(`/hotels/${id}/rooms`)} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-colors">
                                        View Available Rooms <Bed size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

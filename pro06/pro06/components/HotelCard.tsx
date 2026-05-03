
import React from 'react';
import { Hotel, UserRole } from '../types';
import { MapPin, Star, Wifi, Coffee, Droplets, Wind, ArrowRight, Eye, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

interface HotelCardProps {
    hotel: Hotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { isInWishlist, toggleWishlist } = useWishlist();

    const isFavorite = isInWishlist(hotel.hotel_id);

    const getAmenityIcon = (text: string) => {
        const lower = text.toLowerCase();
        if (lower.includes('wifi')) return <Wifi size={14} />;
        if (lower.includes('breakfast') || lower.includes('dining')) return <Coffee size={14} />;
        if (lower.includes('pool') || lower.includes('beach')) return <Droplets size={14} />;
        return <Wind size={14} />;
    };

    const handleBookNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (user?.role === UserRole.CUSTOMER) {
            navigate('/booking', { state: { hotel } });
        } else {
            // For employees, navigating to details is more appropriate than booking directly in this context
            navigate(`/hotels/${hotel.hotel_id}`);
        }
    };

    const handleViewDetails = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/hotels/${hotel.hotel_id}`);
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(hotel.hotel_id);
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
            {/* Image */}
            <div className="h-64 relative overflow-hidden cursor-pointer" onClick={handleViewDetails}>
                <img 
                    src={hotel.photo_url} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                {user?.role === UserRole.CUSTOMER && (
                    <button 
                        onClick={handleFavorite}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
                            isFavorite 
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110' 
                            : 'bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-red-500'
                        }`}
                    >
                        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1 hover:text-blue-600 cursor-pointer" onClick={handleViewDetails}>{hotel.name}</h3>
                        <div className="flex items-center text-slate-500 text-sm">
                            <MapPin size={14} className="mr-1 text-blue-500" />
                            {hotel.location}
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg text-blue-700 font-bold text-sm">
                            <span>{hotel.average_rating}</span>
                            <Star size={12} fill="currentColor" />
                        </div>
                        <span className="text-xs text-slate-400 mt-1">{hotel.review_count} reviews</span>
                    </div>
                </div>
                
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                    {hotel.description}
                </p>

                {/* Amenities Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {hotel.amenities.split(',').slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-100 rounded-md text-xs font-medium text-slate-600">
                            {getAmenityIcon(amenity)}
                            {amenity.trim()}
                        </span>
                    ))}
                    <span className="text-xs text-slate-400 self-center">+ more</span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-3">
                    <div>
                        <span className="text-xs text-slate-400 uppercase font-semibold">Starts from</span>
                        <p className="text-lg font-bold text-slate-900">${hotel.price_per_night || 250}<span className="text-sm font-normal text-slate-500">/night</span></p>
                    </div>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={handleViewDetails}
                            className="bg-white border border-slate-200 text-slate-600 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                            title="View Details"
                        >
                            <Eye size={20} />
                        </button>
                        <button 
                            onClick={handleBookNow}
                            className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/20 hover:shadow-blue-600/30 flex items-center gap-2"
                        >
                            {user?.role === UserRole.EMPLOYEE ? 'Check Availability' : 'Book Now'} <ArrowRight size={16} className="hidden sm:block" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

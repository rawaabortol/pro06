
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Hotel } from '../types';
import { Search, SlidersHorizontal, Star, X, AlertTriangle } from 'lucide-react';
import { HotelCard } from '../components/HotelCard';
import { SkeletonCard } from '../components/ui/Loading';

export const HotelsPage: React.FC = () => {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter States
    const [showFilters, setShowFilters] = useState(false);
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(1000);
    const [minRating, setMinRating] = useState<number>(0);

    const loadHotels = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getHotels();
            setHotels(data);
        } catch (error) {
            console.error("Failed to fetch hotels", error);
            setError("We couldn't load the hotel list at this time. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHotels();
    }, []);

    const filteredHotels = hotels.filter(hotel => {
        const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
        const price = hotel.price_per_night || 0;
        const matchesPrice = price >= minPrice && price <= maxPrice;
        const matchesRating = hotel.rating >= minRating;

        return matchesSearch && matchesPrice && matchesRating;
    });

    const clearFilters = () => {
        setMinPrice(0);
        setMaxPrice(1000);
        setMinRating(0);
        setSearchTerm('');
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <div className="bg-red-50 p-6 rounded-full text-red-500 mb-6">
                    <AlertTriangle size={48} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Unable to Load Hotels</h2>
                <p className="text-slate-500 mb-8 max-w-md">{error}</p>
                <button 
                    onClick={loadHotels}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-slate-900">Hotels & Resorts</h1>
                        <p className="text-slate-500 mt-1">Discover our curated collection of world-class accommodations.</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search by name or location..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`border p-2.5 rounded-xl transition-colors ${
                                showFilters 
                                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            <SlidersHorizontal size={20} />
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-in slide-in-from-top-2 duration-200">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-4">
                            <h3 className="font-bold text-slate-900">Filters</h3>
                            <button onClick={clearFilters} className="text-xs text-blue-600 font-medium hover:underline">
                                Clear All
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">Price Range (per night)</label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                        <input 
                                            type="number" 
                                            min="0"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(Number(e.target.value))}
                                            className="w-full pl-6 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                            placeholder="Min"
                                        />
                                    </div>
                                    <span className="text-slate-400">-</span>
                                    <div className="flex-1 relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                        <input 
                                            type="number" 
                                            min="0"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                                            className="w-full pl-6 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">Minimum Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                                            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                minRating === rating 
                                                ? 'bg-slate-900 text-white shadow-md' 
                                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-100'
                                            }`}
                                        >
                                            {rating} <Star size={12} fill={minRating === rating ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Hotel Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            ) : filteredHotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in duration-500">
                    {filteredHotels.map(hotel => (
                        <HotelCard key={hotel.hotel_id} hotel={hotel} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Search size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No hotels found</h3>
                    <p className="text-slate-500 mb-4">Try adjusting your search or filters to find what you're looking for.</p>
                    <button 
                        onClick={clearFilters}
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
};

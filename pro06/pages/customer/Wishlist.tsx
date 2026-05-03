
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Hotel } from '../../types';
import { HotelCard } from '../../components/HotelCard';
import { Heart, Search } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { Link } from 'react-router-dom';

export const WishlistPage: React.FC = () => {
    const { wishlist } = useWishlist();
    const [wishlistHotels, setWishlistHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // Fetch all hotels and filter. In optimized app, use getHotelsByIds([ids])
                const allHotels = await api.getHotels();
                setWishlistHotels(allHotels.filter(h => wishlist.includes(h.hotel_id)));
            } catch (e) { console.error(e); } 
            finally { setLoading(false); }
        };
        load();
    }, [wishlist]);

    return (
        <div className="space-y-6">
            <div className="bg-pink-50 p-8 rounded-3xl border border-pink-100 mb-8">
                <div className="flex items-center gap-3 mb-2 text-pink-600">
                    <Heart size={28} fill="currentColor" />
                    <h1 className="text-3xl font-serif font-bold text-slate-900">My Wishlist</h1>
                </div>
                <p className="text-slate-600">Save your dream destinations.</p>
            </div>

            {loading ? <div>Loading...</div> : wishlistHotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {wishlistHotels.map(hotel => <HotelCard key={hotel.hotel_id} hotel={hotel} />)}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                    <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                    <Link to="/hotels" className="text-blue-600 hover:underline">Explore Hotels</Link>
                </div>
            )}
        </div>
    );
};

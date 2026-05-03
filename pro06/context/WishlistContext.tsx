
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface WishlistContextType {
    wishlist: number[];
    toggleWishlist: (hotelId: number) => void;
    isInWishlist: (hotelId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<number[]>([]);

    useEffect(() => {
        if (user?.role === 'CUSTOMER') {
            api.getWishlist(user.id).then(setWishlist).catch(console.error);
        }
    }, [user]);

    const toggleWishlist = async (hotelId: number) => {
        if (!user) return;
        const exists = wishlist.includes(hotelId);
        
        // Optimistic Update
        setWishlist(prev => exists ? prev.filter(id => id !== hotelId) : [...prev, hotelId]);

        try {
            if (exists) await api.removeFromWishlist(user.id, hotelId);
            else await api.addToWishlist(user.id, hotelId);
        } catch (e) {
            console.error(e);
            // Revert on failure
            setWishlist(prev => exists ? [...prev, hotelId] : prev.filter(id => id !== hotelId));
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist: (id) => wishlist.includes(id) }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
    return context;
};

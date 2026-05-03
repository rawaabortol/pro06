
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Room, Hotel, Review } from '../types';
import { 
    Users, BedDouble, Square, ArrowRight, Star, MessageCircle, X, SlidersHorizontal, DollarSign, Check, Filter,
    Wifi, Coffee, Wind, Monitor, Bath, Snowflake, Utensils, Tv, Sparkles, CheckCircle
} from 'lucide-react';
import { SkeletonCard } from '../components/ui/Loading';
import { Modal } from '../components/ui/Modal';

export const HotelRoomsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // Data State
    const [rooms, setRooms] = useState<Room[]>([]);
    const [filteredRooms, setFilteredRooms] = useState<Room[]>([]); // For display
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [availableAmenities, setAvailableAmenities] = useState<string[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    // Modal State
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [roomReviews, setRoomReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch Hotel Basic Info and Rooms in parallel
                const [hotelData, roomsData] = await Promise.all([
                    api.getHotelById(Number(id)),
                    api.getHotelRooms(Number(id))
                ]);
                setHotel(hotelData);
                setRooms(roomsData);
                setFilteredRooms(roomsData); // Initialize filtered list

                // Extract Unique Amenities dynamically
                const allAmenities = new Set<string>();
                roomsData.forEach(room => {
                    if (room.amenities) {
                        room.amenities.split(',').forEach(a => allAmenities.add(a.trim()));
                    }
                });
                setAvailableAmenities(Array.from(allAmenities).sort());

            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Filtering Logic
    useEffect(() => {
        let result = rooms;

        if (minPrice !== '') {
            result = result.filter(room => room.price_per_night >= Number(minPrice));
        }

        if (maxPrice !== '') {
            result = result.filter(room => room.price_per_night <= Number(maxPrice));
        }

        if (selectedAmenities.length > 0) {
            result = result.filter(room => {
                const roomAmenities = room.amenities ? room.amenities.toLowerCase() : '';
                // Room must contain ALL selected amenities
                return selectedAmenities.every(selected => roomAmenities.includes(selected.toLowerCase()));
            });
        }

        setFilteredRooms(result);
    }, [minPrice, maxPrice, selectedAmenities, rooms]);

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities(prev => 
            prev.includes(amenity) 
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        );
    };

    const getAmenityIcon = (text: string) => {
        const lower = text.toLowerCase();
        if (lower.includes('wifi')) return <Wifi size={18} />;
        if (lower.includes('coffee') || lower.includes('tea')) return <Coffee size={18} />;
        if (lower.includes('tv') || lower.includes('monitor')) return <Monitor size={18} />;
        if (lower.includes('air') || lower.includes('heat') || lower.includes('conditioning')) return <Wind size={18} />;
        if (lower.includes('bath') || lower.includes('shower')) return <Bath size={18} />;
        if (lower.includes('view') || lower.includes('balcony')) return <Sparkles size={18} />;
        if (lower.includes('desk') || lower.includes('work')) return <CheckCircle size={18} />; // Generic/Work
        if (lower.includes('minibar') || lower.includes('fridge')) return <Utensils size={18} />;
        if (lower.includes('ski') || lower.includes('snow')) return <Snowflake size={18} />;
        return <CheckCircle size={18} />;
    };

    const handleViewDetails = async (room: Room) => {
        setSelectedRoom(room);
        setLoadingReviews(true);
        try {
            const reviews = await api.getRoomReviews(room.hotel_id, room.room_type);
            setRoomReviews(reviews);
        } catch (e) {
            console.error("Failed to load reviews", e);
            setRoomReviews([]);
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleBookRoom = (room: Room) => {
        // Navigate to booking page, passing both hotel and specific room details
        navigate('/booking', { state: { hotel, room } });
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <SkeletonCard/><SkeletonCard/><SkeletonCard/>
        </div>
    );

    if (!hotel) return <div className="text-center p-8">Hotel not found.</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">{hotel.name} - Rooms</h1>
                    <p className="text-slate-500 mt-1">Select your perfect sanctuary.</p>
                </div>
                <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-blue-600 font-medium">Back to Hotel Details</button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 transition-all">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 font-bold min-w-[140px] px-4 py-2.5 rounded-xl transition-colors ${
                            showFilters ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        <SlidersHorizontal size={20} className={showFilters ? "text-blue-600" : "text-slate-400"} />
                        <span>{showFilters ? 'Hide Filters' : 'Filter Rooms'}</span>
                    </button>
                    
                    <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                        <div className="relative flex-1 max-w-[200px]">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <DollarSign size={16} />
                            </div>
                            <input 
                                type="number" 
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                        <span className="text-slate-400 font-medium">-</span>
                        <div className="relative flex-1 max-w-[200px]">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <DollarSign size={16} />
                            </div>
                            <input 
                                type="number" 
                                placeholder="Max Price" 
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    
                    <div className="text-sm text-slate-500 font-medium whitespace-nowrap">
                        Showing {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'}
                    </div>
                </div>

                {/* Expanded Filters: Amenities */}
                {showFilters && availableAmenities.length > 0 && (
                    <div className="pt-6 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
                        <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Filter size={16} /> Filter by Amenities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {availableAmenities.map(amenity => {
                                const isSelected = selectedAmenities.includes(amenity);
                                return (
                                    <button
                                        key={amenity}
                                        onClick={() => toggleAmenity(amenity)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                                            isSelected 
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        {isSelected && <Check size={12} />}
                                        {amenity}
                                    </button>
                                );
                            })}
                            {selectedAmenities.length > 0 && (
                                <button 
                                    onClick={() => setSelectedAmenities([])}
                                    className="px-3 py-1.5 text-xs text-red-500 font-medium hover:underline ml-2"
                                >
                                    Clear Amenities
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Room Grid */}
            {filteredRooms.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredRooms.map(room => (
                        <div key={room.room_id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row animate-in fade-in">
                            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                                <img src={room.photo_url || 'https://via.placeholder.com/400'} alt={room.room_type} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6 w-full md:w-1/2 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{room.room_type}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                                        <span className="flex items-center gap-1"><Users size={14}/> {room.max_occupancy} Guests</span>
                                        <span className="flex items-center gap-1"><BedDouble size={14}/> {room.bed_type}</span>
                                        {room.room_size && <span className="flex items-center gap-1"><Square size={14}/> {room.room_size}</span>}
                                    </div>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">{room.description}</p>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-blue-600">${room.price_per_night}</span>
                                        <span className="text-xs text-slate-400">/night</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleViewDetails(room)}
                                            className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100 text-sm"
                                        >
                                            Details
                                        </button>
                                        <button 
                                            onClick={() => handleBookRoom(room)}
                                            className="flex-1 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-1"
                                        >
                                            Book <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">No rooms match your filters.</p>
                    <button onClick={() => { setMinPrice(''); setMaxPrice(''); setSelectedAmenities([]); }} className="text-blue-600 text-sm font-bold mt-2 hover:underline">Clear Filters</button>
                </div>
            )}

            {/* Room Details Modal */}
            <Modal isOpen={!!selectedRoom} onClose={() => setSelectedRoom(null)} title={selectedRoom?.room_type || 'Room Details'} maxWidth="max-w-4xl">
                {selectedRoom && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <img src={selectedRoom.photo_url} className="w-full h-64 object-cover rounded-xl mb-6 shadow-md" alt="Room" />
                            
                            <h4 className="font-bold text-lg mb-3">Room Amenities</h4>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {selectedRoom.amenities?.split(',').map((am, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="text-blue-600">{getAmenityIcon(am)}</div>
                                        <span className="text-sm font-medium text-slate-700">{am.trim()}</span>
                                    </div>
                                ))}
                            </div>

                            <h4 className="font-bold text-lg mb-2">Description</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">{selectedRoom.description}</p>
                        </div>
                        
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 h-full overflow-y-auto max-h-[600px]">
                            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <MessageCircle size={20}/> Guest Opinions
                            </h4>
                            {loadingReviews ? (
                                <p className="text-slate-500 italic">Loading reviews...</p>
                            ) : roomReviews.length > 0 ? (
                                <div className="space-y-4">
                                    {roomReviews.map(r => (
                                        <div key={r.review_id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-sm text-slate-900">{r.customer_name}</span>
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "" : "text-slate-200"}/>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed">"{r.review_text}"</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 italic">No specific reviews for this room type yet.</p>
                            )}
                            
                            <div className="mt-8 pt-6 border-t border-slate-200 sticky bottom-0 bg-slate-50">
                                <button 
                                    onClick={() => handleBookRoom(selectedRoom)}
                                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                                >
                                    Book This Room (${selectedRoom.price_per_night}) <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { api } from '../services/api';
// import { Room, Hotel, Review } from '../types';
// import { 
//     Users, BedDouble, Square, ArrowRight, Star, MessageCircle, X, SlidersHorizontal, DollarSign, Check, Filter,
//     Wifi, Coffee, Wind, Monitor, Bath, Snowflake, Utensils, Tv, Sparkles, CheckCircle
// } from 'lucide-react';
// import { SkeletonCard } from '../components/ui/Loading';
// import { Modal } from '../components/ui/Modal';

// export const HotelRoomsPage: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
    
//     // Data State
//     const [rooms, setRooms] = useState<Room[]>([]);
//     const [filteredRooms, setFilteredRooms] = useState<Room[]>([]); // For display
//     const [hotel, setHotel] = useState<Hotel | null>(null);
//     const [loading, setLoading] = useState(true);

//     // Filter State
//     const [minPrice, setMinPrice] = useState<number | ''>('');
//     const [maxPrice, setMaxPrice] = useState<number | ''>('');
//     const [availableAmenities, setAvailableAmenities] = useState<string[]>([]);
//     const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
//     const [showFilters, setShowFilters] = useState(false);

//     // Modal State
//     const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
//     const [roomReviews, setRoomReviews] = useState<Review[]>([]);
//     const [loadingReviews, setLoadingReviews] = useState(false);

//     useEffect(() => {
//         const fetchData = async () => {
//             if (!id) return;
//             setLoading(true);
//             try {
//                 // Fetch Hotel Basic Info and Rooms in parallel
//                 const [hotelData, roomsData] = await Promise.all([
//                     api.getHotelById(Number(id)),
//                     api.getHotelRooms(Number(id))
//                 ]);
//                 setHotel(hotelData);
//                 setRooms(roomsData);
//                 setFilteredRooms(roomsData); // Initialize filtered list

//                 // Extract Unique Amenities dynamically
//                 const allAmenities = new Set<string>();
//                 roomsData.forEach(room => {
//                     if (room.amenities) {
//                         room.amenities.split(',').forEach(a => allAmenities.add(a.trim()));
//                     }
//                 });
//                 setAvailableAmenities(Array.from(allAmenities).sort());

//             } catch (error) {
//                 console.error("Failed to fetch data", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchData();
//     }, [id]);

//     // Filtering Logic
//     useEffect(() => {
//         let result = rooms;

//         if (minPrice !== '') {
//             result = result.filter(room => room.price_per_night >= Number(minPrice));
//         }

//         if (maxPrice !== '') {
//             result = result.filter(room => room.price_per_night <= Number(maxPrice));
//         }

//         if (selectedAmenities.length > 0) {
//             result = result.filter(room => {
//                 const roomAmenities = room.amenities ? room.amenities.toLowerCase() : '';
//                 // Room must contain ALL selected amenities
//                 return selectedAmenities.every(selected => roomAmenities.includes(selected.toLowerCase()));
//             });
//         }

//         setFilteredRooms(result);
//     }, [minPrice, maxPrice, selectedAmenities, rooms]);

//     const toggleAmenity = (amenity: string) => {
//         setSelectedAmenities(prev => 
//             prev.includes(amenity) 
//                 ? prev.filter(a => a !== amenity)
//                 : [...prev, amenity]
//         );
//     };

//     const getAmenityIcon = (text: string) => {
//         const lower = text.toLowerCase();
//         if (lower.includes('wifi')) return <Wifi size={18} />;
//         if (lower.includes('coffee') || lower.includes('tea')) return <Coffee size={18} />;
//         if (lower.includes('tv') || lower.includes('monitor')) return <Monitor size={18} />;
//         if (lower.includes('air') || lower.includes('heat') || lower.includes('conditioning')) return <Wind size={18} />;
//         if (lower.includes('bath') || lower.includes('shower')) return <Bath size={18} />;
//         if (lower.includes('view') || lower.includes('balcony')) return <Sparkles size={18} />;
//         if (lower.includes('desk') || lower.includes('work')) return <CheckCircle size={18} />; // Generic/Work
//         if (lower.includes('minibar') || lower.includes('fridge')) return <Utensils size={18} />;
//         if (lower.includes('ski') || lower.includes('snow')) return <Snowflake size={18} />;
//         return <CheckCircle size={18} />;
//     };

//     const handleViewDetails = async (room: Room) => {
//         setSelectedRoom(room);
//         setLoadingReviews(true);
//         try {
//             const reviews = await api.getRoomReviews(room.hotel_id, room.room_type);
//             setRoomReviews(reviews);
//         } catch (e) {
//             console.error("Failed to load reviews", e);
//             setRoomReviews([]);
//         } finally {
//             setLoadingReviews(false);
//         }
//     };

//     const handleBookRoom = (room: Room) => {
//         // Navigate to booking page, passing both hotel and specific room details
//         navigate('/booking', { state: { hotel, room } });
//     };

//     if (loading) return (
//         <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
//             <SkeletonCard/><SkeletonCard/><SkeletonCard/>
//         </div>
//     );

//     if (!hotel) return <div className="text-center p-8">Hotel not found.</div>;

//     return (
//         <div className="max-w-7xl mx-auto space-y-8 pb-12">
//             {/* Header */}
//             <div className="flex flex-col md:flex-row justify-between items-end gap-4">
//                 <div>
//                     <h1 className="text-3xl font-serif font-bold text-slate-900">{hotel.name} - Rooms</h1>
//                     <p className="text-slate-500 mt-1">Select your perfect sanctuary.</p>
//                 </div>
//                 <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-blue-600 font-medium">Back to Hotel Details</button>
//             </div>

//             {/* Filter Bar */}
//             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 transition-all">
//                 <div className="flex flex-col md:flex-row items-center gap-6">
//                     <button 
//                         onClick={() => setShowFilters(!showFilters)}
//                         className={`flex items-center gap-2 font-bold min-w-[140px] px-4 py-2.5 rounded-xl transition-colors ${
//                             showFilters ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
//                         }`}
//                     >
//                         <SlidersHorizontal size={20} className={showFilters ? "text-blue-600" : "text-slate-400"} />
//                         <span>{showFilters ? 'Hide Filters' : 'Filter Rooms'}</span>
//                     </button>
                    
//                     <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
//                         <div className="relative flex-1 max-w-[200px]">
//                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
//                                 <DollarSign size={16} />
//                             </div>
//                             <input 
//                                 type="number" 
//                                 placeholder="Min Price"
//                                 value={minPrice}
//                                 onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
//                                 className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                             />
//                         </div>
//                         <span className="text-slate-400 font-medium">-</span>
//                         <div className="relative flex-1 max-w-[200px]">
//                             <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
//                                 <DollarSign size={16} />
//                             </div>
//                             <input 
//                                 type="number" 
//                                 placeholder="Max Price" 
//                                 value={maxPrice}
//                                 onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
//                                 className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//                             />
//                         </div>
//                     </div>
                    
//                     <div className="text-sm text-slate-500 font-medium whitespace-nowrap">
//                         Showing {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'}
//                     </div>
//                 </div>

//                 {/* Expanded Filters: Amenities */}
//                 {showFilters && availableAmenities.length > 0 && (
//                     <div className="pt-6 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
//                         <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
//                             <Filter size={16} /> Filter by Amenities
//                         </h4>
//                         <div className="flex flex-wrap gap-2">
//                             {availableAmenities.map(amenity => {
//                                 const isSelected = selectedAmenities.includes(amenity);
//                                 return (
//                                     <button
//                                         key={amenity}
//                                         onClick={() => toggleAmenity(amenity)}
//                                         className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
//                                             isSelected 
//                                             ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
//                                             : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
//                                         }`}
//                                     >
//                                         {isSelected && <Check size={12} />}
//                                         {amenity}
//                                     </button>
//                                 );
//                             })}
//                             {selectedAmenities.length > 0 && (
//                                 <button 
//                                     onClick={() => setSelectedAmenities([])}
//                                     className="px-3 py-1.5 text-xs text-red-500 font-medium hover:underline ml-2"
//                                 >
//                                     Clear Amenities
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Room Grid */}
//             {filteredRooms.length > 0 ? (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                     {filteredRooms.map(room => (
//                         <div key={room.room_id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row animate-in fade-in">
//                             <div className="w-full md:w-1/2 h-64 md:h-auto relative">
//                                 <img src={room.photo_url || 'https://via.placeholder.com/400'} alt={room.room_type} className="w-full h-full object-cover" />
//                             </div>
//                             <div className="p-6 w-full md:w-1/2 flex flex-col justify-between">
//                                 <div>
//                                     <h3 className="text-xl font-bold text-slate-900 mb-2">{room.room_type}</h3>
//                                     <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
//                                         <span className="flex items-center gap-1"><Users size={14}/> {room.max_occupancy} Guests</span>
//                                         <span className="flex items-center gap-1"><BedDouble size={14}/> {room.bed_type}</span>
//                                         {room.room_size && <span className="flex items-center gap-1"><Square size={14}/> {room.room_size}</span>}
//                                     </div>
//                                     <p className="text-slate-500 text-sm line-clamp-2 mb-4">{room.description}</p>
//                                 </div>
                                
//                                 <div className="space-y-3">
//                                     <div className="flex justify-between items-center">
//                                         <span className="text-2xl font-bold text-blue-600">${room.price_per_night}</span>
//                                         <span className="text-xs text-slate-400">/night</span>
//                                     </div>
//                                     <div className="flex gap-2">
//                                         <button 
//                                             onClick={() => handleViewDetails(room)}
//                                             className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100 text-sm"
//                                         >
//                                             Details
//                                         </button>
//                                         <button 
//                                             onClick={() => handleBookRoom(room)}
//                                             className="flex-1 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-1"
//                                         >
//                                             Book <ArrowRight size={14} />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
//                     <p className="text-slate-500 font-medium">No rooms match your filters.</p>
//                     <button onClick={() => { setMinPrice(''); setMaxPrice(''); setSelectedAmenities([]); }} className="text-blue-600 text-sm font-bold mt-2 hover:underline">Clear Filters</button>
//                 </div>
//             )}

//             {/* Room Details Modal */}
//             <Modal isOpen={!!selectedRoom} onClose={() => setSelectedRoom(null)} title={selectedRoom?.room_type || 'Room Details'} maxWidth="max-w-4xl">
//                 {selectedRoom && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <div>
//                             <img src={selectedRoom.photo_url} className="w-full h-64 object-cover rounded-xl mb-6 shadow-md" alt="Room" />
                            
//                             <h4 className="font-bold text-lg mb-3">Room Amenities</h4>
//                             <div className="grid grid-cols-2 gap-3 mb-6">
//                                 {selectedRoom.amenities?.split(',').map((am, i) => (
//                                     <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
//                                         <div className="text-blue-600">{getAmenityIcon(am)}</div>
//                                         <span className="text-sm font-medium text-slate-700">{am.trim()}</span>
//                                     </div>
//                                 ))}
//                             </div>

//                             <h4 className="font-bold text-lg mb-2">Description</h4>
//                             <p className="text-slate-600 text-sm leading-relaxed">{selectedRoom.description}</p>
//                         </div>
                        
//                         <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 h-full overflow-y-auto max-h-[600px]">
//                             <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
//                                 <MessageCircle size={20}/> Guest Opinions
//                             </h4>
//                             {loadingReviews ? (
//                                 <p className="text-slate-500 italic">Loading reviews...</p>
//                             ) : roomReviews.length > 0 ? (
//                                 <div className="space-y-4">
//                                     {roomReviews.map(r => (
//                                         <div key={r.review_id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
//                                             <div className="flex justify-between items-start mb-2">
//                                                 <span className="font-bold text-sm text-slate-900">{r.customer_name}</span>
//                                                 <div className="flex text-yellow-400">
//                                                     {[...Array(5)].map((_, i) => (
//                                                         <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "" : "text-slate-200"}/>
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                             <p className="text-slate-600 text-sm leading-relaxed">"{r.review_text}"</p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <p className="text-slate-500 italic">No specific reviews for this room type yet.</p>
//                             )}
                            
//                             <div className="mt-8 pt-6 border-t border-slate-200 sticky bottom-0 bg-slate-50">
//                                 <button 
//                                     onClick={() => handleBookRoom(selectedRoom)}
//                                     className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
//                                 >
//                                     Book This Room (${selectedRoom.price_per_night}) <ArrowRight size={18} />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </Modal>
//         </div>
//     );
// };

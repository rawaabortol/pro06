
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User as UserType, Booking } from '../../types';
import { Search, Mail, Phone, Crown, MoreHorizontal, Calendar } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export const CustomerDirectoryPage: React.FC = () => {
    const [customers, setCustomers] = useState<UserType[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<UserType | null>(null);
    const [customerBookings, setCustomerBookings] = useState<Booking[]>([]);
    const [viewMode, setViewMode] = useState<'profile' | 'history' | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCustomers = async () => {
            setLoading(true);
            try {
                const data = await api.getCustomers();
                setCustomers(data);
            } catch (error) {
                console.error("Failed to load customers", error);
            } finally {
                setLoading(false);
            }
        };
        loadCustomers();
    }, []);

    const filteredCustomers = customers.filter(c => 
        c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleViewProfile = (customer: UserType) => {
        setSelectedCustomer(customer);
        setViewMode('profile');
    };

    const handleViewHistory = async (customer: UserType) => {
        setSelectedCustomer(customer);
        try {
            // Fetch bookings for this specific customer via API in a real app
            // For now we assume we have access or fetch all bookings
            const allBookings = await api.getBookings();
            
            // Filter by customer and slice to get the last 2 (assuming API returns DESC order)
            const recentBookings = allBookings
                .filter(b => b.CUSTOMER_ID === customer.id)
                .slice(0, 2);
                console.log("Recent bookings fetched:", recentBookings);
            setCustomerBookings(recentBookings);
            setViewMode('history');
        } catch (error) {
            console.error("Failed to fetch booking history", error);
            setCustomerBookings([]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Customer Directory</h1>
                    <p className="text-slate-500 mt-1">Access profiles, loyalty status, and history.</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search customers..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-3 text-center py-10">Loading customers...</div>
                ) : filteredCustomers.map(customer => (
                    <div key={customer.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                <img src='../public/images/images.png' alt={customer.firstName} className="w-full h-full object-cover" />
                            </div>
                            <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-slate-900">{customer.firstName} {customer.lastName}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1
                                    ${customer.loyaltyTier === 'GOLD' ? 'bg-yellow-100 text-yellow-700' : 
                                      customer.loyaltyTier === 'SILVER' ? 'bg-slate-100 text-slate-600' : 
                                      'bg-orange-100 text-orange-700'}`}>
                                    <Crown size={12} fill="currentColor" />
                                    {customer.loyaltyTier}
                                </span>
                                <span className="text-xs text-slate-500">{customer.loyaltyPoints} pts</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Mail size={16} />
                                </div>
                                <span className="truncate">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Phone size={16} />
                                </div>
                                <span>+1 (555) 123-4567</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-50 flex gap-3">
                            <button 
                                onClick={() => handleViewProfile(customer)}
                                className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-xl font-medium text-sm hover:bg-blue-100 transition-colors"
                            >
                                View Profile
                            </button>
                            <button 
                                onClick={() => handleViewHistory(customer)}
                                className="flex-1 bg-slate-50 text-slate-600 py-2 rounded-xl font-medium text-sm hover:bg-slate-100 transition-colors"
                            >
                                History
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Customer Profile Modal */}
            <Modal 
                isOpen={viewMode === 'profile'} 
                onClose={() => setViewMode(null)} 
                title="Customer Profile"
            >
                {selectedCustomer && (
                    <div className="space-y-6 text-center">
                        <div className="flex flex-col items-center">
                            <img src='../public/images/images.png' alt="" className="w-24 h-24 rounded-full mb-4 shadow-lg" />
                            <h2 className="text-2xl font-bold text-slate-900">{selectedCustomer.firstName} {selectedCustomer.lastName}</h2>
                            <p className="text-slate-500">{selectedCustomer.email}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-left">
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <div className="text-xs text-slate-400 uppercase font-bold mb-1">Loyalty Tier</div>
                                <div className="font-bold text-blue-600">{selectedCustomer.loyaltyTier}</div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <div className="text-xs text-slate-400 uppercase font-bold mb-1">Points Balance</div>
                                <div className="font-bold text-slate-900">{selectedCustomer.loyaltyPoints}</div>
                            </div>
                        </div>
                         <div className="bg-blue-50 p-4 rounded-xl text-left">
                            <h4 className="font-bold text-blue-800 mb-2 text-sm">Internal Notes</h4>
                            <p className="text-sm text-blue-600">Customer prefers window seats. Anniversary in October.</p>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Booking History Modal */}
            <Modal 
                isOpen={viewMode === 'history'} 
                onClose={() => setViewMode(null)} 
                title={`${selectedCustomer?.firstName}'s Recent Bookings`}
                maxWidth="max-w-2xl"
            >
                <div className="space-y-4">
                    {selectedCustomer && customerBookings.length > 0 ? (
                         customerBookings.map(booking => (
                            <div key={booking.BOOKING_ID} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{booking.HOTEL_NAME}</h4>
                                        <p className="text-xs text-slate-500">{new Date(booking.BOOKING_DATE).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-900">${booking.TOTAL_AMOUNT}</div>
                                    <div className={`text-xs font-bold ${booking.STATUS === 'Confirmed' ? 'text-green-600' : 'text-slate-400'}`}>{booking.STATUS}</div>
                                </div>
                            </div>
                         ))
                    ) : (
                        <div className="text-center py-8 text-slate-500">No recent booking history found for this customer.</div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

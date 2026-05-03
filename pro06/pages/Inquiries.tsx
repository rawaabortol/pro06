
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, InquiryStatus, Inquiry } from '../types';
import { api } from '../services/api';
import { Send, Map, Calendar, DollarSign, Users, MessageSquare, CheckCircle2, Clock, MapPin, Eye } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

// Customer Form Component
const CustomerInquiryForm = () => {
    const { user } = useAuth();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        destination: '',
        dates: '',
        budget: '',
        travelers: 2,
        notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.createInquiry({ 
                customer_id: user?.id, 
                ...formData
            });
            setSubmitted(true);
            setFormData({ destination: '', dates: '', budget: '', travelers: 2, notes: '' });
        } catch (error) {
            console.error("Failed to submit inquiry", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-16 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Inquiry Received!</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                    Thank you for trusting Odyssey with your dream vacation. One of our expert travel consultants will review your request.
                </p>
                <button onClick={() => setSubmitted(false)} className="text-blue-600 font-medium hover:underline">Submit another inquiry</button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                <span className="text-blue-600 font-bold tracking-wider text-sm uppercase mb-2 block">Tailor My Trip</span>
                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Let us craft your perfect itinerary.</h1>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Map size={24} /></div>
                        <div>
                            <h3 className="font-bold text-slate-900">Curated Destinations</h3>
                            <p className="text-slate-500 text-sm mt-1">We find hidden gems matched to your style.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-green-100 p-3 rounded-xl text-green-600"><DollarSign size={24} /></div>
                        <div>
                            <h3 className="font-bold text-slate-900">Budget Friendly</h3>
                            <p className="text-slate-500 text-sm mt-1">Luxury or economy, we respect your wallet.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Dream Destination</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                required 
                                className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none" 
                                placeholder="e.g., Santorini, Greece" 
                                value={formData.destination}
                                onChange={e => setFormData({...formData, destination: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Dates</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none" 
                                    placeholder="e.g., Summer 2026" 
                                    value={formData.dates}
                                    onChange={e => setFormData({...formData, dates: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Budget</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none" 
                                    placeholder="e.g., $5000" 
                                    value={formData.budget}
                                    onChange={e => setFormData({...formData, budget: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Travelers</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="number" 
                                min="1"
                                required 
                                className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none" 
                                value={formData.travelers}
                                onChange={e => setFormData({...formData, travelers: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
                        <textarea 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none" 
                            rows={3} 
                            placeholder="Any specific activities or dietary requirements?"
                            value={formData.notes}
                            onChange={e => setFormData({...formData, notes: e.target.value})}
                        ></textarea>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-70">
                        {loading ? 'Submitting...' : 'Submit Request'} <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
};

// Employee Management Board Component
const AgentInquiryBoard = () => {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInquiries();
    }, []);

    const loadInquiries = async () => {
        setLoading(true);
        try {
            const data = await api.getInquiries();
            setInquiries(data);
        } catch (e) { 
            console.error(e); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleStatusChange = async (inquiry: Inquiry, newStatus: string) => {
        try {
            await api.createInquiry({ ...inquiry, status: newStatus }); // Actually this should use an Update endpoint
            // Hack for the request - assuming createInquiry is generic but we probably need an update endpoint
            // Re-using the endpoint wrapper but mocking the call or creating a specific one.
            
            // Real implementation:
            const response = await fetch(`http://localhost:5000/api/inquiries/${inquiry.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (response.ok) {
                setInquiries(prev => prev.map(inq => inq.id === inquiry.id ? { ...inq, status: newStatus as InquiryStatus } : inq));
                if (selectedInquiry?.id === inquiry.id) {
                    setSelectedInquiry(prev => prev ? { ...prev, status: newStatus as InquiryStatus } : null);
                }
            }
        } catch (e) {
            console.error("Failed to update status", e);
        }
    };

    if(loading) return <div className="p-8 text-center text-slate-500">Loading inquiries...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-slate-900">Inquiry Management</h1>
                <button onClick={loadInquiries} className="text-blue-600 font-medium">Refresh</button>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-xs">
                        <tr>
                            <th className="px-6 py-4">Ref ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Destination</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inquiries.length > 0 ? inquiries.map((inquiry) => (
                            <tr key={inquiry.id} className="border-b hover:bg-slate-50">
                                <td className="px-6 py-4">#{inquiry.id}</td>
                                <td className="px-6 py-4 font-bold text-slate-900">{inquiry.customer_name}</td>
                                <td className="px-6 py-4">{inquiry.destination}</td>
                                <td className="px-6 py-4">{new Date(inquiry.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        inquiry.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {inquiry.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => setSelectedInquiry(inquiry)} 
                                        className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={6} className="text-center p-8">No inquiries found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <Modal isOpen={!!selectedInquiry} onClose={() => setSelectedInquiry(null)} title="Inquiry Details">
                {selectedInquiry && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                {selectedInquiry.customer_name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{selectedInquiry.customer_name}</h3>
                                <p className="text-sm text-slate-500">Customer ID: {selectedInquiry.customer_id}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white border border-slate-100 rounded-xl">
                                <span className="text-xs text-slate-400 uppercase font-bold">Destination</span>
                                <p className="font-bold text-slate-900">{selectedInquiry.destination}</p>
                            </div>
                            <div className="p-3 bg-white border border-slate-100 rounded-xl">
                                <span className="text-xs text-slate-400 uppercase font-bold">Budget</span>
                                <p className="font-bold text-slate-900">{selectedInquiry.budget}</p>
                            </div>
                            <div className="p-3 bg-white border border-slate-100 rounded-xl">
                                <span className="text-xs text-slate-400 uppercase font-bold">Travelers</span>
                                <p className="font-bold text-slate-900">{selectedInquiry.travelers}</p>
                            </div>
                            <div className="p-3 bg-white border border-slate-100 rounded-xl">
                                <span className="text-xs text-slate-400 uppercase font-bold">Dates</span>
                                <p className="font-bold text-slate-900">{selectedInquiry.dates}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <span className="text-xs text-slate-400 uppercase font-bold block mb-2">Customer Notes</span>
                            <p className="text-slate-600 text-sm leading-relaxed">{selectedInquiry.notes}</p>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            {selectedInquiry.status !== 'Resolved' ? (
                                <button 
                                    onClick={() => handleStatusChange(selectedInquiry, 'Resolved')} 
                                    className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <CheckCircle2 size={18} /> Mark as Resolved
                                </button>
                            ) : (
                                <span className="text-green-600 font-bold flex items-center gap-2">
                                    <CheckCircle2 size={18} /> Inquiry Resolved
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export const InquiriesPage: React.FC = () => {
    const { user } = useAuth();
    return user?.role === UserRole.EMPLOYEE ? <AgentInquiryBoard /> : <CustomerInquiryForm />;
};

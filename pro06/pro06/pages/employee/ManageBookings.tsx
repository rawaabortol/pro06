
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Booking } from '../../types';
import { Search, MoreVertical, Check, X, Clock, Edit, Trash, Eye, MapPin, User, DollarSign } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';

export const ManageBookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [editForm, setEditForm] = useState({ checkIn: '', checkOut: '', status: '' });
    const [modalMode, setModalMode] = useState<'view' | 'edit' | null>(null);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const data = await api.getBookings();
            setBookings(data);
        } catch (error) { console.error(error); } 
        finally { setLoading(false); }
    };

    useEffect(() => { loadBookings(); }, []);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBooking) return;
        try {
            await api.updateBooking(selectedBooking.BOOKING_ID, {
                status: editForm.status,
                checkIn: editForm.CHECK_IN,
                checkOut: editForm.CHECK_OUT
            });
            await loadBookings(); // Refresh data from DB
            setModalMode(null);
        } catch (e) { alert("Update failed"); }
    };

    const handleCancel = async (id: number) => {
        if(!window.confirm("Confirm cancellation?")) return;
        await api.updateBooking(id, { status: 'Cancelled' });
        loadBookings();
    };

    // ... Table rendering logic ...
    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold">Manage Bookings</h1>
                <button onClick={loadBookings} className="text-blue-600">Refresh Data</button>
            </div>
            
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Hotel</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(b => (
                            <tr key={b.booking_id} className="border-b hover:bg-slate-50">
                                <td className="px-6 py-4">#{b.BOOKING_ID}</td>
                                <td className="px-6 py-4">{b.CUSTOMER_ID}</td>
                                <td className="px-6 py-4">{b.HOTEL_NAME}</td>
                                <td className="px-6 py-4 font-bold">{b.STATUS}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button onClick={() => { setSelectedBooking(b); setModalMode('view'); }}><Eye size={16}/></button>
                                    <button onClick={() => { setSelectedBooking(b); setEditForm({checkIn: b.CHECK_IN, checkOut: b.CHECK_OUT, status: b.STATUS}); setModalMode('edit'); }}><Edit size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <Modal isOpen={modalMode === 'edit'} onClose={() => setModalMode(null)} title="Update Booking">
                 <form onSubmit={handleSaveChanges} className="space-y-4">
                    <label className="block">Status</label>
                    <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} className="w-full border p-2 rounded">
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <button className="w-full bg-blue-600 text-white p-2 rounded">Save</button>
                 </form>
            </Modal>
        </div>
    );
};

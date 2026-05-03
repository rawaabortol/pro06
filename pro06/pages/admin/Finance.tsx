
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Download, TrendingUp, DollarSign, Calendar, CreditCard, User, BedDouble, ArrowUpRight } from 'lucide-react';
import { Transaction } from '../../types';

export const FinancePage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await api.getTransactions();
                setTransactions(data);
            } catch (error) { console.error(error); } 
            finally { setLoading(false); }
        };
        load();
    }, []);

    const totalIncome = transactions.reduce((sum, t) => sum + (t.status === 'COMPLETED' ? t.amount : 0), 0);
    const avgTransaction = transactions.length > 0 ? totalIncome / transactions.length : 0;

    const handleDownload = () => { 
        const csvContent = "data:text/csv;charset=utf-8," 
            + "ID,Date,Customer,Hotel,Room,Amount,Status\n"
            + transactions.map(t => `${t.id},${t.date},${t.customerName},${t.hotelName},${t.roomType},${t.amount},${t.status}`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "finance_report.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Financial Overview</h1>
                    <p className="text-slate-500 mt-1">Track payments and transaction history.</p>
                </div>
                <button 
                    onClick={handleDownload} 
                    className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                >
                    <Download size={18}/> Export CSV
                </button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Total Income</p>
                        <h3 className="text-2xl font-bold text-slate-900">${totalIncome.toLocaleString()}</h3>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                        <DollarSign size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Transactions</p>
                        <h3 className="text-2xl font-bold text-slate-900">{transactions.length}</h3>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <TrendingUp size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Avg. Ticket Size</p>
                        <h3 className="text-2xl font-bold text-slate-900">${avgTransaction.toFixed(2)}</h3>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                        <ArrowUpRight size={24} />
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-bold">Transaction</th>
                                <th className="px-6 py-4 font-bold">Customer</th>
                                <th className="px-6 py-4 font-bold">Booking Details</th>
                                <th className="px-6 py-4 font-bold">Date</th>
                                <th className="px-6 py-4 font-bold text-right">Amount</th>
                                <th className="px-6 py-4 font-bold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="p-12 text-center text-slate-400">Loading financial data...</td></tr>
                            ) : transactions.length > 0 ? (
                                transactions.map(t => (
                                    <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">#{t.id}</div>
                                            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                                                <CreditCard size={12}/> {t.method || 'Credit Card'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                    {t.customerName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{t.customerName}</div>
                                                    <div className="text-xs text-slate-500">{t.customerEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{t.hotelName}</div>
                                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                                <BedDouble size={12} /> {t.roomType || 'Standard'} 
                                                <span className="text-slate-300 mx-1">|</span>
                                                Booking #{t.bookingId}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400"/>
                                                {new Date(t.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900">
                                            ${t.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                t.status === 'COMPLETED' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} className="p-12 text-center text-slate-500">No transactions found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
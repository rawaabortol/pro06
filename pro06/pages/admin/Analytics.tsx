
import React, { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, Map, Download } from 'lucide-react';
import { api } from '../../services/api';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

export const AnalyticsPage: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const analyticsData = await api.getAnalytics();
                setData(analyticsData);
            } catch (error) {
                console.error("Failed to load analytics", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const downloadReport = () => {
        const content = `Analytics Report\nGenerated on: ${new Date().toLocaleString()}\n\nKPIs:\nRevenue: $${data.kpi.revenue}\nBookings: ${data.kpi.bookings}\nUsers: ${data.kpi.users}\n\nMonthly Sales Data:\n${JSON.stringify(data.monthlyData, null, 2)}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Analytics-Report.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading || !data) {
        return <div className="p-10 text-center">Loading analytics dashboard...</div>;
    }

    const kpis = [
        { title: 'Total Revenue', value: `$${data.kpi.revenue.toLocaleString()}`, change: 'Live', icon: DollarSign, color: 'blue' },
        { title: 'Total Bookings', value: data.kpi.bookings.toLocaleString(), change: 'Live', icon: Calendar, color: 'purple' },
        { title: 'Active Users', value: data.kpi.users.toLocaleString(), change: 'Live', icon: Users, color: 'pink' },
        { title: 'Top Destination', value: data.kpi.topDestination, change: 'Most Booked', icon: Map, color: 'orange' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Analytics & Reports</h1>
                    <p className="text-slate-500 mt-1">Deep dive into business performance metrics.</p>
                </div>
                <button 
                    onClick={downloadReport}
                    className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-medium hover:bg-slate-50 flex items-center gap-2"
                >
                    <Download size={18} /> Export Report
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700`}>
                                <TrendingUp size={12} className="mr-1" />
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Monthly Revenue Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Revenue & Visitors</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(val) => `$${val}`} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="visitors" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Hotel Type Pie Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Booking Distribution</h2>
                    <div className="h-64 w-full relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.hotelTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.hotelTypeData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-900">{data.kpi.bookings}</div>
                                <div className="text-xs text-slate-500 uppercase">Bookings</div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3 mt-4">
                        {data.hotelTypeData.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-slate-600">{entry.name}</span>
                                </div>
                                <span className="font-bold text-slate-900">{entry.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
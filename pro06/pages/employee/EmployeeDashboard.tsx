
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { EmployeeRole, Inquiry } from '../../types';
import { api } from '../../services/api';
import { CalendarCheck, DollarSign, Users, TrendingUp, Briefcase, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { SkeletonStat } from '../../components/ui/Loading';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon className={color.replace('bg-', 'text-')} size={24} />
            </div>
        </div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
);

const chartData = [
    { name: 'Jan', revenue: 4000, bookings: 24 },
    { name: 'Feb', revenue: 3000, bookings: 18 },
    { name: 'Mar', revenue: 2000, bookings: 12 },
    { name: 'Apr', revenue: 2780, bookings: 20 },
    { name: 'May', revenue: 1890, bookings: 15 },
    { name: 'Jun', revenue: 2390, bookings: 22 },
];

const ManagerView = ({ revenue, bookingCount }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`$${revenue.toLocaleString()}`} icon={DollarSign} color="bg-emerald-500" />
        <StatCard title="Active Bookings" value={bookingCount} icon={CalendarCheck} color="bg-blue-500" />
    </div>
);

const AgentView = ({ bookingCount }: any) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="My Sales (Month)" value="$24,500" icon={DollarSign} color="bg-emerald-500" />
        <StatCard title="Active Itineraries" value={bookingCount} icon={CalendarCheck} color="bg-blue-500" />
    </div>
);

const ConsultantView = () => {
    const navigate = useNavigate();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);

    useEffect(() => {
        api.getInquiries().then(setInquiries).catch(console.error);
    }, []);
    
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Inquiry Queue" value={inquiries.length} icon={MessageSquare} color="bg-blue-500" />
                <StatCard title="Customer Satisfaction" value="4.9/5" icon={CheckCircle2} color="bg-green-500" />
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mt-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Priority Tasks</h2>
                <div className="space-y-4">
                    {inquiries.slice(0, 3).map(inq => (
                        <div key={inq.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                                <h4 className="font-bold text-slate-900">{inq.destination}</h4>
                                <p className="text-xs text-slate-500">{inq.customer_name}</p>
                            </div>
                            <button onClick={() => navigate('/inquiries')} className="text-blue-600 text-sm">Review</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export const EmployeeDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const role = user?.employeeRole;
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await api.getEmployeeDashboard(role || '');
                setDashboardData(data);
            } catch (e) { console.error(e); } 
            finally { setLoading(false); }
        };
        fetchData();
    }, [role]);

    if (loading || !dashboardData) return <div>Loading dashboard...</div>;

    const recentBookings = dashboardData.recentBookings || [];
    const totalRevenue = recentBookings.reduce((acc: number, curr: any) => acc + (curr.total_amount || 0), 0);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-serif font-bold text-slate-900">Dashboard</h1>
            {(role === EmployeeRole.MANAGER || role === EmployeeRole.ADMIN) ? (
                <ManagerView revenue={totalRevenue} bookingCount={recentBookings.length} />
            ) : role === EmployeeRole.CONSULTANT ? (
                <ConsultantView />
            ) : (
                <AgentView bookingCount={recentBookings.length} />
            )}
            
            {role !== EmployeeRole.CONSULTANT && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b"><h2 className="text-lg font-bold">Recent Bookings</h2></div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs text-slate-400 uppercase">
                            <tr><th className="px-6 py-4">ID</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Status</th></tr>
                        </thead>
                        <tbody>
                            {recentBookings.map((b: any) => (
                                <tr key={b.booking_id || b.BOOKING_ID} className="border-b">
                                    <td className="px-6 py-4">#{b.booking_id || b.BOOKING_ID}</td>
                                    <td className="px-6 py-4">{b.customer_name || b.CUSTOMER_NAME}</td>
                                    <td className="px-6 py-4">{b.status || b.STATUS}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { EmployeeRole, User } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { User as UserIcon, Bell, Lock, Users, CreditCard, Plus, Trash2, Edit2, CheckCircle2, Shield, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Team');
    const [employees, setEmployees] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal States
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newEmp, setNewEmp] = useState({ firstName: '', lastName: '', email: '', department: 'Sales', role: EmployeeRole.AGENT });
    
    // Notifications State (Mock)
    const [notifications, setNotifications] = useState({ email: true, push: false, monthly: true });

    // Salary Adjustment State
    const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
    const [inflationRate, setInflationRate] = useState<number>(5);
    const [cutOffDate, setCutOffDate] = useState<string>('2023-01-01');
    const [previewData, setPreviewData] = useState<any[] | null>(null);
    const [salaryLoading, setSalaryLoading] = useState(false);
    const [adjustmentSuccess, setAdjustmentSuccess] = useState(false);

    useEffect(() => {
        if (activeTab === 'Team') {
            loadTeam();
        }
    }, [activeTab]);

    const loadTeam = async () => {
        setLoading(true);
        try {
            const data = await api.getEmployees();
            setEmployees(data);
        } catch (error) {
            console.error("Failed to load team", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createEmployee(newEmp);
            setIsAddOpen(false);
            setNewEmp({ firstName: '', lastName: '', email: '', department: 'Sales', role: EmployeeRole.AGENT });
            loadTeam();
        } catch (error) {
            alert("Failed to create employee");
        }
    };

    const handleRoleChange = async (id: number, newRole: string) => {
        try {
            await api.updateEmployeeRole(id, newRole);
            loadTeam();
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const handleDeleteEmployee = async (id: number) => {
        if (window.confirm("Are you sure you want to revoke access for this employee?")) {
            try {
                await api.deleteEmployee(id);
                loadTeam();
            } catch (error) {
                console.error("Delete failed", error);
            }
        }
    };

    // Salary Adjustment Handlers
    const handlePreviewRaise = async () => {
        setSalaryLoading(true);
        try {
            const data = await api.previewSalaryRaise(inflationRate, cutOffDate);
            setPreviewData(data);
        } catch (e) {
            console.error(e);
            alert("Failed to calculate preview");
        } finally {
            setSalaryLoading(false);
        }
    };

    const handleApplyRaise = async () => {
        setSalaryLoading(true);
        try {
            await api.applySalaryRaise(inflationRate, cutOffDate);
            setAdjustmentSuccess(true);
            setTimeout(() => {
                setIsSalaryModalOpen(false);
                setAdjustmentSuccess(false);
                setPreviewData(null);
                loadTeam(); // Refresh main table
            }, 2000);
        } catch (e) {
            console.error(e);
            alert("Database Error: Failed to execute ADJUST_SALARY procedure.");
        } finally {
            setSalaryLoading(false);
        }
    };

    const TabButton = ({ name, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                activeTab === name
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
        >
            <Icon size={18} />
            {name}
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-serif font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 mt-1">Manage system preferences and team access.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full lg:w-64 shrink-0 space-y-2">
                    <TabButton name="General" icon={UserIcon} />
                    <TabButton name="Notifications" icon={Bell} />
                    <TabButton name="Security" icon={Lock} />
                    <TabButton name="Team" icon={Users} />
                    <TabButton name="Billing" icon={CreditCard} />
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 min-h-[600px]">
                    
                    {/* --- GENERAL TAB --- */}
                    {activeTab === 'General' && (
                        <div className="space-y-8 animate-in fade-in">
                            <h2 className="text-xl font-bold text-slate-900 border-b pb-4">Profile Settings</h2>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
                                    {user?.firstName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{user?.firstName} {user?.lastName}</h3>
                                    <p className="text-slate-500">{user?.role} - {user?.employeeRole}</p>
                                    <button className="text-blue-600 font-medium text-sm mt-2 hover:underline">Change Avatar</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                                    <input type="text" defaultValue={user?.firstName} className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50" readOnly />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                                    <input type="text" defaultValue={user?.lastName} className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50" readOnly />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                    <input type="email" defaultValue={user?.email} className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50" readOnly />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TEAM TAB (Dynamic) --- */}
                    {activeTab === 'Team' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="flex justify-between items-center border-b pb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Team Management</h2>
                                    <p className="text-sm text-slate-500">Manage employee access and roles.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsSalaryModalOpen(true)}
                                        className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"
                                    >
                                        <TrendingUp size={18} /> Adjust Salaries
                                    </button>
                                    <button 
                                        onClick={() => setIsAddOpen(true)}
                                        className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors"
                                    >
                                        <Plus size={18} /> Add Employee
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-12 text-slate-400">Loading team data...</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-xs text-slate-400 uppercase tracking-wider">
                                                <th className="py-4 font-bold">Employee</th>
                                                <th className="py-4 font-bold">Role</th>
                                                <th className="py-4 font-bold">Department</th>
                                                <th className="py-4 font-bold">Hire Date</th>
                                                <th className="py-4 font-bold">Salary</th>
                                                <th className="py-4 font-bold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employees.map((emp) => (
                                                <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                                                                {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-900">{emp.firstName} {emp.lastName}</div>
                                                                <div className="text-xs text-slate-500">{emp.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4">
                                                        <select 
                                                            value={emp.employeeRole} 
                                                            onChange={(e) => handleRoleChange(emp.id, e.target.value)}
                                                            className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer hover:bg-white hover:shadow-sm rounded px-2 py-1"
                                                        >
                                                            {Object.values(EmployeeRole).map(role => (
                                                                <option key={role} value={role}>{role}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="py-4">
                                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-bold uppercase">
                                                            {emp.department}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-sm text-slate-500">
                                                        {emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="py-4 text-sm font-bold text-slate-700">
                                                        {emp.salary ? `$${emp.salary.toLocaleString()}` : '-'}
                                                    </td>
                                                    <td className="py-4 text-right">
                                                        <button 
                                                            onClick={() => handleDeleteEmployee(emp.id)}
                                                            className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                            title="Revoke Access"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* --- NOTIFICATIONS TAB --- */}
                    {activeTab === 'Notifications' && (
                        <div className="space-y-8 animate-in fade-in">
                            <h2 className="text-xl font-bold text-slate-900 border-b pb-4">Notification Preferences</h2>
                            <div className="space-y-4">
                                {[
                                    { id: 'email', label: 'Email Notifications', desc: 'Receive booking updates via email' },
                                    { id: 'push', label: 'Push Notifications', desc: 'Real-time browser alerts' },
                                    { id: 'monthly', label: 'Monthly Report', desc: 'Summary of performance metrics' }
                                ].map((setting: any) => (
                                    <div key={setting.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                                        <div>
                                            <div className="font-bold text-slate-900">{setting.label}</div>
                                            <div className="text-sm text-slate-500">{setting.desc}</div>
                                        </div>
                                        <button 
                                            onClick={() => setNotifications({...notifications, [setting.id]: !(notifications as any)[setting.id]})}
                                            className={`w-12 h-6 rounded-full transition-colors relative ${
                                                (notifications as any)[setting.id] ? 'bg-blue-600' : 'bg-slate-200'
                                            }`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                                (notifications as any)[setting.id] ? 'left-7' : 'left-1'
                                            }`}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- SECURITY TAB --- */}
                    {activeTab === 'Security' && (
                         <div className="space-y-8 animate-in fade-in">
                            <h2 className="text-xl font-bold text-slate-900 border-b pb-4">Security Settings</h2>
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                                <Shield className="text-blue-600 shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 className="font-bold text-blue-900">Two-Factor Authentication</h4>
                                    <p className="text-sm text-blue-700 mt-1">We recommend enabling 2FA for administrative accounts to ensure data safety.</p>
                                    <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Enable 2FA</button>
                                </div>
                            </div>
                            <form className="max-w-md space-y-4">
                                <h3 className="font-bold text-slate-900">Change Password</h3>
                                <input type="password" placeholder="Current Password" className="w-full border p-3 rounded-xl bg-slate-50" />
                                <input type="password" placeholder="New Password" className="w-full border p-3 rounded-xl bg-slate-50" />
                                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold">Update Password</button>
                            </form>
                         </div>
                    )}

                     {/* --- BILLING TAB --- */}
                     {activeTab === 'Billing' && (
                         <div className="space-y-8 animate-in fade-in">
                            <h2 className="text-xl font-bold text-slate-900 border-b pb-4">Payment Methods</h2>
                            <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                                <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                                <div className="flex-1">
                                    <div className="font-bold text-slate-900">Visa ending in 4242</div>
                                    <div className="text-xs text-slate-500">Expires 12/28</div>
                                </div>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Default</span>
                            </div>
                            <button className="text-blue-600 font-bold hover:underline flex items-center gap-2">
                                <Plus size={18} /> Add new payment method
                            </button>
                         </div>
                    )}

                </div>
            </div>

            {/* Add Employee Modal */}
            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Team Member">
                <form onSubmit={handleAddEmployee} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">First Name</label>
                            <input required type="text" className="w-full border p-3 rounded-xl bg-slate-50" onChange={e => setNewEmp({...newEmp, firstName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Last Name</label>
                            <input required type="text" className="w-full border p-3 rounded-xl bg-slate-50" onChange={e => setNewEmp({...newEmp, lastName: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                        <input required type="email" className="w-full border p-3 rounded-xl bg-slate-50" onChange={e => setNewEmp({...newEmp, email: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                            <select className="w-full border p-3 rounded-xl bg-slate-50" onChange={e => setNewEmp({...newEmp, department: e.target.value})}>
                                <option>Sales</option>
                                <option>IT</option>
                                <option>Management</option>
                                <option>Customer Service</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                            <select className="w-full border p-3 rounded-xl bg-slate-50" onChange={e => setNewEmp({...newEmp, role: e.target.value as EmployeeRole})}>
                                {Object.values(EmployeeRole).map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="pt-4">
                        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                            Create Account
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Salary Adjustment Modal */}
            <Modal isOpen={isSalaryModalOpen} onClose={() => { setIsSalaryModalOpen(false); setPreviewData(null); }} title="Inflation Salary Adjustment" maxWidth="max-w-4xl">
                {adjustmentSuccess ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Salaries Updated!</h3>
                        <p className="text-slate-500">The database procedure executed successfully.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 text-amber-800">
                            <AlertTriangle className="shrink-0" size={24} />
                            <div>
                                <p className="font-bold">Procedure: ADJUST_SALARY</p>
                                <p className="text-sm mt-1">This will update salaries for all employees hired before the selected cutoff date. Please preview changes before committing.</p>
                            </div>
                        </div>

                        {!previewData ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Inflation Rate (%)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            min="0" 
                                            max="100" 
                                            value={inflationRate} 
                                            onChange={(e) => setInflationRate(Number(e.target.value))}
                                            className="w-full border p-3 rounded-xl bg-white pr-8" 
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Hired Before Date</label>
                                    <input 
                                        type="date" 
                                        value={cutOffDate} 
                                        onChange={(e) => setCutOffDate(e.target.value)}
                                        className="w-full border p-3 rounded-xl bg-white" 
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                                    <h4 className="font-bold text-slate-700">Preview Changes</h4>
                                    <span className="text-sm text-slate-500">{previewData.length} employees affected</span>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 sticky top-0">
                                            <tr>
                                                <th className="px-6 py-3">Employee</th>
                                                <th className="px-6 py-3">Hire Date</th>
                                                <th className="px-6 py-3">Old Salary</th>
                                                <th className="px-6 py-3 text-green-600">New Salary (+{inflationRate}%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map(emp => (
                                                <tr key={emp.id} className="border-b">
                                                    <td className="px-6 py-3 font-medium">{emp.name}</td>
                                                    <td className="px-6 py-3 text-slate-500">{new Date(emp.hireDate).toLocaleDateString()}</td>
                                                    <td className="px-6 py-3 text-slate-500">${emp.oldSalary.toLocaleString()}</td>
                                                    <td className="px-6 py-3 font-bold text-green-600">${emp.newSalary.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            {!previewData ? (
                                <>
                                    <button onClick={() => setIsSalaryModalOpen(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50">Cancel</button>
                                    <button 
                                        onClick={handlePreviewRaise} 
                                        disabled={salaryLoading}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2"
                                    >
                                        {salaryLoading ? 'Calculating...' : 'Preview Changes'} <ArrowRight size={18}/>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setPreviewData(null)} className="flex-1 py-3 border border-slate-200 rounded-xl font-medium hover:bg-slate-50">Back</button>
                                    <button 
                                        onClick={handleApplyRaise} 
                                        disabled={salaryLoading}
                                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
                                    >
                                        {salaryLoading ? 'Committing...' : 'Commit Changes to DB'} <CheckCircle2 size={18}/>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

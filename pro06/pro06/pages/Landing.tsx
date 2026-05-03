
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Map, Shield, Star } from 'lucide-react';

export const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center gap-2 text-blue-700">
                    <Map size={32} className="fill-blue-700 text-white" />
                    <span className="text-2xl font-serif font-bold tracking-tight text-slate-900">Odyssey</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/auth" className="text-slate-600 font-medium hover:text-blue-600">Sign In</Link>
                    <Link to="/auth" className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition-all shadow-lg shadow-slate-900/20">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold">
                        <Star size={16} fill="currentColor" />
                        #1 Travel Agency Platform 2025
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-serif font-bold text-slate-900 leading-tight">
                        Curating the <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Extraordinary.</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-lg">
                        Experience travel reimagined. From exclusive luxury resorts to hidden cultural gems, Odyssey connects you to the world's most breathtaking destinations.
                    </p>
                    <div className="flex gap-4">
                         <Link to="/auth" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2">
                            Start Your Journey <ArrowRight size={20} />
                        </Link>
                        <Link to="/packages" className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all flex items-center justify-center">
                            View Packages
                        </Link>
                    </div>
                    <div className="pt-8 flex gap-8 text-slate-400 text-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-green-500" />
                            <span>Verified Hotels</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-green-500" />
                            <span>24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle size={18} className="text-green-500" />
                            <span>Best Price Guarantee</span>
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/2 relative">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <img 
                            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" 
                            alt="Luxury Hotel" 
                            className="w-full h-64 object-cover rounded-3xl shadow-2xl -translate-y-8"
                        />
                        <img 
                            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" 
                            alt="Beach Resort" 
                            className="w-full h-64 object-cover rounded-3xl shadow-2xl translate-y-8"
                        />
                    </div>
                </div>
            </div>

            {/* Features Strip */}
            <div className="bg-slate-900 py-20 mt-12 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-serif font-bold mb-12">Why Choose Odyssey?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Secure Bookings</h3>
                            <p className="text-slate-400">State-of-the-art encryption ensures your data and payments are always safe.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                                <Star size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Luxury Standards</h3>
                            <p className="text-slate-400">Every hotel is handpicked and reviewed by our experts to ensure 5-star quality.</p>
                        </div>
                         <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                                <Map size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Global Reach</h3>
                            <p className="text-slate-400">Access to over 10,000 properties across 150+ countries worldwide.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Package, PackageDetails } from '../types';
import { Clock, ArrowRight, CheckCircle, Plane, MapPin, Calendar, Star, Hotel } from 'lucide-react';
import { SkeletonCard } from '../components/ui/Loading';
import { Modal } from '../components/ui/Modal';

export const PackagesPage: React.FC = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal State
    const [selectedPackageDetails, setSelectedPackageDetails] = useState<PackageDetails | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'hotel' | 'flight'>('overview');

    useEffect(() => {
        const loadPackages = async () => {
            setLoading(true);
            try {
                const data = await api.getPackages();
                setPackages(data);
            } catch (error) {
                console.error("Failed to fetch packages", error);
            } finally {
                setLoading(false);
            }
        };
        loadPackages();
    }, []);

    const handleViewDeal = async (pkg: Package) => {
        setIsModalOpen(true);
        setDetailsLoading(true);
        setRequestSent(false);
        setActiveTab('overview');
        try {
            const details = await api.getPackageDetails(pkg.package_id);
            setSelectedPackageDetails(details);
            console.log("data:",details);
        } catch (error) {
            console.error("Failed to fetch package details", error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleConfirmRequest = () => {
        // Simulate API Request
        setTimeout(() => {
            setRequestSent(true);
        }, 800);
    };

    // Helper for itinerary generation (Mock)
    const generateItinerary = (days: number) => {
        return Array.from({ length: days }).map((_, i) => ({
            day: i + 1,
            title: i === 0 ? "Arrival & Check-in" : i === days - 1 ? "Departure" : "Leisure & Exploration",
            desc: i === 0 
                ? "Private transfer from airport to hotel. Welcome drinks upon arrival." 
                : i === days - 1 
                ? "Breakfast at hotel. Transfer to airport for your flight home." 
                : "Enjoy the hotel amenities or explore the local culture with our curated guide."
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">Travel Packages</h1>
                    <p className="text-slate-500 mt-1">Curated experiences bundling flights, hotels, and activities.</p>
                </div>
            </div>

            {/* Package Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))
                ) : (
                    packages.map(pkg => (
                        <div key={pkg.package_id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                            <div className="h-56 relative overflow-hidden">
                                <img 
                                    src={pkg.photo_url} 
                                    alt={pkg.package_name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                    <Clock size={12} />
                                    {pkg.duration_days} Days
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{pkg.package_name}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-6">{pkg.description}</p>
                                
                                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs text-slate-400 uppercase font-semibold">Total Price</span>
                                        <p className="text-2xl font-bold text-slate-900">${pkg.price.toLocaleString()}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleViewDeal(pkg)}
                                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        View Deal <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detailed Package Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Package Details" maxWidth="max-w-4xl">
                {requestSent ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Inquiry Received</h3>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            An agent will contact you shortly regarding the <strong>{selectedPackageDetails?.package.package_name}</strong>.
                        </p>
                        <button onClick={() => setIsModalOpen(false)} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium">Close</button>
                    </div>
                ) : detailsLoading ? (
                    <div className="p-12 text-center text-slate-500">Loading package itinerary...</div>
                ) : selectedPackageDetails && (
                    <div className="space-y-6">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <img src={selectedPackageDetails.package.photo_url} alt="" className="w-full md:w-1/3 h-48 object-cover rounded-xl shadow-md" />
                            <div className="flex-1">
                                <h2 className="text-2xl font-serif font-bold text-slate-900">{selectedPackageDetails.package.package_name}</h2>
                                <p className="text-slate-500 mt-2 text-sm leading-relaxed">{selectedPackageDetails.package.description}</p>
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                                        <Clock size={14} /> {selectedPackageDetails.package.duration_days} Days
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">
                                        ${selectedPackageDetails.package.price.toLocaleString()} <span className="text-sm font-normal text-slate-500">/ person</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 border-b border-slate-100 pb-1">
                            <button 
                                onClick={() => setActiveTab('overview')}
                                className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Itinerary
                            </button>
                            <button 
                                onClick={() => setActiveTab('hotel')}
                                className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${activeTab === 'hotel' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Hotel
                            </button>
                            <button 
                                onClick={() => setActiveTab('flight')}
                                className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${activeTab === 'flight' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                Flights
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[250px]">
                            {/* ITINERARY TAB */}
                            {activeTab === 'overview' && (
                                <div className="space-y-4">
                                    {generateItinerary(selectedPackageDetails.package.duration_days).map((day) => (
                                        <div key={day.day} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                                                    Day {day.day}
                                                </div>
                                                <div className="w-0.5 h-full bg-slate-100 mt-2"></div>
                                            </div>
                                            <div className="pb-6">
                                                <h4 className="font-bold text-slate-900 text-sm">{day.title}</h4>
                                                <p className="text-slate-500 text-sm mt-1">{day.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* HOTEL TAB */}
                            {activeTab === 'hotel' && (
                                selectedPackageDetails.hotel ? (
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-6">
                                        <img src={selectedPackageDetails.hotel.photo_url} className="w-full md:w-48 h-32 object-cover rounded-xl" alt="Hotel" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-lg text-slate-900">{selectedPackageDetails.hotel.name}</h3>
                                                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">
                                                    <Star size={12} fill="currentColor"/> {selectedPackageDetails.hotel.rating}
                                                </div>
                                            </div>
                                            <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                                                <MapPin size={14} /> {selectedPackageDetails.hotel.location}
                                            </p>
                                            <p className="text-slate-600 text-sm mt-3 line-clamp-2">{selectedPackageDetails.hotel.description}</p>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {selectedPackageDetails.hotel.amenities.split(',').slice(0,3).map((am, i) => (
                                                    <span key={i} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">{am}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : <div className="text-center py-8 text-slate-500">Accommodation details pending assignment.</div>
                            )}

                            {/* FLIGHT TAB */}
                            {activeTab === 'flight' && (
                                selectedPackageDetails.flight ? (
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-700 shadow-sm">
                                                    <Plane size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{selectedPackageDetails.flight.airline}</h4>
                                                    <p className="text-xs text-slate-500">{selectedPackageDetails.flight.flight_number} • Included</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 text-center">
                                            <div>
                                                <div className="text-xl font-bold text-slate-900">{selectedPackageDetails.flight.departure_airport}</div>
                                                <div className="text-xs text-slate-500">Departure</div>
                                            </div>
                                            <div className="flex-1 flex flex-col items-center">
                                                <div className="w-full h-px bg-slate-300 relative max-w-[100px]">
                                                    <Plane size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 text-slate-400 bg-slate-50" />
                                                </div>
                                                <span className="text-xs text-slate-400 mt-1">Direct Flight</span>
                                            </div>
                                            <div>
                                                <div className="text-xl font-bold text-slate-900">{selectedPackageDetails.flight.arrival_airport}</div>
                                                <div className="text-xs text-slate-500">Arrival</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : <div className="text-center py-8 text-slate-500">Flight details pending assignment.</div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-slate-200 rounded-xl font-medium hover:bg-slate-50">Cancel</button>
                            <button onClick={handleConfirmRequest} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20">Request Booking</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

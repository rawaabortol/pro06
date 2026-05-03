
import React from 'react';
import { Flight } from '../types';
import { Plane, Clock, Luggage, Utensils, Wifi, ArrowRight, Circle, Info } from 'lucide-react';

interface FlightCardProps {
    flight: Flight;
    onBook: (flight: Flight) => void;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, onBook }) => {
    const departureDate = new Date(flight.departure_time);
    const arrivalDate = new Date(flight.arrival_time);
    
    // Simulate derived data (mock logic based on duration/airline since DB is limited)
    const durationHours = parseInt(flight.duration) || 0;
    const isDirect = durationHours < 10;
    const stopsLabel = isDirect ? 'Direct' : '1 Stop';
    const aircraftType = flight.airline.includes('Air France') ? 'Airbus A350-900' : 
                        flight.airline.includes('British') ? 'Boeing 777-300ER' : 'Boeing 787 Dreamliner';
    
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col">
            <div className="p-5 md:p-6 flex flex-col lg:flex-row gap-6">
                
                {/* 1. Airline Info & Logo */}
                <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:w-1/5">
                     <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-700 shrink-0 border border-slate-100 shadow-sm">
                        <Plane size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{flight.airline}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">{aircraftType}</p>
                        <div className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-600 mt-1">
                            <span>{flight.flight_number}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Flight Schedule & Path */}
                <div className="flex-1 flex flex-col justify-center py-2 lg:py-0">
                    <div className="flex items-center justify-between gap-4">
                        {/* Departure */}
                        <div className="text-left w-24">
                            <div className="text-2xl font-bold text-slate-900">
                                {departureDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <div className="text-sm font-bold text-slate-600">{flight.departure_airport}</div>
                        </div>

                        {/* Path Visual */}
                        <div className="flex-1 flex flex-col items-center px-4 max-w-xs mx-auto">
                            <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
                                <Clock size={12} /> {flight.duration}
                            </div>
                            
                            <div className="w-full relative flex items-center h-4">
                                {/* Line */}
                                <div className={`h-[2px] w-full relative ${isDirect ? 'bg-blue-200' : 'bg-slate-300'}`}>
                                    {/* Stop Dots if connecting */}
                                    {!isDirect && (
                                        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border-2 border-slate-400 z-10"></div>
                                    )}
                                </div>
                                
                                {/* Start Dot */}
                                <div className={`absolute left-0 w-2 h-2 rounded-full ${isDirect ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
                                
                                {/* End Dot */}
                                <div className={`absolute right-0 w-2 h-2 rounded-full ${isDirect ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
                                
                                {/* Plane Icon moving */}
                                <div className="absolute left-1/2 -translate-x-1/2 -top-3">
                                    <Plane size={16} className={`${isDirect ? 'text-blue-500' : 'text-slate-400'} rotate-90`} />
                                </div>
                            </div>

                            <div className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                                isDirect ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                                {stopsLabel}
                            </div>
                        </div>

                        {/* Arrival */}
                        <div className="text-right w-24">
                            <div className="text-2xl font-bold text-slate-900">
                                {arrivalDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                             <div className="text-sm font-bold text-slate-600">{flight.arrival_airport}</div>
                        </div>
                    </div>
                </div>

                {/* 3. Price & Action */}
                <div className="flex flex-row lg:flex-col justify-between lg:justify-center items-center lg:items-end gap-4 lg:w-1/5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                    <div className="text-left lg:text-right">
                        <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Economy</div>
                        <div className="text-2xl font-bold text-slate-900">${flight.price}</div>
                    </div>
                    <button 
                        onClick={() => onBook(flight)}
                        className="bg-slate-900 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:shadow-blue-600/20 whitespace-nowrap flex items-center gap-2 group-hover:scale-105"
                    >
                        Select <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* 4. Footer Details (Baggage, Amenities) */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5" title="Baggage Allowance">
                    <Luggage size={14} className="text-slate-400" />
                    <span>23kg Check-in + 7kg Cabin</span>
                </div>
                 <div className="flex items-center gap-1.5" title="Meal Service">
                    <Utensils size={14} className="text-slate-400" />
                    <span>Meal Included</span>
                </div>
                <div className="flex items-center gap-1.5" title="In-flight Wi-Fi">
                    <Wifi size={14} className="text-slate-400" />
                    <span>Wi-Fi Available</span>
                </div>
                 <div className="flex items-center gap-1.5 ml-auto" title="Operator">
                    <Info size={14} className="text-slate-400" />
                    <span className="text-slate-400">Operated by {flight.airline}</span>
                </div>
            </div>
        </div>
    );
};

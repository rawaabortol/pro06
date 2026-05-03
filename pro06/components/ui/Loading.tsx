
import React from 'react';

export const Spinner: React.FC<{ size?: number, className?: string }> = ({ size = 24, className = "text-blue-600" }) => (
    <svg 
        className={`animate-spin ${className}`} 
        width={size} 
        height={size} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
    >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const SkeletonCard: React.FC = () => (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm h-full flex flex-col animate-pulse">
        <div className="h-64 bg-slate-200 w-full"></div>
        <div className="p-6 flex-1 flex flex-col space-y-4">
            <div className="flex justify-between items-start">
                <div className="space-y-2 w-2/3">
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 w-12 bg-slate-200 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
            <div className="flex gap-2 mt-2">
                <div className="h-6 w-16 bg-slate-200 rounded"></div>
                <div className="h-6 w-16 bg-slate-200 rounded"></div>
                <div className="h-6 w-16 bg-slate-200 rounded"></div>
            </div>
            <div className="mt-auto pt-4 flex justify-between items-center">
                <div className="h-8 w-24 bg-slate-200 rounded"></div>
                <div className="flex gap-2">
                    <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
                    <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
                </div>
            </div>
        </div>
    </div>
);

export const SkeletonStat: React.FC = () => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
        <div className="flex justify-between items-start mb-4">
            <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
            <div className="h-5 w-12 bg-slate-200 rounded-full"></div>
        </div>
        <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
        <div className="h-8 w-32 bg-slate-200 rounded"></div>
    </div>
);

export const SkeletonRow: React.FC = () => (
    <div className="flex items-center space-x-4 py-4 border-b border-slate-50 animate-pulse">
        <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
        </div>
        <div className="h-6 w-16 bg-slate-200 rounded"></div>
    </div>
);

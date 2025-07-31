
import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from './icons.tsx';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon }) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
                <div className="text-gray-400">{icon}</div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <div className={`flex items-center text-xs font-semibold ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                    {changeType === 'increase' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                    <span>{change}</span>
                </div>
            </div>
        </div>
    );
};

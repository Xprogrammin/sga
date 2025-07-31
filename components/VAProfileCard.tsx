
import React from 'react';
import type { DetailedVirtualAssistant, VAType } from '../types.ts';
import { StarIcon } from './icons.tsx';

interface VAProfileCardProps {
    va: DetailedVirtualAssistant;
    index: number;
    openHireModal: (va: DetailedVirtualAssistant) => void;
    navigate: (page: string, context?: any) => void;
}

export const VAProfileCard: React.FC<VAProfileCardProps> = ({ va, index, openHireModal, navigate }) => {
    
    const typeColors: Record<VAType, string> = {
        General: 'bg-gray-100 text-gray-800',
        Tech: 'bg-blue-100 text-blue-800',
        Edu: 'bg-indigo-100 text-indigo-800',
        Health: 'bg-green-100 text-green-800',
        Security: 'bg-red-100 text-red-800',
        Student: 'bg-yellow-100 text-yellow-800'
    };

    return (
        <div 
            className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col text-center p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl opacity-0 animate-fade-in-up relative"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[va.type] || typeColors.General}`}>
                {va.type}
            </span>
            <img 
                src={va.imageUrl} 
                alt={va.name} 
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-md -mt-12" 
            />
            <div className="flex-grow pt-2">
                <h3 className="text-lg font-bold text-dark-text">{va.name}</h3>
                <div className="flex justify-center items-center mt-1">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    <span className="ml-1 text-sm font-bold text-gray-600">{va.stats.rating.toFixed(1)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 px-2 flex-grow min-h-[40px]">
                    "{va.tagline}"
                </p>
            </div>
            <div className="mt-4 space-y-2">
                <button
                    onClick={() => navigate('va-detail', { vaId: va.id, vaType: va.type })}
                    className="w-full bg-accent-light-blue text-primary-blue font-semibold py-2 px-4 rounded-lg hover:bg-primary-blue hover:text-white transition-colors duration-300 text-sm"
                >
                    View Profile
                </button>
                <button
                    onClick={() => openHireModal(va)}
                    className="w-full bg-primary-blue text-white font-semibold py-2 px-4 rounded-lg hover:opacity-80 transition-opacity duration-300 text-sm"
                >
                    Hire Now
                </button>
            </div>
        </div>
    );
};
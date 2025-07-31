
import React from 'react';
import { detailedVAs } from '../constants.tsx';
import type { VAType, DetailedVirtualAssistant } from '../types.ts';
import { VAProfileCard } from './VAProfileCard.tsx';
import { ArrowLeftIcon } from './icons.tsx';

interface VAListingPageProps {
    vaType: VAType;
    openHireModal: (va: DetailedVirtualAssistant) => void;
    navigate: (page: string, context?: any) => void;
}

export const VAListingPage: React.FC<VAListingPageProps> = ({ vaType, openHireModal, navigate }) => {
    
    const categoryTitle = `Featured ${vaType} VAs`;
    const filteredVAs = detailedVAs.filter(va => va.type === vaType).slice(0, 5);

    return (
        <div className="pt-20 bg-light-gray min-h-screen">
            <div className="container mx-auto px-6 py-12">
                
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate('va-category', { vaType })}
                        className="flex items-center gap-2 text-primary-blue font-semibold hover:underline"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>Back to {vaType} Services</span>
                    </button>
                </div>

                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 leading-tight">
                        <span className="inline-block text-primary-blue opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>{categoryTitle}</span>
                    </h1>
                    <p className="mt-4 text-lg lg:text-xl text-gray-600 opacity-0 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                        Meet our top-rated specialists. View their profiles or hire them directly to get started.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {filteredVAs.map((va, index) => (
                        <VAProfileCard 
                            key={va.id} 
                            va={va} 
                            index={index}
                            openHireModal={openHireModal}
                            navigate={navigate}
                        />
                    ))}
                </div>

                {filteredVAs.length === 0 && (
                     <div className="mt-16 text-center text-gray-600 bg-white p-8 rounded-2xl shadow-md">
                        <p>No featured Virtual Assistants available for this category at the moment. Please check back soon!</p>
                     </div>
                )}
            </div>
        </div>
    );
};

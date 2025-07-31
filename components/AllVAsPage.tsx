
import React from 'react';
import { detailedVAs } from '../constants.tsx';
import type { DetailedVirtualAssistant } from '../types.ts';
import { VAProfileCard } from './VAProfileCard.tsx';

interface AllVAsPageProps {
    openHireModal: (va: DetailedVirtualAssistant) => void;
    navigate: (page: string, context?: any) => void;
}

export const AllVAsPage: React.FC<AllVAsPageProps> = ({ openHireModal, navigate }) => {
    
    return (
        <div className="pt-20 bg-light-gray min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 leading-tight">
                        <span className="inline-block text-primary-blue opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            Meet Our Virtual Assistants
                        </span>
                    </h1>
                    <p className="mt-4 text-lg lg:text-xl text-gray-600 opacity-0 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                        Browse our entire roster of vetted professionals across all specializations.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                    {detailedVAs.map((va, index) => (
                        <VAProfileCard 
                            key={va.id} 
                            va={va} 
                            index={index}
                            openHireModal={openHireModal}
                            navigate={navigate}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

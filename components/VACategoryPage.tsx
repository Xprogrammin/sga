
import React from 'react';
import { servicesPageItems } from '../constants.tsx';
import type { VAType, Service } from '../types.ts';
import { ArrowLeftIcon, ArrowRightIcon } from './icons.tsx';

interface VACategoryPageProps {
    vaType: VAType;
    navigate: (page: string, context?: any) => void;
}

const CategoryServiceCard: React.FC<{ service: Service, index: number }> = ({ service, index }) => (
    <div 
        className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-start text-left opacity-0 animate-fade-in-up"
        style={{ animationDelay: `${index * 100}ms` }}
    >
        <div className="w-12 h-12 mb-4 text-primary-blue">
            {service.icon}
        </div>
        <h3 className="text-xl font-bold text-dark-text">{service.title}</h3>
        <p className="mt-2 text-gray-600 flex-grow">{service.description}</p>
    </div>
);

export const VACategoryPage: React.FC<VACategoryPageProps> = ({ vaType, navigate }) => {
    
    const categoryTitle = `${vaType} Virtual Assistants`;
    const filteredServices = servicesPageItems.filter(s => s.vaType === vaType);

    return (
        <div className="pt-20 bg-light-gray min-h-screen">
            <div className="container mx-auto px-6 py-12">
                
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate('services')}
                        className="flex items-center gap-2 text-primary-blue font-semibold hover:underline"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>Back to All Services</span>
                    </button>
                </div>

                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 leading-tight">
                        <span className="inline-block text-primary-blue opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>{categoryTitle}</span>
                    </h1>
                    <p className="mt-4 text-lg lg:text-xl text-gray-600 opacity-0 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
                        Explore the specialized services our {vaType} VAs offer to meet your unique business needs.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredServices.map((service, index) => (
                        <CategoryServiceCard key={service.title} service={service} index={index} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button
                        onClick={() => navigate('va-listing', { vaType })}
                        className="bg-primary-blue text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:opacity-90 transition-all transform hover:scale-105 inline-flex items-center gap-2"
                    >
                        <span>View Our {vaType} VAs</span>
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

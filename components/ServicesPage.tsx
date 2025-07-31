
import React, { useState } from 'react';
import { servicesPageItems } from '../constants.tsx';
import type { Service, VAType } from '../types.ts';

interface ServicesPageProps {
    navigate: (page: string, context?: any) => void;
}

const ServiceCard: React.FC<{ service: Service, index: number, navigate: (page: string, context: any) => void }> = ({ service, index, navigate }) => (
    <div
        className="relative group bg-light-gray rounded-2xl p-6 text-center flex flex-col items-center opacity-0 animate-fade-in-up overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
        style={{ animationDelay: `${index * 100}ms` }}
    >
        <div className="absolute top-0 right-0 h-24 w-1 bg-primary-blue/20 transform-gpu translate-x-1/2 -translate-y-1/4 rotate-45 transition-all duration-300 group-hover:h-32 group-hover:bg-primary-blue/40"></div>
        <div className="absolute top-0 right-0 h-20 w-1 bg-primary-blue/30 transform-gpu translate-x-4 -translate-y-1/4 rotate-45 transition-all duration-300 group-hover:h-28 group-hover:bg-primary-blue/50"></div>
        
        <div className="relative z-10 flex flex-col items-center h-full w-full">
            <div className="w-12 h-12 mb-4 text-primary-blue transition-transform duration-300 group-hover:scale-110">
                {service.icon}
            </div>
            <h3 className="text-xl font-bold text-dark-text">{service.title}</h3>
            <p className="mt-2 text-gray-600 flex-grow">{service.description}</p>
            <button 
                onClick={() => navigate('va-listing', { vaType: service.vaType })}
                className="mt-6 bg-white border border-primary-blue text-primary-blue font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-primary-blue hover:text-white transition-all duration-300 w-full"
            >
                View VAs
            </button>
        </div>
    </div>
);


export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
    const tabs: {name: string, type: VAType}[] = [
        { name: 'General VAs', type: 'General' },
        { name: 'Tech VAs', type: 'Tech' },
        { name: 'Edu VAs', type: 'Edu' },
        { name: 'Health VAs', type: 'Health' },
        { name: 'Security VAs', type: 'Security' },
        { name: 'Student VAs', type: 'Student' }
    ];
    const [activeTab, setActiveTab] = useState<VAType>('General');

    const filteredServices = servicesPageItems.filter(s => s.vaType === activeTab);

    return (
        <div className="pt-20 bg-white">
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-poppins font-bold text-gray-900 leading-tight">
                            <span className="inline-block opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>Explore Our </span>
                            <span className="inline-block text-primary-blue opacity-0 animate-fade-in-up" style={{ animationDelay: '250ms' }}>Virtual Assistant Services</span>
                        </h1>
                        <p className="mt-4 text-lg lg:text-xl text-gray-600 opacity-0 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                            Find the perfect virtual assistant tailored to your business needs, from administrative support to specialized technical assistance.
                        </p>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center items-center gap-2 sm:gap-4 border-b border-gray-200 pb-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.type}
                                onClick={() => setActiveTab(tab.type)}
                                className={`px-5 py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${activeTab === tab.type ? 'bg-primary-blue text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    <div className="text-center mt-6">
                        <button
                            onClick={() => navigate('all-vas')}
                            className="text-primary-blue font-semibold hover:underline"
                        >
                            Not sure where to start? Browse all our Virtual Assistants &rarr;
                        </button>
                    </div>

                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredServices.map((service, index) => (
                            <ServiceCard key={service.title} service={service} index={index} navigate={navigate} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-6">
                    <div className="bg-light-lavender rounded-2xl p-8 sm:p-12 lg:p-16 text-center flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl font-poppins font-bold text-primary-blue">
                            Can't Find What You're Looking For?
                        </h2>
                        <p className="mt-4 text-lg text-gray-700 max-w-2xl">
                            Our team can help you find a custom solution. Reach out to discuss your unique needs.
                        </p>
                        <button
                            onClick={() => navigate('contact')}
                            className="mt-8 bg-primary-blue text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:opacity-90 transition-opacity"
                        >
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
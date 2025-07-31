import React from 'react';

interface CallToActionProps {
    navigate: (page: string, context?: any) => void;
}

export const CallToAction: React.FC<CallToActionProps> = ({ navigate }) => {
    return (
        <div className="bg-primary-blue rounded-2xl mt-16">
            <div className="container mx-auto px-6 py-12 text-center">
                <h2 className="text-3xl font-poppins font-bold text-white">Ready to Boost Your Productivity?</h2>
                <p className="mt-4 text-lg text-accent-light-blue/90 max-w-2xl mx-auto">
                    Let a skilled Virtual Assistant handle your tasks so you can focus on what truly matters. Explore our services and find your perfect match today.
                </p>
                <div className="mt-8">
                    <button
                        onClick={() => navigate('services')}
                        className="bg-white text-primary-blue font-semibold py-3 px-8 rounded-xl shadow-md hover:bg-accent-light-blue transition-colors duration-300"
                    >
                        Explore Services
                    </button>
                </div>
            </div>
        </div>
    );
};
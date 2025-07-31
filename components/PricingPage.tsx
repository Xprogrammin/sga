
import React, { useState } from 'react';
import { monthlyPricingPlans, oneTimePricingPlans } from '../constants.tsx';
import type { PricingPlan } from '../types.ts';
import { PricingCheckIcon, SparklesIcon, XIcon, BriefcaseIcon } from './icons.tsx';

interface PricingPageProps {
    navigate: (page: string, context?: any) => void;
    openAuthModal: (mode: 'login' | 'signup') => void;
}

const PricingCard: React.FC<{ plan: PricingPlan }> = ({ plan }) => (
    <div 
      id={plan.name.toLowerCase().replace(/\s+/g, '-')}
      className={`rounded-2xl p-6 flex flex-col transition-all duration-300 ease-in-out transform hover:-translate-y-2
        ${plan.isFeatured 
          ? 'bg-primary-blue shadow-2xl relative z-10' 
          : 'bg-light-gray border border-transparent hover:border-primary-blue/30 hover:bg-white shadow-md'
        }`}
    >
        {plan.isFeatured && (
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-primary-blue text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Most Popular
            </div>
        )}
        <h3 className={`text-xl font-bold text-center pt-2 ${plan.isFeatured ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
        <div className="mt-4 text-center">
            <span className={`text-4xl font-bold ${plan.price === 'Custom' ? (plan.isFeatured ? 'text-white' : 'text-primary-blue') : (plan.isFeatured ? 'text-white' : 'text-gray-900')}`}>{plan.price === 'Custom' ? 'Custom' : `$${plan.price}`}</span>
            {plan.priceSuffix && <span className={`ml-1 font-medium ${plan.isFeatured ? 'text-accent-light-blue' : 'text-gray-500'}`}>{plan.priceSuffix}</span>}
        </div>
        <p className={`mt-4 flex-grow text-sm min-h-[4rem] text-center ${plan.isFeatured ? 'text-accent-light-blue' : 'text-gray-600'}`}>{plan.description}</p>
        <ul className="my-6 space-y-3">
            {plan.features.map(feature => (
                <li key={feature} className="flex items-start gap-3">
                    <PricingCheckIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.isFeatured ? 'text-white' : 'text-primary-blue'}`} />
                    <span className={`text-sm ${plan.isFeatured ? 'text-accent-light-blue' : 'text-gray-700'}`}>{feature}</span>
                </li>
            ))}
        </ul>
        <div className={`mt-auto pt-6 ${plan.isFeatured ? 'border-t border-blue-400' : 'border-t border-gray-200'}`}>
            <a 
                href={plan.stripeUrl || '#'} 
                target={plan.stripeUrl ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${plan.isFeatured ? 'text-primary-blue bg-white hover:bg-accent-light-blue' : 'text-primary-blue bg-white border border-primary-blue hover:bg-primary-blue hover:text-white'}`}>
                {plan.buttonText}
            </a>
        </div>
    </div>
);

const StudentBanner: React.FC<{onClose: () => void}> = ({ onClose }) => (
    <div className="bg-primary-blue text-white rounded-2xl p-6 relative shadow-lg flex flex-col items-center text-center">
        <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors">
            <XIcon className="w-5 h-5" />
        </button>
        <div className="bg-white/20 p-3 rounded-full mt-4">
            <SparklesIcon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mt-4">Student Special!</h3>
        <p className="mt-2 text-2xl font-bold">$150<span className="text-base font-medium opacity-80">/month</span></p>
        <p className="mt-2 text-sm opacity-90">
            Perfect for academic research, scheduling, and proofreading.
        </p>
        <a 
            href="https://buy.stripe.com/8x25kC9nT6MU1wl2x0djO0d"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 bg-white text-primary-blue font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-accent-light-blue transition-colors w-full">
            Pay Now
        </a>
    </div>
);

const CustomPlanBanner: React.FC<{onClose: () => void, navigate: (page: string) => void}> = ({ onClose, navigate }) => (
    <div className="bg-gray-800 text-white rounded-2xl p-6 relative shadow-lg flex flex-col items-center text-center">
        <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors">
            <XIcon className="w-5 h-5" />
        </button>
        <div className="bg-white/20 p-3 rounded-full mt-4">
            <BriefcaseIcon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mt-4">Custom Project</h3>
        <p className="mt-2 text-2xl font-bold">Need a custom quote?</p>
        <p className="mt-2 text-sm opacity-90">
            Perfect for one-time tasks, specific projects, or unique requirements.
        </p>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('open-quote-chat'); }} className="mt-4 bg-white text-gray-800 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-200 transition-colors w-full">
            Get a Quote
        </a>
    </div>
);


export const PricingPage: React.FC<PricingPageProps> = ({ navigate, openAuthModal }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'one-time'>('monthly');
    const [isStudentBannerVisible, setIsStudentBannerVisible] = useState(true);
    const [isCustomBannerVisible, setIsCustomBannerVisible] = useState(true);

    const plans = billingCycle === 'monthly' ? monthlyPricingPlans : oneTimePricingPlans;

    return (
        <div className="pt-20 bg-white">
            <section className="py-16 text-center">
                <div className="container mx-auto px-6">
                    <h1 className="text-3xl md:text-5xl font-poppins font-bold text-gray-900 leading-tight">
                        <span className="text-primary-blue">Flexible Pricing</span> for Every Need
                    </h1>
                    <p className="mt-4 text-md lg:text-lg text-gray-600 max-w-3xl mx-auto">
                        Choose a plan that fits your needs, whether you're a startup or a large enterprise. No hidden fees, just transparent pricing.
                    </p>

                    <div className="mt-8 inline-flex bg-gray-100 p-1 rounded-full space-x-1">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-white text-primary-blue shadow' : 'text-gray-600'}`}
                            aria-pressed={billingCycle === 'monthly'}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('one-time')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${billingCycle === 'one-time' ? 'bg-white text-primary-blue shadow' : 'text-gray-600'}`}
                             aria-pressed={billingCycle === 'one-time'}
                        >
                            One Time
                        </button>
                    </div>
                </div>
            </section>

            <section className="pb-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {plans.map((plan) => (
                            <PricingCard key={plan.name} plan={plan}/>
                        ))}
                    </div>
                </div>
            </section>

            {(isStudentBannerVisible || isCustomBannerVisible) && (
                <section className="pb-16">
                    <div className="container mx-auto px-6">
                         <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center text-gray-900 mb-8">
                            Special Offers &amp; Custom Projects
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {isStudentBannerVisible && <StudentBanner onClose={() => setIsStudentBannerVisible(false)} />}
                            {isCustomBannerVisible && <CustomPlanBanner onClose={() => setIsCustomBannerVisible(false)} navigate={navigate} />}
                        </div>
                    </div>
                </section>
            )}
            
            <section className="bg-primary-blue">
                <div className="container mx-auto px-6 py-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-white">
                        Not Sure Which Plan is Right for You?
                    </h2>
                    <p className="mt-4 text-lg text-blue-100 max-w-3xl mx-auto">
                        Try Catazet with a 7-day free trial and experience the benefits of a virtual assistant firsthand. No credit card required.
                    </p>
                    <div className="mt-8">
                        <button
                            onClick={() => openAuthModal('signup')}
                            className="inline-block bg-white text-primary-blue font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100"
                        >
                            Start Your Free Trial
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

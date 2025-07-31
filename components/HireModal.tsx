

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal.tsx';
import { monthlyPricingPlans, sampleTaskPlan } from '../constants.tsx';
import type { DetailedVirtualAssistant, PricingPlan } from '../types.ts';
import { LoadingSpinnerIcon, PricingCheckIcon, ChatBubbleIcon, BriefcaseIcon } from './icons.tsx';

interface HireModalProps {
    isOpen: boolean;
    onClose: () => void;
    va?: DetailedVirtualAssistant;
    isClientLoggedIn?: boolean;
    onHireSuccess: (va: DetailedVirtualAssistant, plan: PricingPlan) => void;
    onContactAgent?: () => void;
}

const PlanCard: React.FC<{
    plan: PricingPlan;
    icon: React.ReactNode;
    onSelect: () => void;
    isSubmitting?: boolean;
}> = ({ plan, icon, onSelect, isSubmitting }) => (
    <div className="bg-light-gray p-4 rounded-xl border border-gray-200 text-left">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent-light-blue text-primary-blue rounded-lg flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-gray-800">{plan.name}</h4>
                <p className="text-sm text-gray-500">{plan.description}</p>
            </div>
        </div>

        <div className="border-t my-3"></div>

        <div className="flex justify-between items-center">
             <p className="text-sm text-gray-600">
                <span className="text-2xl font-bold text-dark-text">${plan.price}</span>
                {plan.priceSuffix && <span className="text-gray-500"> {plan.priceSuffix}</span>}
             </p>
            <button
                onClick={onSelect}
                disabled={isSubmitting}
                className="bg-primary-blue text-white font-semibold py-2 px-5 rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center text-sm"
            >
                {isSubmitting ? (
                    <>
                        <LoadingSpinnerIcon className="w-4 h-4 mr-2" />
                        Processing...
                    </>
                ) : plan.buttonText }
            </button>
        </div>
    </div>
);

export const HireModal: React.FC<HireModalProps> = ({ isOpen, onClose, va, isClientLoggedIn, onHireSuccess, onContactAgent }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'initial' | 'confirming'>('initial');
    const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setIsSubmitted(false);
                setPaymentStep('initial');
                setSelectedPlan(null);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!va) return null;

    const monthlyPlan: PricingPlan | undefined = monthlyPricingPlans.find(p => p.name.startsWith(va.type));
    
    const handleSubmit = (planToSubmit: PricingPlan) => {
        if (!va) return;
        
        setSelectedPlan(planToSubmit);
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            onHireSuccess(va, planToSubmit);
            setTimeout(() => {
                onClose();
            }, 3000);
        }, 1500);
    };

    const handleProceedToPayment = (planToSubmit: PricingPlan) => {
        if (planToSubmit.stripeUrl) {
            setSelectedPlan(planToSubmit);
            window.open(planToSubmit.stripeUrl, '_blank', 'noopener,noreferrer');
            setPaymentStep('confirming');
        }
    };

    const renderContent = () => {
        if (isSubmitted) {
            return (
                <div className="text-center py-8 animate-fade-in-up">
                    <div className="mx-auto w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center">
                        <PricingCheckIcon className="w-10 h-10 text-primary-blue" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary-blue mt-4">
                        {isClientLoggedIn ? 'Congratulations!' : 'Request Sent!'}
                    </h3>
                    <p className="mt-2 text-gray-600">
                        {isClientLoggedIn
                            ? `You have successfully purchased the "${selectedPlan?.name}" for ${va.name}! The project has been added to your dashboard.`
                            : `Thank you for your interest. Our team will contact you shortly to finalize the details.`}
                    </p>
                </div>
            );
        }

        if (!monthlyPlan) {
            return (
                 <div className="text-center py-8">
                    <h3 className="text-xl font-bold text-gray-800">Plan Information Unavailable</h3>
                    <p className="mt-4 text-gray-600">
                        We're sorry, but pricing information for this VA type could not be found. Please contact support for assistance.
                    </p>
                 </div>
            );
        }

        return (
            <div className="animate-fade-in-up">
                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">You're hiring <span className="text-primary-blue">{va.name}</span></h3>
                    <p className="text-gray-500 text-sm">Choose a plan below to get started.</p>
                </div>
                
                <div className="space-y-4">
                    {/* Monthly Plan */}
                     <PlanCard
                        plan={monthlyPlan}
                        icon={<BriefcaseIcon className="w-6 h-6" />}
                        onSelect={() => isClientLoggedIn ? handleSubmit(monthlyPlan) : handleProceedToPayment(monthlyPlan)}
                        isSubmitting={isSubmitting && selectedPlan?.name === monthlyPlan.name}
                    />

                    <div className="text-center text-sm font-semibold text-gray-400">OR</div>

                    {/* Sample Task Plan */}
                    <PlanCard
                        plan={sampleTaskPlan}
                        icon={<PricingCheckIcon className="w-6 h-6" />}
                        onSelect={() => isClientLoggedIn ? handleSubmit(sampleTaskPlan) : handleProceedToPayment(sampleTaskPlan)}
                        isSubmitting={isSubmitting && selectedPlan?.name === sampleTaskPlan.name}
                    />
                </div>

                {!isClientLoggedIn && paymentStep === 'confirming' && (
                    <div className="text-center py-4 mt-4 animate-fade-in-up">
                        <div className="mx-auto w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center">
                            <ChatBubbleIcon className="w-10 h-10 text-primary-blue" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mt-4">Did you complete your payment?</h3>
                        <p className="mt-2 text-gray-600">If you encountered any issues or have questions, please reach out to our support team.</p>
                        <button 
                            onClick={onContactAgent}
                            className="mt-6 w-full bg-white border border-primary-blue text-primary-blue font-semibold py-3 rounded-lg shadow-sm hover:bg-accent-light-blue transition-colors flex items-center justify-center gap-2"
                        >
                            <ChatBubbleIcon className="w-5 h-5"/>
                            Contact Live Agent
                        </button>
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isSubmitted ? "Success!" : `Hire ${va.name}`}
        >
            {renderContent()}
        </Modal>
    );
};
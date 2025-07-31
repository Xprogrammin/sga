import React, { useState, useEffect, useRef, useCallback, FormEvent } from 'react';
import { XIcon, SparklesIcon, ArrowLeftIcon } from './icons.tsx';
import { monthlyPricingPlans } from '../constants.tsx';

const useSpecialOfferTimer = ({ showDuration, hideDuration, maxViews = 3 }: { showDuration: number; hideDuration: number; maxViews?: number }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const showTimerRef = useRef<number | null>(null);
    const hideTimerRef = useRef<number | null>(null);

    const getSessionValue = useCallback((key: string, defaultValue: any) => {
        try {
            const value = sessionStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch {
            return defaultValue;
        }
    }, []);

    const setSessionValue = useCallback((key: string, value: any) => {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Could not save to session storage: ${error}`);
        }
    }, []);
    
    const [isClosedByUser, setIsClosedByUser] = useState(() => getSessionValue('so_closed', false));
    const [viewCount, setViewCount] = useState(() => getSessionValue('so_views', 0));

    const clearAllTimers = useCallback(() => {
        if (showTimerRef.current) clearTimeout(showTimerRef.current);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        showTimerRef.current = null;
        hideTimerRef.current = null;
    }, []);

    const closePermanently = useCallback(() => {
        setIsPopupVisible(false);
        setIsClosedByUser(true);
        setSessionValue('so_closed', true);
        clearAllTimers();
    }, [setSessionValue, clearAllTimers]);

    const registerInteraction = useCallback(() => {
        if (!hasInteracted) {
            setHasInteracted(true);
            clearAllTimers();
        }
    }, [hasInteracted, clearAllTimers]);

    useEffect(() => {
        if (isClosedByUser || hasInteracted) {
            return; // Don't start any new timers
        }

        if (isPopupVisible) {
            hideTimerRef.current = setTimeout(() => {
                setIsPopupVisible(false);
            }, showDuration) as unknown as number;
        } else { // is hidden
            if (viewCount < maxViews) {
                const delay = viewCount === 0 ? 2000 : hideDuration; // Initial 2s delay
                showTimerRef.current = setTimeout(() => {
                    const newCount = viewCount + 1;
                    setViewCount(newCount);
                    setSessionValue('so_views', newCount);
                    setIsPopupVisible(true);
                }, delay) as unknown as number;
            }
        }
        
        return clearAllTimers; // Cleanup on unmount or before next effect run
    }, [isPopupVisible, isClosedByUser, hasInteracted, viewCount, showDuration, hideDuration, maxViews, setSessionValue]);

    return { isPopupVisible, closePermanently, registerInteraction };
};

type View = 'main' | 'student' | 'projectForm';

const viewTitles: Record<View, string> = {
    main: 'Special Pricing Plans',
    student: 'Student Plan Details',
    projectForm: 'One-Time Project',
};

const Header: React.FC<{ view: View; onBack?: () => void; onClose: () => void }> = ({ view, onBack, onClose }) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="w-8">
            {view !== 'main' && (
                <button onClick={onBack} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Go back">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
            )}
        </div>
        <h3 className="text-md font-semibold text-gray-800 text-center">{viewTitles[view]}</h3>
        <div className="w-8">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close offer">
                <XIcon />
            </button>
        </div>
    </div>
);

const MainView: React.FC<{onSelectStudent: () => void; onSelectProject: () => void}> = ({ onSelectStudent, onSelectProject }) => {
    const studentPlan = monthlyPricingPlans.find(plan => plan.name === 'Student VAs');

    return (
        <div className="space-y-4">
            <div className="text-center">
                <div className="bg-light-lavender p-2 rounded-full inline-block">
                    <SparklesIcon className="w-6 h-6 text-primary-blue" />
                </div>
                <p className="mt-2 text-gray-600 text-sm">Exclusive offers to get you started with a skilled Virtual Assistant.</p>
            </div>
            
            <div className="p-4 rounded-xl bg-light-gray border border-gray-200">
                <div className="flex justify-between items-center gap-4">
                    <div className="flex-1">
                        <p className="font-semibold text-dark-text">Student Plan</p>
                        {studentPlan ? (
                            <p className="text-sm text-gray-600"><span className="text-xl font-bold text-dark-text">${studentPlan.price}</span>{studentPlan.priceSuffix}</p>
                        ) : (
                            <p className="text-sm text-gray-600">Details unavailable</p>
                        )}
                    </div>
                    <button onClick={onSelectStudent} className="bg-white text-primary-blue font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-accent-light-blue transition-colors text-sm flex-shrink-0">
                        View Details
                    </button>
                </div>
            </div>

            <div className="p-4 rounded-xl bg-light-gray border border-gray-200">
                 <div className="flex justify-between items-center gap-4">
                    <div className="flex-1">
                        <p className="font-semibold text-dark-text">One-Time Project</p>
                        <p className="text-sm text-gray-600">Get a custom quote</p>
                    </div>
                    <button onClick={onSelectProject} className="bg-primary-blue text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:opacity-90 transition-colors text-sm flex-shrink-0">
                        Get Quote
                    </button>
                </div>
            </div>
        </div>
    );
};

const StudentPlanView: React.FC = () => {
    const studentPlan = monthlyPricingPlans.find(plan => plan.name === 'Student VAs');

    if (!studentPlan) {
        return (
            <div className="text-center p-4">
                <p className="text-gray-600">Student plan details are currently unavailable.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-4">
            <p className="text-gray-600">{studentPlan.description}</p>
            <ul className="space-y-2 text-sm text-gray-700 list-disc list-inside">
                {studentPlan.features.map(feature => (
                    <li key={feature}>{feature}</li>
                ))}
            </ul>
            <a 
                href={studentPlan.stripeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 w-full text-center py-2.5 rounded-lg font-semibold transition-colors text-white bg-primary-blue hover:opacity-90"
            >
                Pay ${studentPlan.price}
            </a>
        </div>
    );
};

type ProjectDetails = { name: string; email: string; description: string };

const ProjectFormView: React.FC<{
    onSubmit: (details: ProjectDetails) => void;
}> = ({ onSubmit }) => {
    const [formData, setFormData] = useState({ name: '', email: '', description: '' });
    const [wordCount, setWordCount] = useState(0);

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const words = e.target.value.split(/\s+/).filter(Boolean);
        if (words.length <= 50) {
            setFormData(prev => ({...prev, description: e.target.value}));
            setWordCount(words.length);
        }
    };
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
             <p className="text-gray-600 text-sm">Describe your project, and we'll connect you with an agent to get a quote.</p>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-blue/50 focus:border-primary-blue/50" onChange={e => setFormData(prev => ({...prev, name: e.target.value}))} value={formData.name} />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-blue/50 focus:border-primary-blue/50" onChange={e => setFormData(prev => ({...prev, email: e.target.value}))} value={formData.email}/>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Project Description</label>
                <textarea id="description" rows={4} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-blue/50 focus:border-primary-blue/50" onChange={handleDescriptionChange} value={formData.description}></textarea>
                <p className="text-right text-xs text-gray-500 mt-1">{wordCount}/50 words</p>
            </div>
            <button type="submit" className="w-full bg-primary-blue text-white font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center">
                Get Quote via Chat
            </button>
        </form>
    );
};

interface SpecialOfferProps {
    showDuration: number;
    hideDuration: number;
    onProjectSubmit: (details: ProjectDetails) => void;
}

export const SpecialOffer: React.FC<SpecialOfferProps> = ({ showDuration, hideDuration, onProjectSubmit }) => {
    const [currentView, setCurrentView] = useState<View>('main');
    const { isPopupVisible, closePermanently, registerInteraction } = useSpecialOfferTimer({ showDuration, hideDuration, maxViews: 3 });

    const handleClose = () => {
        closePermanently();
        setTimeout(() => {
            setCurrentView('main');
        }, 300);
    };

    const handleProjectFormSubmit = (details: ProjectDetails) => {
        onProjectSubmit(details);
        handleClose();
    };

    const handleBack = () => {
        setCurrentView('main');
    };

    const renderContent = () => {
        switch (currentView) {
            case 'student':
                return <StudentPlanView />;
            case 'projectForm':
                return <ProjectFormView onSubmit={handleProjectFormSubmit} />;
            case 'main':
            default:
                return <MainView onSelectStudent={() => setCurrentView('student')} onSelectProject={() => setCurrentView('projectForm')} />;
        }
    };
    
    if (!isPopupVisible) return null;

    return (
        <div 
            className="fixed bottom-5 left-5 z-[100] w-[calc(100vw-40px)] max-w-sm" 
            aria-modal="true" 
            role="dialog"
            onClick={registerInteraction}
        >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col opacity-0 animate-fade-in-up origin-bottom-left">
                <Header view={currentView} onClose={handleClose} onBack={handleBack} />
                <div className="p-4 flex-grow overflow-y-auto min-h-[200px]">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
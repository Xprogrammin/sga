

import React, { useState, useEffect } from 'react';
import { detailedVAs } from '../constants.tsx';
import type { DetailedVirtualAssistant } from '../types.ts';
import { StarIcon, ArrowLeftIcon, SparklesIcon, LoadingSpinnerIcon } from './icons.tsx';
import { GoogleGenAI } from '@google/genai';

// Initialize the GoogleGenAI client once
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


interface VADetailPageProps {
    vaId: string;
    openHireModal: (va: DetailedVirtualAssistant) => void;
    navigate: (page: string, context?: any) => void;
    searchQuery?: string;
}

const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="text-center">
        <p className="text-2xl font-bold text-primary-blue">{value}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
    </div>
);

const AISummary: React.FC<{ va: DetailedVirtualAssistant; searchQuery: string }> = ({ va, searchQuery }) => {
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            const prompt = `Given a user's project requirement and a Virtual Assistant's (VA) profile, generate a single, concise sentence (under 25 words) explaining why this VA is a strong match. Start the sentence with an emoji.

            User Requirement: "${searchQuery}"
            
            VA Profile:
            - Name: ${va.name}
            - Type: ${va.type}
            - Tagline: ${va.tagline}
            - Skills: ${va.skills.join(', ')}
            - Bio: ${va.bio}

            Example Output: ✅ With extensive experience in ${va.skills[0]} and ${va.skills[1]}, ${va.name.split(' ')[0]} is perfectly suited for your project.
            
            Generate the matching summary:`;

            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt
                });
                setSummary(response.text);
            } catch (error) {
                console.error("Error fetching AI summary:", error);
                setSummary("Could not generate a summary at this time.");
            } finally {
                setIsLoading(false);
            }
        };

        if (searchQuery && va) {
            fetchSummary();
        }
    }, [va, searchQuery]);

    if (!searchQuery) {
        return null;
    }

    return (
        <div className="bg-light-lavender p-4 rounded-xl mb-6 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-5 h-5 text-primary-blue" />
                <h4 className="font-bold text-primary-blue">Why They're A Good Match</h4>
            </div>
            {isLoading ? (
                <div className="flex items-center gap-2 text-gray-600">
                    <LoadingSpinnerIcon className="w-4 h-4" />
                    <span className="text-sm italic">Generating personalized summary...</span>
                </div>
            ) : (
                <p className="text-sm text-gray-800 italic">{summary}</p>
            )}
        </div>
    );
};


export const VADetailPage: React.FC<VADetailPageProps> = ({ vaId, openHireModal, navigate, searchQuery }) => {
    const [activeTab, setActiveTab] = useState<'about' | 'skills'>('about');
    const va = detailedVAs.find(v => v.id === vaId);

    useEffect(() => {
        // Fallback for animations on page load
        const elements = document.querySelectorAll('.animate-on-load');
        elements.forEach((el, index) => {
            (el as HTMLElement).style.animationDelay = `${100 + index * 100}ms`;
            el.classList.add('animate-fade-in-up');
        });
    }, [vaId]);

    if (!va) {
        return (
            <div className="pt-20 bg-[#F0F4F8] min-h-screen flex items-center justify-center text-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Virtual Assistant not found.</h2>
                    <button onClick={() => navigate('services')} className="mt-4 bg-primary-blue text-white font-semibold py-2 px-6 rounded-lg">
                        Back to Services
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="pt-20 bg-[#F0F4F8] text-dark-text">
            <div className="container mx-auto px-4 py-8">
                {/* Header and Back Navigation */}
                <div className="flex items-center justify-between mb-6 animate-on-load opacity-0">
                    <button 
                        onClick={() => navigate('va-listing', { vaType: va.type })}
                        className="flex items-center gap-2 text-primary-blue font-semibold hover:underline"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>Back to Listing</span>
                    </button>
                    <div className="hidden md:block">
                        <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                           {va.type} Virtual Assistant Profile
                        </span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Panel (Desktop) / Top Section (Mobile) */}
                    <div className="lg:col-span-5 mb-8 lg:mb-0">
                        <div className="bg-white p-6 rounded-2xl shadow-lg animate-on-load opacity-0">
                            <div className="flex flex-col items-center text-center">
                                <img 
                                    src={va.imageUrl} 
                                    alt={va.name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl" 
                                />
                                <h1 className="text-3xl font-poppins font-bold text-primary-blue mt-4">{va.name}</h1>
                                <p className="text-gray-500 font-medium -mt-1">{va.tagline}</p>

                                <div className="my-4 w-full border-t border-gray-200"></div>

                                <div className="grid grid-cols-3 gap-4 w-full">
                                    <StatItem label="Rating" value={va.stats.rating.toFixed(1)} />
                                    <StatItem label="Projects" value={va.stats.projectsCompleted} />
                                    <StatItem label="Response" value={va.stats.responseRate} />
                                </div>

                                <div className="mt-6 w-full">
                                    <button 
                                        onClick={() => openHireModal(va)}
                                        className="w-full bg-primary-blue text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition-all transform hover:scale-105"
                                    >
                                        Hire {va.name.split(' ')[0]} Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel (Desktop) / Tabbed Content (Mobile) */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl shadow-lg p-6 animate-on-load opacity-0">
                             {/* AI Summary */}
                            {searchQuery && <AISummary va={va} searchQuery={searchQuery} />}
                            
                             {/* Mobile Tabs */}
                            <div className="lg:hidden mb-4 border-b border-gray-200">
                                <nav className="flex -mb-px">
                                    <button onClick={() => setActiveTab('about')} className={`flex-1 py-3 text-center font-semibold border-b-2 ${activeTab === 'about' ? 'text-primary-blue border-primary-blue' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>About</button>
                                    <button onClick={() => setActiveTab('skills')} className={`flex-1 py-3 text-center font-semibold border-b-2 ${activeTab === 'skills' ? 'text-primary-blue border-primary-blue' : 'text-gray-500 border-transparent hover:text-gray-700'}`}>Skills & Software</button>
                                </nav>
                            </div>

                            {/* Content */}
                            <div className="space-y-6">
                                {/* About Section */}
                                <div className={`${activeTab !== 'about' && 'hidden'} lg:block`}>
                                    <h2 className="text-2xl font-poppins font-bold text-gray-800 mb-3">About Me</h2>
                                    <p className="text-gray-600 leading-relaxed text-sm">{va.bio}</p>
                                </div>
                                
                                {/* Skills & Software Container */}
                                <div className={`${activeTab !== 'skills' && 'hidden'} lg:block space-y-6`}>
                                    <div>
                                        <h2 className="text-2xl font-poppins font-bold text-gray-800 mb-3">Core Skills</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {va.skills.map((skill) => (
                                                <span key={skill} className="bg-accent-light-blue text-primary-blue font-semibold py-1 px-3 rounded-full text-xs">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-poppins font-bold text-gray-800 mb-3">Software Proficiency</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {va.softwareProficiency.map((software) => (
                                                <div key={software.name} className="bg-light-gray p-3 rounded-lg text-center">
                                                    <span className="font-semibold text-gray-800 text-sm">{software.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
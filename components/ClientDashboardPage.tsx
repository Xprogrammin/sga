
import React, { useState, useMemo, useRef, FormEvent } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GoogleGenAI, Type } from '@google/genai';

import { Modal } from './Modal.tsx';
import { ClientSidebar } from './ClientSidebar.tsx';
import { 
    clientMessageThreads,
    clientUser,
    detailedVAs,
    servicesPageItems,
    clientNavLinks
} from '../constants.tsx';
import type { 
    ClientView, 
    ClientStat, 
    ClientProject,
    ProjectStatus,
    ClientMessageThread,
    ClientBillingRecord,
    BillingStatus,
    DetailedVirtualAssistant,
    VAType,
    Service,
    ClientMessage
} from '../types.ts';
import { 
    MenuIcon, SendIcon, DownloadIcon, SearchIcon, ActivityIcon, UsersGroupIcon, 
    DollarSignIcon, ChatBubbleIcon, PhoneIcon, VideoIcon, PaperclipIcon, MicrophoneIcon,
    ArrowLeftIcon, StarIcon, LoadingSpinnerIcon, FileIcon, ImageIcon, WalletIcon, PlusIcon, SparklesIcon
} from './icons.tsx';
import { VAProfileCard } from './VAProfileCard.tsx';
import { Invoice } from './Invoice.tsx';


interface ClientDashboardPageProps {
    onLogout: () => void;
    openHireModal: (va: DetailedVirtualAssistant) => void;
    projects: ClientProject[];
    setProjects: React.Dispatch<React.SetStateAction<ClientProject[]>>;
    billingHistory: ClientBillingRecord[];
}

// Initialize the GoogleGenAI client once
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// =======================
// Reusable Components
// =======================

const DashboardHeader: React.FC<{ title: string; subtitle: string; children?: React.ReactNode; onBack?: () => void; }> = ({ title, subtitle, children, onBack }) => (
    <div className="mb-8">
        {onBack && (
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-primary-blue font-semibold hover:underline mb-2">
                <ArrowLeftIcon className="w-4 h-4"/>
                Back
            </button>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            </div>
            <div className="mt-4 sm:mt-0 flex-shrink-0">{children}</div>
        </div>
    </div>
);


const ClientStatCard: React.FC<{ stat: ClientStat, index: number }> = ({ stat, index }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
        <div className="w-12 h-12 bg-accent-light-blue text-primary-blue rounded-lg flex items-center justify-center flex-shrink-0">
            {stat.icon}
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm font-semibold text-gray-500">{stat.title}</p>
        </div>
    </div>
);

const ProjectStatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
    const styles: Record<ProjectStatus, string> = {
        'Active': 'bg-green-100 text-green-800',
        'Completed': 'bg-blue-100 text-blue-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Canceled': 'bg-red-100 text-red-800',
        'Delivered': 'bg-purple-100 text-purple-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

const BillingStatusBadge: React.FC<{ status: BillingStatus }> = ({ status }) => {
    const styles: Record<BillingStatus, string> = {
        'Paid': 'bg-green-100 text-green-800',
        'Due': 'bg-red-100 text-red-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};


// =======================
// View Components
// =======================

const WalletCard: React.FC<{ balance: number, onDeposit: () => void }> = ({ balance, onDeposit }) => (
    <div className="bg-light-lavender rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-blue/10 rounded-full"></div>
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-primary-blue/5 rounded-full"></div>
        
        <div className="relative z-10">
            <div className="flex items-center gap-3 text-primary-blue">
                <WalletIcon className="w-8 h-8"/>
                <p className="text-lg font-semibold">My Wallet</p>
            </div>
            <p className="text-4xl font-bold mt-2 text-dark-text">${balance.toFixed(2)}</p>
            <p className="text-gray-700 text-sm">Available Balance</p>
        </div>
        <button 
            onClick={onDeposit} 
            className="relative z-10 mt-4 sm:mt-0 bg-white text-primary-blue font-bold py-2.5 px-6 rounded-lg hover:bg-white/80 transition-colors shadow-md text-sm"
        >
            Deposit Funds
        </button>
    </div>
);

const DashboardView: React.FC<{ setActiveView: (view: ClientView) => void; projects: ClientProject[], billingHistory: ClientBillingRecord[]; walletBalance: number; onDeposit: () => void; }> = ({ setActiveView, projects, billingHistory, walletBalance, onDeposit }) => {
    const getVaName = (vaId: string) => detailedVAs.find(v => v.id === vaId)?.name || 'Unknown VA';
    
    const clientStats = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const monthlySpend = billingHistory
            .filter(record => {
                const recordDate = new Date(record.date);
                return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear && record.status === 'Paid';
            })
            .reduce((sum, record) => sum + record.amount, 0);

        const unreadCount = clientMessageThreads.reduce((sum, thread) => sum + thread.unreadCount, 0);

        return [
            { title: 'Active Projects', value: projects.filter(p => p.status === 'Active').length.toString(), icon: <ActivityIcon className="w-6 h-6"/> },
            { title: 'Hired VAs', value: [...new Set(projects.map(p => p.vaId))].length.toString(), icon: <UsersGroupIcon className="w-6 h-6"/> },
            { title: 'This Month\'s Spend', value: `$${monthlySpend.toLocaleString()}`, icon: <DollarSignIcon className="w-6 h-6"/> },
            { title: 'Unread Messages', value: unreadCount.toString(), icon: <ChatBubbleIcon className="w-6 h-6"/> },
        ];
    }, [projects, billingHistory]);

    return (
        <>
            <DashboardHeader title={`Welcome back, ${clientUser.name.split(' ')[0]}!`} subtitle="Here's a summary of your account today." />
            
            <WalletCard balance={walletBalance} onDeposit={onDeposit} />
            
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
                {clientStats.map((stat, index) => <ClientStatCard key={stat.title} stat={stat} index={index}/>)}
            </div>
            
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* My Projects */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Active Projects</h3>
                    <div className="space-y-4">
                        {projects.filter(p => p.status === 'Active').slice(0, 3).map(proj => (
                            <div key={proj.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{proj.title}</p>
                                    <p className="text-sm text-gray-500">with {getVaName(proj.vaId)}</p>
                                </div>
                                <button onClick={() => setActiveView('projects')} className="text-sm font-semibold text-primary-blue hover:underline">View</button>
                            </div>
                        ))}
                         {projects.filter(p => p.status === 'Active').length === 0 && <p className="text-sm text-gray-500 text-center py-4">No active projects.</p>}
                    </div>
                </div>

                {/* Recent Messages */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Recent Messages</h3>
                    <div className="space-y-4">
                        {clientMessageThreads.slice(0, 2).map(thread => (
                             <div key={thread.id} className="flex items-center gap-4">
                                <img src={thread.vaImageUrl} alt={thread.vaName} className="w-10 h-10 rounded-full"/>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="font-semibold text-sm">{thread.vaName}</p>
                                        <p className="text-xs text-gray-400">{thread.lastMessageTimestamp}</p>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{thread.lastMessage.startsWith("Attachment:") ? `📎 ${thread.lastMessage}`: thread.lastMessage}</p>
                                </div>
                                {thread.unreadCount > 0 && <span className="bg-primary-blue text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{thread.unreadCount}</span>}
                            </div>
                        ))}
                    </div>
                     <button onClick={() => setActiveView('messages')} className="text-sm font-semibold text-primary-blue hover:underline mt-4">View all messages</button>
                </div>
            </div>
        </>
    );
};

const ServiceCategoryCard: React.FC<{ service: Service; onClick: () => void; }> = ({ service, onClick }) => (
    <button
      onClick={onClick}
      className="group bg-white p-6 rounded-2xl shadow-sm border text-left hover:shadow-xl hover:-translate-y-1 transition-all w-full h-full flex flex-col"
    >
      <div className="w-12 h-12 text-primary-blue bg-accent-light-blue rounded-lg flex items-center justify-center">
        {service.icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mt-4">{service.title}</h3>
      <p className="text-sm text-gray-500 mt-1 flex-grow">{service.description}</p>
      <p className="text-sm text-primary-blue font-semibold group-hover:underline mt-4 self-start">
        View VAs &rarr;
      </p>
    </button>
);

const AIRecommendedVACard: React.FC<{
    va: DetailedVirtualAssistant;
    reason: string;
    index: number;
    openHireModal: (va: DetailedVirtualAssistant) => void;
    onSelectVa: (va: DetailedVirtualAssistant) => void;
}> = ({ va, reason, index, openHireModal, onSelectVa }) => {
    return (
        <div
            className="bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col md:flex-row items-center gap-6 p-6 transition-all duration-300 hover:shadow-xl hover:border-primary-blue opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* VA Profile Section */}
            <div className="flex-shrink-0 text-center w-full md:w-48">
                <img
                    src={va.imageUrl}
                    alt={va.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-md"
                />
                <h3 className="text-lg font-bold text-dark-text mt-3">{va.name}</h3>
                <p className="text-sm text-primary-blue font-semibold">{va.type} VA</p>
                <div className="flex justify-center items-center mt-1">
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    <span className="ml-1 text-sm font-bold text-gray-600">{va.stats.rating.toFixed(1)}</span>
                </div>
            </div>

            {/* AI Reasoning & Actions Section */}
            <div className="flex-grow w-full">
                <div className="bg-light-lavender p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <SparklesIcon className="w-5 h-5 text-primary-blue" />
                        <h4 className="font-bold text-primary-blue">Why we recommend {va.name.split(' ')[0]}</h4>
                    </div>
                    <p className="text-sm text-gray-700 italic">"{reason}"</p>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={() => onSelectVa(va)}
                        className="flex-1 bg-white border border-primary-blue text-primary-blue font-semibold py-2 px-4 rounded-lg hover:bg-accent-light-blue transition-colors duration-300 text-sm"
                    >
                        View Full Profile
                    </button>
                    <button
                        onClick={() => openHireModal(va)}
                        className="flex-1 bg-primary-blue text-white font-semibold py-2 px-4 rounded-lg hover:opacity-80 transition-opacity duration-300 text-sm"
                    >
                        Hire Now
                    </button>
                </div>
            </div>
        </div>
    );
};

const FindVAView: React.FC<{ onSelectVa: (va: DetailedVirtualAssistant) => void; openHireModal: (va: DetailedVirtualAssistant) => void; setActiveView: (view: ClientView) => void; }> = ({ onSelectVa, openHireModal, setActiveView }) => {
    const [view, setView] = useState<'categories' | 'services' | 'vas' | 'ai-input' | 'ai-loading' | 'ai-results'>('categories');
    const [selectedCategory, setSelectedCategory] = useState<VAType | null>(null);
    const [selectedServiceTitle, setSelectedServiceTitle] = useState<string | null>(null);
    
    // AI State
    const [projectDescription, setProjectDescription] = useState('');
    const [aiRecommendations, setAiRecommendations] = useState<{ va: DetailedVirtualAssistant; reason: string }[]>([]);

    const servicesByType = useMemo(() => {
        return servicesPageItems.reduce((acc, service) => {
            if (service.vaType) {
            if (!acc[service.vaType]) {
                acc[service.vaType] = { services: [], icon: service.icon };
            }
            acc[service.vaType].services.push(service);
            }
            return acc;
        }, {} as Record<VAType, {services: Service[], icon: React.ReactNode}>);
    }, []);

    const handleCategorySelect = (category: VAType) => {
        setSelectedCategory(category);
        setView('services');
    };

    const handleViewVAs = (serviceTitle: string) => {
        setSelectedServiceTitle(serviceTitle);
        setView('vas');
    };
    
    const handleGetAiRecommendations = async () => {
        if (!projectDescription.trim()) return;
        setView('ai-loading');

        const vaDataForPrompt = detailedVAs.map(va => ({
            id: va.id,
            type: va.type,
            tagline: va.tagline,
            bio: va.bio,
            skills: va.skills,
        }));
        
        const prompt = `
            You are an expert talent matching system for a virtual assistant platform called Catazet.
            Your task is to analyze the user's project description and recommend the top 3-5 most suitable virtual assistants from the provided list.

            Analyze the following project description:
            "${projectDescription}"

            Here is the list of available virtual assistants in JSON format:
            ${JSON.stringify(vaDataForPrompt, null, 2)}

            Based on the project description, please return a JSON object containing a 'recommendations' array of the best-matched virtual assistants.
            For each recommended assistant, provide their 'vaId' and a concise, compelling 'reason' (20-30 words) explaining why they are a great fit for this specific project.
            Prioritize assistants whose 'type' (e.g., 'Tech', 'Health') and 'skills' directly align with the project needs described.
        `;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            recommendations: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        vaId: { type: Type.STRING, description: 'The unique ID of the recommended virtual assistant.' },
                                        reason: { type: Type.STRING, description: 'A brief explanation for the recommendation.' }
                                    },
                                    required: ['vaId', 'reason']
                                }
                            }
                        },
                        required: ['recommendations']
                    }
                }
            });

            const resultJson = JSON.parse(response.text);
            const recommendationsData = resultJson.recommendations || [];
            
            const populatedRecommendations = recommendationsData
                .map((rec: { vaId: string; reason: string }) => {
                    const va = detailedVAs.find(v => v.id === rec.vaId);
                    return va ? { va, reason: rec.reason } : null;
                })
                .filter(Boolean);

            setAiRecommendations(populatedRecommendations);
            setView('ai-results');

        } catch (error) {
            console.error("Error getting AI recommendations:", error);
            setView('ai-input');
            alert("Sorry, we couldn't get AI recommendations at this time. Please try again later.");
        }
    };

    const handleBack = () => {
        if (view === 'ai-results' || view === 'ai-loading' || view === 'ai-input') {
            setView('categories');
            setProjectDescription('');
            setAiRecommendations([]);
        } else if (view === 'vas') {
          setView('services');
          setSelectedServiceTitle(null);
        } else if (view === 'services') {
          setView('categories');
          setSelectedCategory(null);
        }
    };
    
    // AI Views
    if (view === 'ai-input') {
        return (
            <>
                <DashboardHeader title="Get AI-Powered Recommendations" subtitle="Describe your project, and our AI will find the best VAs for you." onBack={handleBack} />
                <div className="bg-white rounded-xl shadow-sm border p-6 max-w-2xl mx-auto">
                    <textarea 
                        value={projectDescription} 
                        onChange={e => setProjectDescription(e.target.value)}
                        placeholder="e.g., I need a Tech VA to help with QA testing for a new mobile app. They should be familiar with Jira and manual testing processes..."
                        className="w-full p-3 border rounded-md min-h-[150px] focus:ring-2 focus:ring-primary-blue/50 focus:border-primary-blue/50"
                    />
                    <button 
                        onClick={handleGetAiRecommendations} 
                        disabled={!projectDescription.trim()}
                        className="mt-4 w-full bg-primary-blue text-white font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Find My VA
                    </button>
                </div>
            </>
        );
    }

    if (view === 'ai-loading') {
        return (
            <>
                <DashboardHeader title="Analyzing Your Project..." subtitle="Our AI is finding the perfect match. Please wait a moment." onBack={handleBack}/>
                <div className="text-center p-20 bg-white rounded-xl shadow-sm border">
                    <LoadingSpinnerIcon className="w-12 h-12 text-primary-blue mx-auto" />
                    <p className="mt-4 text-lg font-semibold text-gray-700">Matching you with top talent...</p>
                </div>
            </>
        );
    }
    
    if (view === 'ai-results') {
        return (
            <>
                <DashboardHeader title="Top Recommendations For You" subtitle="Based on your project description, here are our top picks." onBack={handleBack} />
                <div className="space-y-6">
                    {aiRecommendations.length > 0 ? (
                        aiRecommendations.map(({ va, reason }, index) => (
                            <AIRecommendedVACard key={va.id} va={va} reason={reason} index={index} openHireModal={openHireModal} onSelectVa={onSelectVa} />
                        ))
                    ) : (
                        <div className="text-center p-20 bg-white rounded-xl shadow-sm border">
                            <p className="text-gray-500">We couldn't find a perfect match based on your description. Try being more specific or browse categories manually.</p>
                        </div>
                    )}
                </div>
            </>
        )
    }

    // Manual Browsing Views
    if (view === 'services' && selectedCategory) {
        const services = servicesByType[selectedCategory]?.services || [];
        return (
            <>
                <DashboardHeader
                    title={`${selectedCategory} Services`}
                    subtitle={`Click on a service to see available Virtual Assistants.`}
                    onBack={handleBack}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map(service => (
                        <ServiceCategoryCard 
                            key={service.title} 
                            service={service}
                            onClick={() => handleViewVAs(service.title)}
                        />
                    ))}
                </div>
            </>
        );
    }

    if (view === 'vas' && selectedCategory) {
        const filteredVAs = detailedVAs.filter(va => va.type === selectedCategory);
        return (
          <>
            <DashboardHeader
              title={selectedServiceTitle ? `${selectedServiceTitle} VAs` : `Virtual Assistants for ${selectedCategory}`}
              subtitle={`Browse our top-rated ${selectedCategory} specialists.`}
              onBack={handleBack}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredVAs.map((va, index) => (
                <VAProfileCard 
                  key={va.id} 
                  va={va} 
                  index={index}
                  openHireModal={openHireModal}
                  navigate={(page, context) => { 
                    if (context.vaId) {
                      const vaDetails = detailedVAs.find(v => v.id === context.vaId);
                      if (vaDetails) onSelectVa(vaDetails);
                    }
                  }}
                />
              ))}
                {filteredVAs.length === 0 && (
                    <div className="col-span-full text-center p-10 bg-white rounded-xl shadow-sm border">
                        <p className="text-gray-500">No VAs available for this category yet. Check back soon!</p>
                    </div>
                )}
            </div>
          </>
        );
    }

    // Default 'categories' view
    return (
        <>
            <DashboardHeader title="Find a Virtual Assistant" subtitle="Select a service category or get AI-powered recommendations." />
            
            <div className="bg-gradient-to-r from-primary-blue to-blue-600 rounded-2xl shadow-lg p-8 mb-8 text-white text-center">
                <h3 className="text-2xl font-bold">Don't know where to start?</h3>
                <p className="mt-2 opacity-90">Let our AI find the perfect VA for you based on your project needs.</p>
                <button onClick={() => setView('ai-input')} className="mt-6 bg-white text-primary-blue font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition-colors">
                    Get AI Recommendations
                </button>
            </div>
            
            <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">Or, browse by category:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(Object.keys(servicesByType) as VAType[]).map((type) => {
            const data = servicesByType[type];
            return (
            <button 
                key={type}
                onClick={() => handleCategorySelect(type)}
                className="group bg-white p-6 rounded-2xl shadow-sm border text-left hover:shadow-xl hover:-translate-y-1 transition-all"
            >
                <div className="flex items-center gap-4">
                <div className="w-12 h-12 text-primary-blue bg-accent-light-blue rounded-lg flex items-center justify-center">
                    {data.icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{type} VAs</h3>
                    <p className="text-sm text-primary-blue font-semibold group-hover:underline mt-1">View Services &rarr;</p>
                </div>
                </div>
            </button>
            )})}
            </div>
        </>
    );
};

const ProjectsView: React.FC<{ projects: ClientProject[]; setProjects: (projects: ClientProject[]) => void; onSelectVa: (va: DetailedVirtualAssistant) => void; setActiveView: (view: ClientView) => void; }> = ({ projects, setProjects, onSelectVa, setActiveView }) => {
    const myProjects = projects.filter(p => p.clientId === clientUser.id);
    const getVaDetails = (vaId: string) => detailedVAs.find(v => v.id === vaId);

    const handleViewProfile = (vaId: string) => {
        const va = getVaDetails(vaId);
        if(va) {
            onSelectVa(va);
            setActiveView('va-profile');
        }
    };

    const handleAcceptDelivery = (projectId: string) => {
        setProjects(projects.map(p => p.id === projectId ? { ...p, status: 'Completed' } : p));
    };
    
    const handleRejectDelivery = (projectId: string) => {
        alert("Project has been marked as needing revisions. Please communicate with your VA.");
        setProjects(projects.map(p => p.id === projectId ? { ...p, status: 'Active' } : p));
    };
    
    return (
        <>
            <DashboardHeader title="My Projects" subtitle="Manage your ongoing and completed projects." />
            <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Project Title</th>
                            <th className="p-4">Virtual Assistant</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Rate</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {myProjects.map(proj => {
                            const va = getVaDetails(proj.vaId);
                            return (
                                <tr key={proj.id}>
                                    <td className="p-4 font-semibold text-gray-800">{proj.title}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {va && <img src={va.imageUrl} alt={va.name} className="w-8 h-8 rounded-full" />}
                                            <p className="font-semibold">{va?.name || 'N/A'}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {proj.status === 'Delivered' ? (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleAcceptDelivery(proj.id)} className="bg-green-500 text-white text-xs font-bold py-1 px-2 rounded-md hover:bg-green-600 transition-colors">Accept</button>
                                                <button onClick={() => handleRejectDelivery(proj.id)} className="bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-md hover:bg-red-600 transition-colors">Reject</button>
                                            </div>
                                        ) : (
                                            <ProjectStatusBadge status={proj.status}/>
                                        )}
                                    </td>
                                    <td className="p-4 text-gray-600 font-medium">{proj.rate}</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleViewProfile(proj.vaId)} className="text-primary-blue font-semibold hover:underline">View Profile</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

const MessagesView: React.FC = () => {
    const [allThreads] = useState(clientMessageThreads);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeThread, setActiveThread] = useState<ClientMessageThread | null>(null);
    const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
    const [messageInput, setMessageInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredThreads = useMemo(() => {
        if (!searchTerm) return allThreads;
        return allThreads.filter(thread => thread.vaName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allThreads, searchTerm]);

    const handleSendMessage = () => {
        if (!messageInput.trim() || !activeThread) return;
        // This is a mock. In a real app, this would update state via a state setter prop.
        console.log(`Sending message to ${activeThread.vaName}: ${messageInput}`);
        setMessageInput('');
    };
    
    const handleSelectThread = (thread: ClientMessageThread) => {
        setActiveThread(thread);
        setMobileView('chat');
    };

    const renderMessageContent = (message: ClientMessage) => {
        const { content } = message;
        switch (content.type) {
            case 'image': return <img src={content.file?.url} alt={content.file?.name} className="rounded-lg max-w-xs cursor-pointer" />;
            case 'file': return (<a href={content.file?.url} download className="flex items-center gap-3 bg-gray-200 p-3 rounded-lg hover:bg-gray-300 transition-colors"><FileIcon className="w-8 h-8 text-gray-600 flex-shrink-0" /><div><p className="font-semibold text-sm">{content.file?.name}</p><p className="text-xs text-gray-500">{content.file?.size}</p></div></a>);
            case 'voice_note': return <div className="flex items-center gap-2 p-2 bg-gray-200 rounded-lg"><MicrophoneIcon className="w-5 h-5 text-gray-700" /> <span className="text-sm font-medium">Voice Note ({content.duration})</span></div>;
            case 'call_record': return <div className="flex items-center gap-2 p-2 bg-gray-200 rounded-lg">{content.callType === 'audio' ? <PhoneIcon className="w-5 h-5 text-gray-700"/> : <VideoIcon className="w-5 h-5 text-gray-700"/>} <span className="text-sm font-medium">{content.callType === 'audio' ? 'Audio Call' : 'Video Call'} ({content.duration})</span></div>;
            default: return <p className="whitespace-pre-wrap">{content.text}</p>;
        }
    };
    
    return (
        <>
            <DashboardHeader title="Messages" subtitle="Communicate directly with your Virtual Assistants." />
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 h-[75vh]">
                {/* Thread List */}
                <div className={`${mobileView === 'chat' && window.innerWidth < 768 ? 'hidden' : 'flex'} md:flex md:col-span-1 lg:col-span-1 bg-white rounded-xl shadow-sm border p-2 flex-col h-full`}>
                    <div className="p-2 flex-shrink-0"><div className="relative"><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search chats..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-50 border-gray-200 border rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-primary-blue/50 focus:border-primary-blue/50"/></div></div>
                    <div className="space-y-1 overflow-y-auto flex-grow">{filteredThreads.map(thread => (<button key={thread.id} onClick={() => handleSelectThread(thread)} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${activeThread?.id === thread.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}><img src={thread.vaImageUrl} alt={thread.vaName} className="w-12 h-12 rounded-full"/><div className="flex-1 overflow-hidden"><p className="font-semibold text-sm text-gray-800 truncate">{thread.vaName}</p><p className="text-sm text-gray-500 truncate">{thread.lastMessage.startsWith("Attachment:") ? `📎 ${thread.lastMessage}` : thread.lastMessage}</p></div></button>))}</div>
                </div>

                {/* Chat Area */}
                <div className={`${mobileView === 'list' && window.innerWidth < 768 ? 'hidden' : 'flex'} md:flex md:col-span-2 lg:col-span-3 bg-white rounded-xl shadow-sm border flex-col h-full`}>
                {activeThread ? (
                <>
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMobileView('list')} className="md:hidden p-1 -ml-2 mr-2 text-gray-500 hover:text-gray-800"><ArrowLeftIcon className="w-5 h-5"/></button>
                            <img src={activeThread.vaImageUrl} alt={activeThread.vaName} className="w-10 h-10 rounded-full"/>
                            <h3 className="font-bold text-lg">{activeThread.vaName}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => alert("Starting audio call...")} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"><PhoneIcon className="w-5 h-5"/></button>
                            <button onClick={() => alert("Starting video call...")} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"><VideoIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                    <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-gray-100">{activeThread.messages.map(msg => (<div key={msg.id} className={`flex items-end gap-3 ${msg.from === 'client' ? 'justify-end' : 'justify-start'}`}>{msg.from === 'va' && <img src={activeThread.vaImageUrl} className="w-8 h-8 rounded-full" />}<div className={`max-w-md ${msg.content.type === 'text' ? `px-4 py-2 rounded-2xl text-sm shadow-sm ${msg.from === 'client' ? 'bg-primary-blue text-white' : 'bg-gray-200 text-gray-800'}` : ''}`}>{renderMessageContent(msg)}</div>{msg.from === 'client' && <img src={clientUser.avatarUrl} className="w-8 h-8 rounded-full" />}</div>))}</div>
                    <div className="p-4 border-t bg-gray-50 flex items-center gap-2"><input type="file" ref={fileInputRef} className="hidden" onChange={() => alert("File selected!")}/><button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"><PaperclipIcon className="w-5 h-5"/></button><button onClick={() => alert("Recording voice note...")} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"><MicrophoneIcon className="w-5 h-5"/></button><input type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Type your message..." className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 text-sm"/><button onClick={handleSendMessage} className="bg-primary-blue text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 flex items-center justify-center shadow-sm"><SendIcon className="w-5 h-5"/></button></div>
                </>
                ) : (<div className="flex items-center justify-center h-full"><p className="text-gray-500">Select a conversation to start messaging.</p></div>)}
            </div>
            </div>
        </>
    )
};


const BillingView: React.FC<{ 
    billingHistory: ClientBillingRecord[];
    onAddPayment: () => void;
    onBankTransfer: () => void;
}> = ({ billingHistory, onAddPayment, onBankTransfer }) => {
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<ClientBillingRecord | null>(null);
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handleDownload = (invoice: ClientBillingRecord) => {
        setSelectedInvoice(invoice);
        setIsDownloading(invoice.id);

        setTimeout(async () => {
            if (!invoiceRef.current) {
                console.error("Invoice component is not available for rendering.");
                setIsDownloading(null);
                return;
            };

            try {
                const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Catazet-Invoice-${invoice.invoiceId}.pdf`);
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                setIsDownloading(null);
                setSelectedInvoice(null);
            }
        }, 100);
    };
    
    return (
        <>
            <DashboardHeader title="Billing & Payments" subtitle="View your payment history and download invoices." />
             <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Payment Options</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={onAddPayment} className="flex-1 bg-primary-blue text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                        <PlusIcon className="w-5 h-5"/> Add New Payment Method
                    </button>
                    <button onClick={onBankTransfer} className="flex-1 bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors">
                        Bank Transfer Details
                    </button>
                </div>
            </div>
             <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr><th className="p-4">Date</th><th className="p-4">Description</th><th className="p-4">Amount</th><th className="p-4">Status</th><th className="p-4 text-right">Invoice</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {billingHistory.map(record => (<tr key={record.id}><td className="p-4 text-gray-600">{new Date(record.date).toLocaleDateString()}</td><td className="p-4 font-semibold">{record.description}</td><td className="p-4 font-mono text-gray-800">${record.amount.toFixed(2)}</td><td className="p-4"><BillingStatusBadge status={record.status}/></td><td className="p-4 text-right"><button onClick={() => handleDownload(record)} disabled={isDownloading === record.id} className="text-primary-blue font-semibold hover:underline disabled:opacity-50 disabled:cursor-wait flex items-center gap-1 justify-end">{isDownloading === record.id ? <LoadingSpinnerIcon className="w-4 h-4"/> : <DownloadIcon className="w-4 h-4" />}{record.invoiceId}</button></td></tr>))}
                    </tbody>
                </table>
            </div>
            <div className="fixed -left-[9999px] top-0 z-[-1]">{selectedInvoice && <div ref={invoiceRef}><Invoice invoice={selectedInvoice} /></div>}</div>
        </>
    );
};

const SettingsView: React.FC = () => {
    const [formState, setFormState] = useState({ name: clientUser.name, email: clientUser.email, password: '' });
    const handleSave = () => { alert('Settings saved!'); };
    return (<><DashboardHeader title="Settings" subtitle="Manage your account details and preferences."/><div className="bg-white p-8 rounded-xl shadow-sm border max-w-2xl"><form className="space-y-6"><div><label className="block text-sm font-medium text-gray-700">Company Name</label><input type="text" value={formState.name} onChange={(e) => setFormState({...formState, name: e.target.value})} className="mt-1 w-full p-2 border rounded-md"/></div><div><label className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" value={formState.email} onChange={(e) => setFormState({...formState, email: e.target.value})} className="mt-1 w-full p-2 border rounded-md"/></div><div><label className="block text-sm font-medium text-gray-700">New Password</label><input type="password" placeholder="Leave blank to keep current password" value={formState.password} onChange={(e) => setFormState({...formState, password: e.target.value})} className="mt-1 w-full p-2 border rounded-md"/></div><button type="button" onClick={handleSave} className="bg-primary-blue text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90">Save Changes</button></form></div></>);
};

const VAProfileView: React.FC<{ va: DetailedVirtualAssistant, onBack: () => void, openHireModal: (va: DetailedVirtualAssistant) => void }> = ({ va, onBack, openHireModal }) => (
    <><DashboardHeader title={va.name} subtitle={va.tagline} onBack={onBack}/><div className="lg:grid lg:grid-cols-12 lg:gap-8"><div className="lg:col-span-5 mb-8 lg:mb-0"><div className="bg-white p-6 rounded-2xl shadow-lg"><div className="flex flex-col items-center text-center"><img src={va.imageUrl} alt={va.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl" /><h2 className="text-3xl font-poppins font-bold text-primary-blue mt-4">{va.name}</h2><p className="text-gray-500 font-medium">{va.type} Virtual Assistant</p><div className="my-4 w-full border-t border-gray-200"></div><div className="grid grid-cols-3 gap-4 w-full"><div className="text-center"><p className="text-2xl font-bold text-primary-blue">{va.stats.rating.toFixed(1)}</p><p className="text-xs text-gray-500 uppercase">Rating</p></div><div className="text-center"><p className="text-2xl font-bold text-primary-blue">{va.stats.projectsCompleted}</p><p className="text-xs text-gray-500 uppercase">Projects</p></div><div className="text-center"><p className="text-2xl font-bold text-primary-blue">{va.stats.responseRate}</p><p className="text-xs text-gray-500 uppercase">Response</p></div></div><div className="mt-6 w-full"><button onClick={() => openHireModal(va)} className="w-full bg-primary-blue text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition-all transform hover:scale-105">Hire {va.name.split(' ')[0]} Now</button></div></div></div></div><div className="lg:col-span-7"><div className="bg-white rounded-2xl shadow-lg p-6"><div className="space-y-6"><div><h3 className="text-xl font-poppins font-bold text-gray-800 mb-2">About Me</h3><p className="text-gray-600 leading-relaxed text-sm">{va.bio}</p></div><div><h3 className="text-xl font-poppins font-bold text-gray-800 mb-3">Core Skills</h3><div className="flex flex-wrap gap-2">{va.skills.map((skill) => (<span key={skill} className="bg-accent-light-blue text-primary-blue font-semibold py-1 px-3 rounded-full text-xs">{skill}</span>))}</div></div><div><h3 className="text-xl font-poppins font-bold text-gray-800 mb-3">Software Proficiency</h3><div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{va.softwareProficiency.map((software) => (<div key={software.name} className="bg-light-gray p-3 rounded-lg text-center"><span className="font-semibold text-gray-800 text-sm">{software.name}</span></div>))}</div></div></div></div></div></div></>
);

// =======================
// Main Component
// =======================

export const ClientDashboardPage: React.FC<ClientDashboardPageProps> = ({ onLogout, openHireModal, projects, setProjects, billingHistory }) => {
    const [activeView, setActiveView] = useState<ClientView>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // State for deeper navigation
    const [selectedVa, setSelectedVa] = useState<DetailedVirtualAssistant | null>(null);

    // State for wallet & payment modals
    const [walletBalance, setWalletBalance] = useState(150.00);
    const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
    const [isBankDetailsModalOpen, setIsBankDetailsModalOpen] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

    const handleNavigate = (view: ClientView) => {
        setSelectedVa(null); // Clear selected VA when changing main views
        setActiveView(view);
    };

    const handleSelectVa = (va: DetailedVirtualAssistant) => {
        setSelectedVa(va);
        setActiveView('va-profile'); 
    }

    const renderView = () => {
        switch (activeView) {
            case 'dashboard': return <DashboardView setActiveView={handleNavigate} projects={projects} billingHistory={billingHistory} walletBalance={walletBalance} onDeposit={() => setIsDepositModalOpen(true)} />;
            case 'find-va': return <FindVAView onSelectVa={handleSelectVa} openHireModal={openHireModal} setActiveView={handleNavigate} />;
            case 'projects': return <ProjectsView projects={projects} setProjects={setProjects} onSelectVa={handleSelectVa} setActiveView={handleNavigate} />;
            case 'messages': return <MessagesView />;
            case 'billing': return <BillingView billingHistory={billingHistory} onAddPayment={() => setIsAddPaymentModalOpen(true)} onBankTransfer={() => setIsBankDetailsModalOpen(true)} />;
            case 'settings': return <SettingsView />;
            case 'va-profile':
                if(selectedVa) return <VAProfileView va={selectedVa} onBack={() => {setSelectedVa(null); setActiveView('find-va')}} openHireModal={openHireModal} />;
                return <FindVAView onSelectVa={handleSelectVa} openHireModal={openHireModal} setActiveView={handleNavigate}/>; // Fallback
            default: return <DashboardView setActiveView={handleNavigate} projects={projects} billingHistory={billingHistory} walletBalance={walletBalance} onDeposit={() => setIsDepositModalOpen(true)} />;
        }
    };
    
    const BankTransferDetailsModal = () => {
        const [activeTab, setActiveTab] = useState('US');
        const details = {
            US: { Account: '123456789', Routing: '987654321', Bank: 'Catazet US Bank' },
            UK: { Account: '987654321', SortCode: '12-34-56', Bank: 'Catazet UK Bank' },
            Euro: { IBAN: 'EU12345678901234567890', BIC: 'CATZETEU', Bank: 'Catazet Euro Bank' },
        };
        return (
            <Modal isOpen={isBankDetailsModalOpen} onClose={() => setIsBankDetailsModalOpen(false)} title="Bank Transfer Details">
                <div className="flex border-b mb-4">
                    {Object.keys(details).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 font-semibold ${activeTab === tab ? 'text-primary-blue border-b-2 border-primary-blue' : 'text-gray-500'}`}>{tab}</button>
                    ))}
                </div>
                <div>
                    {Object.entries(details[activeTab as keyof typeof details]).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b"><span className="text-gray-500">{key}:</span><span className="font-semibold">{value}</span></div>
                    ))}
                </div>
            </Modal>
        );
    };

    const DepositModal = () => {
        const [amount, setAmount] = useState('');
        const handleDeposit = (e: FormEvent) => {
            e.preventDefault();
            const depositAmount = parseFloat(amount);
            if (!isNaN(depositAmount) && depositAmount > 0) {
                setWalletBalance(prev => prev + depositAmount);
                setIsDepositModalOpen(false);
                setAmount('');
            }
        }
        return (
            <Modal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} title="Deposit Funds to Wallet">
                <form onSubmit={handleDeposit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (USD)</label>
                        <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., 50.00" min="1" step="0.01" required/>
                    </div>
                    <button type="submit" className="w-full bg-primary-blue text-white font-semibold py-2 rounded-lg hover:opacity-90">Deposit</button>
                </form>
            </Modal>
        );
    };

    const AddPaymentMethodModal = () => (
         <Modal isOpen={isAddPaymentModalOpen} onClose={() => setIsAddPaymentModalOpen(false)} title="Add New Payment Method">
            <form onSubmit={(e) => { e.preventDefault(); alert('Payment method added!'); setIsAddPaymentModalOpen(false); }} className="space-y-4">
                <div><label htmlFor="cardName">Name on Card</label><input type="text" id="cardName" className="mt-1 w-full p-2 border rounded-md" required/></div>
                <div><label htmlFor="cardNumber">Card Number</label><input type="text" id="cardNumber" className="mt-1 w-full p-2 border rounded-md" placeholder="•••• •••• •••• ••••" required/></div>
                <div className="flex gap-4"><div className="flex-1"><label htmlFor="expiry">Expiry</label><input type="text" id="expiry" className="mt-1 w-full p-2 border rounded-md" placeholder="MM/YY" required/></div><div className="flex-1"><label htmlFor="cvc">CVC</label><input type="text" id="cvc" className="mt-1 w-full p-2 border rounded-md" placeholder="•••" required/></div></div>
                <button type="submit" className="w-full bg-primary-blue text-white font-semibold py-2 rounded-lg hover:opacity-90">Add Card</button>
            </form>
        </Modal>
    )


    return (
        <div className="bg-gray-50 font-sans text-gray-900 flex min-h-screen">
            <ClientSidebar 
                activeView={activeView}
                setActiveView={handleNavigate}
                onLogout={onLogout}
                isMobileOpen={isMobileMenuOpen}
                setIsMobileOpen={setIsMobileMenuOpen}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-sm z-30 flex items-center justify-between p-4 border-b border-gray-200">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600" aria-label="Open menu">
                        <MenuIcon />
                    </button>
                     <h1 className="text-lg font-bold text-primary-blue">
                        {selectedVa ? selectedVa.name : clientNavLinks.find(l => l.id === activeView)?.name || 'Dashboard'}
                    </h1>
                    <div className="w-6 h-6"></div>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>
            
            <BankTransferDetailsModal />
            <DepositModal />
            <AddPaymentMethodModal />
        </div>
    );
};

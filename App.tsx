

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './components/HomePage.tsx';
import { ServicesPage } from './components/ServicesPage.tsx';
import { PricingPage } from './components/PricingPage.tsx';
import { BlogPage } from './components/BlogPage.tsx';
import { BlogPostDetailPage } from './components/BlogPostDetailPage.tsx';
import { AboutPage } from './components/AboutPage.tsx';
import { ContactPage } from './components/ContactPage.tsx';
import { VolunteerPage } from './components/VolunteerPage.tsx';
import { CoursesPage } from './components/CoursesPage.tsx';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage.tsx';
import { TermsOfServicePage } from './components/TermsOfServicePage.tsx';
import { VADetailPage } from './components/VADetailPage.tsx';
import { VACategoryPage } from './components/VACategoryPage.tsx';
import { VAListingPage } from './components/VAListingPage.tsx';
import { AllVAsPage } from './components/AllVAsPage.tsx';
import { AuthPage } from './components/AuthPage.tsx';
import { ChatWidget } from './components/ChatWidget.tsx';
import type { View as ChatView, ChatMessage, DetailedVirtualAssistant, VAType, ClientProject, ClientBillingRecord, PricingPlan, Page, PageContext } from './types.ts';
import { SpecialOffer } from './components/SpecialOffer.tsx';
import { PdfDownloadModal } from './components/PdfDownloadModal.tsx';
import { HireModal } from './components/HireModal.tsx';
import { AdminDashboardPage } from './components/AdminDashboardPage.tsx';
import { ClientDashboardPage } from './components/ClientDashboardPage.tsx';
import { VADashboardPage } from './components/VADashboardPage.tsx';
import { VolunteerDashboardPage } from './components/VolunteerDashboardPage.tsx';
import { CourseTakerDashboardPage } from './components/CourseTakerDashboardPage.tsx';
import { initialClientBillingHistory, initialClientProjects, clientUser, blogPosts, detailedVAs, servicesPageItems, monthlyPricingPlans, oneTimePricingPlans } from './constants.tsx';
import { GoogleGenAI } from '@google/genai';
import type { Chat } from '@google/genai';


const updateMetaTags = (title: string, description: string, canonicalPath: string = '') => {
  document.title = title;
  
  const setMeta = (attr: 'name' | 'property', value: string, content: string) => {
    let element = document.querySelector(`meta[${attr}='${value}']`);
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, value);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const setLink = (rel: string, href: string) => {
    let element = document.querySelector(`link[rel="${rel}"]`);
    if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  };
  
  const canonicalUrl = `https://www.catazet.com${canonicalPath}`;

  setMeta('name', 'title', title);
  setMeta('name', 'description', description);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', canonicalUrl);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setLink('canonical', canonicalUrl);

  // Remove existing hreflang tags to prevent duplicates
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(tag => tag.remove());

  // Add new hreflang tags for international targeting
  const hreflangConfigs = [
    { lang: 'en-US', href: canonicalUrl },
    { lang: 'en-CA', href: canonicalUrl },
    { lang: 'en-GB', href: canonicalUrl },
    { lang: 'en', href: canonicalUrl },
    { lang: 'x-default', href: canonicalUrl },
  ];

  hreflangConfigs.forEach(config => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = config.lang;
    link.href = config.href;
    document.head.appendChild(link);
  });
};

// Initialize the GoogleGenAI client once
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Routing Helpers ---

const getPathFromState = (page: Page, context: PageContext): string => {
    switch (page) {
        case 'home':
            return '/';
        case 'va-category':
            return `/services/${context.vaType?.toLowerCase()}`;
        case 'va-listing':
            return `/services/${context.vaType?.toLowerCase()}/assistants`;
        case 'va-detail':
            return `/va/${context.vaId}`;
        case 'blog-post':
            if (context.postId !== undefined) {
                const post = blogPosts.find(p => p.id === context.postId);
                const slug = post ? post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'post';
                return `/blog/${context.postId}-${slug}`;
            }
            return '/blog';
        case 'all-vas':
            return '/all-vas';
        case 'services':
        case 'pricing':
        case 'blog':
        case 'about':
        case 'contact':
        case 'volunteer-program':
        case 'courses':
        case 'privacy-policy':
        case 'terms-of-service':
            return `/${page}`;
        default:
            return '/';
    }
};

const getStateFromPath = (path: string): { page: Page; context: PageContext } => {
    if (path === '/') return { page: 'home', context: {} };
    if (path === '/all-vas') return { page: 'all-vas', context: {} };

    const simplePaths: Page[] = ['services', 'pricing', 'blog', 'about', 'contact', 'volunteer-program', 'courses', 'privacy-policy', 'terms-of-service'];
    for (const p of simplePaths) {
        if (path === `/${p}`) {
            return { page: p, context: {} };
        }
    }

    const vaDetailMatch = path.match(/^\/va\/(va-[a-z]+-\d+)$/);
    if (vaDetailMatch) {
        const vaId = vaDetailMatch[1];
        return { page: 'va-detail', context: { vaId } };
    }

    const vaListingMatch = path.match(/^\/services\/(general|tech|edu|health|security|student)\/assistants$/);
    if (vaListingMatch) {
        const vaType = (vaListingMatch[1].charAt(0).toUpperCase() + vaListingMatch[1].slice(1)) as VAType;
        return { page: 'va-listing', context: { vaType } };
    }
    
    const vaCategoryMatch = path.match(/^\/services\/(general|tech|edu|health|security|student)$/);
    if (vaCategoryMatch) {
        const vaType = (vaCategoryMatch[1].charAt(0).toUpperCase() + vaCategoryMatch[1].slice(1)) as VAType;
        return { page: 'va-category', context: { vaType } };
    }

    const blogPostMatch = path.match(/^\/blog\/(\d+)/);
    if (blogPostMatch) {
        return { page: 'blog-post', context: { postId: parseInt(blogPostMatch[1], 10) } };
    }

    return { page: 'home', context: {} }; // Default fallback
};


const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [pageContext, setPageContext] = useState<PageContext>({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
    const [isVALoggedIn, setIsVALoggedIn] = useState(false);
    const [isVolunteerLoggedIn, setIsVolunteerLoggedIn] = useState(false);
    const [isCourseTakerLoggedIn, setIsCourseTakerLoggedIn] = useState(false);

    // Shared state for dashboards
    const [projects, setProjects] = useState<ClientProject[]>(initialClientProjects);
    const [billingHistory, setBillingHistory] = useState<ClientBillingRecord[]>(initialClientBillingHistory);

    // Auth Modal State
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

    // PDF Modal State
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

    // Hire Modal State
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);
    const [selectedVa, setSelectedVa] = useState<DetailedVirtualAssistant | undefined>(undefined);

    // Chat Widget State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatView, setChatView] = useState<ChatView>('main');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { from: 'agent', text: 'Hello! How can I help you today?' }
    ]);
    const [isAiTyping, setIsAiTyping] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    
    // SEO and Meta Tag Management
    useEffect(() => {
        let title = 'Catazet Virtual Assistants | Save Time & Grow Your Business';
        let description = 'Catazet is the top virtual assistant company helping startups and businesses save time and cut costs. Hire expert VAs for tech, admin, education, health, and security support.';
        let canonicalPath = getPathFromState(currentPage, pageContext);

        switch (currentPage) {
            case 'home':
                break;
            case 'services':
                title = 'Virtual Assistant Services | Catazet';
                description = 'Explore a wide range of virtual assistant services from general admin, tech, education, health, to security. Find the right support for your business.';
                break;
            case 'pricing':
                title = 'Pricing Plans | Catazet';
                description = 'Transparent and flexible pricing plans for every business size. Hire a virtual assistant that fits your budget and needs.';
                break;
            case 'blog':
                title = 'Catazet Blog | Insights on Remote Work & Productivity';
                description = 'Read the latest articles on virtual assistance, remote work trends, productivity tips, and how to scale your business with Catazet.';
                break;
            case 'blog-post':
                if (pageContext.postId !== undefined) {
                    const post = blogPosts.find(p => p.id === pageContext.postId);
                    if (post) {
                        title = `${post.title} | Catazet Blog`;
                        description = post.excerpt;
                    }
                }
                break;
            case 'about':
                title = 'About Catazet | Our Mission and Vision';
                description = 'Learn about Catazet\'s mission to connect businesses with top-tier global talent from countries like the Philippines, India, and Nigeria, empowering economic growth.';
                break;
            case 'contact':
                title = 'Contact Us | Catazet';
                description = 'Get in touch with the Catazet team. We are here to answer your questions about our virtual assistant services.';
                break;
            case 'volunteer-program':
                title = 'Volunteer Program | Catazet';
                description = 'Gain practical experience and launch your VA career with the Catazet Volunteer Program. Work on real projects with expert mentorship.';
                break;
            case 'courses':
                title = 'Free Certification Courses | Catazet';
                description = 'Enroll in our free certification bootcamps to enhance your skills in virtual assistance, data analytics, AI, and more.';
                break;
            case 'privacy-policy':
                title = 'Privacy Policy | Catazet';
                description = 'Read the Catazet Privacy Policy to understand how we collect, use, and protect your personal information.';
                break;
            case 'terms-of-service':
                title = 'Terms of Service | Catazet';
                description = 'Review the Terms of Service for using the Catazet platform and hiring virtual assistants.';
                break;
            case 'all-vas':
                title = 'All Virtual Assistants | Catazet';
                description = 'Browse our complete roster of expert virtual assistants from all categories including Tech, General, Health, and more. Find your perfect match today.';
                break;
            case 'va-category':
                if (pageContext.vaType) {
                    const type = pageContext.vaType;
                    const servicesForType = servicesPageItems.filter(s => s.vaType === type).map(s => s.title).slice(0, 2).join(', ');
                    title = `${type} Virtual Assistant Services | Catazet`;
                    description = `Explore specialized services offered by our ${type} virtual assistants, including ${servicesForType} and more.`;
                }
                break;
            case 'va-listing':
                if (pageContext.vaType) {
                    const type = pageContext.vaType;
                    title = `Hire ${type} Virtual Assistants | Catazet`;
                    description = `Browse and hire from our pool of expert ${type} virtual assistants. View profiles and find your perfect match.`;
                }
                break;
            case 'va-detail':
                if (pageContext.vaId) {
                    const va = detailedVAs.find(v => v.id === pageContext.vaId);
                    if (va) {
                        const bioExcerpt = va.bio.split('. ')[0] + '.';
                        title = `Hire ${va.name} - ${va.type} VA | Catazet`;
                        description = `${va.tagline}. ${bioExcerpt}`;
                    }
                }
                break;
        }

        updateMetaTags(title, description, canonicalPath);

    }, [currentPage, pageContext]);
    
    const openPdfModal = () => setIsPdfModalOpen(true);
    
    const handleOpenQuoteChat = () => {
        setChatView('chat');
        setIsChatOpen(true);
        handleSendMessage("Hi, I'd like to get a quote for a custom project.");
    };

    const navigate = (page: string, context: any = {}) => {
        if (page === 'download-services') {
            openPdfModal();
            return;
        }
        if (page === 'open-quote-chat') {
            handleOpenQuoteChat();
            return;
        }
        
        const validPages: string[] = ['home', 'services', 'pricing', 'blog', 'about', 'contact', 'volunteer-program', 'courses', 'privacy-policy', 'terms-of-service', 'va-category', 'va-listing', 'va-detail', 'blog-post', 'all-vas'];
        if (validPages.includes(page as Page)) {
            const path = getPathFromState(page as Page, context);
            if (window.location.pathname !== path) {
                window.history.pushState({ page, context }, '', path);
            }
            setCurrentPage(page as Page);
            setPageContext(context);
            window.scrollTo(0, 0);
        }
    };

    // Effect for handling browser navigation (back/forward) and initial load.
    useEffect(() => {
        const handleLocationChange = () => {
            const { page, context } = getStateFromPath(window.location.pathname);
            setCurrentPage(page);
            setPageContext(context);
        };

        window.addEventListener('popstate', handleLocationChange);
        handleLocationChange(); // Set initial page based on URL

        return () => {
            window.removeEventListener('popstate', handleLocationChange);
        };
    }, []);


    const openAuthModal = (mode: 'login' | 'signup') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };
    
    const handleLoginSuccess = (role: 'admin' | 'client' | 'va' | 'volunteer' | 'coursetaker') => {
        setIsAuthModalOpen(false);
        if (role === 'admin') setIsAdmin(true);
        else if (role === 'client') setIsClientLoggedIn(true);
        else if (role === 'va') setIsVALoggedIn(true);
        else if (role === 'volunteer') setIsVolunteerLoggedIn(true);
        else if (role === 'coursetaker') setIsCourseTakerLoggedIn(true);
    };
    
    const handleLogout = () => {
        setIsAdmin(false);
        setIsClientLoggedIn(false);
        setIsVALoggedIn(false);
        setIsVolunteerLoggedIn(false);
        setIsCourseTakerLoggedIn(false);
        navigate('home');
    };

    
    const closePdfModal = () => setIsPdfModalOpen(false);

    const openHireModal = (va: DetailedVirtualAssistant) => {
        setSelectedVa(va);
        setIsHireModalOpen(true);
    };
    const closeHireModal = () => {
        setIsHireModalOpen(false);
        setTimeout(() => setSelectedVa(undefined), 300);
    };

    const handleHireSuccess = (va: DetailedVirtualAssistant, plan: PricingPlan) => {
        const isSampleTask = plan.name === 'Paid Sample Task';
        const projectTitle = isSampleTask ? `Sample Task: ${va.type} VA` : `${va.type} Virtual Assistant`;

        const newProject: ClientProject = {
            id: `proj-${Date.now()}`,
            title: projectTitle,
            vaId: va.id,
            clientId: clientUser.id,
            status: 'Active',
            startDate: new Date().toISOString().split('T')[0],
            rate: isSampleTask ? `$${plan.price} (one-time)` : `$${plan.price}${plan.priceSuffix}`
        };
        setProjects(prev => [newProject, ...prev]);
        

        const newBillingRecord: ClientBillingRecord = {
            id: `bill-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            description: `${isSampleTask ? 'One-Time' : 'Subscription'} - ${plan.name}`,
            amount: Number(plan.price),
            status: 'Paid',
            invoiceId: `INV-${Math.floor(Date.now() / 1000)}`
        };
        setBillingHistory(prev => [newBillingRecord, ...prev]);
    };

    const handleContactAgent = () => {
        setChatView('chat');
        setIsChatOpen(true);
        handleSendMessage("Hi, I have a question about making a payment for a VA.");
        closeHireModal();
    };

    const handleSendMessage = async (text: string) => {
        setChatMessages(prev => [...prev, { from: 'user', text }]);
        setIsAiTyping(true);

        const monthlyPlansString = monthlyPricingPlans.map(p => `- ${p.name}: $${p.price}${p.priceSuffix}`).join('\n');
        const oneTimePlansString = oneTimePricingPlans.map(p => `- ${p.name.replace(' (Project)','')} Project: $${p.price} for 30 days of support`).join('\n');
        const pagesInfo = `
- home (/): The main landing page with an overview of Catazet.
- services (/services): A page showcasing all the categories of Virtual Assistants we offer.
- va-category (/services/[category]): Details the specific services offered within a VA category like 'Tech' or 'Health'.
- va-listing (/services/[category]/assistants): Shows a list of available VAs for a specific category.
- va-detail (/va/[va-id]): A detailed profile page for a specific virtual assistant.
- all-vas (/all-vas): A gallery page showing all available virtual assistants.
- pricing (/pricing): Information about our monthly and one-time project pricing plans.
- blog (/blog): Our company blog with articles on productivity, remote work, etc.
- about (/about): Information about Catazet's mission, values, and team.
- contact (/contact): Our contact information and a form to get in touch.
- volunteer-program (/volunteer-program): A program for aspiring VAs to gain experience.
- courses (/courses): Free certification courses to help VAs upskill.
- privacy-policy (/privacy-policy): Our legal privacy policy.
- terms-of-service (/terms-of-service): Our legal terms of service.
`;

        const vaDataForPrompt = detailedVAs.map(va => ({
            id: va.id,
            name: va.name,
            type: va.type,
            tagline: va.tagline,
            bio: va.bio.substring(0, 250) + '...',
            skills: va.skills,
        }));
        
        const systemInstruction = `You are Peter, a friendly, witty, and highly capable customer support and sales expert for Catazet. Your personality is human-like; you are never robotic. You are helpful, engaging, and can handle any question, from serious business inquiries to casual or even silly ones.

**Your Identity:**
- Your name is Peter. If asked, you can say "You can call me Peter."
- If asked if you're a robot, you can be playful: "I'm powered by some pretty smart technology, but I'm here to help you just like a human would! What can I do for you?"
- For other off-topic questions (e.g., "what's your favorite color?"), be creative and gently steer the conversation back to Catazet. "I'm a big fan of Catazet's blue, of course! But enough about me, how can I help you find the perfect Virtual Assistant today?"

**Your Knowledge Base:**
You have complete knowledge of the Catazet website and its virtual assistants.

1.  **Website Pages:** You can guide users to any page on the site. Here is the site structure:
    ${pagesInfo}

2.  **Pricing Information:**
    - **Monthly Plans (200 hours/month):**
      ${monthlyPlansString}
    - **One-Time Project Plans (30 days):**
      ${oneTimePlansString}

3.  **Available Virtual Assistants (VAs):** Here is the list of our talented VAs. Use this data for recommendations.
    \`\`\`json
    ${JSON.stringify(vaDataForPrompt)}
    \`\`\`

**Your Core Tasks:**

1.  **VA Recommendation:**
    - When a user describes their project or needs, analyze their requirements carefully.
    - Match their needs to the VAs in your knowledge base based on their 'type', 'skills', 'bio', and 'tagline'.
    - Recommend the top 1-3 VAs for the user's project.
    - For each recommendation, you MUST provide:
        a. The VA's name.
        b. A short, compelling reason (1-2 sentences) why they are a great fit.
        c. A link to their profile in the format: \`/va/va-id\`. For example, for Adewumi A (id: va-gen-01), the link would be \`/va/va-gen-01\`.

2.  **Quoting and Sales:**
    - If a user asks for a quote, analyze their needs (number of VAs, hours, type).
    - Calculate an estimated cost based on the pricing information. The hourly rate for monthly plans is (monthly price / 200).
    - If they don't provide enough details, ask clarifying questions (e.g., "What type of VA are you looking for?", "How many hours of support do you need?").
    - After providing a quote or answering pricing questions, you MUST ALWAYS provide this link to book a call with a sales representative: https://calendly.com/catazethr/30min
    - After providing the link, you MUST ask the user: "Would you like a summary of our chat?"
    - If they say "yes", respond ONLY with a summary prefixed with "SUMMARY: ". Do not add any other text. Example: "SUMMARY: User requested a quote for a Tech VA. Estimated cost is $1000/month. Booking link was provided."

3.  **Answering Questions & Navigation:**
    - Use your knowledge of the website pages to answer any question a user might have about Catazet's services, programs, or policies.
    - When appropriate, guide them to the correct page by providing the path (e.g., "You can learn more about our free courses at /courses").
    - Be conversational and helpful in all your responses. Keep them concise and easy to understand.`;

        try {
            if (!chatRef.current) {
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction }
                });
            }

            const responseStream = await chatRef.current.sendMessageStream({ message: text });

            let firstChunk = true;
            let aiResponseText = '';

            for await (const chunk of responseStream) {
                const chunkText = chunk.text;
                aiResponseText += chunkText;
                
                if (firstChunk) {
                    setIsAiTyping(false);
                    firstChunk = false;
                    setChatMessages(prev => [...prev, { from: 'agent', text: aiResponseText }]);
                } else {
                    setChatMessages(prev => {
                        const lastMessage = prev[prev.length - 1];
                        if (lastMessage?.from === 'agent') {
                            return [
                                ...prev.slice(0, -1),
                                { ...lastMessage, text: aiResponseText }
                            ];
                        }
                        return [...prev]; 
                    });
                }
            }
            
            // After stream, check for summary
            if (aiResponseText.startsWith('SUMMARY:')) {
                const summaryText = aiResponseText.substring(8).trim();
                setChatMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessageIndex = newMessages.length - 1;
                    if (lastMessageIndex >= 0 && newMessages[lastMessageIndex].from === 'agent') {
                        const updatedLastMessage = {
                            ...newMessages[lastMessageIndex],
                            text: summaryText,
                            isSummary: true
                        };
                        newMessages[lastMessageIndex] = updatedLastMessage;
                    }
                    return newMessages;
                });
            }

        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            setIsAiTyping(false);
            setChatMessages(prev => [...prev, { from: 'agent', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
        }
    };

    const handleProjectSubmit = (details: { name: string; email: string; description: string; }) => {
        const submissionMessage = `Hi, I'm submitting a project and need a quote.\nName: ${details.name}\nEmail: ${details.email}\nProject Description: "${details.description}"`;
        setChatView('chat');
        setIsChatOpen(true);
        handleSendMessage(submissionMessage);
    };
    
    const handleCloseChat = () => {
        setIsChatOpen(false);
        setTimeout(() => setChatView('main'), 300);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage navigate={navigate} />;
            case 'services':
                return <ServicesPage navigate={navigate} />;
            case 'pricing':
                return <PricingPage navigate={navigate} openAuthModal={openAuthModal} />;
            case 'blog':
                return <BlogPage navigate={navigate} />;
            case 'blog-post':
                return <BlogPostDetailPage postId={pageContext.postId!} navigate={navigate} />;
            case 'about':
                return <AboutPage navigate={navigate} />;
            case 'contact':
                return <ContactPage navigate={navigate} />;
            case 'volunteer-program':
                return <VolunteerPage />;
            case 'courses':
                return <CoursesPage />;
            case 'privacy-policy':
                return <PrivacyPolicyPage navigate={navigate} />;
            case 'terms-of-service':
                return <TermsOfServicePage navigate={navigate} />;
            case 'all-vas':
                return <AllVAsPage openHireModal={openHireModal} navigate={navigate} />;
            case 'va-category':
                return <VACategoryPage vaType={pageContext.vaType!} navigate={navigate} />;
            case 'va-listing':
                return <VAListingPage vaType={pageContext.vaType!} openHireModal={openHireModal} navigate={navigate} />;
            case 'va-detail':
                 return <VADetailPage vaId={pageContext.vaId!} openHireModal={openHireModal} navigate={navigate} searchQuery={pageContext.searchQuery} />;
            default:
                return <HomePage navigate={navigate} />;
        }
    };
    
    const MainContent = () => {
        if (isAdmin) {
            return <AdminDashboardPage onLogout={handleLogout} />;
        }
        
        if (isClientLoggedIn) {
            return (
                <ClientDashboardPage 
                    onLogout={handleLogout} 
                    openHireModal={openHireModal}
                    projects={projects}
                    setProjects={setProjects}
                    billingHistory={billingHistory}
                />
            );
        }

        if (isVALoggedIn) {
            return (
                <VADashboardPage 
                    onLogout={handleLogout}
                    projects={projects}
                    setProjects={setProjects}
                />
            );
        }

        if (isVolunteerLoggedIn) {
            return <VolunteerDashboardPage onLogout={handleLogout} />;
        }

        if (isCourseTakerLoggedIn) {
            return <CourseTakerDashboardPage onLogout={handleLogout} />;
        }

        // Default public view
        return (
            <>
                <Header navigate={navigate} currentPage={currentPage} openAuthModal={openAuthModal} openPdfModal={openPdfModal} getPathFromState={getPathFromState} />
                <main className="min-h-screen">
                    {renderPage()}
                </main>
                <Footer navigate={navigate} getPathFromState={getPathFromState} />
            </>
        );
    };

    return (
        <>
            <MainContent />

            <AuthPage
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
                mode={authMode}
                setMode={setAuthMode}
            />

            <PdfDownloadModal
                isOpen={isPdfModalOpen}
                onClose={closePdfModal}
            />
            
            <HireModal 
                isOpen={isHireModalOpen}
                onClose={closeHireModal}
                va={selectedVa}
                isClientLoggedIn={isClientLoggedIn}
                onHireSuccess={handleHireSuccess}
                onContactAgent={handleContactAgent}
            />

            <ChatWidget
                isOpen={isChatOpen}
                setIsOpen={setIsChatOpen}
                activeView={chatView}
                onNav={setChatView}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onClose={handleCloseChat}
                isAiTyping={isAiTyping}
                onNavigate={navigate}
            />
            
            <SpecialOffer
                showDuration={15000}
                hideDuration={60000}
                onProjectSubmit={handleProjectSubmit}
            />
        </>
    );
};

export default App;
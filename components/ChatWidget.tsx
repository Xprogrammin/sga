
import React, { useCallback, FormEvent, useRef, useEffect, useState } from 'react';
import { faqs, howItWorksSteps } from '../constants.tsx';
import type { HowItWorksStep, ChatMessage, View } from '../types.ts';
import { 
    MessageIcon, XIcon, ArrowLeftIcon, CalendarIcon, 
    ChatBubbleIcon, EnvelopeIcon, QuestionMarkCircleIcon, LoadingSpinnerIcon, CheckIcon 
} from './icons.tsx';

const viewTitles: Record<View, string> = {
    main: 'Get in touch',
    chat: 'Live Chat',
    message: 'Send a Message',
    faq: 'Help & FAQs',
};

const WidgetHeader: React.FC<{ title: string; onBack?: () => void; onClose: () => void }> = ({ title, onBack, onClose }) => (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="w-8">
            {onBack && (
                <button onClick={onBack} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
            )}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="w-8">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 transition-colors">
                <XIcon />
            </button>
        </div>
    </div>
);

const MainView: React.FC<{ onNav: (view: View) => void }> = ({ onNav }) => {
    const options = [
        {
            icon: <CalendarIcon className="w-6 h-6 text-primary-blue" />,
            title: 'Book a Call',
            description: 'Schedule a meeting with us.',
            action: () => window.open('https://calendly.com/catazethr/30min', '_blank'),
            isLink: true,
        },
        {
            icon: <ChatBubbleIcon className="w-6 h-6 text-primary-blue" />,
            title: 'Live Chat',
            description: 'Chat with a support agent.',
            action: () => onNav('chat'),
        },
        {
            icon: <EnvelopeIcon className="w-6 h-6 text-primary-blue" />,
            title: 'Send a Message',
            description: 'Get a reply in your inbox.',
            action: () => onNav('message'),
        },
        {
            icon: <QuestionMarkCircleIcon className="w-6 h-6 text-primary-blue" />,
            title: 'FAQ',
            description: 'Find quick answers.',
            action: () => onNav('faq'),
        },
    ];

    return (
        <div className="space-y-3">
            {options.map((opt) => {
                const content = (
                    <div className="flex items-center gap-4 w-full">
                        <div className="bg-accent-light-blue p-3 rounded-lg">{opt.icon}</div>
                        <div className="text-left">
                            <h4 className="font-semibold text-gray-800">{opt.title}</h4>
                            <p className="text-sm text-gray-500">{opt.description}</p>
                        </div>
                    </div>
                );
                
                if (opt.isLink) {
                    return <a key={opt.title} href="#" onClick={(e) => { e.preventDefault(); opt.action(); }} className="block p-3 rounded-xl hover:bg-gray-50 transition-colors">{content}</a>;
                }
                
                return <button key={opt.title} onClick={opt.action} className="block w-full p-3 rounded-xl hover:bg-gray-50 transition-colors">{content}</button>;
            })}
        </div>
    );
};

interface FormattedMessageProps {
    text: string;
    from: 'user' | 'agent';
    onNavigate: (page: string, context: any) => void;
}

const FormattedMessage: React.FC<FormattedMessageProps> = ({ text, from, onNavigate }) => {
    const parts = text.split(/(\*\*.*?\*\*|https?:\/\/\S+|\/[a-zA-Z0-9\/-]+)/g).filter(Boolean);

    const linkClassName = from === 'user'
        ? 'text-white font-bold underline hover:opacity-80 transition-opacity'
        : 'text-primary-blue underline hover:opacity-80 transition-opacity';
    
    const internalLinkClassName = from === 'user'
        ? 'text-white font-bold underline hover:opacity-80 transition-opacity cursor-pointer'
        : 'text-primary-blue underline hover:opacity-80 transition-opacity cursor-pointer';

    const handleInternalNav = (e: React.MouseEvent, path: string) => {
        e.preventDefault();

        const vaDetailMatch = path.match(/^\/va\/(va-[a-z]+-\d+)$/);
        if (vaDetailMatch) {
            const vaId = vaDetailMatch[1];
            onNavigate('va-detail', { vaId });
            return;
        }

        const simplePath = path.startsWith('/') ? path.substring(1) : path;
        const validPages = ['home', 'services', 'pricing', 'blog', 'about', 'contact', 'volunteer-program', 'courses', 'privacy-policy', 'terms-of-service', 'all-vas'];
        if (validPages.includes(simplePath)) {
            onNavigate(simplePath, {});
        }
    };
    
    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={index}>{part.slice(2, -2)}</strong>;
                }
                if (part.match(/^https?:\/\/\S+$/)) {
                    return (
                        <a href={part} target="_blank" rel="noopener noreferrer" className={linkClassName} key={index}>
                            {part}
                        </a>
                    );
                }
                if (part.startsWith('/')) {
                     return (
                         <a href={part} onClick={(e) => handleInternalNav(e, part)} className={internalLinkClassName} key={index}>
                             {part}
                         </a>
                     );
                }
                return part;
            })}
        </>
    );
};

const ChatView: React.FC<{ messages: ChatMessage[]; onSend: (text: string) => void; isAiTyping: boolean; onNavigate: (page: string, context?: any) => void; }> = ({ messages, onSend, isAiTyping, onNavigate }) => {
    const [input, setInput] = useState('');
    const [copied, setCopied] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isAiTyping]);

    const handleSend = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSend(input.trim());
            setInput('');
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        });
    };

    const createMailtoLink = (text: string) => {
        const email = 'info@catazet.com';
        const subject = 'Chat Summary from Catazet Website';
        const body = `Here is a summary of my chat with Catazet's AI Assistant:\n\n---\n\n${text}\n\n---`;
        return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="flex-grow space-y-2 overflow-y-auto p-4">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`whitespace-pre-wrap max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl ${msg.from === 'user' ? 'bg-primary-blue text-white rounded-br-lg' : 'bg-gray-200 text-gray-800 rounded-bl-lg'}`}>
                           <FormattedMessage text={msg.text} from={msg.from} onNavigate={onNavigate} />
                        </div>
                         {msg.from === 'agent' && msg.isSummary && (
                            <div className="mt-2 p-3 bg-gray-100 rounded-xl border w-full max-w-xs lg:max-w-sm">
                                <p className="text-xs font-semibold text-gray-700 mb-2">Summary Actions:</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleCopy(msg.text)}
                                        className={`flex-1 text-xs font-semibold py-1.5 px-3 rounded-md transition-colors ${copied ? 'bg-green-100 text-green-700' : 'bg-white hover:bg-gray-50 border'}`}
                                    >
                                        {copied ? 'Copied!' : 'Copy Summary'}
                                    </button>
                                    <a
                                        href={createMailtoLink(msg.text)}
                                        className="flex-1 text-center text-xs font-semibold py-1.5 px-3 rounded-md bg-primary-blue text-white hover:opacity-90 transition-opacity"
                                    >
                                        Email to Catazet
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {isAiTyping && (
                    <div className="flex justify-start">
                        <div className="whitespace-pre-wrap max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl bg-gray-200 text-gray-800 rounded-bl-lg">
                           <div className="flex items-center justify-center gap-1.5 h-5">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse"></span>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSend} className="flex-shrink-0 flex items-center gap-2 p-3 border-t border-gray-200">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/50"
                />
                <button type="submit" className="bg-primary-blue text-white font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity flex-shrink-0 text-sm">Send</button>
            </form>
        </div>
    );
};

const MessageView: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({...prev, [e.target.id]: e.target.value}));
    };

    const encode = (data: { [key: string]: any }) => {
        return Object.keys(data)
            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
            .join("&");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encode({ "form-name": "contact-widget", ...formData })
        })
        .then(() => {
            setSent(true);
        })
        .catch(error => {
            alert("Error: " + error);
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };

    if (sent) {
        return (
            <div className="text-center py-10 animate-fade-in-up">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckIcon className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800">Thank You!</h4>
                <p className="text-gray-600 mt-2">Thanks, your message has been submitted.</p>
            </div>
        );
    }

    return (
        <form name="contact-widget" data-netlify="true" onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="form-name" value="contact-widget" />
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-blue/50 focus:border-primary-blue/50" value={formData.name} onChange={handleInputChange} />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-blue/50 focus:border-primary-blue/50" value={formData.email} onChange={handleInputChange} />
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" rows={4} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-blue/50 focus:border-primary-blue/50" value={formData.message} onChange={handleInputChange}></textarea>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-primary-blue text-white font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isSubmitting ? (
                    <>
                        <LoadingSpinnerIcon className="w-5 h-5 mr-2" />
                        Sending...
                    </>
                ) : 'Send Message'}
            </button>
        </form>
    );
};

const FaqView: React.FC = () => (
    <div className="space-y-8">
        <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">How It Works</h4>
            <div className="space-y-4">
                {howItWorksSteps.map((step: HowItWorksStep) => (
                    <div key={step.step} className="flex gap-4">
                        <div className="flex-shrink-0 bg-primary-blue text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">{step.step}</div>
                        <div>
                            <h5 className="font-semibold text-gray-700">{step.title}</h5>
                            <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <h4 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Frequently Asked Questions</h4>
            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <div key={i}>
                        <h5 className="font-semibold text-gray-700">{faq.question}</h5>
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


export const ChatWidget: React.FC<{
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    activeView: View;
    onNav: (view: View) => void;
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    onClose: () => void;
    isAiTyping: boolean;
    onNavigate: (page: string, context?: any) => void;
}> = ({ isOpen, setIsOpen, activeView, onNav, messages, onSendMessage, onClose, isAiTyping, onNavigate }) => {

    const goBack = () => onNav('main');

    return (
        <div className="fixed bottom-5 right-5 lg:bottom-8 lg:right-8 z-50">
            {/* Widget Pop-up */}
            <div
                className={`
                    absolute bottom-[calc(100%+1rem)] right-0
                    bg-white rounded-2xl shadow-2xl w-[calc(100vw-40px)] max-w-sm h-[70vh] max-h-[600px] 
                    flex flex-col origin-bottom-right
                    transition-all duration-300 ease-in-out
                    ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}
                `}
                aria-hidden={!isOpen}
            >
               <WidgetHeader 
                    title={viewTitles[activeView]} 
                    onBack={activeView !== 'main' ? goBack : undefined} 
                    onClose={onClose} 
                />
                <div className={`flex-grow ${activeView === 'chat' ? 'overflow-hidden' : 'overflow-y-auto p-6'}`}>
                    {activeView === 'main' && <MainView onNav={onNav} />}
                    {activeView === 'chat' && <ChatView messages={messages} onSend={onSendMessage} isAiTyping={isAiTyping} onNavigate={onNavigate} />}
                    {activeView === 'message' && <MessageView />}
                    {activeView === 'faq' && <FaqView />}
                </div>
            </div>
            
            {/* Floating Button */}
            <button 
                onClick={() => setIsOpen(true)}
                className={`
                    bg-primary-blue text-white w-16 h-16 rounded-full flex items-center justify-center 
                    shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform
                    ${isOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100 hover:scale-110'}
                `}
                aria-label="Open chat widget"
            >
               <ChatBubbleIcon className="w-8 h-8"/>
            </button>
        </div>
    );
};

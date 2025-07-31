import React, { useState, useMemo, useRef, FormEvent } from 'react';
import { VASidebar } from './VASidebar.tsx';
import { Modal } from './Modal.tsx';
import { 
    vaStats as initialVaStats,
    vaUser,
    vaMessageThreads as initialVaMessageThreads,
    vaPayoutHistory,
    detailedVAs,
    clientUser
} from '../constants.tsx';
import type { 
    VAView,
    VAStat,
    ProjectStatus,
    ClientProject,
    PayoutStatus,
    VAPayoutRecord,
    ClientMessageThread,
    ClientMessage
} from '../types.ts';
import { 
    MenuIcon, SendIcon, DownloadIcon, StarIcon, PhoneIcon, VideoIcon, PaperclipIcon, MicrophoneIcon, FileIcon, ImageIcon, SearchIcon, WalletIcon, ActivityIcon, DollarSignIcon, ChatBubbleIcon, ArrowLeftIcon, LoadingSpinnerIcon
} from './icons.tsx';

interface VADashboardPageProps {
    onLogout: () => void;
    projects: ClientProject[];
    setProjects: React.Dispatch<React.SetStateAction<ClientProject[]>>;
}

export const VADashboardPage: React.FC<VADashboardPageProps> = ({ onLogout, projects, setProjects }) => {
    const [activeView, setActiveView] = useState<VAView>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Wallet and Modal State
    const [walletBalance, setWalletBalance] = useState(vaPayoutHistory
        .filter(e => e.status === 'Paid')
        .reduce((sum, e) => sum + e.amount, 0));
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    
    const activeProjects = useMemo(() => projects.filter(p => p.vaId === vaUser.id && p.status === 'Active'), [projects]);
    const pendingEarnings = useMemo(() => activeProjects.length * 400, [activeProjects]);


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

    const VAStatCard: React.FC<{ stat: VAStat, index: number }> = ({ stat, index }) => (
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

    const PayoutStatusBadge: React.FC<{ status: PayoutStatus }> = ({ status }) => {
        const styles: Record<PayoutStatus, string> = {
            'Paid': 'bg-green-100 text-green-800',
            'Processing': 'bg-blue-100 text-blue-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
    };


    // =======================
    // View Components
    // =======================

    const VAWalletCard: React.FC<{ balance: number, pending: number, onWithdraw: () => void }> = ({ balance, pending, onWithdraw }) => (
        <div className="bg-gray-800 text-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-white/5 rounded-full"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <WalletIcon className="w-8 h-8"/>
                        <p className="text-lg font-semibold">My Wallet</p>
                    </div>
                    <p className="text-4xl font-bold mt-2">${balance.toFixed(2)}</p>
                    <p className="text-gray-300 text-sm">Available for withdrawal</p>
                </div>
                <div className="md:text-right">
                    <p className="text-2xl font-bold text-green-400">${pending.toFixed(2)}</p>
                    <p className="text-gray-300 text-sm">Pending for next payout (24th)</p>
                     <button 
                        onClick={onWithdraw} 
                        className="mt-4 bg-white text-gray-800 font-bold py-2.5 px-6 rounded-lg hover:bg-gray-200 transition-colors shadow-md text-sm"
                    >
                        Withdraw Funds
                    </button>
                </div>
            </div>
        </div>
    );

    const DashboardView: React.FC = () => {
        const dashboardStats = useMemo(() => {
            const unreadMessages = initialVaMessageThreads.reduce((sum, thread) => sum + thread.unreadCount, 0);

            return [
                { title: 'Active Clients', value: activeProjects.length.toString(), icon: <ActivityIcon className="w-6 h-6"/> },
                { title: 'Avg. Rating', value: initialVaStats.find(s => s.title === 'Avg. Rating')?.value || 'N/A', icon: <StarIcon className="w-6 h-6 text-yellow-400 fill-current"/> },
                { title: "Next Payout (Est.)", value: `$${pendingEarnings.toFixed(2)}`, icon: <DollarSignIcon className="w-6 h-6"/> },
                { title: 'Unread Messages', value: unreadMessages.toString(), icon: <ChatBubbleIcon className="w-6 h-6"/> }
            ];
        }, [activeProjects, pendingEarnings]);
        
        return (
            <>
                <DashboardHeader title={`Welcome back, ${vaUser.name.split(' ')[0]}!`} subtitle="Here's a summary of your work today." />
                
                <VAWalletCard balance={walletBalance} pending={pendingEarnings} onWithdraw={() => setIsWithdrawModalOpen(true)} />

                <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardStats.map((stat, index) => <VAStatCard key={stat.title} stat={stat} index={index}/>)}
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* My Projects */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">Active Projects</h3>
                        <div className="space-y-4">
                            {activeProjects.slice(0, 3).map(proj => (
                                <div key={proj.id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">{proj.title}</p>
                                        <p className="text-sm text-gray-500">with {clientUser.name}</p>
                                    </div>
                                    <button onClick={() => setActiveView('projects')} className="text-sm font-semibold text-primary-blue hover:underline">View</button>
                                </div>
                            ))}
                             {activeProjects.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No active projects right now.</p>}
                        </div>
                    </div>
                    {/* Recent Messages */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">Recent Messages</h3>
                        <div className="space-y-4">
                            {initialVaMessageThreads.slice(0, 2).map(thread => (
                                 <div key={thread.id} className="flex items-center gap-4">
                                    <img src={thread.vaImageUrl} alt={thread.vaName} className="w-10 h-10 rounded-full"/>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <p className="font-semibold text-sm">{thread.vaName}</p>
                                            <p className="text-xs text-gray-400">{thread.lastMessageTimestamp}</p>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">{thread.lastMessage}</p>
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

    const ProjectsView: React.FC = () => {
        const myProjects = projects.filter(p => p.vaId === vaUser.id);
        const getClientName = (clientId?: string) => {
            // In a real app, you'd look up other clients.
            return clientUser.name;
        }

        const handleMarkDelivered = (projectId: string) => {
            setProjects(projects.map(p => p.id === projectId ? { ...p, status: 'Delivered' } : p));
        };

        return (
            <>
                <DashboardHeader title="My Projects" subtitle="Manage your ongoing and completed projects." />
                <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Project / Client</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Start Date</th>
                                <th className="p-4">Client Rate</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {myProjects.map(proj => (
                                <tr key={proj.id}>
                                    <td className="p-4">
                                        <p className="font-semibold text-gray-800">{proj.title}</p>
                                        <p className="text-gray-500">{getClientName(proj.clientId)}</p>
                                    </td>
                                    <td className="p-4"><ProjectStatusBadge status={proj.status}/></td>
                                    <td className="p-4 text-gray-600">{proj.startDate}</td>
                                    <td className="p-4 text-gray-600 font-medium">{proj.rate}</td>
                                    <td className="p-4 text-center">
                                         {proj.status === 'Active' ? (
                                            <button onClick={() => handleMarkDelivered(proj.id)} className="bg-blue-500 text-white font-semibold text-xs py-1 px-3 rounded-md hover:bg-blue-600 transition-colors">Mark as Delivered</button>
                                        ) : proj.status === 'Delivered' ? (
                                            <span className="text-sm text-yellow-600 font-semibold italic">Pending Approval</span>
                                        ) : (
                                            <button className="text-primary-blue font-semibold hover:underline text-xs">Chat with Client</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                             {myProjects.length === 0 && (
                                <tr><td colSpan={5} className="text-center p-8 text-gray-500">You have no assigned projects.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };

    const MessagesView: React.FC = () => {
        const [allThreads] = useState(initialVaMessageThreads);
        const [searchTerm, setSearchTerm] = useState('');
        const [activeThread, setActiveThread] = useState<ClientMessageThread | null>(null);
        const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
        const [messageInput, setMessageInput] = useState('');
        const fileInputRef = React.useRef<HTMLInputElement>(null);

        const filteredThreads = useMemo(() => {
            if (!searchTerm) return allThreads;
            return allThreads.filter(thread => thread.vaName.toLowerCase().includes(searchTerm.toLowerCase()));
        }, [allThreads, searchTerm]);

        const handleSendMessage = () => {
            if (messageInput.trim() && activeThread) {
                console.log(`Sending message to ${activeThread.vaName}: ${messageInput}`);
                // This is a mock. In a real app, this would update state via a state setter prop.
                setMessageInput('');
            }
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
                <DashboardHeader title="Messages" subtitle="Communicate directly with your assigned clients." />
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 h-[75vh]">
                    <div className={`${mobileView === 'chat' && 'hidden'} md:flex md:col-span-1 lg:col-span-1 bg-white rounded-xl shadow-sm border p-2 flex-col h-full`}>
                        <div className="p-2 flex-shrink-0"><div className="relative"><SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search chats..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-gray-50 border-gray-200 border rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-primary-blue/50 focus:border-primary-blue/50"/></div></div>
                        <div className="space-y-1 overflow-y-auto flex-grow">{filteredThreads.map(thread => (<button key={thread.id} onClick={() => handleSelectThread(thread)} className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${activeThread?.id === thread.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}><img src={thread.vaImageUrl} alt={thread.vaName} className="w-12 h-12 rounded-full"/><div className="flex-1 overflow-hidden"><p className="font-semibold text-sm text-gray-800 truncate">{thread.vaName}</p><p className="text-sm text-gray-500 truncate">{thread.lastMessage}</p></div></button>))}</div>
                    </div>
                    
                    <div className={`${mobileView === 'list' && 'hidden'} md:flex md:col-span-2 lg:col-span-3 bg-white rounded-xl shadow-sm border flex-col h-full`}>
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
                                    <button onClick={() => alert("Starting video call...")} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"><VideoIcon className="w-5 h-5"/></button>
                                </div>
                            </div>
                            <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-white">{activeThread.messages.map(msg => (<div key={msg.id} className={`flex items-end gap-3 ${msg.from === 'va' ? 'justify-end' : 'justify-start'}`}>{msg.from === 'client' && <img src={activeThread.vaImageUrl} className="w-8 h-8 rounded-full" />}<div className={`max-w-md ${msg.content.type === 'text' ? `px-4 py-2 rounded-2xl text-sm shadow-sm ${msg.from === 'va' ? 'bg-primary-blue text-white' : 'bg-gray-200 text-gray-800'}` : ''}`}>{renderMessageContent(msg)}</div>{msg.from === 'va' && <img src={vaUser.avatarUrl} className="w-8 h-8 rounded-full" />}</div>))}</div>
                            <div className="p-4 border-t bg-gray-50 flex items-center gap-2"><input type="file" ref={fileInputRef} className="hidden" onChange={() => alert("File selected!")}/><button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"><PaperclipIcon className="w-5 h-5"/></button><button onClick={() => alert("Recording voice note...")} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"><MicrophoneIcon className="w-5 h-5"/></button><input type="text" value={messageInput} onChange={e => setMessageInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Type your message..." className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue/50 text-sm"/><button onClick={handleSendMessage} className="bg-primary-blue text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 flex items-center justify-center shadow-sm"><SendIcon className="w-5 h-5"/></button></div>
                        </>
                        ) : (
                            <div className="hidden md:flex items-center justify-center h-full"><p className="text-gray-500">Select a conversation to start messaging.</p></div>
                        )}
                    </div>
                </div>
            </>
        );
    };

    const PayoutsView: React.FC = () => (
        <>
            <DashboardHeader title="My Payouts" subtitle="View your monthly payout history."/>
            <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Payout Date</th>
                            <th className="p-4">Month</th>
                            <th className="p-4">Active Clients</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {vaPayoutHistory.map(record => (
                            <tr key={record.id}>
                                <td className="p-4 text-gray-600 font-semibold">{record.payoutDate}</td>
                                <td className="p-4 text-gray-800">{record.month}</td>
                                <td className="p-4 text-gray-600 font-medium">{record.clients}</td>
                                <td className="p-4 text-gray-800 font-mono font-bold">${record.amount.toFixed(2)}</td>
                                <td className="p-4"><PayoutStatusBadge status={record.status}/></td>
                                <td className="p-4 text-right text-gray-500 font-mono text-xs">{record.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const ProfileView: React.FC = () => {
        const myProfile = detailedVAs.find(v => v.id === vaUser.id);
        const [profileData, setProfileData] = useState<typeof myProfile | undefined>(myProfile);

        if (!profileData) return <div>Profile not found.</div>;

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setProfileData({...profileData, [e.target.name]: e.target.value });
        }

        return (
            <>
                <DashboardHeader title="My Public Profile" subtitle="This is how clients see you on Catazet. Keep it updated!" />
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                         <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                            <img src={profileData.imageUrl} alt={profileData.name} className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg"/>
                            <h3 className="text-2xl font-bold mt-2">{profileData.name}</h3>
                            <p className="text-primary-blue font-semibold">{profileData.type} Virtual Assistant</p>
                            <div className="mt-4 flex justify-center items-center gap-1">
                                <StarIcon className="w-5 h-5 text-yellow-400"/>
                                <span className="font-bold text-lg">{profileData.stats.rating}</span>
                                <span className="text-sm text-gray-500">({profileData.stats.projectsCompleted} projects)</span>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
                        <form className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Tagline</label>
                                <input type="text" name="tagline" value={profileData.tagline} onChange={handleInputChange} className="mt-1 w-full p-2 border rounded-md"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-600">Bio</label>
                                <textarea name="bio" value={profileData.bio} onChange={handleInputChange} rows={5} className="mt-1 w-full p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Skills (comma-separated)</label>
                                <input type="text" value={profileData.skills.join(', ')} onChange={e => setProfileData({...profileData, skills: e.target.value.split(',').map(s => s.trim())})} className="mt-1 w-full p-2 border rounded-md"/>
                            </div>
                            <button type="button" onClick={() => alert("Profile Saved!")} className="bg-primary-blue text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90">Save Changes</button>
                        </form>
                    </div>
                </div>
            </>
        );
    };

    const handleWithdraw = (amount: number) => {
        setWalletBalance(prev => prev - amount);
        // You might add a new record to a withdrawal history here
        alert(`Successfully initiated withdrawal of $${amount.toFixed(2)}.`);
    };
    
    const renderView = () => {
        switch (activeView) {
            case 'dashboard': return <DashboardView />;
            case 'projects': return <ProjectsView />;
            case 'messages': return <MessagesView />;
            case 'payouts': return <PayoutsView />;
            case 'profile': return <ProfileView />;
            default: return <DashboardView />;
        }
    };
    
    const WithdrawModal: React.FC = () => {
        const [amount, setAmount] = useState('');
        const [error, setError] = useState('');
        
        const handleFormSubmit = (e: FormEvent) => {
            e.preventDefault();
            const withdrawAmount = parseFloat(amount);
            if(isNaN(withdrawAmount) || withdrawAmount <= 0) {
                setError("Please enter a valid amount.");
                return;
            }
            if(withdrawAmount > walletBalance) {
                setError("Withdrawal amount cannot exceed your balance.");
                return;
            }
            handleWithdraw(withdrawAmount);
            setIsWithdrawModalOpen(false);
            setAmount('');
            setError('');
        };

        return (
            <Modal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} title="Withdraw Funds">
                 <div className="flex justify-center items-center gap-2 mb-4">
                    <img src="/assets/logo/Catazetlogomain.png" alt="Catazet Logo" className="h-8 w-auto" />
                    <span className="text-2xl font-poppins font-extrabold text-primary-blue">Catazet</span>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (USD)</label>
                        <p className="text-xs text-gray-500">Available: ${walletBalance.toFixed(2)}</p>
                        <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 w-full p-2 border rounded-md" placeholder="e.g., 100.00" min="1" step="0.01" required/>
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                     <div>
                        <label htmlFor="method" className="block text-sm font-medium text-gray-700">Withdrawal Method</label>
                        <select id="method" className="mt-1 w-full p-2 border rounded-md bg-gray-50">
                            <option>Bank Transfer (ending in ••••1234)</option>
                            <option>PayPal (va@example.com)</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-primary-blue text-white font-semibold py-2 rounded-lg hover:opacity-90">Confirm Withdrawal</button>
                </form>
            </Modal>
        );
    }
    
    return (
        <div className="bg-gray-50 font-sans text-gray-900 flex min-h-screen">
            <VASidebar 
                activeView={activeView}
                setActiveView={setActiveView}
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
                        {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
                    </h1>
                    <div className="w-6 h-6"></div>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>
            <WithdrawModal />
        </div>
    );
};
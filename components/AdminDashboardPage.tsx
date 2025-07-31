
import React, { useState, useMemo, useEffect, useRef, Fragment } from 'react';
import { AdminSidebar } from './AdminSidebar.tsx';
import { StatCard } from './StatCard.tsx';
import { 
    adminStats as initialStats, 
    adminPages as initialPages, 
    adminUsers as initialUsers, 
    adminPayments as initialPayments, 
    adminMedia as initialMedia, 
    blogPosts as initialBlogPosts,
    faqs as initialFaqs,
    blogComments as initialBlogComments,
    adminNavLinks as initialAdminNavLinks,
    whyChooseUsItems,
} from '../constants.tsx';
import type { AdminView, AdminUser, UserStatus, UserRole, AdminPayment, PaymentStatus, AdminMediaFile, AdminPageContent, BlogPost, Faq, AdminNavLink, FeatureItem, Comment } from '../types.ts';
import { ToggleSwitch } from './ToggleSwitch.tsx';
import { 
    ChevronUpIcon, ChevronDownIcon, SearchIcon, DotsVerticalIcon, EditIcon, TrashIcon, 
    FileIcon, VideoIcon, ImageIcon, UploadIcon, PlusIcon, XIcon, ChatBubbleIcon, 
    EnvelopeIcon, QuestionMarkCircleIcon, SendIcon, MenuIcon, PaletteIcon, SparklesIcon,
    WhyVettedTalentIcon, WhyDedicatedSupportIcon, WhyCostEffectiveIcon, WhyGlobalReachIcon, LoadingSpinnerIcon
} from './icons.tsx';
import { GoogleGenAI } from '@google/genai';

// =======================
// MOCK DATA FOR NEW SECTIONS
// =======================
const mockInboxMessages = [
    { id: 'msg1', fromName: 'John Doe', fromEmail: 'john.d@example.com', subject: 'Inquiry about Tech VAs', body: 'Hello, I would like to know more about your Tech VA services. Can someone reach out to me?', date: '2024-07-23 10:00 AM', read: false },
    { id: 'msg2', fromName: 'Jane Smith', fromEmail: 'jane.s@startup.com', subject: 'One-Time Project Quote', body: 'We have a one-time project for data entry and need a quote. The project involves about 500 records.', date: '2024-07-23 09:30 AM', read: true },
];

const mockLiveChats = [
    { id: 'chat1', visitorId: 'Visitor #3459', messages: [{ from: 'visitor', text: 'Hi, I need help with my subscription.', timestamp: Date.now() - 20000 }], status: 'active' },
    { id: 'chat2', visitorId: 'Visitor #8210', messages: [{ from: 'visitor', text: 'Can you tell me more about the security VAs?', timestamp: Date.now() - 60000 }], status: 'active' },
];

// =======================
// TYPES
// =======================
type ModalType = 'edit-user' | 'create-user' | 'edit-page' | 'create-page' | 'edit-post' | 'create-post' | 'edit-faq' | 'create-faq';
interface ModalConfig {
  isOpen: boolean;
  type: ModalType | null;
  data?: any;
}
interface DeletionConfig {
    isOpen: boolean;
    type: 'user' | 'page' | 'post' | 'faq' | 'media' | null;
    id: number | string | null;
    name: string;
}

interface EditableWhyChooseUsItem {
    title: string;
    description: string;
    icon: string; // Icon name as string or blob URL
}

const formFieldsMap = {
    'user': [{ name: 'name', label: 'Full Name', type: 'text' },{ name: 'email', label: 'Email', type: 'email' },{ name: 'role', label: 'Role', type: 'select', options: ['Virtual Assistant', 'Volunteer', 'Course Taker', 'Client', 'Admin'] },],
    'page': [{ name: 'title', label: 'Page Title', type: 'text' },{ name: 'status', label: 'Status', type: 'select', options: ['Published', 'Draft'] },],
    'post': [{ name: 'title', label: 'Post Title', type: 'text' },{ name: 'excerpt', label: 'Excerpt', type: 'textarea' },{ name: 'author', label: 'Author', type: 'text' },{ name: 'category', label: 'Category', type: 'text' },],
    'faq': [{ name: 'question', label: 'Question', type: 'text' },{ name: 'answer', label: 'Answer', type: 'textarea' },]
};

// Initialize the GoogleGenAI client once
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// =======================
// Reusable Components
// =======================

const AdminHeader: React.FC<{ title: string; subtitle: string; children?: React.ReactNode }> = ({ title, subtitle, children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="mt-4 sm:mt-0 flex-shrink-0">{children}</div>
    </div>
);

const StatusBadge: React.FC<{ status: UserStatus | PaymentStatus | 'Published' | 'Draft' }> = ({ status }) => {
    const styles: { [key: string]: string } = {
        'Active': 'bg-green-100 text-green-800',
        'Suspended': 'bg-red-100 text-red-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Paid': 'bg-green-100 text-green-800',
        'Failed': 'bg-red-100 text-red-800',
        'Refunded': 'bg-gray-100 text-gray-800',
        'Published': 'bg-green-100 text-green-800',
        'Draft': 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};


// =======================
// Main Component
// =======================

export const AdminDashboardPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Data states
    const [users, setUsers] = useState<AdminUser[]>(initialUsers);
    const [pages, setPages] = useState<AdminPageContent[]>(initialPages);
    const [posts, setPosts] = useState<BlogPost[]>(initialBlogPosts);
    const [media, setMedia] = useState<AdminMediaFile[]>(initialMedia);
    const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
    const [comments, setComments] = useState<Comment[]>(initialBlogComments);
    const [inbox, setInbox] = useState(mockInboxMessages);
    const [liveChats, setLiveChats] = useState(mockLiveChats);
    
    // UI states
    const [modalConfig, setModalConfig] = useState<ModalConfig>({ isOpen: false, type: null, data: undefined });
    const [deletionConfig, setDeletionConfig] = useState<DeletionConfig>({ isOpen: false, type: null, id: null, name: '' });
    const [activeActionMenu, setActiveActionMenu] = useState<number | string | null>(null);

    // Update nav links to include new sections
    const allAdminNavLinks: AdminNavLink[] = useMemo(() => {
        const newLinks: AdminNavLink[] = [
            { id: 'ai-studio', name: 'AI Studio', icon: <SparklesIcon /> },
            { id: 'comments', name: 'Comments', icon: <ChatBubbleIcon /> },
            { id: 'messages', name: 'Messages', icon: <EnvelopeIcon /> },
            { id: 'chat', name: 'Live Chat', icon: <ChatBubbleIcon /> },
            { id: 'faq', name: 'FAQ', icon: <QuestionMarkCircleIcon /> },
        ];
        
        const combinedLinks = [
            ...initialAdminNavLinks,
            ...newLinks,
        ];

        return combinedLinks.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
    }, []);

    // =======================
    // Handlers
    // =======================

    const handleSave = (item: any, type: 'user' | 'page' | 'post' | 'faq') => {
        const isNew = !item.id;
        const collections = {
            user: { state: users, setter: setUsers },
            page: { state: pages, setter: setPages },
            post: { state: posts, setter: setPosts },
            faq: { state: faqs, setter: setFaqs },
        };
        const { state, setter } = collections[type];
        
        if (isNew) {
            const newItem = { ...item, id: type === 'faq' ? state.length : Date.now() }; // FAQ doesn't have a real ID
             // @ts-ignore
            setter([newItem, ...state]);
        } else {
             // @ts-ignore
            setter(state.map(i => i.id === item.id ? item : i));
        }
        setModalConfig({ isOpen: false, type: null });
    };

    const confirmDelete = () => {
        if (!deletionConfig.type || deletionConfig.id === null) return;
        
        const collections = {
            user: { state: users, setter: setUsers },
            page: { state: pages, setter: setPages },
            post: { state: posts, setter: setPosts },
            faq: { state: faqs, setter: setFaqs },
            media: { state: media, setter: setMedia },
        };
        const { state, setter } = collections[deletionConfig.type];
        // @ts-ignore
        setter(state.filter(i => i.id !== deletionConfig.id));
        setDeletionConfig({ isOpen: false, type: null, id: null, name: '' });
    };
    
    const openDeleteModal = (item: any, type: DeletionConfig['type']) => {
        const name = item.title || item.name || item.question || `item #${item.id}`;
        setDeletionConfig({ isOpen: true, type, id: item.id, name });
        setActiveActionMenu(null);
    };

    const handleUserStatusChange = (userId: number, isEnabled: boolean) => {
        setUsers(users.map(user => user.id === userId ? { ...user, status: isEnabled ? 'Active' : 'Suspended' } : user));
    };
    
    const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const newFile: AdminMediaFile = {
                id: `media_${Date.now()}`,
                name: file.name,
                url: URL.createObjectURL(file),
                type: 'image',
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                uploadedAt: new Date().toISOString().split('T')[0]
            };
            setMedia([newFile, ...media]);
        }
    };
    
    const toggleActionMenu = (id: number | string) => {
        setActiveActionMenu(activeActionMenu === id ? null : id);
    };

    // =======================
    // Sub-components (Views, Modals, etc.)
    // =======================

    const DashboardView = () => (
        <>
            <AdminHeader title="Dashboard" subtitle="Welcome back, Admin! Here's a snapshot of your platform." />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {initialStats.map(stat => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        change={stat.change}
                        changeType={stat.changeType}
                        icon={stat.icon}
                    />
                ))}
            </div>
            <div className="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900">Recent Payments</h3>
                <p className="text-sm text-gray-500 mb-4">Last 5 transactions</p>
                <div className="space-y-3">
                    {initialPayments.slice(0, 5).map(p => (
                        <div key={p.id} className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-semibold">{p.clientName}</p>
                                <p className="text-gray-500">{p.plan}</p>
                            </div>
                            <p className="font-bold">${p.amount.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900">Recent Users</h3>
                <p className="text-sm text-gray-500 mb-4">Last 5 sign-ups</p>
                <div className="space-y-3">
                    {initialUsers.slice(0, 5).map(u => (
                        <div key={u.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                                <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full" />
                                <div>
                                    <p className="font-semibold">{u.name}</p>
                                    <p className="text-gray-500">{u.email}</p>
                                </div>
                            </div>
                            <p className="text-gray-500">{u.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );

    const SettingsView = () => {
        const [selectedPage, setSelectedPage] = useState('home');
        const [showToast, setShowToast] = useState(false);
    
        const pages = [
            { id: 'home', name: 'Homepage' },
            { id: 'services', name: 'Services Page' },
            { id: 'about', name: 'About Page' },
            { id: 'pricing', name: 'Pricing Page' },
        ];
    
        const handleSaveChanges = () => {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        }
    
        const EditorPanel = () => {
            switch(selectedPage) {
                case 'home':
                    return <HomepageEditor onSave={handleSaveChanges} />;
                default:
                    return <div className="text-center p-10 bg-white rounded-xl shadow-sm border"><p className="text-gray-500">Editing for this page is not yet implemented.</p></div>;
            }
        };
      
        return (
            <>
                <AdminHeader title="Global Site Controls" subtitle="Manage site-wide settings and branding." />
                
                {/* Save Confirmation Toast */}
                {showToast && (
                    <div className="fixed top-24 right-8 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-fade-in-up">
                        Changes saved! In a real app, the live site would be updated.
                    </div>
                )}
    
                <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-24">
                            <h3 className="font-bold mb-2 text-gray-800 px-3">Pages</h3>
                            <nav className="space-y-1">
                                {pages.map(page => (
                                    <button
                                        key={page.id}
                                        onClick={() => setSelectedPage(page.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedPage === page.id ? 'bg-primary-blue/10 text-primary-blue' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                    >
                                        {page.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                    <div className="lg:col-span-9">
                        <EditorPanel />
                    </div>
                </div>
            </>
        );
    };

    const HomepageEditor: React.FC<{onSave: () => void}> = ({ onSave }) => {
        const [expandedSection, setExpandedSection] = useState<string | null>('whyChooseUs');
    
        const sections = [
            { id: 'hero', name: 'Hero Section' },
            { id: 'whyChooseUs', name: 'Why Choose Us Section' },
            { id: 'howItWorks', name: 'How It Works Section' },
        ];
    
        const SectionEditor: React.FC<{ sectionId: string }> = ({ sectionId }) => {
            switch (sectionId) {
                case 'whyChooseUs':
                    return <WhyChooseUsEditor onSave={onSave} />;
                default:
                    return <div className="p-6 text-gray-500">Editing for this section is not implemented yet.</div>;
            }
        };
    
        return (
            <div className="space-y-4">
                {sections.map(section => (
                    <div key={section.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <button onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)} className="w-full flex justify-between items-center p-4 text-left">
                            <h4 className="font-bold text-lg text-gray-800">{section.name}</h4>
                            {expandedSection === section.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </button>
                        {expandedSection === section.id && (
                            <div className="p-4 md:p-6 border-t bg-gray-50/50">
                                <SectionEditor sectionId={section.id} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const WhyChooseUsEditor: React.FC<{onSave: () => void}> = ({ onSave }) => {
        const initialData = useMemo(() => ({
            title: "Why Choose Catazet?",
            backgroundColor: "#e6f4ff", // Tailwind 'accent-light-blue'
            items: whyChooseUsItems.map((item: FeatureItem): EditableWhyChooseUsItem => {
                let iconName = 'WhyVettedTalentIcon';
                if (item.title === 'Dedicated Support') iconName = 'WhyDedicatedSupportIcon';
                else if (item.title === 'Cost-Effective') iconName = 'WhyCostEffectiveIcon';
                else if (item.title === 'Global Reach') iconName = 'WhyGlobalReachIcon';
                return { ...item, icon: iconName };
            }),
        }), []);
        
        const [content, setContent] = useState(initialData);
        const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

        const handleItemChange = (index: number, field: keyof EditableWhyChooseUsItem, value: string) => {
            const newItems = [...content.items];
            newItems[index] = { ...newItems[index], [field]: value };
            setContent(prev => ({ ...prev, items: newItems }));
        };
    
        const handleIconChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                const newItems = [...content.items];
                newItems[index].icon = URL.createObjectURL(file);
                setContent(prev => ({...prev, items: newItems}));
            }
        };

        const getIconComponent = (icon: string, props: {className?: string} = {}) => {
            if (icon.startsWith('blob:')) {
                return <img src={icon} alt="Uploaded Icon" className={props.className} />;
            }
            const defaultProps = { className: "w-6 h-6" };
            const finalProps = { ...defaultProps, ...props };
            switch(icon) {
                case 'WhyVettedTalentIcon': return <WhyVettedTalentIcon {...finalProps}/>;
                case 'WhyDedicatedSupportIcon': return <WhyDedicatedSupportIcon {...finalProps}/>;
                case 'WhyCostEffectiveIcon': return <WhyCostEffectiveIcon {...finalProps}/>;
                case 'WhyGlobalReachIcon': return <WhyGlobalReachIcon {...finalProps}/>;
                default: return <QuestionMarkCircleIcon {...finalProps}/>;
            }
        }
    
        return (
            <div className="space-y-6">
                <div>
                    <label htmlFor="sectionTitle" className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                    <input id="sectionTitle" type="text" value={content.title} onChange={e => setContent(p => ({...p, title: e.target.value}))} className="w-full p-2 border rounded-md shadow-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: content.backgroundColor }}></div>
                        <input type="color" value={content.backgroundColor} onChange={e => setContent(p => ({...p, backgroundColor: e.target.value}))} className="w-10 h-10 p-0 border-none bg-transparent" />
                        <input type="text" value={content.backgroundColor} onChange={e => setContent(p => ({...p, backgroundColor: e.target.value}))} className="p-2 border rounded-md shadow-sm w-32"/>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 border-b pb-2">Content Cards</h3>
                    {content.items.map((item, index) => (
                         <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Card Title</label>
                                    <input type="text" value={item.title} onChange={e => handleItemChange(index, 'title', e.target.value)} className="w-full mt-1 p-2 border rounded-md"/>
                                </div>
                                 <div>
                                    <label className="text-sm font-medium text-gray-700">Icon</label>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                            {getIconComponent(item.icon, {className: "w-6 h-6"})}
                                        </div>
                                        <input type="file" accept="image/*,.svg" className="hidden" ref={el => { if (el) fileInputRefs.current[index] = el; }} onChange={(e) => handleIconChange(index, e)}/>
                                        <button onClick={() => fileInputRefs.current[index]?.click()} className="bg-white py-1.5 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                                            Change...
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="text-sm font-medium text-gray-700">Card Description</label>
                                <textarea value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} rows={2} className="w-full mt-1 p-2 border rounded-md"/>
                            </div>
                        </div>
                    ))}
                </div>
    
                <div className="flex justify-end pt-4 border-t">
                    <button onClick={onSave} className="bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-700 text-sm">
                        Save Changes
                    </button>
                </div>
            </div>
        );
    };

    const ActionMenu: React.FC<{ item: any; type: DeletionConfig['type']; onEdit: () => void; }> = ({ item, type, onEdit }) => (
        <div className="absolute right-4 top-10 mt-1 w-32 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
            <button onClick={onEdit} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100">
                <EditIcon className="w-4 h-4" /> Edit
            </button>
            <button onClick={() => openDeleteModal(item, type)} className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50">
                <TrashIcon className="w-4 h-4" /> Delete
            </button>
        </div>
    );

    const PagesView = () => (
        <>
            <AdminHeader title="Page Management" subtitle="Edit content for all website pages.">
                <button onClick={() => setModalConfig({ isOpen: true, type: 'create-page' })} className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 text-sm flex items-center gap-2">
                    <PlusIcon className="w-4 h-4"/> Create Page
                </button>
            </AdminHeader>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Page Title</th><th className="p-4">Last Updated</th><th className="p-4">Updated By</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pages.map(page => (
                            <tr key={page.id}>
                                <td className="p-4 font-semibold text-gray-800">{page.title}</td><td className="p-4 text-gray-500">{page.lastUpdated}</td><td className="p-4 text-gray-500">{page.updatedBy}</td><td className="p-4"><StatusBadge status={page.status} /></td>
                                <td className="p-4 text-right relative">
                                    <button onClick={() => toggleActionMenu(page.id)} className="p-1 text-gray-500 hover:text-gray-800 rounded-full"><DotsVerticalIcon /></button>
                                    {activeActionMenu === page.id && <ActionMenu item={page} type="page" onEdit={() => setModalConfig({ isOpen: true, type: 'edit-page', data: page })} />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const UsersView = () => (
        <>
            <AdminHeader title="User Management" subtitle="View, edit, and manage all users on the platform.">
                <button onClick={() => setModalConfig({ isOpen: true, type: 'create-user' })} className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 text-sm flex items-center gap-2">
                    <PlusIcon className="w-4 h-4"/> Create User
                </button>
            </AdminHeader>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4">Enabled</th><th className="p-4 text-right">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="p-4"><div className="flex items-center gap-3"><img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" /><div><p className="font-semibold text-gray-800">{user.name}</p><p className="text-gray-500">{user.email}</p></div></div></td>
                                <td className="p-4 text-gray-500">{user.role}</td><td className="p-4"><StatusBadge status={user.status} /></td><td className="p-4"><ToggleSwitch isChecked={user.status === 'Active'} onChange={checked => handleUserStatusChange(user.id, checked)} /></td>
                                <td className="p-4 text-right relative">
                                    <button onClick={() => toggleActionMenu(user.id)} className="p-1 text-gray-500 hover:text-gray-800 rounded-full"><DotsVerticalIcon /></button>
                                    {activeActionMenu === user.id && <ActionMenu item={user} type="user" onEdit={() => setModalConfig({ isOpen: true, type: 'edit-user', data: user })} />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const PaymentsView = () => (
        <>
            <AdminHeader title="Payments" subtitle="View and manage all transactions." />
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr><th className="p-4">Client</th><th className="p-4">Amount</th><th className="p-4">Date</th><th className="p-4">Plan</th><th className="p-4">Status</th></tr>
                    </thead>
                     <tbody className="divide-y divide-gray-100">
                        {initialPayments.map(p => (
                            <tr key={p.id}>
                                <td className="p-4"><p className="font-semibold">{p.clientName}</p><p className="text-gray-500">{p.clientEmail}</p></td>
                                <td className="p-4 font-bold text-gray-800">${p.amount.toFixed(2)}</td><td className="p-4">{p.date}</td><td className="p-4">{p.plan}</td><td className="p-4"><StatusBadge status={p.status}/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
    
    const MediaView = () => (
        <>
            <AdminHeader title="Media Library" subtitle="Manage all uploaded images and documents.">
                <button onClick={() => fileInputRef.current?.click()} className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 text-sm flex items-center gap-2">
                    <UploadIcon className="w-4 h-4"/> Upload File
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*,application/pdf" onChange={handleMediaUpload} />
            </AdminHeader>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {media.map(file => (
                    <div key={file.id} className="bg-white rounded-xl shadow-sm border group relative">
                        <div className="aspect-w-1 aspect-h-1 w-full bg-gray-100 rounded-t-xl overflow-hidden">
                           {file.type === 'image' && <img src={file.url} alt={file.name} className="object-cover" />}
                           {file.type === 'video' && <div className="flex items-center justify-center h-full"><VideoIcon className="w-12 h-12 text-gray-400"/></div>}
                           {file.type === 'document' && <div className="flex items-center justify-center h-full"><FileIcon className="w-12 h-12 text-gray-400"/></div>}
                        </div>
                        <div className="p-2.5 text-xs">
                            <p className="font-semibold text-gray-800 truncate">{file.name}</p>
                            <p className="text-gray-500">{file.size}</p>
                        </div>
                        <button onClick={() => openDeleteModal(file, 'media')} className="absolute top-2 right-2 bg-white/50 p-1.5 rounded-full text-red-600 hover:bg-white transition-opacity opacity-0 group-hover:opacity-100">
                            <TrashIcon className="w-4 h-4"/>
                        </button>
                    </div>
                ))}
            </div>
        </>
    );

    const BlogView = () => (
        <>
            <AdminHeader title="Blog Management" subtitle="Create, edit, and manage all blog posts.">
                <button onClick={() => setModalConfig({ isOpen: true, type: 'create-post' })} className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 text-sm flex items-center gap-2">
                    <PlusIcon className="w-4 h-4"/> New Post
                </button>
            </AdminHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white rounded-xl shadow-sm border relative">
                         <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover rounded-t-xl"/>
                         <div className="p-4">
                            <p className="text-xs text-primary-blue font-semibold">{post.category}</p>
                            <h3 className="font-bold mt-1">{post.title}</h3>
                            <p className="text-xs text-gray-500 mt-2">By {post.author} on {post.date}</p>
                         </div>
                         <div className="absolute top-2 right-2">
                             <button onClick={() => toggleActionMenu(post.id)} className="p-1.5 bg-white/70 backdrop-blur-sm rounded-full"><DotsVerticalIcon /></button>
                             {activeActionMenu === post.id && <ActionMenu item={post} type="post" onEdit={() => setModalConfig({ isOpen: true, type: 'edit-post', data: post })} />}
                         </div>
                    </div>
                ))}
            </div>
        </>
    );

    const FaqView = () => (
        <>
            <AdminHeader title="FAQ Management" subtitle="Manage the Frequently Asked Questions.">
                <button onClick={() => setModalConfig({ isOpen: true, type: 'create-faq' })} className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 text-sm flex items-center gap-2">
                    <PlusIcon className="w-4 h-4"/> New FAQ
                </button>
            </AdminHeader>
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-start">
                        <div>
                            <p className="font-bold text-gray-800">{faq.question}</p>
                            <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
                        </div>
                        <div className="relative flex-shrink-0 ml-4">
                           <button onClick={() => toggleActionMenu(`faq-${index}`)} className="p-1 text-gray-500 hover:text-gray-800 rounded-full"><DotsVerticalIcon /></button>
                           {activeActionMenu === `faq-${index}` && <ActionMenu item={{...faq, id: index}} type="faq" onEdit={() => setModalConfig({ isOpen: true, type: 'edit-faq', data: {...faq, id: index} })} />}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    const CommentsView = () => (
        <>
            <AdminHeader title="Comment Management" subtitle="Approve, reply to, or delete comments."/>
            <div className="bg-white rounded-xl shadow-sm border divide-y">
                {comments.map(comment => (
                    <div key={comment.id} className="p-4 flex gap-4">
                        <img src={comment.avatarUrl} alt={comment.author} className="w-10 h-10 rounded-full"/>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <div><span className="font-semibold">{comment.author}</span><span className="text-sm text-gray-500 ml-2">on post #{comment.postId}</span></div>
                                <div className="text-xs text-gray-400">{comment.date}</div>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                            <div className="mt-2 flex gap-2">
                                <button className="text-xs font-semibold text-green-600 hover:underline">Approve</button>
                                <button className="text-xs font-semibold text-blue-600 hover:underline">Reply</button>
                                <button className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    const MessagesView = () => {
        const [activeMessage, setActiveMessage] = useState(inbox[0]);
        return (
            <>
                <AdminHeader title="Inbox" subtitle="Respond to client inquiries and messages." />
                <div className="grid md:grid-cols-3 gap-6 h-[70vh]">
                    <div className="md:col-span-1 bg-white rounded-xl shadow-sm border p-2 space-y-1 overflow-y-auto">
                        {inbox.map(msg => (
                            <button key={msg.id} onClick={() => setActiveMessage(msg)} className={`w-full text-left p-3 rounded-lg ${activeMessage.id === msg.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                <div className="flex justify-between items-baseline">
                                    <p className={`font-semibold text-sm ${!msg.read && 'text-primary-blue'}`}>{msg.fromName}</p>
                                    <p className="text-xs text-gray-400">{msg.date.split(' ')[1]}</p>
                                </div>
                                <p className="text-sm font-medium text-gray-800 truncate">{msg.subject}</p>
                            </button>
                        ))}
                    </div>
                    <div className="md:col-span-2 bg-white rounded-xl shadow-sm border flex flex-col">
                        <div className="p-4 border-b">
                            <h3 className="font-bold">{activeMessage.subject}</h3>
                            <p className="text-sm text-gray-500">From: {activeMessage.fromName} &lt;{activeMessage.fromEmail}&gt;</p>
                        </div>
                        <div className="p-4 flex-grow overflow-y-auto text-sm text-gray-700">{activeMessage.body}</div>
                        <div className="p-4 border-t bg-gray-50">
                            <div className="relative">
                                <textarea placeholder="Type your reply..." rows={3} className="w-full p-2 pr-10 border rounded-md text-sm"></textarea>
                                <button className="absolute right-2 top-2 p-1.5 text-white bg-primary-blue rounded-md hover:opacity-90"><SendIcon className="w-4 h-4"/></button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    };
    
    const LiveChatView = () => (
        <>
            <AdminHeader title="Live Chat" subtitle="Assist website visitors in real-time." />
            <div className="grid md:grid-cols-2 gap-6">
                {liveChats.map(chat => (
                    <div key={chat.id} className="bg-white rounded-xl shadow-sm border flex flex-col h-96">
                        <div className="p-3 border-b flex justify-between items-center">
                            <h3 className="font-bold text-sm">{chat.visitorId}</h3>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Active</span>
                        </div>
                        <div className="flex-grow p-3 space-y-2 overflow-y-auto bg-gray-50">
                            {chat.messages.map((msg, i) => (
                                <div key={i} className="text-sm bg-blue-100 text-blue-900 px-3 py-1.5 rounded-lg max-w-xs">{msg.text}</div>
                            ))}
                        </div>
                        <div className="p-3 border-t"><input placeholder="Reply..." className="w-full text-sm p-2 border rounded-md"/></div>
                    </div>
                ))}
            </div>
        </>
    );

    const AIContentStudioView = () => {
        type GeneratorTab = 'blog' | 'service' | 'marketing';
        const [activeTab, setActiveTab] = useState<GeneratorTab>('blog');
        const [isLoading, setIsLoading] = useState(false);
        const [generatedContent, setGeneratedContent] = useState('');
        
        const [blogInputs, setBlogInputs] = useState({ topic: '', keywords: '', tone: 'Professional', length: 'Medium (~600 words)' });
        const [serviceInputs, setServiceInputs] = useState({ serviceName: '', features: '', targetAudience: '' });
        const [marketingInputs, setMarketingInputs] = useState({ productName: '', copyType: 'Facebook Ad', keyMessage: '' });

        const handleGenerate = async () => {
            setIsLoading(true);
            setGeneratedContent('');
            let prompt = '';

            try {
                switch(activeTab) {
                    case 'blog':
                        prompt = `You are an expert content writer for a company called Catazet, which provides virtual assistants. Write a blog post based on the following details:\nTopic/Title: ${blogInputs.topic}\nKeywords to include: ${blogInputs.keywords}\nTone: ${blogInputs.tone}\nApproximate Length: ${blogInputs.length}\n\nThe blog post should have a compelling title, an introduction, at least 3 distinct sections with H3 markdown headings, and a concluding paragraph. Format the output in plain text with markdown for headings.`;
                        break;
                    case 'service':
                        prompt = `You are a marketing copywriter for a company called Catazet, which provides virtual assistants. Create a compelling service description based on these details:\nService Name: ${serviceInputs.serviceName}\nKey Features (one per line):\n${serviceInputs.features}\nTarget Audience: ${serviceInputs.targetAudience}\n\nThe description should be concise, highlight the benefits, and be engaging for the target audience. Return only the description text.`;
                        break;
                    case 'marketing':
                        prompt = `You are a marketing copywriter for a company called Catazet, which provides virtual assistants. Generate marketing copy for the following:\nProduct/Service: ${marketingInputs.productName}\nCopy Type: ${marketingInputs.copyType}\nKey Message/Goal: ${marketingInputs.keyMessage}\n\nGenerate 3 distinct options for the requested copy type. Each option should be separated by '---'. The copy should be persuasive and tailored for the specified platform. Return only the generated copy options.`;
                        break;
                }

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                setGeneratedContent(response.text);
            } catch(error) {
                console.error("Error generating content:", error);
                setGeneratedContent("Sorry, there was an error generating the content. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        const renderForm = () => {
            switch(activeTab) {
                case 'blog': return (
                    <div className="space-y-4">
                        <input type="text" placeholder="Blog Post Topic or Title" value={blogInputs.topic} onChange={e => setBlogInputs({...blogInputs, topic: e.target.value})} className="w-full p-2 border rounded-md" />
                        <input type="text" placeholder="Keywords (comma-separated)" value={blogInputs.keywords} onChange={e => setBlogInputs({...blogInputs, keywords: e.target.value})} className="w-full p-2 border rounded-md" />
                        <div className="grid grid-cols-2 gap-4">
                            <select value={blogInputs.tone} onChange={e => setBlogInputs({...blogInputs, tone: e.target.value})} className="w-full p-2 border rounded-md bg-white"><option>Professional</option><option>Casual</option><option>Witty</option><option>Informative</option></select>
                            <select value={blogInputs.length} onChange={e => setBlogInputs({...blogInputs, length: e.target.value})} className="w-full p-2 border rounded-md bg-white"><option>Short (~300 words)</option><option>Medium (~600 words)</option><option>Long (~1000 words)</option></select>
                        </div>
                    </div>
                );
                case 'service': return (
                    <div className="space-y-4">
                        <input type="text" placeholder="Service Name (e.g., Tech VA Support)" value={serviceInputs.serviceName} onChange={e => setServiceInputs({...serviceInputs, serviceName: e.target.value})} className="w-full p-2 border rounded-md" />
                        <textarea placeholder="Key Features (one per line)" value={serviceInputs.features} onChange={e => setServiceInputs({...serviceInputs, features: e.target.value})} className="w-full p-2 border rounded-md" rows={3}></textarea>
                        <input type="text" placeholder="Target Audience (e.g., Startups, Healthcare Professionals)" value={serviceInputs.targetAudience} onChange={e => setServiceInputs({...serviceInputs, targetAudience: e.target.value})} className="w-full p-2 border rounded-md" />
                    </div>
                );
                case 'marketing': return (
                     <div className="space-y-4">
                        <input type="text" placeholder="Product/Service Name" value={marketingInputs.productName} onChange={e => setMarketingInputs({...marketingInputs, productName: e.target.value})} className="w-full p-2 border rounded-md" />
                        <select value={marketingInputs.copyType} onChange={e => setMarketingInputs({...marketingInputs, copyType: e.target.value})} className="w-full p-2 border rounded-md bg-white"><option>Facebook Ad</option><option>Tweet</option><option>Email Subject Line</option><option>Landing Page Headline</option></select>
                        <textarea placeholder="Key Message / Goal" value={marketingInputs.keyMessage} onChange={e => setMarketingInputs({...marketingInputs, keyMessage: e.target.value})} className="w-full p-2 border rounded-md" rows={2}></textarea>
                    </div>
                );
                default: return null;
            }
        };

        return (
            <>
                <AdminHeader title="AI Content Studio" subtitle="Generate content for your marketing, blog, and services." />
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border">
                        <div className="flex border-b mb-4">
                            {(['blog', 'service', 'marketing'] as GeneratorTab[]).map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-semibold capitalize ${activeTab === tab ? 'text-primary-blue border-b-2 border-primary-blue' : 'text-gray-500'}`}>{tab}</button>
                            ))}
                        </div>
                        {renderForm()}
                        <button onClick={handleGenerate} disabled={isLoading} className="mt-6 w-full bg-primary-blue text-white font-bold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                           {isLoading ? <LoadingSpinnerIcon className="w-5 h-5"/> : <SparklesIcon className="w-5 h-5"/>}
                           {isLoading ? 'Generating...' : 'Generate Content'}
                        </button>
                    </div>
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border flex flex-col">
                        <h3 className="font-bold text-lg mb-2">Generated Content</h3>
                        <div className="flex-grow bg-gray-50 rounded-md p-4 h-96 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full text-gray-500"><LoadingSpinnerIcon className="w-8 h-8"/></div>
                            ) : (
                                <textarea readOnly value={generatedContent} className="w-full h-full bg-transparent border-none focus:ring-0 resize-none text-sm text-gray-800" placeholder="Your AI-generated content will appear here..."></textarea>
                            )}
                        </div>
                         <button onClick={() => navigator.clipboard.writeText(generatedContent)} disabled={!generatedContent || isLoading} className="mt-4 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 text-sm disabled:opacity-50 self-end">
                            Copy to Clipboard
                        </button>
                    </div>
                </div>
            </>
        )
    };

    const FormModal = () => {
        const isNew = modalConfig.type?.startsWith('create');
        const entityType = modalConfig.type?.split('-')[1] as keyof typeof formFieldsMap;
        const formFields = formFieldsMap[entityType];
        
        const [formData, setFormData] = useState(isNew ? {} : modalConfig.data);
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

        if (!modalConfig.isOpen || !entityType) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setModalConfig({isOpen: false, type: null})}>
                <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <img src="/assets/logo/Catazetlogomain.png" alt="Catazet Logo" className="h-8 w-auto" />
                        <span className="text-2xl font-poppins font-extrabold text-primary-blue">Catazet</span>
                    </div>
                    <h2 className="text-lg font-bold mb-4 text-center">{isNew ? `Create New ${entityType}` : `Edit ${entityType}`}</h2>
                    <form className="space-y-4">
                        {formFields.map(field => (
                             <div key={field.name}>
                                <label className="text-sm font-medium">{field.label}</label>
                                {field.type === 'select' ? (
                                    <select name={field.name} value={formData[field.name] || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md">
                                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                ) : field.type === 'textarea' ? (
                                    <textarea name={field.name} value={formData[field.name] || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md" rows={4}></textarea>
                                ) : (
                                    <input type={field.type} name={field.name} value={formData[field.name] || ''} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-md"/>
                                )}
                            </div>
                        ))}
                        <div className="flex justify-end gap-2 pt-4">
                            <button type="button" onClick={() => setModalConfig({isOpen: false, type: null})} className="px-4 py-2 text-sm font-semibold bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                            <button type="button" onClick={() => handleSave(formData, entityType)} className="px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    };

    const DeletionModal = () => {
        if (!deletionConfig.isOpen) return null;
        return (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeletionConfig({...deletionConfig, isOpen: false})}>
                <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                    <h2 className="text-lg font-bold">Confirm Deletion</h2>
                    <p className="text-sm text-gray-600 mt-2">Are you sure you want to delete <strong className="text-red-600">{deletionConfig.name}</strong>? This action cannot be undone.</p>
                    <div className="flex justify-end gap-2 pt-4 mt-4">
                        <button type="button" onClick={() => setDeletionConfig({...deletionConfig, isOpen: false})} className="px-4 py-2 text-sm font-semibold bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                        <button type="button" onClick={confirmDelete} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </div>
        )
    }

    const renderView = () => {
        switch (activeView) {
            case 'dashboard': return <DashboardView />;
            case 'pages': return <PagesView />;
            case 'users': return <UsersView />;
            case 'payments': return <PaymentsView />;
            case 'media': return <MediaView />;
            case 'blog': return <BlogView />;
            case 'settings': return <SettingsView />;
            case 'faq': return <FaqView />;
            case 'comments': return <CommentsView />;
            case 'messages': return <MessagesView />;
            case 'chat': return <LiveChatView />;
            case 'ai-studio': return <AIContentStudioView />;
            default: return <DashboardView />;
        }
    };
    
    return (
        <div className="bg-gray-50 font-sans text-gray-900 flex min-h-screen">
            <AdminSidebar 
                activeView={activeView}
                setActiveView={setActiveView}
                onLogout={onLogout}
                isMobileOpen={isMobileMenuOpen}
                setIsMobileOpen={setIsMobileMenuOpen}
                navLinks={allAdminNavLinks}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-sm z-30 flex items-center justify-between p-4 border-b border-gray-200">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600" aria-label="Open menu">
                        <MenuIcon />
                    </button>
                     <h1 className="text-lg font-bold text-primary-blue">
                        {allAdminNavLinks.find(l => l.id === activeView)?.name || 'Dashboard'}
                    </h1>
                    <div className="w-6 h-6"></div>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>

            <FormModal />
            <DeletionModal />
        </div>
    );
};

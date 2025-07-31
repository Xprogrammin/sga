

import React from 'react';

export type Page = 
    | 'home' | 'services' | 'pricing' | 'blog' | 'about' | 'contact' 
    | 'volunteer-program' | 'courses' | 'privacy-policy' | 'terms-of-service'
    | 'va-category' | 'va-listing' | 'va-detail' | 'blog-post' | 'all-vas';

export interface PageContext {
    vaType?: VAType;
    vaId?: string;
    postId?: number;
    searchQuery?: string;
}

export type VAType = 'General' | 'Tech' | 'Edu' | 'Health' | 'Security' | 'Student';

export interface NavLink {
  name: string;
  href: string;
  subLinks?: NavLink[];
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface HowItWorksStep {
  step: number;
  title:string;
  description: string;
}

export interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  vaType?: VAType;
}

export interface VirtualAssistant {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  icon?: React.ReactNode;
}

export interface SoftwareProficiency {
    name: string;
}

export interface DetailedVirtualAssistant {
  id: string;
  name: string;
  type: VAType;
  tagline: string;
  bio: string;
  imageUrl: string;
  skills: string[];
  softwareProficiency: SoftwareProficiency[];
  stats: {
    rating: number;
    projectsCompleted: number;
    responseRate: string;
  };
}


export interface Faq {
  question: string;
  answer: string;
}

export interface FooterLink {
    title: string;
    href: string;
}

export interface FooterSection {
    title: string;
    links: FooterLink[];
}

export interface PricingPlan {
  name: string;
  price: string;
  priceSuffix: string;
  description: string;
  features: string[];
  isFeatured: boolean;
  buttonText: string;
  stripeUrl?: string;
}

export interface FeatureComparison {
  feature: string;
  basic: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

export type View = 'main' | 'chat' | 'message' | 'faq';

export interface ChatMessage {
  from: 'user' | 'agent';
  text: string;
  isSummary?: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: string;
  date: string;
  category: string;
  content: string;
}

export interface Comment {
  id: number;
  postId: number;
  author: string;
  date: string;
  text: string;
  avatarUrl: string;
  replies?: Comment[];
}

export interface AboutFeature {
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  description: string;
}

export interface CoreValue {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  title: string;
  imageUrl: string;
  bio?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
  };
}

export interface VolunteerBenefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface VolunteerStep {
  step: number;
  title: string;
  description: string;
}

export interface VolunteerTestimonial {
  quote: string;
  name: string;
  role: string;
  imageUrl: string;
}

export interface Course {
  title: string;
  description: string;
  id: string;
}

// --- ADMIN DASHBOARD TYPES ---
export type AdminView = 'dashboard' | 'pages' | 'users' | 'payments' | 'media' | 'blog' | 'settings' | 'faq' | 'messages' | 'chat' | 'comments' | 'ai-studio' | 'logout';

export interface AdminNavLink {
  id: AdminView;
  name: string;
  icon: React.ReactNode;
}

export type UserRole = 'Virtual Assistant' | 'Volunteer' | 'Course Taker' | 'Client' | 'Admin';
export type UserStatus = 'Active' | 'Suspended' | 'Pending';

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
    role: UserRole;
    level?: number;
    status: UserStatus;
    lastLogin: string;
    ipAddress: string;
}

export interface AdminStat {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    icon: React.ReactNode;
}

export interface AdminPageContent {
    id: string;
    title: string;
    lastUpdated: string;
    updatedBy: string;
    status: 'Published' | 'Draft';
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded';
export interface AdminPayment {
    id: string;
    clientName: string;
    clientEmail: string;

    amount: number;
    date: string;
    status: PaymentStatus;
    plan: string;
}

export interface AdminMediaFile {
    id: string;
    name: string;
    url: string;
    type: 'image' | 'video' | 'document';
    size: string; // e.g., "1.2 MB"
    uploadedAt: string;
}

// --- CLIENT DASHBOARD TYPES ---
export type ClientView = 'dashboard' | 'find-va' | 'projects' | 'messages' | 'billing' | 'settings' | 'va-profile';

export interface ClientNavLink {
  id: ClientView;
  name: string;
  icon: React.ReactNode;
}

export interface ClientStat {
    title: string;
    value: string;
    icon: React.ReactNode;
}

export type ProjectStatus = 'Active' | 'Completed' | 'Pending' | 'Canceled' | 'Delivered';
export interface ClientProject {
    id: string;
    title: string;
    vaId: string; // Corresponds to DetailedVirtualAssistant id
    clientId?: string; // Corresponds to a client id
    status: ProjectStatus;
    startDate: string;
    rate: string; // e.g., "$25/hr" or "$1500/month"
}

export interface ClientMessage {
    id: number;
    from: 'client' | 'va';
    content: {
        type: 'text' | 'image' | 'file' | 'voice_note' | 'call_record';
        text?: string;
        file?: { name:string; url:string; size:string; };
        duration?: string; // for voice notes & calls
        callType?: 'audio' | 'video';
    };
    timestamp: string;
}


export interface ClientMessageThread {
    id: string;
    vaId: string; // Corresponds to DetailedVirtualAssistant id
    vaName: string;
    vaImageUrl: string;
    lastMessage: string;
    lastMessageTimestamp: string;
    unreadCount: number;
    messages: ClientMessage[];
}

export type BillingStatus = 'Paid' | 'Due' | 'Pending';
export interface ClientBillingRecord {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: BillingStatus;
    invoiceId: string;
}

// --- VA DASHBOARD TYPES ---
export type VAView = 'dashboard' | 'projects' | 'messages' | 'payouts' | 'profile';

export interface VANavLink {
  id: VAView;
  name: string;
  icon: React.ReactNode;
}

export interface VAStat {
    title: string;
    value: string;
    icon: React.ReactNode;
}

export type PayoutStatus = 'Paid' | 'Processing' | 'Pending';
export interface VAPayoutRecord {
    id: string;
    payoutDate: string;
    month: string;
    clients: number;
    amount: number;
    status: PayoutStatus;
}


// --- COURSE TAKER DASHBOARD TYPES ---
export type CourseTakerView = 'dashboard' | 'my-courses' | 'browse-courses' | 'settings' | 'certificates';

export interface CourseTakerNavLink {
  id: CourseTakerView;
  name: string;
  icon: React.ReactNode;
}

export interface EnrolledCourse {
    id: string;
    title: string;
    description: string;
    progress: number;
    status: 'In Progress' | 'Completed';
    certificateUrl?: string;
}

export interface CourseTakerStat {
    title: string;
    value: string;
    icon: React.ReactNode;
}

// --- VOLUNTEER DASHBOARD TYPES ---
export type VolunteerView = 'dashboard' | 'assignments' | 'training' | 'profile' | 'certificates';

export interface VolunteerNavLink {
  id: VolunteerView;
  name: string;
  icon: React.ReactNode;
}

export interface VolunteerStat {
    title: string;
    value: string;
    icon: React.ReactNode;
}

export interface VolunteerAssignment {
    id: string;
    projectTitle: string;
    clientName: string;
    seniorVaName: string;
    status: 'Active' | 'Completed';
    tasks: string[];
}

export interface Certificate {
  id: string;
  recipientName: string;
  title: string;
  date: string;
  issuerName: string;
  issuerTitle: string;
}
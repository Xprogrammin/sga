import React from 'react';
import type { 
    FeatureItem, HowItWorksStep, Service, VirtualAssistant, Faq, FooterSection, 
    NavLink, PricingPlan, FeatureComparison, BlogPost, AboutFeature, CoreValue, TeamMember,
    VolunteerBenefit, VolunteerStep, VolunteerTestimonial, Course, DetailedVirtualAssistant,
    SoftwareProficiency, AdminNavLink, AdminUser, UserStatus, AdminStat, AdminPageContent, AdminPayment, PaymentStatus, AdminMediaFile,
    Comment, ClientNavLink, ClientStat, ClientProject, ClientMessageThread, ClientBillingRecord,
    VANavLink, VAStat, VAPayoutRecord, CourseTakerNavLink, CourseTakerStat, EnrolledCourse,
    VolunteerNavLink, VolunteerStat, VolunteerAssignment, Certificate
} from './types.ts';
import { 
    AdminSupportIcon, TechSupportIcon, ContentCreationIcon, DataAnalysisIcon,
    AdminSupportServiceIcon, MarketingAssistanceServiceIcon, TechnicalSupportServiceIcon,
    ContentCreationServiceIcon, DataAnalysisServiceIcon, CalendarManagementServiceIcon, TravelPlanningServiceIcon,
    ResearchReportingServiceIcon, WhyVettedTalentIcon, WhyGlobalReachIcon,
    IntegrityIcon, EmpowermentIcon, ExcellenceIcon, CollaborationIcon, ImpactIcon, NetworkIcon, NewSkillsIcon, ExperienceIcon,
    MedicalTranscriptionIcon, PatientFollowUpIcon, RemoteGateOperationIcon, AlarmResponseIcon,
    HelpdeskIcon, OnlineTutoringIcon,
    WebDevelopmentIcon,
    SocialMediaManagementServiceIcon, MedicalBillingIcon, AccessControlIcon,
    DashboardIcon, PagesIcon, UsersIcon, PaymentsIcon, MediaIcon, BlogIcon, SettingsIcon, LogoutIcon,
    TrendingUpIcon, DollarSignIcon, UsersGroupIcon, ActivityIcon, ChatBubbleIcon, SearchIcon, ProjectsIcon, BillingIcon, StarIcon,
    UserCircleIcon, BriefcaseIcon, BookOpenIcon, ClipboardListIcon, CheckIcon, CalendarIcon, SparklesIcon,
    WhyDedicatedSupportIcon, HeadphoneIcon, GlobeIcon, LinkedInIcon, CustomerServiceChatIcon, ComputerUserIcon, GraduateCapIcon, BookOpenServiceIcon,
    GraphicDesignIcon, ProductDesignIcon, ProductManagementIcon
} from './components/icons.tsx';

export const navLinks: NavLink[] = [
  { name: 'Services', href: 'services' },
  { name: 'Pricing', href: 'pricing' },
  { name: 'Blog', href: 'blog' },
  { name: 'About', href: 'about' },
  { name: 'Contact', href: 'contact' },
  {
    name: 'Programs',
    href: '#',
    subLinks: [
      { name: 'Volunteer Program', href: 'volunteer-program' },
      { name: 'Courses', href: 'courses' },
      { name: 'All VAs', href: 'all-vas' },
      { name: 'Download our Services', href: 'download-services' },
    ],
  },
];

export const whyChooseUsItems: FeatureItem[] = [
  {
    title: 'Vetted Talent',
    description: 'Access a pool of pre-screened and highly qualified virtual assistants.',
  },
  {
    title: 'Dedicated Support',
    description: 'Receive ongoing support from our team to ensure your success.',
  },
  {
    title: 'Cost-Effective',
    description: 'Optimize your budget with competitive rates for top-tier assistance.',
  },
  {
    title: 'Global Reach',
    description: 'Tap into diverse skills and perspectives from our global talent pool in the Philippines, India, and Nigeria.',
  },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: 1,
    title: 'Tell Us Your Needs',
    description: "Share your requirements and the type of virtual assistant you're looking for.",
  },
  {
    step: 2,
    title: 'Get Matched',
    description: "We'll connect you with pre-vetted VAs who fit your criteria perfectly.",
  },
  {
    step: 3,
    title: 'Start Collaborating',
    description: 'Begin working with your new VA and watch your productivity soar.',
  },
];

export const services: Service[] = [
  {
    icon: <AdminSupportIcon />,
    title: 'Administrative Support',
    description: 'Efficient handling of emails, scheduling, data entry, and document management.',
  },
  {
    icon: <ChatBubbleIcon className="h-8 w-8" />,
    title: 'Customer Service',
    description: 'Professional support via chat, email, and phone to enhance customer satisfaction.',
  },
  {
    icon: <TrendingUpIcon className="h-8 w-8" />,
    title: 'Marketing Assistance',
    description: 'Strategic campaign planning, market research, and content strategy to boost your brand.',
  },
  {
    icon: <TechSupportIcon />,
    title: 'Technical Support',
    description: 'Troubleshooting, software assistance, and IT-related tasks.',
  },
  {
    icon: <ContentCreationIcon />,
    title: 'Content Creation',
    description: 'Writing, editing, and proofreading for blogs, articles, and websites.',
  },
  {
    icon: <LinkedInIcon className="h-8 w-8" />,
    title: 'Social Media Management',
    description: 'Daily post scheduling, community engagement, and performance tracking across platforms.',
  },
];


export const servicesPageItems: Service[] = [
  {
    icon: <AdminSupportServiceIcon />,
    title: 'General Admin Support',
    description: 'Efficient handling of emails, scheduling, and data entry.',
    vaType: 'General',
  },
  {
    icon: <CustomerServiceChatIcon />,
    title: 'Customer Service',
    description: 'Professional support via chat, email, and phone to enhance satisfaction.',
    vaType: 'General',
  },
  {
    icon: <CalendarManagementServiceIcon />,
    title: 'Calendar Management',
    description: 'Manage appointments, meetings, and schedules for optimal productivity.',
    vaType: 'General',
  },
  {
    icon: <TravelPlanningServiceIcon />,
    title: 'Travel Planning',
    description: 'Handle all aspects of business travel, from bookings to itinerary management.',
    vaType: 'General',
  },
   {
    icon: <SocialMediaManagementServiceIcon />,
    title: 'Social Media Management',
    description: 'Scheduling posts, engaging with followers, and basic analytics reporting.',
    vaType: 'General',
  },
  {
    icon: <GraphicDesignIcon />,
    title: 'Graphic Design',
    description: 'Create stunning visuals for social media, marketing materials, and presentations.',
    vaType: 'General',
  },
  {
    icon: <HelpdeskIcon />,
    title: 'Tier 1 Helpdesk',
    description: 'Provide first-level technical assistance and troubleshoot common IT issues.',
    vaType: 'Tech',
  },
  {
    icon: <TechnicalSupportServiceIcon />,
    title: 'Software Assistance',
    description: 'Guide users through software features and resolve usage problems.',
    vaType: 'Tech',
  },
  {
    icon: <DataAnalysisServiceIcon />,
    title: 'Data Analysis & Reporting',
    description: 'Collecting, cleaning, and interpreting data to generate reports.',
    vaType: 'Tech',
  },
  {
    icon: <TechnicalSupportServiceIcon />,
    title: 'Software QA Testing',
    description: 'Manual testing of applications to identify bugs and usability issues.',
    vaType: 'Tech',
  },
  {
    icon: <ComputerUserIcon />,
    title: 'E-commerce Management',
    description: 'Product listing, inventory updates, and order processing on platforms like Shopify.',
    vaType: 'Tech',
  },
  {
    icon: <WebDevelopmentIcon />,
    title: 'Web Development',
    description: 'Assistance with front-end and back-end development tasks for websites and web applications.',
    vaType: 'Tech',
  },
  {
    icon: <ProductDesignIcon />,
    title: 'Product Design',
    description: 'Assistance with UI/UX design, wireframing, and prototyping for digital products.',
    vaType: 'Tech',
  },
  {
    icon: <ProductManagementIcon />,
    title: 'Product Management',
    description: 'Support for product roadmapping, feature prioritization, and user story creation.',
    vaType: 'Tech',
  },
  {
    icon: <ContentCreationServiceIcon />,
    title: 'Content Writing',
    description: 'Writing and editing content for blogs, websites, and course materials.',
    vaType: 'Edu',
  },
  {
    icon: <GraduateCapIcon />,
    title: 'Academic Research',
    description: 'Conduct thorough research and compile detailed reports and literature reviews.',
    vaType: 'Edu',
  },
  {
    icon: <OnlineTutoringIcon />,
    title: 'Online Tutoring Support',
    description: 'Assisting with scheduling, materials preparation, and student communication.',
    vaType: 'Edu',
  },
  {
    icon: <BookOpenServiceIcon />,
    title: 'Academic Proofreading',
    description: 'Proofreading and formatting academic papers, theses, and dissertations.',
    vaType: 'Edu',
  },
  {
    icon: <MedicalTranscriptionIcon />,
    title: 'Medical Transcription',
    description: 'Transcribing medical reports, patient records, and voice recordings accurately.',
    vaType: 'Health',
  },
  {
    icon: <PatientFollowUpIcon />,
    title: 'Patient Follow-up',
    description: 'Making follow-up calls for appointments, medication reminders, and feedback.',
    vaType: 'Health',
  },
  {
    icon: <MedicalBillingIcon />,
    title: 'Medical Billing & Coding',
    description: 'Assistance with processing medical claims and coding patient services.',
    vaType: 'Health',
  },
  {
    icon: <AlarmResponseIcon />,
    title: 'Remote CCTV Monitoring',
    description: 'Vigilant monitoring of security cameras to detect and report unusual activity.',
    vaType: 'Security',
  },
  {
    icon: <AccessControlIcon />,
    title: 'Access Control Management',
    description: 'Remotely manage and monitor access to facilities for authorized personnel.',
    vaType: 'Security',
  },
  {
    icon: <RemoteGateOperationIcon />,
    title: 'Incident Reporting',
    description: 'Creating detailed logs and reports of security incidents and observations.',
    vaType: 'Security',
  },
  {
    icon: <BookOpenServiceIcon />,
    title: 'Assignment Help',
    description: 'Get expert assistance with coursework, essays, and assignments to improve your grades.',
    vaType: 'Student',
  },
  {
    icon: <BookOpenServiceIcon />,
    title: 'Project Research Help',
    description: 'Comprehensive research support for your academic projects, presentations, and theses.',
    vaType: 'Student',
  },
  {
    icon: <DataAnalysisServiceIcon />,
    title: 'Data Analysis',
    description: 'Support with data analysis for assignments and projects using tools like Excel or SPSS.',
    vaType: 'Student',
  },
];

export const softwareProficiencies: Record<string, SoftwareProficiency> = {
    slack: { name: 'Slack' },
    asana: { name: 'Asana' },
    figma: { name: 'Figma' },
    trello: { name: 'Trello' },
    notion: { name: 'Notion' },
    gsuite: { name: 'Google Suite' },
    msoffice: { name: 'Microsoft Office' },
    zendesk: { name: 'Zendesk' },
    jira: { name: 'Jira'},
    shopify: { name: 'Shopify' },
    canva: { name: 'Canva' },
    moodle: { name: 'Moodle' },
    drchrono: { name: 'DrChrono' },
    kareo: { name: 'Kareo' },
    eagleeye: { name: 'Eagle Eye' },
    verkada: { name: 'Verkada' },
};


export const detailedVAs: DetailedVirtualAssistant[] = [
    // General VAs
    {
        id: 'va-gen-01', name: 'Adewumi A', type: 'General',
        tagline: 'Your reliable partner for administrative precision and content clarity',
        bio: "As a versatile virtual assistant with a strong foundation in content writing, marketing, and academic research, I bring structure and clarity to your administrative tasks. I've supported over 1,500 individuals in boosting their personal and business visibility online. With my proven track record in managing communications, scheduling, and information organization, I ensure that nothing slips through the cracks. My adaptability makes me an excellent fit for executives, entrepreneurs, and growing teams.",
        imageUrl: '/assets/profile/adewumi.jpeg',
        skills: ['Calendar & Email Management', 'Document Proofreading & Formatting', 'Academic & Market Research', 'Social Media Scheduling', 'Content Writing & Editing', 'Lead Generation Support'],
        softwareProficiency: [{ name: 'Microsoft Office Suite' }, { name: 'Google Workspace' }, { name: 'Grammarly' }, { name: 'Mendeley' }, { name: 'Trello' }, { name: 'Asana' }, { name: 'Sales Navigator' }],
        stats: { rating: 5.0, projectsCompleted: 38, responseRate: '99%' }
    },
    {
        id: 'va-gen-02', name: 'Carla M', type: 'General',
        tagline: 'Your executive partner in admin support and operations efficiency',
        bio: 'With over 8 years of experience as an Executive Assistant and Administrative VA, Carla is the go-to expert for streamlining workflows, managing calendars, and handling sensitive tasks with confidentiality. She has worked with C-level executives across various time zones and industries.',
        imageUrl: '/assets/profile/carla-m.jpeg',
        skills: ['Calendar & Email Management', 'Travel Planning', 'Meeting Coordination', 'Document Preparation'],
        softwareProficiency: [{ name: 'Google Workspace' }, { name: 'Microsoft Office Suite' }, { name: 'Zoom' }, { name: 'Trello' }],
        stats: { rating: 5.0, projectsCompleted: 42, responseRate: '98%' }
    },
    {
        id: 'va-gen-03', name: 'Kesiah P', type: 'General',
        tagline: 'Precision-driven VA focused on seamless admin solutions',
        bio: 'Kesiah brings clarity to chaos. She is an expert in calendar management, file organization, and client communications. Known for being proactive and reliable, she works excellently under pressure and delivers with precision.',
        imageUrl: '/assets/profile/kesiah.jpeg',
        skills: ['Task & Calendar Coordination', 'Client Follow-up', 'Online File Management', 'Meeting Support'],
        softwareProficiency: [{ name: 'Microsoft Outlook' }, { name: 'Notion' }, { name: 'Slack' }, { name: 'Google Docs' }],
        stats: { rating: 4.9, projectsCompleted: 35, responseRate: '97%' }
    },
    {
        id: 'va-gen-04', name: 'Joanne K', type: 'General',
        tagline: 'Your administrative anchor for everyday business success',
        bio: 'Joanne is a detail-oriented VA with a strong background in executive admin support. She has handled everything from inbox zero strategies to travel booking and meeting scheduling. She ensures nothing slips through the cracks.',
        imageUrl: '/assets/profile/joanne.jpeg',
        skills: ['Email Triage', 'Travel Bookings', 'Research Assistance', 'Daily Admin Tasks'],
        softwareProficiency: [{ name: 'Calendly' }, { name: 'Zoom' }, { name: 'Google Sheets' }, { name: 'Evernote' }],
        stats: { rating: 4.8, projectsCompleted: 30, responseRate: '95%' }
    },
    {
        id: 'va-gen-05', name: 'Cess R', type: 'General',
        tagline: 'Experienced admin and executive assistant you can count on',
        bio: 'With over a decade of experience, Cess is a powerhouse in executive assistance. She excels in managing schedules, preparing reports, handling logistics, and supporting daily operations across industries.',
        imageUrl: '/assets/profile/cess.jpeg',
        skills: ['Logistics Coordination', 'Business Communication', 'Document Control', 'Admin Task Management'],
        softwareProficiency: [{ name: 'Asana' }, { name: 'MS Office' }, { name: 'Google Meet' }, { name: 'Dropbox' }],
        stats: { rating: 5.0, projectsCompleted: 50, responseRate: '99%' }
    },
    {
        id: 'va-gen-06', name: 'Francis G', type: 'General', 
        tagline: 'Client-focused outreach and lead generation specialist.', 
        bio: 'Francis excels at client communication and strategic outreach. He supports sales and marketing teams by generating leads, managing CRM data, and facilitating communication to build strong client relationships.', 
        imageUrl: '/assets/profile/francis-g.jpeg', 
        skills: ['Customer Outreach', 'Lead Generation', 'CRM Management', 'Client Reporting'], 
        softwareProficiency: [{ name: 'Salesforce' }, { name: 'HubSpot' }, { name: 'Microsoft Office' }, { name: 'Sales Navigator' }], 
        stats: { rating: 4.8, projectsCompleted: 26, responseRate: '95%' }
    },
    {
        id: 'va-gen-07', name: 'Sunday', type: 'General',
        tagline: 'Creative graphic designer bringing your brand\'s vision to life.',
        bio: 'A skilled graphic designer with a passion for creating compelling visuals. Sunday specializes in branding, marketing materials, and presentation design. With a keen eye for detail and a mastery of design software, they can elevate your project\'s aesthetic and ensure your message stands out.',
        imageUrl: '/assets/profile/sunday.jpeg',
        skills: ['Graphic Design', 'Brand Identity', 'Presentation Design', 'Social Media Graphics', 'Adobe Creative Suite'],
        softwareProficiency: [{ name: 'Canva' }, { name: 'Adobe Photoshop' }, { name: 'Adobe Illustrator' }, { name: 'Figma' }],
        stats: { rating: 4.8, projectsCompleted: 25, responseRate: '96%' }
    },
    {
        id: 'va-gen-08', name: 'Angel A', type: 'General',
        tagline: 'Proactive generalist support for operations, marketing, and student success.',
        bio: 'Angel is a dynamic and versatile VA with a knack for marketing and lead generation. As an early-career professional, she is perfectly suited to support students and small businesses with a variety of tasks, from operational support to executing marketing campaigns. Her energy and willingness to learn make her a great asset.',
        imageUrl: '/assets/profile/angel.jpeg',
        skills: ['Operations Support', 'Marketing Assistance', 'Lead Generation', 'Social Media Scheduling', 'Student Support'],
        softwareProficiency: [{ name: 'Google Suite' }, { name: 'Canva' }, { name: 'Trello' }, { name: 'Sales Navigator' }],
        stats: { rating: 4.7, projectsCompleted: 15, responseRate: '98%' }
    },
    {
        id: 'va-gen-09', name: 'Monica A', type: 'General',
        tagline: 'Dedicated customer service professional for seamless client communication.',
        bio: 'Monica specializes in providing exceptional customer service and efficient email management. With a friendly demeanor and a problem-solving mindset, she ensures every customer interaction is positive and productive. She is an expert at managing high-volume inboxes and maintaining clear communication channels.',
        imageUrl: '/assets/profile/monica.jpeg',
        skills: ['Customer Service', 'Email Handling & Triage', 'Zendesk Support', 'Client Follow-up'],
        softwareProficiency: [{ name: 'Zendesk' }, { name: 'Gmail' }, { name: 'Microsoft Outlook' }, { name: 'Intercom' }],
        stats: { rating: 4.9, projectsCompleted: 32, responseRate: '97%' }
    },
    {
        id: 'va-gen-10', name: 'Ferlita A', type: 'General',
        tagline: 'Efficient operations and e-commerce support specialist.',
        bio: 'Ferlita is a detail-oriented VA with expertise in order management, supply chain tasks, and customer support. She excels in e-commerce environments, using project tracking tools to ensure smooth operations from order placement to delivery. Her reliability makes her ideal for businesses needing dependable operational support.',
        imageUrl: '/assets/profile/ferlita.jpeg',
        skills: ['Order Management', 'E-commerce Support', 'Customer Service', 'Project Tracking', 'Supply Chain Coordination'],
        softwareProficiency: [{ name: 'Shopify' }, { name: 'Asana' }, { name: 'Jira' }, { name: 'Google Sheets' }],
        stats: { rating: 4.8, projectsCompleted: 28, responseRate: '95%' }
    },
    {
        id: 'va-gen-11', name: 'IZZA J', type: 'General',
        tagline: 'Energetic sales and customer support assistant for growing teams.',
        bio: 'IZZA J is an enthusiastic VA specializing in sales support and customer service. She is adept at handling entry-level VA duties, making her a perfect fit for students needing project support or businesses looking for a motivated assistant to handle client interactions and sales-related tasks.',
        imageUrl: '/assets/profile/izza.jpeg',
        skills: ['Sales Support', 'Customer Service', 'Lead Follow-up', 'Data Entry', 'Administrative Tasks'],
        softwareProficiency: [{ name: 'Salesforce' }, { name: 'Google Suite' }, { name: 'HubSpot' }, { name: 'Slack' }],
        stats: { rating: 4.6, projectsCompleted: 18, responseRate: '94%' }
    },
    // Tech VAs
    {
        id: 'va-tech-01', name: 'Aaron J', type: 'Tech',
        tagline: 'Your go-to for IT project coordination and technical support.',
        bio: "I’m an energetic and detail-oriented IT professional with strong experience in Microsoft tools and project control services. I bring a results-focused approach to managing projects, ensuring they’re completed on time and within scope.",
        imageUrl: '/assets/profile/aaron.jpeg',
        skills: ['IT Project Coordination', 'Microsoft Office Tools (Excel, PowerPoint, Outlook)', 'Project Tracking & Risk Management', 'Administrative Tech Support'],
        softwareProficiency: [{ name: 'Microsoft Excel, PowerPoint, Outlook' }, { name: 'Jira' }, { name: 'Trello' }, { name: 'Asana' }],
        stats: { rating: 4.8, projectsCompleted: 25, responseRate: '95%' }
    },
    {
        id: 'va-tech-02', name: 'Dennis Y', type: 'Tech',
        tagline: 'Your technical support partner with 7+ years in IT and VA roles.',
        bio: "I’m a seasoned IT support professional with hands-on experience in hardware/software troubleshooting, helpdesk support, and administrative virtual assistant duties. I bridge technical gaps for clients who need fast, reliable assistance.",
        imageUrl: '/assets/profile/dennis.jpeg',
        skills: ['IT & Helpdesk Support', 'Software and Hardware Troubleshooting', 'Administrative Support', 'Account Receivables'],
        softwareProficiency: [{ name: 'Windows OS' }, { name: 'MS Office' }, { name: 'Remote Access Tools (TeamViewer, AnyDesk)' }, { name: 'Zendesk' }],
        stats: { rating: 4.7, projectsCompleted: 31, responseRate: '94%' }
    },
    {
        id: 'va-tech-03', name: 'Syd R', type: 'Tech',
        tagline: 'Data-driven SEO expert improving your digital visibility.',
        bio: 'I specialize in SEO, data analysis, and web optimization. I help businesses rank higher by applying data-driven insights and robust keyword strategies to boost organic traffic and performance.',
        imageUrl: '/assets/profile/syd.jpeg',
        skills: ['SEO Strategy & Audits', 'Data Analysis', 'Keyword Research', 'Website Optimization'],
        softwareProficiency: [{ name: 'Google Analytics' }, { name: 'SEMrush' }, { name: 'Ahrefs' }, { name: 'Excel' }],
        stats: { rating: 4.9, projectsCompleted: 40, responseRate: '98%' }
    },
    {
        id: 'va-tech-04', name: 'Christian R', type: 'Tech',
        tagline: 'SEO and visual content strategist for business growth.',
        bio: 'I’m a content and SEO strategist with a flair for data and visuals. I support digital campaigns through strong SEO execution, content plans, and analytics-backed strategies.',
        imageUrl: '/assets/profile/christian.jpeg',
        skills: ['On-page & Technical SEO', 'Content Strategy', 'Visual Design', 'Data Interpretation'],
        softwareProficiency: [{ name: 'Google Search Console' }, { name: 'Canva' }, { name: 'Notion' }, { name: 'SurferSEO' }],
        stats: { rating: 4.8, projectsCompleted: 36, responseRate: '97%' }
    },
    {
        id: 'va-tech-05', name: 'Casey M', type: 'Tech',
        tagline: 'Tech-savvy VA for finance, data, and scheduling support.',
        bio: 'With a background in finance and tech tools, I support clients with payroll, real-time monitoring, and data entry. Known for precision and deep knowledge of finance platforms.',
        imageUrl: '/assets/profile/casey.jpeg',
        skills: ['Payroll & Finance Analysis', 'Real-Time Monitoring', 'Data Entry & Management', 'Scheduling & Staffing Analysis'],
        softwareProficiency: [{ name: 'SAP' }, { name: 'Verint' }, { name: 'Xero' }, { name: 'Webflow' }, { name: 'MS Office Suite' }, { name: 'WordPress' }, { name: 'Canva' }, { name: 'ChatGPT' }],
        stats: { rating: 4.6, projectsCompleted: 22, responseRate: '92%' }
    },
    {
        id: 'va-tech-06', name: 'Michael E', type: 'Tech', 
        tagline: 'Bridging healthcare and technology with expert system support.', 
        bio: 'Michael leverages his healthcare background to provide specialized technical support for medical software and platforms. He assists clinics with EMR/EHR systems, telehealth platforms, and ensuring HIPAA-compliant tech operations.', 
        imageUrl: '/assets/profile/michael.jpeg', 
        skills: ['Healthcare IT Support', 'EMR/EHR Management', 'Telehealth Platform Support', 'HIPAA Tech Compliance'], 
        softwareProficiency: [{ name: 'Kareo' }, { name: 'DrChrono' }, { name: 'Zoom for Healthcare' }, { name: 'Zendesk' }], 
        stats: { rating: 4.9, projectsCompleted: 56, responseRate: '98%' }
    },
    {
        id: 'va-tech-07', name: 'Christiane P', type: 'Tech', 
        tagline: 'Creative website design and CMS support for businesses.', 
        bio: 'Christiane combines her writing skills with technical proficiency in website design. She specializes in building and maintaining websites on platforms like WordPress and Wix, ensuring they are not only functional but also have compelling content.', 
        imageUrl: '/assets/profile/christiane.jpeg', 
        skills: ['Website Design (WordPress, Wix)', 'CMS Management', 'Content Uploading', 'Basic HTML/CSS'], 
        softwareProficiency: [{ name: 'WordPress' }, { name: 'Wix' }, { name: 'Canva' }, { name: 'Google Docs' }], 
        stats: { rating: 4.9, projectsCompleted: 27, responseRate: '97%' }
    },
    {
        id: 'va-tech-08', name: 'Sunday', type: 'Tech',
        tagline: 'Creative graphic designer bringing your brand\'s vision to life.',
        bio: 'A skilled graphic designer with a passion for creating compelling visuals. Sunday specializes in branding, marketing materials, and presentation design. With a keen eye for detail and a mastery of design software, they can elevate your project\'s aesthetic and ensure your message stands out.',
        imageUrl: '/assets/profile/sunday.jpeg',
        skills: ['Graphic Design', 'Brand Identity', 'Presentation Design', 'Social Media Graphics', 'Adobe Creative Suite'],
        softwareProficiency: [{ name: 'Canva' }, { name: 'Adobe Photoshop' }, { name: 'Adobe Illustrator' }, { name: 'Figma' }],
        stats: { rating: 4.8, projectsCompleted: 25, responseRate: '96%' }
    },
    {
        id: 'va-tech-09', name: 'Ferlita A', type: 'Tech',
        tagline: 'Efficient operations and e-commerce support specialist.',
        bio: 'Ferlita is a detail-oriented VA with expertise in order management, supply chain tasks, and customer support. She excels in e-commerce environments, using project tracking tools to ensure smooth operations from order placement to delivery. Her reliability makes her ideal for businesses needing dependable operational support.',
        imageUrl: '/assets/profile/ferlita.jpeg',
        skills: ['Order Management', 'E-commerce Support', 'Customer Service', 'Project Tracking', 'Supply Chain Coordination'],
        softwareProficiency: [{ name: 'Shopify' }, { name: 'Asana' }, { name: 'Jira' }, { name: 'Google Sheets' }],
        stats: { rating: 4.8, projectsCompleted: 28, responseRate: '95%' }
    },
    // Health VAs
    {
        id: 'va-health-01', name: 'Michael E', type: 'Health',
        tagline: 'Supporting U.S. healthcare professionals with seamless virtual assistance.',
        bio: "With extensive experience working with healthcare professionals remotely, I specialize in patient communications, medical admin tasks, and documentation. I ensure operations run smoothly while complying with U.S. medical protocols.",
        imageUrl: '/assets/profile/michael.jpeg',
        skills: ['Patient Support Communication', 'Medical Records Organization', 'Appointment Scheduling', 'HIPAA Compliance Tasks'],
        softwareProficiency: [{ name: 'Kareo' }, { name: 'Google Workspace' }, { name: 'Microsoft Office' }, { name: 'Zoom' }],
        stats: { rating: 4.9, projectsCompleted: 56, responseRate: '98%' }
    },
    {
        id: 'va-health-02', name: 'Adeola A', type: 'Health',
        tagline: 'Reliable medical lab scientist with sharp attention to clinical accuracy.',
        bio: "I’m a certified medical laboratory scientist who can assist healthcare professionals with medical documentation, research, result verification, and quality assurance checks in lab reporting.",
        imageUrl: '/assets/profile/adeola.jpeg',
        skills: ['Medical Data Entry', 'Health Research Support', 'Laboratory Records Management', 'QA Reporting'],
        softwareProficiency: [{ name: 'MS Excel' }, { name: 'LIS (Laboratory Information Systems)' }, { name: 'Google Sheets' }, { name: 'Grammarly' }],
        stats: { rating: 5.0, projectsCompleted: 51, responseRate: '99%' }
    },
    {
        id: 'va-health-04', name: 'Casey M', type: 'Health',
        tagline: 'Efficient, accurate, and proactive in healthcare data and admin support.',
        bio: 'I specialize in managing payroll, scheduling, staffing analysis, and real-time monitoring – key tasks in large healthcare settings. My finance background helps with overpayments and analysis tasks.',
        imageUrl: '/assets/profile/casey.jpeg',
        skills: ['Payroll for Medical Staff', 'Scheduling and Forecasting', 'Real-time Monitoring', 'Patient Data Management'],
        softwareProficiency: [{ name: 'CMS' }, { name: 'Verint' }, { name: 'Xero' }, { name: 'Excel, Word, PowerPoint' }],
        stats: { rating: 4.9, projectsCompleted: 44, responseRate: '96%' }
    },
    // Security VAs
    {
        id: 'va-sec-01', name: 'Dennis Y', type: 'Security',
        tagline: 'Reliable Tech & Security Support for Seamless Operations',
        bio: 'Dennis brings over seven years of IT and administrative experience to security support roles. With a strong foundation in helpdesk operations, account handling, and hardware/software support, Dennis ensures smooth monitoring and rapid response to technical security needs.',
        imageUrl: '/assets/profile/dennis.jpeg',
        skills: ['Helpdesk Troubleshooting', 'Incident Reporting', 'System Monitoring', 'Remote Tech Support', 'Administrative Documentation'],
        softwareProficiency: [{ name: 'Microsoft Suite' }, { name: 'Zendesk' }, { name: 'CCTV Monitoring Tools' }, { name: 'Ticketing Systems' }],
        stats: { rating: 4.8, projectsCompleted: 22, responseRate: '97%' }
    },
    {
        id: 'va-sec-03', name: 'Cess R', type: 'Security',
        tagline: 'Executive Security Coordinator with Global Admin Expertise',
        bio: "Cess has worked across global teams handling confidential operations, monitoring internal systems, and preparing detailed reports for security reviews. Her executive background aligns well with strategic incident oversight and digital documentation.",
        imageUrl: '/assets/profile/cess.jpeg',
        skills: ['Executive Admin for Security Teams', 'Confidential Report Drafting', 'Remote Surveillance Briefing', 'Calendar & Access Scheduling'],
        softwareProficiency: [{ name: 'Google Workspace' }, { name: 'Excel & Trello' }, { name: 'Remote Monitoring Tools' }],
        stats: { rating: 5.0, projectsCompleted: 35, responseRate: '98%' }
    },
    {
        id: 'va-sec-04', name: 'Aaron J', type: 'Security',
        tagline: 'IT Security Assistant for Structured Risk Control',
        bio: 'Aaron blends his software engineering background with project control expertise, making him a strong fit for security environments needing structure, tech compliance, and access control audits.',
        imageUrl: '/assets/profile/aaron.jpeg',
        skills: ['Risk Identification & Mitigation', 'Incident Reporting Support', 'Access Log Auditing', 'Tech Policy Documentation'],
        softwareProficiency: [{ name: 'MS Project Suite' }, { name: 'Jira' }, { name: 'Trello' }, { name: 'Access Control Dashboards' }],
        stats: { rating: 4.7, projectsCompleted: 19, responseRate: '94%' }
    },
    {
        id: 'va-sec-05', name: 'Francis G', type: 'Security',
        tagline: 'Detail-Oriented Security Support with Client-Facing Agility',
        bio: "Francis combines client communication and strategic awareness to assist in proactive monitoring and timely reporting of suspicious events. He’s skilled in documenting reports and facilitating alerts between teams.",
        imageUrl: '/assets/profile/francis.jpeg',
        skills: ['Access Management Coordination', 'Security Client Reporting', 'Monitoring Response Support', 'Security Workflow Optimization'],
        softwareProficiency: [{ name: 'CRM Systems' }, { name: 'Microsoft Office' }, { name: 'CCTV Notification Systems' }],
        stats: { rating: 4.8, projectsCompleted: 26, responseRate: '95%' }
    },
    // Edu VAs
    {
        id: 'va-edu-01', name: 'Adewumi A', type: 'Edu',
        tagline: 'Helping scholars and researchers excel with precise academic support',
        bio: "As a university graduate and academic researcher, I specialize in managing schedules, organizing research materials, writing and proofreading academic content, and preparing structured citations. I’ve helped over 1500 individuals optimize their academic tasks.",
        imageUrl: '/assets/profile/adewumi.jpeg',
        skills: ['Academic Research', 'Proofreading', 'Content Writing', 'Citation Management', 'Schedule Coordination'],
        softwareProficiency: [{ name: 'Microsoft Office' }, { name: 'Google Suite' }, { name: 'Grammarly' }, { name: 'Mendeley' }],
        stats: { rating: 5.0, projectsCompleted: 38, responseRate: '99%' }
    },
    {
        id: 'va-edu-02', name: 'Christiane P', type: 'Edu',
        tagline: 'Elevating educational content through creativity and precision',
        bio: 'With strong skills in creative and business writing, I support clients in structuring educational materials and presentations. I have extensive experience in reading, understanding, and summarizing subject matter efficiently.',
        imageUrl: '/assets/profile/christiane.jpeg',
        skills: ['Creative Writing', 'Academic Proofreading', 'Content Development', 'Presentation Design'],
        softwareProficiency: [{ name: 'MS PowerPoint' }, { name: 'WordPress' }, { name: 'Canva' }, { name: 'Google Docs' }],
        stats: { rating: 4.9, projectsCompleted: 27, responseRate: '97%' }
    },
    {
        id: 'va-edu-03', name: 'Jesse L', type: 'Edu',
        tagline: 'Fueling education projects with data, content, and clarity',
        bio: 'I specialize in data entry, lead generation, and content moderation with a strong academic edge. I assist researchers and students in preparing quality reports and analyzing project data.',
        imageUrl: '/assets/profile/jesse.jpeg',
        skills: ['Data Entry & Cleanup', 'Content Moderation', 'Research Support', 'Report Structuring'],
        softwareProficiency: [{ name: 'Excel' }, { name: 'Google Sheets' }, { name: 'Notion' }, { name: 'Grammarly' }],
        stats: { rating: 4.8, projectsCompleted: 30, responseRate: '95%' }
    },
    {
        id: 'va-edu-04', name: 'Carla M', type: 'Edu',
        tagline: 'Seamless virtual and academic support to maximize productivity',
        bio: 'I bring strong organizational and administrative experience into the education sector, providing calendar management, project coordination, and administrative support to researchers and educators.',
        imageUrl: '/assets/profile/carla.jpeg',
        skills: ['Calendar & Task Coordination', 'Academic Scheduling', 'Document Formatting', 'Research Admin Support'],
        softwareProficiency: [{ name: 'MS Office' }, { name: 'Trello' }, { name: 'Zoom' }, { name: 'Asana' }],
        stats: { rating: 5.0, projectsCompleted: 35, responseRate: '98%' }
    },
    {
        id: 'va-edu-06', name: 'Joanne K', type: 'Edu', 
        tagline: 'Organized administrative support for educators and tutors.', 
        bio: 'Joanne applies her strong administrative skills to the education sector, assisting tutors and academic teams with scheduling, material preparation, and student communication, ensuring a smooth learning environment.', 
        imageUrl: '/assets/profile/joanne.jpeg', 
        skills: ['Tutor Scheduling', 'Course Material Formatting', 'Student Communication', 'Administrative Support'], 
        softwareProficiency: [{ name: 'Calendly' }, { name: 'Zoom' }, { name: 'Google Classroom' }, { name: 'Moodle' }], 
        stats: { rating: 4.8, projectsCompleted: 30, responseRate: '95%' }
    },
    {
        id: 'va-edu-07', name: 'Christian R', type: 'Edu', 
        tagline: 'Boosting educational content with data-driven SEO strategy.', 
        bio: 'Christian helps educational blogs, websites, and platforms improve their reach through expert SEO and content strategy. He analyzes data to create engaging content plans that attract and retain learners.', 
        imageUrl: '/assets/profile/christian.jpeg', 
        skills: ['SEO for Education', 'Content Strategy', 'Academic Blog Management', 'Data Analysis'], 
        softwareProficiency: [{ name: 'Google Search Console' }, { name: 'Canva' }, { name: 'Notion' }, { name: 'SurferSEO' }], 
        stats: { rating: 4.8, projectsCompleted: 36, responseRate: '97%' }
    },
    // Student VAs
    {
        id: 'va-student-02', name: 'Jesse L', type: 'Student',
        tagline: 'Boosting student productivity through data-driven precision',
        bio: 'With a knack for lead generation and content moderation, I also help students tackle research projects and manage academic data entry. I blend analytical thinking with attention to detail.',
        imageUrl: '/assets/profile/jesse.jpeg',
        skills: ['Data Entry', 'Research Compilation', 'Academic Content Moderation', 'Document Cleanup'],
        softwareProficiency: [{ name: 'Excel' }, { name: 'Google Docs' }, { name: 'Notion' }, { name: 'Grammarly' }],
        stats: { rating: 4.8, projectsCompleted: 29, responseRate: '97%' }
    },
    {
        id: 'va-student-04', name: 'Kesiah P', type: 'Student',
        tagline: 'Simplifying student life with proactive academic support',
        bio: 'I help students stay organized and stress-free by managing deadlines, compiling notes, and proofreading essays. I bring an administrative eye to academic tasks.',
        imageUrl: '/assets/profile/kesiah.jpeg',
        skills: ['Schedule Management', 'Essay Proofreading', 'Note-Taking Assistance', 'Google Calendar Management'],
        softwareProficiency: [{ name: 'Google Calendar' }, { name: 'MS Word' }, { name: 'Trello' }, { name: 'Grammarly' }],
        stats: { rating: 5.0, projectsCompleted: 22, responseRate: '96%' }
    },
    {
        id: 'va-student-06', name: 'Angel A', type: 'Student',
        tagline: 'Proactive generalist support for operations, marketing, and student success.',
        bio: 'Angel is a dynamic and versatile VA with a knack for marketing and lead generation. As an early-career professional, she is perfectly suited to support students and small businesses with a variety of tasks, from operational support to executing marketing campaigns. Her energy and willingness to learn make her a great asset.',
        imageUrl: '/assets/profile/angel.jpeg',
        skills: ['Operations Support', 'Marketing Assistance', 'Lead Generation', 'Social Media Scheduling', 'Student Support'],
        softwareProficiency: [{ name: 'Google Suite' }, { name: 'Canva' }, { name: 'Trello' }, { name: 'Sales Navigator' }],
        stats: { rating: 4.7, projectsCompleted: 15, responseRate: '98%' }
    },
    {
        id: 'va-student-07', name: 'IZZA J', type: 'Student',
        tagline: 'Energetic sales and customer support assistant for growing teams.',
        bio: 'IZZA J is an enthusiastic VA specializing in sales support and customer service. She is adept at handling entry-level VA duties, making her a perfect fit for students needing project support or businesses looking for a motivated assistant to handle client interactions and sales-related tasks.',
        imageUrl: '/assets/profile/izza.jpeg',
        skills: ['Sales Support', 'Customer Service', 'Lead Follow-up', 'Data Entry', 'Administrative Tasks'],
        softwareProficiency: [{ name: 'Salesforce' }, { name: 'Google Suite' }, { name: 'HubSpot' }, { name: 'Slack' }],
        stats: { rating: 4.6, projectsCompleted: 18, responseRate: '94%' }
    },
    {
        id: 'va-student-08', name: 'Dannah S', type: 'Student',
        tagline: 'Reliable support for students and entry-level administrative tasks.',
        bio: 'Dannah provides excellent support for students and businesses needing help with customer service and basic administrative tasks. She is a quick learner and is committed to delivering high-quality work, making her a great choice for those needing an affordable and dependable assistant.',
        imageUrl: '/assets/profile/dannah.jpeg',
        skills: ['Customer Service', 'Data Entry', 'Email Correspondence', 'Scheduling'],
        softwareProficiency: [{ name: 'Microsoft Office' }, { name: 'Google Calendar' }, { name: 'Gmail' }, { name: 'Canva' }],
        stats: { rating: 4.5, projectsCompleted: 12, responseRate: '95%' }
    }
];


export const faqs: Faq[] = [
  {
    question: 'What types of virtual assistants does Catazet offer?',
    answer: 'Catazet offers a wide range of virtual assistants specializing in administrative support, customer service, marketing, technical support, content creation, and more. Our VAs are skilled across various industries to meet diverse business needs.',
  },
  {
    question: 'How does Catazet vet its virtual assistants?',
    answer: 'Our VAs undergo a rigorous vetting process including skill assessments, background checks, and interviews to ensure they possess the necessary expertise and professionalism. We only connect you with pre-screened, highly qualified talent.',
  },
  {
    question: 'Where are your virtual assistants from?',
    answer: 'Our virtual assistants are primarily based in talent-rich countries like the Philippines, India, and Nigeria. This allows us to offer a diverse range of skills and ensure high-quality service across different time zones.',
  },
  {
    question: 'What is the typical onboarding process for a new VA?',
    answer: 'Once matched, you’ll have an initial consultation with your VA to discuss your project, goals, and expectations. Our team provides ongoing support to ensure a smooth transition and successful collaboration.',
  },
];

export const monthlyPricingPlans: PricingPlan[] = [
  {
    name: 'General VAs',
    price: '800',
    priceSuffix: '/month',
    description: 'Comprehensive support for all general administrative and operational tasks.',
    features: [
      '200 hours VA support',
      'Email & Calendar Management',
      'Advanced Data Entry',
      'Monthly Reporting',
    ],
    isFeatured: false,
    buttonText: 'Choose General',
    stripeUrl: 'https://buy.stripe.com/3cI7sK8jPfjq4IxgnQdjO0n',
  },
  {
    name: 'Tech VAs',
    price: '1000',
    priceSuffix: '/month',
    description: 'Specialized technical assistance for IT, software, and digital-first businesses.',
    features: [
      '200 hours specialist VA support',
      'Technical Troubleshooting',
      'Software Assistance',
      'Priority Tech Support',
    ],
    isFeatured: true,
    buttonText: 'Choose Tech',
    stripeUrl: 'https://buy.stripe.com/3cI00idE99Z6fnb0oSdjO0l',
  },
  {
    name: 'Edu VAs',
    price: '800',
    priceSuffix: '/month',
    description: 'Tailored for educators, academic institutions, and e-learning platforms.',
    features: [
      '200 hours VA support',
      'Course Material Preparation',
      'Student Communication',
      'LMS Management',
    ],
    isFeatured: false,
    buttonText: 'Choose Edu',
    stripeUrl: 'https://buy.stripe.com/4gM9ASgQlb3afnbb3wdjO0j',
  },
    {
    name: 'Health VAs',
    price: '950',
    priceSuffix: '/month',
    description: 'HIPAA-compliant assistance for healthcare professionals and clinics.',
    features: [
      '200 hours VA support',
      'Appointment Scheduling',
      'Patient Follow-ups',
      'Medical Billing & Coding',
    ],
    isFeatured: false,
    buttonText: 'Choose Health',
    stripeUrl: 'https://buy.stripe.com/7sY4gy57D0owgrf7RkdjO0h',
  },
  {
    name: 'Security VAs',
    price: '900',
    priceSuffix: '/month',
    description: 'Remote monitoring and security-related administrative tasks for businesses.',
    features: [
      '200 hours VA support',
      'Remote CCTV Monitoring',
      'Incident Reporting',
      'Access Control Management',
    ],
    isFeatured: false,
    buttonText: 'Choose Security',
    stripeUrl: 'https://buy.stripe.com/bJedR88jPc7e3Et0oSdjO0f',
  },
  {
    name: 'Student VAs',
    price: '150',
    priceSuffix: '/month',
    description: 'Affordable academic support for university students.',
    features: [
      '30 days VA support',
      'Research Assistance',
      'Proofreading & Editing',
      'Flexible Scheduling',
    ],
    isFeatured: false,
    buttonText: 'Choose Student',
    stripeUrl: 'https://buy.stripe.com/8x25kC9nT6MU1wl2x0djO0d',
  },
];

export const oneTimePricingPlans: PricingPlan[] = [
  {
    name: 'General VAs (Project)',
    price: '800',
    priceSuffix: '',
    description: 'Get 30 days of dedicated general VA support for your project.',
    features: [
      '200 hours VA support',
      'Dedicated Project Manager',
      'Daily Updates',
      'Final Report',
    ],
    isFeatured: false,
    buttonText: 'Start Project',
    stripeUrl: 'https://buy.stripe.com/bJe5kCeId0owdf3dbEdjO0m',
  },
  {
    name: 'Tech VAs (Project)',
    price: '1000',
    priceSuffix: '',
    description: 'Specialized tech support for a single project, up to 30 days.',
    features: [
      '200 hours specialist support',
      'Technical Consultation',
      'QA & Testing',
      'Project Documentation',
    ],
    isFeatured: true,
    buttonText: 'Start Project',
    stripeUrl: 'https://buy.stripe.com/28EaEW43z7QYb6VgnQdjO0k',
  },
  {
    name: 'Edu VAs (Project)',
    price: '800',
    priceSuffix: '',
    description: 'Dedicated academic and educational support for a 30-day project.',
    features: [
      '200 hours VA support',
      'Course Material Prep',
      'Research & Proofreading',
      'Project Documentation',
    ],
    isFeatured: false,
    buttonText: 'Start Project',
    stripeUrl: 'https://buy.stripe.com/fZubJ0fMhc7e8YN0oSdjO0i',
  },
  {
    name: 'Health VAs (Project)',
    price: '950',
    priceSuffix: '',
    description: 'HIPAA-compliant healthcare admin support for a 30-day project.',
    features: [
      '200 hours specialist support',
      'Patient Scheduling',
      'Medical Billing Assistance',
      'Confidential Handling',
    ],
    isFeatured: false,
    buttonText: 'Start Project',
    stripeUrl: 'https://buy.stripe.com/eVqcN4eId1sAb6VfjMdjO0g',
  },
  {
    name: 'Security VAs (Project)',
    price: '900',
    priceSuffix: '',
    description: 'Remote security monitoring and admin for a 30-day project.',
    features: [
      '200 hours VA support',
      'CCTV Monitoring Setup',
      'Incident Reporting',
      'Access Control Logging',
    ],
    isFeatured: false,
    buttonText: 'Start Project',
    stripeUrl: 'https://buy.stripe.com/dRm00ibw18V2grffjMdjO0e',
  },
  {
    name: 'Student VAs (Project)',
    price: '150',
    priceSuffix: '',
    description: 'Affordable academic support for university students for 30 days.',
    features: [
      '30 days VA support',
      'Research Assistance',
      'Proofreading & Editing',
      'Flexible Scheduling',
    ],
    isFeatured: false,
    buttonText: 'Start Project',
    stripeUrl: 'https://buy.stripe.com/8x25kC9nT6MU1wl2x0djO0d',
  },
];

export const sampleTaskPlan: PricingPlan = {
  name: 'Paid Sample Task',
  price: '50',
  priceSuffix: '',
  description: 'A one-time task to evaluate skills before committing.',
  features: [
    'One small, defined task',
    'Direct communication with VA',
    'Evaluate work quality & style',
    'Typical 48-hour turnaround',
  ],
  isFeatured: false,
  buttonText: 'Purchase Task',
  stripeUrl: 'https://buy.stripe.com/test_5kAdR8gQla7a3EtfZ2', // Example Stripe link
};

export const footerLinks: FooterSection[] = [
  {
    title: 'Company',
    links: [
      { title: 'About', href: 'about' },
      { title: 'Services', href: 'services' },
      { title: 'Pricing', href: 'pricing' },
      { title: 'Blog', href: 'blog' },
      { title: 'Contact Us', href: 'contact' },
    ],
  },
  {
    title: 'Programs',
    links: [
      { title: 'Volunteer Program', href: 'volunteer-program' },
      { title: 'Free Courses', href: 'courses' },
      { title: 'All VAs', href: 'all-vas' },
      { title: 'Become a VA', href: 'contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { title: 'Privacy Policy', href: 'privacy-policy' },
      { title: 'Terms of Service', href: 'terms-of-service' },
    ],
  },
];

// --- ABOUT PAGE CONSTANTS ---
export const aboutPageFeatures: AboutFeature[] = [
    { icon: <UsersGroupIcon />, title: 'Vetted Global Talent', description: 'We rigorously screen for skill, professionalism, and reliability.' },
    { icon: <TrendingUpIcon />, title: 'Scalable Solutions', description: 'Easily scale your support team up or down as your business needs change.' },
    { icon: <BriefcaseIcon />, title: 'Ethical Sourcing', description: 'We are committed to fair wages and creating sustainable careers.' },
    { icon: <ChatBubbleIcon />, title: 'Dedicated Support', description: 'Our success team is always here to ensure a smooth partnership.' },
];
export const coreValues: CoreValue[] = [
    { icon: <IntegrityIcon />, title: 'Integrity', description: 'We operate with transparency and honesty in all our interactions.' },
    { icon: <EmpowermentIcon />, title: 'Empowerment', description: 'We empower businesses to grow and talent to thrive.' },
    { icon: <ExcellenceIcon />, title: 'Excellence', description: 'We are committed to delivering the highest quality of service.' },
    { icon: <CollaborationIcon />, title: 'Collaboration', description: 'We believe in building strong, collaborative partnerships.' },
];
export const leadershipTeam: TeamMember[] = [
    {
        name: 'Peter Adegoroye',
        title: 'Founder & CEO',
        imageUrl: '/assets/profile/peter.jpeg',
        bio: 'Peter founded Catazet with a vision to bridge the gap between global businesses and the vast, untapped talent pool in Asia and Africa. With a background in tech and entrepreneurship, he is passionate about creating economic opportunities and driving business efficiency through smart-sourcing.',
        socials: {
            linkedin: 'https://www.linkedin.com/in/peter-adegoroye-524091149/',
            twitter: 'https://x.com/Peterfl17?t=7bBzaJfeVM9UNjjXxNcr7g&s=09',
        }
    }
];

// --- VOLUNTEER PAGE CONSTANTS ---
export const volunteerBenefits: VolunteerBenefit[] = [
  { icon: <ExperienceIcon/>, title: 'Real-World Experience', description: 'Work on actual client projects and build a strong portfolio.' },
  { icon: <NetworkIcon/>, title: 'Mentorship', description: 'Receive guidance and support from an experienced Senior VA.' },
  { icon: <NewSkillsIcon/>, title: 'Skill Development', description: 'Enhance your skills with hands-on tasks and professional feedback.' },
  { icon: <ImpactIcon/>, title: 'Career Pathway', description: 'Successful volunteers are prioritized for future paid opportunities.' },
];
export const volunteerSteps: VolunteerStep[] = [
  { step: 1, title: 'Submit Application', description: 'Fill out our online form to tell us about your skills and interests.' },
  { step: 2, title: 'Assessment', description: 'Complete a short skills assessment to showcase your capabilities.' },
  { step: 3, title: 'Interview', description: 'Meet with our team to discuss your goals and fit for the program.' },
  { step: 4, title: 'Start Volunteering', description: 'Get matched with a mentor and begin working on your first project.' },
];
export const volunteerTestimonials: VolunteerTestimonial[] = [
    { quote: 'The volunteer program was an incredible launchpad for my career. The mentorship I received was invaluable!', name: 'Adewumi A', role: 'Former Volunteer, now General VA', imageUrl: '/assets/profile/adewumi.jpeg' },
    { quote: 'I gained so much practical experience in just a few months. It gave me the confidence to apply for paid roles.', name: 'Sunday', role: 'Former Volunteer, now General VA', imageUrl: '/assets/profile/sunday.jpeg' },
];
export const volunteerFaqs: Faq[] = [
    { question: "Is this a paid position?", answer: "No, the Volunteer Program is an unpaid, experience-focused opportunity designed to help you build your portfolio and skills." },
    { question: "What is the time commitment?", answer: "We ask for a commitment of 10-15 hours per week to ensure you get meaningful experience from the program." },
    { question: "Can this lead to a paid job?", answer: "Absolutely. Our goal is to transition successful volunteers into paid roles at Catazet as opportunities become available." },
];

// --- COURSES PAGE CONSTANTS ---
export const courses: Course[] = [
    { id: 'c1', title: 'Virtual Assistant Fundamentals', description: 'Master the core skills every VA needs, from communication to time management.' },
    { id: 'c2', title: 'Advanced Social Media Management', description: 'Learn strategies for content creation, scheduling, analytics, and community engagement.' },
    { id: 'c3', title: 'Data Analytics for Beginners', description: 'Get started with data analysis, from spreadsheets to basic visualization tools.' },
    { id: 'c4', title: 'AI for Productivity', description: 'Learn how to leverage AI tools to enhance your efficiency and service offerings.' },
    { id: 'c5', title: 'Customer Support Excellence', description: 'Develop skills in providing top-tier customer service through various channels.' },
    { id: 'c6', title: 'E-commerce Management Bootcamp', description: 'A deep dive into managing online stores on platforms like Shopify and WooCommerce.' },
];

// --- BLOG POSTS DYNAMIC GENERATION ---

const categories = ['Remote Work', 'Productivity', 'Hiring', 'Business Growth', 'VA Skills', 'Case Study', 'Comparison'];

const generateUniquePosts = (count: number): BlogPost[] => {
    const posts: BlogPost[] = [];

    const genericTitles = [
        "The Future of Remote Work: Are You Ready?", "Beyond the Inbox: 10 Strategic Tasks for Your VA", "Hiring Your First VA: The Ultimate Checklist", "The Global Talent Advantage: Why Businesses Hire VAs from the Philippines & India", "Tech VA vs. General VA: Which Does Your Startup Need?", "5 Signs It's Time to Hire a Virtual Assistant", "How to Onboard Your New Virtual Assistant for Maximum Success", "Mastering Delegation: A Guide for Busy Entrepreneurs", "The ROI of a Virtual Assistant: A Cost-Benefit Analysis", "Boosting E-commerce Sales with a Specialized VA", "HIPAA-Compliant VAs: A Guide for Healthcare Professionals", "Scaling Your Agency with a Team of Virtual Assistants", "From Chaos to Calm: How a VA Can Organize Your Life", "The Top 10 Software Tools Your Virtual Assistant Should Master", "Virtual Assistants for Solopreneurs: Your Secret Weapon for Growth", "How VAs Can Supercharge Your Content Marketing Strategy", "The Rise of the Fractional VA: Expert Help on a Budget", "Cybersecurity for Remote Teams: The Role of a Security VA", "Managing a Remote Team: Tips for Effective Collaboration with Your VA", "A Day in the Life of a Catazet Virtual Assistant", "Why Vetting is the Most Important Step in Hiring a VA", "Unlocking Global Markets with a Multilingual VA", "The Ed-Tech Revolution: How VAs are Supporting Online Learning", "Data Entry Doesn't Have to Be a Drag: Automate and Delegate", "Building a Long-Term Partnership with Your Virtual Assistant", "How a Real Estate VA Can Help You Close More Deals", "Social Media Management: From Scheduling to Strategy with a VA", "The Legal Industry's Newest Asset: The Virtual Paralegal", "Customer Support Excellence: How VAs Improve Client Retention", "Work-Life Balance for Entrepreneurs: Reclaim Your Life with a VA",
    ];

    const competitiveTitles = [
        "Catazet vs. Upwork: Why Our Vetted Talent Wins Every Time", "Fiverr vs. Catazet for VAs: A Deep Dive into Quality and Reliability", "The Catazet Difference: More Than Just a Freelancer Marketplace", "Time Doctor or Catazet's Platform: An Integration Comparison", "Why Choose Catazet's Specialized VAs Over a Generalist Agency?", "Comparing VA Costs: Catazet's Transparent Pricing vs. The Competition", "The Ethical Advantage: Catazet's Commitment to Fair Pay for VAs", "Scalability Secrets: How Catazet Outperforms Other VA Solutions", "Dedicated Support Showdown: Why Catazet's Model is Superior", "Vetting VAs: Catazet's Rigorous Process vs. The Gig Economy Gamble", "Cultural Fit Matters: How Catazet's Matching Algorithm Excels", "The Global Talent Advantage: Why Catazet Leads the Way", "Security First: How Catazet Protects Your Business Data Better", "Building Long-Term Partnerships: The Catazet vs. TaskRabbit Approach", "ROI Analysis: Catazet vs. Hiring a Local Part-Time Assistant", "Specialized VAs: Why Catazet's Niche Talent Beats Generalist Platforms", "Onboarding Made Easy: The Catazet Advantage Over DIY Hiring", "Case Study: Why We Switched from Freelancer.com to Catazet", "Is Belay Worth The Price? An Honest Comparison with Catazet", "Fancy Hands vs. Catazet: Task-Based Assistance vs. Dedicated Partnership", "The Catazet Ecosystem: A Holistic Approach to Remote Delegation", "GetMatched vs. Catazet: A Look at VA Matching Technologies", "Why Catazet's Focus on Global Talent is a Business Advantage", "Stop Searching, Start Working: Catazet's Speed to Hire vs. Marketplaces", "The Myth of the $5/hr VA: Why Catazet Offers Unbeatable Value", "Full-Time Support, Flexible Costs: Unpacking the Catazet Model", "Navigating Time Zones: How Catazet Makes Global Collaboration Seamless", "VA Training and Development: An Edge You Only Get with Catazet", "A Better Alternative to OnlineJobs.ph for High-Skill Roles", "The Hidden Costs of DIY VA Hiring and How Catazet Eliminates Them", "Catazet for Startups: A More Strategic Choice Than Upwork or Fiverr", "Client Success Stories: The Overwhelming Consensus for Catazet", "What Other VA Companies Don't Tell You About Their Vetting Process", "Catazet's Tech Stack Integration vs. The Hassle of Standalone VAs", "The Importance of a Single Point of Contact: The Catazet Management Model", "Data Security & NDAs: How Catazet Leads the Pack in Client Protection", "Transparent vs. Opaque: A Look at VA Company Pricing Models", "Why Catazet Represents the Future of Global Remote Work", "The Unmatched Power of a Curated and Managed Talent Pool", "Catazet's Proactive Management vs. The Pitfalls of Self-Managed VAs"
    ];

    const genericContent = [
        "In the modern digital economy, the quest for business growth is relentless. Entrepreneurs and executives are perpetually juggling strategic planning, client relations, and operational management. The result is often a packed schedule where high-value activities are crowded out by a never-ending list of administrative tasks. This is precisely where a Virtual Assistant (VA) steps in, not just as an extra pair of hands, but as a strategic partner. A skilled VA from Catazet can revolutionize your workflow, handling everything from calendar management to complex research, thereby freeing you to focus on what you do best: driving your business forward.",
        "### The Catazet Difference: Unlocking Global Talent",
        "While the concept of a VA is not new, Catazet's approach is. We are dedicated to sourcing, vetting, and training top-tier talent from key global hubs like the Philippines, India, and Nigeria. This focus allows us to tap into a rich, diverse, and highly motivated talent pool. Our rigorous, multi-stage vetting process goes beyond just checking skills. We assess for professionalism, communication, problem-solving abilities, and a proactive mindset. When you hire a Catazet VA, you're not just getting a task-doer; you're integrating a dedicated professional who is invested in your success and supported by our robust management framework.",
        "### What Can a Virtual Assistant Do For You?",
        "The possibilities are vast and can be tailored to your specific industry and needs. A General Administrative VA can manage your inbox, schedule appointments, handle data entry, and prepare documents. A Tech VA can offer software assistance, conduct QA testing, or manage your e-commerce platform. For healthcare professionals, our HIPAA-compliant Health VAs can manage patient follow-ups and medical billing. From social media management to academic research, the right VA can absorb the tasks that consume your time, allowing for greater efficiency and specialization within your core team. This isn't just about outsourcing; it's about smart-sourcing to build a more resilient and agile operation.",
        "### Strategic Delegation: The Key to Scaling",
        "Effective delegation is one of the most critical skills for any business leader, yet it is often the hardest to master. A VA acts as the perfect catalyst for developing this skill. By building a partnership with your assistant, you learn to define tasks clearly, set expectations, and trust in your team. This process has a ripple effect across your entire organization, fostering a culture of empowerment and efficiency. The return on investment (ROI) of a VA is not just measured in saved hours, but in the new opportunities you can pursue, the strategic thinking you have time for, and the improved work-life balance that prevents burnout. It's an investment in sustainable growth.",
        "### Conclusion: Your Partner in Productivity",
        "Hiring a Virtual Assistant is more than a business transaction; it's a strategic decision to optimize your most valuable resource: your time. With Catazet, you gain a reliable partner committed to your long-term success. We handle the complexities of recruitment, payroll, and support, allowing you to seamlessly integrate world-class talent into your operations. Take the first step towards reclaiming your schedule and unlocking your business's full potential. Discover the Catazet advantage today and see how our skilled virtual assistants can catalyze your productivity and drive remarkable growth."
    ];

    const competitiveContent = [
        "Navigating the world of remote talent can feel like a gamble. Freelancer marketplaces like [Competitor] present a seemingly endless ocean of profiles, promising cheap labor and quick turnarounds. However, this 'gig economy' model often places the entire burden of vetting, hiring, and managing on the business owner. How do you verify skills? How do you ensure reliability and data security? How do you build a long-term partnership from a transactional platform? Catazet was founded to answer these questions, offering a curated, managed, and fundamentally more reliable alternative to the marketplace lottery.",
        "### The Quality Chasm: Marketplaces vs. Managed Services",
        "The core difference lies in our model. Catazet is not a marketplace; we are a managed virtual assistant service. We invest heavily in a rigorous, multi-stage vetting process that assesses not only technical skills but also soft skills like communication, proactivity, and cultural fit. While on a platform like [Competitor] you might spend days filtering through proposals of varying quality, we present you with a shortlist of pre-qualified professionals who meet your specific criteria. We eliminate the guesswork and risk, providing you with talent you can trust from day one. This is the difference between hoping for a good outcome and guaranteeing one.",
        "### Beyond the Hire: The Power of Dedicated Support",
        "Once you hire a freelancer from a marketplace, the platform's job is largely done. You are left to manage the relationship, handle any issues, and ensure productivity. With Catazet, the hire is just the beginning of our partnership. Every client is assigned a dedicated success manager who provides ongoing support, facilitates communication, and ensures a seamless integration of your VA into your team. This management layer is crucial for long-term success. It means you have a single point of contact for any concerns, performance tracking is handled, and you have a partner dedicated to optimizing the relationship for maximum ROI.",
        "### Ethical Sourcing and True Value",
        "The race to the bottom on pricing seen on many platforms often comes at a hidden cost: quality, reliability, and ethics. Catazet is built on a foundation of ethical sourcing and fair pay. We believe that providing our VAs with stable careers and competitive compensation leads to higher motivation, lower turnover, and ultimately, better results for our clients. Our transparent pricing model means you know exactly what you're paying for—a highly skilled, dedicated professional backed by a world-class support system. This provides far greater value than a low hourly rate from an unvetted freelancer, which often leads to missed deadlines, poor quality work, and the hidden cost of re-doing tasks.",
        "### Conclusion: Choose Partnership over Platform",
        "Choosing a VA provider is a critical business decision. While freelancer marketplaces offer choice, Catazet offers certainty. We provide a holistic ecosystem designed for sustained success: elite talent, dedicated management, robust security, and an ethical foundation. Don't leave your business's efficiency to chance. Invest in a true partnership that prioritizes quality, reliability, and long-term growth. Choose Catazet and experience the peace of mind that comes from having a dedicated, managed team member committed to your success."
    ];

    const startDate = new Date('2025-01-01').getTime();
    const endDate = new Date().getTime();
    const dateRange = endDate - startDate;

    for (let i = 0; i < count; i++) {
        const isCompetitive = i % 4 === 0 && competitiveTitles.length > 0;
        const title = isCompetitive ? competitiveTitles[i % competitiveTitles.length] : genericTitles[i % genericTitles.length];
        
        let content = isCompetitive ? competitiveContent.join('\n\n') : genericContent.join('\n\n');
        
        if (isCompetitive) {
            const competitorMatch = title.match(/(?:vs|to)\s+([A-Za-z]+)/i);
            const competitorName = competitorMatch ? competitorMatch[1] : 'other marketplaces';
            content = content.replace(/\[Competitor\]/g, competitorName);
        }

        const randomTimestamp = startDate + Math.random() * dateRange;
        const randomDate = new Date(randomTimestamp);
        
        posts.push({
            id: i,
            title: title,
            excerpt: `Discover why Catazet's approach to virtual assistance is the superior choice for growing businesses. A must-read for any entrepreneur.`,
            imageUrl: `/assets/blogimage/blogimage.jpeg`,
            author: 'Catazet Insights',
            date: randomDate.toISOString().split('T')[0],
            category: isCompetitive ? 'Comparison' : categories[i % (categories.length - 1)], // -1 to avoid 'Comparison'
            content: content
        });
    }
    return posts;
};

export const blogPosts: BlogPost[] = generateUniquePosts(100);

export const blogComments: Comment[] = [
  { id: 1, postId: 0, author: 'Alex Johnson', date: '2025-03-15', text: 'This is a fantastic comparison. Really highlights the value of a managed service.', avatarUrl: '/assets/profile/comment.png' },
  { id: 2, postId: 0, author: 'Donald', date: '2025-07-26', text: 'Great points! We switched to Catazet and have never looked back. The quality is just on another level.', avatarUrl: '/assets/profile/comment.png' },
  { id: 3, postId: 1, author: 'Mary', date: '2025-05-12', text: 'Remote work is definitely the future. Thanks for the insightful article.', avatarUrl: '/assets/profile/comment.png' },
];


// --- DASHBOARD CONSTANTS ---

// Admin
export const adminNavLinks: AdminNavLink[] = [
    { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'pages', name: 'Pages', icon: <PagesIcon /> },
    { id: 'users', name: 'Users', icon: <UsersIcon className="w-5 h-5"/> },
    { id: 'payments', name: 'Payments', icon: <PaymentsIcon /> },
    { id: 'media', name: 'Media', icon: <MediaIcon /> },
    { id: 'blog', name: 'Blog', icon: <BlogIcon /> },
];
export const adminSettingsLink: AdminNavLink = { id: 'settings', name: 'Settings', icon: <SettingsIcon /> };
export const adminLogoutLink: AdminNavLink = { id: 'logout', name: 'Logout', icon: <LogoutIcon /> };
export const adminUsers: AdminUser[] = [
    { id: 1, name: 'Adewumi A', email: 'adewumi.a@catazet.va', avatarUrl: '/assets/profile/adewumi.jpeg', role: 'Virtual Assistant', level: 3, status: 'Active', lastLogin: '2024-07-22', ipAddress: '192.168.1.1' },
    { id: 2, name: 'Tesla', email: 'client@example.com', avatarUrl: '/assets/profile/comment.png', role: 'Client', status: 'Active', lastLogin: '2024-07-21', ipAddress: '10.0.0.1' },
    { id: 3, name: 'Chiamaka Nwosu', email: 'volunteer@example.com', avatarUrl: '/assets/profile/comment.png', role: 'Volunteer', status: 'Pending', lastLogin: '2025-06-20', ipAddress: '172.16.0.1' },
];
export const adminStats: AdminStat[] = [
    { title: 'Total Revenue', value: '$12,450', change: '+12.5%', changeType: 'increase', icon: <DollarSignIcon className="w-6 h-6"/> },
    { title: 'New Users', value: '24', change: '+5.2%', changeType: 'increase', icon: <UsersGroupIcon className="w-6 h-6"/> },
    { title: 'Active Projects', value: '15', change: '-2.1%', changeType: 'decrease', icon: <ActivityIcon className="w-6 h-6"/> },
    { title: 'Support Tickets', value: '8', change: '+10.0%', changeType: 'increase', icon: <ChatBubbleIcon className="w-6 h-6"/> },
];
export const adminPages: AdminPageContent[] = [
    { id: 'home', title: 'Homepage', lastUpdated: '2025-05-20', updatedBy: 'Admin', status: 'Published' },
    { id: 'about', title: 'About Us', lastUpdated: '2025-03-15', updatedBy: 'Admin', status: 'Published' },
];
export const adminPayments: AdminPayment[] = [
    { id: 'pay_1', clientName: 'John Doe', clientEmail: 'client@example.com', amount: 800, date: '2025-06-01', status: 'Paid', plan: 'General VAs' },
    { id: 'pay_2', clientName: 'Jane Smith', clientEmail: 'jane.s@startup.com', amount: 1000, date: '2025-06-05', status: 'Paid', plan: 'Tech VAs' },
];
export const adminMedia: AdminMediaFile[] = [
    { id: 'media_1', name: 'team-photo.jpg', url: '/assets/profile/comment.png', type: 'image', size: '1.2 MB', uploadedAt: '2024-07-10' },
];

// Client
export const clientUser = {
  id: 'client-1',
  name: 'Tesla',
  email: 'client@example.com',
  avatarUrl: '/assets/profile/comment.png'
};
export const initialClientProjects: ClientProject[] = [
    { id: 'proj-1', title: 'General Admin Support', vaId: 'va-gen-01', clientId: 'client-1', status: 'Active', startDate: '2025-04-01', rate: '$800/month' },
    { id: 'proj-2', title: 'IT & Helpdesk Support', vaId: 'va-tech-02', clientId: 'client-1', status: 'Completed', startDate: '2025-05-15', rate: '$1000/month' },
];
export const initialClientBillingHistory: ClientBillingRecord[] = [
    { id: 'bill-1', date: '2025-05-01', description: 'Subscription - General VAs', amount: 800, status: 'Paid', invoiceId: 'INV-20240701' },
    { id: 'bill-2', date: '2025-06-11', description: 'Subscription - Tech VAs', amount: 1000, status: 'Paid', invoiceId: 'INV-20240601' },
];
export const clientNavLinks: ClientNavLink[] = [
    { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'find-va', name: 'Find a VA', icon: <SearchIcon className="w-5 h-5" /> },
    { id: 'projects', name: 'My Projects', icon: <ProjectsIcon /> },
    { id: 'messages', name: 'Messages', icon: <ChatBubbleIcon className="w-5 h-5"/> },
    { id: 'billing', name: 'Billing', icon: <BillingIcon /> },
];
export const clientSettingsLink: ClientNavLink = { id: 'settings', name: 'Settings', icon: <SettingsIcon /> };
export const clientMessageThreads: ClientMessageThread[] = [
    { id: 'thread-1', vaId: 'va-gen-01', vaName: 'Adewumi A', vaImageUrl: detailedVAs.find(v => v.id === 'va-gen-01')?.imageUrl || '', lastMessage: 'Great, I will get that report over to you by EOD.', lastMessageTimestamp: '10:45 AM', unreadCount: 0, messages: [{id: 1, from: 'va', content: {type: 'text', text: 'Great, I will get that report over to you by EOD.'}, timestamp: '10:45 AM'}] },
    { id: 'thread-2', vaId: 'va-tech-03', vaName: 'Syd R', vaImageUrl: detailedVAs.find(v => v.id === 'va-tech-03')?.imageUrl || '', lastMessage: 'Attachment: seo_audit_report.pdf', lastMessageTimestamp: 'Yesterday', unreadCount: 1, messages: [{id: 1, from: 'va', content: {type: 'file', file: {name: 'seo_audit_report.pdf', url: '#', size: '2.5MB'}}, timestamp: 'Yesterday'}] },
];

// VA
export const vaUser = {
  id: 'va-gen-01',
  name: 'Adewumi A',
  email: 'adewumi.a@catazet.va',
  avatarUrl: detailedVAs.find(v => v.id === 'va-gen-01')?.imageUrl || '',
};
export const vaNavLinks: VANavLink[] = [
    { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon/> },
    { id: 'projects', name: 'My Projects', icon: <ProjectsIcon/> },
    { id: 'messages', name: 'Messages', icon: <ChatBubbleIcon className="w-5 h-5"/> },
    { id: 'payouts', name: 'Payouts', icon: <PaymentsIcon/> },
    { id: 'profile', name: 'My Profile', icon: <UserCircleIcon/> },
];
export const vaStats: VAStat[] = [
    { title: 'Active Clients', value: '1', icon: <UsersIcon className="w-6 h-6"/> },
    { title: 'Avg. Rating', value: '5.0', icon: <StarIcon className="w-6 h-6"/> },
];
export const vaMessageThreads: ClientMessageThread[] = clientMessageThreads;
export const vaPayoutHistory: VAPayoutRecord[] = [
    { id: 'payout-1', payoutDate: '2024-07-24', month: 'June 2024', clients: 1, amount: 640, status: 'Paid' },
    { id: 'payout-2', payoutDate: '2024-06-24', month: 'May 2024', clients: 2, amount: 1280, status: 'Paid' },
];

// Course Taker
export const courseTakerUser = { id: 'ct-1', name: 'Ben Carter', email: 'coursetaker@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=ben' };
export const courseTakerNavLinks: CourseTakerNavLink[] = [
    { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon/> },
    { id: 'my-courses', name: 'My Courses', icon: <BookOpenIcon className="w-5 h-5"/> },
    { id: 'browse-courses', name: 'Browse Courses', icon: <SearchIcon className="w-5 h-5"/> },
    { id: 'certificates', name: 'Certificates', icon: <StarIcon className="w-5 h-5"/> },
    { id: 'settings', name: 'Settings', icon: <SettingsIcon/> },
];
export const initialEnrolledCourses: EnrolledCourse[] = [
    { id: 'c1', title: 'Virtual Assistant Fundamentals', description: 'Master the core skills every VA needs.', progress: 100, status: 'Completed', certificateUrl: '#' },
    { id: 'c2', title: 'Advanced Social Media Management', description: 'Learn strategies for content creation.', progress: 65, status: 'In Progress' },
];

// Volunteer
export const volunteerUser = { id: 'vol-1', name: 'Chiamaka Nwosu', email: 'volunteer@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=chiamaka' };
export const volunteerNavLinks: VolunteerNavLink[] = [
    { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon/> },
    { id: 'assignments', name: 'Assignments', icon: <ClipboardListIcon/> },
    { id: 'training', name: 'Training', icon: <BookOpenIcon className="w-5 h-5"/> },
    { id: 'certificates', name: 'Certificates', icon: <StarIcon className="w-5 h-5"/> },
    { id: 'profile', name: 'My Profile', icon: <UserCircleIcon/> },
];
export const volunteerStats: VolunteerStat[] = [
    { title: 'Active Assignments', value: '1', icon: <ActivityIcon className="w-6 h-6"/> },
    { title: 'Completed Projects', value: '2', icon: <CheckIcon className="w-6 h-6"/> },
    { title: 'Mentors', value: '1', icon: <UsersIcon className="w-6 h-6"/> },
    { title: 'Hours Logged', value: '45', icon: <CalendarIcon className="w-6 h-6"/> },
];
export const initialVolunteerAssignments: VolunteerAssignment[] = [
    { id: 'as-1', projectTitle: 'Social Media Scheduling', clientName: 'Startup Inc.', seniorVaName: 'Adewumi A', status: 'Active', tasks: ['Schedule 15 posts for next week', 'Monitor comments for 1 hour daily'] },
];
export const volunteerCertificates: Certificate[] = [
    { id: 'cert-vol-1', recipientName: volunteerUser.name, title: 'Volunteer Program Completion', date: '2024-06-30', issuerName: 'Peter Adegoroye', issuerTitle: 'CEO, Catazet' },
];
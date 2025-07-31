import React, { useState, useMemo, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { VolunteerSidebar } from './VolunteerSidebar.tsx';
import { Certificate } from './Certificate.tsx';
import { 
    volunteerUser,
    volunteerStats,
    initialVolunteerAssignments,
    volunteerCertificates,
    volunteerNavLinks,
} from '../constants.tsx';
import type { 
    VolunteerView,
    VolunteerStat,
    VolunteerAssignment,
    Certificate as CertificateType,
} from '../types.ts';
import { 
    MenuIcon, ActivityIcon, UsersGroupIcon, BookOpenIcon, StarIcon, CheckIcon, CalendarIcon, DownloadIcon, LoadingSpinnerIcon
} from './icons.tsx';

interface VolunteerDashboardPageProps {
    onLogout: () => void;
}

export const VolunteerDashboardPage: React.FC<VolunteerDashboardPageProps> = ({ onLogout }) => {
    const [activeView, setActiveView] = useState<VolunteerView>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const [assignments, setAssignments] = useState<VolunteerAssignment[]>(initialVolunteerAssignments);
    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const [selectedCertificate, setSelectedCertificate] = useState<CertificateType | null>(null);
    const certificateRef = useRef<HTMLDivElement>(null);

    const handleDownload = (cert: CertificateType) => {
        setSelectedCertificate(cert);
        setIsDownloading(cert.id);

        setTimeout(async () => {
            if (!certificateRef.current) {
                console.error("Certificate component is not available for rendering.");
                setIsDownloading(null);
                return;
            };

            try {
                const canvas = await html2canvas(certificateRef.current, { scale: 2, useCORS: true });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('l', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Catazet-Certificate-${cert.title.replace(/\s/g, '-')}.pdf`);
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                setIsDownloading(null);
                setSelectedCertificate(null);
            }
        }, 100);
    };

    const DashboardHeader: React.FC<{ title: string; subtitle: string; }> = ({ title, subtitle }) => (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
    );

    const StatCard: React.FC<{ stat: VolunteerStat; index: number }> = ({ stat, index }) => (
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

    const DashboardView: React.FC = () => (
        <>
            <DashboardHeader title={`Welcome back, ${volunteerUser.name.split(' ')[0]}!`} subtitle="Here's a summary of your volunteer activities." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {volunteerStats.map((stat, index) => <StatCard key={stat.title} stat={stat} index={index}/>)}
            </div>
            <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4">Active Assignments</h3>
                {assignments.filter(a => a.status === 'Active').map(assignment => (
                    <div key={assignment.id} className="p-4 border rounded-lg mb-4">
                        <p className="font-semibold">{assignment.projectTitle} for {assignment.clientName}</p>
                        <p className="text-sm text-gray-500">Mentor: {assignment.seniorVaName}</p>
                        <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
                            {assignment.tasks.map((task, i) => <li key={i}>{task}</li>)}
                        </ul>
                    </div>
                ))}
                 {assignments.filter(a => a.status === 'Active').length === 0 && <p className="text-sm text-gray-500 text-center py-4">No active assignments. Great job!</p>}
            </div>
        </>
    );

    const AssignmentStatusBadge: React.FC<{ status: 'Active' | 'Completed' }> = ({ status }) => {
        const styles = {
            'Active': 'bg-green-100 text-green-800',
            'Completed': 'bg-blue-100 text-blue-800',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
    };
    
    const AssignmentsView: React.FC = () => (
         <>
            <DashboardHeader title="My Assignments" subtitle="Track your tasks for all assigned projects." />
            <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Project / Client</th>
                            <th className="p-4">Mentor</th>
                            <th className="p-4">Tasks</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {assignments.map(assignment => (
                            <tr key={assignment.id}>
                                <td className="p-4"><p className="font-semibold">{assignment.projectTitle}</p><p className="text-gray-500">{assignment.clientName}</p></td>
                                <td className="p-4 text-gray-600 font-medium">{assignment.seniorVaName}</td>
                                <td className="p-4"><ul className="list-disc pl-4 text-gray-700">{assignment.tasks.map((task,i) => <li key={i}>{task}</li>)}</ul></td>
                                <td className="p-4"><AssignmentStatusBadge status={assignment.status}/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const TrainingView: React.FC = () => (
        <>
            <DashboardHeader title="Training Materials" subtitle="Access resources to help you grow your skills." />
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="text-center py-10">
                    <BookOpenIcon className="w-16 h-16 text-primary-blue mx-auto mb-4"/>
                    <h3 className="text-xl font-bold">Coming Soon!</h3>
                    <p className="text-gray-500 mt-2">We're preparing training materials for you. Check back later!</p>
                </div>
            </div>
        </>
    );
    
    const ProfileView: React.FC = () => {
        const [profile, setProfile] = useState({ name: volunteerUser.name, email: volunteerUser.email });
        return (
            <>
                <DashboardHeader title="My Profile" subtitle="Manage your contact information." />
                <div className="bg-white p-8 rounded-xl shadow-sm border max-w-2xl">
                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Profile Saved!')}}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="mt-1 w-full p-2 border rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="mt-1 w-full p-2 border rounded-md"/>
                        </div>
                        <button type="submit" className="bg-primary-blue text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90">Save Changes</button>
                    </form>
                </div>
            </>
        );
    };

    const CertificatesView: React.FC = () => (
        <>
            <DashboardHeader title="My Certificates" subtitle="Your hard work and contribution, officially recognized." />
             {volunteerCertificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {volunteerCertificates.map(cert => (
                        <div key={cert.id} className="bg-white p-6 rounded-xl shadow-sm border flex flex-col items-start">
                            <StarIcon className="w-8 h-8 text-yellow-400 mb-3"/>
                            <h4 className="text-lg font-bold text-gray-800">{cert.title}</h4>
                            <p className="text-sm text-gray-500 mt-1 flex-grow">Issued on: {cert.date}</p>
                            <button
                                onClick={() => handleDownload(cert)}
                                disabled={isDownloading === cert.id}
                                className="mt-4 w-full bg-primary-blue text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {isDownloading === cert.id ? <LoadingSpinnerIcon className="w-5 h-5"/> : <DownloadIcon className="w-4 h-4"/>}
                                {isDownloading === cert.id ? 'Generating...' : 'Download'}
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-xl shadow-sm border">
                    <p className="text-gray-500">No certificates awarded yet. Keep up the great work!</p>
                </div>
            )}
        </>
    );

    const renderView = () => {
        switch (activeView) {
            case 'dashboard': return <DashboardView />;
            case 'assignments': return <AssignmentsView />;
            case 'training': return <TrainingView />;
            case 'certificates': return <CertificatesView />;
            case 'profile': return <ProfileView />;
            default: return <DashboardView />;
        }
    };
    
    return (
        <div className="bg-gray-50 font-sans text-gray-900 flex min-h-screen">
            <VolunteerSidebar 
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
                        {volunteerNavLinks.find(link => link.id === activeView)?.name || 'Dashboard'}
                    </h1>
                    <div className="w-6 h-6"></div>
                </header>
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>
             {/* Hidden div for PDF generation */}
            <div className="fixed -left-[9999px] top-0 z-[-1]">
                {selectedCertificate && <div ref={certificateRef}><Certificate certificate={selectedCertificate} /></div>}
            </div>
        </div>
    );
};
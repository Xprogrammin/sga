import React, { useState, useMemo, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CourseTakerSidebar } from './CourseTakerSidebar.tsx';
import { Certificate } from './Certificate.tsx';
import { 
    courseTakerUser,
    initialEnrolledCourses,
    courses as allCourses,
    courseTakerNavLinks,
} from '../constants.tsx';
import type { 
    CourseTakerView,
    CourseTakerStat,
    EnrolledCourse,
    Course,
    Certificate as CertificateType,
} from '../types.ts';
import { 
    MenuIcon, CheckIcon, ActivityIcon, StarIcon, DownloadIcon, BookOpenIcon,
    SearchIcon, LoadingSpinnerIcon
} from './icons.tsx';


interface CourseTakerDashboardPageProps {
    onLogout: () => void;
}

export const CourseTakerDashboardPage: React.FC<CourseTakerDashboardPageProps> = ({ onLogout }) => {
    const [activeView, setActiveView] = useState<CourseTakerView>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>(initialEnrolledCourses);
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

    const StatCard: React.FC<{ stat: CourseTakerStat; index: number }> = ({ stat, index }) => (
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

    const DashboardView: React.FC = () => {
        const stats = useMemo<CourseTakerStat[]>(() => {
            const inProgress = enrolledCourses.filter(c => c.status === 'In Progress').length;
            const completed = enrolledCourses.filter(c => c.status === 'Completed').length;
            const certificates = enrolledCourses.filter(c => c.certificateUrl).length;

            return [
                { title: 'Courses in Progress', value: inProgress.toString(), icon: <ActivityIcon className="w-6 h-6" /> },
                { title: 'Completed Courses', value: completed.toString(), icon: <CheckIcon className="w-6 h-6" /> },
                { title: 'Certificates Earned', value: certificates.toString(), icon: <StarIcon className="w-6 h-6" /> },
            ];
        }, [enrolledCourses]);

        return (
            <>
                <DashboardHeader title={`Welcome back, ${courseTakerUser.name.split(' ')[0]}!`} subtitle="Continue your learning journey." />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => <StatCard key={stat.title} stat={stat} index={index}/>)}
                </div>

                <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Continue Learning</h3>
                    <div className="space-y-4">
                        {enrolledCourses.filter(c => c.status === 'In Progress').map(course => (
                            <div key={course.id} className="p-4 border rounded-lg">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">{course.title}</p>
                                    <span className="text-sm font-bold text-primary-blue">{course.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                    <div className="bg-primary-blue h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                                </div>
                            </div>
                        ))}
                        {enrolledCourses.filter(c => c.status === 'In Progress').length === 0 && <p className="text-sm text-gray-500 text-center py-4">No courses in progress. Time to browse for a new one!</p>}
                    </div>
                </div>
            </>
        );
    };

    const CourseCard: React.FC<{ course: EnrolledCourse }> = ({ course }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col">
            <h4 className="text-lg font-bold text-gray-800">{course.title}</h4>
            <p className="text-sm text-gray-500 mt-1 flex-grow">{course.description}</p>
            <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-500">{course.status}</span>
                    <span className="text-sm font-bold text-primary-blue">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-primary-blue h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
            </div>
            {course.status === 'Completed' && course.certificateUrl && (
                 <button className="mt-4 w-full bg-green-100 text-green-800 font-semibold py-2 px-4 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2">
                    <DownloadIcon className="w-4 h-4" />
                    Download Certificate
                </button>
            )}
        </div>
    );
    
    const MyCoursesView: React.FC = () => (
        <>
            <DashboardHeader title="My Courses" subtitle="Track your progress and access your completed courses." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map(course => <CourseCard key={course.id} course={course} />)}
            </div>
        </>
    );

    const BrowseCourseCard: React.FC<{ course: Course }> = ({ course }) => {
        const isEnrolled = enrolledCourses.some(ec => ec.id === course.id);

        return (
            <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col">
                <div className="flex-grow">
                    <BookOpenIcon className="w-8 h-8 text-primary-blue mb-3"/>
                    <h4 className="text-lg font-bold text-gray-800">{course.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                </div>
                <button
                    onClick={() => {
                        if (isEnrolled) return;
                        const newEnrollment: EnrolledCourse = {
                            ...course,
                            progress: 0,
                            status: 'In Progress',
                        };
                        setEnrolledCourses(prev => [...prev, newEnrollment]);
                        alert(`Successfully enrolled in ${course.title}!`);
                    }}
                    disabled={isEnrolled}
                    className="mt-4 w-full font-semibold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed bg-primary-blue text-white hover:opacity-90"
                >
                    {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                </button>
            </div>
        );
    };

    const BrowseCoursesView: React.FC = () => (
        <>
            <DashboardHeader title="Browse Courses" subtitle="Enroll in new courses to expand your skills." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.map(course => <BrowseCourseCard key={course.id} course={course} />)}
            </div>
        </>
    );

    const SettingsView: React.FC = () => {
        const [formState, setFormState] = useState({ name: courseTakerUser.name, email: courseTakerUser.email, password: '' });
        const handleSave = () => { alert('Settings saved!'); };

        return (
            <>
                <DashboardHeader title="Settings" subtitle="Manage your account details and preferences." />
                <div className="bg-white p-8 rounded-xl shadow-sm border max-w-2xl">
                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="mt-1 w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input type="email" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="mt-1 w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input type="password" placeholder="Leave blank to keep current password" value={formState.password} onChange={(e) => setFormState({ ...formState, password: e.target.value })} className="mt-1 w-full p-2 border rounded-md" />
                        </div>
                        <button type="submit" className="bg-primary-blue text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90">
                            Save Changes
                        </button>
                    </form>
                </div>
            </>
        );
    };

    const CertificatesView: React.FC = () => {
        const completedCourses = enrolledCourses.filter(c => c.status === 'Completed');
        const certificates: CertificateType[] = completedCourses.map((course, index) => ({
            id: course.id,
            recipientName: courseTakerUser.name,
            title: course.title,
            date: new Date(2024, 6, 20 + index).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), // mock date
            issuerName: 'Peter Adegoroye',
            issuerTitle: 'CEO, Catazet',
        }));
    
        return (
            <>
                <DashboardHeader title="My Certificates" subtitle="Download certificates for your completed courses." />
                {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map(cert => (
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
                        <p className="text-gray-500">You have not earned any certificates yet. Complete a course to get one!</p>
                    </div>
                )}
            </>
        );
    };

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardView />;
            case 'my-courses':
                return <MyCoursesView />;
            case 'browse-courses':
                return <BrowseCoursesView />;
            case 'certificates':
                return <CertificatesView />;
            case 'settings':
                return <SettingsView />;
            default:
                return <DashboardView />;
        }
    };

    return (
        <div className="bg-gray-50 font-sans text-gray-900 flex min-h-screen">
            <CourseTakerSidebar
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
                        {courseTakerNavLinks.find(link => link.id === activeView)?.name || 'Dashboard'}
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
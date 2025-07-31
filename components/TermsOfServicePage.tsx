import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4">
        <h2 className="text-2xl lg:text-3xl font-poppins font-bold text-dark-text border-b pb-3 mb-4">
            {title}
        </h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
            {children}
        </div>
    </div>
);

interface TermsOfServicePageProps {
    navigate: (page: string) => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ navigate }) => {
    return (
        <div className="pt-20 bg-white">
            <div className="container mx-auto px-6 py-12 lg:py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 lg:mb-16">
                        <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 animate-fade-in-up">
                            Terms of <span className="text-primary-blue">Service</span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                            Please read these terms carefully before using our services.
                        </p>
                    </div>

                    <div className="bg-light-gray p-8 sm:p-10 lg:p-12 rounded-2xl space-y-8 lg:space-y-10">
                        <Section title="1. Acceptance of Terms">
                            <p>
                                By accessing or using the Catazet platform and its services ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
                            </p>
                        </Section>

                        <Section title="2. Description of Service">
                            <p>
                                Catazet provides a platform for businesses and individuals ("Clients") to connect with, hire, and manage virtual assistants ("VAs") from Africa for various tasks. We facilitate the matching process, payment, and collaboration tools.
                            </p>
                        </Section>

                        <Section title="3. User Accounts">
                             <p>
                                To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate. You are responsible for safeguarding your password and for all activities that occur under your account.
                            </p>
                        </Section>

                        <Section title="4. User Conduct">
                            <p>You agree not to use the Service to:</p>
                            <ul className="list-disc pl-6 space-y-3">
                                <li>Violate any local, state, national, or international law.</li>
                                <li>Engage in any activity that is abusive, fraudulent, or harmful to Catazet, our users, or any third party.</li>
                                <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
                                <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
                            </ul>
                        </Section>
                        
                        <Section title="5. Intellectual Property">
                            <p>
                                All content, trademarks, service marks, logos, and trade names on the Service are the property of Catazet or its licensors. You are granted a limited, non-exclusive, non-transferable license to access and use the Service for your personal or business use.
                            </p>
                        </Section>

                        <Section title="6. Termination">
                            <p>
                                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                            </p>
                        </Section>

                        <Section title="7. Disclaimers and Limitation of Liability">
                             <p>
                                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Catazet makes no warranties, expressed or implied, and hereby disclaims all other warranties. In no event shall Catazet be liable for any indirect, incidental, special, consequential or punitive damages.
                            </p>
                        </Section>

                        <Section title="8. Governing Law">
                            <p>
                                These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which Catazet is based, without regard to its conflict of law provisions.
                            </p>
                        </Section>

                        <Section title="9. Changes to Terms">
                            <p>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days' notice before any new terms take effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                            </p>
                        </Section>

                        <Section title="10. Contact Us">
                            <p>If you have any questions about these Terms, please contact us:</p>
                             <ul className="list-disc pl-6 space-y-3">
                                <li>By email: <a href="mailto:support@catazet.com" className="text-primary-blue hover:underline">support@catazet.com</a></li>
                                <li>By visiting this page on our website: <a href="/contact" onClick={(e) => { e.preventDefault(); navigate('contact'); }} className="text-primary-blue hover:underline cursor-pointer">www.catazet.com/contact</a></li>
                            </ul>
                        </Section>
                    </div>
                </div>
            </div>
        </div>
    );
};
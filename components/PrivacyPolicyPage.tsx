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

interface PrivacyPolicyPageProps {
    navigate: (page: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ navigate }) => {
    return (
        <div className="pt-20 bg-white">
            <div className="container mx-auto px-6 py-12 lg:py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12 lg:mb-16">
                        <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 animate-fade-in-up">
                            Privacy <span className="text-primary-blue">Policy</span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                        </p>
                    </div>

                    <div className="bg-light-gray p-8 sm:p-10 lg:p-12 rounded-2xl space-y-8 lg:space-y-10">
                        <Section title="Introduction">
                            <p>
                                Welcome to Catazet. We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
                            </p>
                        </Section>

                        <Section title="Information We Collect">
                            <p>
                                We collect various types of information in connection with the services we provide, including:
                            </p>
                            <ul className="list-disc pl-6 space-y-3">
                                <li><strong>Personal Identification Information:</strong> Name, email address, phone number, postal address, and other contact details.</li>
                                <li><strong>Professional Information:</strong> Resume, work history, skills, qualifications, and other information relevant to virtual assistant services or client requirements.</li>
                                <li><strong>Payment Information:</strong> Billing details, credit card information, or other payment account details (processed securely by third-party payment processors).</li>
                                <li><strong>Usage Data:</strong> Information about how you access and use our services, such as IP address, browser type, pages viewed, and time spent on pages.</li>
                                <li><strong>Communication Data:</strong> Records of your communications with us, including emails, chat messages, and phone calls.</li>
                            </ul>
                        </Section>
                        
                        <Section title="How We Use Your Information">
                            <p>We use the collected information for various purposes, including:</p>
                             <ul className="list-disc pl-6 space-y-3">
                                <li>To provide and maintain our services, including connecting clients with VAs.</li>
                                <li>To process transactions and send related information, including confirmations and invoices.</li>
                                <li>To improve, personalize, and expand our services.</li>
                                <li>To communicate with you, respond to your inquiries, and provide customer support.</li>
                                <li>To send you marketing and promotional communications, where you have opted in.</li>
                                <li>To monitor and analyze trends, usage, and activities in connection with our services.</li>
                                <li>To detect, prevent, and address technical issues, fraud, or other illegal activities.</li>
                            </ul>
                        </Section>

                        <Section title="How We Share Your Information">
                            <p>We may share your information with third parties in the following situations:</p>
                            <ul className="list-disc pl-6 space-y-3">
                                <li><strong>With Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who perform services on our behalf, such as payment processing, hosting, data analysis, and marketing.</li>
                                <li><strong>With Clients/Virtual Assistants:</strong> If you are a client, we may share your project requirements and contact details with VAs to facilitate matching. If you are a VA, we may share your profile and relevant information with potential clients.</li>
                                <li><strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court order or government agency).</li>
                                <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company.</li>
                                <li><strong>With Your Consent:</strong> We may share your information with your consent or at your direction.</li>
                            </ul>
                        </Section>

                        <Section title="Your Rights">
                             <p>Depending on your location and applicable laws, you may have the following rights regarding your personal data:</p>
                             <ul className="list-disc pl-6 space-y-3">
                                <li><strong>Access:</strong> Request access to the personal data we hold about you.</li>
                                <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
                                <li><strong>Erasure:</strong> Request deletion of your personal data.</li>
                                <li><strong>Restriction:</strong> Request restriction of processing your personal data.</li>
                                <li><strong>Objection:</strong> Object to the processing of your personal data.</li>
                                <li><strong>Data Portability:</strong> Request a copy of your data in a structured, machine-readable format.</li>
                                <li><strong>Withdraw Consent:</strong> Withdraw your consent at any time where we rely on consent to process your personal data.</li>
                            </ul>
                        </Section>

                        <Section title="Data Security">
                            <p>
                                We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </Section>
                        
                        <Section title="Changes to This Policy">
                            <p>
                                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                            </p>
                        </Section>

                        <Section title="Contact Us">
                            <p>If you have any questions about this Privacy Policy, please contact us:</p>
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
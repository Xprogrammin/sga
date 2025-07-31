import React from 'react';
import { servicesPageItems, howItWorksSteps } from '../constants.tsx';
import type { VAType } from '../types.ts';

// Using inline styles for reliable PDF rendering.
const styles = {
    page: {
        fontFamily: "'Inter', sans-serif",
        fontSize: '10px',
        lineHeight: 1.5,
        color: '#333',
        width: '595px', // A4 width at 72 DPI
        height: '842px', // A4 height at 72 DPI
        padding: '40px',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        position: 'relative' as const,
    },
    pageContent: {
        flexGrow: 1,
    },
    h1: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '28px', color: '#0a82fc', fontWeight: 'bold', margin: '0 0 10px 0', textAlign: 'center' as const },
    h2: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '20px', color: '#1E1E1E', fontWeight: 'bold', borderBottom: '2px solid #0a82fc', paddingBottom: '5px', margin: '25px 0 15px 0' },
    p: { margin: '0 0 10px 0' },
    logoContainer: { display: 'flex', alignItems: 'center', justifyContent: 'center' as const, gap: '10px', marginBottom: '20px' },
    logoText: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '32px', color: '#0a82fc', fontWeight: 'bold' as const, margin: 0, lineHeight: 1, paddingBottom: '5px' },
    serviceGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' },
    serviceCard: { border: '1px solid #eee', borderRadius: '8px', padding: '15px', backgroundColor: '#f8fafc' },
    serviceTitle: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '14px', fontWeight: 'bold', color: '#0a82fc', margin: '0 0 5px 0' },
    stepContainer: { display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '10px'},
    stepNumber: { width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#0a82fc', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 },
    footer: { paddingTop: '15px', borderTop: '1px solid #ccc', color: '#777', fontSize: '9px', display: 'flex', justifyContent: 'space-between' as const }
};

const BrochureHeader = () => (
    <>
        <div style={styles.logoContainer}>
            <img src="/assets/logo/Catazetlogomain.png" alt="Catazet Logo" style={{ height: '40px', width: 'auto' }} />
            <span style={styles.logoText}>Catazet</span>
        </div>
        <h1 style={styles.h1}>Our Virtual Assistant Services</h1>
        <p style={{...styles.p, textAlign: 'center' as const, fontSize: '12px'}}>
            Your Global Talent Partner. We provide a wide range of virtual assistant services tailored to meet the diverse needs of your business. Our VAs are vetted, skilled, and ready to help you scale.
        </p>
    </>
);

const BrochureFooter: React.FC<{ page: number; totalPages: number }> = ({ page, totalPages }) => (
    <div style={styles.footer}>
        <span>&copy; {new Date().getFullYear()} Catazet. All rights reserved. | info@catazet.com</span>
        <span>Page {page} of {totalPages}</span>
    </div>
);

const ServiceCategory: React.FC<{ name: string; type: VAType, isFirstOnPage?: boolean }> = ({ name, type, isFirstOnPage }) => {
    const servicesForType = servicesPageItems.filter(s => s.vaType === type);
    if (servicesForType.length === 0) return null;

    return (
        <div>
            <h2 style={{...styles.h2, marginTop: isFirstOnPage ? 0 : '25px' }}>{name} Services</h2>
            <div style={styles.serviceGrid}>
                {servicesForType.map(service => (
                    <div key={service.title} style={styles.serviceCard}>
                        <h3 style={styles.serviceTitle}>{service.title}</h3>
                        <p style={{...styles.p, fontSize: '10px', margin: 0}}>{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ServicesBrochure: React.FC = () => {
    const totalPages = 5;

    return (
        <div>
            {/* Page 1 */}
            <div className="brochure-page" style={styles.page}>
                <div style={styles.pageContent}>
                    <BrochureHeader />
                    <h2 style={styles.h2}>How It Works</h2>
                    <div>
                        {howItWorksSteps.map(step => (
                            <div key={step.step} style={styles.stepContainer}>
                                <div style={styles.stepNumber}>{step.step}</div>
                                <div>
                                    <h3 style={{fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 'bold', margin: '0 0 2px 0'}}>{step.title}</h3>
                                    <p style={{...styles.p, margin: 0, fontSize: '10px'}}>{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <ServiceCategory name="General VAs" type="General" />
                </div>
                <BrochureFooter page={1} totalPages={totalPages} />
            </div>

            {/* Page 2 */}
            <div className="brochure-page" style={styles.page}>
                <div style={styles.pageContent}>
                    <ServiceCategory name="Tech VAs" type="Tech" isFirstOnPage />
                </div>
                <BrochureFooter page={2} totalPages={totalPages} />
            </div>

            {/* Page 3 */}
            <div className="brochure-page" style={styles.page}>
                <div style={styles.pageContent}>
                    <ServiceCategory name="Edu VAs" type="Edu" isFirstOnPage />
                    <ServiceCategory name="Health VAs" type="Health" />
                </div>
                <BrochureFooter page={3} totalPages={totalPages} />
            </div>
            
            {/* Page 4 */}
            <div className="brochure-page" style={styles.page}>
                <div style={styles.pageContent}>
                    <ServiceCategory name="Security VAs" type="Security" isFirstOnPage />
                    <ServiceCategory name="Student VAs" type="Student" />
                    
                    <h2 style={styles.h2}>Get Started Today</h2>
                    <p style={styles.p}>Ready to transform your business? Visit our website at www.catazet.com or contact us to find the perfect virtual assistant for your needs. We're excited to partner with you.</p>
                </div>
                <BrochureFooter page={4} totalPages={totalPages} />
            </div>
            
            {/* Page 5 - Thank You Page */}
            <div className="brochure-page" style={styles.page}>
                <div style={{...styles.pageContent, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                    <img src="/assets/logo/Catazetlogoblue.png" alt="Catazet Logo" style={{ height: '80px', width: 'auto', marginBottom: '30px' }} />
                    <h1 style={{...styles.h1, fontSize: '40px', fontFamily: "'Bricolage Grotesque', sans-serif" }}>Thank You</h1>
                    <p style={{...styles.p, fontSize: '14px', maxWidth: '400px', margin: '20px 0'}}>
                        We appreciate your interest in Catazet. This brochure provides an overview of how we can help you save time, reduce costs, and scale your business with our expert virtual assistants.
                    </p>
                    <p style={{...styles.p, fontSize: '16px', fontWeight: 'bold', color: '#1E1E1E', marginTop: '20px'}}>
                        Ready to take the next step?
                    </p>
                    <p style={{...styles.p, fontSize: '14px', color: '#0a82fc'}}>
                        Visit us at <strong>www.catazet.com</strong> to hire a VA or book a free consultation call.
                    </p>
                </div>
                <BrochureFooter page={5} totalPages={totalPages} />
            </div>
        </div>
    );
};
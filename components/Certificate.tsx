import React from 'react';
import type { Certificate as CertificateType } from '../types.ts';

// Using inline styles for reliable PDF rendering with html2canvas.
const styles = {
    page: {
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        width: '1123px', // A4 landscape at 96 DPI
        height: '794px',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        position: 'relative' as const,
        overflow: 'hidden' as const,
        boxSizing: 'border-box' as const,
    },
    border: {
        width: '1063px',
        height: '734px',
        border: '10px solid #0a82fc',
        padding: '20px',
        position: 'relative' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        backgroundColor: '#f8fafc',
    },
    corner: {
        position: 'absolute' as const,
        width: '150px',
        height: '150px',
        backgroundColor: '#b5d9fe', // accent-light-blue
        zIndex: 1,
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: '15px',
        marginBottom: '20px',
        zIndex: 2,
    },
    logoText: {
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontSize: '48px',
        fontWeight: 'bold' as const,
        color: '#0a82fc',
        margin: 0,
        lineHeight: 1,
        paddingBottom: '8px',
    },
    mainText: {
        fontSize: '28px',
        color: '#1E1E1E',
        textAlign: 'center' as const,
        marginBottom: '10px',
        zIndex: 2,
    },
    recipientName: {
        fontFamily: "'Georgia', serif",
        fontSize: '60px',
        fontWeight: 'bold' as const,
        color: '#1E1E1E',
        textAlign: 'center' as const,
        margin: '20px 0',
        borderBottom: '2px solid #ccc',
        paddingBottom: '10px',
        zIndex: 2,
    },
    purposeText: {
        fontSize: '24px',
        color: '#555',
        textAlign: 'center' as const,
        maxWidth: '800px',
        lineHeight: 1.4,
        zIndex: 2,
    },
    footer: {
        position: 'absolute' as const,
        bottom: '40px',
        display: 'flex',
        justifyContent: 'space-around' as const,
        width: '100%',
        zIndex: 2,
    },
    signatureBlock: {
        textAlign: 'center' as const,
    },
    signatureLine: {
        borderTop: '2px solid #333',
        width: '200px',
        margin: '0 auto 5px auto',
    },
    signatureName: {
        fontSize: '18px',
        fontWeight: 'bold' as const,
    },
    signatureTitle: {
        fontSize: '14px',
        color: '#555',
    }
};

export const Certificate: React.FC<{ certificate: CertificateType }> = ({ certificate }) => {
    const isVolunteerCert = certificate.title.includes('Contribution') || certificate.title.includes('Completion');
    const purposeText = isVolunteerCert
        ? `has successfully completed the Catazet Volunteer Program and is recognized for their valuable contributions and dedication.`
        : `has successfully completed the requirements for the certification of`;
    
    return (
        <div style={styles.page}>
            <div style={{ ...styles.corner, top: -75, left: -75, transform: 'rotate(45deg)' }}></div>
            <div style={{ ...styles.corner, bottom: -75, right: -75, transform: 'rotate(45deg)' }}></div>

            <div style={styles.border}>
                <div style={styles.logoContainer}>
                    <img src="/assets/logo/Catazetlogomain.png" alt="Catazet Logo" style={{ height: '50px', width: 'auto' }} />
                    <span style={styles.logoText}>Catazet</span>
                </div>
                
                <p style={styles.mainText}>This certificate is proudly presented to</p>
                <h1 style={styles.recipientName}>{certificate.recipientName}</h1>
                <p style={styles.purposeText}>
                    {purposeText}
                </p>
                {!isVolunteerCert && <p style={{ ...styles.mainText, fontSize: '36px', fontWeight: 'bold', color: '#0a82fc', margin: '15px 0' }}>{certificate.title}</p>}
                
                <div style={styles.footer}>
                    <div style={styles.signatureBlock}>
                        <div style={styles.signatureLine}></div>
                        <p style={styles.signatureName}>{certificate.issuerName}</p>
                        <p style={styles.signatureTitle}>{certificate.issuerTitle}</p>
                    </div>
                    <div style={styles.signatureBlock}>
                        <div style={styles.signatureLine}></div>
                        <p style={styles.signatureName}>Date Issued</p>
                        <p style={styles.signatureTitle}>{certificate.date}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
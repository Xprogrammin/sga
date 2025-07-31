
import React from 'react';
import type { ClientBillingRecord } from '../types.ts';
import { clientUser } from '../constants.tsx';

interface InvoiceProps {
    invoice: ClientBillingRecord;
}

// Using inline styles for reliable PDF rendering with html2canvas.
const styles = {
    page: {
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: '12px',
        lineHeight: 1.6,
        color: '#333',
        width: '800px', // A bit wider for a better layout
        padding: '50px',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box' as const,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '2px solid #0a82fc',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    logoText: {
        fontSize: '36px',
        fontWeight: 'bold' as const,
        color: '#0a82fc',
        fontFamily: 'Poppins, sans-serif',
    },
    invoiceDetails: {
        textAlign: 'right' as const,
    },
    h1: {
        fontSize: '28px',
        margin: '0 0 5px 0',
        color: '#1E1E1E',
    },
    billingInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '40px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        marginTop: '20px',
    },
    th: {
        backgroundColor: '#0a82fc',
        color: '#ffffff',
        padding: '12px',
        textAlign: 'left' as const,
        border: '1px solid #0a82fc',
    },
    td: {
        padding: '12px',
        border: '1px solid #e2e8f0',
    },
    totalSection: {
        marginTop: '30px',
        textAlign: 'right' as const,
    },
    footer: {
        marginTop: '50px',
        paddingTop: '20px',
        borderTop: '1px solid #ccc',
        textAlign: 'center' as const,
        color: '#777',
        fontSize: '10px',
    }
};

export const Invoice: React.FC<InvoiceProps> = ({ invoice }) => {
    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div>
                    <div style={styles.logoContainer}>
                        <img src="/assets/logo/Catazetlogomain.png" alt="Catazet Logo" style={{ height: '40px', width: 'auto' }} />
                        <span style={styles.logoText}>Catazet</span>
                    </div>
                    <p style={{ margin: 0, color: '#555' }}>Your Global Talent Partner</p>
                </div>
                <div style={styles.invoiceDetails}>
                    <h1 style={styles.h1}>INVOICE</h1>
                    <p style={{ margin: 0 }}><strong>Invoice #:</strong> {invoice.invoiceId}</p>
                    <p style={{ margin: 0 }}><strong>Date:</strong> {invoice.date}</p>
                </div>
            </div>

            <div style={styles.billingInfo}>
                <div>
                    <h2 style={{ fontSize: '14px', color: '#555', margin: '0 0 5px 0' }}>BILL TO</h2>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{clientUser.name}</p>
                    <p style={{ margin: 0 }}>{clientUser.email}</p>
                </div>
            </div>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={{...styles.th, width: '60%'}}>Description</th>
                        <th style={styles.th}>Quantity</th>
                        <th style={styles.th}>Unit Price</th>
                        <th style={styles.th}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={styles.td}>{invoice.description}</td>
                        <td style={{...styles.td, textAlign: 'center' as const}}>1</td>
                        <td style={{...styles.td, textAlign: 'right' as const}}>${invoice.amount.toFixed(2)}</td>
                        <td style={{...styles.td, textAlign: 'right' as const}}>${invoice.amount.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <div style={styles.totalSection}>
                <table style={{ marginLeft: 'auto', width: '250px' }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: '8px' }}>Subtotal</td>
                            <td style={{ padding: '8px', textAlign: 'right' as const}}>${invoice.amount.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px' }}>Taxes</td>
                            <td style={{ padding: '8px', textAlign: 'right' as const}}>$0.00</td>
                        </tr>
                        <tr style={{ fontWeight: 'bold' as const, borderTop: '2px solid #333' }}>
                            <td style={{ padding: '8px' }}>Total</td>
                            <td style={{ padding: '8px', textAlign: 'right' as const, fontSize: '18px', color: '#0a82fc' }}>${invoice.amount.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '40px' }}>
                <h3 style={{ fontSize: '14px', color: '#555', margin: '0 0 5px 0' }}>Notes</h3>
                <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Thank you for your business! Payment is due within 15 days.</p>
            </div>

            <div style={styles.footer}>
                <p>&copy; {new Date().getFullYear()} Catazet Inc. All rights reserved.</p>
                <p>info@catazet.com | www.catazet.com</p>
            </div>
        </div>
    );
};

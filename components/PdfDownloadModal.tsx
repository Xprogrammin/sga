import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { Modal } from './Modal.tsx';
import { AgreementConfirmation } from './AgreementConfirmation.tsx';
import { ServicesBrochure } from './ServicesBrochure.tsx';
import { LoadingSpinnerIcon } from './icons.tsx';

interface PdfDownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AgreementText: React.FC = () => (
    <>
        <p>By downloading our services brochure, you agree to receive occasional marketing communications and updates from Catazet. We respect your privacy and will not share your information with third parties.</p>
        <p>You can unsubscribe from our mailing list at any time by clicking the "unsubscribe" link in any of our emails. This brochure is for informational purposes only and is the intellectual property of Catazet.</p>
    </>
);

export const PdfDownloadModal: React.FC<PdfDownloadModalProps> = ({ isOpen, onClose }) => {
    const [view, setView] = useState<'agreement' | 'download'>('agreement');
    const [isDownloading, setIsDownloading] = useState(false);
    const brochureRef = useRef<HTMLDivElement>(null);

    const handleClose = () => {
        onClose();
        // Reset view after closing animation for next time it opens
        setTimeout(() => {
            setView('agreement');
            setIsDownloading(false);
        }, 300);
    };

    const handleAgree = () => {
        setView('download');
    };

    const handleDownload = async () => {
        if (!brochureRef.current) return;
        setIsDownloading(true);

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
    
            const pageElements = brochureRef.current.querySelectorAll('.brochure-page');
    
            for (let i = 0; i < pageElements.length; i++) {
                const page = pageElements[i] as HTMLElement;
                const canvas = await html2canvas(page, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                });
                const imgData = canvas.toDataURL('image/png');
                
                if (i > 0) {
                    pdf.addPage();
                }
    
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            }
            
            pdf.save('Catazet-Services-Brochure.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
            // Optionally show an error message to the user
        } finally {
            setIsDownloading(false);
            handleClose();
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={handleClose} 
            title={view === 'agreement' ? 'Download Agreement' : 'Get Your Services eBook'}
        >
             {/* Hidden div to render brochure for PDF generation */}
            <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1 }}>
                <div ref={brochureRef}>
                    <ServicesBrochure />
                </div>
            </div>

            <div className="flex justify-center items-center gap-2 mb-4">
                <img src="/assets/logo/Catazetlogomain.png" alt="Catazet Logo" className="h-8 w-auto" />
                <span className="text-2xl font-poppins font-extrabold text-primary-blue">Catazet</span>
            </div>

            {view === 'agreement' ? (
                <AgreementConfirmation
                    title="Terms for eBook Download"
                    onAgree={handleAgree}
                    onCancel={handleClose}
                >
                    <AgreementText />
                </AgreementConfirmation>
            ) : (
                <div className="text-center animate-fade-in-up">
                    <h3 className="text-lg font-bold text-dark-text">Your eBook is Ready!</h3>
                    <p className="my-4 text-gray-600">
                        Click the button below to download the complete guide to Catazet's Virtual Assistant services.
                    </p>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="w-full sm:w-auto bg-primary-blue text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                    >
                        {isDownloading ? (
                            <>
                                <LoadingSpinnerIcon className="w-5 h-5 mr-2" />
                                Generating...
                            </>
                        ) : 'Get eBook'}
                    </button>
                </div>
            )}
        </Modal>
    );
};
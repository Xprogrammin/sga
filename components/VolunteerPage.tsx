
import React, { useState } from 'react';
import { volunteerBenefits, volunteerSteps, volunteerTestimonials, volunteerFaqs } from '../constants.tsx';
import type { VolunteerBenefit, VolunteerStep, VolunteerTestimonial, Faq } from '../types.ts';
import { FaqItem } from './FaqItem.tsx';
import { Modal } from './Modal.tsx';
import { VolunteerApplicationForm } from './VolunteerApplicationForm.tsx';
import { AgreementConfirmation } from './AgreementConfirmation.tsx';

export const VolunteerPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalView, setModalView] = useState<'agreement' | 'form'>('agreement');

    const handleOpenModal = () => {
        setModalView('agreement');
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Delay resetting view to allow for closing animation
        setTimeout(() => {
            setModalView('agreement');
        }, 300);
    };

    const handleAgree = () => {
        setModalView('form');
    };

    const AgreementText = () => (
        <>
            <p>By applying to the Catazet Volunteer Program, you agree to dedicate your time and skills to support our clients under the guidance of a senior VA mentor. This is an unpaid, experience-focused role.</p>
            <p>You agree to maintain professionalism, confidentiality, and respect in all interactions within the Catazet community. We reserve the right to decline applications or terminate agreements at our discretion. This program is designed as a pathway to future paid opportunities.</p>
        </>
    );

    return (
        <div className="pt-20 bg-white text-dark-text">
            {/* Hero Section */}
            <section className="py-16 lg:py-24 text-center bg-white">
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold leading-tight">
                        Join Our <span className="text-primary-blue">Volunteer Program</span>
                    </h1>
                    <p className="mt-6 text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                        Give back, gain experience, and launch your career as a Virtual Assistant. Work on real projects while being mentored by industry experts.
                    </p>
                </div>
            </section>

            {/* About Section */}
            <section className="pb-16 lg:pb-24">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">About the Volunteer Program</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Our Volunteer Program is designed for aspiring professionals who want to gain practical experience in the virtual assistance industry. By joining, you'll work on real client projects under the guidance of a mentor.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                You won't be alone. Each volunteer is paired with an experienced Senior VA who provides direct mentorship, guidance, and support. This program is your launchpad to a successful career, offering a clear path to future paid opportunities.
                            </p>
                        </div>
                        <div>
                            <img 
                                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop" 
                                alt="A diverse team collaborating on a project" 
                                className="rounded-2xl shadow-xl w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 lg:py-24 bg-accent-light-blue">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-12">Why Join Our Program?</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {volunteerBenefits.map((benefit: VolunteerBenefit) => (
                            <div key={benefit.title} className="bg-white p-6 rounded-2xl shadow-sm text-center flex flex-col items-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                {benefit.icon}
                                <h3 className="mt-5 text-xl font-bold">{benefit.title}</h3>
                                <p className="mt-2 text-gray-600 flex-grow">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How to Join Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-12">How to Become a Volunteer</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {volunteerSteps.map((step: VolunteerStep) => (
                            <div key={step.step} className="bg-light-gray p-6 rounded-2xl shadow-sm text-center">
                                <div className="bg-primary-blue text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto text-xl font-bold mb-4">
                                    {step.step}
                                </div>
                                <h3 className="text-xl font-bold">{step.title}</h3>
                                <p className="mt-2 text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            <section className="py-16 lg:py-24 bg-accent-light-blue">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-12">Hear From Our Volunteers</h2>
                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {volunteerTestimonials.map((testimonial: VolunteerTestimonial) => (
                             <div key={testimonial.name} className="bg-white p-8 rounded-2xl shadow-lg flex flex-col">
                                <p className="text-gray-600 italic flex-grow">"{testimonial.quote}"</p>
                                <div className="flex items-center mt-6">
                                    <img src={testimonial.imageUrl} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div className="ml-4">
                                        <p className="font-bold text-dark-text">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center text-gray-900">
                        Frequently Asked Questions
                    </h2>
                    <div className="mt-12 max-w-3xl mx-auto space-y-4">
                        {volunteerFaqs.map((faq: Faq, index: number) => (
                            <FaqItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-light-lavender">
                <div className="container mx-auto px-6 py-16 lg:py-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-primary-blue">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
                        Apply to the Catazet Volunteer Program and start your journey to becoming a professional Virtual Assistant.
                    </p>
                    <div className="mt-8">
                        <button
                            onClick={handleOpenModal}
                            className="inline-block bg-primary-blue text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:opacity-90 transition-opacity"
                        >
                            Apply to Volunteer
                        </button>
                    </div>
                </div>
            </section>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={modalView === 'agreement' ? 'Volunteer Program Agreement' : 'Volunteer Application'}>
                <div className="flex justify-center items-center gap-2 mb-4">
                    <img src="/assets/logo/Catazetlogomain.png" alt="Catazet Logo" className="h-8 w-auto" />
                    <span className="text-2xl font-poppins font-extrabold text-primary-blue">Catazet</span>
                </div>
                {modalView === 'agreement' ? (
                    <AgreementConfirmation
                        title="Volunteer Program Agreement"
                        onAgree={handleAgree}
                        onCancel={handleCloseModal}
                    >
                        <AgreementText />
                    </AgreementConfirmation>
                ) : (
                    <VolunteerApplicationForm onClose={handleCloseModal} />
                )}
            </Modal>
        </div>
    );
};

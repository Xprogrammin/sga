
import React, { useState, FormEvent } from 'react';
import { EnvelopeIcon, PhoneIcon, LocationMarkerIcon, LoadingSpinnerIcon, CheckIcon } from './icons.tsx';

const contactInfo = [
    {
        icon: <EnvelopeIcon className="w-6 h-6 text-primary-blue" />,
        text: 'catazethr@gmail.com'
    },
    {
        icon: <PhoneIcon className="w-6 h-6 text-primary-blue" />,
        text: '+1 (304) 969-5619'
    },
    {
        icon: <LocationMarkerIcon className="w-6 h-6 text-primary-blue" />,
        text: 'The Workstation VI, NG'
    }
];

interface ContactPageProps {
    navigate: (page: string, context?: any) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const encode = (data: { [key: string]: string }) => {
        return Object.keys(data)
            .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
            .join("&");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encode({ "form-name": "contact-page", ...formData })
        })
        .then(() => {
            setIsSubmitted(true);
        })
        .catch(error => {
            alert("Error submitting form: " + error);
        })
        .finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <div className="pt-20 bg-white">
            {/* Hero Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold text-gray-900 leading-tight">
                        Get in Touch with <span className="text-primary-blue">Catazet</span>
                    </h1>
                    <p className="mt-6 text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                        We're here to help! Whether you have questions about our services, need support, or want to explore partnership opportunities, feel free to reach out.
                    </p>
                </div>
            </section>

            {/* Contact Form and Info Section */}
            <section className="py-16 lg:py-24 bg-light-gray">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                        {/* Contact Information */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            <h2 className="text-3xl font-poppins font-bold text-gray-900 mb-8">Contact Information</h2>
                            <div className="space-y-8">
                                {contactInfo.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="bg-accent-light-blue w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <p className="text-lg text-gray-700">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                            {isSubmitted ? (
                                <div className="text-center flex flex-col justify-center items-center min-h-[460px]">
                                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <CheckIcon className="h-10 w-10 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-poppins font-bold text-gray-900">Thank you!</h2>
                                    <p className="mt-2 text-gray-600">Thanks, your message has been submitted.</p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-poppins font-bold text-gray-900 mb-8">Send Us a Message</h2>
                                    <form name="contact-page" data-netlify="true" className="space-y-4" onSubmit={handleSubmit}>
                                        <input type="hidden" name="form-name" value="contact-page" />
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                            <input 
                                                type="text" 
                                                id="name" 
                                                name="name" 
                                                placeholder="Enter your name" 
                                                className="w-full px-4 py-3 bg-light-gray border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50" 
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                                            <input 
                                                type="email" 
                                                id="email" 
                                                name="email" 
                                                placeholder="Enter your email" 
                                                className="w-full px-4 py-3 bg-light-gray border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50" 
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                            <input 
                                                type="text" 
                                                id="subject" 
                                                name="subject" 
                                                placeholder="Subject of your inquiry" 
                                                className="w-full px-4 py-3 bg-light-gray border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50" 
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                            <textarea 
                                                id="message" 
                                                name="message" 
                                                rows={4} 
                                                placeholder="Type your message here..." 
                                                className="w-full px-4 py-3 bg-light-gray border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                required
                                            ></textarea>
                                        </div>
                                        <div>
                                            <button type="submit" disabled={isSubmitting} className="w-full bg-primary-blue text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                                                {isSubmitting ? (
                                                    <>
                                                        <LoadingSpinnerIcon className="w-5 h-5 mr-2" />
                                                        Sending...
                                                    </>
                                                ) : 'Send Message'}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-light-lavender">
                <div className="container mx-auto px-6 py-16 lg:py-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-primary-blue">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
                        Join hundreds of businesses that have boosted their productivity and efficiency with Catazet's virtual assistants.
                    </p>
                    <div className="mt-8">
                        <button
                            onClick={() => navigate('services')}
                            className="inline-block bg-primary-blue text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105"
                        >
                            Get Started Today
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

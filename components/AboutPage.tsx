

import React from 'react';
import { aboutPageFeatures, coreValues, leadershipTeam } from '../constants.tsx';
import type { TeamMember } from '../types.ts';
import { TwitterIcon, LinkedInIcon, CalendarIcon } from './icons.tsx';

const FeatureCard: React.FC<{ feature: typeof aboutPageFeatures[0], index: number }> = ({ feature, index }) => (
    <div 
        className="bg-primary-blue text-white p-6 rounded-2xl text-center flex flex-col items-center opacity-0 animate-fade-in-up shadow-lg transition-transform duration-300 hover:-translate-y-2"
        style={{ animationDelay: `${index * 100}ms` }}
    >
        <div className="bg-white/20 backdrop-blur-sm text-white w-16 h-16 rounded-full flex items-center justify-center mb-5">
            {React.cloneElement(feature.icon, { className: 'w-8 h-8' })}
        </div>
        <h3 className="text-xl font-bold text-white">{feature.title}</h3>
        <p className="mt-2 text-blue-100 text-sm flex-grow">{feature.description}</p>
    </div>
);

const ValueCard: React.FC<{ value: typeof coreValues[0], index: number }> = ({ value, index }) => (
    <div 
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center opacity-0 animate-fade-in-up"
        style={{ animationDelay: `${index * 100}ms` }}
    >
        {value.icon}
        <h3 className="mt-4 text-lg font-bold text-dark-text">{value.title}</h3>
        <p className="mt-2 text-gray-600 text-sm">{value.description}</p>
    </div>
);

interface AboutPageProps {
    navigate: (page: string, context?: any) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
    return (
        <div className="pt-20 bg-white text-dark-text">
            {/* Hero Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold leading-tight">
                        Empowering Businesses, <span className="text-primary-blue">Transforming Lives</span>
                    </h1>
                    <p className="mt-6 text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                        Catazet is dedicated to connecting global businesses with exceptional virtual talent from the Philippines, India, and Nigeria, fostering growth and creating opportunities.
                    </p>
                </div>
            </section>

            {/* Story & Purpose Section */}
            <section className="pb-16 lg:pb-24">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-12">
                        Our Story & Purpose
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
                        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <h3 className="text-2xl font-bold text-primary-blue mb-4">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Our mission is to revolutionize the way businesses operate by providing seamless access to a diverse pool of highly skilled virtual assistants from key global talent hubs like the Philippines, India, and Nigeria. We empower entrepreneurs and businesses to scale efficiently, while simultaneously creating sustainable employment opportunities and fostering economic growth.
                            </p>
                        </div>
                        <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <h3 className="text-2xl font-bold text-primary-blue mb-4">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We envision a future where geographical boundaries no longer limit talent acquisition. Catazet strives to be the leading platform for virtual assistant services, recognized for its commitment to quality, reliability, and ethical practices. We aim to build a global community where talent thrives and businesses achieve unprecedented success through strategic partnerships.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Catazet Section */}
            <section className="py-16 lg:py-24 bg-light-gray">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-12 text-dark-text">Why Choose Catazet?</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {aboutPageFeatures.map((feature, index) => (
                            <FeatureCard key={feature.title} feature={feature} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-12">Our Core Values</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {coreValues.map((value, index) => (
                            <ValueCard key={value.title} value={value} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Founder Section */}
            <section className="py-16 lg:py-24 bg-light-gray">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-12">Meet Our Founder</h2>
                    <div className="opacity-0 animate-fade-in-up">
                        {leadershipTeam.length > 0 && (() => {
                            const member = leadershipTeam[0];
                            return (
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden grid lg:grid-cols-2 max-w-5xl mx-auto">
                                    
                                    {/* Left Column: Visuals */}
                                    <div className="grid grid-cols-2 items-center gap-4 md:gap-6 p-6 md:p-8 bg-light-gray/50">
                                        {/* Sub-column 1: Image */}
                                        <div className="flex justify-center">
                                            <img src={member.imageUrl} alt={member.name} className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-4 border-white" />
                                        </div>

                                        {/* Sub-column 2: Socials & CTA */}
                                        <div className="flex flex-col h-full justify-center">
                                            <h4 className="font-bold text-dark-text text-center md:text-left">Connect with {member.name.split(' ')[0]}</h4>
                                            <div className="space-y-3 mt-4">
                                                {member.socials?.linkedin && (
                                                    <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-blue transition-colors group">
                                                        <div className="bg-white p-1.5 rounded-full shadow-sm group-hover:bg-accent-light-blue"><LinkedInIcon className="w-5 h-5 text-[#0077B5]" /></div>
                                                        <span className="font-medium">LinkedIn</span>
                                                    </a>
                                                )}
                                                {member.socials?.twitter && (
                                                    <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-blue transition-colors group">
                                                        <div className="bg-white p-1.5 rounded-full shadow-sm group-hover:bg-accent-light-blue"><TwitterIcon className="w-5 h-5 text-[#1DA1F2]" /></div>
                                                        <span className="font-medium">Twitter</span>
                                                    </a>
                                                )}
                                            </div>
                                            <a href="https://calendly.com/catazethr/30min" target="_blank" rel="noopener noreferrer" className="mt-6 w-full bg-primary-blue text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:opacity-90 transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm">
                                                <CalendarIcon className="w-4 h-4" />
                                                Book a Call
                                            </a>
                                        </div>
                                    </div>

                                    {/* Right Column: Bio */}
                                    <div className="p-8 md:p-10 flex flex-col justify-center">
                                        <h3 className="text-3xl font-bold font-poppins text-dark-text">{member.name}</h3>
                                        <p className="text-primary-blue font-semibold text-lg mt-1">{member.title}</p>
                                        <p className="mt-4 text-gray-600 leading-relaxed">{member.bio}</p>
                                    </div>
                                </div>
                            );
                        })()}
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
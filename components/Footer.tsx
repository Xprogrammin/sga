
import React, { useState } from 'react';
import { footerLinks } from '../constants.tsx';
import type { FooterLink, FooterSection, Page, PageContext } from '../types.ts';
import { FacebookIcon, TwitterIcon, YouTubeIcon,  ChevronDownIcon, InstagramIcon, TikTokIcon, LinkedInIcon } from './icons.tsx';

interface FooterProps {
  navigate: (page: string) => void;
  getPathFromState: (page: Page, context: PageContext) => string;
}

const FooterAccordionItem: React.FC<{
    section: FooterSection;
    isOpen: boolean;
    onToggle: () => void;
    navigate: (page: string) => void;
    getPathFromState: (page: Page, context: PageContext) => string;
}> = ({ section, isOpen, onToggle, navigate, getPathFromState }) => {
    
    const handleLinkClick = (e: React.MouseEvent, href: string) => {
        if (href.startsWith('http')) {
            return;
        }
        if (href && href !== '#') {
            e.preventDefault();
            navigate(href);
        }
    };
    
    return (
        <div className="border-b border-gray-800 last-of-type:border-none">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center py-4 font-semibold text-lg text-gray-200"
            >
                <span>{section.title}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`transition-all duration-300 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                    <ul className="pb-4 pt-2 space-y-3">
                        {section.links.map((link: FooterLink) => (
                            <li key={link.title}>
                                <a 
                                  href={link.href.startsWith('http') ? link.href : getPathFromState(link.href as Page, {})}
                                  onClick={(e) => handleLinkClick(e, link.href)}
                                  target={link.href.startsWith('http') ? '_blank' : undefined}
                                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                  className="text-gray-400 hover:text-white transition-colors">
                                    {link.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};


export const Footer: React.FC<FooterProps> = ({ navigate, getPathFromState }) => {
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);

    const toggleAccordion = (title: string) => {
        setOpenAccordion(openAccordion === title ? null : title);
    };

    const handleLinkClick = (e: React.MouseEvent, href: string) => {
        if (href.startsWith('http')) {
            return;
        }
        if (href && href !== '#') {
            e.preventDefault();
            navigate(href);
        }
    };

    const SocialLinks = () => (
        <div className="mt-6">
            <p className="font-semibold text-gray-300">Follow us</p>
            <div className="flex space-x-4 mt-3">
                <a href="https://www.facebook.com/profile.php?id=61576944080021" aria-label="Facebook" className="w-6 h-6 text-gray-400 hover:text-white transition-colors"><FacebookIcon /></a>
                <a href="https://x.com/CatazetVA" aria-label="X" className="w-6 h-6 text-gray-400 hover:text-white transition-colors"><TwitterIcon /></a>
                <a href="https://www.youtube.com/@Catazetvas" aria-label="YouTube" className="w-6 h-6 text-gray-400 hover:text-white transition-colors"><YouTubeIcon /></a>
                <a href="https://www.instagram.com/catazetvas" aria-label="Instagram" className="w-6 h-6 text-gray-400 hover:text-white transition-colors"><InstagramIcon /></a>
                <a href="https://www.tiktok.com/@catazetva" aria-label="TikTok" className="w-6 h-6 text-gray-400 hover:text-white transition-colors"><TikTokIcon /></a>
                <a href="https://www.linkedin.com/company/catazet" aria-label="LinkedIn" className="w-6 h-6 text-gray-400 hover:text-white transition-colors"><LinkedInIcon /></a>
            </div>
        </div>
    );

    const BrandingSection = () => (
         <div>
            <a href={getPathFromState('home', {})} onClick={(e) => { e.preventDefault(); navigate('home'); }} className="flex items-center gap-2">
                <img src="/assets/logo/Catazetlogoblue.png" alt="Catazet Logo" className="h-8 w-auto" />
                <span className="text-2xl font-poppins font-bold text-white hover:opacity-90 transition-opacity">Catazet</span>
            </a>
            <p className="mt-2 text-gray-400">Catalyze your productivity</p>
        </div>
    );

    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-6 py-12">
                
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-10">
                    <div className="col-span-2 lg:col-span-2">
                        <BrandingSection />
                        <SocialLinks />
                    </div>
                    {footerLinks.map((section) => (
                        <div key={section.title} className="col-span-1">
                            <h4 className="font-semibold tracking-wider uppercase text-gray-300">{section.title}</h4>
                            <ul className="mt-4 space-y-2">
                                {section.links.map((link: FooterLink) => (
                                    <li key={link.title}>
                                        <a 
                                            href={link.href.startsWith('http') ? link.href : getPathFromState(link.href as Page, {})}
                                            onClick={(e) => handleLinkClick(e, link.href)}
                                            target={link.href.startsWith('http') ? '_blank' : undefined}
                                            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            className="text-gray-400 hover:text-white transition-colors">
                                            {link.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="md:hidden">
                    <BrandingSection />
                    <div className="mt-8 border-t border-gray-800">
                        {footerLinks.map(section => (
                            <FooterAccordionItem
                                key={section.title}
                                section={section}
                                isOpen={openAccordion === section.title}
                                onToggle={() => toggleAccordion(section.title)}
                                navigate={navigate}
                                getPathFromState={getPathFromState}
                            />
                        ))}
                    </div>
                    <SocialLinks />
                </div>
                
                <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Catazet. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
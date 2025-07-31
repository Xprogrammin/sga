
import React, { useState, useEffect, useRef } from 'react';
import { navLinks } from '../constants.tsx';
import { MenuIcon, XIcon, ChevronDownIcon } from './icons.tsx';
import type { Page, PageContext } from '../types.ts';

interface HeaderProps {
  navigate: (page: string, context?: any) => void;
  currentPage: string;
  openAuthModal: (mode: 'login' | 'signup') => void;
  openPdfModal: () => void;
  getPathFromState: (page: Page, context: PageContext) => string;
}

export const Header: React.FC<HeaderProps> = ({ navigate, currentPage, openAuthModal, openPdfModal, getPathFromState }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleDropdownEnter = (linkName: string) => {
    if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
        dropdownTimeoutRef.current = null;
    }
    setOpenDropdown(linkName);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = window.setTimeout(() => {
        setOpenDropdown(null);
    }, 200); // 200ms delay to allow moving mouse to dropdown
  };


  const handleNavClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    
    if (page === 'download-services') {
        openPdfModal();
        setIsMenuOpen(false);
        setOpenDropdown(null);
        setOpenMobileSubmenu(null);
        return;
    }

    if (page && page !== '#') {
      navigate(page);
    }
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setOpenMobileSubmenu(null);
  };

  const handleAuthClick = (mode: 'login' | 'signup') => {
    openAuthModal(mode);
    setIsMenuOpen(false);
  };
  
  const renderNavLink = (link: typeof navLinks[0]) => {
    const pageTarget = (link.href && link.href !== '#') ? link.href : null;
    const isActive = currentPage === pageTarget;

    if (link.subLinks) {
        const isDropdownActive = link.subLinks.some(subLink => subLink.href === currentPage);
        return (
          <div
            key={link.name}
            className="relative"
            onMouseEnter={() => handleDropdownEnter(link.name)}
            onMouseLeave={handleDropdownLeave}
          >
            <button 
              className={`flex items-center gap-1 font-medium hover:text-primary-blue transition-colors ${isDropdownActive ? 'text-primary-blue' : 'text-gray-600'}`}
            >
              <span>{link.name}</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            {openDropdown === link.name && (
              <div className="absolute top-full mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-10 ring-1 ring-black ring-opacity-5">
                {link.subLinks.map((subLink) => {
                    const isSubActive = subLink.href === currentPage;
                    return (
                        <a
                            key={subLink.name}
                            href={getPathFromState(subLink.href as Page, {})}
                            onClick={(e) => handleNavClick(e, subLink.href)}
                            className={`block w-full text-left px-4 py-2 transition-colors ${isSubActive ? 'bg-accent-light-blue text-primary-blue font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            {subLink.name}
                        </a>
                    );
                })}
              </div>
            )}
          </div>
        );
    }
    
    return (
      <a 
        key={link.name} 
        href={pageTarget ? getPathFromState(pageTarget as Page, {}) : '#'}
        onClick={(e) => pageTarget ? handleNavClick(e, pageTarget) : undefined}
        className={isActive
            ? "bg-primary-blue text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all duration-300" 
            : "text-gray-600 font-medium hover:text-primary-blue transition-colors"}
       >
        {link.name}
      </a>
    )
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 bg-white shadow-sm backdrop-blur-md lg:bg-transparent lg:shadow-none ${
      isScrolled || isMenuOpen
        ? 'lg:bg-white/80'
        : 'lg:bg-white/80 lg:shadow-sm'
    }`}>
      <div className="container mx-auto px-6 h-full flex justify-between items-center">
        <a href={getPathFromState('home', {})} onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-2">
          <img src="/assets/logo/Catazetlogomain.png" alt="Catazet Logo" className="h-8 w-auto" />
          <span className="text-2xl font-poppins font-extrabold text-primary-blue">Catazet</span>
        </a>
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => renderNavLink(link))}
        </nav>
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={() => openAuthModal('login')}
            className="bg-white border border-gray-200 text-primary-blue font-medium px-5 py-2 rounded-lg shadow-sm hover:bg-accent-light-blue transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="bg-primary-blue text-white font-semibold px-5 py-2 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
          >
            Sign Up
          </button>
        </div>
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
            {isMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`lg:hidden bg-white transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 border-t border-gray-200/50">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
                 const pageTarget = (link.href && link.href !== '#') ? link.href : null;
                 const isActive = currentPage === pageTarget;
                 
                 if (link.subLinks) {
                     const isDropdownActive = link.subLinks.some(subLink => subLink.href === currentPage);
                     return (
                        <div key={link.name}>
                          <button
                            onClick={() => setOpenMobileSubmenu(openMobileSubmenu === link.name ? null : link.name)}
                            className={`w-full flex justify-between items-center text-lg font-medium p-2 rounded-md transition-colors ${isDropdownActive ? 'text-primary-blue' : 'text-gray-800 hover:text-primary-blue'}`}
                          >
                            <span>{link.name}</span>
                            <ChevronDownIcon className={`w-5 h-5 transform transition-transform duration-300 ${openMobileSubmenu === link.name ? 'rotate-180' : ''}`} />
                          </button>
                          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openMobileSubmenu === link.name ? 'max-h-96' : 'max-h-0'}`}>
                            <div className="pl-4 pt-2 flex flex-col space-y-2">
                              {link.subLinks.map((subLink) => {
                                const isSubActive = subLink.href === currentPage;
                                return (
                                <a 
                                  key={subLink.name} 
                                  href={getPathFromState(subLink.href as Page, {})}
                                  onClick={(e) => handleNavClick(e, subLink.href)}
                                  className={`block p-2 rounded-md transition-colors ${isSubActive ? 'bg-accent-light-blue text-primary-blue font-semibold' : 'text-gray-700 font-normal hover:text-primary-blue'}`}>
                                  {subLink.name}
                                </a>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                     )
                 }
                return (
                    <a 
                        key={link.name} 
                        href={pageTarget ? getPathFromState(pageTarget as Page, {}) : '#'} 
                        onClick={(e) => pageTarget ? handleNavClick(e, pageTarget) : undefined} 
                        className={isActive
                            ? "bg-accent-light-blue text-primary-blue text-lg font-medium p-2 rounded-md"
                            : "text-gray-800 text-lg font-medium hover:text-primary-blue transition-colors p-2 rounded-md"
                        }
                    >
                        {link.name}
                    </a>
                )
            })}
          </nav>
          <div className="mt-6 border-t pt-6 flex flex-col space-y-4">
            <button onClick={() => handleAuthClick('login')} className="bg-white border border-gray-200 text-primary-blue text-lg font-medium py-3 px-6 rounded-lg shadow-md hover:bg-accent-light-blue transition-colors text-center">
              Login
            </button>
            <button onClick={() => handleAuthClick('signup')} className="bg-primary-blue text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-opacity text-center">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
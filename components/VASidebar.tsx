
import React from 'react';
import type { VAView, VANavLink } from '../types.ts';
import { vaNavLinks, vaUser } from '../constants.tsx';
import { LogoutIcon, XIcon, SettingsIcon } from './icons.tsx';

interface VASidebarProps {
  activeView: VAView;
  setActiveView: (view: VAView) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

const NavLink: React.FC<{
  link: VANavLink;
  isActive: boolean;
  onClick: () => void;
}> = ({ link, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold ${
      isActive
        ? 'bg-primary-blue text-white shadow-sm'
        : 'text-gray-500 hover:bg-blue-50 hover:text-primary-blue'
    }`}
  >
    <span className="w-5 h-5">{link.icon}</span>
    <span>{link.name}</span>
  </button>
);

export const VASidebar: React.FC<VASidebarProps> = ({
  activeView,
  setActiveView,
  onLogout,
  isMobileOpen,
  setIsMobileOpen,
}) => {
    
  const handleNavigate = (view: VAView) => {
    setActiveView(view);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsMobileOpen(false);
  }

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate('dashboard');
          }}
          className="flex items-center gap-2"
        >
          <img src="/assets/logo/Catazetlogomain.png" alt="Catazet Logo" className="h-8 w-auto" />
          <span className="text-2xl font-poppins font-bold text-primary-blue">
            Catazet
          </span>
        </a>
        <button
          className="lg:hidden text-gray-500 hover:text-gray-800"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close menu"
        >
          <XIcon />
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <nav className="space-y-1">
          {vaNavLinks.map((link) => (
            <NavLink
              key={link.id}
              link={link}
              isActive={activeView === link.id}
              onClick={() => handleNavigate(link.id)}
            />
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <nav className="space-y-1">
          {/* A VA might not have a separate settings page if profile is the main setting */}
           <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-semibold text-gray-500 hover:bg-blue-50 hover:text-primary-blue"
          >
              <span className="w-5 h-5"><LogoutIcon/></span>
              <span>Logout</span>
          </button>
        </nav>
        <div className="flex items-center gap-3 p-2 mt-4 bg-gray-50 rounded-lg">
          <img
            src={vaUser.avatarUrl}
            alt={vaUser.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-900 text-sm">{vaUser.name}</p>
            <p className="text-xs text-gray-500">{vaUser.email}</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col font-sans z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Main navigation"
      >
        {sidebarContent}
      </aside>
    </>
  );
};

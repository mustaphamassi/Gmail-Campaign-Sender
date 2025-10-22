import React, { useState, useRef, useEffect } from 'react';
import { MailIcon } from './icons/MailIcon';
import { UserIcon } from './icons/UserIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface HeaderProps {
  userEmail: string | null;
  onLogout: () => void;
  onNavigateProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ userEmail, onLogout, onNavigateProfile }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <MailIcon className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Gmail Campaign Sender
          </h1>
        </div>
        {userEmail && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-full text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <UserIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              <span>{userEmail}</span>
              <ChevronDownIcon className={`h-4 w-4 text-slate-500 dark:text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  <button onClick={() => { onNavigateProfile(); setMenuOpen(false); }} className="text-slate-700 dark:text-slate-200 group flex items-center w-full px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
                    <ChartBarIcon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300" aria-hidden="true" />
                    My Campaigns
                  </button>
                </div>
                <div className="py-1">
                  <button onClick={() => { onLogout(); setMenuOpen(false); }} className="text-slate-700 dark:text-slate-200 group flex items-center w-full px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
                    <LogoutIcon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

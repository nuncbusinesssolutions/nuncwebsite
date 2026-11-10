import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ArrowRight, ShieldCheck, User } from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Services', route: 'services' },
    { label: 'Portfolio', route: 'portfolio' },
    { label: 'About', route: 'about' },
    { label: 'FAQ', route: 'faq' },
    { label: 'Book Consult', route: 'consultation' },
    { label: 'Contact', route: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-3 text-left group focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-lg tracking-wider shadow-sm group-hover:bg-blue-800 transition-colors">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                NUNC
              </span>
              <span className="text-[10px] tracking-widest text-slate-500 font-semibold uppercase">
                Business Solutions
              </span>
            </div>
          </button>

          {/* Zone 2: 4-6 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <button
                key={link.route}
                onClick={() => navigate(link.route)}
                className={`whitespace-nowrap transition-colors py-1 ${
                  currentRoute === link.route
                    ? 'text-blue-700 font-semibold border-b-2 border-blue-700'
                    : 'hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action + Auth controls */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.role === 'super_admin' || user?.role === 'staff' ? (
                  <button
                    onClick={() => navigate('admin')}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('client-portal')}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shadow-sm"
                  >
                    <User className="w-4 h-4" />
                    <span>Client Portal</span>
                  </button>
                )}
                <button
                  onClick={logout}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('login')}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('contact')}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shadow-sm"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => {
                navigate(link.route);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2.5 rounded-md text-sm font-medium ${
                currentRoute === link.route
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate(user?.role === 'client' ? 'client-portal' : 'admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 text-center text-xs font-semibold text-white bg-blue-700 rounded-lg"
                >
                  {user?.role === 'client' ? 'Go to Client Portal' : 'Go to Admin Dashboard'}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-4 text-center text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate('contact');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 text-center text-xs font-semibold text-white bg-blue-700 rounded-lg"
                >
                  Start a Project
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

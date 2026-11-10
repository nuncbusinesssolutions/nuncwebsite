import React from 'react';
import { Mail, Phone, Globe, Shield, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  navigate: (route: string, subParam?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Company Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base">
                N
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white">
                  NUNC
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 font-semibold uppercase">
                  Business Solutions
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Empowering businesses through innovative custom software, intelligent automation, and bespoke digital solutions designed to simplify operations and accelerate sustainable growth.
            </p>
            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:nuncbusinesssolutions@gmail.com" className="hover:text-white transition-colors">
                  nuncbusinesssolutions@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="tel:09161669188" className="hover:text-white transition-colors">
                  09161669188
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                <span>nuncbusinesssolutions.ph</span>
              </div>
            </div>
          </div>

          {/* Core Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('services')} className="hover:text-white transition-colors text-left">
                  Business Management ERP
                </button>
              </li>
              <li>
                <button onClick={() => navigate('services')} className="hover:text-white transition-colors text-left">
                  Web Applications
                </button>
              </li>
              <li>
                <button onClick={() => navigate('services')} className="hover:text-white transition-colors text-left">
                  AI Chatbots & Automation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('services')} className="hover:text-white transition-colors text-left">
                  Point of Sale (POS) Systems
                </button>
              </li>
              <li>
                <button onClick={() => navigate('services')} className="hover:text-white transition-colors text-left">
                  Inventory & Sales Ledgers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('services')} className="hover:text-white transition-colors text-left">
                  Travel & Tours Management
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Company & Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('about')} className="hover:text-white transition-colors">
                  About Our Company
                </button>
              </li>
              <li>
                <button onClick={() => navigate('portfolio')} className="hover:text-white transition-colors">
                  Demonstration Projects
                </button>
              </li>
              <li>
                <button onClick={() => navigate('consultation')} className="hover:text-white transition-colors">
                  Schedule Consultation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('client-portal')} className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Client Portal</span>
                  <ArrowUpRight className="w-3 h-3 text-blue-400" />
                </button>
              </li>
              <li>
                <button onClick={() => navigate('admin')} className="hover:text-white transition-colors flex items-center gap-1">
                  <Shield className="w-3 h-3 text-slate-500" />
                  <span>Admin Console</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Center Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Legal Center
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('legal', 'privacy-policy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('legal', 'terms-and-conditions')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('legal', 'payment-terms')} className="hover:text-white transition-colors">
                  Payment Terms
                </button>
              </li>
              <li>
                <button onClick={() => navigate('legal', 'refund-and-cancellation-policy')} className="hover:text-white transition-colors">
                  Refund & Cancellation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('legal', 'service-agreement')} className="hover:text-white transition-colors">
                  Service Agreement
                </button>
              </li>
              <li>
                <button onClick={() => navigate('legal', 'data-protection-policy')} className="hover:text-white transition-colors">
                  Data Protection
                </button>
              </li>
              <li>
                <button onClick={() => navigate('legal', 'cookie-policy')} className="hover:text-white transition-colors">
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} NUNC Business Solutions. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Philippines & International Enterprise Services</span>
            <span>·</span>
            <span>nuncbusinesssolutions.ph</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

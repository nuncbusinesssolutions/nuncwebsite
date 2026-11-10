/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import { DemoSwitcher } from './components/DemoSwitcher';

import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ServicesPage } from './pages/public/ServicesPage';
import { PortfolioPage } from './pages/public/PortfolioPage';
import { FAQPage } from './pages/public/FAQPage';
import { ContactPage } from './pages/public/ContactPage';
import { ConsultationPage } from './pages/public/ConsultationPage';
import { LegalCenterPage } from './pages/public/LegalCenterPage';
import { AuthPage } from './pages/public/AuthPage';

import { ClientPortal } from './pages/client/ClientPortal';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  
  // Simple client-side router
  const [route, setRoute] = useState<string>('home');
  const [subParam, setSubParam] = useState<string | undefined>(undefined);

  const navigate = (newRoute: string, param?: string) => {
    setRoute(newRoute);
    setSubParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAdminArea = route === 'admin';

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      
      {/* Top Demo Switcher Toolbar for instant role evaluation */}
      <DemoSwitcher navigate={navigate} currentRoute={route} />

      {/* Main Public Navbar (shown everywhere except inside full-screen admin console if preferred, or on all pages) */}
      {!isAdminArea && <Navbar currentRoute={route} navigate={navigate} />}

      {/* Page Routing */}
      <div className="flex-1">
        {route === 'home' && <HomePage navigate={navigate} />}
        {route === 'about' && <AboutPage navigate={navigate} />}
        {route === 'services' && <ServicesPage navigate={navigate} />}
        {route === 'portfolio' && <PortfolioPage navigate={navigate} />}
        {route === 'faq' && <FAQPage navigate={navigate} />}
        {route === 'contact' && <ContactPage navigate={navigate} preselectedServiceId={subParam} />}
        {route === 'consultation' && <ConsultationPage navigate={navigate} />}
        {route === 'legal' && <LegalCenterPage initialSlug={subParam} navigate={navigate} />}
        {route === 'login' && <AuthPage navigate={navigate} defaultMode="login" />}
        {route === 'register' && <AuthPage navigate={navigate} defaultMode="register" />}
        
        {/* Protected Client Portal */}
        {route === 'client-portal' && <ClientPortal navigate={navigate} />}

        {/* Protected Admin & Staff Dashboard */}
        {route === 'admin' && <AdminDashboard navigate={navigate} />}
      </div>

      {/* Floating Hybrid Live Chat (shown on public and client pages) */}
      {!isAdminArea && <ChatWidget />}

      {/* Footer (shown on public and client pages) */}
      {!isAdminArea && <Footer navigate={navigate} />}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

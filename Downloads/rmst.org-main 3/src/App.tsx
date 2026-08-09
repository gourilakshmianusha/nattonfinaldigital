import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CsrInquiryModal } from './components/CsrInquiryModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { FloatingWidgets } from './components/FloatingWidgets';

// Import Views
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { ProgramsView } from './views/ProgramsView';
import { ImpactView } from './views/ImpactView';
import { CsrComplianceView } from './views/CsrComplianceView';
import { EventsView } from './views/EventsView';
import { ResourcesView } from './views/ResourcesView';
import { BlogView } from './views/BlogView';
import { GalleryView } from './views/GalleryView';
import { DonateView } from './views/DonateView';
import { VolunteerView } from './views/VolunteerView';
import { PartnerPortalView } from './views/PartnerPortalView';
import { MediaView } from './views/MediaView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ContactView } from './views/ContactView';
import { LegalView } from './views/LegalView';
import { AiAssistantView } from './views/AiAssistantView';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isCsrModalOpen, setIsCsrModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);

  // Sync dark mode class on HTML body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Scroll to top on navigation change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col justify-between font-sans selection:bg-emerald-800 selection:text-white">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenCsrModal={() => setIsCsrModalOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {activeTab === 'home' && (
          <HomeView
            setActiveTab={setActiveTab}
            onOpenCsrModal={() => setIsCsrModalOpen(true)}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            setActiveTab={setActiveTab}
            onOpenCsrModal={() => setIsCsrModalOpen(true)}
          />
        )}

        {activeTab === 'programs' && (
          <ProgramsView
            setActiveTab={setActiveTab}
            onOpenCsrModal={() => setIsCsrModalOpen(true)}
          />
        )}

        {activeTab === 'impact' && (
          <ImpactView
            setActiveTab={setActiveTab}
            onOpenCsrModal={() => setIsCsrModalOpen(true)}
          />
        )}

        {activeTab === 'csr-compliance' && (
          <CsrComplianceView
            onOpenCsrModal={() => setIsCsrModalOpen(true)}
          />
        )}

        {activeTab === 'events' && <EventsView />}

        {activeTab === 'resources' && <ResourcesView />}

        {activeTab === 'blog' && <BlogView setActiveTab={setActiveTab} />}

        {activeTab === 'gallery' && <GalleryView setActiveTab={setActiveTab} />}

        {activeTab === 'donate' && <DonateView />}

        {activeTab === 'volunteer' && <VolunteerView />}

        {activeTab === 'partner-portal' && <PartnerPortalView />}

        {activeTab === 'media' && <MediaView />}

        {(activeTab === 'admin-dashboard' || activeTab === 'admin') && <AdminDashboardView setActiveTab={setActiveTab} />}

        {activeTab === 'contact' && <ContactView />}

        {activeTab === 'ai-assistant' && <AiAssistantView />}

        {['privacy-policy', 'terms-conditions', 'cookie-policy', 'refund-policy', 'faq'].includes(activeTab) && (
          <LegalView
            pageType={activeTab as any}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Footer Bar */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenCsrModal={() => setIsCsrModalOpen(true)}
      />

      {/* CSR Inquiry Modal */}
      <CsrInquiryModal
        isOpen={isCsrModalOpen}
        onClose={() => setIsCsrModalOpen(false)}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        setActiveTab={setActiveTab}
      />

      {/* Floating Mitra AI & WhatsApp Widgets on all pages (bottom right) */}
      <FloatingWidgets
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

export default App;

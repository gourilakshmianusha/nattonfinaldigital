import React, { useState } from 'react';
import { Logo } from './Logo';
import { trustInfo } from '../data/mockData';
import {
  Phone,
  Mail,
  Heart,
  Handshake,
  Bot,
  Search,
  Menu,
  X,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  LayoutDashboard,
  Lock
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCsrModal: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCsrModal,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'programs', label: 'Programs' },
    { id: 'impact', label: 'Impact Stories' },
    { id: 'csr-compliance', label: 'CSR Hub' },
    { id: 'blog', label: 'News & Blog' },
    { id: 'gallery', label: 'Field Gallery' },
    { id: 'ai-assistant', label: 'Mitra AI', badge: 'AI' },
    { id: 'admin-dashboard', label: 'Admin Panel', badge: 'Trust' },
    { id: 'events', label: 'Events' },
    { id: 'resources', label: 'Resource Centre' },
    { id: 'donate', label: 'Donate' },
    { id: 'volunteer', label: 'Volunteer' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
      {/* Top Bar for CSR & Trust Credential Info */}
      <div className="bg-emerald-950 text-emerald-100 text-[11px] sm:text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center border-b border-emerald-900/60 overflow-x-auto">
        <div className="flex items-center gap-4 shrink-0">
          <a href={`tel:${trustInfo.phone}`} className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <Phone className="w-3 h-3 text-amber-400" />
            <span className="font-mono font-medium">{trustInfo.phone}</span>
          </a>
          <a href={`mailto:${trustInfo.email}`} className="hidden sm:flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <Mail className="w-3 h-3 text-amber-400" />
            <span>{trustInfo.email}</span>
          </a>
          <span className="hidden md:flex items-center gap-1 text-emerald-300/80">
            <Building2 className="w-3 h-3 text-amber-400" />
            <span>Hubballi, KA</span>
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px] font-mono font-semibold">
          <button
            onClick={() => handleNavClick('admin-dashboard')}
            className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 px-2 py-0.5 rounded border border-amber-400/40 transition flex items-center gap-1 font-bold"
            title="Open Admin Command Center"
          >
            <Lock className="w-3 h-3 text-amber-300" />
            <span>Admin Panel</span>
          </button>
          <span className="hidden lg:inline bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-800">
            NGO Darpan: {trustInfo.ngoDarpanId}
          </span>
          <span className="hidden md:inline bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-300 border border-emerald-800">
            CSR-1: {trustInfo.csrRegNo}
          </span>
          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            80G Exempt
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="cursor-pointer shrink-0" onClick={() => handleNavClick('home')}>
          <Logo height={42} />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 font-medium text-xs font-sans">
          {navItems.slice(0, 8).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-2.5 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60'
                    : 'text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-extrabold bg-gradient-to-r from-amber-500 to-emerald-600 text-white rounded-full leading-none animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSearch}
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title="Search Site"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* MITRA AI BUTTON */}
          <button
            onClick={() => handleNavClick('ai-assistant')}
            className={`px-3 py-2.5 rounded-xl transition-all border flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'ai-assistant'
                ? 'bg-emerald-900 text-amber-300 border-emerald-700 shadow-md ring-2 ring-amber-400/50'
                : 'bg-emerald-50 dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-slate-800 hover:bg-emerald-100'
            }`}
            title="Mitra AI 24x7 Knowledge Copilot"
          >
            <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Mitra AI</span>
            <span className="px-1 py-0.2 bg-amber-400 text-slate-950 text-[9px] font-extrabold rounded">24x7</span>
          </button>

          {/* ADMIN PANEL BUTTON */}
          <button
            onClick={() => handleNavClick('admin-dashboard')}
            className={`px-3 py-2.5 rounded-xl transition-all border flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'admin-dashboard' || activeTab === 'admin'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
            title="Trust Admin Command Center"
          >
            <LayoutDashboard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden md:inline">Admin Panel</span>
          </button>

          <button
            onClick={onOpenCsrModal}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <Handshake className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">Partner</span>
          </button>

          <button
            onClick={() => handleNavClick('donate')}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-white text-xs font-extrabold shadow-md shadow-emerald-900/20 transition-all flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Donate</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => handleNavClick('ai-assistant')}
              className="py-2.5 px-2 rounded-xl bg-emerald-900 text-amber-300 font-bold text-xs flex items-center justify-center gap-1"
            >
              <Bot className="w-4 h-4" />
              Mitra AI
            </button>
            <button
              onClick={() => handleNavClick('admin-dashboard')}
              className="py-2.5 px-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin
            </button>
            <button
              onClick={() => handleNavClick('donate')}
              className="py-2.5 px-2 rounded-xl bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1"
            >
              <Heart className="w-4 h-4 text-amber-300 fill-amber-300" />
              Donate
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between ${
                  activeTab === item.id
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-900 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex flex-col gap-2">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Raita Mitra Social Trust (R)</p>
            <p>{trustInfo.address}</p>
            <p>Phone: {trustInfo.phone}</p>
          </div>
        </div>
      )}
    </header>
  );
};

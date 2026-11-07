import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Menu, X, ChevronDown, ArrowRight, Activity, Command, Layers } from 'lucide-react';
import Logo from './Logo';
import {growthRequest} from '../growth/client';
import {searchScore,toolSearchEntry,toolHref} from '../growth/search.mjs';
import {GrowthTool} from '../growth/types';
import { RoutePath } from '../types';
import { agencyServices, getServiceSlug, services } from '../data/services';
import { products, solutions } from '../data/navigation';

interface HeaderProps {
  currentPath: RoutePath;
  setPath: (path: RoutePath) => void;
  darkMode: boolean;
}

export default function Header({ currentPath, setPath, darkMode }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'services' | 'products' | 'solutions' | 'industries' | 'tools' | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTools,setSearchTools]=useState<GrowthTool[]>([]),[toolSearchLoading,setToolSearchLoading]=useState(false),[toolSearchError,setToolSearchError]=useState(false),[toolSearchRetry,setToolSearchRetry]=useState(0);
  useEffect(()=>{if(!searchOpen)return;let live=true;setToolSearchLoading(true);setToolSearchError(false);void growthRequest('/api/tools').then(data=>{if(live)setSearchTools(data.tools.filter((tool:GrowthTool)=>tool.visible));}).catch(()=>{if(live){setSearchTools([]);setToolSearchError(true);}}).finally(()=>{if(live)setToolSearchLoading(false);});return()=>{live=false;};},[searchOpen,toolSearchRetry]);
  function selectSearchResult(page:{path:RoutePath;href?:string}){setSearchOpen(false);setSearchQuery('');if(page.href)window.location.assign(page.href);else setPath(page.path);}


  // Close dropdowns on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [currentPath]);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const industries = [
    { name: 'Healthcare Industry', path: 'industries/healthcare' as RoutePath, desc: 'Patient onboarding, HIPAA AI triages, automated reminders.' },
    { name: 'Education & EdTech', path: 'industries/education' as RoutePath, desc: 'Instant student counselors, WhatsApp brochures, lead nurture.' },
    { name: 'Real Estate Segment', path: 'industries/real-estate' as RoutePath, desc: 'Prequalified voice bot tours, booking pipeline, buyer scoring.' },
    { name: 'Manufacturing Sector', path: 'industries/manufacturing' as RoutePath, desc: 'Low-stock automated ordering, dispatch logs, internal agents.' },
    { name: 'Retail & E-commerce', path: 'industries/retail-ecommerce' as RoutePath, desc: 'Cart recovery, support bots, personalized coupons.' },
    { name: 'Professional Services', path: 'industries/professional-services' as RoutePath, desc: 'Instant quotation proposals, smart onboarding, invoice logs.' },
  ];

  const tools = [
    { name: 'Free Growth Tools', path: 'free-tools' as RoutePath, desc: 'Free AI, SEO, CRM & ROI calculators to evaluate opportunities and accelerate growth.' },
    { name: 'AI Readiness Assessment', path: 'ai-readiness-assessment' as RoutePath, desc: 'Take a 6-step diagnostic audit to generate an AI strategy score.' },
    { name: 'ROI & Automation Calculator', path: 'roi-calculator' as RoutePath, desc: 'Calculate exact cash and time savings with GrowthOS.' },
    { name: 'Blogs', path: 'blog' as RoutePath, desc: 'Latest tactics on AI, CRM, WhatsApp, and n8n orchestration.' },
  ];

  const searchablePages: {name:string;path:RoutePath;category:string;href?:string;aliases?:string[];description?:string}[] = [
    { name: 'Homepage Growth Center', path: 'home' as RoutePath, category: 'Main' },
    { name: 'Services Overview', path: 'services' as RoutePath, category: 'Services' },
    ...agencyServices.map(service => ({
      name: service.name,
      path: `services/${getServiceSlug(service)}` as RoutePath,
      category: 'Services'
    })),
    ...solutions.map(s => ({ name: s.name, path: s.path, category: 'Products' })),
    ...products.map(p => ({ name: p.name, path: p.path, category: 'Solutions' })),
    ...industries.map(i => ({ name: i.name, path: i.path, category: 'Industries' })),
    ...tools.map(t => ({ name: t.name, path: t.path, category: 'Tools / Resources' })),
    ...searchTools.map(tool=>({name:tool.title,path:(toolHref(tool.id).split('?')[0].slice(1)) as RoutePath,href:toolHref(tool.id),category:'Free Growth Tools',description:tool.description,aliases:toolSearchEntry(tool).aliases})),
    { name: 'About Us', path: 'about' as RoutePath, category: 'Company' },
    { name: 'Contact & Booking', path: 'contact' as RoutePath, category: 'Company' }
  ];

  const filteredSearchResults = searchQuery.trim() === ''
    ? searchablePages.slice(0, 5)
    : searchablePages.map(page=>({page,score:searchScore(page,searchQuery)})).filter(row=>row.score>0).sort((a,b)=>b.score-a.score).map(row=>row.page).filter((page,index,items)=>items.findIndex(other=>(other.href||'/'+other.path)===(page.href||'/'+page.path))===index).slice(0,6);

  const toggleDropdown = (name: 'services' | 'products' | 'solutions' | 'industries' | 'tools') => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <header className={`site-header fixed inset-x-0 top-0 z-50 transition-colors duration-300 border-b backdrop-blur-md ${
      darkMode ? 'bg-[#110B33]/80 border-white/[0.08]' : 'bg-white/80 border-gray-100 shadow-sm'
    }`}>
      {/* Global Banner alert */}
      <div className="bg-gradient-to-r from-[#2E9CAE] via-[#47C7BF] to-[#99D57C] text-white text-[11px] font-medium text-center py-1.5 px-4 tracking-wider uppercase select-none flex items-center justify-center gap-2">
        <span className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-[9px]">Live Announcement</span>
        <span>Book Your Digital Business Strategy</span>
        <a href="/ai-readiness-assessment" className="underline font-bold hover:opacity-80 transition-all ml-1">
          Take AI Assessment →
        </a>
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center justify-start min-h-[5rem] gap-4 xl:gap-8">
          {/* Logo */}
          <div className="mobile-header-logo min-w-0 shrink cursor-pointer" onClick={() => setPath('home')}>
            <Logo darkMode={darkMode} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-6 xl:flex 2xl:gap-8">
            <div className="relative">
              <button
                type="button"
                aria-expanded={activeDropdown === 'services'}
                aria-controls="services-dropdown"
                onMouseEnter={() => setActiveDropdown('services')}
                onClick={() => setActiveDropdown('services')}
                className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded text-xs font-medium transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary 2xl:text-sm ${
                  activeDropdown === 'services' || currentPath.startsWith('services')
                    ? 'text-primary font-semibold'
                    : (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                }`}
              >
                Services
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'services' && (
                <div
                  id="services-dropdown"
                  onMouseLeave={() => setActiveDropdown(null)}
                  className={`absolute left-1/2 mt-1 grid max-h-[70vh] w-[min(620px,90vw)] -translate-x-1/2 grid-cols-2 gap-1 overflow-y-auto rounded-xl border p-3 shadow-xl animate-fade-in ${
                    darkMode ? 'bg-dark/95 border-white/[0.1] text-white' : 'bg-white border-gray-100 text-[#110B33]'
                  }`}
                >
                  <button
                    onClick={() => {
                      setPath('services');
                      setActiveDropdown(null);
                    }}
                    className={`col-span-2 rounded-lg px-3 py-2 text-left text-xs font-bold text-primary ${
                      darkMode ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-50'
                    }`}
                  >
                    All Services
                  </button>
                  {agencyServices.map(service => (
                    <button
                      key={service.id}
                      onClick={() => {
                        setPath(`services/${getServiceSlug(service)}`);
                        setActiveDropdown(null);
                      }}
                      className={`rounded-lg p-2.5 text-left text-xs font-semibold transition-colors ${
                        darkMode ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-50'
                      }`}
                    >
                      {service.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setActiveDropdown('products')}
                onClick={() => toggleDropdown('products')}
                className={`flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-medium transition-colors py-2 2xl:text-sm ${
                  activeDropdown === 'products' || currentPath.startsWith('products')
                    ? 'text-primary font-semibold'
                    : (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                }`}
              >
                Products
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === 'products' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'products' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className={`absolute left-1/2 transform -translate-x-1/2 mt-1 w-[460px] p-4 rounded-xl border grid grid-cols-1 gap-2 shadow-xl animate-fade-in ${
                    darkMode ? 'bg-dark/95 border-white/[0.1] text-white' : 'bg-white border-gray-100 text-[#110B33]'
                  }`}
                >
                  <div className="text-[10px] font-mono tracking-widest text-[#47C7BF] px-2 mb-1 uppercase">
                    Cross-Industry Marketing & Automation
                  </div>
                  <a href="/products" onClick={event => { event.preventDefault(); setPath('products'); setActiveDropdown(null); }} className="flex items-center justify-between rounded-lg border border-primary/20 p-2.5 text-xs font-semibold text-primary hover:bg-primary/10">Explore All Products <ArrowRight className="h-3 w-3" aria-hidden="true" /></a>
                  {solutions.map((s) => (
                    <button
                      key={s.path}
                      onClick={() => {
                        setPath(s.path);
                        setActiveDropdown(null);
                      }}
                      className={`text-left p-2.5 rounded-lg transition-all flex flex-col gap-0.5 ${
                        darkMode ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs font-semibold hover:text-primary transition-colors flex items-center justify-between">
                        {s.name} <ArrowRight className="h-3 w-3 opacity-0 hover:opacity-100" />
                      </span>
                      <span className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{s.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Products Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setActiveDropdown('solutions')}
                onClick={() => toggleDropdown('solutions')}
                className={`flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-medium transition-colors py-2 2xl:text-sm ${
                  activeDropdown === 'solutions' || currentPath.startsWith('solutions')
                    ? 'text-primary font-semibold'
                    : (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                }`}
              >
                Solutions
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === 'solutions' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'solutions' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className={`absolute left-1/2 transform -translate-x-1/2 mt-1 w-[460px] p-4 rounded-xl border grid grid-cols-2 gap-2 shadow-xl animate-fade-in ${
                    darkMode ? 'bg-dark/95 border-white/[0.1] text-white' : 'bg-white border-gray-100 text-[#110B33]'
                  }`}
                >
                  <div className="col-span-2 text-[10px] font-mono tracking-widest text-[#47C7BF] px-2 mb-1 uppercase">
                    Proprietary AI Engines (GrowthOS)
                  </div>
                  <a href="/solutions" onClick={event => { event.preventDefault(); setPath('solutions'); setActiveDropdown(null); }} className="col-span-2 flex items-center justify-between rounded-lg border border-primary/20 p-2.5 text-xs font-semibold text-primary hover:bg-primary/10">Explore All Solutions <ArrowRight className="h-3 w-3" aria-hidden="true" /></a>
                  {products.map((p) => (
                    <button
                      key={p.path}
                      onClick={() => {
                        setPath(p.path);
                        setActiveDropdown(null);
                      }}
                      className={`text-left p-2.5 rounded-lg transition-all flex flex-col gap-0.5 ${
                        darkMode ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs font-semibold text-primary">{p.name}</span>
                      <span className={`text-[9px] leading-tight ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{p.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Industries Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setActiveDropdown('industries')}
                onClick={() => toggleDropdown('industries')}
                className={`flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-medium transition-colors py-2 2xl:text-sm ${
                  activeDropdown === 'industries' || currentPath.startsWith('industries')
                    ? 'text-primary font-semibold'
                    : (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                }`}
              >
                Industries
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === 'industries' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'industries' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className={`absolute left-1/2 transform -translate-x-1/2 mt-1 w-[550px] p-4 rounded-xl border grid grid-cols-2 gap-3 shadow-xl animate-fade-in ${
                    darkMode ? 'bg-dark/95 border-white/[0.1] text-white' : 'bg-white border-gray-100 text-[#110B33]'
                  }`}
                >
                  <div className="col-span-2 text-[10px] font-mono tracking-widest text-[#47C7BF] px-2 mb-1 uppercase">
                    <a href="/industries" onClick={event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();setPath('industries');setActiveDropdown(null);}} className="inline-flex items-center gap-2 hover:underline">View all industries <ArrowRight size={12}/></a>
                  </div>
                  {industries.map((ind) => (
                    <button
                      key={ind.path}
                      onClick={() => {
                        setPath(ind.path);
                        setActiveDropdown(null);
                      }}
                      className={`text-left p-2 rounded-lg transition-all flex flex-col gap-0.5 ${
                        darkMode ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs font-semibold hover:text-primary transition-colors">{ind.name}</span>
                      <span className={`text-[9px] leading-tight ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ind.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Interactive Tools Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setActiveDropdown('tools')}
                onClick={() => toggleDropdown('tools')}
                className={`flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-medium transition-colors py-2 2xl:text-sm ${
                  activeDropdown === 'tools' || currentPath === 'roi-calculator' || currentPath === 'ai-readiness-assessment'
                    ? 'text-primary font-semibold'
                    : (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                }`}
              >
                Resources
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeDropdown === 'tools' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'tools' && (
                <div
                  onMouseLeave={() => setActiveDropdown(null)}
                  className={`absolute right-0 mt-1 w-[380px] p-4 rounded-xl border grid grid-cols-1 gap-2 shadow-xl animate-fade-in ${
                    darkMode ? 'bg-dark/95 border-white/[0.1] text-white' : 'bg-white border-gray-100 text-[#110B33]'
                  }`}
                >
                  <div className="text-[10px] font-mono tracking-widest text-[#47C7BF] px-2 mb-1 uppercase">
                    Interactive Optimization Suites
                  </div>
                  {tools.map((t) => (
                    <button
                      key={t.path}
                      onClick={() => {
                        setPath(t.path);
                        setActiveDropdown(null);
                      }}
                      className={`text-left p-2 rounded-lg transition-all flex flex-col gap-0.5 ${
                        darkMode ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs font-semibold text-primary">{t.name}</span>
                      <span className={`text-[10px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onMouseEnter={() => setActiveDropdown(null)}
              onClick={() => {
                setActiveDropdown(null);
                setPath('about');
                if (currentPath === 'about') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-current={currentPath === 'about' ? 'page' : undefined}
              className={`shrink-0 whitespace-nowrap rounded py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary 2xl:text-sm ${
                currentPath === 'about' || currentPath === 'why-natton-digital' || currentPath === 'our-process'
                  ? 'text-primary font-semibold'
                  : (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
              }`}
            >
              About Us
            </button>

            <button
              onClick={() => setPath('contact')}
              className={`text-sm font-medium transition-colors ${
                currentPath === 'contact'
                  ? 'text-primary font-semibold'
                  : (darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Search & CTAs */}
          <div className="ml-auto flex shrink-0 items-center gap-3">
            {/* Search trigger button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search website"
              className={`p-2 rounded-lg border transition-colors hidden sm:flex items-center gap-2 text-xs font-mono ${
                darkMode
                  ? 'border-white/[0.08] bg-white/[0.02] text-gray-400 hover:text-white hover:border-white/20'
                  : 'border-gray-200 bg-gray-50 text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden 2xl:inline">Search...</span>
              <span className={`hidden 2xl:inline text-[9px] px-1.5 py-0.5 rounded leading-none ${
                darkMode ? 'bg-white/[0.06] text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}>
                ⌘K
              </span>
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search website"
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border sm:hidden ${
                darkMode ? 'border-white/[0.08] text-gray-300' : 'border-gray-200 text-gray-600'
              }`}
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border xl:hidden transition-colors ${
                darkMode
                  ? 'border-white/[0.08] bg-white/[0.02] text-gray-300 hover:text-white'
                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:text-gray-900'
              }`}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setPath('contact')}
              className="hidden md:inline-flex max-w-[13rem] shrink-0 items-center justify-center text-center leading-snug text-xs font-semibold px-4.5 py-2.5 rounded-lg bg-primary hover:bg-opacity-90 hover:shadow-lg transition-all text-white glow-primary hover:scale-[1.02] active:scale-[0.98]"
            >
              Book a Free Strategy Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`mobile-drawer xl:hidden max-h-[calc(100dvh-1px)] overflow-y-auto overscroll-contain px-4 pt-2 pb-6 border-t animate-slide-down ${
          darkMode ? 'bg-[#110B33] border-white/[0.08] text-white' : 'bg-white border-gray-100 text-[#110B33]'
        }`}>
          <div className="space-y-4 font-sans text-sm mt-2">
            <div>
              <p className="text-[10px] font-bold text-[#47C7BF] uppercase mb-1.5 tracking-wider">Services</p>
              <div className="grid grid-cols-1 gap-1 pl-2">
                <button onClick={() => setPath('services')} className="text-left py-1 text-xs text-gray-400 hover:text-primary transition-colors">
                  ↳ All Services
                </button>
                {agencyServices.map(service => (
                  <button
                    key={service.id}
                    onClick={() => setPath(`services/${getServiceSlug(service)}`)}
                    className="text-left py-1 text-xs text-gray-400 hover:text-primary transition-colors"
                  >
                    ↳ {service.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-[#47C7BF] uppercase mb-1.5 tracking-wider">Products</p>
              <div className="grid grid-cols-1 gap-1 pl-2">
                <a href="/products" onClick={event => { event.preventDefault(); setPath('products'); setMobileMenuOpen(false); }} className="py-1 text-xs font-semibold text-primary">Explore All Products</a>
                {solutions.map(s => (
                  <button key={s.path} onClick={() => setPath(s.path)} className="text-left py-1 text-xs text-gray-400 hover:text-primary transition-colors">
                    ↳ {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-[#47C7BF] uppercase mb-1.5 tracking-wider">Solutions</p>
              <div className="grid grid-cols-2 gap-1 pl-2">
                <a href="/solutions" onClick={event => { event.preventDefault(); setPath('solutions'); setMobileMenuOpen(false); }} className="col-span-2 py-1 text-xs font-semibold text-primary">Explore All Solutions</a>
                {products.map(p => (
                  <button key={p.path} onClick={() => setPath(p.path)} className="text-left py-1 text-xs text-gray-400 hover:text-primary transition-colors">
                    ↳ {p.name.split('™')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-[#47C7BF] uppercase mb-1.5 tracking-wider">Industries</p>
              <div className="grid grid-cols-2 gap-1 pl-2 font-medium">
                {industries.map(ind => (
                  <button key={ind.path} onClick={() => setPath(ind.path)} className="text-left py-1 text-xs text-gray-400 hover:text-primary transition-colors">
                    ↳ {ind.name.includes('Real Estate') ? 'Real Estate' : ind.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-[#47C7BF] uppercase mb-1.5 tracking-wider">Tools & Resources</p>
              <div className="grid grid-cols-1 gap-1 pl-2">
                {tools.map(t => (
                  <button key={t.path} onClick={() => setPath(t.path)} className="text-left py-1 text-xs text-gray-400 hover:text-primary transition-colors">
                    ↳ {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-[#47C7BF] uppercase mb-1.5 tracking-wider">Company</p>
              <div className="grid grid-cols-2 gap-1 pl-2">
                <button
                  type="button"
                  onClick={() => {
                    setPath('about');
                    setMobileMenuOpen(false);
                    if (currentPath === 'about') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left py-1 text-xs text-gray-400 hover:text-primary transition-colors"
                >
                  About Us
                </button>
              </div>
            </div>

            <div className={`mobile-drawer-cta sticky bottom-0 -mx-4 mt-2 border-t pt-4 pb-1 px-4 backdrop-blur-md ${
              darkMode ? 'border-white/[0.05] bg-[#110B33]/95' : 'border-gray-100 bg-white/95'
            }`}>
              <button
                onClick={() => setPath('contact')}
                className="w-full py-2.5 text-center rounded-lg bg-primary text-white text-xs font-semibold hover:bg-opacity-90 transition-colors"
              >
                Book a Free Strategy Consultation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal Backdrop & Panel (Global Search Command Center) */}
      {searchOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-x-0 bottom-0 top-[6.5rem] z-[60] flex items-start justify-center overflow-y-auto px-4 pt-4 bg-black/60 backdrop-blur-sm animate-fade-in max-sm:top-[8rem]">
          <div className={`w-full max-w-xl rounded-xl border shadow-2xl overflow-hidden animate-scale-up ${
            darkMode ? 'bg-[#110B33] border-white/10 text-white' : 'bg-white border-gray-200 text-[#110B33]'
          }`}>
            {/* Input bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.05]">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services, solutions, products, industries, tools..."
                onKeyDown={event => {
                  if (event.key === 'Enter' && filteredSearchResults[0]) {
                    selectSearchResult(filteredSearchResults[0]);
                  }
                }}
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-500 font-sans"
                autoFocus
              />
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                darkMode ? 'bg-white/[0.06] text-gray-400' : 'bg-gray-200 text-gray-500'
              }`}>
                ESC to close
              </span>
              <button onClick={() => setSearchOpen(false)}>
                <X className="h-4 w-4 text-gray-400 hover:text-gray-100 transition-colors" />
              </button>
            </div>

            {/* Results listing */}
            <div className="p-3 max-h-[300px] overflow-y-auto">
              <p className="text-[10px] font-mono tracking-wider text-[#47C7BF] uppercase px-3 py-1.5 mb-1 select-none">
                {searchQuery === '' ? '⚡ QUICK NAVIGATION' : '🔍 SEARCH RESULTS'}
              </p>

              <div className="space-y-1">
                {filteredSearchResults.map((page) => (
                  <button
                    key={page.href||page.path}
                    onClick={() => selectSearchResult(page)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all ${
                      darkMode ? 'hover:bg-white/[0.04]' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-semibold font-sans">{page.name}</span>
                    </div>
                    <span className="text-[9px] font-mono text-gray-500 bg-white/[0.03] px-2 py-0.5 rounded uppercase">
                      {page.category}
                    </span>
                  </button>
                ))}

                {toolSearchLoading&&<p className="px-3 py-2 text-sm" role="status">Loading tool catalogue…</p>}
                {toolSearchError&&<p className="px-3 py-2 text-sm" role="status">Tool search could not load. <button className="underline" onClick={()=>setToolSearchRetry(v=>v+1)}>Retry</button></p>}
                {filteredSearchResults.length === 0 && !toolSearchLoading && (
                  <div className="text-center py-6 text-xs text-gray-400 font-sans">
                    No pages matched "{searchQuery}". Try searching for <strong>"Healthcare"</strong> or <strong>"SEO"</strong>.
                  </div>
                )}
              </div>
            </div>

            {/* command footer */}
            <div className="px-4 py-2 border-t border-white/[0.05] bg-white/[0.01] flex items-center justify-between text-[10px] font-mono text-gray-500 select-none">
              <span>Enter key to navigate</span>
              <span className="flex items-center gap-1">
                <Command className="h-3 w-3" /> + K triggers terminal
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}

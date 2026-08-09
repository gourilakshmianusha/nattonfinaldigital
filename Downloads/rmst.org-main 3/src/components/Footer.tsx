import React, { useState } from 'react';
import { Logo } from './Logo';
import { trustInfo } from '../data/mockData';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle,
  Heart,
  Send,
  ExternalLink,
  Lock,
  Award
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenCsrModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenCsrModal }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-emerald-900/40 relative overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Trust Banner */}
        <div className="bg-emerald-950/80 border border-emerald-800/60 rounded-2xl p-6 mb-12 backdrop-blur-md grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-900/80 text-amber-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">NGO Darpan Verified</h4>
              <p className="text-xs text-slate-400 font-mono">{trustInfo.ngoDarpanId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-900/80 text-emerald-400 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">MCA CSR-1 Registered</h4>
              <p className="text-xs text-slate-400 font-mono">{trustInfo.csrRegNo}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-900/80 text-amber-400 rounded-xl">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">80G Tax Exemption</h4>
              <p className="text-xs text-slate-400 font-mono">URN: {trustInfo.tax80gUrn}</p>
            </div>
          </div>

          <div>
            <button
              onClick={onOpenCsrModal}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Download CSR Brochure</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="light" height={46} />
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Raita Mitra Social Trust (R) is a registered non-profit organization (Established 2021) headquartered in Hubballi, Karnataka. Dedicated to sustainable agriculture, women empowerment, rural AI skills, healthcare, and climate resilience.
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{trustInfo.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${trustInfo.phone}`} className="hover:text-amber-400 font-mono">
                  {trustInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${trustInfo.email}`} className="hover:text-amber-400">
                  {trustInfo.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Core Programs */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 font-serif border-b border-emerald-900 pb-2 inline-block">
              Focus Areas
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('programs')} className="hover:text-white transition-colors">
                  Sustainable Agriculture
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('programs')} className="hover:text-white transition-colors">
                  Women Empowerment & SHGs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('programs')} className="hover:text-white transition-colors">
                  Education & AI Digital Skills
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('programs')} className="hover:text-white transition-colors">
                  Health & Nutrition Camps
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('programs')} className="hover:text-white transition-colors">
                  Environment & Climate Action
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('programs')} className="hover:text-white transition-colors">
                  Rural Entrepreneurship
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portals & CSR */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 font-serif border-b border-emerald-900 pb-2 inline-block">
              Enterprise Portals
            </h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => handleNav('csr-compliance')} className="hover:text-amber-400 font-semibold transition-colors flex items-center gap-1">
                  <span>CSR & Compliance Hub</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('partner-portal')} className="hover:text-amber-400 font-semibold transition-colors">
                  Partner Portal (CSR)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('volunteer-portal')} className="hover:text-white transition-colors">
                  Volunteer Portal
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('ai-assistant')} className="hover:text-emerald-400 font-semibold transition-colors flex items-center gap-1">
                  <span>Mitra AI Copilot</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog')} className="hover:text-amber-400 font-semibold transition-colors flex items-center gap-1">
                  <span>News & Blog Page</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-amber-400 font-semibold transition-colors flex items-center gap-1">
                  <span>Field Impact Gallery</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('resources')} className="hover:text-white transition-colors">
                  Resource Centre & Audits
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('admin')} className="hover:text-white transition-colors">
                  Admin Dashboard Demo
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Quick Donate */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 font-serif border-b border-emerald-900 pb-2 inline-block">
              Newsletter
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Receive quarterly impact updates, audited statements, and field stories.
            </p>

            {subscribed ? (
              <div className="bg-emerald-950 text-emerald-300 p-3 rounded-xl border border-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you for subscribing to our impact news!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter corporate email"
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            )}

            <div className="mt-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleNav('donate')}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>Support A Farmer (80G)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Raita Mitra Social Trust (R). All Rights Reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => handleNav('privacy-policy')} className="hover:text-slate-300">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => handleNav('terms-conditions')} className="hover:text-slate-300">
              Terms & Conditions
            </button>
            <span>•</span>
            <button onClick={() => handleNav('cookie-policy')} className="hover:text-slate-300">
              Cookie Policy
            </button>
            <span>•</span>
            <button onClick={() => handleNav('refund-policy')} className="hover:text-slate-300">
              Refund & Cancellation
            </button>
            <span>•</span>
            <button onClick={() => handleNav('faq')} className="hover:text-slate-300">
              FAQ Centre
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

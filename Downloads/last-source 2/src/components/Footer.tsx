import React from 'react';
import Logo from './Logo';
import { RoutePath } from '../types';
import { CheckCircle2, Award, Shield, CheckCircle, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  setPath: (path: RoutePath) => void;
  darkMode: boolean;
}

export default function Footer({ setPath, darkMode }: FooterProps) {
  const navLinks = {
    solutions: [
      { name: 'AI Marketing SaaS', path: 'products/ai-marketing-saas' as RoutePath },
      { name: 'CRM & Automation', path: 'products/crm-ai-automation' as RoutePath },
      { name: 'Conversational AI', path: 'products/conversational-ai' as RoutePath },
      { name: 'WhatsApp Automation', path: 'products/whatsapp-automation' as RoutePath },
      { name: 'AI Calling Agents', path: 'products/ai-calling-agents' as RoutePath },
      { name: 'Cloud Telephony', path: 'products/cloud-telephony' as RoutePath },
      { name: 'RCS Messaging', path: 'products/rcs-messaging' as RoutePath },
      { name: 'AI Agent Workflows', path: 'products/ai-agents' as RoutePath },
    ],
    products: [
      { name: 'GrowthOS™ Suite', path: 'solutions/growth-os' as RoutePath },
      { name: 'AI Marketing Platform', path: 'solutions/ai-marketing-platform' as RoutePath },
      { name: 'BusinessOS™', path: 'solutions/business-os' as RoutePath },
      { name: 'AgenticOS™ Framework', path: 'solutions/agentic-os' as RoutePath },
    ],
    industries: [
      { name: 'Healthcare', path: 'industries/healthcare' as RoutePath },
      { name: 'Education & EdTech', path: 'industries/education' as RoutePath },
      { name: 'Real Estate Segment', path: 'industries/real-estate' as RoutePath },
      { name: 'Manufacturing Sector', path: 'industries/manufacturing' as RoutePath },
      { name: 'Retail & E-commerce', path: 'industries/retail-ecommerce' as RoutePath },
      { name: 'Professional Services', path: 'industries/professional-services' as RoutePath },
    ],
    tools: [
      { name: 'Free Growth Tools', path: 'free-tools' as RoutePath },
      { name: 'Compare Solutions', path: 'compare' as RoutePath },
      { name: 'AI Readiness Diagnostic', path: 'ai-readiness-assessment' as RoutePath },
      { name: 'ROI Growth Calculator', path: 'roi-calculator' as RoutePath },
      { name: 'Our 6-Step Process', path: 'our-process' as RoutePath },
      { name: 'Blogs', path: 'blog' as RoutePath },
      { name: 'Resources Hub', path: 'resources' as RoutePath },
    ]
  };

  return (
    <footer className={`border-t transition-colors duration-300 ${
      darkMode ? 'bg-[#110B33] border-white/[0.06] text-white' : 'bg-gray-50 border-gray-100 text-[#110B33]'
    }`}>
      {/* Upper Trust Seal bar */}
      <div className={`border-b px-4 py-8 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono tracking-wide ${
        darkMode ? 'border-white/[0.05] text-gray-400' : 'border-gray-200 text-gray-600'
      }`}>
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <p className="font-bold uppercase text-[10px] text-[#47C7BF]">ISO 27001 & SOC2</p>
            <p className="text-[9px]">Enterprise Security Standard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Award className="h-5 w-5 text-accent" />
          <div>
            <p className="font-bold uppercase text-[10px] text-[#47C7BF]">HIPAA COMPLIANT</p>
            <p className="text-[9px]">Healthcare Safe AI Triage</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <div>
            <p className="font-bold uppercase text-[10px] text-emerald-400">99.98% UPTIME</p>
            <p className="text-[9px]">Redundant Server Clusters</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <div>
            <p className="font-bold uppercase text-[10px] text-primary">GDPR & PDPB READY</p>
            <p className="text-[9px]">Encrypted User Profiles</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Column 1: Brand details */}
          <div className="lg:col-span-2 space-y-5">
            <Logo size="lg" darkMode={darkMode} />
            <p className={`text-xs leading-relaxed max-w-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Natton Digital is a premier enterprise SaaS & service platform orchestrating next-gen AI CRM automations, n8n webhook nodes, and autonomous marketing engines for global SMBs and MSMEs.
            </p>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.instagram.com/nattondigital/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={`p-2.5 rounded-xl transition-all ${
                  darkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#47C7BF]' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-primary'
                }`}
                title="Instagram"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/nattondigital/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={`p-2.5 rounded-xl transition-all ${
                  darkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#47C7BF]' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-primary'
                }`}
                title="Facebook"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/showcase/nattondigital/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={`p-2.5 rounded-xl transition-all ${
                  darkMode ? 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#47C7BF]' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-primary'
                }`}
                title="LinkedIn"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>

          </div>

          {/* Columns 2-5: Navs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#47C7BF] mb-4">Products</h4>
            <ul className="space-y-2.5 text-xs">
              {navLinks.solutions.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => setPath(link.path)}
                    className={`hover:text-primary transition-colors text-left flex items-center gap-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {link.name} <ArrowUpRight className="h-2.5 w-2.5 opacity-0 hover:opacity-100" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#47C7BF] mb-4">Solutions</h4>
            <ul className="space-y-2.5 text-xs">
              {navLinks.products.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => setPath(link.path)}
                    className={`hover:text-primary transition-colors text-left ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#47C7BF] mb-4">Industries</h4>
            <ul className="space-y-2.5 text-xs">
              {navLinks.industries.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => setPath(link.path)}
                    className={`hover:text-primary transition-colors text-left ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#47C7BF] mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs mb-6">
              {navLinks.tools.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => setPath(link.path)}
                    className={`hover:text-primary transition-colors text-left ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>

          </div>
        </div>

        {/* Lower copyright bar */}
        <div className={`mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono ${
          darkMode ? 'border-white/[0.05] text-gray-500' : 'border-gray-200 text-gray-400'
        }`}>
          <div>
            © {new Date().getFullYear()} Natton Digital Platform. All rights reserved. Registered under Indian MSME & US Delaware Entity guidelines.
          </div>
          <div className="flex gap-6">
            <button onClick={() => setPath('privacy-policy')} className="hover:text-primary transition-colors">Privacy Policy</button>
            <button onClick={() => setPath('terms-of-platform')} className="hover:text-primary transition-colors">Terms of Platform</button>
            <a href="https://nattondigital.com/sitemap.xml" className="hover:text-primary transition-colors">Sitemap</a>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              LLMs.txt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

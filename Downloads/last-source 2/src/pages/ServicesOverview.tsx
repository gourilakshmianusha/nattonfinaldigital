import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { agencyServices, getServiceSlug } from '../data/services';
import { RoutePath } from '../types';
import ContactFormLink from '../components/ContactFormLink';

interface ServicesOverviewProps {
  setPath: (path: RoutePath) => void;
  darkMode: boolean;
}

export default function ServicesOverview({ setPath, darkMode }: ServicesOverviewProps) {
  const [activeFunnelStage, setActiveFunnelStage] = useState(0);

  const funnelStages = [
    { title: 'AEO & SEO Organic Pull', rate: '100% (Baseline)', details: 'Programmatic target pages query AEO search engines (Perplexity, ChatGPT, Gemini), dragging high-intent clicks for free.' },
    { title: 'Meta/Google High-Intent Ads', rate: '32% Conversion', details: 'Fires dynamic custom-scoped ad arrays mapping local Indian MSME and world SMB segments with webhook tags.' },
    { title: 'Webhook Landing Captures', rate: '74% Opt-In', details: 'Form entries instantly trigger n8n node responses, keeping leads fully locked and synced to GoHighLevel CRM.' },
    { title: 'AI Voice/Text Prequalification', rate: '45% Visit Rates', details: 'Autonomous dialers call back under 45 seconds, validating intent and booking final calendar meetings.' },
  ];

  const timelineSteps = [
    { phase: '01. Diagnostic Audit', desc: 'Diagnostic scan mapping existing SEO lag, CRM configuration gaps, and competitor campaign blueprints.' },
    { phase: '02. Architecture Setup', desc: 'Mapping webhooks, custom schemas, Calendly schedulers, and n8n node orchestration environments.' },
    { phase: '03. Campaign Launch', desc: 'Deploying optimized ads, landing pages, organic programmatics, and active AI call centers.' },
    { phase: '04. Constant Opt.', desc: 'AI reviews daily analytics, adjusting keywords and bid thresholds, scaling your revenue autonomous.' },
  ];

  return (
    <div className="py-12 animate-fade-in font-sans text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-xs font-mono text-gray-500">
          <button onClick={() => setPath('home')} className="hover:text-primary">Home</button> / <span aria-current="page" className="text-primary">Services</span>
        </div>

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <span className="text-[10px] font-mono tracking-widest text-[#00C2FF] uppercase block">Managed Marketing Solutions</span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-display leading-tight">
              Programmatic Lead Gen & <br />
              <span className="bg-gradient-to-r from-primary to-[#47C7BF] bg-clip-text text-transparent">AI Search Engine Domination</span>
            </h1>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Combine premium high-performance web development, modern AEO, Google Ads, and instant GoHighLevel webhooks to lock down consistent, pre-qualified sales calls for your enterprise.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setPath('ai-readiness-assessment')} className="px-5 py-3 rounded-lg bg-primary text-white text-xs font-semibold glow-primary">
                Analyze My Funnel →
              </button>
              <button onClick={() => setPath('contact')} className={`px-5 py-3 rounded-lg border text-xs font-semibold ${darkMode ? 'border-white/10 text-white' : 'border-gray-200 text-[#110B33]'}`}>
                Book Strategic Session
              </button>
            </div>
          </div>

          {/* SVG Glowing Interactive Funnel */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-dark/40 border-white/10' : 'bg-white border-gray-100 shadow-xl'}`}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Dynamic Conversions Funnel</h3>
            <p className={`text-[10px] mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click different stages to inspect conversion mechanics:</p>

            <div className="space-y-2.5">
              {funnelStages.map((stage, idx) => {
                const colors = ['bg-primary', 'bg-[#00C2FF]', 'bg-accent', 'bg-emerald-500'];
                const widths = ['w-full', 'w-[80%]', 'w-[64%]', 'w-[45%]'];
                const isSelected = activeFunnelStage === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => setActiveFunnelStage(idx)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#00C2FF] bg-white/[0.02] shadow-md'
                        : (darkMode ? 'border-white/[0.05] hover:border-white/20' : 'border-gray-200 hover:border-gray-300')
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{stage.title}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">{stage.rate}</span>
                    </div>
                    {/* Visual Funnel bar representation */}
                    <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden w-full">
                      <div className={`h-full ${colors[idx]} ${widths[idx]} transition-all`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* active details panel */}
            <div className={`mt-4 p-3 rounded-lg text-[11px] leading-relaxed ${darkMode ? 'bg-black/30' : 'bg-gray-50'}`}>
              <strong className="text-[#00C2FF]">Stage Details:</strong> {funnelStages[activeFunnelStage].details}
            </div>
          </div>
        </div>

        {/* Services List */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold font-display">Core Agency Growth Services</h2>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Built with raw speed, conversion psychology, and enterprise grade compliance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agencyServices.map(service => (
              <a
                key={service.id}
                href={`/services/${getServiceSlug(service)}`}
                onClick={event => {
                  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                  event.preventDefault();
                  setPath(`services/${getServiceSlug(service)}`);
                }}
                className={`group flex h-full flex-col rounded-xl border p-5 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${darkMode ? 'bg-white/[0.01] border-white/10' : 'bg-white border-gray-100 shadow-xs'}`}
              >
                <h3 className="mb-1.5 text-xs font-bold uppercase text-primary">{service.name}</h3>
                <p className={`flex-1 text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{service.short}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  View service details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Horizontally animated timeline infographic */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold font-display mb-8 text-center">Your Growth Roadmap Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* dash line for desktop timeline connect */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 border-t border-dashed border-primary/20 z-0" />

            {timelineSteps.map((step, idx) => (
              <div key={idx} className={`p-5 rounded-xl border relative z-10 ${darkMode ? 'bg-dark/80 border-white/10' : 'bg-white border-gray-200'}`}>
                <span className="text-xs font-bold text-primary font-mono">{step.phase}</span>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          <ContactFormLink setPath={setPath} darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

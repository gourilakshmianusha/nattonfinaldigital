import React from 'react';
import { trustInfo, faqsList } from '../data/mockData';
import { ShieldCheck, Scale, Lock, RefreshCw, FileText, ChevronDown } from 'lucide-react';

interface LegalViewProps {
  pageType: 'privacy-policy' | 'terms-conditions' | 'cookie-policy' | 'refund-policy' | 'faq';
  setActiveTab: (tab: string) => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ pageType, setActiveTab }) => {
  if (pageType === 'faq') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs font-bold">
            Self-Service Knowledge Desk
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Answers regarding 80G tax exemptions, CSR partnerships, donations, and field operations.
          </p>
        </div>

        <div className="space-y-4">
          {faqsList.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-emerald-800 dark:text-emerald-400">
                <span>{faq.category}</span>
                <span className="text-[10px] font-mono text-slate-400">Q#{idx + 1}</span>
              </div>
              <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-white">{faq.question}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const titleMap = {
    'privacy-policy': 'Privacy Policy',
    'terms-conditions': 'Terms & Conditions',
    'cookie-policy': 'Cookie Policy',
    'refund-policy': 'Refund & Cancellation Policy'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="bg-slate-900 text-white p-8 rounded-3xl border border-emerald-900 shadow-2xl text-center space-y-2">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{trustInfo.name}</span>
        <h1 className="text-3xl font-extrabold font-serif">{titleMap[pageType]}</h1>
        <p className="text-xs text-slate-300">Last Updated: August 2026 • Compliant with Indian Trust Acts & Global Privacy Norms</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl prose dark:prose-invert text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-6">
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">1. Introduction & Organizational Commitment</h3>
          <p>
            {trustInfo.name} (NGO Darpan: {trustInfo.ngoDarpanId}, MCA CSR-1: {trustInfo.csrRegNo}) is committed to absolute transparency, security, and ethical governance. This policy governs your interaction with our official web portal, digital donation gateway, and CSR partner tools.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">2. Donation & 80G Tax Exemption Policy</h3>
          <p>
            All monetary contributions made to {trustInfo.name} qualify for 50% deduction under Section 80G of the Income Tax Act 1961. Digital receipts containing the URN ({trustInfo.tax80gUrn}) are generated instantly.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">3. Refund & Duplicate Transaction Handling</h3>
          <p>
            In circumstances involving technical payment gateway errors or duplicate transactions, refund requests submitted to {trustInfo.email} within 7 business days will be reviewed and credited back to the original bank account within 5-7 working days.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-serif">4. Data Security & Third-Party Analytics</h3>
          <p>
            We enforce strict 256-bit SSL encryption for all data transactions. Personal information provided for 80G receipts is strictly protected and never sold or shared with external commercial entities.
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
          <p className="font-bold text-slate-900 dark:text-white">Contact Compliance Officer:</p>
          <p>{trustInfo.address}</p>
          <p>Email: {trustInfo.email} | Phone: {trustInfo.phone}</p>
        </section>
      </div>
    </div>
  );
};

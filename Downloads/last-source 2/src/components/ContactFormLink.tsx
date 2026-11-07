import React from 'react';
import { ArrowRight } from 'lucide-react';
import { RoutePath } from '../types';

interface ContactFormLinkProps {
  setPath: (path: RoutePath) => void;
  darkMode?: boolean;
}

export default function ContactFormLink({ setPath, darkMode = false }: ContactFormLinkProps) {
  return (
    <div className={`rounded-2xl border p-6 sm:p-8 ${
      darkMode ? 'border-white/10 bg-white/[0.03]' : 'border-gray-100 bg-white shadow-xl'
    }`}>
      <span className="mb-3 block text-[10px] font-mono uppercase tracking-widest text-primary">
        One contact form
      </span>
      <h3 className="text-lg font-bold font-display">Tell us what your business needs</h3>
      <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Choose your services, solutions, and industry in our central contact form.
      </p>
      <button
        type="button"
        onClick={() => setPath('contact')}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-opacity-90"
      >
        Book a Free Strategy Consultation <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
      </button>
    </div>
  );
}

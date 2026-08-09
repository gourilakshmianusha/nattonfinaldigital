import React, { useState } from 'react';
import { focusAreas } from '../data/mockData';
import {
  Sprout,
  Users,
  Laptop,
  HeartPulse,
  Trees,
  Store,
  CheckCircle2,
  Download,
  Handshake,
  Heart,
  ChevronRight
} from 'lucide-react';

interface ProgramsViewProps {
  setActiveTab: (tab: string) => void;
  onOpenCsrModal: () => void;
}

export const ProgramsView: React.FC<ProgramsViewProps> = ({ setActiveTab, onOpenCsrModal }) => {
  const [selectedProgram, setSelectedProgram] = useState(focusAreas[0]);

  return (
    <div className="space-y-16 py-8">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl max-w-7xl mx-auto shadow-2xl">
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            Integrated Rural Development Model
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            Programs & Focus Areas
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Holistic interventions across agriculture, female self-reliance, rural AI skills, healthcare, and climate resilience aligned with UN Sustainable Development Goals.
          </p>
        </div>
      </section>

      {/* Interactive Program Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          {focusAreas.map((prog) => {
            const isSelected = selectedProgram.id === prog.id;
            return (
              <button
                key={prog.id}
                onClick={() => setSelectedProgram(prog)}
                className={`px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-emerald-900 text-white shadow-lg border border-emerald-700'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {prog.id === 'agri' && <Sprout className="w-4 h-4 text-amber-400" />}
                {prog.id === 'women' && <Users className="w-4 h-4 text-amber-400" />}
                {prog.id === 'education' && <Laptop className="w-4 h-4 text-amber-400" />}
                {prog.id === 'health' && <HeartPulse className="w-4 h-4 text-amber-400" />}
                {prog.id === 'climate' && <Trees className="w-4 h-4 text-amber-400" />}
                {prog.id === 'livelihood' && <Store className="w-4 h-4 text-amber-400" />}
                <span>{prog.title.split('&')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Program Showcase Card */}
        <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300">
              Target Beneficiaries: {selectedProgram.beneficiariesCount}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 dark:text-white">
              {selectedProgram.title}
            </h2>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedProgram.longDescription || selectedProgram.description}
            </p>

            {/* Key Field Activities Checklist */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Core Interventions & Field Activities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedProgram.activities.map((act, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {selectedProgram.metrics.map((m, idx) => (
                <div key={idx} className="bg-emerald-50 dark:bg-slate-800 p-3 rounded-xl text-center border border-emerald-100 dark:border-slate-700">
                  <span className="text-lg font-extrabold text-emerald-800 dark:text-emerald-400 block">{m.value}</span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{m.label}</span>
                </div>
              ))}
            </div>

            {/* SDG Alignment Badges */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Aligned UN Sustainable Development Goals
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProgram.sdgs.map((sdg, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                  >
                    🎯 {sdg}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={onOpenCsrModal}
                className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <Handshake className="w-4 h-4 text-amber-400" />
                <span>Sponsor This Program (CSR)</span>
              </button>

              <button
                onClick={() => { setActiveTab('donate'); window.scrollTo({ top: 0 }); }}
                className="px-5 py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 flex items-center gap-2"
              >
                <Heart className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Individual Donation (80G)</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 relative">
              <img
                src={selectedProgram.bannerImage}
                alt={selectedProgram.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <span className="font-bold text-amber-300 block mb-0.5">Field Operation</span>
                <span>Active project implementation across Dharwad, Belagavi & Bagalkot districts.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All 6 Focus Areas Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-6">
          All Core Focus Areas Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {focusAreas.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedProgram(p)}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow hover:border-emerald-500 cursor-pointer transition-all space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif">{p.title}</h4>
                <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-800 px-2.5 py-1 rounded-md shrink-0">
                  {p.beneficiariesCount}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{p.description}</p>
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1 pt-2">
                <span>View Interventions</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

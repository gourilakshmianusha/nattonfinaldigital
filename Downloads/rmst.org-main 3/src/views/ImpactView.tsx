import React, { useState } from 'react';
import { transformationStories } from '../data/mockData';
import { BeforeAfterSlider } from '../components/BeforeAfterSlider';
import { Heart, Wheat, GraduationCap, Briefcase, MapPin, Quote, Download, Handshake, ChevronRight } from 'lucide-react';

interface ImpactViewProps {
  setActiveTab: (tab: string) => void;
  onOpenCsrModal: () => void;
}

export const ImpactView: React.FC<ImpactViewProps> = ({ setActiveTab, onOpenCsrModal }) => {
  const [selectedStory, setSelectedStory] = useState(transformationStories[0]);

  return (
    <div className="space-y-16 py-8">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl max-w-7xl mx-auto shadow-2xl">
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            Real Transformations • Authentic Field Stories
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
            Impact Stories & Success Journeys
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every life transformed creates a ripple of self-reliance across Karnataka's rural communities. Explore verified beneficiary stories and quantitative outcomes.
          </p>
        </div>
      </section>

      {/* Featured Story Before/After Interactive Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest block mb-2">
            Interactive Comparison
          </span>
          <h2 className="text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
            Visualizing Before & After Transformations
          </h2>
        </div>

        {/* Story Selector Tabs */}
        <div className="flex justify-center gap-3 mb-8 overflow-x-auto pb-2">
          {transformationStories.map((story) => (
            <button
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedStory.id === story.id
                  ? 'bg-emerald-900 text-white shadow-lg border border-emerald-700'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              {story.beneficiaryName} ({story.category})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div>
            <BeforeAfterSlider
              title={selectedStory.title}
              beforeImage={selectedStory.beforeImage}
              afterImage={selectedStory.afterImage}
              beforeLabel="Before Raita Mitra Support"
              afterLabel="Transformed Self-Reliant Outcome"
            />
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
              {selectedStory.category} • {selectedStory.village}, {selectedStory.district}
            </div>

            <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-white leading-snug">
              {selectedStory.title}
            </h3>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 bg-red-50 dark:bg-slate-800/80 rounded-xl border border-red-100 dark:border-slate-700">
                <span className="font-bold text-red-800 dark:text-red-400 block mb-1">Challenge Before:</span>
                {selectedStory.beforeText}
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-slate-800/80 rounded-xl border border-emerald-100 dark:border-slate-700">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 block mb-1">Grassroots Intervention:</span>
                {selectedStory.afterText}
              </div>
            </div>

            <blockquote className="italic text-xs text-slate-700 dark:text-slate-300 border-l-4 border-emerald-600 pl-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-r-xl">
              <Quote className="w-4 h-4 text-emerald-600 inline mr-1" />
              "{selectedStory.quote}"
            </blockquote>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {selectedStory.metrics.map((m, idx) => (
                <div key={idx} className="bg-emerald-950 text-white p-3 rounded-xl text-center">
                  <span className="text-lg font-extrabold text-amber-400 block">{m.value}</span>
                  <span className="text-[10px] text-slate-300 font-medium">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Download Annual Impact Report Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-emerald-900 shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
              Audited Transparency
            </span>
            <h3 className="text-2xl font-bold font-serif">Download Annual Impact Report FY 2024-25</h3>
            <p className="text-xs text-slate-300">
              Detailed breakdown of beneficiary numbers, independent auditor reports, district maps, and verified project outcomes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert("Annual Impact Report PDF download started."); }}
              className="px-5 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Report PDF (5.2 MB)
            </a>
            <button
              onClick={onOpenCsrModal}
              className="px-5 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
            >
              <Handshake className="w-4 h-4" /> Partner With Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

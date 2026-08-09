import React from 'react';
import { trustInfo } from '../data/mockData';
import { Newspaper, Download, Mail, Phone, Building2, ExternalLink } from 'lucide-react';

export const MediaView: React.FC = () => {
  return (
    <div className="space-y-16 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white py-16 px-6 rounded-3xl text-center space-y-4 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
          <Newspaper className="w-3.5 h-3.5 text-amber-300" /> Newsroom & Official Press Kit
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
          Media & Press Centre
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto">
          Official press releases, downloadable media kit, brand guidelines, and journalist contacts for Raita Mitra Social Trust (R).
        </p>
      </section>

      {/* Brand Assets Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white font-serif">Official Logo Pack (SVG & PNG)</h3>
          <p className="text-xs text-slate-500">High-resolution vector emblem, full horizontal logo, and dark background variants.</p>
          <button onClick={() => alert("Downloading Logo Pack")} className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download Logos (2.1 MB)
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white font-serif">Organization Profile & Brand Kit</h3>
          <p className="text-xs text-slate-500">Official mission statements, leadership biographies, and color palettes.</p>
          <button onClick={() => alert("Downloading Brand Kit")} className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download Media Kit (3.5 MB)
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white font-serif">High-Res Field Photograph Pack</h3>
          <p className="text-xs text-slate-500">Curated high-resolution photos of Karnataka farmers, soil testing, and SHGs.</p>
          <button onClick={() => alert("Downloading Photo Pack")} className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> Download Photos (14.2 MB)
          </button>
        </div>
      </div>
    </div>
  );
};

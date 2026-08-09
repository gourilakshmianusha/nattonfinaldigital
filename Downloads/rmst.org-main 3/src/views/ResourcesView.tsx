import React, { useState } from 'react';
import { resourcesList } from '../data/mockData';
import { BookOpen, Download, FileText, Search, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'CSR Brochure', 'Toolkit', 'Annual Report', 'Case Study'];

  const filteredResources = resourcesList.filter(res => {
    const matchesCategory = filterCategory === 'All' || res.category === filterCategory;
    const matchesQuery = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         res.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-16 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white py-16 px-6 sm:px-12 rounded-3xl shadow-2xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <BookOpen className="w-3.5 h-3.5" /> Central Knowledge & Report Repository
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-serif">
          Resource Centre & Digital Library
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto">
          Explore annual impact reports, farmer soil toolkits, audited balance sheets, CSR brochures, and research case studies.
        </p>
      </section>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filterCategory === cat
                  ? 'bg-emerald-900 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 sm:grid-cols-12 gap-4"
          >
            <div className="sm:col-span-5 h-48 sm:h-auto overflow-hidden relative">
              <img src={res.coverImage} alt={res.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-emerald-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                {res.category}
              </span>
            </div>

            <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[10px] font-mono text-slate-400 font-bold mb-1">
                  {res.format} • {res.size} • {res.downloadCount} Downloads
                </div>
                <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white leading-snug">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <button
                onClick={() => alert(`Downloading ${res.title}`)}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Download {res.format} Document</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

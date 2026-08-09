import React, { useState } from 'react';
import { focusAreas, transformationStories, csrDocuments, blogPosts, upcomingEvents, resourcesList } from '../data/mockData';
import { Search, X, ArrowRight, FileText, Calendar, Sprout, Heart, BookOpen, Layers } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredPrograms = focusAreas.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDocs = csrDocuments.filter(d =>
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    d.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredStories = transformationStories.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.beneficiaryName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEvents = upcomingEvents.filter(e =>
    e.title.toLowerCase().includes(query.toLowerCase()) ||
    e.venue.toLowerCase().includes(query.toLowerCase())
  );

  const filteredBlogs = blogPosts.filter(b =>
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.category.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults =
    filteredPrograms.length +
    filteredDocs.length +
    filteredStories.length +
    filteredEvents.length +
    filteredBlogs.length;

  const handleItemClick = (tab: string) => {
    onSelectTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[80vh] flex flex-col border border-emerald-100 dark:border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search programs, 80G documents, impact stories, events, blogs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
            Esc
          </button>
        </div>

        {/* Quick Tag Suggestions */}
        {!query && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {["80G Tax Receipt", "NGO Darpan", "Soil Testing", "Women SHGs", "AI Skills", "CSR-1 Registration", "Volunteering"].map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(tag)}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-800"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results List */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1">
          {query && totalResults === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No exact matches found for "{query}".</p>
              <p className="text-xs mt-1">Try searching for "agri", "80G", "csr", "women", or "hubballi".</p>
            </div>
          ) : (
            <>
              {/* Programs */}
              {filteredPrograms.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2 flex items-center gap-1">
                    <Sprout className="w-3.5 h-3.5" /> Programs & Focus Areas
                  </h4>
                  <div className="space-y-1.5">
                    {filteredPrograms.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleItemClick('programs')}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{p.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{p.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CSR Documents */}
              {filteredDocs.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> CSR & Governance Documents
                  </h4>
                  <div className="space-y-1.5">
                    {filteredDocs.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => handleItemClick('csr-compliance')}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl hover:bg-amber-50 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{d.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{d.category} • {d.year}</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                          {d.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transformation Stories */}
              {filteredStories.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" /> Impact & Transformation Stories
                  </h4>
                  <div className="space-y-1.5">
                    {filteredStories.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleItemClick('impact')}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{s.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{s.beneficiaryName} ({s.village}, {s.district})</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events & Articles */}
              {filteredEvents.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Upcoming Events
                  </h4>
                  <div className="space-y-1.5">
                    {filteredEvents.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => handleItemClick('events')}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl hover:bg-purple-50 dark:hover:bg-slate-800 cursor-pointer flex justify-between items-center transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{e.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">{e.date} • {e.venue}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-purple-600 shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

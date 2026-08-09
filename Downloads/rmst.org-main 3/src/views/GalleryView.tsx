import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { fetchGallery, deleteGalleryItem } from '../lib/supabase';
import {
  Image as ImageIcon,
  MapPin,
  Calendar,
  Filter,
  Search,
  X,
  Share2,
  Download,
  Sparkles,
  User,
  Plus,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface GalleryViewProps {
  setActiveTab?: (tab: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ setActiveTab }) => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = [
    'All',
    'Agriculture',
    'Women Empowerment',
    'AI & Youth Skills',
    'Tree Plantation',
    'Healthcare & Sanitation',
    'CSR Events'
  ];

  const loadData = async () => {
    setLoading(true);
    const data = await fetchGallery();
    setGallery(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = (e: any) => {
      if (e.detail) setGallery(e.detail);
    };

    window.addEventListener('raita_gallery_updated', handleUpdate);
    return () => window.removeEventListener('raita_gallery_updated', handleUpdate);
  }, []);

  const filteredGallery = gallery.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white py-14 px-6 sm:px-12 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-emerald-900/60">
        <div className="space-y-3 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <ImageIcon className="w-3.5 h-3.5 text-amber-300" /> Grassroots Field Evidence & Media
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif leading-tight">
            Field Impact Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            High-resolution photographic documentation of Raita Mitra's soil health workshops, women self-help group enterprises, rural computer labs, and tree plantation drives across 12+ districts of Karnataka.
          </p>
        </div>

        {setActiveTab && (
          <div className="z-10 shrink-0">
            <button
              onClick={() => setActiveTab('admin-dashboard')}
              className="px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Photos (Admin)</span>
            </button>
          </div>
        )}
      </section>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by location, keyword (e.g., Dharwad, Soil, SHG)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex overflow-x-auto gap-1.5 pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Photo Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold">Loading Field Gallery Records...</p>
        </div>
      ) : filteredGallery.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
          <ImageIcon className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-slate-200">
            No gallery images found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try resetting your search query or filter category. Admins can upload new photos directly from the Admin Panel.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-emerald-900 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden relative bg-slate-950">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  <span className="absolute top-3 left-3 bg-emerald-900/90 backdrop-blur-md text-amber-300 border border-emerald-700/50 text-[10px] font-bold px-2.5 py-1 rounded-lg shadow">
                    {item.category}
                  </span>

                  <span className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded-lg shadow flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {item.district}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.date}</span>
                    {item.photographer && (
                      <>
                        <span>•</span>
                        <span>📷 {item.photographer}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-sm font-bold font-serif text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-400">
                <span>View Full Photo</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-700 text-amber-300 text-[10px] font-bold rounded-md">
                  {activePhoto.category}
                </span>
                <span className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {activePhoto.district} District
                </span>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image */}
            <div className="flex-1 overflow-hidden bg-black flex items-center justify-center max-h-[55vh]">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Footer Details */}
            <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-serif text-white">
                  {activePhoto.title}
                </h2>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {activePhoto.date}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {activePhoto.caption}
              </p>

              {activePhoto.photographer && (
                <div className="text-[11px] text-slate-400 italic">
                  Photo Credit: {activePhoto.photographer}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

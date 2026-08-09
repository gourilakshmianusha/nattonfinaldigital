import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { fetchBlogs } from '../lib/supabase';
import {
  BookOpen,
  Clock,
  Tag,
  User,
  ArrowLeft,
  ChevronRight,
  Search,
  X,
  Plus,
  Sparkles,
  Share2
} from 'lucide-react';

interface BlogViewProps {
  setActiveTab?: (tab: string) => void;
}

export const BlogView: React.FC<BlogViewProps> = ({ setActiveTab }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Sustainable Agriculture',
    'AI & Skill Development',
    'CSR & Compliance',
    'Women Empowerment',
    'Climate Action'
  ];

  const loadBlogs = async () => {
    setLoading(true);
    const data = await fetchBlogs();
    setBlogs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadBlogs();

    const handleUpdate = (e: any) => {
      if (e.detail) setBlogs(e.detail);
    };

    window.addEventListener('raita_blogs_updated', handleUpdate);
    return () => window.removeEventListener('raita_blogs_updated', handleUpdate);
  }, []);

  const filteredBlogs = blogs.filter((post) => {
    const matchesCategory =
      selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  if (activeArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
        <button
          onClick={() => setActiveArticle(null)}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Articles
        </button>

        <div className="space-y-4">
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-lg border border-emerald-300 dark:border-emerald-800">
            {activeArticle.category}
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-900 dark:text-white leading-tight">
            {activeArticle.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
              <User className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              {activeArticle.author.name} ({activeArticle.author.role})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              {activeArticle.date}
            </span>
            <span>•</span>
            <span>{activeArticle.readTime}</span>
          </div>
        </div>

        <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-slate-950">
          <img
            src={activeArticle.image}
            alt={activeArticle.title}
            className="w-full h-full object-cover"
          />
        </div>

        {activeArticle.keyTakeaways && activeArticle.keyTakeaways.length > 0 && (
          <div className="p-6 bg-emerald-50 dark:bg-slate-800/90 rounded-2xl border border-emerald-200 dark:border-slate-700 space-y-2 shadow-sm">
            <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 font-serif flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Key Insights & Executive Takeaways
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-disc list-inside leading-relaxed">
              {activeArticle.keyTakeaways.map((kt, i) => (
                <li key={i}>{kt}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="prose dark:prose-invert text-sm text-slate-800 dark:text-slate-200 leading-relaxed space-y-4 whitespace-pre-wrap">
          {activeArticle.content}
        </div>

        {activeArticle.tags && activeArticle.tags.length > 0 && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 items-center">
            <Tag className="w-4 h-4 text-slate-400" />
            {activeArticle.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white py-14 px-6 sm:px-12 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-emerald-900/60">
        <div className="space-y-3 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" /> Thought Leadership & Knowledge Publishing
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif leading-tight">
            News, Insights & Articles
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Explore research papers, soil health reports, CSR compliance updates, and grassroot stories published by Raita Mitra Social Trust (R).
          </p>
        </div>

        {setActiveTab && (
          <div className="z-10 shrink-0">
            <button
              onClick={() => setActiveTab('admin-dashboard')}
              className="px-4 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Article (Admin)</span>
            </button>
          </div>
        )}
      </section>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title, tag, or topic..."
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

      {/* Blog Cards */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold">Loading Articles from Database...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-lg font-bold font-serif text-slate-800 dark:text-slate-200">
            No articles found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria or reset category filters. Admins can add new blogs in the Admin Panel.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-emerald-900 text-white text-xs font-bold rounded-xl"
          >
            Reset Search Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((post) => (
            <div
              key={post.id}
              onClick={() => setActiveArticle(post)}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-52 overflow-hidden relative bg-slate-950">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow border border-emerald-700/50">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                    <span>{post.date} • {post.readTime}</span>
                    <span className="text-slate-500">{post.author.name}</span>
                  </div>

                  <h3 className="text-base font-bold font-serif text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs font-bold text-emerald-800 dark:text-emerald-400">
                <span>Read Full Article</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

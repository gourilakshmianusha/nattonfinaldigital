import React, { useState, useEffect } from 'react';
import { trustInfo, impactMetrics, focusAreas, csrDocuments } from '../data/mockData';
import { BlogPost, GalleryItem } from '../types';
import {
  fetchBlogs,
  saveBlog,
  deleteBlog,
  fetchGallery,
  saveGalleryItem,
  deleteGalleryItem,
  checkIsSupabaseConfigured,
  setSupabaseCredentials,
  clearSupabaseCredentials,
  syncAllToSupabase,
  supabaseUrl,
  supabaseAnonKey
} from '../lib/supabase';
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckCircle2,
  DollarSign,
  Bot,
  ShieldCheck,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Plus,
  ArrowRight,
  Trash2,
  Image as ImageIcon,
  BookOpen,
  X,
  ExternalLink,
  Database,
  Check,
  Copy,
  Terminal,
  Code2,
  MapPin,
  RefreshCw,
  Upload,
  User,
  Tag,
  Lock,
  Key,
  Eye,
  EyeOff,
  LogOut,
  Smartphone,
  Building2,
  ShieldAlert,
  LogIn
} from 'lucide-react';

interface AdminDashboardViewProps {
  setActiveTab?: (tab: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ setActiveTab: setMainActiveTab }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cms' | 'crm' | 'ai-studio' | 'audit'>('cms');
  const [cmsSubTab, setCmsSubTab] = useState<'blogs' | 'gallery' | 'programs' | 'documents'>('blogs');

  // Supabase / Data State
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals for adding
  const [showAddBlogModal, setShowAddBlogModal] = useState<boolean>(false);
  const [showAddGalleryModal, setShowAddGalleryModal] = useState<boolean>(false);

  // New Blog Form State
  const [newBlog, setNewBlog] = useState({
    title: '',
    category: 'Sustainable Agriculture',
    excerpt: '',
    content: '',
    authorName: 'Dr. Ramesh Patil',
    authorRole: 'Managing Trustee',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
    tags: 'Agriculture, Soil Health, Karnataka',
    keyTakeaways: 'Soil testing reduces chemical overuse by 35%.\nBio-fertilizer improves yield quality.\nFPO links ensure fair market value.'
  });

  // New Gallery Form State
  const [newGallery, setNewGallery] = useState({
    title: '',
    category: 'Agriculture' as GalleryItem['category'],
    image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1200',
    district: 'Dharwad',
    date: 'August 2026',
    caption: '',
    photographer: 'Raita Mitra Communications'
  });

  // AI Studio State
  const [aiGeneratorPrompt, setAiGeneratorPrompt] = useState('');
  const [aiGeneratedText, setAiGeneratedText] = useState<string | null>(null);

  // Sample preset field images
  const samplePresets = [
    { name: 'Agriculture', url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1200' },
    { name: 'Women SHG', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200' },
    { name: 'AI & Youth Lab', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200' },
    { name: 'Tree Plantation', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200' },
    { name: 'Healthcare', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200' },
    { name: 'CSR Event', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200' }
  ];

  // Image Compression Helper to prevent LocalStorage Quota Exceeded
  const compressAndResizeImage = (file: File, maxWidth = 1000, quality = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve((event.target?.result as string) || '');
          }
        };
        img.onerror = () => {
          resolve((event.target?.result as string) || '');
        };
        img.src = (event.target?.result as string) || '';
      };
      reader.readAsDataURL(file);
    });
  };

  // Image Upload Handlers
  const handleBlogImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        alert('File size exceeds 12MB. Please choose a smaller image file.');
        return;
      }
      try {
        const compressedBase64 = await compressAndResizeImage(file, 1000, 0.75);
        setNewBlog((prev) => ({ ...prev, image: compressedBase64 }));
      } catch (err) {
        console.error('Image upload compression error:', err);
      }
    }
  };

  const handleGalleryImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        alert('File size exceeds 12MB. Please choose a smaller image file.');
        return;
      }
      try {
        const compressedBase64 = await compressAndResizeImage(file, 1000, 0.75);
        setNewGallery((prev) => ({ ...prev, image: compressedBase64 }));
      } catch (err) {
        console.error('Image upload compression error:', err);
      }
    }
  };

  // Load Blogs & Gallery
  const loadCmsData = async () => {
    setLoading(true);
    const [blogsData, galleryData] = await Promise.all([fetchBlogs(), fetchGallery()]);
    setBlogs(blogsData);
    setGallery(galleryData);
    setLoading(false);
  };

  useEffect(() => {
    loadCmsData();
  }, []);

  // Handlers for Blog
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content) return;

    const slug = newBlog.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const blogPost: BlogPost = {
      id: 'blog-' + Date.now(),
      title: newBlog.title,
      slug: slug || 'blog-' + Date.now(),
      category: newBlog.category,
      excerpt: newBlog.excerpt || newBlog.content.slice(0, 140) + '...',
      content: newBlog.content,
      author: {
        name: newBlog.authorName,
        role: newBlog.authorRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
      },
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readTime: newBlog.readTime || '5 min read',
      image: newBlog.image,
      tags: newBlog.tags.split(',').map((t) => t.trim()).filter(Boolean),
      keyTakeaways: newBlog.keyTakeaways.split('\n').filter((line) => line.trim().length > 0)
    };

    const updated = await saveBlog(blogPost);
    setBlogs(updated);
    setShowAddBlogModal(false);
    // Reset form
    setNewBlog({
      title: '',
      category: 'Sustainable Agriculture',
      excerpt: '',
      content: '',
      authorName: 'Dr. Ramesh Patil',
      authorRole: 'Managing Trustee',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
      tags: 'Agriculture, Soil Health, Karnataka',
      keyTakeaways: ''
    });
  };

  const handleDeleteBlog = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      const updated = await deleteBlog(id);
      setBlogs(updated);
    }
  };

  // Handlers for Gallery
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.title || !newGallery.image) return;

    const item: GalleryItem = {
      id: 'gal-' + Date.now(),
      title: newGallery.title,
      category: newGallery.category,
      image: newGallery.image,
      district: newGallery.district,
      date: newGallery.date,
      caption: newGallery.caption || newGallery.title,
      photographer: newGallery.photographer
    };

    const updated = await saveGalleryItem(item);
    setGallery(updated);
    setShowAddGalleryModal(false);
    // Reset form
    setNewGallery({
      title: '',
      category: 'Agriculture',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1200',
      district: 'Dharwad',
      date: 'August 2026',
      caption: '',
      photographer: 'Raita Mitra Communications'
    });
  };

  const handleDeleteGallery = async (id: string) => {
    if (confirm('Are you sure you want to delete this photo from the gallery?')) {
      const updated = await deleteGalleryItem(id);
      setGallery(updated);
    }
  };

  // SQL Setup Modal & Supabase Credentials State
  const [showSqlSetupModal, setShowSqlSetupModal] = useState<boolean>(false);
  const [sqlCopied, setSqlCopied] = useState<boolean>(false);
  const [mobileLinkCopied, setMobileLinkCopied] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>(supabaseUrl || 'https://ojqxwlqyjybfzwqnknw.supabase.co');
  const [customKeyInput, setCustomKeyInput] = useState<string>(supabaseAnonKey || '');
  const [syncStatus, setSyncStatus] = useState<{ loading: boolean; message?: string; isError?: boolean }>({ loading: false });

  const isSupabaseConfigured = checkIsSupabaseConfigured();

  const handleCopyMobileLink = () => {
    if (!customKeyInput.trim()) {
      alert('Please enter and save your Supabase Anon Key first.');
      return;
    }
    const mobileLink = `${window.location.origin}/?sb_url=${encodeURIComponent(customUrlInput.trim())}&sb_key=${encodeURIComponent(customKeyInput.trim())}`;
    navigator.clipboard.writeText(mobileLink);
    setMobileLinkCopied(true);
    setTimeout(() => setMobileLinkCopied(false), 3000);
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim() || !customKeyInput.trim()) {
      alert('Please enter both Supabase Project URL and Anon Key.');
      return;
    }
    setSupabaseCredentials(customUrlInput, customKeyInput);
  };

  const handleSyncDatabase = async () => {
    setSyncStatus({ loading: true, message: 'Syncing all records to Supabase...' });
    const res = await syncAllToSupabase(customUrlInput, customKeyInput);
    if (res.error) {
      setSyncStatus({
        loading: false,
        message: `Sync warning: ${res.error}`,
        isError: true
      });
    } else {
      setSyncStatus({
        loading: false,
        message: `Successfully synced ${res.blogsCount} blogs and ${res.galleryCount} gallery items to Supabase! All devices can now access live data.`,
        isError: false
      });
      // Refresh local CMS list
      loadCmsData();
    }
  };

  const supabaseSqlCode = `-- ============================================================
-- RAITA MITRA SOCIAL TRUST - SUPABASE DATABASE SCHEMA SETUP
-- Paste & Run in Supabase SQL Editor (SQL Editor -> New Query -> Run)
-- ============================================================

-- 1. Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author JSONB,
  date TEXT,
  read_time TEXT,
  image TEXT,
  tags TEXT[],
  key_takeaways TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  district TEXT,
  date TEXT,
  caption TEXT,
  photographer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies for Public Read/Write
CREATE POLICY "Allow public read access on blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on blogs" ON public.blogs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on blogs" ON public.blogs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on blogs" ON public.blogs FOR DELETE USING (true);

CREATE POLICY "Allow public read access on gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on gallery" ON public.gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on gallery" ON public.gallery FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on gallery" ON public.gallery FOR DELETE USING (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(supabaseSqlCode);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
  };

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('raita_admin_authenticated') === 'true';
  });
  const [emailInput, setEmailInput] = useState<string>('admin@raitamitra.org');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!emailInput.trim()) {
      setLoginError('Please enter your trustee email address.');
      return;
    }

    if (!passwordInput) {
      setLoginError('Please enter your admin access key / password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Validate credentials
      if (
        (emailInput.trim().toLowerCase() === 'admin@raitamitra.org' && (passwordInput === 'admin123' || passwordInput === 'admin' || passwordInput.length >= 4)) ||
        passwordInput === 'admin123' || passwordInput === 'admin'
      ) {
        localStorage.setItem('raita_admin_authenticated', 'true');
        setIsAuthenticated(true);
        setIsSubmitting(false);
      } else {
        setLoginError('Invalid trustee credentials or access PIN. Try using the quick demo login button below.');
        setIsSubmitting(false);
      }
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setEmailInput('admin@raitamitra.org');
    setPasswordInput('admin123');
    localStorage.setItem('raita_admin_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('raita_admin_authenticated');
    setIsAuthenticated(false);
  };

  // AI Proposal Generator
  const handleAiGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiGeneratorPrompt) return;
    setAiGeneratedText(
      `[AI Studio Generated Proposal Draft]:\n\nPROJECT PROPOSAL: Sustainable Soil Health & Micro-Irrigation Expansion for Dharwad District\n\nEXECUTIVE SUMMARY:\nRaita Mitra Social Trust proposes a 12-month intervention targeting 1,000 smallholder farmers in Navalgund & Kundgol blocks. Interventions include soil acidity testing, bio-fertilizer supply, and drip irrigation installation.\n\nESTIMATED BUDGET: ₹18,50,000\nEXPECTED YIELD GAIN: +30% avg crop income.\nALIGNMENT: MCA CSR-1 Reg CSR00059487 | Section 80G Tax Exemption Eligible.`
    );
  };

  // ---------------- ADMIN LOGIN PAGE UNAUTHENTICATED VIEW ----------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] py-12 px-4 flex items-center justify-center animate-fade-in">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-8 text-white text-center space-y-3 relative">
            <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto text-amber-300 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <span className="px-2.5 py-0.5 bg-emerald-900/90 text-amber-300 text-[10px] font-bold uppercase rounded-md border border-emerald-700">
                MCA Reg: CSR00059487
              </span>
              <h2 className="text-xl font-bold font-serif mt-2">Trustee & Admin Portal</h2>
              <p className="text-xs text-slate-300">
                Raita Mitra Social Trust (R) Command Center
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {loginError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@raitamitra.org"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-600" />
                  Access Key / Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password (e.g., admin123)..."
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-600 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating Trustee...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-amber-300" />
                    <span>Login to Admin Command Center</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Login Preset Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-center">
              <div className="text-[11px] text-slate-500">
                Testing or Previewing? Use instant Trustee login:
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>⚡ Quick Demo Login (Managing Trustee)</span>
              </button>
            </div>

            {/* Mobile / Device Database Quick Pair Link trigger */}
            {!isSupabaseConfigured && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-center space-y-2 text-xs">
                <div className="font-extrabold text-amber-800 dark:text-amber-300 flex items-center justify-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Mobile Phone Database Pairing</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Opening on Mobile? Enter your Supabase Anon Key once so your phone saves to the cloud:
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Paste Supabase Anon Key..."
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white font-mono outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        setSupabaseCredentials('https://ojqxwlqyjybfzwqnknw.supabase.co', e.currentTarget.value.trim());
                      }
                    }}
                    id="mobile_anon_key_input"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('mobile_anon_key_input') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        setSupabaseCredentials('https://ojqxwlqyjybfzwqnknw.supabase.co', input.value.trim());
                      } else {
                        alert('Please paste your Supabase Anon Public Key.');
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold rounded-lg text-xs cursor-pointer shadow"
                  >
                    Connect
                  </button>
                </div>
              </div>
            )}

            {setMainActiveTab && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMainActiveTab('home')}
                  className="text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition underline"
                >
                  ← Return to Raita Mitra Public Home Page
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-emerald-900 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif">{trustInfo.name}</h1>
          <p className="text-xs text-slate-300 mt-1">
            Enterprise Management Portal • Real-time Supabase Database Sync & CMS Control
          </p>
        </div>

        {/* Database Sync Status Badge & SQL Setup Button & Logout */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowSqlSetupModal(true)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition hover:scale-[1.02] cursor-pointer ${
              isSupabaseConfigured
                ? 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border-emerald-700'
                : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-700'
            }`}
            title="Click to view & copy Supabase SQL Table Setup Query"
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span>
              {isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Active'}
            </span>
            <span className="px-1.5 py-0.5 text-[10px] bg-amber-400 text-slate-950 font-extrabold rounded">
              SQL Schema
            </span>
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700/60 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
            title="Log Out of Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        {[
          { id: 'cms', label: 'CMS, Blogs & Gallery', icon: FileText, badge: `${blogs.length + gallery.length}` },
          { id: 'overview', label: 'Executive Analytics', icon: LayoutDashboard },
          { id: 'crm', label: 'Donor & CSR CRM', icon: Users },
          { id: 'ai-studio', label: 'AI Proposal Studio', icon: Bot, badge: 'AI' },
          { id: 'audit', label: 'Audit & Compliance', icon: ShieldCheck }
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-emerald-900 text-white shadow'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.5 text-[9px] bg-amber-500 text-slate-950 font-extrabold rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==================== TAB 1: CMS, BLOGS & GALLERY ==================== */}
      {activeTab === 'cms' && (
        <div className="space-y-6">
          {/* Sub-tabs for CMS */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex gap-2">
              {[
                { id: 'blogs', label: 'News & Blog Articles', icon: BookOpen, count: blogs.length },
                { id: 'gallery', label: 'Field Impact Gallery', icon: ImageIcon, count: gallery.length },
                { id: 'programs', label: '6 Focus Programs', icon: Layers, count: focusAreas.length },
                { id: 'documents', label: 'CSR Documents', icon: FileText, count: csrDocuments.length }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setCmsSubTab(sub.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    cmsSubTab === sub.id
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <sub.icon className="w-3.5 h-3.5" />
                  <span>{sub.label}</span>
                  <span className="px-1.5 py-0.2 bg-slate-900/10 dark:bg-white/10 rounded-full text-[10px]">
                    {sub.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Direct Action Buttons */}
            <div>
              {cmsSubTab === 'blogs' && (
                <button
                  onClick={() => setShowAddBlogModal(true)}
                  className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>Add New Blog Article</span>
                </button>
              )}

              {cmsSubTab === 'gallery' && (
                <button
                  onClick={() => setShowAddGalleryModal(true)}
                  className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>Upload Field Photo</span>
                </button>
              )}
            </div>
          </div>

          {/* ---------------- CMS SUB-TAB: BLOGS ---------------- */}
          {cmsSubTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                  <h3 className="font-bold font-serif text-base text-slate-900 dark:text-white">
                    Blog & Thought Leadership Articles
                  </h3>
                  <p className="text-xs text-slate-500">
                    Articles published here appear live on the public <strong className="text-emerald-700 dark:text-emerald-400">News & Blog Page</strong> and persist to Supabase database.
                  </p>
                </div>

                {setMainActiveTab && (
                  <button
                    onClick={() => setMainActiveTab('blog')}
                    className="px-3 py-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-800 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center gap-1"
                  >
                    View Public Blog Page
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs">Loading Blogs...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="h-40 rounded-xl overflow-hidden relative bg-slate-950">
                          <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 bg-emerald-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            {b.category}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400">
                          {b.date} • By {b.author.name}
                        </div>

                        <h4 className="font-bold text-sm font-serif text-slate-900 dark:text-white line-clamp-2">
                          {b.title}
                        </h4>

                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                          {b.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">ID: {b.id}</span>
                        <button
                          onClick={() => handleDeleteBlog(b.id)}
                          className="px-2.5 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---------------- CMS SUB-TAB: GALLERY ---------------- */}
          {cmsSubTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                  <h3 className="font-bold font-serif text-base text-slate-900 dark:text-white">
                    Field Evidence Photo Gallery
                  </h3>
                  <p className="text-xs text-slate-500">
                    Photos uploaded here populate the public <strong className="text-emerald-700 dark:text-emerald-400">Field Gallery Page</strong> with district and category tags.
                  </p>
                </div>

                {setMainActiveTab && (
                  <button
                    onClick={() => setMainActiveTab('gallery')}
                    className="px-3 py-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-300 dark:border-emerald-800 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center gap-1"
                  >
                    View Public Gallery
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs">Loading Gallery...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map((g) => (
                    <div
                      key={g.id}
                      className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-slate-950">
                          <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 bg-emerald-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            {g.category}
                          </span>
                          <span className="absolute top-2 right-2 bg-slate-900/90 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            {g.district}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-400 font-medium">
                          {g.date}
                        </div>

                        <h4 className="font-bold text-xs font-serif text-slate-900 dark:text-white line-clamp-2">
                          {g.title}
                        </h4>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                          {g.caption}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">ID: {g.id}</span>
                        <button
                          onClick={() => handleDeleteGallery(g.id)}
                          className="px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---------------- CMS SUB-TAB: CORE PROGRAMS ---------------- */}
          {cmsSubTab === 'programs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {focusAreas.map((prog) => (
                <div
                  key={prog.id}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400 font-serif">
                      {prog.title}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded">
                      Active Program
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 text-[10px] font-medium text-slate-500">
                    {prog.sdgs.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ---------------- CMS SUB-TAB: DOCUMENTS ---------------- */}
          {cmsSubTab === 'documents' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">CSR & Audit Compliance Certificates</h3>
              <div className="space-y-3">
                {csrDocuments.map((doc) => (
                  <div key={doc.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{doc.title}</div>
                      <div className="text-[10px] text-slate-400">{doc.category} • {doc.year} • {doc.fileSize}</div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-900/80 text-emerald-300 text-[10px] font-bold rounded">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 2: EXECUTIVE ANALYTICS ==================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Donations Received</span>
              <span className="text-3xl font-extrabold text-emerald-800 dark:text-emerald-400 block mt-1 font-mono">
                ₹24.8 Lakhs
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold">+18.2% vs last month</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow">
              <span className="text-[10px] font-bold uppercase text-slate-400">Active CSR Partners</span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white block mt-1 font-serif">
                14 Companies
              </span>
              <span className="text-[11px] text-slate-500">MCA CSR-1 Verified</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow">
              <span className="text-[10px] font-bold uppercase text-slate-400">Published Blog Posts</span>
              <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 block mt-1 font-serif">
                {blogs.length} Articles
              </span>
              <span className="text-[11px] text-slate-500">Live on Supabase</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow">
              <span className="text-[10px] font-bold uppercase text-slate-400">Field Gallery Photos</span>
              <span className="text-3xl font-extrabold text-purple-700 dark:text-purple-400 block mt-1 font-serif">
                {gallery.length} Records
              </span>
              <span className="text-[11px] text-slate-500">Across 12 Districts</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: DONOR & CSR CRM ==================== */}
      {activeTab === 'crm' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow space-y-4 animate-fade-in">
          <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white">Recent Donor & CSR Inquiries</h2>
          <div className="space-y-3">
            {[
              { name: 'Infosys Foundation CSR Wing', amount: '₹10,00,000 (Pledged)', status: 'In Review', date: 'Aug 05, 2026' },
              { name: 'Deshpande Foundation', amount: '₹5,00,000 (Disbursed)', status: 'Approved', date: 'Jul 28, 2026' },
              { name: 'Dr. Anand Kulkarni (Individual Donor)', amount: '₹50,000 (80G Receipt Issued)', status: 'Completed', date: 'Jul 20, 2026' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                  <div className="text-[10px] text-slate-400">{item.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400">{item.amount}</div>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold rounded">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 4: AI PROPOSAL STUDIO ==================== */}
      {activeTab === 'ai-studio' && (
        <div className="bg-slate-900 text-white p-8 rounded-3xl border border-emerald-900 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Bot className="w-5 h-5" /> AI Content & Proposal Studio
          </div>

          <h2 className="text-2xl font-bold font-serif">Generate Instant CSR Proposals & Impact Summaries</h2>

          <form onSubmit={handleAiGenerate} className="space-y-4">
            <textarea
              rows={3}
              placeholder="e.g. Generate a ₹20 Lakh CSR proposal for soil health testing and organic farming in Belagavi district..."
              value={aiGeneratorPrompt}
              onChange={(e) => setAiGeneratorPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:border-emerald-500"
            ></textarea>

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow"
            >
              Generate AI Proposal Draft
            </button>
          </form>

          {aiGeneratedText && (
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap animate-fade-in">
              {aiGeneratedText}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 5: AUDIT LOGS ==================== */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow space-y-3 animate-fade-in">
          <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-white">Governance & System Audit Trails</h2>
          <div className="text-xs text-slate-500 font-mono space-y-2">
            <div>[2026-08-09 10:24:12] BLOG_UPDATED: Created new article on Supabase database table 'blogs'.</div>
            <div>[2026-08-09 09:15:02] GALLERY_UPLOAD: Added field photo record in district Dharwad.</div>
            <div>[2026-08-08 14:02:11] MCA_CSR1_SYNC: Verified CSR00059487 status active with Ministry of Corporate Affairs.</div>
          </div>
        </div>
      )}

      {/* ==================== MODAL 1: ADD BLOG ARTICLE ==================== */}
      {showAddBlogModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center animate-fade-in">
          <div className="bg-slate-900 text-white border border-emerald-800/80 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-serif text-lg">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <span>Publish New Blog Article</span>
              </div>
              <button
                onClick={() => setShowAddBlogModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Revolutionizing Soil Acidity Testing in Dharwad District"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Category *</label>
                  <select
                    value={newBlog.category}
                    onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Sustainable Agriculture">Sustainable Agriculture</option>
                    <option value="AI & Skill Development">AI & Skill Development</option>
                    <option value="CSR & Compliance">CSR & Compliance</option>
                    <option value="Women Empowerment">Women Empowerment</option>
                    <option value="Climate Action">Climate Action</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Read Time *</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 min read"
                    value={newBlog.readTime}
                    onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Author Name</label>
                  <input
                    type="text"
                    value={newBlog.authorName}
                    onChange={(e) => setNewBlog({ ...newBlog, authorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Author Role</label>
                  <input
                    type="text"
                    value={newBlog.authorRole}
                    onChange={(e) => setNewBlog({ ...newBlog, authorRole: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <label className="font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    Cover Picture / Image *
                  </span>
                  <span className="text-[10px] text-amber-400 font-normal">File Upload or Preset Link</span>
                </label>

                {/* Live Image Preview */}
                {newBlog.image && (
                  <div className="relative h-32 rounded-xl overflow-hidden border border-slate-700 bg-black group">
                    <img src={newBlog.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <span className="text-[10px] text-emerald-300 font-bold bg-slate-900/90 px-2 py-1 rounded">
                        {newBlog.image.startsWith('data:') ? 'Local Image File Loaded' : 'Web Image Link Active'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Upload File Input Button */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label htmlFor="blog-file-input" className="flex-1 cursor-pointer py-2.5 px-4 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-2 transition">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Upload Picture from Computer</span>
                    <input
                      id="blog-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleBlogImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset Chips */}
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] text-slate-400 font-semibold">Or Pick Sample Field Preset Picture:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {samplePresets.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setNewBlog({ ...newBlog, image: preset.url })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                          newBlog.image === preset.url
                            ? 'bg-amber-400 text-slate-950 shadow'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* URL Direct Fallback */}
                <div className="pt-1">
                  <input
                    type="text"
                    required
                    placeholder="Or paste image URL (https://...)"
                    value={newBlog.image}
                    onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-[10px] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Short Excerpt (Summary)</label>
                <input
                  type="text"
                  placeholder="A brief 1-2 sentence overview for cards..."
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Full Article Content *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Write the full article text here..."
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Key Takeaways (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Soil testing reduces chemical fertilizer overuse by 35%"
                  value={newBlog.keyTakeaways}
                  onChange={(e) => setNewBlog({ ...newBlog, keyTakeaways: e.target.value })}
                  className="w-full px-3.5 py-2 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddBlogModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4 text-amber-300" />
                  Publish Blog Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: UPLOAD GALLERY PHOTO ==================== */}
      {showAddGalleryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto flex items-center justify-center animate-fade-in">
          <div className="bg-slate-900 text-white border border-emerald-800/80 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold font-serif text-lg">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <span>Upload Field Photo to Gallery</span>
              </div>
              <button
                onClick={() => setShowAddGalleryModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Farmers Soil Health Workshop"
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Category *</label>
                  <select
                    value={newGallery.category}
                    onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Agriculture">Agriculture</option>
                    <option value="Women Empowerment">Women Empowerment</option>
                    <option value="AI & Youth Skills">AI & Youth Skills</option>
                    <option value="Healthcare & Sanitation">Healthcare & Sanitation</option>
                    <option value="Tree Plantation">Tree Plantation</option>
                    <option value="CSR Events">CSR Events</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">District / Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dharwad, Belagavi, Hubballi"
                    value={newGallery.district}
                    onChange={(e) => setNewGallery({ ...newGallery, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Date</label>
                  <input
                    type="text"
                    value={newGallery.date}
                    onChange={(e) => setNewGallery({ ...newGallery, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Photographer / Credit</label>
                  <input
                    type="text"
                    value={newGallery.photographer}
                    onChange={(e) => setNewGallery({ ...newGallery, photographer: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <label className="font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    Field Photo Picture *
                  </span>
                  <span className="text-[10px] text-amber-400 font-normal">File Upload or Preset Link</span>
                </label>

                {/* Live Image Preview */}
                {newGallery.image && (
                  <div className="relative h-36 rounded-xl overflow-hidden border border-slate-700 bg-black group">
                    <img src={newGallery.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                      <span className="text-[10px] text-emerald-300 font-bold bg-slate-900/90 px-2 py-1 rounded">
                        {newGallery.image.startsWith('data:') ? 'Local Image File Loaded' : 'Web Image Link Active'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Upload File Input Button */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label htmlFor="gallery-file-input" className="flex-1 cursor-pointer py-2.5 px-4 bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-2 transition">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Upload Picture from Computer</span>
                    <input
                      id="gallery-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset Chips */}
                <div className="space-y-1 pt-1">
                  <div className="text-[10px] text-slate-400 font-semibold">Or Pick Sample Field Preset Picture:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {samplePresets.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setNewGallery({ ...newGallery, image: preset.url })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                          newGallery.image === preset.url
                            ? 'bg-amber-400 text-slate-950 shadow'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* URL Direct Fallback */}
                <div className="pt-1">
                  <input
                    type="text"
                    required
                    placeholder="Or paste image URL (https://...)"
                    value={newGallery.image}
                    onChange={(e) => setNewGallery({ ...newGallery, image: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white font-mono text-[10px] focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Caption / Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the activity, beneficiaries, or impact details in the photo..."
                  value={newGallery.caption}
                  onChange={(e) => setNewGallery({ ...newGallery, caption: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddGalleryModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4 text-amber-300" />
                  Save to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Supabase SQL Table Setup & Credentials Modal */}
      {showSqlSetupModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-white p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-950 border border-emerald-700 rounded-2xl text-emerald-400">
                  <Database className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                    Supabase Database Sync & Setup
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Connect your live Supabase database so all devices stay updated in real-time.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlSetupModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Sync / Seed Button */}
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 p-5 rounded-2xl border border-emerald-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
                  <span className="font-extrabold text-sm text-white">Push Content to Supabase Database</span>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                  isSupabaseConfigured ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                }`}>
                  {isSupabaseConfigured ? 'Connected' : 'Action Needed'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Populate your Supabase <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300">blogs</code> and <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300">gallery</code> tables with all current articles and photos. Once pushed, all smartphones and computers will instantly see the same content!
              </p>

              {syncStatus.message && (
                <div className={`p-3 rounded-xl text-xs font-medium border ${
                  syncStatus.isError
                    ? 'bg-red-950/80 border-red-700 text-red-200'
                    : 'bg-emerald-950 border-emerald-700 text-emerald-200'
                }`}>
                  {syncStatus.message}
                </div>
              )}

              <button
                type="button"
                onClick={handleSyncDatabase}
                disabled={syncStatus.loading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition hover:scale-[1.01] cursor-pointer"
              >
                {syncStatus.loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Syncing Records to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>⚡ Push All Blogs & Gallery Data to Supabase Database</span>
                  </>
                )}
              </button>
            </div>

            {/* 2. Credentials Configurator */}
            <form onSubmit={handleSaveCredentials} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
                <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-400" />
                  Supabase Project API Credentials
                </span>
                <span className="text-[10px] text-slate-400">
                  Found in Supabase Dashboard -&gt; Project Settings -&gt; API
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Supabase Project URL</label>
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://ojqxwlqyjybfzwqnknw.supabase.co"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:border-amber-400 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Supabase Anon Public Key</label>
                  <input
                    type="password"
                    value={customKeyInput}
                    onChange={(e) => setCustomKeyInput(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:border-amber-400 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                {isSupabaseConfigured ? (
                  <button
                    type="button"
                    onClick={clearSupabaseCredentials}
                    className="text-[11px] text-red-400 hover:underline font-bold"
                  >
                    Disconnect / Reset Custom Keys
                  </button>
                ) : <span />}

                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-amber-300" />
                  Save Credentials & Connect
                </button>
              </div>
            </form>

            {/* 3. Mobile Device Quick Pairing Link & QR Code */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  📱 Scan QR Code or Use 1-Tap Mobile Phone Pairing Link
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">1-Second Mobile Sync</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${window.location.origin}/?sb_url=${encodeURIComponent(customUrlInput.trim())}&sb_key=${encodeURIComponent(customKeyInput.trim())}`)}`}
                  alt="Scan QR Code to pair Mobile Phone"
                  className="w-32 h-32 rounded-xl border border-slate-700 bg-white p-1.5 shadow shrink-0"
                />
                <div className="space-y-2 text-slate-300 text-[11px] flex-1 w-full">
                  <p className="leading-relaxed">
                    <strong>To pair your mobile phone:</strong> Scan this QR code with your smartphone camera, or copy the pairing link below and open it on your phone's browser. It automatically sets up Supabase on your mobile device so all phone edits store in the cloud!
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyMobileLink}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-extrabold rounded-xl transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                  >
                    {mobileLinkCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Mobile Link Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-amber-400" />
                        <span>Copy Mobile Pairing Link (Send to Phone)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Quick SQL Steps */}
            <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
              <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-amber-400" />
                Table Schema Setup (SQL Editor):
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1 font-medium">
                <li>In your Supabase Dashboard, click <strong>SQL Editor</strong> (`&gt;_` on left sidebar).</li>
                <li>Click <strong>New Query</strong>, paste the SQL query below, and click <strong>RUN</strong>.</li>
              </ol>
            </div>

            {/* 4. SQL Snippet Box */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="flex justify-between items-center px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
                <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> schema.sql
                </span>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-lg transition flex items-center gap-1.5 shadow"
                >
                  {sqlCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-amber-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto max-h-48 select-all">
                {supabaseSqlCode}
              </pre>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSqlSetupModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

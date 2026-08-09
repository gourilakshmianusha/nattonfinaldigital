import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BlogPost, GalleryItem } from '../types';
import { blogPosts as defaultBlogPosts, galleryItems as defaultGalleryItems } from '../data/mockData';

// Retrieve environment or custom credentials
const env = (import.meta as any).env || {};
const DEFAULT_SUPABASE_URL = 'https://ojqxwlqyjybfzfwqnknw.supabase.co';

// Auto-config via URL parameters (Mobile Friendly)
// Share this URL with any device:
// http://your-device-ip:5173?sb_url=YOUR_URL&sb_key=YOUR_KEY
if (typeof window !== 'undefined') {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const qUrl = urlParams.get('sb_url');
    const qKey = urlParams.get('sb_key');
    
    if (qKey) {
      // Store credentials in localStorage
      if (qUrl) {
        localStorage.setItem('raita_custom_supabase_url', qUrl.trim());
      } else {
        localStorage.setItem('raita_custom_supabase_url', DEFAULT_SUPABASE_URL);
      }
      localStorage.setItem('raita_custom_supabase_anon_key', qKey.trim());
      
      console.log('✅ Supabase credentials loaded from URL!');
      
      // Clean query params from browser bar without page reload loop
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // Dispatch event for UI to refresh
      window.dispatchEvent(new CustomEvent('supabase_credentials_updated'));
    }
  } catch (e) {
    console.warn('URL search params parsing error:', e);
  }
}

// Credentials Storage (Persists across devices)
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('raita_custom_supabase_url') : null;
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('raita_custom_supabase_anon_key') : null;

export const supabaseUrl = storedUrl || env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey = storedKey || env.VITE_SUPABASE_ANON_KEY || '';

// Supabase Client Factory (with validation)
export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  
  const sUrl = localStorage.getItem('raita_custom_supabase_url') || env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const sKey = localStorage.getItem('raita_custom_supabase_anon_key') || env.VITE_SUPABASE_ANON_KEY || '';
  
  // Validate credentials
  if (
    sUrl && 
    sKey && 
    sUrl.trim().length > 0 && 
    sKey.trim().length > 0 && 
    sUrl.startsWith('https://') &&
    sKey.trim().length > 30 // Basic sanity check for JWT length
  ) {
    try {
      console.log('✅ Creating Supabase client for:', sUrl);
      return createClient(sUrl.trim(), sKey.trim(), {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });
    } catch (e) {
      console.warn('❌ Supabase client instantiation error:', e);
    }
  } else {
    console.warn('⚠️ Invalid Supabase credentials detected. Please check your .env.local or URL parameters.');
    if (!sKey || sKey.trim().length < 30) {
      console.warn('   - Anon Key appears to be missing or too short');
    }
    if (!sUrl || !sUrl.startsWith('https://')) {
      console.warn('   - URL appears to be missing or invalid');
    }
  }
  return null;
}

// Check Configuration Status
export function checkIsSupabaseConfigured(): boolean {
  const client = getSupabaseClient();
  return client !== null;
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.trim().length > 30
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Credentials Management (For UI)
export function setSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    const trimmedUrl = url.trim();
    const trimmedKey = key.trim();
    
    // Validate before saving
    if (!trimmedUrl.startsWith('https://')) {
      throw new Error('Supabase URL must start with https://');
    }
    if (trimmedKey.length < 30) {
      throw new Error('Supabase Anon Key appears to be invalid (too short)');
    }
    
    localStorage.setItem('raita_custom_supabase_url', trimmedUrl);
    localStorage.setItem('raita_custom_supabase_anon_key', trimmedKey);
    
    console.log('✅ Supabase credentials saved successfully!');
    window.dispatchEvent(new CustomEvent('supabase_credentials_updated'));
  }
}

export function clearSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('raita_custom_supabase_url');
    localStorage.removeItem('raita_custom_supabase_anon_key');
    console.log('🔄 Supabase credentials cleared');
    window.dispatchEvent(new CustomEvent('supabase_credentials_updated'));
  }
}

// Local Storage Helpers (with Quota Management)
const BLOGS_STORAGE_KEY = 'raita_mitra_blogs_v1';
const GALLERY_STORAGE_KEY = 'raita_mitra_gallery_v1';

// Safe localStorage setter that handles QuotaExceededError gracefully
function safeLocalStorageSet(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`LocalStorage quota exceeded for "${key}". Applying lightweight fallback...`, err);
    try {
      // If storage is full, strip heavy data: URIs from non-essential items
      if (Array.isArray(data)) {
        const lightweightData = data.map((item, index) => {
          // Replace base64 images with fallback unsplash image if array is long or item is old
          if (index > 2 && typeof item.image === 'string' && item.image.startsWith('data:')) {
            return {
              ...item,
              image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800'
            };
          }
          return item;
        });
        localStorage.setItem(key, JSON.stringify(lightweightData));
      }
    } catch (fallbackErr) {
      console.error('Failed to set localStorage even with lightweight data:', fallbackErr);
    }
  }
}

// Blog Functions (with Cross-Device Sync)
export async function fetchBlogs(): Promise<BlogPost[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Transform Supabase data to match BlogPost type
        return data.map((item: any) => ({
          id: item.id || item.slug,
          title: item.title,
          slug: item.slug || item.id,
          category: item.category || 'General',
          excerpt: item.excerpt || '',
          content: item.content || '',
          author: typeof item.author === 'string' ? JSON.parse(item.author) : item.author || { name: 'Raita Mitra Team', role: 'Editor', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
          date: item.date || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          readTime: item.read_time || item.readTime || '5 min read',
          image: item.image || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800',
          tags: Array.isArray(item.tags) ? item.tags : (item.tags ? JSON.parse(item.tags) : ['Raita Mitra']),
          keyTakeaways: Array.isArray(item.key_takeaways) ? item.key_takeaways : (item.keyTakeaways ? JSON.parse(item.keyTakeaways) : [])
        }));
      } else if (!error && data && data.length === 0) {
        // Table exists but empty -> auto-seed from localStorage/defaults
        console.log('📦 Blog table empty, seeding from local data...');
        syncAllToSupabase().catch((err) => console.warn('Auto-seed warning:', err));
        const saved = localStorage.getItem(BLOGS_STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultBlogPosts;
      }
    } catch (err) {
      console.warn('Supabase fetch blogs fallback to localStorage:', err);
    }
  }

  // Fallback to localStorage / mock
  try {
    const saved = localStorage.getItem(BLOGS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading blogs from localStorage:', e);
  }

  return defaultBlogPosts;
}

export async function saveBlog(post: BlogPost): Promise<BlogPost[]> {
  // 1. Always update local storage
  let currentBlogs = await fetchBlogs();
  const existingIdx = currentBlogs.findIndex((b) => b.id === post.id);
  if (existingIdx >= 0) {
    currentBlogs[existingIdx] = post;
  } else {
    currentBlogs = [post, ...currentBlogs];
  }

  safeLocalStorageSet(BLOGS_STORAGE_KEY, currentBlogs);

  // 2. Try Supabase if configured
  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('blogs').upsert({
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        date: post.date,
        read_time: post.readTime,
        image: post.image,
        tags: post.tags,
        key_takeaways: post.keyTakeaways || []
      });
      if (error) console.error('Supabase blog save error:', error);
    } catch (err) {
      console.warn('Supabase blog save warning:', err);
    }
  }

  // Dispatch custom event for immediate UI updates
  window.dispatchEvent(new CustomEvent('raita_blogs_updated', { detail: currentBlogs }));
  return currentBlogs;
}

export async function deleteBlog(id: string): Promise<BlogPost[]> {
  let currentBlogs = await fetchBlogs();
  currentBlogs = currentBlogs.filter((b) => b.id !== id);
  safeLocalStorageSet(BLOGS_STORAGE_KEY, currentBlogs);

  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('blogs').delete().eq('id', id);
      if (error) console.error('Supabase blog delete error:', error);
    } catch (err) {
      console.warn('Supabase blog delete warning:', err);
    }
  }

  window.dispatchEvent(new CustomEvent('raita_blogs_updated', { detail: currentBlogs }));
  return currentBlogs;
}

// Gallery Functions (with Cross-Device Sync)
export async function fetchGallery(): Promise<GalleryItem[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category || 'Agriculture',
          image: item.image || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1200',
          district: item.district || 'Dharwad',
          date: item.date || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          caption: item.caption || '',
          photographer: item.photographer || 'Raita Mitra Team'
        }));
      } else if (!error && data && data.length === 0) {
        console.log('📦 Gallery table empty, seeding from local data...');
        syncAllToSupabase().catch((err) => console.warn('Auto-seed warning:', err));
        const saved = localStorage.getItem(GALLERY_STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultGalleryItems;
      }
    } catch (err) {
      console.warn('Supabase fetch gallery fallback to localStorage:', err);
    }
  }

  try {
    const saved = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading gallery from localStorage:', e);
  }

  return defaultGalleryItems;
}

export async function saveGalleryItem(item: GalleryItem): Promise<GalleryItem[]> {
  let currentGallery = await fetchGallery();
  const existingIdx = currentGallery.findIndex((g) => g.id === item.id);
  if (existingIdx >= 0) {
    currentGallery[existingIdx] = item;
  } else {
    currentGallery = [item, ...currentGallery];
  }

  safeLocalStorageSet(GALLERY_STORAGE_KEY, currentGallery);

  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('gallery').upsert({
        id: item.id,
        title: item.title,
        category: item.category,
        image: item.image,
        district: item.district,
        date: item.date,
        caption: item.caption,
        photographer: item.photographer
      });
      if (error) console.error('Supabase gallery save error:', error);
    } catch (err) {
      console.warn('Supabase gallery save warning:', err);
    }
  }

  window.dispatchEvent(new CustomEvent('raita_gallery_updated', { detail: currentGallery }));
  return currentGallery;
}

export async function deleteGalleryItem(id: string): Promise<GalleryItem[]> {
  let currentGallery = await fetchGallery();
  currentGallery = currentGallery.filter((g) => g.id !== id);
  safeLocalStorageSet(GALLERY_STORAGE_KEY, currentGallery);

  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('gallery').delete().eq('id', id);
      if (error) console.error('Supabase gallery delete error:', error);
    } catch (err) {
      console.warn('Supabase gallery delete warning:', err);
    }
  }

  window.dispatchEvent(new CustomEvent('raita_gallery_updated', { detail: currentGallery }));
  return currentGallery;
}

// Sync Function (With QR Code/Share URL Support)
export async function syncAllToSupabase(overrideUrl?: string, overrideKey?: string): Promise<{ 
  blogsCount: number; 
  galleryCount: number; 
  error?: string;
  shareUrl?: string;
}> {
  let activeClient = getSupabaseClient();
  let shareUrl = '';
  
  // If custom credentials provided, use them and save to localStorage
  if (overrideUrl && overrideKey && overrideUrl.trim() && overrideKey.trim()) {
    try {
      activeClient = createClient(overrideUrl.trim(), overrideKey.trim());
      localStorage.setItem('raita_custom_supabase_url', overrideUrl.trim());
      localStorage.setItem('raita_custom_supabase_anon_key', overrideKey.trim());
      
      // Generate shareable URL for other devices
      const baseUrl = window.location.origin;
      shareUrl = `${baseUrl}?sb_url=${encodeURIComponent(overrideUrl.trim())}&sb_key=${encodeURIComponent(overrideKey.trim())}`;
      console.log('🔗 Shareable URL generated:', shareUrl);
      
      window.dispatchEvent(new CustomEvent('supabase_credentials_updated'));
    } catch (e) {
      console.warn('Error instantiating custom Supabase client:', e);
    }
  }

  if (!activeClient) {
    return {
      blogsCount: 0,
      galleryCount: 0,
      error: '⚠️ Supabase Anon Key is missing! Please enter your Supabase Anon Public Key below (or set VITE_SUPABASE_ANON_KEY on Netlify) and click Save.'
    };
  }

  try {
    // Get current blogs (from localStorage or mockData)
    let localBlogs: BlogPost[] = [];
    try {
      const saved = localStorage.getItem(BLOGS_STORAGE_KEY);
      localBlogs = saved ? JSON.parse(saved) : defaultBlogPosts;
    } catch {
      localBlogs = defaultBlogPosts;
    }

    // Upsert blogs
    const formattedBlogs = localBlogs.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      date: post.date,
      read_time: post.readTime,
      image: post.image,
      tags: post.tags,
      key_takeaways: post.keyTakeaways || []
    }));

    const { error: blogErr } = await activeClient.from('blogs').upsert(formattedBlogs);
    if (blogErr) console.error('Error syncing blogs to Supabase:', blogErr);

    // Get current gallery items
    let localGallery: GalleryItem[] = [];
    try {
      const saved = localStorage.getItem(GALLERY_STORAGE_KEY);
      localGallery = saved ? JSON.parse(saved) : defaultGalleryItems;
    } catch {
      localGallery = defaultGalleryItems;
    }

    // Upsert gallery
    const formattedGallery = localGallery.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      image: item.image,
      district: item.district,
      date: item.date,
      caption: item.caption,
      photographer: item.photographer
    }));

    const { error: galleryErr } = await activeClient.from('gallery').upsert(formattedGallery);
    if (galleryErr) console.error('Error syncing gallery to Supabase:', galleryErr);

    // Better error handling with specific messages
    if (blogErr || galleryErr) {
      const rawErrorMsg = ((blogErr?.message || '') + ' ' + (galleryErr?.message || '')).trim();
      
      // Check for connection errors
      if (rawErrorMsg.toLowerCase().includes('failed to fetch') || rawErrorMsg.toLowerCase().includes('typeerror')) {
        return {
          blogsCount: 0,
          galleryCount: 0,
          error: '❌ Connection Failed (Failed to Fetch).\n\n' +
                 '1️⃣ Ensure your Supabase project is active (Free Supabase projects pause after 7 days of inactivity — check app.supabase.com to unpause)\n' +
                 '2️⃣ Verify your Supabase URL & Anon Key are correct\n' +
                 '3️⃣ Check internet connectivity\n' +
                 '4️⃣ If using a share URL, make sure it contains the correct credentials',
          shareUrl
        };
      }

      // Check for missing tables
      if (rawErrorMsg.toLowerCase().includes('does not exist') || rawErrorMsg.toLowerCase().includes('relation')) {
        return {
          blogsCount: 0,
          galleryCount: 0,
          error: '❌ Tables missing in Supabase!\n\nClick "View SQL Database Setup Script" below, copy the SQL, and run it in your Supabase SQL Editor.',
          shareUrl
        };
      }

      return {
        blogsCount: formattedBlogs.length,
        galleryCount: formattedGallery.length,
        error: `⚠️ ${rawErrorMsg}`,
        shareUrl
      };
    }

    return {
      blogsCount: formattedBlogs.length,
      galleryCount: formattedGallery.length,
      shareUrl
    };
  } catch (err: any) {
    const rawMsg = String(err?.message || err || '');
    if (rawMsg.toLowerCase().includes('failed to fetch') || rawMsg.toLowerCase().includes('typeerror')) {
      return {
        blogsCount: 0,
        galleryCount: 0,
        error: '❌ Unable to connect to Supabase server (Failed to Fetch).\n\n' +
               '1️⃣ Make sure your free Supabase project is UNPAUSED at app.supabase.com\n' +
               '2️⃣ Confirm your Supabase URL and Anon Key are saved\n' +
               '3️⃣ If on Netlify, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Netlify environment settings\n' +
               '4️⃣ Try using the share URL feature to auto-configure this device',
        shareUrl
      };
    }
    return { 
      blogsCount: 0, 
      galleryCount: 0, 
      error: `⚠️ ${rawMsg || 'Failed to sync to Supabase'}`,
      shareUrl 
    };
  }
}

// Share URL Generator (For Easy Cross-Device Setup)
export function generateShareUrl(url?: string, key?: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const supabaseUrl = url || localStorage.getItem('raita_custom_supabase_url') || DEFAULT_SUPABASE_URL;
  const supabaseKey = key || localStorage.getItem('raita_custom_supabase_anon_key') || '';
  
  if (!supabaseKey || supabaseKey.length < 30) {
    console.warn('Cannot generate share URL: Missing valid Supabase Anon Key');
    return '';
  }
  
  return `${baseUrl}?sb_url=${encodeURIComponent(supabaseUrl)}&sb_key=${encodeURIComponent(supabaseKey)}`;
}

// Expose helper functions for console debugging
if (typeof window !== 'undefined') {
  // @ts-ignore - Expose for debugging in browser console
  window.__supabaseHelpers = {
    getClient: getSupabaseClient,
    generateShareUrl,
    setCredentials: setSupabaseCredentials,
    clearCredentials: clearSupabaseCredentials,
    isConfigured: checkIsSupabaseConfigured,
    syncAll: syncAllToSupabase,
  };
  console.log('💡 Supabase helpers available in console: window.__supabaseHelpers');
}
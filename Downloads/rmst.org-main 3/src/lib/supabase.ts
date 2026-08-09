import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BlogPost, GalleryItem } from '../types';
import { blogPosts as defaultBlogPosts, galleryItems as defaultGalleryItems } from '../data/mockData';

// Retrieve environment or custom credentials
const env = (import.meta as any).env || {};
const DEFAULT_SUPABASE_URL = 'https://ojqxwlqyjybfzwqnknw.supabase.co';

// Auto-pair via URL query params (e.g., for easy mobile device setup: ?sb_url=...&sb_key=...)
if (typeof window !== 'undefined') {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const qUrl = urlParams.get('sb_url');
    const qKey = urlParams.get('sb_key');
    if (qKey) {
      if (qUrl) localStorage.setItem('raita_custom_supabase_url', qUrl.trim());
      else localStorage.setItem('raita_custom_supabase_url', DEFAULT_SUPABASE_URL);
      localStorage.setItem('raita_custom_supabase_anon_key', qKey.trim());
      // Clean query params from browser bar without page reload loop
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  } catch (e) {
    console.warn('URL search params parsing error:', e);
  }
}

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('raita_custom_supabase_url') : null;
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('raita_custom_supabase_anon_key') : null;

export const supabaseUrl = storedUrl || env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const supabaseAnonKey = storedKey || env.VITE_SUPABASE_ANON_KEY || '';

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  const sUrl = localStorage.getItem('raita_custom_supabase_url') || env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const sKey = localStorage.getItem('raita_custom_supabase_anon_key') || env.VITE_SUPABASE_ANON_KEY || '';
  if (sUrl && sKey && sUrl.trim().length > 0 && sKey.trim().length > 0 && sUrl.startsWith('https://')) {
    try {
      return createClient(sUrl.trim(), sKey.trim());
    } catch (e) {
      console.warn('Supabase client instantiation error:', e);
    }
  }
  return null;
}

export function checkIsSupabaseConfigured(): boolean {
  return getSupabaseClient() !== null;
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
  supabaseUrl.startsWith('https://')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function setSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('raita_custom_supabase_url', url.trim());
    localStorage.setItem('raita_custom_supabase_anon_key', key.trim());
    window.location.reload();
  }
}

export function clearSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('raita_custom_supabase_url');
    localStorage.removeItem('raita_custom_supabase_anon_key');
    window.location.reload();
  }
}

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

// ---------------- BLOG FUNCTIONS ----------------

export async function fetchBlogs(): Promise<BlogPost[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
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
        // Table exists in Supabase but is empty -> auto-seed from local/defaults so all devices can see records
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

// ---------------- GALLERY FUNCTIONS ----------------

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

export async function syncAllToSupabase(overrideUrl?: string, overrideKey?: string): Promise<{ blogsCount: number; galleryCount: number; error?: string }> {
  let activeClient = getSupabaseClient();
  
  if (overrideUrl && overrideKey && overrideUrl.trim() && overrideKey.trim()) {
    try {
      activeClient = createClient(overrideUrl.trim(), overrideKey.trim());
      localStorage.setItem('raita_custom_supabase_url', overrideUrl.trim());
      localStorage.setItem('raita_custom_supabase_anon_key', overrideKey.trim());
    } catch (e) {
      console.warn('Error instantiating custom Supabase client:', e);
    }
  }

  if (!activeClient) {
    return {
      blogsCount: 0,
      galleryCount: 0,
      error: 'Supabase Anon Key is missing! Please enter your Supabase Anon Public Key below (or set VITE_SUPABASE_ANON_KEY on Netlify) and click Save.'
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

    if (blogErr || galleryErr) {
      const rawErrorMsg = ((blogErr?.message || '') + ' ' + (galleryErr?.message || '')).trim();
      
      if (rawErrorMsg.toLowerCase().includes('failed to fetch') || rawErrorMsg.toLowerCase().includes('typeerror')) {
        return {
          blogsCount: 0,
          galleryCount: 0,
          error: 'Connection Failed (Failed to Fetch). 1) Ensure your Supabase project is active (Free Supabase projects pause after 7 days of inactivity — check app.supabase.com to unpause); 2) Verify your Supabase URL & Anon Key are correct; 3) Check internet connectivity.'
        };
      }

      if (rawErrorMsg.toLowerCase().includes('does not exist') || rawErrorMsg.toLowerCase().includes('relation')) {
        return {
          blogsCount: 0,
          galleryCount: 0,
          error: 'Tables missing in Supabase! Click "View SQL Database Setup Script" below, copy the SQL, and run it in your Supabase SQL Editor.'
        };
      }

      return {
        blogsCount: formattedBlogs.length,
        galleryCount: formattedGallery.length,
        error: rawErrorMsg
      };
    }

    return {
      blogsCount: formattedBlogs.length,
      galleryCount: formattedGallery.length
    };
  } catch (err: any) {
    const rawMsg = String(err?.message || err || '');
    if (rawMsg.toLowerCase().includes('failed to fetch') || rawMsg.toLowerCase().includes('typeerror')) {
      return {
        blogsCount: 0,
        galleryCount: 0,
        error: 'Unable to connect to Supabase server (Failed to Fetch). 1) Make sure your free Supabase project is UNPAUSED at app.supabase.com; 2) Confirm your Supabase URL and Anon Key are saved; 3) If on Netlify, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to Netlify environment settings.'
      };
    }
    return { blogsCount: 0, galleryCount: 0, error: rawMsg || 'Failed to sync to Supabase' };
  }
}

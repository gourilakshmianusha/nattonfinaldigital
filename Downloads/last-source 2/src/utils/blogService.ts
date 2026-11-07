import { BlogPost } from '../types';

export async function blogRequest(path: string, options: RequestInit = {}) {
 const response = await fetch(`/api/public/blog${path}`, { ...options, credentials: 'same-origin', cache: 'no-store', headers: { 'Content-Type': 'application/json', 'X-ND-Request': 'admin', ...options.headers } });
 if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('The blog service is unavailable on this host.');
 const data = await response.json();
 if (!response.ok) throw new Error(data.error || 'The request could not be completed.');
 return data;
}
export function mapPublishedPost(row: any): BlogPost {
 const body = row.body || {};
 return { id: row.id, slug: row.slug, title: row.title, excerpt: body.summary || '', content: body.body || '', category: body.category || 'Insights', author: body.author || 'Natton Digital', date: row.updated_at, readTime: `${Math.max(1, Math.ceil(String(body.body || '').split(/\s+/).filter(Boolean).length / 220))} min read`, tags: Array.isArray(body.tags) ? body.tags : String(body.tags || '').split(',').map((tag: string) => tag.trim()).filter(Boolean), featuredImage: body.hero_image || '', altText: body.alt_text || '' };
}
export async function loadBlogPosts(query: {page?: number; q?: string; category?: string; article?: string} = {}) {
 const params = new URLSearchParams(Object.entries(query).filter(([, value]) => value !== undefined && value !== '').map(([key, value]) => [key, String(value)]));
 const data = await blogRequest(`/posts?${params}`);
 return { ...data, posts: data.rows.map(mapPublishedPost) as BlogPost[] };
}

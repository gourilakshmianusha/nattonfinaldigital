import { createClient } from '@supabase/supabase-js';
import { existingSupabaseUrl, existingSupabasePublicKey } from '../admin/connection.mjs';
const env = (import.meta as any).env || {};
const url = env.VITE_SUPABASE_URL || existingSupabaseUrl;
const key = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || existingSupabasePublicKey;
export const supabase = createClient(url, key);

import { createBrowserClient as createClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

function normalizeSupabaseUrl(url?: string): string {
  if (!url) return 'https://placeholder.supabase.co';
  let clean = url.trim();
  clean = clean.replace(/\/rest\/v1\/?$/, '');
  clean = clean.replace(/\/+$/, '');
  return clean;
}

export function createBrowserClient() {
  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder').trim();

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

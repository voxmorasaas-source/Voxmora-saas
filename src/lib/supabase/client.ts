import { createBrowserClient as createClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

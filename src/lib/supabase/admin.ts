import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

/**
 * Normalize the Supabase URL by stripping any accidental `/rest/v1/` suffix.
 * This prevents auth failures when env vars are accidentally set with the REST endpoint.
 */
function normalizeSupabaseUrl(url?: string): string {
  if (!url) return '';
  let clean = url.trim();
  clean = clean.replace(/\/rest\/v1\/?$/, '');
  clean = clean.replace(/\/+$/, '');
  return clean;
}

// Admin client using the Service Role Key.
// CAUTION: Bypasses Row Level Security (RLS). Use exclusively for background webhooks and system tasks.
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  }

  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);

  return createClient<Database>(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}


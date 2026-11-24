import 'server-only';
import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export abstract class BaseRepository {
  protected async getClient(): Promise<Awaited<ReturnType<typeof createServerClient>>> {
    try {
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return createAdminClient() as unknown as Awaited<ReturnType<typeof createServerClient>>;
      }
    } catch (e) {
      // Fallback to server client if service role key fails
    }
    return createServerClient();
  }
}


import 'server-only';
import { createServerClient } from '@/lib/supabase/server';

export abstract class BaseRepository {
  protected async getClient() {
    return createServerClient();
  }
}


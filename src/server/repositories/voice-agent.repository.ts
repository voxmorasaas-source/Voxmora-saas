import 'server-only';
import { BaseRepository } from './base.repository';
import type { Database } from '@/types/database.types';

type VoiceAgentRow = Database['public']['Tables']['voice_agents']['Row'];
type VoiceAgentInsert = Database['public']['Tables']['voice_agents']['Insert'];
type VoiceAgentUpdate = Database['public']['Tables']['voice_agents']['Update'];

export class VoiceAgentRepository extends BaseRepository {
  async findById(orgId: string, agentId: string): Promise<VoiceAgentRow | null> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from('voice_agents')
      .select('*')
      .eq('organization_id', orgId)
      .eq('id', agentId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async listByOrg(orgId: string): Promise<VoiceAgentRow[]> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from('voice_agents')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async countByOrg(orgId: string): Promise<number> {
    const supabase = await this.getClient();
    const { count, error } = await supabase
      .from('voice_agents')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', orgId);

    if (error) throw error;
    return count ?? 0;
  }

  async create(data: VoiceAgentInsert): Promise<VoiceAgentRow> {
    const supabase = await this.getClient();
    const { data: record, error } = await supabase
      .from('voice_agents')
      .insert(data as any)
      .select()
      .single();

    if (error) throw error;
    return record as VoiceAgentRow;
  }

  async update(orgId: string, agentId: string, updates: VoiceAgentUpdate): Promise<VoiceAgentRow> {
    const supabase = await this.getClient();
    const { data: record, error } = await (supabase.from('voice_agents') as any)
      .update(updates)
      .eq('organization_id', orgId)
      .eq('id', agentId)
      .select()
      .single();

    if (error) throw error;
    return record as VoiceAgentRow;
  }

  async delete(orgId: string, agentId: string): Promise<void> {
    const supabase = await this.getClient();
    const { error } = await supabase
      .from('voice_agents')
      .delete()
      .eq('organization_id', orgId)
      .eq('id', agentId);

    if (error) throw error;
  }
}


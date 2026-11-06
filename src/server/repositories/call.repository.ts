import 'server-only';
import { BaseRepository } from './base.repository';
import type { Database } from '@/types/database.types';

type CallRow = Database['public']['Tables']['calls']['Row'];
type CallInsert = Database['public']['Tables']['calls']['Insert'];
type CallTranscriptInsert = Database['public']['Tables']['call_transcripts']['Insert'];

export class CallRepository extends BaseRepository {
  async listByOrg(
    orgId: string,
    params: { page: number; limit: number; status?: string; outcome?: string }
  ): Promise<{ items: CallRow[]; total: number }> {
    const supabase = await this.getClient();
    const offset = (params.page - 1) * params.limit;

    let query = supabase
      .from('calls')
      .select('*', { count: 'exact' })
      .eq('organization_id', orgId);

    if (params.status) {
      query = query.eq('status', params.status as any);
    }
    if (params.outcome) {
      query = query.eq('outcome', params.outcome as any);
    }

    const { data, count, error } = await query
      .order('started_at', { ascending: false })
      .range(offset, offset + params.limit - 1);

    if (error) throw error;

    return {
      items: data || [],
      total: count ?? 0,
    };
  }

  async findById(orgId: string, callId: string): Promise<(CallRow & { transcript?: any }) | null> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from('calls')
      .select('*, call_transcripts(*)')
      .eq('organization_id', orgId)
      .eq('id', callId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createCallWithTranscript(callData: CallInsert, transcriptData: Omit<CallTranscriptInsert, 'call_id'>): Promise<CallRow> {
    const supabase = await this.getClient();

    const { data: call, error: callError } = await supabase
      .from('calls')
      .insert(callData as any)
      .select()
      .single();

    if (callError || !call) throw callError || new Error('Failed to insert call record');
    const createdCall = call as CallRow;

    const { error: transcriptError } = await supabase
      .from('call_transcripts')
      .insert({
        ...transcriptData,
        call_id: createdCall.id,
      } as any);

    if (transcriptError) throw transcriptError;

    return createdCall;
  }
}


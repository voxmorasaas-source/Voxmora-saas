import 'server-only';
import { BaseRepository } from './base.repository';
import type { Database } from '@/types/database.types';

type AppointmentRow = Database['public']['Tables']['appointments']['Row'];
type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];

export class AppointmentRepository extends BaseRepository {
  async listByOrg(orgId: string, startDate?: string, endDate?: string): Promise<AppointmentRow[]> {
    const supabase = await this.getClient();
    let query = supabase
      .from('appointments')
      .select('*, customers(first_name, last_name, phone, email), services(name, duration_minutes, price_cents)')
      .eq('organization_id', orgId);

    if (startDate) {
      query = query.gte('start_time', startDate);
    }
    if (endDate) {
      query = query.lte('start_time', endDate);
    }

    const { data, error } = await query.order('start_time', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async create(data: AppointmentInsert): Promise<AppointmentRow> {
    const supabase = await this.getClient();
    const { data: record, error } = await supabase
      .from('appointments')
      .insert(data as any)
      .select()
      .single();

    if (error) throw error;
    return record as AppointmentRow;
  }

  async checkConflicts(orgId: string, startTime: string, endTime: string): Promise<boolean> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from('appointments')
      .select('id')
      .eq('organization_id', orgId)
      .neq('status', 'cancelled')
      .lt('start_time', endTime)
      .gt('end_time', startTime);

    if (error) throw error;
    return (data || []).length > 0;
  }
}


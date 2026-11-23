import 'server-only';
import { BaseRepository } from './base.repository';
import type { Database, AppointmentStatus } from '@/types/database.types';

export type AppointmentRow = Database['public']['Tables']['appointments']['Row'];
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
export type AppointmentUpdate = Database['public']['Tables']['appointments']['Update'];

export interface AppointmentFilterParams {
  startDate?: string;
  endDate?: string;
  staffId?: string;
  serviceId?: string;
  status?: string;
}

// In-memory fallback cache persisted across Next.js module reloads
const globalForDev = globalThis as unknown as {
  __devAppointmentsStore?: AppointmentRow[];
};

if (!globalForDev.__devAppointmentsStore) {
  globalForDev.__devAppointmentsStore = [];
}

const devAppointmentsStore = globalForDev.__devAppointmentsStore;

export class AppointmentRepository extends BaseRepository {
  /**
   * List appointments for an organization with optional date range and filters
   */
  async listByOrg(orgId: string, filters?: AppointmentFilterParams): Promise<AppointmentRow[]> {
    const supabase = await this.getClient();
    let query = supabase
      .from('appointments')
      .select('*');

    if (orgId && orgId !== '00000000-0000-0000-0000-000000000001') {
      query = query.eq('organization_id', orgId);
    }

    if (filters?.startDate) {
      query = query.gte('start_time', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('start_time', filters.endDate);
    }
    if (filters?.staffId && filters.staffId !== 'all') {
      query = query.eq('staff_id', filters.staffId);
    }
    if (filters?.serviceId && filters.serviceId !== 'all') {
      query = query.eq('service_id', filters.serviceId);
    }
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status as any);
    }

    const { data, error } = await query.order('start_time', { ascending: true });
    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('[AppointmentRepository] Table public.appointments does not exist in Supabase yet. Serving from local dev memory store.');
        let results = [...devAppointmentsStore];
        if (filters?.staffId && filters.staffId !== 'all') {
          results = results.filter((a) => a.staff_id === filters.staffId);
        }
        if (filters?.serviceId && filters.serviceId !== 'all') {
          results = results.filter((a) => a.service_id === filters.serviceId);
        }
        if (filters?.status && filters.status !== 'all') {
          results = results.filter((a) => a.status === filters.status);
        }
        return results;
      }
      console.error('[AppointmentRepository.listByOrg error]', error);
      throw error;
    }

    // Merge database records with any dev memory records if dev store has items
    const dbAppointments = (data || []) as AppointmentRow[];
    if (devAppointmentsStore.length > 0) {
      const dbIds = new Set(dbAppointments.map((a) => a.id));
      const extraDev = devAppointmentsStore.filter((a) => !dbIds.has(a.id));
      return [...dbAppointments, ...extraDev];
    }

    return dbAppointments;
  }

  /**
   * Find single appointment by ID within an organization
   */
  async findById(id: string, orgId?: string): Promise<AppointmentRow | null> {
    const supabase = await this.getClient();
    let query = supabase
      .from('appointments')
      .select('*')
      .eq('id', id);

    if (orgId && orgId !== '00000000-0000-0000-0000-000000000001') {
      query = query.eq('organization_id', orgId);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      if (error.code === 'PGRST205') {
        return devAppointmentsStore.find((a) => a.id === id) || null;
      }
      console.error('[AppointmentRepository.findById error]', error);
      throw error;
    }

    if (!data) {
      // Check fallback store
      return devAppointmentsStore.find((a) => a.id === id) || null;
    }

    return data as AppointmentRow | null;
  }

  /**
   * Insert a new appointment
   */
  async create(data: AppointmentInsert): Promise<AppointmentRow> {
    const supabase = await this.getClient();
    const { data: record, error } = await (supabase.from('appointments') as any)
      .insert(data)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST205') {
        console.warn('[AppointmentRepository.create] Table public.appointments does not exist in Supabase yet. Storing in local dev memory store.');
        const newRecord: AppointmentRow = {
          id: (data as any).id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `dev-${Date.now()}`),
          organization_id: data.organization_id,
          customer_id: data.customer_id || null,
          service_id: data.service_id || null,
          staff_id: data.staff_id || null,
          staff_name: data.staff_name || null,
          client_name: data.client_name || 'Client',
          client_phone: data.client_phone || null,
          client_email: data.client_email || null,
          service_name: data.service_name || 'Salon Service',
          price_cents: data.price_cents ?? 0,
          duration_minutes: data.duration_minutes ?? 30,
          booking_source: (data.booking_source as any) || 'manual',
          call_id: null,
          external_provider: data.external_provider || 'internal',
          external_booking_id: data.external_booking_id || null,
          start_time: data.start_time,
          end_time: data.end_time,
          status: (data.status as any) || 'confirmed',
          notes: data.notes || null,
          follow_up_status: data.follow_up_status || 'pending',
          bland_call_id: data.bland_call_id || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        devAppointmentsStore.unshift(newRecord);
        return newRecord;
      }
      console.error('[AppointmentRepository.create error]', error);
      throw error;
    }
    return record as AppointmentRow;
  }

  /**
   * Update an existing appointment
   */
  async update(id: string, orgId: string, data: AppointmentUpdate): Promise<AppointmentRow> {
    const supabase = await this.getClient();
    const updatePayload = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    let query = (supabase.from('appointments') as any)
      .update(updatePayload)
      .eq('id', id);

    if (orgId && orgId !== '00000000-0000-0000-0000-000000000001') {
      query = query.eq('organization_id', orgId);
    }

    const { data: record, error } = await query.select('*').maybeSingle();

    if (error || !record) {
      if (!error || error.code === 'PGRST205' || error.code === 'PGRST116') {
        const index = devAppointmentsStore.findIndex((a) => a.id === id);
        if (index !== -1) {
          devAppointmentsStore[index] = {
            ...devAppointmentsStore[index],
            ...updatePayload,
          } as AppointmentRow;
          return devAppointmentsStore[index];
        }
      }
      if (error) {
        console.error('[AppointmentRepository.update error]', error);
        throw error;
      }
      throw new Error('Appointment not found');
    }
    return record as AppointmentRow;
  }

  /**
   * Transition appointment status
   */
  async updateStatus(
    id: string,
    orgId: string,
    status: AppointmentStatus,
    notes?: string
  ): Promise<AppointmentRow> {
    const updatePayload: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (notes !== undefined) {
      updatePayload.notes = notes;
    }

    const supabase = await this.getClient();
    let query = (supabase.from('appointments') as any)
      .update(updatePayload)
      .eq('id', id);

    if (orgId && orgId !== '00000000-0000-0000-0000-000000000001') {
      query = query.eq('organization_id', orgId);
    }

    const { data: record, error } = await query.select('*').maybeSingle();

    if (error || !record) {
      if (!error || error.code === 'PGRST205' || error.code === 'PGRST116') {
        const index = devAppointmentsStore.findIndex((a) => a.id === id);
        if (index !== -1) {
          devAppointmentsStore[index] = {
            ...devAppointmentsStore[index],
            ...updatePayload,
          } as AppointmentRow;
          return devAppointmentsStore[index];
        }
      }
      if (error) {
        console.error('[AppointmentRepository.updateStatus error]', error);
        throw error;
      }
      throw new Error('Appointment not found');
    }
    return record as AppointmentRow;
  }

  /**
   * Cancel appointment with optional reason
   */
  async cancel(id: string, orgId: string, reason?: string): Promise<AppointmentRow> {
    const notesUpdate = reason ? `Cancelled: ${reason}` : undefined;
    return await this.updateStatus(id, orgId, 'cancelled', notesUpdate);
  }

  /**
   * Double-booking and conflict prevention:
   * Checks if a staff member already has an active overlapping appointment.
   * If staffId is not provided, checks general organization conflicts.
   * Allows different staff members to work simultaneously!
   */
  async checkStaffConflicts(
    orgId: string,
    startTime: string,
    endTime: string,
    staffId?: string | null,
    excludeAppointmentId?: string
  ): Promise<boolean> {
    const supabase = await this.getClient();
    let query = supabase
      .from('appointments')
      .select('id, staff_id, start_time, end_time')
      .neq('status', 'cancelled')
      .lt('start_time', endTime)
      .gt('end_time', startTime);

    if (orgId && orgId !== '00000000-0000-0000-0000-000000000001') {
      query = query.eq('organization_id', orgId);
    }
    if (staffId) {
      query = query.eq('staff_id', staffId);
    }
    if (excludeAppointmentId) {
      query = query.neq('id', excludeAppointmentId);
    }

    const { data, error } = await query;
    if (error) {
      if (error.code === 'PGRST205') {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        return devAppointmentsStore.some((appt) => {
          if (excludeAppointmentId && appt.id === excludeAppointmentId) return false;
          if (appt.status === 'cancelled') return false;
          if (staffId && appt.staff_id !== staffId) return false;
          const aStart = new Date(appt.start_time).getTime();
          const aEnd = new Date(appt.end_time).getTime();
          return start < aEnd && end > aStart;
        });
      }
      console.error('[AppointmentRepository.checkStaffConflicts error]', error);
      throw error;
    }
    return (data || []).length > 0;
  }

  /**
   * Compatibility method
   */
  async checkConflicts(orgId: string, startTime: string, endTime: string): Promise<boolean> {
    return this.checkStaffConflicts(orgId, startTime, endTime);
  }
}

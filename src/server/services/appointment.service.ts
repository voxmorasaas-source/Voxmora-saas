import 'server-only';
import { AppointmentRepository, AppointmentFilterParams } from '../repositories/appointment.repository';
import { BookingAdapterFactory } from '../adapters/booking/factory';
import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { CheckAvailabilityParams, CreateBookingParams } from '../adapters/booking/booking-adapter.interface';
import type { AppointmentStatus } from '@/types/database.types';
import { addMinutes, parseISO } from 'date-fns';

export class AppointmentService {
  constructor(private readonly repo = new AppointmentRepository()) {}

  /**
   * Helper to resolve the authenticated user's organization
   */
  async resolveOrgId(providedOrgId?: string): Promise<string> {
    if (providedOrgId) return providedOrgId;

    try {
      const supabase = await createServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: member } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (member && (member as any).organization_id) {
          return (member as any).organization_id;
        }
      }
    } catch (e) {
      console.warn('[AppointmentService] Session resolution warning:', e);
    }

    // Fallback to first organization in database or default ID for development
    try {
      const adminSupabase = createAdminClient();
      const { data: org } = await adminSupabase
        .from('organizations')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (org && (org as any).id) {
        return (org as any).id;
      }
    } catch (e) {
      console.warn('[AppointmentService] Admin org fallback warning:', e);
    }

    return '00000000-0000-0000-0000-000000000001';
  }

  private async getAdapterForOrg(orgId: string) {
    try {
      const supabase = await createServerClient();
      const { data: integration } = await supabase
        .from('integrations')
        .select('*')
        .eq('organization_id', orgId)
        .eq('is_active', true)
        .in('provider', ['internal', 'calcom', 'acuity'])
        .maybeSingle();

      return BookingAdapterFactory.getAdapter(integration);
    } catch {
      return BookingAdapterFactory.getAdapter(null);
    }
  }

  async getAvailableSlots(params: CheckAvailabilityParams) {
    const orgId = await this.resolveOrgId(params.organizationId);
    const adapter = await this.getAdapterForOrg(orgId);
    return await adapter.checkAvailability({ ...params, organizationId: orgId });
  }

  async bookAppointment(params: CreateBookingParams) {
    const orgId = await this.resolveOrgId(params.organizationId);
    const adapter = await this.getAdapterForOrg(orgId);
    return await adapter.createBooking({ ...params, organizationId: orgId });
  }

  async listAppointments(orgId?: string, filters?: AppointmentFilterParams) {
    const targetOrgId = await this.resolveOrgId(orgId);
    return await this.repo.listByOrg(targetOrgId, filters);
  }

  async getAppointmentById(id: string, orgId?: string) {
    const targetOrgId = await this.resolveOrgId(orgId);
    return await this.repo.findById(id, targetOrgId);
  }

  async updateAppointment(
    id: string,
    orgId: string,
    params: {
      startTime?: string;
      endTime?: string;
      durationMinutes?: number;
      staffId?: string | null;
      staffName?: string | null;
      serviceId?: string | null;
      serviceName?: string | null;
      priceCents?: number;
      customerName?: string;
      customerPhone?: string;
      customerEmail?: string | null;
      notes?: string | null;
      status?: AppointmentStatus;
    }
  ) {
    const targetOrgId = await this.resolveOrgId(orgId);
    const existing = await this.repo.findById(id, targetOrgId);

    if (!existing) {
      throw new Error('Appointment not found');
    }

    const newStart = params.startTime || existing.start_time;
    let newEnd = params.endTime || existing.end_time;
    const newStaffId = params.staffId !== undefined ? params.staffId : existing.staff_id;

    // Recalculate end time if duration changed or start time changed without explicit end time
    if (params.startTime && !params.endTime) {
      const dur = params.durationMinutes || existing.duration_minutes || 30;
      newEnd = addMinutes(parseISO(newStart), dur).toISOString();
    }

    // Only revalidate conflict if start time, end time, or staff has actually changed
    const timeOrStaffChanged =
      (params.startTime && params.startTime !== existing.start_time) ||
      (params.endTime && params.endTime !== existing.end_time) ||
      (params.staffId !== undefined && params.staffId !== existing.staff_id);

    if (timeOrStaffChanged) {
      const hasConflict = await this.repo.checkStaffConflicts(
        existing.organization_id || targetOrgId,
        newStart,
        newEnd,
        newStaffId,
        id
      );

      if (hasConflict) {
        throw new Error(
          params.staffName || existing.staff_name
            ? `${params.staffName || existing.staff_name} already has an appointment during this time.`
            : 'This time slot is already booked for the selected staff member.'
        );
      }
    }

    return await this.repo.update(id, existing.organization_id || targetOrgId, {
      start_time: newStart,
      end_time: newEnd,
      staff_id: newStaffId,
      staff_name: params.staffName !== undefined ? params.staffName : existing.staff_name,
      service_id: params.serviceId !== undefined ? params.serviceId : existing.service_id,
      service_name: params.serviceName !== undefined ? params.serviceName : existing.service_name,
      client_name: params.customerName !== undefined ? params.customerName : existing.client_name,
      client_phone: params.customerPhone !== undefined ? params.customerPhone : existing.client_phone,
      client_email: params.customerEmail !== undefined ? params.customerEmail : existing.client_email,
      price_cents: params.priceCents !== undefined ? params.priceCents : existing.price_cents,
      duration_minutes: params.durationMinutes !== undefined ? params.durationMinutes : existing.duration_minutes,
      notes: params.notes !== undefined ? params.notes : existing.notes,
      status: params.status !== undefined ? params.status : existing.status,
    });
  }

  async rescheduleAppointmentByPhone(params: {
    customerPhone: string;
    newStartTime: string;
    newEndTime?: string;
    customerName?: string;
    notes?: string;
  }) {
    const existing = await this.repo.findLatestByPhone(params.customerPhone, params.customerName);
    if (!existing) {
      throw new Error(`No active appointment found for phone number ${params.customerPhone}`);
    }

    const startIso = parseISO(params.newStartTime).toISOString();
    const duration = existing.duration_minutes || 30;
    const endIso = params.newEndTime
      ? parseISO(params.newEndTime).toISOString()
      : addMinutes(parseISO(startIso), duration).toISOString();

    return await this.updateAppointment(existing.id, existing.organization_id, {
      startTime: startIso,
      endTime: endIso,
      status: 'confirmed',
      notes: params.notes || `Rescheduled via Mira AI Voice Assistant (Previously: ${existing.start_time})`,
    });
  }

  async updateStatus(id: string, orgId: string, status: AppointmentStatus, notes?: string) {
    const targetOrgId = await this.resolveOrgId(orgId);
    const existing = await this.repo.findById(id, targetOrgId);
    const effectiveOrgId = existing?.organization_id || targetOrgId;
    return await this.repo.updateStatus(id, effectiveOrgId, status, notes);
  }

  async cancelAppointment(id: string, orgId: string, reason?: string) {
    const targetOrgId = await this.resolveOrgId(orgId);
    const existing = await this.repo.findById(id, targetOrgId);
    const effectiveOrgId = existing?.organization_id || targetOrgId;
    return await this.repo.cancel(id, effectiveOrgId, reason);
  }

  /**
   * Part 8: Process automated no-show follow-up calls
   * Identifies appointments 15+ minutes past start time without check-in
   */
  async processAutomatedFollowUps(orgId?: string) {
    const targetOrgId = await this.resolveOrgId(orgId);
    const supabase = await createServerClient();
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const twoHoursAgo = new Date(Date.now() - 120 * 60 * 1000).toISOString();

    // Query eligible appointments: past start time, not checked in / completed / cancelled, follow_up_status = 'pending'
    const { data: eligibleAppointments, error } = await supabase
      .from('appointments')
      .select('id, client_name, client_phone, service_name, start_time, staff_name')
      .eq('organization_id', targetOrgId)
      .eq('status', 'confirmed')
      .eq('follow_up_status', 'pending')
      .lte('start_time', fifteenMinutesAgo)
      .gte('start_time', twoHoursAgo);

    if (error || !eligibleAppointments || eligibleAppointments.length === 0) {
      return { processed: 0, appointments: [] };
    }

    const processedList: string[] = [];

    for (const appt of eligibleAppointments) {
      const item = appt as any;
      try {
        // Mark as calling to prevent duplicate call triggers
        await this.repo.update(item.id, targetOrgId, {
          follow_up_status: 'calling',
        });

        // Trigger Bland AI outbound call if API key configured
        const blandApiKey = process.env.BLAND_API_KEY;
        if (blandApiKey && item.client_phone) {
          const callRes = await fetch('https://api.bland.ai/v1/calls', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              authorization: blandApiKey,
            },
            body: JSON.stringify({
              phone_number: item.client_phone,
              task: `Hi ${item.client_name}, this is Mira from Sereva. We noticed you had a ${item.service_name} scheduled for ${item.start_time} with ${item.staff_name || 'our specialist'}. We wanted to check if you are on your way or if you would like to reschedule?`,
              voice: 'maya',
              model: 'enhanced',
              record: true,
              metadata: {
                appointment_id: item.id,
                organization_id: targetOrgId,
                type: 'no_show_follow_up',
              },
            }),
          });

          if (callRes.ok) {
            const callData = await callRes.json();
            if (callData?.call_id) {
              await this.repo.update(item.id, targetOrgId, {
                bland_call_id: callData.call_id,
                follow_up_status: 'calling',
              });
            }
          }
        }

        processedList.push(item.id);
      } catch (err) {
        console.error(`[FollowUp] Error processing appointment ${item.id}:`, err);
      }
    }

    return { processed: processedList.length, appointmentIds: processedList };
  }
}

import 'server-only';
import {
  IBookingProviderAdapter,
  CheckAvailabilityParams,
  TimeSlot,
  CreateBookingParams,
  BookingResult,
} from './booking-adapter.interface';
import { createServerClient } from '@/lib/supabase/server';
import { AppointmentRepository } from '@/server/repositories/appointment.repository';
import { parseISO, addMinutes, format, setHours, setMinutes } from 'date-fns';

export class InternalBookingAdapter implements IBookingProviderAdapter {
  private readonly appointmentRepo = new AppointmentRepository();

  async checkAvailability(params: CheckAvailabilityParams): Promise<TimeSlot[]> {
    const supabase = await createServerClient();

    // 1. Get service duration if serviceId provided
    let duration = 30;
    if (params.serviceId) {
      const { data: service } = await supabase
        .from('services')
        .select('duration_minutes')
        .eq('organization_id', params.organizationId)
        .eq('id', params.serviceId)
        .maybeSingle();

      if (service && (service as any).duration_minutes) {
        duration = (service as any).duration_minutes;
      }
    }

    // 2. Generate standard business hour slots: 9:00 AM - 5:00 PM (17:00)
    const slots: TimeSlot[] = [];
    const baseDate = parseISO(params.date);

    for (let hour = 9; hour < 17; hour++) {
      for (let min = 0; min < 60; min += duration) {
        const slotStart = setMinutes(setHours(baseDate, hour), min);
        const slotEnd = addMinutes(slotStart, duration);

        // Don't exceed business closing at 17:00
        if (slotEnd.getHours() > 17 || (slotEnd.getHours() === 17 && slotEnd.getMinutes() > 0)) {
          continue;
        }

        const startIso = slotStart.toISOString();
        const endIso = slotEnd.toISOString();

        // 3. Double-booking check for specific staff member or general availability
        const hasConflict = await this.appointmentRepo.checkStaffConflicts(
          params.organizationId,
          startIso,
          endIso,
          params.staffId
        );

        if (!hasConflict) {
          slots.push({
            startTime: startIso,
            endTime: endIso,
            formattedTime: format(slotStart, 'hh:mm a'),
            available: true,
            staffId: params.staffId,
          });
        }
      }
    }

    return slots;
  }

  async createBooking(params: CreateBookingParams): Promise<BookingResult> {
    const supabase = await createServerClient();

    // 1. Find or create customer in CRM (optional link)
    let customerId: string | null = null;
    try {
      if (params.customerPhone) {
        const { data: existingCustomer, error: searchError } = await supabase
          .from('customers')
          .select('id')
          .eq('organization_id', params.organizationId)
          .eq('phone', params.customerPhone)
          .maybeSingle();

        if (!searchError && existingCustomer) {
          customerId = (existingCustomer as { id: string }).id;
        } else if (!searchError) {
          const nameParts = params.customerName.trim().split(' ');
          const firstName = nameParts[0] || 'Client';
          const lastName = nameParts.slice(1).join(' ') || '';

          const { data: newCustomer, error: custError } = await (supabase.from('customers') as any)
            .insert({
              organization_id: params.organizationId,
              phone: params.customerPhone,
              first_name: firstName,
              last_name: lastName,
              email: params.customerEmail || null,
            })
            .select('id')
            .maybeSingle();

          if (!custError && newCustomer) {
            customerId = (newCustomer as { id: string }).id;
          }
        }
      }
    } catch (e) {
      console.warn('[InternalBookingAdapter] Could not link customer in CRM (table may not exist yet):', e);
    }

    // 2. Determine service details (duration & price)
    let duration = params.durationMinutes || 30;
    let priceCents = params.priceCents || 0;
    let serviceName = params.serviceName || 'Custom Service';

    if (params.serviceId) {
      try {
        const { data: service, error: srvError } = await supabase
          .from('services')
          .select('name, duration_minutes, price_cents')
          .eq('organization_id', params.organizationId)
          .eq('id', params.serviceId)
          .maybeSingle();

        if (!srvError && service) {
          const s = service as any;
          if (s.name) serviceName = s.name;
          if (s.duration_minutes) duration = s.duration_minutes;
          if (s.price_cents !== undefined && s.price_cents !== null && !params.priceCents) {
            priceCents = s.price_cents;
          }
        }
      } catch (e) {
        console.warn('[InternalBookingAdapter] Could not query services table:', e);
      }
    }

    const start = parseISO(params.startTime);
    const end = params.endTime ? parseISO(params.endTime) : addMinutes(start, duration);
    const startIso = start.toISOString();
    const endIso = end.toISOString();

    // 3. Strict Concurrency Check: prevent double booking the same staff member
    const hasConflict = await this.appointmentRepo.checkStaffConflicts(
      params.organizationId,
      startIso,
      endIso,
      params.staffId
    );

    if (hasConflict) {
      throw new Error(
        params.staffName
          ? `${params.staffName} is already booked during this time slot. Please choose another time or staff member.`
          : 'This time slot is already booked. Please choose another time.'
      );
    }

    // 4. Create appointment
    const appointment = await this.appointmentRepo.create({
      organization_id: params.organizationId,
      customer_id: customerId,
      service_id: params.serviceId || null,
      service_name: serviceName,
      staff_id: params.staffId || null,
      staff_name: params.staffName || null,
      client_name: params.customerName,
      client_phone: params.customerPhone,
      client_email: params.customerEmail || null,
      price_cents: priceCents,
      duration_minutes: duration,
      booking_source: params.bookingSource || 'manual',
      external_provider: 'internal',
      start_time: startIso,
      end_time: endIso,
      status: 'confirmed',
      notes: params.notes || null,
      follow_up_status: 'pending',
    });

    return {
      bookingId: appointment.id,
      status: 'confirmed',
      startTime: appointment.start_time,
      endTime: appointment.end_time,
      appointment,
    };
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<boolean> {
    const supabase = await createServerClient();
    const updatePayload: { status: 'cancelled'; notes?: string; updated_at: string } = {
      status: 'cancelled',
      updated_at: new Date().toISOString(),
      ...(reason && { notes: `Cancelled: ${reason}` }),
    };

    const { error } = await (supabase.from('appointments') as any)
      .update(updatePayload)
      .eq('id', bookingId);

    return !error;
  }
}

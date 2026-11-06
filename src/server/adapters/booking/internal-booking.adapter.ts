import 'server-only';
import { IBookingProviderAdapter, CheckAvailabilityParams, TimeSlot, CreateBookingParams, BookingResult } from './booking-adapter.interface';
import { createServerClient } from '@/lib/supabase/server';
import { AppointmentRepository } from '@/server/repositories/appointment.repository';
import { parseISO, addMinutes, format, setHours, setMinutes } from 'date-fns';

export class InternalBookingAdapter implements IBookingProviderAdapter {
  private readonly appointmentRepo = new AppointmentRepository();

  async checkAvailability(params: CheckAvailabilityParams): Promise<TimeSlot[]> {
    const supabase = await createServerClient();

    // 1. Get service duration
    const { data: service } = await supabase
      .from('services')
      .select('duration_minutes')
      .eq('organization_id', params.organizationId)
      .eq('id', params.serviceId)
      .single();

    const duration = service ? (service as { duration_minutes: number }).duration_minutes : 30;

    // 2. Generate standard 9:00 AM - 5:00 PM candidate slots
    const slots: TimeSlot[] = [];
    const baseDate = parseISO(params.date);

    for (let hour = 9; hour < 17; hour++) {
      for (let min = 0; min < 60; min += duration) {
        const slotStart = setMinutes(setHours(baseDate, hour), min);
        const slotEnd = addMinutes(slotStart, duration);

        const startIso = slotStart.toISOString();
        const endIso = slotEnd.toISOString();

        // 3. Check database conflict
        const hasConflict = await this.appointmentRepo.checkConflicts(
          params.organizationId,
          startIso,
          endIso
        );

        if (!hasConflict) {
          slots.push({
            startTime: startIso,
            endTime: endIso,
            formattedTime: format(slotStart, 'hh:mm a'),
            available: true,
          });
        }
      }
    }

    return slots;
  }

  async createBooking(params: CreateBookingParams): Promise<BookingResult> {
    const supabase = await createServerClient();

    // Find or create customer
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('organization_id', params.organizationId)
      .eq('phone', params.customerPhone)
      .maybeSingle();

    let customerId: string;

    if (!existingCustomer) {
      const nameParts = params.customerName.split(' ');
      const firstName = nameParts[0] || 'Unknown';
      const lastName = nameParts.slice(1).join(' ') || '';

      const { data: newCustomer, error: custError } = await supabase
        .from('customers')
        .insert({
          organization_id: params.organizationId,
          phone: params.customerPhone,
          first_name: firstName,
          last_name: lastName,
          email: params.customerEmail || null,
        } as any)
        .select('id')
        .single();

      if (custError || !newCustomer) {
        throw new Error(custError?.message || 'Failed to create customer record');
      }
      customerId = (newCustomer as { id: string }).id;
    } else {
      customerId = (existingCustomer as { id: string }).id;
    }

    // Determine end time from service
    const { data: service } = await supabase
      .from('services')
      .select('duration_minutes')
      .eq('organization_id', params.organizationId)
      .eq('id', params.serviceId)
      .single();

    const duration = service ? (service as { duration_minutes: number }).duration_minutes : 30;
    const start = parseISO(params.startTime);
    const end = addMinutes(start, duration);

    const appointment = await this.appointmentRepo.create({
      organization_id: params.organizationId,
      customer_id: customerId,
      service_id: params.serviceId,
      external_provider: 'internal',
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      status: 'confirmed',
      notes: params.notes || null,
    });

    return {
      bookingId: appointment.id,
      status: 'confirmed',
      startTime: appointment.start_time,
      endTime: appointment.end_time,
    };
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<boolean> {
    const supabase = await createServerClient();
    const updatePayload: { status: 'cancelled'; notes?: string } = {
      status: 'cancelled',
      ...(reason && { notes: `Cancelled: ${reason}` }),
    };

    const { error } = await (supabase.from('appointments') as any)
      .update(updatePayload)
      .eq('id', bookingId);

    return !error;
  }
}

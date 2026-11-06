import 'server-only';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { BookingAdapterFactory } from '../adapters/booking/factory';
import { createServerClient } from '@/lib/supabase/server';
import type { CheckAvailabilityParams, CreateBookingParams } from '../adapters/booking/booking-adapter.interface';

export class AppointmentService {
  constructor(private readonly repo = new AppointmentRepository()) {}

  private async getAdapterForOrg(orgId: string) {
    const supabase = await createServerClient();
    const { data: integration } = await supabase
      .from('integrations')
      .select('*')
      .eq('organization_id', orgId)
      .eq('is_active', true)
      .in('provider', ['internal', 'calcom', 'acuity'])
      .maybeSingle();

    return BookingAdapterFactory.getAdapter(integration);
  }

  async getAvailableSlots(params: CheckAvailabilityParams) {
    const adapter = await this.getAdapterForOrg(params.organizationId);
    return await adapter.checkAvailability(params);
  }

  async bookAppointment(params: CreateBookingParams) {
    const adapter = await this.getAdapterForOrg(params.organizationId);
    return await adapter.createBooking(params);
  }

  async listAppointments(orgId: string, startDate?: string, endDate?: string) {
    return await this.repo.listByOrg(orgId, startDate, endDate);
  }
}


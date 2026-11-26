import { NextRequest, NextResponse } from 'next/server';
import { AppointmentService } from '@/server/services/appointment.service';
import { checkAvailabilitySchema } from '@/schemas/appointment.schema';
import { DEFAULT_APP_TIMEZONE } from '@/lib/timezone';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const serviceId = searchParams.get('serviceId') || undefined;
    const staffId = searchParams.get('staffId') || undefined;
    const timezone = searchParams.get('timezone') || DEFAULT_APP_TIMEZONE;
    const organizationId = searchParams.get('organizationId') || undefined;

    const validated = checkAvailabilitySchema.parse({
      date,
      serviceId,
      staffId,
      timezone,
      organizationId,
    });

    const appointmentService = new AppointmentService();
    const slots = await appointmentService.getAvailableSlots({
      organizationId: validated.organizationId || '',
      serviceId: validated.serviceId,
      staffId: validated.staffId,
      date: validated.date,
      timezone: validated.timezone,
    });

    return NextResponse.json({
      success: true,
      date: validated.date,
      timezone: validated.timezone,
      slots,
      count: slots.length,
    });
  } catch (error: any) {
    console.error('[API /api/availability GET]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to check availability' },
      { status: 400 }
    );
  }
}


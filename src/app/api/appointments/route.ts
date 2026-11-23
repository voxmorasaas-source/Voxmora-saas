import { NextRequest, NextResponse } from 'next/server';
import { AppointmentService } from '@/server/services/appointment.service';
import { createAppointmentSchema } from '@/schemas/appointment.schema';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const staffId = searchParams.get('staffId') || undefined;
    const serviceId = searchParams.get('serviceId') || undefined;
    const status = searchParams.get('status') || undefined;

    const appointmentService = new AppointmentService();
    const appointments = await appointmentService.listAppointments(undefined, {
      startDate,
      endDate,
      staffId,
      serviceId,
      status,
    });

    return NextResponse.json(
      {
        success: true,
        data: appointments,
        count: appointments.length,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('[API /api/appointments GET]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const validated = createAppointmentSchema.parse(json);

    const appointmentService = new AppointmentService();
    const result = await appointmentService.bookAppointment({
      organizationId: validated.organizationId || '',
      serviceId: validated.serviceId,
      serviceName: validated.serviceName,
      staffId: validated.staffId,
      staffName: validated.staffName,
      startTime: validated.startTime,
      endTime: validated.endTime,
      durationMinutes: validated.durationMinutes,
      priceCents: validated.priceCents,
      customerName: validated.customerName,
      customerPhone: validated.customerPhone,
      customerEmail: validated.customerEmail || undefined,
      notes: validated.notes || undefined,
      bookingSource: validated.bookingSource,
    });

    const createdAppointment = (result as any).appointment || {
      id: result.bookingId,
      status: result.status,
      start_time: result.startTime,
      end_time: result.endTime,
      client_name: validated.customerName,
      client_phone: validated.customerPhone,
      client_email: validated.customerEmail,
      service_name: validated.serviceName,
      service_id: validated.serviceId,
      staff_name: validated.staffName,
      staff_id: validated.staffId,
      price_cents: validated.priceCents,
      duration_minutes: validated.durationMinutes,
      booking_source: validated.bookingSource,
      notes: validated.notes,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment successfully booked',
        data: createdAppointment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API /api/appointments POST]', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to create appointment',
      },
      { status: 400 }
    );
  }
}


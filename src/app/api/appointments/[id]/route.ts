import { NextRequest, NextResponse } from 'next/server';
import { AppointmentService } from '@/server/services/appointment.service';
import { updateAppointmentSchema } from '@/schemas/appointment.schema';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const appointmentService = new AppointmentService();
    const appointment = await appointmentService.getAppointmentById(id);

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: appointment,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('[API /api/appointments/[id] GET]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const json = await request.json();
    const validated = updateAppointmentSchema.parse(json);

    const appointmentService = new AppointmentService();
    const updated = await appointmentService.updateAppointment(id, '', {
      startTime: validated.startTime,
      endTime: validated.endTime,
      durationMinutes: validated.durationMinutes,
      staffId: validated.staffId,
      staffName: validated.staffName,
      serviceId: validated.serviceId,
      serviceName: validated.serviceName,
      priceCents: validated.priceCents,
      customerName: validated.customerName || validated.clientName,
      customerPhone: validated.customerPhone || validated.clientPhone,
      customerEmail: validated.customerEmail || validated.clientEmail,
      notes: validated.notes,
      status: validated.status,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Appointment updated successfully',
        data: updated,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('[API /api/appointments/[id] PUT]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update appointment' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const reason = searchParams.get('reason') || 'Cancelled by staff';

    const appointmentService = new AppointmentService();
    const cancelled = await appointmentService.cancelAppointment(id, '', reason);

    return NextResponse.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: cancelled,
    });
  } catch (error: any) {
    console.error('[API /api/appointments/[id] DELETE]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to cancel appointment' },
      { status: 400 }
    );
  }
}


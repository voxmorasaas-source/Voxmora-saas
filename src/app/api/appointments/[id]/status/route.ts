import { NextRequest, NextResponse } from 'next/server';
import { AppointmentService } from '@/server/services/appointment.service';
import { updateAppointmentStatusSchema } from '@/schemas/appointment.schema';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const json = await request.json();
    const validated = updateAppointmentStatusSchema.parse(json);

    const appointmentService = new AppointmentService();
    const updated = await appointmentService.updateStatus(id, '', validated.status, validated.notes);

    return NextResponse.json({
      success: true,
      message: `Status updated to ${validated.status}`,
      data: updated,
    });
  } catch (error: any) {
    console.error('[API /api/appointments/[id]/status PATCH]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update appointment status' },
      { status: 400 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { AppointmentService } from '@/server/services/appointment.service';
import { aiRescheduleAppointmentSchema } from '@/schemas/appointment.schema';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. Optional API key authorization for AI agent webhook calls
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.BLAND_WEBHOOK_SECRET || process.env.BLAND_API_KEY;

    if (expectedSecret && authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '');
      if (token !== expectedSecret && authHeader !== expectedSecret) {
        return NextResponse.json({ success: false, error: 'Unauthorized AI webhook' }, { status: 401 });
      }
    }

    const json = await request.json();
    const validated = aiRescheduleAppointmentSchema.parse(json);

    const appointmentService = new AppointmentService();
    const updated = await appointmentService.rescheduleAppointmentByPhone({
      customerPhone: validated.customerPhone,
      newStartTime: validated.newStartTime,
      newEndTime: validated.newEndTime,
      customerName: validated.customerName,
      notes: validated.notes,
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment successfully rescheduled via Mira AI',
      booking: updated,
      confirmationText: `Your appointment for ${updated.service_name} has been successfully moved to ${updated.start_time}.`,
    });
  } catch (error: any) {
    console.error('[API /api/ai/appointments/reschedule POST]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to reschedule appointment' },
      { status: 400 }
    );
  }
}

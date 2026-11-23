import { NextRequest, NextResponse } from 'next/server';
import { AppointmentService } from '@/server/services/appointment.service';
import { createAppointmentSchema } from '@/schemas/appointment.schema';

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
    const validated = createAppointmentSchema.parse({
      ...json,
      bookingSource: 'ai',
      status: 'confirmed',
    });

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
      notes: validated.notes || 'Booked via Mira AI Voice Assistant',
      bookingSource: 'ai',
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment successfully booked via Mira AI',
      booking: result,
      confirmationText: `Your appointment for ${validated.serviceName} is confirmed for ${validated.startTime}.`,
    });
  } catch (error: any) {
    console.error('[API /api/ai/appointments POST]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process AI booking' },
      { status: 400 }
    );
  }
}


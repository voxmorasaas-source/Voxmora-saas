import { NextRequest, NextResponse } from 'next/server';
import { AppointmentService } from '@/server/services/appointment.service';
import { z } from 'zod';

const availabilityQuerySchema = z.object({
  organizationId: z.string().uuid(),
  serviceId: z.string().uuid(),
  date: z.string(), // YYYY-MM-DD
  timezone: z.string().default('America/New_York'),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const params = availabilityQuerySchema.parse(json);

    const appointmentService = new AppointmentService();
    const slots = await appointmentService.getAvailableSlots(params);

    return NextResponse.json({
      success: true,
      available_slots: slots.slice(0, 3).map((slot) => slot.formattedTime),
      message:
        slots.length > 0
          ? `I have openings on ${params.date} at ${slots.slice(0, 3).map((s) => s.formattedTime).join(', ')}.`
          : 'I apologize, we are fully booked on that date. Would you like to check another day?',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch appointment availability',
      },
      { status: 400 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { AppointmentService } from '@/server/services/appointment.service';

export async function POST(request: NextRequest) {
  try {
    const appointmentService = new AppointmentService();
    const result = await appointmentService.processAutomatedFollowUps();

    return NextResponse.json({
      success: true,
      message: `Processed ${result.processed} appointments for no-show follow-up check`,
      data: result,
    });
  } catch (error: any) {
    console.error('[API /api/appointments/follow-ups/process POST]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process follow-ups' },
      { status: 500 }
    );
  }
}


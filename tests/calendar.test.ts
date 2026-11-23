// @ts-ignore
import { describe, expect, it } from 'bun:test';
import {
  checkAvailabilitySchema,
  createAppointmentSchema,
  updateAppointmentSchema,
  updateAppointmentStatusSchema,
  rescheduleAppointmentSchema,
} from '../src/schemas/appointment.schema';
import { addMinutes, parseISO, setHours, setMinutes, isBefore, isAfter } from 'date-fns';

describe('Calendar and Booking Validation Schemas', () => {
  it('validates appointment creation with required fields', () => {
    const validData = {
      clientName: 'Emma Wilson',
      clientEmail: 'emma@example.com',
      clientPhone: '+1 (415) 555-0142',
      serviceName: 'Signature Facial',
      staffId: '1',
      staffName: 'Sophie Carter',
      startTime: '2026-11-20T10:00:00.000Z',
      endTime: '2026-11-20T11:00:00.000Z',
      durationMinutes: 60,
      priceCents: 9500,
      bookingSource: 'manual',
    };

    const parsed = createAppointmentSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid appointment without client name', () => {
    const invalidData = {
      startTime: '2026-11-20T10:00:00.000Z',
      endTime: '2026-11-20T11:00:00.000Z',
    };

    const parsed = createAppointmentSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it('validates Bland AI appointment payload with bookingSource = ai', () => {
    const aiBooking = {
      clientName: 'Olivia Brown',
      clientPhone: '+1 (415) 555-0189',
      serviceName: 'Deep Tissue Massage',
      staffId: '2',
      staffName: 'Mia Chen',
      startTime: '2026-11-20T14:00:00.000Z',
      endTime: '2026-11-20T15:00:00.000Z',
      durationMinutes: 60,
      priceCents: 12000,
      bookingSource: 'ai',
      blandCallId: 'bland-call-abc-123',
    };

    const parsed = createAppointmentSchema.safeParse(aiBooking);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.bookingSource).toBe('ai');
      expect(parsed.data.blandCallId).toBe('bland-call-abc-123');
    }
  });

  it('validates supported appointment statuses', () => {
    const allowedStatuses = [
      'pending',
      'confirmed',
      'checked_in',
      'in_progress',
      'rescheduled',
      'completed',
      'cancelled',
      'no_show',
    ];

    for (const status of allowedStatuses) {
      const parsed = updateAppointmentStatusSchema.safeParse({ status });
      expect(parsed.success).toBe(true);
    }

    const invalid = updateAppointmentStatusSchema.safeParse({ status: 'unknown_status' });
    expect(invalid.success).toBe(false);
  });

  it('validates updating appointment notes and details', () => {
    const updateData = {
      notes: 'Customer requested gentle lavender oil and has sensitive skin',
      durationMinutes: 75,
      staffId: '2',
      staffName: 'Mia Chen',
      startTime: '2026-11-20T11:00:00.000Z',
      endTime: '2026-11-20T12:15:00.000Z',
    };

    const parsed = updateAppointmentSchema.safeParse(updateData);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.notes).toBe('Customer requested gentle lavender oil and has sensitive skin');
      expect(parsed.data.durationMinutes).toBe(75);
    }
  });

  it('validates updating appointment with empty or nullable notes', () => {
    const emptyNotes = updateAppointmentSchema.safeParse({ notes: '' });
    expect(emptyNotes.success).toBe(true);

    const nullNotes = updateAppointmentSchema.safeParse({ notes: null });
    expect(nullNotes.success).toBe(true);
  });
});

describe('Staff Double-Booking Conflict Prevention Logic', () => {
  interface MockAppointment {
    id: string;
    staffId: string;
    startTime: string;
    endTime: string;
    status: string;
  }

  const existingAppointments: MockAppointment[] = [
    {
      id: 'appt-1',
      staffId: 'staff-sophie',
      startTime: '2026-11-20T10:00:00.000Z',
      endTime: '2026-11-20T11:00:00.000Z',
      status: 'confirmed',
    },
    {
      id: 'appt-2',
      staffId: 'staff-mia',
      startTime: '2026-11-20T10:00:00.000Z',
      endTime: '2026-11-20T11:00:00.000Z',
      status: 'confirmed',
    },
  ];

  function checkConflict(
    proposedStaffId: string,
    proposedStart: string,
    proposedEnd: string,
    excludeApptId?: string
  ): boolean {
    const start = new Date(proposedStart).getTime();
    const end = new Date(proposedEnd).getTime();

    return existingAppointments.some((appt) => {
      if (excludeApptId && appt.id === excludeApptId) return false;
      if (appt.status === 'cancelled') return false;
      if (appt.staffId !== proposedStaffId) return false;

      const apptStart = new Date(appt.startTime).getTime();
      const apptEnd = new Date(appt.endTime).getTime();

      // Overlap condition: start < apptEnd && end > apptStart
      return start < apptEnd && end > apptStart;
    });
  }

  it('detects and rejects overlapping appointment for the SAME staff member', () => {
    // Sophie Carter already has 10:00 - 11:00.
    // Overlapping proposed: 10:30 - 11:30
    const conflict = checkConflict('staff-sophie', '2026-11-20T10:30:00.000Z', '2026-11-20T11:30:00.000Z');
    expect(conflict).toBe(true);
  });

  it('allows concurrent booking for a DIFFERENT staff member at the same time', () => {
    // Chloe Williams does not have an appointment at 10:00 - 11:00
    const conflict = checkConflict('staff-chloe', '2026-11-20T10:00:00.000Z', '2026-11-20T11:00:00.000Z');
    expect(conflict).toBe(false);
  });

  it('allows adjacent non-overlapping appointment for the same staff member', () => {
    // Sophie has 10:00 - 11:00. Adjacent: 11:00 - 12:00
    const conflict = checkConflict('staff-sophie', '2026-11-20T11:00:00.000Z', '2026-11-20T12:00:00.000Z');
    expect(conflict).toBe(false);
  });

  it('ignores cancelled appointments when checking conflicts', () => {
    const cancelledAppt: MockAppointment = {
      id: 'appt-cancelled',
      staffId: 'staff-sophie',
      startTime: '2026-11-20T13:00:00.000Z',
      endTime: '2026-11-20T14:00:00.000Z',
      status: 'cancelled',
    };
    existingAppointments.push(cancelledAppt);

    const conflict = checkConflict('staff-sophie', '2026-11-20T13:00:00.000Z', '2026-11-20T14:00:00.000Z');
    expect(conflict).toBe(false);
  });
});

describe('Availability Slot Calculation Algorithm', () => {
  it('generates slots between 9am and 5pm with configured duration', () => {
    const duration = 60; // 60 min
    const baseDate = parseISO('2026-11-20');
    const slots: { start: string; end: string }[] = [];

    for (let hour = 9; hour < 17; hour++) {
      for (let min = 0; min < 60; min += duration) {
        const slotStart = setMinutes(setHours(baseDate, hour), min);
        const slotEnd = addMinutes(slotStart, duration);

        if (slotEnd.getHours() > 17 || (slotEnd.getHours() === 17 && slotEnd.getMinutes() > 0)) {
          continue;
        }

        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
        });
      }
    }

    // 9:00 to 17:00 with 60-minute slots yields exactly 8 slots
    expect(slots.length).toBe(8);
    expect(new Date(slots[0].start).getHours()).toBe(9);
    expect(new Date(slots[slots.length - 1].end).getHours()).toBe(17);
  });
});

describe('Automated Follow-up Overdue Detection Logic', () => {
  it('identifies appointments 15+ minutes past start time without check-in', () => {
    const currentTime = new Date('2026-11-20T10:30:00.000Z'); // 10:30 AM
    const fifteenMinutesAgo = new Date(currentTime.getTime() - 15 * 60 * 1000); // 10:15 AM

    const appointments = [
      {
        id: '1',
        clientName: 'Emma',
        startTime: '2026-11-20T10:00:00.000Z', // 30 min ago -> OVERDUE (needs follow-up)
        status: 'confirmed',
        followUpStatus: null,
      },
      {
        id: '2',
        clientName: 'Olivia',
        startTime: '2026-11-20T10:20:00.000Z', // 10 min ago -> NOT overdue yet (under 15 min)
        status: 'confirmed',
        followUpStatus: null,
      },
      {
        id: '3',
        clientName: 'Ava',
        startTime: '2026-11-20T10:00:00.000Z', // 30 min ago, but already checked in
        status: 'checked_in',
        followUpStatus: null,
      },
      {
        id: '4',
        clientName: 'Mia',
        startTime: '2026-11-20T09:00:00.000Z', // Already called
        status: 'confirmed',
        followUpStatus: 'called',
      },
    ];

    const needsFollowUp = appointments.filter((a) => {
      const apptStart = new Date(a.startTime);
      return (
        apptStart <= fifteenMinutesAgo &&
        a.status === 'confirmed' &&
        !a.followUpStatus
      );
    });

    expect(needsFollowUp.length).toBe(1);
    expect(needsFollowUp[0].clientName).toBe('Emma');
  });
});


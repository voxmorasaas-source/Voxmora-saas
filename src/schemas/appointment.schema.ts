import { z } from 'zod';

export const checkAvailabilitySchema = z.object({
  serviceId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  timezone: z.string().default('America/New_York'),
});

export const createAppointmentSchema = z.object({
  serviceId: z.string().uuid(),
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().min(10, 'Valid phone number required'),
  customerEmail: z.string().email().optional(),
  startTime: z.string().datetime({ message: 'Start time must be ISO 8601 string' }),
  notes: z.string().optional(),
});

export const rescheduleAppointmentSchema = z.object({
  appointmentId: z.string().uuid(),
  newStartTime: z.string().datetime({ message: 'Start time must be ISO 8601 string' }),
});

export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type RescheduleAppointmentInput = z.infer<typeof rescheduleAppointmentSchema>;


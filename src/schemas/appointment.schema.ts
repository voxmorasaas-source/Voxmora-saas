import { z } from 'zod';

export const appointmentStatusSchema = z.enum([
  'pending',
  'confirmed',
  'checked_in',
  'in_progress',
  'rescheduled',
  'completed',
  'cancelled',
  'no_show',
]);

export const bookingSourceSchema = z.enum(['manual', 'ai', 'online']);

export const checkAvailabilitySchema = z.object({
  organizationId: z.string().uuid().optional(),
  serviceId: z.string().optional(),
  staffId: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'),
  timezone: z.string().default('America/New_York'),
});

export const createAppointmentSchema = z
  .object({
    organizationId: z.string().uuid().optional(),
    customerId: z.string().uuid().optional(),
    customerName: z.string().optional(),
    clientName: z.string().optional(),
    customerPhone: z.string().optional(),
    clientPhone: z.string().optional(),
    customerEmail: z.string().email().optional().or(z.literal('')),
    clientEmail: z.string().email().optional().or(z.literal('')),
    serviceId: z.string().optional(),
    serviceName: z.string().min(1, 'Service name is required'),
    staffId: z.string().optional(),
    staffName: z.string().optional(),
    startTime: z.string().datetime({ message: 'Start time must be ISO 8601 string' }),
    endTime: z.string().datetime({ message: 'End time must be ISO 8601 string' }).optional(),
    durationMinutes: z.number().int().positive().default(30),
    priceCents: z.number().int().nonnegative().default(0),
    bookingSource: bookingSourceSchema.default('manual'),
    status: appointmentStatusSchema.default('confirmed'),
    notes: z.string().optional().nullable(),
    blandCallId: z.string().optional().nullable(),
  })
  .transform((data) => ({
    ...data,
    customerName: (data.clientName || data.customerName || '').trim(),
    customerPhone: (data.clientPhone || data.customerPhone || '').trim(),
    customerEmail: (data.clientEmail || data.customerEmail || '').trim() || undefined,
  }))
  .refine((data) => data.customerName.length >= 2, {
    message: 'Client name must be at least 2 characters',
    path: ['customerName'],
  });

export const updateAppointmentSchema = z.object({
  appointmentId: z.string().uuid().optional(),
  customerName: z.string().min(2).optional(),
  clientName: z.string().min(2).optional(),
  customerPhone: z.string().optional(),
  clientPhone: z.string().optional(),
  customerEmail: z.string().email().optional().or(z.literal('')),
  clientEmail: z.string().email().optional().or(z.literal('')),
  serviceId: z.string().optional(),
  serviceName: z.string().optional(),
  staffId: z.string().optional().nullable(),
  staffName: z.string().optional().nullable(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  durationMinutes: z.number().int().positive().optional(),
  priceCents: z.number().int().nonnegative().optional(),
  status: appointmentStatusSchema.optional(),
  notes: z.string().optional().nullable(),
  bookingSource: bookingSourceSchema.optional(),
  blandCallId: z.string().optional().nullable(),
});

export const updateAppointmentStatusSchema = z.object({
  status: appointmentStatusSchema,
  notes: z.string().optional(),
});

export const rescheduleAppointmentSchema = z.object({
  appointmentId: z.string().uuid(),
  newStartTime: z.string().datetime({ message: 'Start time must be ISO 8601 string' }),
  newEndTime: z.string().datetime().optional(),
  staffId: z.string().optional(),
});

export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
export type RescheduleAppointmentInput = z.infer<typeof rescheduleAppointmentSchema>;

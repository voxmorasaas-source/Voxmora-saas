import { z } from 'zod';

export const callQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(['in_progress', 'completed', 'busy', 'no_answer', 'failed', 'transferred']).optional(),
  outcome: z.enum(['appointment_booked', 'inquiry_resolved', 'transferred_to_staff', 'lead_captured', 'spam', 'unresolved']).optional(),
  search: z.string().optional(),
});

export type CallQueryInput = z.infer<typeof callQuerySchema>;


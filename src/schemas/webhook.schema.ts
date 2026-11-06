import { z } from 'zod';

// Bland AI Completed Call Webhook payload schema
export const blandTranscriptTurnSchema = z.object({
  user: z.string().optional(),
  bot: z.string().optional(),
  text: z.string().optional(),
  time: z.number().optional(),
});

export const blandCallCompletedWebhookSchema = z.object({
  call_id: z.string(),
  phone_number: z.string(),
  from: z.string().optional(),
  to: z.string().optional(),
  call_length: z.number().default(0), // Length in minutes or seconds
  completed: z.boolean().default(true),
  concatenated_transcript: z.string().optional().default(''),
  transcripts: z.array(z.any()).optional().default([]),
  recording_url: z.string().url().optional().nullable(),
  summary: z.string().optional().nullable(),
  status: z.string().optional().default('completed'),
  variables: z.record(z.any()).optional().default({}),
});

export type BlandCallCompletedWebhook = z.infer<typeof blandCallCompletedWebhookSchema>;


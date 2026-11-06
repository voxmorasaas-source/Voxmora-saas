import { z } from 'zod';

export const createVoiceAgentSchema = z.object({
  name: z.string().min(2, 'Agent name must be at least 2 characters').max(100),
  voiceId: z.string().min(1, 'Please select a voice'),
  language: z.string().default('en-US'),
  greetingMessage: z.string().min(5, 'Greeting message must be at least 5 characters'),
  systemPrompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  temperature: z.number().min(0).max(1).default(0.7),
  fallbackPhoneNumber: z.string().optional().nullable(),
  transferKeywords: z.array(z.string()).default(['human', 'operator', 'representative']),
  maxDurationSeconds: z.number().min(60).max(1800).default(600),
});

export const updateVoiceAgentSchema = createVoiceAgentSchema.partial().extend({
  isActive: z.boolean().optional(),
});

export const testCallSchema = z.object({
  agentId: z.string().uuid(),
  recipientPhoneNumber: z.string().min(10, 'Valid phone number required'),
});

export type CreateVoiceAgentInput = z.infer<typeof createVoiceAgentSchema>;
export type UpdateVoiceAgentInput = z.infer<typeof updateVoiceAgentSchema>;
export type TestCallInput = z.infer<typeof testCallSchema>;


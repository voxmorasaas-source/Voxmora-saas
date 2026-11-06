import type { Database } from './database.types';

export type Organization = Database['public']['Tables']['organizations']['Row'];
export type OrganizationMember = Database['public']['Tables']['organization_members']['Row'];
export type BusinessProfile = Database['public']['Tables']['business_profiles']['Row'];
export type VoiceAgent = Database['public']['Tables']['voice_agents']['Row'];
export type PhoneNumber = Database['public']['Tables']['phone_numbers']['Row'];
export type Service = Database['public']['Tables']['services']['Row'];
export type KnowledgeBase = Database['public']['Tables']['knowledge_base']['Row'];
export type Customer = Database['public']['Tables']['customers']['Row'];
export type Call = Database['public']['Tables']['calls']['Row'];
export type CallTranscript = Database['public']['Tables']['call_transcripts']['Row'];
export type Appointment = Database['public']['Tables']['appointments']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type UsageRecord = Database['public']['Tables']['usage_records']['Row'];
export type Integration = Database['public']['Tables']['integrations']['Row'];

export interface TranscriptDialogueTurn {
  speaker: 'user' | 'agent' | 'human_agent';
  text: string;
  timestamp: number;
}


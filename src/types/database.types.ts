export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'owner' | 'admin' | 'member';
export type CallStatus = 'in_progress' | 'completed' | 'busy' | 'no_answer' | 'failed' | 'transferred';
export type CallOutcome = 'appointment_booked' | 'inquiry_resolved' | 'transferred_to_staff' | 'lead_captured' | 'spam' | 'unresolved';
export type AppointmentStatus = 'confirmed' | 'rescheduled' | 'cancelled' | 'completed' | 'no_show';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'paused';
export type PhoneNumberStatus = 'active' | 'pending_verification' | 'released';

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          timezone?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          role?: UserRole;
          updated_at?: string;
        };
        Relationships: [];
      };
      invitations: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          role: UserRole;
          token: string;
          invited_by: string;
          expires_at: string;
          accepted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          email: string;
          role?: UserRole;
          token: string;
          invited_by: string;
          expires_at: string;
          accepted_at?: string | null;
          created_at?: string;
        };
        Update: {
          accepted_at?: string | null;
        };
        Relationships: [];
      };
      business_profiles: {
        Row: {
          id: string;
          organization_id: string;
          industry: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          address_street: string | null;
          address_city: string | null;
          address_state: string | null;
          address_postal_code: string | null;
          address_country: string | null;
          operating_hours: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          industry?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          address_street?: string | null;
          address_city?: string | null;
          address_state?: string | null;
          address_postal_code?: string | null;
          address_country?: string | null;
          operating_hours?: Json;
          updated_at?: string;
        };
        Update: {
          industry?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          address_street?: string | null;
          address_city?: string | null;
          address_state?: string | null;
          address_postal_code?: string | null;
          address_country?: string | null;
          operating_hours?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      voice_agents: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          bland_agent_id: string | null;
          voice_id: string;
          language: string;
          greeting_message: string;
          system_prompt: string;
          temperature: number;
          fallback_phone_number: string | null;
          transfer_keywords: string[];
          max_duration_seconds: number;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          bland_agent_id?: string | null;
          voice_id?: string;
          language?: string;
          greeting_message: string;
          system_prompt: string;
          temperature?: number;
          fallback_phone_number?: string | null;
          transfer_keywords?: string[];
          max_duration_seconds?: number;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          bland_agent_id?: string | null;
          voice_id?: string;
          language?: string;
          greeting_message?: string;
          system_prompt?: string;
          temperature?: number;
          fallback_phone_number?: string | null;
          transfer_keywords?: string[];
          max_duration_seconds?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      phone_numbers: {
        Row: {
          id: string;
          organization_id: string;
          voice_agent_id: string | null;
          phone_number: string;
          bland_phone_id: string | null;
          status: PhoneNumberStatus;
          forwarding_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          voice_agent_id?: string | null;
          phone_number: string;
          bland_phone_id?: string | null;
          status?: PhoneNumberStatus;
          forwarding_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          voice_agent_id?: string | null;
          status?: PhoneNumberStatus;
          forwarding_number?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string | null;
          duration_minutes: number;
          price_cents: number | null;
          currency: string | null;
          is_bookable_by_ai: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          description?: string | null;
          duration_minutes?: number;
          price_cents?: number | null;
          currency?: string | null;
          is_bookable_by_ai?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          duration_minutes?: number;
          price_cents?: number | null;
          currency?: string | null;
          is_bookable_by_ai?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      knowledge_base: {
        Row: {
          id: string;
          organization_id: string;
          category: string;
          question: string;
          answer: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          category?: string;
          question: string;
          answer: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          question?: string;
          answer?: string;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          organization_id: string;
          phone: string;
          first_name: string | null;
          last_name: string | null;
          email: string | null;
          notes: string | null;
          total_calls: number;
          last_called_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          phone: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          notes?: string | null;
          total_calls?: number;
          last_called_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          phone?: string;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          notes?: string | null;
          total_calls?: number;
          last_called_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      calls: {
        Row: {
          id: string;
          organization_id: string;
          voice_agent_id: string | null;
          customer_id: string | null;
          bland_call_id: string;
          from_number: string;
          to_number: string;
          status: CallStatus;
          outcome: CallOutcome;
          duration_seconds: number;
          billable_minutes: number;
          recording_url: string | null;
          summary: string | null;
          sentiment: string | null;
          started_at: string;
          ended_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          voice_agent_id?: string | null;
          customer_id?: string | null;
          bland_call_id: string;
          from_number: string;
          to_number: string;
          status?: CallStatus;
          outcome?: CallOutcome;
          duration_seconds?: number;
          billable_minutes?: number;
          recording_url?: string | null;
          summary?: string | null;
          sentiment?: string | null;
          started_at: string;
          ended_at?: string | null;
          created_at?: string;
        };
        Update: {
          status?: CallStatus;
          outcome?: CallOutcome;
          duration_seconds?: number;
          billable_minutes?: number;
          recording_url?: string | null;
          summary?: string | null;
          sentiment?: string | null;
          ended_at?: string | null;
        };
        Relationships: [];
      };
      call_transcripts: {
        Row: {
          id: string;
          call_id: string;
          organization_id: string;
          dialogue: Json;
          raw_transcript: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          call_id: string;
          organization_id: string;
          dialogue?: Json;
          raw_transcript: string;
          created_at?: string;
        };
        Update: {
          dialogue?: Json;
          raw_transcript?: string;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          id: string;
          organization_id: string;
          customer_id: string;
          service_id: string | null;
          call_id: string | null;
          external_provider: string | null;
          external_booking_id: string | null;
          start_time: string;
          end_time: string;
          status: AppointmentStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          customer_id: string;
          service_id?: string | null;
          call_id?: string | null;
          external_provider?: string | null;
          external_booking_id?: string | null;
          start_time: string;
          end_time: string;
          status?: AppointmentStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          service_id?: string | null;
          external_booking_id?: string | null;
          start_time?: string;
          end_time?: string;
          status?: AppointmentStatus;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          organization_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string | null;
          plan_tier: string;
          status: SubscriptionStatus;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          monthly_included_minutes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          stripe_customer_id: string;
          stripe_subscription_id?: string | null;
          plan_tier?: string;
          status?: SubscriptionStatus;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          monthly_included_minutes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          stripe_subscription_id?: string | null;
          plan_tier?: string;
          status?: SubscriptionStatus;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          monthly_included_minutes?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      usage_records: {
        Row: {
          id: string;
          organization_id: string;
          call_id: string | null;
          minutes_used: number;
          billing_period_start: string;
          billing_period_end: string;
          is_overage: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          call_id?: string | null;
          minutes_used: number;
          billing_period_start: string;
          billing_period_end: string;
          is_overage?: boolean;
          created_at?: string;
        };
        Update: {
          minutes_used?: number;
          is_overage?: boolean;
        };
        Relationships: [];
      };
      integrations: {
        Row: {
          id: string;
          organization_id: string;
          provider: string;
          encrypted_credentials: string;
          metadata: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          provider: string;
          encrypted_credentials: string;
          metadata?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          encrypted_credentials?: string;
          metadata?: Json;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      webhook_events: {
        Row: {
          id: string;
          provider: string;
          event_id: string;
          event_type: string;
          payload: Json;
          processed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          provider: string;
          event_id: string;
          event_type: string;
          payload: Json;
          processed_at?: string;
          created_at?: string;
        };
        Update: {
          processed_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      call_status: CallStatus;
      call_outcome: CallOutcome;
      appointment_status: AppointmentStatus;
      subscription_status: SubscriptionStatus;
      phone_number_status: PhoneNumberStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

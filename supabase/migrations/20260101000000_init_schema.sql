-- ============================================================================
-- VOXMORA PRODUCTION DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE call_status AS ENUM ('in_progress', 'completed', 'busy', 'no_answer', 'failed', 'transferred');
CREATE TYPE call_outcome AS ENUM ('appointment_booked', 'inquiry_resolved', 'transferred_to_staff', 'lead_captured', 'spam', 'unresolved');
CREATE TYPE appointment_status AS ENUM ('confirmed', 'rescheduled', 'cancelled', 'completed', 'no_show');
CREATE TYPE subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');
CREATE TYPE phone_number_status AS ENUM ('active', 'pending_verification', 'released');

-- 1. Organizations (Tenants)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    logo_url TEXT,
    timezone VARCHAR(64) NOT NULL DEFAULT 'America/New_York',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 2. Organization Members (RBAC Junction)
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(organization_id, user_id)
);

-- 3. Team Invitations
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'member',
    token VARCHAR(255) NOT NULL UNIQUE,
    invited_by UUID NOT NULL REFERENCES auth.users(id),
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4. Business Profiles
CREATE TABLE business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
    industry VARCHAR(100),
    phone VARCHAR(32),
    email VARCHAR(255),
    website TEXT,
    address_street TEXT,
    address_city VARCHAR(100),
    address_state VARCHAR(50),
    address_postal_code VARCHAR(20),
    address_country VARCHAR(2) DEFAULT 'US',
    operating_hours JSONB NOT NULL DEFAULT '{
        "monday": {"open": "09:00", "close": "17:00", "closed": false},
        "tuesday": {"open": "09:00", "close": "17:00", "closed": false},
        "wednesday": {"open": "09:00", "close": "17:00", "closed": false},
        "thursday": {"open": "09:00", "close": "17:00", "closed": false},
        "friday": {"open": "09:00", "close": "17:00", "closed": false},
        "saturday": {"open": "10:00", "close": "15:00", "closed": false},
        "sunday": {"open": "00:00", "close": "00:00", "closed": true}
    }',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 5. Voice Agents
CREATE TABLE voice_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    bland_agent_id VARCHAR(100),
    voice_id VARCHAR(50) NOT NULL DEFAULT 'maya',
    language VARCHAR(10) NOT NULL DEFAULT 'en-US',
    greeting_message TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    temperature NUMERIC(3,2) NOT NULL DEFAULT 0.70,
    fallback_phone_number VARCHAR(32),
    transfer_keywords TEXT[] DEFAULT ARRAY['human', 'representative', 'operator', 'doctor', 'manager'],
    max_duration_seconds INTEGER NOT NULL DEFAULT 600,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 6. Phone Numbers
CREATE TABLE phone_numbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    voice_agent_id UUID REFERENCES voice_agents(id) ON DELETE SET NULL,
    phone_number VARCHAR(32) NOT NULL UNIQUE,
    bland_phone_id VARCHAR(100),
    status phone_number_status NOT NULL DEFAULT 'active',
    forwarding_number VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 7. Services Offered
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    price_cents INTEGER,
    currency VARCHAR(3) DEFAULT 'USD',
    is_bookable_by_ai BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 8. Knowledge Base & FAQs
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL DEFAULT 'faq',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 9. Customers CRM
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    phone VARCHAR(32) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    notes TEXT,
    total_calls INTEGER NOT NULL DEFAULT 1,
    last_called_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(organization_id, phone)
);

-- 10. Calls
CREATE TABLE calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    voice_agent_id UUID REFERENCES voice_agents(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    bland_call_id VARCHAR(100) NOT NULL UNIQUE,
    from_number VARCHAR(32) NOT NULL,
    to_number VARCHAR(32) NOT NULL,
    status call_status NOT NULL DEFAULT 'completed',
    outcome call_outcome NOT NULL DEFAULT 'inquiry_resolved',
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    billable_minutes INTEGER NOT NULL DEFAULT 0,
    recording_url TEXT,
    summary TEXT,
    sentiment VARCHAR(20),
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 11. Call Transcripts
CREATE TABLE call_transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID NOT NULL UNIQUE REFERENCES calls(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    dialogue JSONB NOT NULL DEFAULT '[]',
    raw_transcript TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 12. Appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    call_id UUID REFERENCES calls(id) ON DELETE SET NULL,
    external_provider VARCHAR(50) DEFAULT 'internal',
    external_booking_id VARCHAR(255),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status appointment_status NOT NULL DEFAULT 'confirmed',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 13. Subscriptions (Stripe)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(100) NOT NULL UNIQUE,
    stripe_subscription_id VARCHAR(100) UNIQUE,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'starter',
    status subscription_status NOT NULL DEFAULT 'trialing',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    monthly_included_minutes INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 14. Usage Records
CREATE TABLE usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    call_id UUID REFERENCES calls(id) ON DELETE SET NULL,
    minutes_used INTEGER NOT NULL,
    billing_period_start TIMESTAMPTZ NOT NULL,
    billing_period_end TIMESTAMPTZ NOT NULL,
    is_overage BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 15. Integrations
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    encrypted_credentials TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(organization_id, provider)
);

-- 16. Webhook Events (Idempotency)
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(50) NOT NULL,
    event_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(provider, event_id)
);

-- Indexes
CREATE INDEX idx_org_members_user ON organization_members(user_id);
CREATE INDEX idx_calls_org_started ON calls(organization_id, started_at DESC);
CREATE INDEX idx_calls_bland_id ON calls(bland_call_id);
CREATE INDEX idx_customers_org_phone ON customers(organization_id, phone);
CREATE INDEX idx_appointments_org_start ON appointments(organization_id, start_time);
CREATE INDEX idx_usage_records_org_period ON usage_records(organization_id, billing_period_start, billing_period_end);

-- Row Level Security (RLS) Helper Function
CREATE OR REPLACE FUNCTION user_has_org_membership(target_org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = target_org_id
      AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Dynamic Tenant RLS Enforcement
DO $$
DECLARE
  t text;
  tenant_tables text[] := ARRAY[
    'business_profiles', 'voice_agents', 'phone_numbers', 'services',
    'knowledge_base', 'customers', 'calls', 'call_transcripts',
    'appointments', 'subscriptions', 'usage_records', 'integrations'
  ];
BEGIN
  FOREACH t IN ARRAY tenant_tables LOOP
    EXECUTE format('
      CREATE POLICY "Tenant isolation for %I"
      ON %I FOR ALL
      USING (user_has_org_membership(organization_id))
      WITH CHECK (user_has_org_membership(organization_id));
    ', t, t);
  END LOOP;
END;
$$;


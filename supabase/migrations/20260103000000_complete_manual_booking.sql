-- ============================================================================
-- VOXMORA / SEREVA COMPLETE MANUAL APPOINTMENT & CALENDAR SCHEMA
-- Idempotent script: Safe to run multiple times in Supabase SQL Editor
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Organizations table
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    logo_url TEXT,
    timezone VARCHAR(64) NOT NULL DEFAULT 'America/New_York',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Insert default demo organization if empty
INSERT INTO public.organizations (id, name, slug)
VALUES ('00000000-0000-0000-0000-000000000001', 'Sereva Spa & Salon', 'sereva')
ON CONFLICT (id) DO NOTHING;

-- 2. Organization Members table
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'owner',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. Customers table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
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

-- 4. Services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    price_cents INTEGER DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    is_bookable_by_ai BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 5. Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    service_name VARCHAR(150),
    staff_id VARCHAR(100),
    staff_name VARCHAR(100),
    client_name VARCHAR(150) NOT NULL DEFAULT 'Client',
    client_phone VARCHAR(32),
    client_email VARCHAR(255),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    price_cents INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed',
    booking_source VARCHAR(50) NOT NULL DEFAULT 'manual',
    external_provider VARCHAR(50) DEFAULT 'internal',
    external_booking_id VARCHAR(255),
    notes TEXT,
    follow_up_status VARCHAR(50) DEFAULT 'pending',
    bland_call_id VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Ensure customer_id column is NULLABLE if table already existed with NOT NULL constraint
ALTER TABLE public.appointments ALTER COLUMN customer_id DROP NOT NULL;

-- Ensure all required columns exist (for pre-existing tables)
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS service_name VARCHAR(150),
ADD COLUMN IF NOT EXISTS staff_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS staff_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS client_name VARCHAR(150) DEFAULT 'Client',
ADD COLUMN IF NOT EXISTS client_phone VARCHAR(32),
ADD COLUMN IF NOT EXISTS client_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS price_cents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS booking_source VARCHAR(50) DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS follow_up_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS bland_call_id VARCHAR(255);

-- 6. Indexes for Calendar Queries and Availability Conflict Checking
CREATE INDEX IF NOT EXISTS idx_appointments_org_start ON public.appointments(organization_id, start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_staff_start ON public.appointments(staff_id, start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_appointments_source ON public.appointments(organization_id, booking_source);

-- 7. Enable RLS and permissive policies for authenticated and anon users
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated and anon users to manage appointments (development & SaaS access)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow all on appointments" ON public.appointments;
    CREATE POLICY "Allow all on appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Allow all on organizations" ON public.organizations;
    CREATE POLICY "Allow all on organizations" ON public.organizations FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow all on services" ON public.services;
    CREATE POLICY "Allow all on services" ON public.services FOR ALL USING (true) WITH CHECK (true);

    DROP POLICY IF EXISTS "Allow all on customers" ON public.customers;
    CREATE POLICY "Allow all on customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
END $$;


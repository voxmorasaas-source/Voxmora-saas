-- ============================================================================
-- VOXMORA MIGRATION: 20260102000000_calendar_appointments.sql
-- Calendar Booking Management, Staff Assignment, Statuses & Follow-ups
-- ============================================================================

-- 1. Extend Appointments Table
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS staff_id UUID REFERENCES organization_members(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS staff_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS client_name VARCHAR(150),
ADD COLUMN IF NOT EXISTS client_phone VARCHAR(32),
ADD COLUMN IF NOT EXISTS client_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS service_name VARCHAR(150),
ADD COLUMN IF NOT EXISTS price_cents INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS booking_source VARCHAR(50) DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS follow_up_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS bland_call_id VARCHAR(255);

-- 2. Performance Indexes for Calendar Lookups & Overlap Checks
CREATE INDEX IF NOT EXISTS idx_appointments_org_start 
ON appointments(organization_id, start_time);

CREATE INDEX IF NOT EXISTS idx_appointments_staff_start 
ON appointments(staff_id, start_time);

CREATE INDEX IF NOT EXISTS idx_appointments_status 
ON appointments(organization_id, status);

CREATE INDEX IF NOT EXISTS idx_appointments_source 
ON appointments(organization_id, booking_source);

-- 3. Comments for Schema Documentation
COMMENT ON COLUMN appointments.booking_source IS 'Source of appointment creation: manual, ai, or online';
COMMENT ON COLUMN appointments.follow_up_status IS 'Lifecycle of automated no-show follow-up call: pending, eligible, calling, completed, cancelled';
COMMENT ON COLUMN appointments.bland_call_id IS 'Unique Bland AI telephony call identifier if booked or followed-up by voice agent';


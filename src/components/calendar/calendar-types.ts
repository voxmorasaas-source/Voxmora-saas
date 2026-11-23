export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'in_progress'
  | 'rescheduled'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type BookingSource = 'manual' | 'ai' | 'online';

export interface CalendarAppointment {
  id: string;
  organization_id?: string;
  client_id?: string | null;
  client_name: string;
  client_phone?: string | null;
  client_email?: string | null;
  service_id?: string | null;
  service_name: string;
  staff_id?: string | null;
  staff_name?: string | null;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  price_cents: number;
  status: AppointmentStatus;
  booking_source: BookingSource;
  notes?: string | null;
  follow_up_status?: string | null;
  bland_call_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface StaffOption {
  id: string;
  name: string;
  role: string;
  initials: string;
  color?: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  priceCents: number;
}

export const DEFAULT_STAFF: StaffOption[] = [
  { id: '1', name: 'Sophie Carter', role: 'Senior Esthetician', initials: 'SC', color: '#7652D6' },
  { id: '2', name: 'Mia Chen', role: 'Massage Therapist', initials: 'MC', color: '#13A58B' },
  { id: '3', name: 'Chloe Williams', role: 'Nail Specialist', initials: 'CW', color: '#D88935' },
];

export const DEFAULT_SERVICES: ServiceOption[] = [
  { id: '1', name: 'Signature Facial', category: 'Facials', durationMinutes: 60, priceCents: 9500 },
  { id: '2', name: 'Deep Tissue Massage', category: 'Massage', durationMinutes: 60, priceCents: 12000 },
  { id: '3', name: 'Hydrating Facial', category: 'Facials', durationMinutes: 45, priceCents: 8500 },
  { id: '4', name: 'Body Treatment', category: 'Body', durationMinutes: 90, priceCents: 15000 },
  { id: '5', name: 'Manicure & Pedicure', category: 'Nails', durationMinutes: 75, priceCents: 7500 },
  { id: '6', name: 'Aromatherapy Massage', category: 'Massage', durationMinutes: 60, priceCents: 11000 },
];

export const STATUS_COLORS: Record<
  AppointmentStatus,
  { bg: string; text: string; border: string; label: string }
> = {
  confirmed: {
    bg: '#F0E9FF',
    text: '#7652D6',
    border: '#D8CFEE',
    label: 'Confirmed',
  },
  checked_in: {
    bg: '#E6F7F1',
    text: '#13A58B',
    border: '#B4E8DA',
    label: 'Checked in',
  },
  in_progress: {
    bg: '#E8F1FE',
    text: '#2563EB',
    border: '#BFDBFE',
    label: 'In progress',
  },
  pending: {
    bg: '#FFF3E6',
    text: '#D88935',
    border: '#FED7AA',
    label: 'Pending',
  },
  completed: {
    bg: '#F3F4F6',
    text: '#4B5563',
    border: '#E5E7EB',
    label: 'Completed',
  },
  rescheduled: {
    bg: '#FEF3C7',
    text: '#B45309',
    border: '#FDE68A',
    label: 'Rescheduled',
  },
  cancelled: {
    bg: '#FEE2E2',
    text: '#DC2626',
    border: '#FECACA',
    label: 'Cancelled',
  },
  no_show: {
    bg: '#FDF2F8',
    text: '#BE185D',
    border: '#FBCFE8',
    label: 'No show',
  },
};


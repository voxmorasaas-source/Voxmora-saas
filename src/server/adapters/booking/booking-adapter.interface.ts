import 'server-only';
import type { BookingSource } from '@/types/database.types';

export interface TimeSlot {
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  formattedTime: string; // e.g. "10:00 AM"
  available: boolean;
  staffId?: string;
  staffName?: string;
}

export interface CheckAvailabilityParams {
  organizationId: string;
  serviceId?: string;
  staffId?: string;
  date: string; // YYYY-MM-DD
  timezone?: string;
}

export interface CreateBookingParams {
  organizationId: string;
  serviceId?: string;
  serviceName?: string;
  staffId?: string;
  staffName?: string;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  priceCents?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  bookingSource?: BookingSource;
}

export interface BookingResult {
  bookingId: string;
  externalReference?: string;
  status: 'confirmed' | 'pending' | 'failed';
  startTime: string;
  endTime: string;
  appointment?: any;
}

export interface IBookingProviderAdapter {
  checkAvailability(params: CheckAvailabilityParams): Promise<TimeSlot[]>;
  createBooking(params: CreateBookingParams): Promise<BookingResult>;
  cancelBooking(bookingId: string, reason?: string): Promise<boolean>;
}

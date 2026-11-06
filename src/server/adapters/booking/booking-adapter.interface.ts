import 'server-only';

export interface TimeSlot {
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
  formattedTime: string; // e.g. "10:00 AM"
  available: boolean;
}

export interface CheckAvailabilityParams {
  organizationId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  timezone: string;
}

export interface CreateBookingParams {
  organizationId: string;
  serviceId: string;
  startTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
}

export interface BookingResult {
  bookingId: string;
  externalReference?: string;
  status: 'confirmed' | 'pending' | 'failed';
  startTime: string;
  endTime: string;
}

export interface IBookingProviderAdapter {
  checkAvailability(params: CheckAvailabilityParams): Promise<TimeSlot[]>;
  createBooking(params: CreateBookingParams): Promise<BookingResult>;
  cancelBooking(bookingId: string, reason?: string): Promise<boolean>;
}


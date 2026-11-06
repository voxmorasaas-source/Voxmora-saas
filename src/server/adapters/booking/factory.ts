import 'server-only';
import { IBookingProviderAdapter } from './booking-adapter.interface';
import { InternalBookingAdapter } from './internal-booking.adapter';
import type { Database } from '@/types/database.types';

type IntegrationRow = Database['public']['Tables']['integrations']['Row'];

export class BookingAdapterFactory {
  static getAdapter(integration: IntegrationRow | null): IBookingProviderAdapter {
    if (!integration || !integration.is_active || integration.provider === 'internal') {
      return new InternalBookingAdapter();
    }

    // Future providers (Cal.com, Acuity) instantiate here using integration.encrypted_credentials
    switch (integration.provider) {
      case 'internal':
      default:
        return new InternalBookingAdapter();
    }
  }
}


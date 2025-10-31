import type { ReservationEventsSummary } from '@/types/host/reservations';
import api from '@/utils/api';
import type { Listing } from '@/types/host/listing';

export const fetchReservationEvents = async (
  listings: Listing[]
): Promise<ReservationEventsSummary | null> => {
  try {
    const queryParams = new URLSearchParams();

    if (listings.length > 0) {
      listings.forEach((listing) => {
        queryParams.append('listings', String(listing.id));
      });
    }
    const url = `/hostings/reservation-events${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    const { data } = await api.get<ReservationEventsSummary>(url);
    return data;
  } catch (error) {
    console.error('Failed to fetch reservation events', error);
    return null;
  }
};

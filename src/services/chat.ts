import api from '@/utils/api';
import type { TripsMessageModel } from '@/types/tripsMessage';

export interface CreateTripMessageBody {
  content?: string;
}

/**
 * Creates or retrieves a trip conversation and returns the conversation data.
 */
export const createTripConversation = async (
  tripId: number | string,
  body?: CreateTripMessageBody
): Promise<TripsMessageModel> => {
  const safeTripId = encodeURIComponent(String(tripId));
  const url = `/socials/trips/${safeTripId}/messages/text`;
  const { data } = await api.post<TripsMessageModel>(url, body);
  return data;
};

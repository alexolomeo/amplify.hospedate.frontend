import type { ReservationPaymentAvailability } from '@/types/booking';
import type { ParamsListingAvailibility } from '@/types/listing/listing';
import api from '@/utils/api';
import { omitEmptyAndZero } from '@/utils/object';

export const createReservationPayment = async (
  params: ParamsListingAvailibility,
  content: string,
  nit: string,
  nameOrCompanyName: string,
  listingId: string
): Promise<ReservationPaymentAvailability> => {
  try {
    const rawBody = {
      ...params,
      content: content,
      nit: nit,
      nameOrCompanyName: nameOrCompanyName,
    };
    const body = omitEmptyAndZero(rawBody);
    const url = `/listings/${encodeURIComponent(listingId)}/reservations/register`;
    const { data } = await api.post(url, body);
    return data;
  } catch (error) {
    console.error('Failed to Reservation Payment', error);
    throw error;
  }
};

export const retrieveReservationPayment = async (
  code: string
): Promise<string | null> => {
  try {
    const body = {
      reservationCode: code,
    };
    const url = `/guests/reservations/payment/retrieve`;
    const { data } = await api.post(url, body);
    return data.paymentGatewayUrl;
  } catch (error) {
    console.error('Failed to Reservation Payment', error);
    return null;
  }
};

import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api';
import {
  createReservationPayment,
  retrieveReservationPayment,
} from '@/services/booking';
import type { ParamsListingAvailibility } from '@/types/listing/listing';

vi.mock('@/utils/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('createReservationPayment', () => {
  it('should create a reservation payment successfully', async () => {
    const mockResponseData = {
      id: 'mock-payment-id',
      status: 'pending',
      amount: 100,
    };
    (api.post as Mock).mockResolvedValue({ data: mockResponseData });

    const params: ParamsListingAvailibility = {
      checkInDate: '2025-09-02',
      checkoutDate: '2025-09-07',
      adults: 2,
    };
    const content = 'Test content';
    const nit = '12345';
    const nameOrCompanyName = 'Test User';
    const listingId = '123';

    const result = await createReservationPayment(
      params,
      content,
      nit,
      nameOrCompanyName,
      listingId
    );

    expect(api.post).toHaveBeenCalledWith(
      '/listings/123/reservations/register',
      {
        ...params,
        content: content,
        nit: nit,
        nameOrCompanyName: nameOrCompanyName,
      }
    );
    expect(result).toEqual(mockResponseData);
  });
});

describe('retrieveReservationPayment', () => {
  it('should retrieve payment gateway URL successfully', async () => {
    const mockResponseData = {
      paymentGatewayUrl: 'https://payment.example.com/checkout',
    };
    (api.post as Mock).mockResolvedValue({ data: mockResponseData });

    const code = 'RES123';
    const result = await retrieveReservationPayment(code);

    expect(api.post).toHaveBeenCalledWith(
      '/guests/reservations/payment/retrieve',
      { reservationCode: code }
    );
    expect(result).toBe(mockResponseData.paymentGatewayUrl);
  });

  it('should return null if API call fails', async () => {
    (api.post as Mock).mockRejectedValue(new Error('API Error'));

    const result = await retrieveReservationPayment('RES123');

    expect(result).toBeNull();
  });
});

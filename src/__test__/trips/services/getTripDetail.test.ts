import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api.ts';
import { getTripDetail } from '@/services/users.ts';
import type { TripDetail } from '@/types/tripDetail';
import { TripStatus } from '@/types/tripDetail';

vi.mock('axios', () => ({
  default: {
    isAxiosError: (e: unknown): e is { response?: { status?: number } } =>
      typeof e === 'object' &&
      e !== null &&
      (e as { isAxiosError?: boolean }).isAxiosError === true,
  },
}));

vi.mock('@/utils/api', () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

describe('getTripDetail service', () => {
  const tripId = '123';

  const testDetail: TripDetail = {
    id: 123,
    title: 'Trip test',
    status: TripStatus.Confirmed,
    pendingReview: false,
    wishlisted: false,

    booking: {
      checkInDate: '2025-02-10',
      checkoutDate: '2025-02-12',
      createdAt: '2025-02-12',
      adults: 2,
      children: 1,
      infants: 0,
      pets: 1,
      reservationCode: 'ABC-123',
      chatId: 9,
    },

    cancellationPolicy: {
      name: 'Flexible',
      policyType: 'STANDARD',
      rules: [],
      summaryKey: 'cancellation_policy_standard_flexible_summary',
      summaryPlaceholders: {},
    },

    guest: {
      id: 11,
      username: 'Guest User',
      identityVerified: true,
      totalReviews: 3,
      becameUserAt: '2023-01-01',
      city: 'Santa Cruz',
      country: 'Bolivia',
      profilePicture: {
        original: '',
        srcsetWebp: '',
        srcsetAvif: '',
      },
    },

    host: {
      id: 22,
      username: 'Host User',
      identityVerified: true,
      totalReviews: 10,
      becameHostAt: '2022-01-01',
      city: 'Santa Cruz',
      country: 'Bolivia',
      profilePicture: {
        original: '',
        srcsetWebp: '',
        srcsetAvif: '',
      },
    },

    guestSecurity: [],
    houseRules: {
      checkInStartTime: 15,
      checkInEndTime: 22,
      checkoutTime: 11,
      commercialPhotographyAllowed: false,
      eventsAllowed: false,
      guests: 4,
      petsAllowed: true,
      quietHoursStartTime: 22,
      quietHoursEndTime: 7,
    },

    listing: { id: 777 },

    location: {
      address: 'Calle 123',
      city: 'Santa Cruz de la Sierra',
      state: 'Santa Cruz',
      country: 'Bolivia',
      coordinates: {
        latitude: -17.7833,
        longitude: -63.1821,
      },
    },

    paymentDetail: {
      currency: 'BOB',
      totalNightlyPrice: 500,
      totalServiceFee: 50,
      totalCleaningFee: 0,
      weeklyDiscount: 0,
      monthlyDiscount: 0,
      totalPrice: 550,
      totalGuestFee: 50,
      totalNightlyPriceHost: 500,
      totalHostFee: 15,
    },

    photos: [{ original: '', srcsetWebp: '', srcsetAvif: '' }],

    safetyRules: {
      carbonMonoxideDetector: true,
      smokeDetector: true,
    },
  };

  it('returns trip detail on success (no options)', async () => {
    (api.get as Mock).mockResolvedValueOnce({ data: testDetail });

    const result = await getTripDetail(tripId);

    expect(result).toEqual(testDetail);
    expect(api.get).toHaveBeenCalledWith(`/users/trips/${tripId}`);
  });

  it('includes skipGlobal404Redirect when opts is provided', async () => {
    (api.get as Mock).mockResolvedValueOnce({ data: testDetail });

    const result = await getTripDetail(tripId, { skipGlobal404Redirect: true });

    expect(result).toEqual(testDetail);
    expect(api.get).toHaveBeenCalledWith(`/users/trips/${tripId}`, {
      skipGlobal404Redirect: true,
    });
  });

  it('throws "Trip not found" when API responds 404 (AxiosError)', async () => {
    const axios404 = {
      isAxiosError: true as const,
      response: { status: 404 },
    };

    (api.get as Mock).mockRejectedValueOnce(axios404);

    await expect(getTripDetail(tripId)).rejects.toThrow('Trip not found');
    expect(api.get).toHaveBeenCalledWith(`/users/trips/${tripId}`);
  });

  it('re-throws the original error for non-404 AxiosError', async () => {
    const axios500 = {
      isAxiosError: true as const,
      response: { status: 500 },
      message: 'Internal error',
    };

    (api.get as Mock).mockRejectedValueOnce(axios500);

    await expect(getTripDetail(tripId)).rejects.toEqual(axios500);
    expect(api.get).toHaveBeenCalledWith(`/users/trips/${tripId}`);
  });

  it('throws "networkError" for non-Axios errors', async () => {
    (api.get as Mock).mockRejectedValueOnce(new Error('Random failure'));

    await expect(getTripDetail(tripId)).rejects.toThrow('networkError');
    expect(api.get).toHaveBeenCalledWith(`/users/trips/${tripId}`);
  });
});

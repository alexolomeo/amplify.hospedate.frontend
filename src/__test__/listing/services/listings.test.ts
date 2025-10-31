import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api.ts';
import { SearchType } from '@/types/search';
import {
  fetchFilters,
  fetchListingAvailability,
  fetchListingsSearch,
  fetchListingById,
} from '@/services/listings.ts';
import type {
  ListingAvailibility,
  ListingDetail,
  PaginatedListings,
  ParamsListingAvailibility,
} from '@/types/listing/listing';
import type { Filters, QueryParams } from '@/types/search';
import { RuleType } from '@/types/enums/ruleType';
import { CheckInStartTime } from '@/types/enums/houseRules/checkInStartTime';
import { CheckInEndTime } from '@/types/enums/houseRules/checkInEndTime';
import { CheckoutTime } from '@/types/enums/houseRules/checkoutTime';

vi.mock('@/utils/api.ts', () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

describe('fetchListingById', () => {
  it('should return listing detail on success', async () => {
    const id = 1;
    const testDetail: ListingDetail = {
      id: 1,
      title: 'Hermoso Apartamento 1 dormitorio Equipe',
      description: '¡Departamento ideal para descansar!',
      showSpecificLocation: true,
      calendar: {
        availabilityWindowInDays: 180,
        minTripLength: 2,
        maxTripLength: 30,
        restrictedCheckInDays: [],
        restrictedCheckoutDays: [],
        advanceNoticeHours: 24,
        sameDayAdvanceNoticeTime: 14,
        allowRequestUnderAdvanceNoticeHours: false,
        preparationTimeInDays: 1,
      },
      host: {
        id: 2,
        username: 'Bruna Perez',
        profilePicture: {
          original: 'string',
          srcsetWebp: 'string',
          srcsetAvif: 'string',
        },
        score: 1,
        responseRate: 'dato',
        responseTime: 'dato',
        becameHostAt: 'dato',
        isSuperHost: true,
        totalReviews: 2,
      },
      location: {
        address: 'C. Caripui 27',
        city: 'Santa Cruz de la Sierra',
        state: 'Santa Cruz',
        country: 'Santa Cruz',
        coordinates: {
          latitude: -17.792877,
          longitude: -63.198228,
        },
      },
      amenities: [
        { name: 'Coffee maker', icon: 'coffee', amenityGroup: 'casa' },
        { name: 'Mini fridge', icon: 'fridge', amenityGroup: 'casa' },
        { name: 'Smoke alarm', icon: 'smoke', amenityGroup: 'casa' },
      ],
      spaces: [
        {
          id: 1,
          isDefault: false,
          name: 'Living Area',
          amenities: [],
          photos: [
            {
              original: 'http://example.com/image-1.jpeg',
              srcsetWebp:
                'http://example.com/image-1-480.webp 480w, http://example.com/image-1-768.webp 768w',
              srcsetAvif:
                'http://example.com/image-1-480.avif 480w, http://example.com/image-1-768.avif 768w',
              caption: 'Living Room',
              order: 1,
            },
          ],
        },
      ],
      pricing: {
        currency: 'USD',
        serviceFee: 12,
        subtotal: 10,
        weeklyDiscountAmount: 10,
        monthlyDiscountAmount: 10,
        total: 10,
        subtotalBeforeServiceFee: 10,
      },
      rating: {
        score: 4.6,
        overallRating: [
          {
            score: 4.6,
            count: 58,
          },
          {
            score: 4.7,
            count: 34,
          },
        ],
        ratingCategories: {
          cleanliness: 4.8,
          accuracy: 4.5,
          checkIn: 4.9,
          communication: 4.7,
          location: 4.6,
          value: 4.3,
        },
      },
      reviews: {
        totalReviews: 81,
        recentReviews: [
          {
            user: {
              id: 1,
              username: 'Arvel',
              profilePicture: {
                original: 'string',
                srcsetWebp: 'string',
                srcsetAvif: 'string',
              },
              city: 'Lake Robinstad',
              state: 'Kansas',
              country: 'Austria',
              becameUserAt: '2024-09-10',
            },
            score: 2.58,
            comment:
              'Tribuo tersus cribro vergo atavus odit. Auditor solitudo tunc volup ultio thesis commodo conforto vilicus antepono. Ter tres cohors decipio.',
            date: '2024-12-04',
            trip: {
              startDate: '2024-09-05',
              endDate: '2024-08-20',
              pets: 0,
              infants: 3,
            },
          },
        ],
      },
      houseRules: {
        checkInStartTime: CheckInStartTime.TIME_10_AM,
        checkInEndTime: CheckInEndTime.TIME_10_AM,
        checkoutTime: CheckoutTime.TIME_10_AM,
        guestNumber: 15,
        petsAllowed: false,
        pets: 0,
        eventsAllowed: true,
        smokingAllowed: false,
        quietHoursStartTime: '20:13',
        quietHoursEndTime: '20:39',
        commercialPhotographyAllowed: true,
        additionalRules:
          'Audeo derideo thymbra conitor certe fugiat crur ab usque doloremque. Tempore vestrum id. Pecus terminatio turba aegrotatio.\nItaque defetiscor canis tolero collum virtus teneo vesper cernuus. Decor constans alias voluntarius bos. Dens laudantium vesper suus socius maxime decor adnuo.\nAeneus suadeo depromo basium peccatus conventus defendo. Arx sufficio videlicet coruscus coma ater sustineo video amissio alius. Ab vulgaris arbitro coniuratio utrum cimentarius tamdiu.',
      },
      safetyProperty: {
        carbonMonoxideDetector: true,
        smokeDetector: true,
        expectationHasPets: true,
        expectationHasPetsDetails:
          'There are two friendly dogs in the backyard.',
        expectationRequireStairs: true,
        expectationRequireStairsDetails:
          'There are 2 flights of stairs to reach the apartment.',
        expectationSurveillance: false,
        expectationPotencialNoise: true,
        expectationPotencialNoiseDetails:
          'Occasional street noise during the day.',
      },
      placeInfo: {
        placeType: 'Apartment',
        guestNumber: 5,
        bedNumber: 21,
        roomNumber: 21,
        bathNumber: 27,
      },
      wishlisted: true,
    };

    (api.get as Mock).mockResolvedValueOnce({ data: testDetail });
    const result = await fetchListingById(id);
    expect(result).toEqual(testDetail);
    expect(api.get).toHaveBeenCalledWith(
      `/public/listings/${encodeURIComponent(id)}`
    );
  });

  it('should return null on error', async () => {
    const id = 99;

    (api.get as Mock).mockRejectedValueOnce(new Error('Not Found'));

    const result = await fetchListingById(id);

    expect(result).toBeNull();
    expect(api.get).toHaveBeenCalledWith(
      `/public/listings/${encodeURIComponent(id)}`
    );
  });
});

describe('fetchListingsSearch', () => {
  it('should return paginated listings when search is successful', async () => {
    const searchParams: QueryParams = {
      placeId: '1',
      checkInDate: '2024-04-01',
      checkoutDate: '2024-04-10',
      adults: 2,
      children: 1,
      infants: 1,
      numPets: 1,
      limit: 10,
      offset: 12,
      searchType: SearchType.List,
    };

    const testData: PaginatedListings = {
      limit: 10,
      offset: 0,
      count: 1,
      next: 'http://example.com?page=2',
      previous: null,
      results: [
        {
          id: 1,
          title: 'Test Listing',
          pricing: {
            subtotalBeforeServiceFee: 85,
            subtotal: 55,
            currency: 'USD',
            serviceFee: 20,
            weeklyDiscountAmount: 0,
            monthlyDiscountAmount: 0,
            total: 1213,
          },
          totalReviews: 5,
          score: 4.25,
          location: {
            address:
              '58325 Jennifer Estate Jefferyville, DE 26626, Santa Cruz de la Sierra, Santa Cruz',
            city: 'Santa Cruz de la Sierra',
            state: 'Santa Cruz',
            country: 'Bolivia',
            coordinates: {
              latitude: -17.7833,
              longitude: -63.1821,
            },
          },
          photos: [
            {
              original: '',
              srcsetWebp: '',
              srcsetAvif: '',
            },
          ],
          wishlisted: false,
          availabilitySummary: {
            startDate: '2025-04-01',
            endDate: '2025-04-30',
          },
          placeInfo: {
            placeType: 'Apartment',
            guestNumber: 5,
            bedNumber: 21,
            roomNumber: 21,
            bathNumber: 27,
          },
          highlighted: false,
        },
      ],
    };

    const queryParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === 'number') {
        if (key === 'offset' ? value >= 0 : value > 0) {
          queryParams.append(key, String(value));
        }
        return;
      }
      queryParams.append(key, String(value));
    });

    (api.get as Mock).mockResolvedValueOnce({ data: testData });

    const result = await fetchListingsSearch(searchParams);

    expect(result).toEqual(testData);
    expect(api.get).toHaveBeenCalledWith(
      `/public/listings/search?${queryParams.toString()}`,
      { signal: undefined }
    );
  });

  it('should return a default object on error', async () => {
    const searchParams: QueryParams = {
      placeId: '1',
      checkInDate: '2024-04-01',
      checkoutDate: '2024-04-10',
      adults: 2,
      children: 1,
      infants: 0,
      numPets: 0,
      limit: 10,
      offset: 0,
      searchType: SearchType.List,
    };

    (api.get as Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchListingsSearch(searchParams);

    expect(result).toEqual({
      limit: searchParams.limit,
      offset: searchParams.offset ?? 0,
      count: 0,
      next: null,
      previous: null,
      results: [],
    });
  });

  it('should serialize and include map bounds and zoom when searchType is MAP', async () => {
    const searchParams: QueryParams = {
      adults: 1,
      limit: 10,
      offset: 5,
      searchType: SearchType.Map,
      northEastLat: '-12.34',
      northEastLng: '56.78',
      southWestLat: '-23.45',
      southWestLng: '67.89',
      zoom: 5,
    };

    const queryParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === 'number') {
        if (key === 'offset' ? value >= 0 : value > 0) {
          queryParams.append(key, String(value));
        }
        return;
      }
      queryParams.append(key, String(value));
    });

    const testData: PaginatedListings = {
      limit: searchParams.limit,
      offset: searchParams.offset ?? 0,
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
    (api.get as Mock).mockResolvedValueOnce({ data: testData });
    const result = await fetchListingsSearch(searchParams);

    expect(api.get).toHaveBeenCalledWith(
      `/public/listings/search?${queryParams.toString()}`,
      { signal: undefined }
    );
    expect(result).toEqual(testData);
  });
});

describe('fetchListingAvailability', () => {
  it('should return availability data when request is successful', async () => {
    const listingId = 1;
    const params: ParamsListingAvailibility = {
      checkInDate: '2025-04-01',
      checkoutDate: '2025-04-10',
      adults: 2,
      children: 1,
      infants: 0,
      pets: 0,
    };

    const testAvailabilityData: ListingAvailibility = {
      isAvailable: true,
      pricing: {
        subtotalBeforeServiceFee: 1103,
        subtotal: 1213,
        currency: 'BOB',
        serviceFee: 110,
        weeklyDiscountAmount: 0,
        monthlyDiscountAmount: 0,
        total: 1213,
      },
      calendar: {
        blockedDates: ['2025-08-15Z', '2025-08-27Z', '2025-11-12Z'],
        bookedDates: [
          '2025-07-08Z',
          '2025-09-13Z',
          '2025-11-19Z',
          '2025-11-28Z',
        ],
        preparationTimeDates: [
          '2025-07-07Z',
          '2025-07-09Z',
          '2025-09-12Z',
          '2025-09-14Z',
          '2025-11-18Z',
          '2025-11-20Z',
          '2025-11-27Z',
          '2025-11-29Z',
        ],
      },
      cancellationPolicy: {
        name: 'Firm',
        policyType: 'STANDARD',
        summaryKey: 'cancellation_policy_standard_firm_summary',
        summaryPlaceholders: {
          deadline1: '2025-03-01T08:00:00',
          deadline2: '2025-03-17T08:00:00',
          deadline3: '2025-03-24T08:00:00',
          bookingWindowHours: 48,
          refundPercentage: 50,
        },
        rules: [
          {
            ruleType: RuleType.CheckInBased,
            deadline: '2025-03-01T08:00:00',
            bookingWindowHours: 0,
            refund: {
              percentage: 100,
              includeServiceFee: true,
            },
            nonRefundableNights: 0,
            descriptionKey:
              'cancellation_policy_standard_rule_firm_full_refund',
            descriptionPlaceholders: {
              deadline: '2025-03-01T08:00:00',
            },
          },
          {
            ruleType: RuleType.BookingBased,
            deadline: '2025-03-17T08:00:00',
            bookingWindowHours: 48,
            refund: {
              percentage: 100,
              includeServiceFee: true,
            },
            nonRefundableNights: 0,
            descriptionKey:
              'cancellation_policy_standard_rule_firm_full_refund_booking_window',
            descriptionPlaceholders: {
              deadline: '2025-03-17T08:00:00',
              bookingWindowHours: 48,
            },
          },
        ],
      },
    };

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    (api.get as Mock).mockResolvedValueOnce({ data: testAvailabilityData });
    const result = await fetchListingAvailability(listingId, params);
    expect(result).toEqual(testAvailabilityData);
    expect(api.get).toHaveBeenCalledWith(
      `/public/listings/${listingId}/availability?${queryParams.toString()}`
    );
  });

  it('should throw an error when request fails', async () => {
    const listingId = 1;
    const params: ParamsListingAvailibility = {
      checkInDate: '2025-04-01',
      checkoutDate: '2025-04-10',
      adults: 2,
      children: 1,
      infants: 0,
      pets: 0,
    };
    (api.get as Mock).mockRejectedValueOnce(new Error('Network error'));
    await expect(fetchListingAvailability(listingId, params)).rejects.toThrow(
      'Network error'
    );
  });
});

describe('fetchFilters', () => {
  it('should return filters when fetch is successful', async () => {
    const searchParams: QueryParams = {
      placeId: '1',
      checkInDate: '2024-04-01',
      checkoutDate: '2024-04-10',
      adults: 2,
      children: 1,
      infants: 1,
      numPets: 1,
      limit: 10,
      offset: 12,
      searchType: SearchType.List,
    };

    const testData: Filters = {
      priceRange: {
        min: 105,
        max: 8660,
        currency: 'BOB',
      },
      roomsAndBeds: {
        bedrooms: 8,
        beds: 8,
        baths: 8,
      },
      amenities: [
        { id: '1', name: 'adamo', icon: 'centum', amenityGroup: 'contra' },
        {
          id: '2',
          name: 'tabernus',
          icon: 'caelestis',
          amenityGroup: 'consectetur',
        },
        { id: '3', name: 'commodi', icon: 'aurum', amenityGroup: 'ullam' },
      ],
      reservationOptions: [
        { id: 'SELF_CHECK_IN', name: 'tenuis', icon: 'tres' },
        { id: 'ALLOWED_PETS', name: 'timidus', icon: 'crustulum' },
        { id: 'SELF_CHECK_IN', name: 'textilis', icon: 'voluptate' },
      ],
      propertyTypes: [
        { id: '4', name: 'tantillus', icon: 'catena' },
        { id: '5', name: 'celer', icon: 'termes' },
      ],
    };

    const queryParams = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === 'number') {
        if (key === 'offset' ? value >= 0 : value > 0) {
          queryParams.append(key, String(value));
        }
        return;
      }
      queryParams.append(key, String(value));
    });

    (api.get as Mock).mockResolvedValueOnce({ data: testData });

    const result = await fetchFilters(searchParams);

    expect(result).toEqual(testData);
    expect(api.get).toHaveBeenCalledWith(
      `/public/listings/filters?${queryParams.toString()}`,
      { signal: undefined }
    );
  });

  it('should return null on error', async () => {
    const searchParams: QueryParams = {
      placeId: '1',
      checkInDate: '2025-04-01',
      checkoutDate: '2025-04-10',
      adults: 2,
      children: 1,
      infants: 0,
      numPets: 0,
      limit: 10,
      offset: 0,
      searchType: SearchType.List,
    };

    (api.get as Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchFilters(searchParams);

    expect(result).toEqual(null);
  });
});

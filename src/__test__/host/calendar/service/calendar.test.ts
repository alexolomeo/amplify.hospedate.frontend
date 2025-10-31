import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api';
import {
  fetchCalendarPreferenceSettingValue,
  fetchCalendarPreferenceSettingCatalog,
  fetchCalendar,
  fetchCalendarAvailability,
  updateCalendarAvailability,
  updateCalendarPreferenceSetting,
} from '@/services/host/calendar';
import type { HostCalendar } from '@/types/host/calendar/hostCalendar';
import {
  EnumAdvanceNoticeHours,
  type CalendarPreferenceSettingCatalog,
  type CalendarPreferenceSettingValues,
  type UpdateCalendarPreferenceSetting,
} from '@/types/host/calendar/preferenceSetting';
import {
  SelectedType,
  type Availability,
  type UpdateAvailability,
} from '@/types/host/calendar/availability';

vi.mock('@/utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('fetchCalendarPreferenceSettingValue', () => {
  it('should return settings values when successful', async () => {
    const listingId = 123;
    const testData: CalendarPreferenceSettingValues = {
      priceSection: {
        perNight: 100,
        perWeekend: 120,
        discounts: {
          monthly: 0.25,
          weekly: 0.25,
        },
        currency: 'BOB',
      },

      availabilitySection: {
        notice: {
          advanceNoticeHours: 24,
          allowRequestSameDay: false,
          sameDayAdvanceNoticeTime: 5,
        },
        tripDuration: {
          min: 1,
          max: 30,
        },
      },
      syncCalendarSection: {
        calendarLink:
          'https://www.hospedatebolivia.com/calendar/ical?s=f36109c7-606a-46ed-a00f-624935c64aa9',
        syncCalendars: [
          {
            id: 1,
            name: 'Oberbrunner, Kunze and Veum',
            url: 'https://aching-footrest.info',
            updatedAt: 'string',
          },
        ],
      },
    };

    (api.get as Mock).mockResolvedValueOnce({ data: testData });

    const result = await fetchCalendarPreferenceSettingValue(listingId);

    expect(result).toEqual(testData);
    expect(api.get).toHaveBeenCalledWith(
      `/hostings/listings/${listingId}/calendars/settings/values`
    );
  });

  it('should return null on failure', async () => {
    (api.get as Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchCalendarPreferenceSettingValue(123);

    expect(result).toBeNull();
    expect(api.get).toHaveBeenCalledWith(
      `/hostings/listings/123/calendars/settings/values`
    );
  });
});

describe('fetchCalendarPreferenceSettingCatalog', () => {
  it('should return the catalog when successful', async () => {
    const testData: CalendarPreferenceSettingCatalog = {
      availabilitySection: {
        advanceNoticeHours: [
          {
            id: 15,
            name: 'SAME_DAY',
          },
          {
            id: 24,
            name: 'AT_LEAST_ONE_DAY',
          },
        ],
        sameDayAdvanceNoticeTime: [
          {
            id: 0,
            name: '12 a.m.',
          },
          {
            id: 1,
            name: '1 a.m.',
          },
        ],
      },
    };

    (api.get as Mock).mockResolvedValueOnce({ data: testData });
    const result = await fetchCalendarPreferenceSettingCatalog();
    expect(result).toEqual(testData);
    expect(api.get).toHaveBeenCalledWith(
      `/hostings/listings/calendars/settings/catalogs`
    );
  });

  it('should return null on failure', async () => {
    (api.get as Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchCalendarPreferenceSettingCatalog();

    expect(result).toBeNull();
    expect(api.get).toHaveBeenCalledWith(
      `/hostings/listings/calendars/settings/catalogs`
    );
  });
});

describe('fetchCalendar', () => {
  it('should return calendar data when successful', async () => {
    const listingId = '5';
    const testData: HostCalendar = {
      availabilityWindowInDays: 365,
      calendarDates: [],
      bookedDates: [],
    };

    (api.get as Mock).mockResolvedValueOnce({ data: testData });
    const result = await fetchCalendar(listingId);
    expect(result).toEqual(testData);
    expect(api.get).toHaveBeenCalledWith(
      `/hostings/listings/${listingId}/calendars`
    );
  });

  it('should return null on failure', async () => {
    const listingId = '5';
    (api.get as Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchCalendar(listingId);

    expect(result).toBeNull();
    expect(api.get).toHaveBeenCalledWith(
      `/hostings/listings/${listingId}/calendars`
    );
  });
});

describe('fetchCalendarAvailability', () => {
  it('should return availability data when the API call is successful', async () => {
    const listingId = 123;
    const dates = [
      new Date('2024-10-27T00:00:00Z'),
      new Date('2024-10-28T00:00:00Z'),
    ];
    const testData: Availability = {
      availabilitySection: {
        selectedType: SelectedType.Mixed,
        mixedAvailability: {
          blockedNights: 2,
          nightsAvailable: 5,
          notes: 1,
        },
      },
      note: 'This is a note for the day.',
      priceSection: {
        selectedType: SelectedType.Mixed,
        mixedPrice: {
          min: 100,
          max: 200,
        },
        summary: {
          basePrice: 120,
          guestPrice: 130,
          guestServiceFee: 20,
          hostPrice: 110,
        },
      },
    };

    (api.get as Mock).mockResolvedValueOnce({ data: testData });
    const result = await fetchCalendarAvailability(listingId, dates);
    expect(result).toEqual(testData);
    const expectedUrl = `/hostings/listings/123/calendars/availability?dates=2024-10-27&dates=2024-10-28`;
    expect(api.get).toHaveBeenCalledWith(expectedUrl);
  });

  it('should return null on API call failure', async () => {
    const listingId = 123;
    const dates = [new Date('2024-10-27T00:00:00Z')];
    vi.spyOn(console, 'error').mockImplementationOnce(() => {});

    (api.get as Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchCalendarAvailability(listingId, dates);

    expect(result).toBeNull();
    const expectedUrl = `/hostings/listings/123/calendars/availability?dates=2024-10-27`;
    expect(api.get).toHaveBeenCalledWith(expectedUrl);
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle an empty array of dates correctly', async () => {
    const listingId = 123;
    const dates: Date[] = [];
    const testData: Availability = {
      availabilitySection: {
        selectedType: SelectedType.Mixed,
        mixedAvailability: {},
      },
      priceSection: {
        selectedType: SelectedType.Mixed,
        summary: {
          basePrice: 0,
          guestPrice: 0,
          guestServiceFee: 0,
          hostPrice: 0,
        },
      },
    };

    (api.get as Mock).mockResolvedValueOnce({ data: testData });

    const result = await fetchCalendarAvailability(listingId, dates);

    const expectedUrl = `/hostings/listings/123/calendars/availability?`;
    expect(result).toEqual(testData);
    expect(api.get).toHaveBeenCalledWith(expectedUrl);
  });
});

describe('updateCalendarAvailability', () => {
  it('should return true when the API call is successful', async () => {
    const listingId = 123;
    const dates = [new Date('2024-10-27T00:00:00Z')];
    const body: UpdateAvailability = {
      availabilitySection: { availability: true },
      priceSection: { nightlyPrice: 150 },
      note: 'Updated note',
    };

    (api.post as Mock).mockResolvedValueOnce({ status: 200, data: {} });

    const result = await updateCalendarAvailability(listingId, dates, body);

    expect(result).toBe(true);
    const expectedUrl = `/hostings/listings/123/calendars/availability?dates=2024-10-27`;
    expect(api.post).toHaveBeenCalledWith(expectedUrl, body);
  });

  it('should return false when the API call fails', async () => {
    const listingId = 123;
    const dates = [new Date('2024-10-27T00:00:00Z')];
    const body: UpdateAvailability = {
      availabilitySection: { availability: true },
    };

    // We prevent the error from being printed in the console during the test.
    vi.spyOn(console, 'error').mockImplementationOnce(() => {});

    (api.post as Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await updateCalendarAvailability(listingId, dates, body);

    expect(result).toBe(false);
    const expectedUrl = `/hostings/listings/123/calendars/availability?dates=2024-10-27`;
    expect(api.post).toHaveBeenCalledWith(expectedUrl, body);
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle an empty array of dates correctly', async () => {
    const listingId = 123;
    const dates: Date[] = [];
    const body: UpdateAvailability = {
      priceSection: { nightlyPrice: 200 },
    };

    (api.post as Mock).mockResolvedValueOnce({ status: 200 });

    const result = await updateCalendarAvailability(listingId, dates, body);

    const expectedUrl = `/hostings/listings/123/calendars/availability?`;
    expect(result).toBe(true);
    expect(api.post).toHaveBeenCalledWith(expectedUrl, body);
  });
});

describe('updateCalendarPreferenceSetting', () => {
  it('should return true when the API call is successful', async () => {
    const listingId = 123;
    const body: UpdateCalendarPreferenceSetting = {
      priceSection: {
        discounts: { monthly: 0.1, weekly: 0.05 },
        perNight: 100,
        perWeekend: 120,
      },
      availabilitySection: {
        notice: {
          advanceNoticeHours: EnumAdvanceNoticeHours.AT_LEAST_ONE_DAY,
          allowRequestSameDay: false,
          sameDayAdvanceNoticeTime: 5,
        },
        tripDuration: { min: 1, max: 30 },
      },
    };

    (api.patch as Mock).mockResolvedValueOnce({ status: 200, data: {} });

    const result = await updateCalendarPreferenceSetting(listingId, body);

    expect(result).toBe(true);
    const expectedUrl = `/hostings/listings/123/calendars/settings/values`;
    expect(api.patch).toHaveBeenCalledWith(expectedUrl, body);
  });

  it('should return false on API call failure', async () => {
    const listingId = 123;
    const body: UpdateCalendarPreferenceSetting = {
      priceSection: {
        discounts: { monthly: null, weekly: null },
        perNight: 100,
        perWeekend: null,
      },
    };

    // We prevent the error from being printed in the console during the test.
    vi.spyOn(console, 'error').mockImplementationOnce(() => {});

    (api.patch as Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await updateCalendarPreferenceSetting(listingId, body);

    expect(result).toBe(false);
    const expectedUrl = `/hostings/listings/123/calendars/settings/values`;
    expect(api.patch).toHaveBeenCalledWith(expectedUrl, body);
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle a partial update body correctly', async () => {
    const listingId = 123;
    const body: UpdateCalendarPreferenceSetting = {
      availabilitySection: {
        notice: {
          advanceNoticeHours: EnumAdvanceNoticeHours.SAME_DAY,
          allowRequestSameDay: true,
          sameDayAdvanceNoticeTime: 2,
        },
        tripDuration: { min: 1, max: 7 },
      },
    };

    (api.patch as Mock).mockResolvedValueOnce({ status: 200, data: {} });

    const result = await updateCalendarPreferenceSetting(listingId, body);

    expect(result).toBe(true);
    const expectedUrl = `/hostings/listings/123/calendars/settings/values`;
    expect(api.patch).toHaveBeenCalledWith(expectedUrl, body);
  });
});

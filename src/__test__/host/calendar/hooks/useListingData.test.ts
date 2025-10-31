import { describe, it, expect, vi, type Mock } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import * as services from '@/services/host/calendar';
import type { HostCalendar } from '@/types/host/calendar/hostCalendar';
import type {
  CalendarPreferenceSettingCatalog,
  CalendarPreferenceSettingValues,
} from '@/types/host/calendar/preferenceSetting';
import { useListingData } from '@/components/React/Hooks/Calendar/useListingData';

vi.mock('@/services/host/calendar', () => ({
  fetchCalendar: vi.fn(),
  fetchCalendarPreferenceSettingValue: vi.fn(),
  fetchCalendarPreferenceSettingCatalog: vi.fn(),
}));

const mockCalendarData: HostCalendar = {
  calendarDates: [],
  bookedDates: [],
  availabilityWindowInDays: 365,
};

const mockValuesData: CalendarPreferenceSettingValues = {
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
        updatedAt: '12/23',
      },
    ],
  },
};

const mockCatalogsData: CalendarPreferenceSettingCatalog = {
  availabilitySection: {
    advanceNoticeHours: [
      { id: 15, name: 'SAME_DAY' },
      { id: 24, name: 'AT_LEAST_ONE_DAY' },
    ],
    sameDayAdvanceNoticeTime: [
      { id: 0, name: '12 a.m.' },
      { id: 1, name: '1 a.m.' },
    ],
  },
};
beforeEach(() => {
  vi.clearAllMocks();
});

describe('useListingData', () => {
  it('should fetch all data and set correct state on success', async () => {
    (services.fetchCalendar as Mock).mockResolvedValue(mockCalendarData);
    (services.fetchCalendarPreferenceSettingValue as Mock).mockResolvedValue(
      mockValuesData
    );
    (services.fetchCalendarPreferenceSettingCatalog as Mock).mockResolvedValue(
      mockCatalogsData
    );

    const { result } = renderHook(() => useListingData(123));

    // 1. initial status
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.calendarData).toBeNull();
    expect(result.current.values).toBeNull();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.calendarData).toEqual(mockCalendarData);
    expect(result.current.values).toEqual(mockValuesData);

    // Verify that the functions were called with the correct arguments
    expect(services.fetchCalendar).toHaveBeenCalledWith('123');
    expect(services.fetchCalendarPreferenceSettingValue).toHaveBeenCalledWith(
      123
    );
  });

  it('should handle catalog fetch error gracefully', async () => {
    (
      services.fetchCalendarPreferenceSettingCatalog as Mock
    ).mockRejectedValueOnce(new Error('Catalog error'));
    (services.fetchCalendar as Mock).mockResolvedValue(mockCalendarData);
    (services.fetchCalendarPreferenceSettingValue as Mock).mockResolvedValue(
      mockValuesData
    );
    const { result } = renderHook(() => useListingData(123));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // The hook must load the other data but the catalog must be null
    expect(result.current.calendarData).toEqual(mockCalendarData);
    expect(result.current.values).toEqual(mockValuesData);
    expect(result.current.error).toBeNull();
  });

  it('should set an error state if main data fetching fails', async () => {
    (services.fetchCalendar as Mock).mockRejectedValueOnce(
      new Error('Calendar error')
    );
    (services.fetchCalendarPreferenceSettingValue as Mock).mockResolvedValue(
      mockValuesData
    );
    (services.fetchCalendarPreferenceSettingCatalog as Mock).mockResolvedValue(
      mockCatalogsData
    );

    const { result } = renderHook(() => useListingData(123));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('An unexpected error occurred.');
    expect(result.current.calendarData).toBeNull();
    expect(result.current.values).toBeNull();
  });

  it('should handle a null listingId and not call any services', async () => {
    const { result } = renderHook(() => useListingData(null));

    // You should not start the charge.
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Listing ID is missing or invalid.');
    expect(result.current.calendarData).toBeNull();
    expect(result.current.values).toBeNull();

    // Check that no API service was called.
    expect(services.fetchCalendar).not.toHaveBeenCalled();
    expect(services.fetchCalendarPreferenceSettingValue).not.toHaveBeenCalled();
  });
});

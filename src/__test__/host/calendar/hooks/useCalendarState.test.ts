import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as calendarHelpers from '@/utils/calendarHelpers';
import type { Listing } from '@/types/host/listing';
import { useCalendarState } from '@/components/React/Hooks/Calendar/useCalendarState';
import type { SelectedDayInfo } from '@/components/React/Host/Calendar/CalendarContainer';

vi.mock('@/utils/calendarHelpers', () => ({
  isContinuousRange: vi.fn(),
}));

const mockPushState = vi.fn();
Object.defineProperty(window, 'history', {
  value: {
    pushState: mockPushState,
  },
  writable: true,
});

const mockListing: Listing = {
  id: 1,
  title: 'Apartment 1',
  status: 'PUBLISHED',
  createdAt: '2024-01-01T00:00:00Z',
  propertyType: 'home',
  location: {
    address: '123 Main St',
    city: 'City',
    country: 'Country',
    state: 'State',
  },
  photo: { original: '', srcsetWebp: '', srcsetAvif: '' },
};

const mockListing2: Listing = {
  id: 2,
  title: 'Apartment 2',
  status: 'PUBLISHED',
  createdAt: '2024-01-02T00:00:00Z',
  propertyType: 'home',
  location: {
    address: '456 Second Ave',
    city: 'City',
    country: 'Country',
    state: 'State',
  },
  photo: { original: '', srcsetWebp: '', srcsetAvif: '' },
};

const mockDayInfo: SelectedDayInfo = {
  dates: [new Date('2025-01-10T00:00:00Z')],
};

const mockDayInfoRange: SelectedDayInfo = {
  dates: [new Date('2025-01-10T00:00:00Z'), new Date('2025-01-11T00:00:00Z')],
};

describe('useCalendarState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize state with initial props', () => {
    const { result } = renderHook(() =>
      useCalendarState(mockListing, mockDayInfo)
    );

    expect(result.current.selectedListing).toEqual(mockListing);
    expect(result.current.selectedDayInfo).toEqual(mockDayInfo);
    expect(result.current.isPanelOpen).toBe(false);
    expect(result.current.isModalListingOpen).toBe(false);
  });

  it('should update selectedListing when initialListing prop changes', async () => {
    const { result, rerender } = renderHook(
      ({ initialListing }) => useCalendarState(initialListing, null),
      {
        initialProps: { initialListing: mockListing },
      }
    );

    expect(result.current.selectedListing).toEqual(mockListing);

    rerender({ initialListing: mockListing2 });

    act(() => {});

    expect(result.current.selectedListing).toEqual(mockListing2);
  });

  it('should update selectedDayInfo and push a continuous date range URL', () => {
    (calendarHelpers.isContinuousRange as Mock).mockReturnValue(true);
    const { result } = renderHook(() => useCalendarState(mockListing, null));

    act(() => {
      result.current.handleDaySelection(mockDayInfoRange);
    });

    expect(result.current.selectedDayInfo).toEqual(mockDayInfoRange);
    expect(mockPushState).toHaveBeenCalledWith(
      {},
      '',
      `/hosting/calendar/1/dates/2025-01-10/2025-01-11`
    );
  });

  it('should push a simple listing URL for a non-continuous date range', () => {
    (calendarHelpers.isContinuousRange as Mock).mockReturnValue(false);
    const { result } = renderHook(() => useCalendarState(mockListing, null));

    act(() => {
      result.current.handleDaySelection(mockDayInfo);
    });

    expect(result.current.selectedDayInfo).toEqual(mockDayInfo);
    expect(mockPushState).toHaveBeenCalledWith({}, '', '/hosting/calendar/1');
  });

  it('should update selectedListing, reset day info, and push a new listing URL', () => {
    const { result } = renderHook(() =>
      useCalendarState(mockListing, mockDayInfo)
    );

    act(() => {
      result.current.handleListingSelect(mockListing2);
    });

    expect(result.current.selectedListing).toEqual(mockListing2);
    expect(result.current.selectedDayInfo).toBeNull();
    expect(mockPushState).toHaveBeenCalledWith({}, '', '/hosting/calendar/2');
  });

  it('should correctly sort dates and push the URL for a continuous range', () => {
    (calendarHelpers.isContinuousRange as Mock).mockReturnValue(true);
    const { result } = renderHook(() => useCalendarState(mockListing, null));

    const unorderedDayInfoRange: SelectedDayInfo = {
      dates: [
        new Date('2025-01-12T00:00:00Z'),
        new Date('2025-01-10T00:00:00Z'),
        new Date('2025-01-11T00:00:00Z'),
      ],
    };

    // Call the function with the unordered date range.
    act(() => {
      result.current.handleDaySelection(unorderedDayInfoRange);
    });

    // Verify that the status has been updated correctly.
    expect(result.current.selectedDayInfo).toEqual(unorderedDayInfoRange);
    expect(mockPushState).toHaveBeenCalledWith(
      {},
      '',
      `/hosting/calendar/1/dates/2025-01-10/2025-01-12`
    );
  });
});

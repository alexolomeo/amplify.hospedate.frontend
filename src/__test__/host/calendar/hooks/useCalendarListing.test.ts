import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import * as listingsService from '@/services/host/listings';
import type { Listing, ListingsResponse } from '@/types/host/listing';
import { useCalendarListing } from '@/components/React/Hooks/Calendar/useCalendarListing';

vi.mock('@/services/host/listings', () => ({
  fetchHostListings: vi.fn(),
}));
vi.mock('astro:transitions/client', () => ({
  navigate: vi.fn(),
}));

const mockListings: Listing[] = [
  {
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
  },
  {
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
  },
];
const mockListingsResponse: ListingsResponse = {
  results: mockListings,
  count: 2,
  limit: 10,
  offset: 0,
  next: null,
  previous: null,
};

describe('useCalendarListing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch listings and set state correctly on success', async () => {
    (listingsService.fetchHostListings as Mock).mockResolvedValue(
      mockListingsResponse
    );
    const { result } = renderHook(() => useCalendarListing({}));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.listings).toEqual(mockListings);
    expect(result.current.selectedListing).toEqual(mockListings[0]); // Defaults to the first listing
    expect(result.current.selectedDayInfo).toBeNull();
    expect(listingsService.fetchHostListings).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors gracefully', async () => {
    (listingsService.fetchHostListings as Mock).mockRejectedValue(
      new Error('Network error')
    );
    const { result } = renderHook(() => useCalendarListing({}));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('Error fetching listings');
    expect(result.current.listings).toEqual([]);
    expect(result.current.selectedListing).toBeNull();
  });

  it('should select the correct listing from the URL ID', async () => {
    (listingsService.fetchHostListings as Mock).mockResolvedValue(
      mockListingsResponse
    );
    const { result } = renderHook(() =>
      useCalendarListing({ listingIdFromUrl: 2 })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Assert that the correct listing was selected
    expect(result.current.selectedListing).toEqual(mockListings[1]);
    expect(result.current.error).toBeNull();
  });

  it('should default to the first listing if URL ID is invalid', async () => {
    (listingsService.fetchHostListings as Mock).mockResolvedValue(
      mockListingsResponse
    );
    const { result } = renderHook(() =>
      useCalendarListing({ listingIdFromUrl: 999 })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Assert that it defaults to the first listing
    expect(result.current.selectedListing).toEqual(mockListings[0]);
    expect(result.current.error).toBeNull();
  });
});

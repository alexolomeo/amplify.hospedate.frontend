import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { fetchFilters, fetchListingsSearch } from '@/services/listings';
import { useListingsSearcher } from '@/components/React/Hooks/useListingsSearcher';
import {
  $pagination,
  $listings,
  $isLoading,
  $searchMode,
  $params,
  $onlyPriceChanged,
} from '@/stores/searchStore';
import { SearchType } from '@/types/search';
import type { Listing } from '@/types/listing/listing';

vi.mock('@/services/listings', () => ({
  fetchListingsSearch: vi.fn(),
  fetchFilters: vi.fn(),
}));

describe('useListingsSearcher', () => {
  beforeEach(() => {
    $params.set({ adults: 1 });
    $pagination.set({ limit: 5, offset: 2, count: 100 });
    $searchMode.set(SearchType.List);
    $listings.set([]);
    $isLoading.set(false);
    $onlyPriceChanged.set(false);

    (fetchListingsSearch as Mock).mockReset();
    (fetchFilters as Mock).mockReset();
  });

  it('sets $isLoading=true, calls the service, and updates atoms on success', async () => {
    const mockResponse = {
      limit: 5,
      offset: 2,
      count: 42,
      results: [{ id: 123, title: 'Test Listing' }],
    };
    (fetchListingsSearch as Mock).mockResolvedValueOnce(mockResponse);

    const mockFilters = {
      priceRange: { min: 0, max: 9999, currency: 'USD' },
      roomsAndBeds: {},
      amenities: [],
      reservationOptions: [],
      propertyTypes: [],
    };
    (fetchFilters as Mock).mockResolvedValueOnce(mockFilters);

    const { result } = renderHook(() => useListingsSearcher());

    await act(async () => {
      const p = result.current.search();
      expect($isLoading.get()).toBe(true);
      await p;
    });

    expect(fetchListingsSearch).toHaveBeenCalledWith(
      {
        adults: 1,
        limit: 5,
        offset: 2,
        searchType: SearchType.List,
      },
      expect.objectContaining({ signal: expect.any(Object) })
    );

    expect(fetchFilters).toHaveBeenCalledWith(
      {
        adults: 1,
        limit: 5,
        offset: 2,
        searchType: SearchType.List,
      },
      expect.objectContaining({ signal: expect.any(Object) })
    );

    expect($listings.get()).toEqual(mockResponse.results);
    expect($pagination.get()).toEqual({
      limit: mockResponse.limit,
      offset: mockResponse.offset,
      count: mockResponse.count,
    });
    expect($isLoading.get()).toBe(false);
  });

  it('clears $listings and resets count/offset in case of failure', async () => {
    (fetchListingsSearch as Mock).mockRejectedValueOnce(new Error('fail'));

    const dummy = { id: 1 } as Listing;
    $listings.set([dummy]);
    $pagination.set({ limit: 5, offset: 2, count: 10 });

    const { result } = renderHook(() => useListingsSearcher());
    await act(async () => {
      await result.current.search();
    });

    expect($listings.get()).toEqual([]);
    const { count, offset } = $pagination.get();
    expect(count).toBe(0);
    expect(offset).toBe(0);
    expect($isLoading.get()).toBe(false);
  });
});

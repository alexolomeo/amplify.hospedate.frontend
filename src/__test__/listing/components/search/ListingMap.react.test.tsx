import React from 'react';
import { render, act } from '@testing-library/react';
import ListingMap from '@/components/React/Listing/DisplayMap/ListingMap';
import { fetchListingsSearch } from '@/services/listings';
import type { QueryParams } from '@/types/search';
import { SearchType } from '@/types/search';
import type { Listing } from '@/types/listing/listing';

jest.mock('@/services/listings', () => ({
  fetchListingsSearch: jest.fn(),
}));
const mockedFetch = fetchListingsSearch as unknown as jest.MockedFunction<
  (params: QueryParams) => Promise<{ results: Listing[] }>
>;

import type { ListingGoogleMapProps } from '@/components/React/Search/SearchResult/ListingGoogleMap';
let lastProps: ListingGoogleMapProps | null = null;
jest.mock('@/components/React/Search/SearchResult/ListingGoogleMap', () => ({
  __esModule: true,
  default: (props: ListingGoogleMapProps) => {
    lastProps = props;
    return <div data-testid="map-stub" />;
  },
}));

describe('ListingMap', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockedFetch.mockReset();
    lastProps = null;
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('triggers initial search on mount with default bounds', async () => {
    mockedFetch.mockResolvedValueOnce({ results: [{ id: 1 } as Listing] });

    await act(async () => {
      render(<ListingMap lang="es" />);
    });

    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockedFetch).toHaveBeenCalledWith({
      searchType: SearchType.Map,
      limit: 50,
      adults: 1,
      northEastLat: '-9.68',
      northEastLng: '-57.47',
      southWestLat: '-22.91',
      southWestLng: '-69.65',
      zoom: 6,
    });

    expect(lastProps).not.toBeNull();
    expect(lastProps!.isLoading).toBe(false);
    expect(lastProps!.listings).toEqual([{ id: 1 } as Listing]);
  });

  it('applies debounce on onMapMove and calls after 500ms', async () => {
    mockedFetch.mockResolvedValue({ results: [] });

    await act(async () => {
      render(<ListingMap lang="es" />);
    });
    expect(mockedFetch).toHaveBeenCalledTimes(1);

    act(() => {
      lastProps!.onMapMove(
        {
          bounds: {
            northEastLat: 1,
            northEastLng: 2,
            southWestLat: 3,
            southWestLng: 4,
          },
          zoom: 5,
        },
        undefined
      );
    });

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(mockedFetch).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(mockedFetch).toHaveBeenCalledTimes(2);
    expect(mockedFetch).toHaveBeenLastCalledWith({
      searchType: SearchType.Map,
      limit: 50,
      adults: 1,
      northEastLat: '1',
      northEastLng: '2',
      southWestLat: '3',
      southWestLng: '4',
      zoom: 5,
    });
  });
});

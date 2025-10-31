import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  $params,
  $pagination,
  $searchMode,
  $isLoading,
  $listings,
} from '@/stores/searchStore';
import SearchResultContainer from '@/components/React/Search/SearchResult/SearchResultContainer';
import { SearchType } from '@/types/search';
import type { Listing } from '@/types/listing/listing';

const searchMock = jest.fn();
jest.mock('@/components/React/Hooks/useListingsSearcher', () => ({
  __esModule: true,
  useListingsSearcher: () => ({ search: searchMock }),
}));

jest.mock('@/components/React/Common/AppIcon', () => {
  const MockAppIcon = ({
    iconName,
    className,
  }: {
    iconName: string;
    className: string;
  }) => (
    <span data-testid={`mock-icon-${iconName}`} className={className}>
      {iconName}
    </span>
  );
  MockAppIcon.displayName = 'MockAppIcon';
  return MockAppIcon;
});

jest.mock('@/components/React/Search/SearchResult/ListingGoogleMap', () => ({
  __esModule: true,
  default: () => <div data-testid="map" />,
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let lastCardsProps: any = null;
jest.mock('@/components/React/Search/SearchResult/SearchCardResult', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    lastCardsProps = props;
    return <div data-testid="cards" />;
  },
}));

const dummyListing: Listing = {
  id: 1,
  title: 'Test',
  pricing: {
    subtotalBeforeServiceFee: 0,
    subtotal: 0,
    currency: 'USD',
    serviceFee: 0,
    weeklyDiscountAmount: 0,
    monthlyDiscountAmount: 0,
    total: 0,
  },
  totalReviews: 0,
  score: 0,
  location: {
    address: '',
    city: '',
    state: '',
    country: '',
    coordinates: { latitude: 0, longitude: 0 },
  },
  photos: [],
  wishlisted: false,
  availabilitySummary: { startDate: '', endDate: '' },
  placeInfo: {
    placeType: '',
    guestNumber: 1,
    roomNumber: 1,
    bedNumber: 1,
    bathNumber: 1,
  },
  highlighted: false,
};

describe('<SearchResultContainer>', () => {
  const baseQuery = {
    placeId: 'X',
    checkInDate: '2025-07-01',
    checkoutDate: '2025-07-05',
    adults: 2,
    children: 0,
    infants: 0,
    numPets: 0,
    limit: 12,
    offset: 0,
    searchType: SearchType.List,
  };

  beforeEach(() => {
    searchMock.mockClear();
    lastCardsProps = null;
    $params.set({});
    $pagination.set({ limit: 12, offset: 0, count: 0 });
    $searchMode.set(SearchType.List);
    $isLoading.set(false);
    $listings.set([]);
  });

  it('calls search() on mount and syncs filters and pagination', () => {
    render(<SearchResultContainer queryParams={baseQuery} lang="en" />);
    expect(searchMock).toHaveBeenCalledTimes(1);

    const f = $params.get();
    expect(f.placeId).toBe(baseQuery.placeId);
    expect(f.checkInDate).toBe(baseQuery.checkInDate);

    const p = $pagination.get();
    expect(p.limit).toBe(baseQuery.limit);
    expect(p.offset).toBe(baseQuery.offset);
  });

  it('renders the map and cards when listings arrive', () => {
    $listings.set([dummyListing]);
    render(<SearchResultContainer queryParams={baseQuery} lang="en" />);
    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect(screen.getByTestId('cards')).toBeInTheDocument();
  });

  it('calling onPageChange from SearchCardResult calls search()', () => {
    $listings.set([dummyListing]);
    $pagination.set({ limit: 10, offset: 0, count: 20 });
    render(<SearchResultContainer queryParams={baseQuery} lang="en" />);

    expect(typeof lastCardsProps.onPageChange).toBe('function');
    lastCardsProps.onPageChange(10);
    expect(searchMock).toHaveBeenCalledTimes(2);
  });
});

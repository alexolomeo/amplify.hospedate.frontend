import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchCardResult from '@/components/React/Search/SearchResult/SearchCardResult';
import { $listings, $pagination, $isLoading } from '@/stores/searchStore';
import type { Listing } from '@/types/listing/listing';

jest.mock('@/components/React/Listing/ListingCard', () => ({
  __esModule: true,
  default: ({ listing }: { listing: Listing }) => (
    <div data-testid="listing-card">{listing.id}</div>
  ),
}));

jest.mock('@/utils/i18n', () => ({
  __esModule: true,
  getTranslation: () => ({
    listings: { listingsFound: 'listingsFound' },
    search: {
      noResultsFound: 'noResultsFound',
      adjustFilters: 'adjustFilters',
    },
  }),
  translate: (_t: object, str: string) => str,
}));

describe('SearchCardResult', () => {
  const fakeListing1: Listing = {
    id: 1,
    title: 'A',
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
    placeInfo: {
      placeType: 'Apartment',
      guestNumber: 1,
      roomNumber: 1,
      bedNumber: 1,
      bathNumber: 1,
    },
    highlighted: false,
  };

  const fakeListing2 = { ...fakeListing1, id: 2 };

  beforeEach(() => {
    $isLoading.set(false);
    $listings.set([]);
    $pagination.set({ offset: 0, limit: 1, count: 0 });
  });

  it('shows skeleton when isLoading=true', () => {
    $isLoading.set(true);
    render(
      <SearchCardResult
        onPageChange={jest.fn()}
        onListingHover={jest.fn()}
        lang="es"
      />
    );
    expect(screen.getByTestId('cards-skeleton')).toBeInTheDocument();
  });

  it('renders cards and pagination correctly', () => {
    $listings.set([fakeListing1, fakeListing2]);
    $pagination.set({ offset: 0, limit: 1, count: 2 });

    const onPageChange = jest.fn();
    const onListingHover = jest.fn();

    render(
      <SearchCardResult
        onPageChange={onPageChange}
        onListingHover={onListingHover}
        lang="es"
      />
    );

    expect(screen.getByText('2 listingsFound')).toBeInTheDocument();
    expect(screen.getAllByTestId('listing-card')).toHaveLength(2);

    const page1 = screen.getByRole('button', { name: '1' });
    const page2 = screen.getByRole('button', { name: '2' });
    expect(page1).toBeDisabled();
    expect(page2).not.toBeDisabled();

    fireEvent.click(page2);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('shows no-results message when there are no listings', () => {
    $listings.set([]);
    $pagination.set({ offset: 0, limit: 10, count: 0 });

    render(
      <SearchCardResult
        onPageChange={jest.fn()}
        onListingHover={jest.fn()}
        lang="es"
      />
    );

    expect(screen.getByText('noResultsFound')).toBeInTheDocument();
    expect(screen.getByText('adjustFilters')).toBeInTheDocument();
  });
});

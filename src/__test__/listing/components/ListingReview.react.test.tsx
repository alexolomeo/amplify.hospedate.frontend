import React from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  fetchListingReviews,
  fetchListingReviewsSearch,
} from '@/services/listings';
import { SortReview } from '@/types/enums/sortReview';
import type { PaginatedReviews } from '@/types/listing/review';
import ListingReview from '@/components/React/Listing/ListingReview';

// Mock the modules and hooks
jest.mock('@/services/listings', () => ({
  fetchListingReviews: jest.fn() as jest.Mock,
  fetchListingReviewsSearch: jest.fn() as jest.Mock,
}));

jest.mock('@/components/React/Hooks/useInfiniteScroll', () => ({
  useInfiniteScroll: jest.fn(),
}));

// Mock timers to handle debounce
jest.useFakeTimers();

const mockInitialReviews: PaginatedReviews = {
  results: Array.from({ length: 5 }, (_, i) => ({
    user: {
      username: `User${i + 1}`,
      profilePicture: {
        original: `https://example.com/user${i + 1}.jpg`,
        srcsetWebp: `https://example.com/user${i + 1}.webp 480w`,
        srcsetAvif: `https://example.com/user${i + 1}.avif 480w`,
      },
      city: 'Sucre',
      state: 'Chuquisaca',
      country: 'Bolivia',
      id: 8000 + i,
      becameUserAt: '2024-05-17',
    },
    score: 4 + Math.random(),
    comment: `Comentario de prueba ${i + 1}`,
    date: `2026-12-${30 - i}`,
    trip: {
      startDate: `2025-08-${21 + i}`,
      endDate: `2026-10-0${4 + i}`,
      pets: i,
      infants: i % 2,
    },
  })),
  next: '/api/next-page',
  previous: null,
  limit: 5,
  offset: 0,
  count: 50,
};

describe('ListingReview Component', () => {
  beforeEach(() => {
    (fetchListingReviews as jest.Mock).mockResolvedValue(mockInitialReviews);
    (fetchListingReviewsSearch as jest.Mock).mockResolvedValue(
      mockInitialReviews
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should load and display reviews on initial render', async () => {
    render(<ListingReview id={123} numberReviews={10} />);

    // Fast-forward through the debounce timer
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Wait for the API call to complete and the state to update
    await waitFor(() => {
      expect(fetchListingReviews).toHaveBeenCalledWith(123, {
        limit: 5,
        offset: 0,
        sort: SortReview.MostRecent, //default value
      });
    });

    // Wait for the reviews to be rendered after loading completes
    await waitFor(() => {
      const reviewItems = screen.getAllByTestId('review-item');
      expect(reviewItems).toHaveLength(5); //limit of 5 reviews
    });

    // Verify interaction with the component
    expect(screen.getByText('10 Reseñas')).toBeInTheDocument();
    expect(screen.getByTestId('sort-review-MOST_RECENT')).toBeInTheDocument();
    expect(screen.getByTestId('sort-review-HIGHEST_RATED')).toBeInTheDocument();
    expect(screen.getByTestId('sort-review-LOWEST_RATED')).toBeInTheDocument();
  });

  test('should search reviews when search input changes', async () => {
    render(<ListingReview id={123} numberReviews={10} />);

    // Fast-forward through initial load debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(fetchListingReviews).toHaveBeenCalled();
    });

    // Change value of search input
    const searchInput = screen.getByPlaceholderText('Buscar');
    fireEvent.change(searchInput, { target: { value: 'test search' } });

    // Fast-forward through search debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(
      () => {
        expect(fetchListingReviewsSearch).toHaveBeenCalledWith(123, {
          limit: 5,
          offset: 0,
          sort: SortReview.MostRecent, //default value
          criteria: 'test search',
        });
      },
      { timeout: 6000 }
    );
  });

  test('should change order when another option is selected', async () => {
    render(<ListingReview id={123} numberReviews={10} />);

    // Fast-forward through initial load debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(fetchListingReviews).toHaveBeenCalled();
    });

    // open  dropdown
    const sortButton = screen.getByTestId('sort-review-button');
    fireEvent.click(sortButton);

    // Select a different sort option
    const LowestRatedOption = screen.getByTestId('sort-review-LOWEST_RATED');
    fireEvent.click(LowestRatedOption);

    // Fast-forward through sort change debounce
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(fetchListingReviews).toHaveBeenCalledWith(123, {
        limit: 5,
        offset: 0,
        sort: SortReview.LowestRated,
      });
    });
  });
});

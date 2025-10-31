import { useCallback, useRef, useState } from 'react';
import {
  fetchListingReviews,
  fetchListingReviewsSearch,
} from '@/services/listings';
import { SortReview } from '@/types/enums/sortReview';
import type {
  QueryParamsReviews,
  QueryParamsReviewsSearch,
  RecentReviews,
} from '@/types/listing/review';

export function useListingReviews(
  id: number,
  sort: SortReview,
  criteria: string
) {
  const [reviews, setReviews] = useState<RecentReviews[]>([]);
  const [hasMore, setHasMore] = useState<string | null>('initial');
  const [loading, setLoading] = useState(false);

  const offsetRef = useRef(0);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef<string | null>('initial');

  const loadReviews = useCallback(
    async (reset = false) => {
      if (loadingRef.current || (!hasMoreRef.current && !reset)) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        const params = {
          limit: 5,
          offset: reset ? 0 : offsetRef.current,
          sort: sort,
          ...(criteria ? { criteria: criteria.trim() } : {}),
        };
        const data =
          criteria.length > 0
            ? await fetchListingReviewsSearch(
                id,
                params as QueryParamsReviewsSearch
              )
            : await fetchListingReviews(id, params as QueryParamsReviews);

        if (reset) {
          setReviews(data.results);
          offsetRef.current = data.limit;
        } else {
          if (data.results.length === 0) {
            setHasMore(null);
            hasMoreRef.current = null;
          } else {
            setReviews((prev) => [...prev, ...data.results]);
            offsetRef.current += data.limit;
          }
        }
        setHasMore(data.next);
        hasMoreRef.current = data.next;
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    },
    [id, sort, criteria]
  );

  const resetPagination = useCallback(() => {
    offsetRef.current = 0;
    hasMoreRef.current = 'initial';
    setHasMore('initial');
  }, []);

  return {
    reviews,
    hasMore,
    loading,
    loadReviews,
    resetPagination,
  };
}

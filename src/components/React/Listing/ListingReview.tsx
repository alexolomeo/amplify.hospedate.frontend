import { SortReview } from '@/types/enums/sortReview';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReviewItem from '../Common/ReviewItem';
import { useInfiniteScroll } from '../Hooks/useInfiniteScroll';
import { useListingReviews } from '../Hooks/useListingReview';
import ChevronDownIcon from '/src/icons/chevron-down.svg?react';
import SearchIcon from '/src/icons/search.svg?react';
import AppButton from '../Common/AppButton';

interface ListingReviewProps {
  numberReviews: number;
  lang?: SupportedLanguages;
  id: number;
}

const ListingReview: React.FC<ListingReviewProps> = ({
  lang = 'es',
  numberReviews,
  id,
}) => {
  const t = getTranslation(lang);
  const [sortReview, setSortReview] = useState<SortReview>(
    SortReview.MostRecent
  );
  const [criteria, setCriteria] = useState('');
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { reviews, hasMore, loading, loadReviews, resetPagination } =
    useListingReviews(id, sortReview, criteria);

  useInfiniteScroll({
    targetRef: loaderRef,
    onIntersect: () => loadReviews(),
    enabled: hasMore !== null && !loading,
  });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      resetPagination();
      loadReviews(true);
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [loadReviews, resetPagination]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCriteria(e.target.value);
  }, []);

  const handleSortChange = useCallback((value: SortReview) => {
    setSortReview(value);
  }, []);

  return (
    <div className="py-10 lg:py-0">
      <div className="sticky top-0 right-0 left-0 z-10 bg-blue-50">
        <div className="mb-4 flex justify-between">
          <h1 className="text-xl font-bold sm:text-2xl">
            {numberReviews} {t.listingDetail.review.review}
          </h1>
          <div className="flex lg:gap-x-4">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                data-testid="sort-review-button"
                className="btn btn-primary btn-outline btn-sm rounded-full text-xs font-semibold"
              >
                {t.listingDetail.review.sortTypes[sortReview]}
                <ChevronDownIcon className="h-5 w-5"></ChevronDownIcon>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu z-1 bg-[var(--color-base-150)] p-2 text-xs shadow-sm"
              >
                {Object.values(SortReview).map((type) => (
                  <li key={type}>
                    <a
                      onClick={() => handleSortChange(type)}
                      data-testid={`sort-review-${type}`}
                      className="hover:bg-base-200 hover:rounded-full"
                    >
                      {t.listingDetail.review.sortTypes[type]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <form method="dialog" className="hidden md:block lg:block">
              <AppButton label=" ✕" type="submit" variant="circle"></AppButton>
            </form>
          </div>
        </div>
        <div className="mx-1 mb-2">
          <label className="border-primary flex h-10 items-center gap-2 rounded-full border px-4">
            <SearchIcon className="text-primary h-5 w-5" />
            <input
              type="search"
              value={criteria}
              onChange={handleSearch}
              placeholder={t.search.search}
              className="w-full bg-transparent text-sm outline-none placeholder:text-sm"
            />
          </label>
        </div>
      </div>
      <div className="h-110 overflow-y-auto">
        {loading && hasMore == 'initial' ? (
          <div></div>
        ) : (
          <div className="mt-4">
            {reviews.map((review, index) => (
              <div key={index} className="m-1 lg:m-3" data-testid="review-item">
                <ReviewItem review={review} truncateComment={false} />
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="p-4 text-center text-xs">
                {translate(t, t.search.noResultsFound)}
              </div>
            )}
          </div>
        )}
        <div ref={loaderRef} className="mt-6 flex justify-center text-xs">
          {loading && <span>{translate(t, t.listings.loading)}</span>}
        </div>
      </div>
    </div>
  );
};

export default ListingReview;

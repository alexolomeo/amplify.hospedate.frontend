import React, { useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { $listings, $pagination, $isLoading } from '@/stores/searchStore';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import ListingCard from '../../Listing/ListingCard';
import Pagination from '../../Common/Pagination';
import { CardsSkeleton } from './SearchResultSkeleton';

interface Props {
  onPageChange: (newOffset: number) => void;
  onListingHover: (id: string | null) => void;
  lang?: SupportedLanguages;
  destination?: string | null;
}

const SearchCardResult: React.FC<Props> = ({
  onPageChange,
  onListingHover,
  lang = 'es',
  destination,
}) => {
  const listings = useStore($listings);
  const pagination = useStore($pagination);
  const isLoading = useStore($isLoading);
  const t = getTranslation(lang);

  const totalPages = Math.ceil(pagination.count / pagination.limit);
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

  const handlePage = useCallback(
    (page: number) => {
      const newOffset = (page - 1) * pagination.limit;
      onPageChange(newOffset);
    },
    [onPageChange, pagination.limit]
  );

  if (isLoading) {
    return (
      <section
        aria-busy="true"
        aria-live="polite"
        aria-label="Loading search results"
        data-testid="cards-skeleton"
      >
        <CardsSkeleton />
      </section>
    );
  }

  return (
    <section>
      {listings.length > 0 ? (
        <div className="flex flex-col">
          <h3 className="mt-2 mb-5 text-base font-semibold">
            {pagination.count} {translate(t, t.listings.listingsFound)}
            {destination ? destination : ''}
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 md:gap-4 lg:grid-cols-2 lg:gap-4 xl:grid-cols-3 xl:gap-3 2xl:grid-cols-4 2xl:gap-3">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                lang={lang}
                onMouseEnter={() => onListingHover(String(listing.id))}
                onMouseLeave={() => onListingHover(null)}
              />
            ))}
          </div>

          <div className="m-5 mx-auto">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePage}
            />
          </div>
        </div>
      ) : (
        <div className="empty-results py-12">
          <p className="text-xl">{translate(t, t.search.noResultsFound)}</p>
          <p className="mt-2 text-gray-600">
            {translate(t, t.search.adjustFilters)}
          </p>
        </div>
      )}
    </section>
  );
};

export default SearchCardResult;

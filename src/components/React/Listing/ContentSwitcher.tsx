import React, { useEffect, useState } from 'react';
import type { PaginatedListings } from '@/types/listing/listing';
import ListingGrid from '@/components/React/Listing/ListingsGrid';
import ListingMap from '@/components/React/Listing/DisplayMap/ListingMap';
import FloatingActionButton from '@/components/React/Common/FloatingActionButton';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import MapIcon from '/src/icons/map.svg?react';
import ListIcon from '/src/icons/list-bullet.svg?react';
import ListingsGridSkeleton from './DisplayMap/ListingsGridSkeleton';
import type { QueryParams } from '@/types/search';
import { fetchListingsSearch } from '@/services/listings';

interface Props {
  lang?: SupportedLanguages;
  initialQuery: QueryParams;
}

const ViewSwitcher: React.FC<Props> = ({ lang = 'es', initialQuery }) => {
  const [viewMode, setViewMode] = useState<0 | 1>(0);
  const toggleView = () => setViewMode((m) => (m === 0 ? 1 : 0));
  const [listings, setListings] = useState<PaginatedListings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListing = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchListingsSearch(initialQuery);
      setListings(data);
    } catch {
      setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  }, [initialQuery]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  const t = getTranslation(lang);
  const buttonLabel = translate(
    t,
    viewMode === 0 ? 'contentSwitcher.map' : 'contentSwitcher.list'
  );

  if (loading) {
    return <ListingsGridSkeleton />;
  }
  if (error) {
    return <>{error}</>;
  }
  if (!listings) {
    return (
      <div className="w-full px-4 py-12 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <p className="text-xl">{translate(t, t.search.noResultsFound)}</p>
      </div>
    );
  }
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex min-h-0 flex-1 items-stretch">
        {viewMode === 0 ? (
          <div className="w-full px-4 py-10 sm:px-8 md:px-12 lg:px-16 xl:px-20">
            <ListingGrid initialData={listings} lang={lang} />
          </div>
        ) : (
          <div className="h-[calc(100dvh-72px)] w-full md:h-auto">
            <ListingMap lang={lang} />
          </div>
        )}
      </div>

      <FloatingActionButton
        onClick={toggleView}
        icon={
          viewMode === 0 ? (
            <MapIcon className="h-6 w-6" />
          ) : (
            <ListIcon className="h-6 w-6" />
          )
        }
        label={buttonLabel}
        colorClass="bg-primary"
        position="center"
        className="z-50"
      />
    </div>
  );
};

export default ViewSwitcher;

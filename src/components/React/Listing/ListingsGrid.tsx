import type { Listing, PaginatedListings } from '@/types/listing/listing';
import React from 'react';
import ListingCard from './ListingCard';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import { fetchListingsSearch } from '@/services/listings';
import type { QueryParams } from '@/types/search';
import { SearchType } from '@/types/search';

interface Props {
  initialData: PaginatedListings;
  lang?: SupportedLanguages;
}

const ListingGrid: React.FC<Props> = ({ initialData, lang = 'es' }) => {
  const [listings, setListings] = React.useState<Listing[]>(
    initialData.results
  );
  const [offset, setOffset] = React.useState(
    initialData.offset + initialData.limit
  );
  const [hasMore, setHasMore] = React.useState(!!initialData.next);
  const [loading, setLoading] = React.useState(false);

  const t = getTranslation(lang);

  const loadMore = async () => {
    if (loading || !hasMore) {
      return;
    }
    setLoading(true);
    try {
      const queryparams: QueryParams = {
        limit: 20,
        offset: offset,
        searchType: SearchType.List,
        adults: 1,
      };
      const data = await fetchListingsSearch(queryparams);
      setListings((prev) => [...prev, ...data.results]);
      setOffset((prev) => prev + data.limit);
      setHasMore(!!data.next);
    } catch (error) {
      console.error('Failed to fetch listings', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} lang={lang} />
        ))}
      </div>
      {hasMore && (
        <div className="mt-6 flex items-center justify-center gap-x-6">
          <p>{translate(t, t.listings.continueExploring)}</p>
          <button type="button" className="btn btn-outline" onClick={loadMore}>
            {loading
              ? translate(t, t.listings.loading)
              : translate(t, t.listings.loadMore)}
          </button>
        </div>
      )}
    </div>
  );
};

export default ListingGrid;

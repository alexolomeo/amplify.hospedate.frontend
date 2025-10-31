import React, { useState, useCallback, useEffect } from 'react';
import ListingGoogleMap from '../../Search/SearchResult/ListingGoogleMap';
import { fetchListingsSearch } from '@/services/listings';
import { SearchType } from '@/types/search';
import type { MapState } from '@/types/search';
import type { Listing } from '@/types/listing/listing';
import type { SupportedLanguages } from '@/utils/i18n';
import { useDebounce } from '../../Hooks/useDebounce';

interface Props {
  lang?: SupportedLanguages;
}

function sanitizeLat(lat: number): string {
  return Number(lat.toFixed(6)).toString();
}
function sanitizeLng(lng: number): string {
  return Number(lng.toFixed(6)).toString();
}

const DEFAULT_NORTH_EAST_LAT = -9.68;
const DEFAULT_NORTH_EAST_LNG = -57.47;
const DEFAULT_SOUTH_WEST_LAT = -22.91;
const DEFAULT_SOUTH_WEST_LNG = -69.65;
const DEFAULT_ZOOM = 6;

export default function ListingMap({ lang = 'es' }: Props) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMap, setPendingMap] = useState<MapState | null>(null);
  const debouncedMap = useDebounce(pendingMap, 500);

  const load = useCallback(
    async (bounds: {
      northEastLat: string;
      northEastLng: string;
      southWestLat: string;
      southWestLng: string;
      zoom: number;
    }) => {
      setIsLoading(true);
      try {
        const resp = await fetchListingsSearch({
          searchType: SearchType.Map,
          limit: 50,
          ...bounds,
          adults: 1,
        });
        setListings(resp.results);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleInteraction = useCallback(() => {
    setIsLoading(true);
  }, []);

  const defaultMapParams = React.useMemo(
    () => ({
      northEastLat: sanitizeLat(DEFAULT_NORTH_EAST_LAT),
      northEastLng: sanitizeLng(DEFAULT_NORTH_EAST_LNG),
      southWestLat: sanitizeLat(DEFAULT_SOUTH_WEST_LAT),
      southWestLng: sanitizeLng(DEFAULT_SOUTH_WEST_LNG),
      zoom: DEFAULT_ZOOM,
    }),
    []
  );

  useEffect(() => {
    load(defaultMapParams);
  }, [load, defaultMapParams]);

  useEffect(() => {
    if (!debouncedMap) return;
    load({
      northEastLat: sanitizeLat(debouncedMap.bounds.northEastLat),
      northEastLng: sanitizeLng(debouncedMap.bounds.northEastLng),
      southWestLat: sanitizeLat(debouncedMap.bounds.southWestLat),
      southWestLng: sanitizeLng(debouncedMap.bounds.southWestLng),
      zoom: debouncedMap.zoom,
    });
  }, [debouncedMap, load]);

  const handleMapMove = useCallback(
    (state: MapState, opts?: { skipSearch: boolean }) => {
      if (opts?.skipSearch) return;
      setPendingMap(state);
    },
    []
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-1">
      <div className="h-full w-full overflow-hidden">
        <ListingGoogleMap
          widthClass="w-full"
          heightClass="h-full"
          lang={lang}
          listings={listings}
          isLoading={isLoading}
          onInteraction={handleInteraction}
          onMapMove={handleMapMove}
          onListingHover={() => {}}
        />
      </div>
    </div>
  );
}

import React, { useEffect, useCallback, useState, useRef } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import {
  $params,
  $searchMode,
  $isLoading,
  $hoveredListingId,
  $mapState,
  $pagination,
} from '@/stores/searchStore';
import { useStore } from '@nanostores/react';
import type { QueryParams, MapState, FilterState } from '@/types/search';
import { SearchType } from '@/types/search';
import { useListingsSearcher } from '@/components/React/Hooks/useListingsSearcher';
import SearchCardResult from './SearchCardResult';
import ListingGoogleMap from './ListingGoogleMap';
import { useDebounce } from '../../Hooks/useDebounce';
import { updateUrlWithFilters } from '@/utils/urlUtils';
import ModalFilter from '../ModalFilter';

interface Props {
  queryParams: QueryParams;
  lang?: SupportedLanguages;
  googleDescription?: string | null;
}

export default function SearchResultContainer({
  queryParams,
  lang = 'es',
  googleDescription,
}: Props) {
  const t = getTranslation(lang);
  type PendingMap = { state: MapState; skipSearch: boolean };
  const [pendingMap, setPendingMap] = useState<PendingMap | null>(null);
  const debouncedMap = useDebounce(pendingMap, 900);
  const [localDestination, setLocalDestination] = useState(googleDescription);
  const { search } = useListingsSearcher();

  const isLoading = useStore($isLoading);
  const topAnchorRef = useRef<HTMLDivElement | null>(null);
  const HEADER_OFFSET = 79;

  const prevLoadingRef = useRef(isLoading);
  useEffect(() => {
    if (prevLoadingRef.current && !isLoading) {
      const el = topAnchorRef.current;
      if (el) {
        const y =
          el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading]);

  const handleInteraction = useCallback(() => {
    $isLoading.set(true);
  }, []);
  const formatCoordinate = (coord: number): string => {
    return coord.toFixed(6);
  };

  useEffect(() => {
    const paramsToSet: Partial<QueryParams> = {};
    if (queryParams.placeId) {
      paramsToSet.placeId = queryParams.placeId;
    }
    if (queryParams.checkInDate) {
      paramsToSet.checkInDate = queryParams.checkInDate;
    }
    if (queryParams.checkoutDate) {
      paramsToSet.checkoutDate = queryParams.checkoutDate;
    }
    if (queryParams.adults && queryParams.adults > 0) {
      paramsToSet.adults = queryParams.adults;
    }
    if (queryParams.children && queryParams.children > 0) {
      paramsToSet.children = queryParams.children;
    }
    if (queryParams.infants && queryParams.infants > 0) {
      paramsToSet.infants = queryParams.infants;
    }
    if (queryParams.numPets && queryParams.numPets > 0) {
      paramsToSet.numPets = queryParams.numPets;
    }
    if (queryParams.flexible) {
      paramsToSet.flexible = queryParams.flexible;
    }

    $params.set({
      ...$params.get(),
      ...paramsToSet,
    });
    const currentPagination = $pagination.get();
    $pagination.set({
      ...currentPagination,
      limit: queryParams.limit,
      offset: queryParams.offset || 0,
    });
    $searchMode.set(queryParams.searchType);
    search();
  }, [queryParams, search]);

  const handlePageChange = useCallback(
    (newOffset: number) => {
      const currentPagination = $pagination.get();
      if (newOffset !== currentPagination.offset) {
        $pagination.set({ ...currentPagination, offset: newOffset });
        search();
      }
    },
    [search]
  );

  const handleMapMove = useCallback(
    (newMapState: MapState, opts?: { skipSearch: boolean }) => {
      setPendingMap({ state: newMapState, skipSearch: !!opts?.skipSearch });
    },
    []
  );

  const handleFilterChange = useCallback(
    (state: FilterState) => {
      const newFilterParams: Partial<QueryParams> = {};
      newFilterParams.maxPrice = state.price.max;
      newFilterParams.minPrice = state.price.min;
      newFilterParams.minBeds = state.rooms.beds;
      newFilterParams.minBaths = state.rooms.baths;
      newFilterParams.minRooms = state.rooms.bedrooms;

      newFilterParams.amenities = state.amenities;
      newFilterParams.propertyTypeGroups = state.propertyTypeGroups;
      newFilterParams.reservationOptions = state.reservations;
      $params.set({
        ...$params.get(),
        ...newFilterParams,
      });

      updateUrlWithFilters(state);
      search();
    },
    [search]
  );

  useEffect(() => {
    if (!debouncedMap) return;

    $mapState.set(debouncedMap.state);
    $params.set({
      ...$params.get(),
      northEastLat: formatCoordinate(debouncedMap.state.bounds.northEastLat),
      northEastLng: formatCoordinate(debouncedMap.state.bounds.northEastLng),
      southWestLat: formatCoordinate(debouncedMap.state.bounds.southWestLat),
      southWestLng: formatCoordinate(debouncedMap.state.bounds.southWestLng),
      zoom: debouncedMap.state.zoom,
    });
    if (!debouncedMap.skipSearch) {
      $searchMode.set(SearchType.Map);
      setLocalDestination(' ' + t.listings.resultsInMapArea);
      const currentPagination = $pagination.get();
      $pagination.set({ ...currentPagination, offset: 0 });

      search();
    }
  }, [debouncedMap, search, t.listings.resultsInMapArea]);

  const handleListingHover = useCallback((id: string | null) => {
    $hoveredListingId.set(id);
  }, []);

  return (
    <section className="w-full px-4 py-3 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="flex w-full flex-col md:flex-row md:gap-[2%]">
        <div ref={topAnchorRef} aria-hidden="true" />
        <div className="w-full md:order-2 md:w-[38%]">
          <div className="sticky top-[100px] h-[calc(100vh-100px)] w-full pb-5">
            <div className="h-full w-full overflow-hidden rounded-xl">
              <ListingGoogleMap
                onInteraction={handleInteraction}
                onMapMove={handleMapMove}
                onListingHover={handleListingHover}
                lang={lang}
              />
            </div>
          </div>
        </div>

        <div className="w-full md:order-1 md:w-[60%]">
          <SearchCardResult
            destination={localDestination}
            onPageChange={handlePageChange}
            onListingHover={handleListingHover}
            lang={lang}
          />
        </div>
      </div>
      <ModalFilter lang={lang} onUpdateFilters={handleFilterChange} />
    </section>
  );
}

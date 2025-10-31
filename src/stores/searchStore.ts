import { atom } from 'nanostores';
import type { Listing } from '@/types/listing/listing';
import { SearchType, type QueryParams } from '@/types/search';
import type { Filters, MapState } from '@/types/search';

export const $params = atom<Partial<QueryParams>>({
  adults: 1,
});

export const $searchMode = atom<SearchType>(SearchType.List);

export const $mapState = atom<MapState | null>(null);

export const $listings = atom<Listing[]>([]);

export const $pagination = atom({
  offset: 0,
  limit: 12,
  count: 0,
});
export const $isLoading = atom<boolean>(true);

export const $hoveredListingId = atom<string | null>(null);

export const $filters = atom<Filters | null>(null);
export const $countFilter = atom<number>(0);
export const $onlyPriceChanged = atom<boolean>(false);

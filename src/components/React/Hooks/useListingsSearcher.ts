import { useCallback, useRef } from 'react';
import {
  $listings,
  $pagination,
  $isLoading,
  $searchMode,
  $params,
  $onlyPriceChanged,
  $filters,
} from '@/stores/searchStore';
import { fetchFilters, fetchListingsSearch } from '@/services/listings';
import type { QueryParams } from '@/types/search';
import { isCancelError } from '@/utils/isCancelError';

export function useListingsSearcher() {
  const controllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);

  const search = useCallback(async () => {
    $isLoading.set(true);
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    const controller = new AbortController();
    controllerRef.current = controller;

    const localRequestId = ++requestIdRef.current;

    const params = $params.get();
    const pagination = $pagination.get();
    const searchMode = $searchMode.get();
    const onlyPriceChanged = $onlyPriceChanged.get();

    try {
      const finalParams: QueryParams = {
        adults: 1,
        limit: pagination.limit,
        offset: pagination.offset,
        searchType: searchMode,
        ...params,
      };

      const response = await fetchListingsSearch(finalParams, {
        signal: controller.signal,
      });

      if (localRequestId !== requestIdRef.current) return;

      if (!onlyPriceChanged) {
        const filters = await fetchFilters(finalParams, {
          signal: controller.signal,
        });
        if (localRequestId === requestIdRef.current && filters) {
          $filters.set(filters);
        }
      }

      if (localRequestId === requestIdRef.current) {
        $listings.set(response.results);
        $pagination.set({
          limit: response.limit,
          offset: response.offset,
          count: response.count,
        });
      }
    } catch (error) {
      if (isCancelError(error)) return;

      if (localRequestId === requestIdRef.current) {
        console.error('Failed to fetch listings:', error);
        $listings.set([]);
        const current = $pagination.get();
        $pagination.set({ ...current, count: 0, offset: 0 });
      }
    } finally {
      if (localRequestId === requestIdRef.current) {
        $isLoading.set(false);
      }
    }
  }, []);

  return { search };
}

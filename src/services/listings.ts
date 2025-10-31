import type { Filters, QueryParams } from '@/types/search.ts';
import type {
  ListingAvailibility,
  ListingDetail,
  PaginatedListings,
  ParamsListingAvailibility,
} from '@/types/listing/listing';
import api from '@/utils/api.ts';
import type {
  PaginatedReviews,
  QueryParamsReviews,
  QueryParamsReviewsSearch,
} from '@/types/listing/review';
import { optionalArg } from '@/utils/http.ts';
import { isCancelError } from '@/utils/isCancelError';

export type RequestOpts = { signal?: AbortSignal };

const buildSearchParams = (params: QueryParams): URLSearchParams => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      if (value.length > 0) {
        value.forEach((item) => queryParams.append(key, String(item)));
      }
      return;
    }

    if (typeof value === 'number') {
      if (key === 'offset' ? value >= 0 : value > 0) {
        queryParams.append(key, String(value));
      }
      return;
    }

    queryParams.append(key, String(value));
  });
  return queryParams;
};

export const fetchListingById = async (
  id: number,
  opts?: { skipGlobal404Redirect?: boolean }
): Promise<ListingDetail | null> => {
  try {
    const { data } = await api.get<ListingDetail>(
      `/public/listings/${id}`,
      ...optionalArg(opts?.skipGlobal404Redirect, {
        skipGlobal404Redirect: true,
      })
    );
    return data;
  } catch (error) {
    console.error(`Failed to fetch listing with id ${id}`, error);
    return null;
  }
};

export const fetchListingsSearch = async (
  params: QueryParams,
  opts?: RequestOpts
): Promise<PaginatedListings> => {
  try {
    const queryParams = buildSearchParams(params);
    const url = `/public/listings/search?${queryParams.toString()}`;
    const response = await api.get<PaginatedListings>(url, {
      signal: opts?.signal,
    });
    return response.data;
  } catch (error) {
    if (isCancelError(error)) {
      throw error;
    }
    console.error('Failed to fetch listings', error);
    return {
      limit: params.limit,
      offset: params.offset ?? 0,
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
};

export const fetchListingReviews = async (
  id: number,
  params: QueryParamsReviews
): Promise<PaginatedReviews> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    const url = `/public/listings/${id}/reviews?${queryParams.toString()}`;
    const response = await api.get<PaginatedReviews>(url);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch listing with id ${id}`, error);
    return {
      limit: params.limit,
      offset: params.offset,
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
};

export const fetchListingReviewsSearch = async (
  id: number,
  params: QueryParamsReviewsSearch
): Promise<PaginatedReviews> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    const url = `/public/listings/${id}/reviews/search?${queryParams.toString()}`;
    const response = await api.get<PaginatedReviews>(url);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch listing with id ${id}`, error);
    return {
      limit: params.limit,
      offset: params.offset,
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
};

export const fetchListingAvailability = async (
  id: number,
  params?: ParamsListingAvailibility
): Promise<ListingAvailibility> => {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }
  const url = `/public/listings/${id}/availability?${queryParams.toString()}`;
  const response = await api.get<ListingAvailibility>(url);
  return response.data;
};

export const fetchFilters = async (
  params: QueryParams,
  opts?: RequestOpts
): Promise<Filters | null> => {
  try {
    const queryParams = buildSearchParams(params);
    const url = `/public/listings/filters?${queryParams.toString()}`;
    const response = await api.get<Filters>(url, { signal: opts?.signal });
    return response.data;
  } catch (error) {
    if (isCancelError(error)) {
      throw error;
    }
    console.error('Failed to fetch filters', error);
    return null;
  }
};

import api from '@/utils/api.ts';
import type { ListingsResponse } from '@/types/host/listing';

export interface QueryParamsHostListings {
  readonly limit: number;
  readonly offset?: number;
}

/** Build a URLSearchParams enforcing expected semantics for limit/offset. */
function buildQuery(params: QueryParamsHostListings): URLSearchParams {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, raw]) => {
    if (raw === undefined || raw === null) return;

    if (typeof raw === 'number') {
      // limit must be > 0, offset must be >= 0
      if ((key === 'offset' && raw >= 0) || (key === 'limit' && raw > 0)) {
        query.append(key, String(raw));
      }
      return;
    }

    query.append(key, String(raw));
  });
  return query;
}

export const fetchHostListings = async (
  params: QueryParamsHostListings = { limit: 200, offset: 0 }
): Promise<ListingsResponse | null> => {
  try {
    const queryParams = buildQuery(params);
    const url = `/hostings/listings?${queryParams.toString()}`;
    const response = await api.get<ListingsResponse>(url);
    return response.data;
  } catch (error) {
    console.error('[fetchHostListings] Error fetching host listings', {
      error,
      endpoint: '/hostings/listings',
      params,
    });
    throw error;
  }
};

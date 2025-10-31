import api from '@/utils/api';

export type ListingStatusReasonType = string;

export interface ListingStatusReason {
  id: number;
  name: string;
  type: ListingStatusReasonType;
  typeLabel?: string;
  typeOrder?: number;
}
interface RawListingStatusReason {
  id: number;
  name: string;
  type: string;
  type_label?: string;
  typeLabel?: string;
  type_order?: number;
  typeOrder?: number;
}

function normalizeReasons(raw: unknown): ListingStatusReason[] {
  if (!Array.isArray(raw)) return [];
  return (raw as RawListingStatusReason[]).map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    typeLabel: r.typeLabel ?? r.type_label,
    typeOrder: r.typeOrder ?? r.type_order,
  }));
}

export async function getListingStatusReasons(
  signal?: AbortSignal,
  lang?: string
): Promise<ListingStatusReason[]> {
  try {
    const { data } = await api.get(`/listings/status/reasons`, {
      signal,
      headers: lang ? { 'Accept-Language': lang } : undefined,
    });
    return normalizeReasons(data);
  } catch (err: unknown) {
    const e = err as { name?: string; code?: string };
    if (e?.name === 'AbortError' || e?.code === 'ERR_CANCELED') return [];
    console.error('[getListingStatusReasons] Error fetching reasons', {
      error: err,
      endpoint: '/listings/status/reasons',
    });
    throw err;
  }
}

type ListingStatus = 'PUBLISHED' | 'UNPUBLISHED';

interface UpdateListingStatusPayload {
  status: ListingStatus;
  reasonIds?: number[];
}

export async function unpublishListing(
  listingId: string,
  reasonIds: number[],
  signal?: AbortSignal
): Promise<void> {
  const payload: UpdateListingStatusPayload = {
    status: 'UNPUBLISHED',
    reasonIds,
  };
  await api.patch<void>(`/listings/${listingId}/status`, payload, { signal });
}

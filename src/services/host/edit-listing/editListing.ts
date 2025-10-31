import api from '@/utils/api';
import type { EditListingCatalog } from '@/types/host/edit-listing/editListingCatalog';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';
import type { ListingDetail } from '@/types/listing/listing';
import { markHasPatchedOnce } from '@/stores/host/editListing/editListingSession';

export const fetchEditListingCatalogs =
  async (): Promise<EditListingCatalog | null> => {
    try {
      const { data } = await api.get<EditListingCatalog>(
        '/listings/editors/catalogs'
      );
      return data;
    } catch (error) {
      console.error('Failed to fetch Edit Listing catalogs', error);
      return null;
    }
  };

export const fetchEditListingValues = async (
  listingId: string
): Promise<ListingEditorValues | null> => {
  try {
    const { data } = await api.get<ListingEditorValues>(
      `/listings/${encodeURIComponent(listingId)}/editors/values`
    );
    return data;
  } catch (error) {
    console.error('Failed to fetch Listing Editor values', error);
    return null;
  }
};
//|||||||||||||||||||||||||||||||||||||||
export const fetchListingPreview = async (
  listingId: string
): Promise<ListingDetail | null> => {
  try {
    const { data } = await api.get<ListingDetail>(
      `hostings/listings/${encodeURIComponent(listingId)}/preview`
    );
    return data;
  } catch (error) {
    console.error('Failed to fetch Listing Preview data', error);
    return null;
  }
};

export const updateEditListingValues = async (
  listingId: string,
  payload: UpdateListingEditorPayload
): Promise<void> => {
  if (!payload.yourPlace && !payload.arrivalGuide) {
    throw new Error('Empty payload for updateEditListingValues');
  }

  await api.patch(
    `/listings/${encodeURIComponent(listingId)}/editors/values`,
    payload
  );

  markHasPatchedOnce(listingId);
};

export async function updateListingStatus(
  listingId: string | number,
  newStatus: 'PENDING_APPROVAL' | 'PUBLISHED' | 'UNLISTED',
  reasons?: number[]
): Promise<void> {
  const { status } = await api.patch(
    `/listings/${encodeURIComponent(String(listingId))}/statuses`,
    { newStatus, reasons }
  );
  if (status !== 204 && status !== 200) {
    throw new Error(`[updateListingStatus] Unexpected status=${status}`);
  }
}

import axios from 'axios';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';

export async function getEditListingValuesSSR(
  listingId: string,
  cookie?: string
): Promise<ListingEditorValues | null> {
  try {
    const apiUrl = `${import.meta.env.PUBLIC_API_URL}/listings/${encodeURIComponent(
      listingId
    )}/editors/values`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (cookie) headers['Cookie'] = cookie;

    const { data } = await axios.get<ListingEditorValues>(apiUrl, {
      headers,
      timeout: 8000,
      withCredentials: true,
    });

    return data;
  } catch (err) {
    console.error('getEditListingValuesSSR failed', err);
    return null;
  }
}

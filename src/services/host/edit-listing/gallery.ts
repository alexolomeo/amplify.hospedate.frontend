import api from '@/utils/api';
import type { AxiosProgressEvent } from 'axios';
import type { SpacePhoto } from '@/types/host/edit-listing/spacePhotos';

type ApiSpacePhoto = {
  id: number;
  media: {
    original: string;
    srcsetWebp: string;
    srcsetAvif: string;
  };
  caption?: string;
  order?: number;
  spaceOrder?: number;
};

export async function fetchPhotosFromSpace(
  listingId: string,
  spaceId: string
): Promise<SpacePhoto[]> {
  try {
    const { data } = await api.get<ApiSpacePhoto[]>(
      `/listings/${encodeURIComponent(listingId)}/spaces/${encodeURIComponent(spaceId)}/photos`
    );

    const safeArray = Array.isArray(data) ? data : [];
    return safeArray.map((item) => ({
      id: item.id,
      photo: {
        original: item.media?.original ?? '',
        srcsetWebp: item.media?.srcsetWebp ?? '',
        srcsetAvif: item.media?.srcsetAvif ?? '',
      },
      caption: item.caption ?? '',
    }));
  } catch (error) {
    console.error('Failed to fetch available photos', error);
    return [];
  }
}

export interface UploadSpacePhotoResponse {
  id: number;
}

export async function uploadSpacePhotoWithProgress(
  listingId: string,
  spaceId: string | number,
  file: File,
  onProgress?: (percent: number) => void
): Promise<number> {
  try {
    const formData = new FormData();
    formData.append('photo', file);

    const { status, data } = await api.post<UploadSpacePhotoResponse>(
      `/listings/${encodeURIComponent(listingId)}/spaces/${encodeURIComponent(
        String(spaceId)
      )}/photos`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt: AxiosProgressEvent) => {
          if (!onProgress) return;
          const total = evt.total;
          if (typeof total === 'number' && total > 0) {
            const percent = Math.round((evt.loaded * 100) / total);
            onProgress(percent);
          }
        },
      }
    );

    if ((status !== 200 && status !== 201) || typeof data?.id !== 'number') {
      throw new Error(
        `[uploadSpacePhotoWithProgress] Unexpected response (status=${status})`
      );
    }

    if (onProgress) onProgress(100);

    return data.id;
  } catch (err) {
    console.error('[uploadSpacePhotoWithProgress] Upload failed:', err);
    throw err;
  }
}

export async function patchListingPhotoCaption(
  listingId: string,
  listingPhotoId: string | number,
  caption: string
): Promise<void> {
  const { status } = await api.patch(
    `/listings/${encodeURIComponent(listingId)}/photos/${encodeURIComponent(String(listingPhotoId))}`,
    { caption }
  );

  if (status !== 200 && status !== 204) {
    throw new Error(`[patchListingPhotoCaption] Unexpected status=${status}`);
  }
}

export async function deleteListingPhoto(
  listingId: string,
  listingPhotoId: string | number
): Promise<void> {
  const { status } = await api.delete(
    `/listings/${encodeURIComponent(listingId)}/photos/${encodeURIComponent(
      String(listingPhotoId)
    )}`
  );
  if (status !== 204 && status !== 200) {
    throw new Error(`[deleteListingPhoto] Unexpected status=${status}`);
  }
}

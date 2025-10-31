import api from '@/utils/api.ts';
import type { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import type {
  ListingCreationData,
  ListingProgressData,
  CreateListingInput,
  UpdatePhoto,
  UpdatePhotoOrder,
  UpdateListingStepData,
} from '@/types/createListing';

export type RequestOpts = {
  skipGlobal404Redirect?: boolean;
};

function with404Skip<T = unknown>(
  cfg: AxiosRequestConfig<T> | undefined,
  opts?: RequestOpts
): AxiosRequestConfig<T> {
  const shouldSkip = opts?.skipGlobal404Redirect ?? true;
  if (shouldSkip) {
    return { ...(cfg ?? {}), skipGlobal404Redirect: true };
  }
  return cfg ?? {};
}

export async function getListingCreationData(): Promise<ListingCreationData> {
  try {
    const response = await api.get<ListingCreationData>('/listings/create');
    return response.data;
  } catch (error) {
    console.error(
      '[getListingCreationData] Error fetching creation data:',
      error
    );
    throw error;
  }
}

export async function getListingProgressData(
  listingId: string,
  opts?: RequestOpts
): Promise<ListingProgressData> {
  try {
    const response = await api.get<ListingProgressData>(
      `/listings/create/${listingId}`,
      with404Skip(undefined, opts)
    );
    return response.data;
  } catch (error) {
    console.error(
      '[getListingProgressData] Error fetching listing progress data:',
      error
    );
    throw error;
  }
}

export async function createListing(data: CreateListingInput): Promise<string> {
  try {
    const response = await api.post('/listings/create', data);
    const listingId = response.data?.listingId;
    if (!listingId) {
      throw new Error('The response does not contain a valid listingId');
    }
    return listingId;
  } catch (error) {
    console.error('[createListing] Error creating new listing:', error);
    throw error;
  }
}

export async function updateListingStep(
  listingId: string,
  stepKey: string,
  payload: UpdateListingStepData,
  opts?: RequestOpts
): Promise<void> {
  try {
    await api.patch(
      `/listings/${listingId}/create/step/${stepKey}`,
      payload,
      with404Skip(undefined, opts)
    );
  } catch (error) {
    console.error(
      `[updateListingStep] Error updating step "${stepKey}" for listingId ${listingId}:`,
      error
    );
    throw error;
  }
}

export async function updateListingPhoto(
  listingId: string,
  photoId: number,
  data: UpdatePhoto,
  opts?: RequestOpts
): Promise<void> {
  try {
    await api.patch(
      `/listings/${listingId}/photos/${photoId.toString()}`,
      data,
      with404Skip(
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
        opts
      )
    );
  } catch (error) {
    console.error('[updateListingPhoto] Error:', error);
    throw error;
  }
}

export async function updateListingPhotosOrder(
  listingId: string,
  data: UpdatePhotoOrder[],
  opts?: RequestOpts
): Promise<void> {
  try {
    await api.patch(
      `/listings/${listingId}/photos/order`,
      data,
      with404Skip(
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
        opts
      )
    );
  } catch (error) {
    console.error('[updateListingPhotosOrder] Error:', error);
    throw error;
  }
}

export async function deleteListingPhoto(
  listingId: string,
  photoId: number,
  opts?: RequestOpts
): Promise<void> {
  try {
    await api.delete(
      `/listings/${listingId}/photos/${photoId.toString()}`,
      with404Skip(undefined, opts)
    );
  } catch (error) {
    console.error('[deleteListingPhoto] Error:', error);
    throw error;
  }
}

export async function uploadSinglePhotoWithProgress(
  listingId: string,
  file: File,
  onProgress: (percent: number) => void,
  opts?: RequestOpts
): Promise<number> {
  try {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await api.post(
      `/listings/${listingId}/photos`,
      formData,
      with404Skip(
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (event: AxiosProgressEvent) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              onProgress(percent);
            }
          },
        },
        opts
      )
    );

    if (response.status !== 201 || !response.data?.id) {
      throw new Error(
        '[uploadSinglePhotoWithProgress] The response does not contain a valid ID'
      );
    }

    return response.data.id;
  } catch (error) {
    console.error(
      '[uploadSinglePhotoWithProgress] Error uploading photo with progress:',
      error
    );
    throw error;
  }
}

export async function finalizeListingCreation(
  listingId: string,
  opts?: RequestOpts
): Promise<void> {
  try {
    const response = await api.patch(
      `/listings/${listingId}/create/finish`,
      undefined,
      with404Skip(undefined, opts)
    );

    if (response.status !== 204) {
      throw new Error(
        `Finalize listing returned unexpected status ${response.status}`
      );
    }
  } catch (error) {
    console.error(
      `[finalizeListingCreation] Error finalizing listingId ${listingId}:`,
      error
    );
    throw error;
  }
}

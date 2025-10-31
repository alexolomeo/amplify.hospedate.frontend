import { useCallback, useMemo } from 'react';
import axios from 'axios';
import pLimit from 'p-limit';
import type { ListingPhoto } from '@/types/createListing';
import {
  deleteListingPhoto,
  updateListingPhoto,
  updateListingPhotosOrder,
  uploadSinglePhotoWithProgress,
  getListingProgressData,
} from '@/services/createListing';
import {
  sortByOrder,
  toOrder,
  hasOrderChanged,
} from '../../Helper/CreateListing/photoUtils';
import { useToast } from '@/components/React/CreateListing/ToastContext';
import type { SupportedLanguages } from '@/utils/i18n';
import { getTranslation } from '@/utils/i18n';

export function generateLocalPhotoData(
  files: File[],
  newIds: number[],
  existingCount: number
): ListingPhoto[] {
  return newIds.map((id, idx) => ({
    id,
    original: URL.createObjectURL(files[idx]),
    srcsetWebp: '',
    srcsetAvif: '',
    caption: '',
    order: existingCount + idx + 1,
  }));
}

export function generatePhotoOrder(photos: ListingPhoto[]) {
  return toOrder(photos);
}

export function useCreateListingPhotos(
  listingId: string | null | undefined,
  currentPhotos: ListingPhoto[],
  updatePhotosState: (photos: ListingPhoto[]) => void,
  lang: SupportedLanguages = 'es'
) {
  const t = getTranslation(lang);
  const limit = useMemo(() => pLimit(5), []);
  const { showToast } = useToast();

  const hydratePhotosFromBackend = useCallback(async () => {
    if (!listingId) return;
    try {
      const progressData = await getListingProgressData(listingId, {
        skipGlobal404Redirect: true,
      });
      if (!progressData) return;
      const photos = sortByOrder(progressData.photos ?? []);
      updatePhotosState(photos);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        showToast({
          type: 'error',
          message: t.createListing.toast.errors.fetchFailed,
          autoClose: true,
          duration: 3000,
        });
        return;
      }
      console.error('[hydratePhotosFromBackend] Error fetching photos:', err);
    }
  }, [
    listingId,
    updatePhotosState,
    showToast,
    t.createListing.toast.errors.fetchFailed,
  ]);

  const deletePhoto = useCallback(
    async (photoId: number) => {
      if (!listingId) {
        console.error('[deletePhoto] No valid listingId');
        return;
      }
      try {
        await deleteListingPhoto(listingId, photoId, {
          skipGlobal404Redirect: true,
        });

        const without = currentPhotos.filter((p) => p.id !== photoId);
        const beforeRemaining = sortByOrder(without);
        const finalList = beforeRemaining.map((p, i) => ({
          ...p,
          order: i + 1,
        }));

        const needPatch = beforeRemaining.some((p, i) => p.order !== i + 1);
        if (needPatch) {
          await updateListingPhotosOrder(listingId, toOrder(finalList), {
            skipGlobal404Redirect: true,
          });
        }

        updatePhotosState(finalList);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          showToast({
            type: 'error',
            message: t.createListing.toast.errors.deleteFailed,
            autoClose: true,
            duration: 3000,
          });
          return;
        }
        console.error('[deletePhoto] Error deleting photo:', err);
      }
    },
    [
      listingId,
      currentPhotos,
      updatePhotosState,
      showToast,
      t.createListing.toast.errors.deleteFailed,
    ]
  );

  const updatePhotoCaption = useCallback(
    async (photoId: number, caption: string) => {
      if (!listingId) {
        console.error('[updatePhotoCaption] No valid listingId');
        return;
      }
      try {
        await updateListingPhoto(
          listingId,
          photoId,
          { caption },
          { skipGlobal404Redirect: true }
        );
        await hydratePhotosFromBackend();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          showToast({
            type: 'error',
            message: t.createListing.toast.errors.updateFailed,
            autoClose: true,
            duration: 3000,
          });
          return;
        }
        console.error('[updatePhotoCaption] Error updating caption:', err);
      }
    },
    [
      listingId,
      hydratePhotosFromBackend,
      showToast,
      t.createListing.toast.errors.updateFailed,
    ]
  );

  const reorderPhotos = useCallback(
    async (photos: ListingPhoto[]) => {
      if (!listingId) {
        console.error('[reorderPhotos] No valid listingId');
        return;
      }
      try {
        const before = sortByOrder(currentPhotos);
        const after = photos.map((p, i) => ({ ...p, order: i + 1 }));

        if (hasOrderChanged(before, after)) {
          await updateListingPhotosOrder(listingId, toOrder(after), {
            skipGlobal404Redirect: true,
          });
        }
        await hydratePhotosFromBackend();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          showToast({
            type: 'error',
            message: t.createListing.toast.errors.updateFailed,
            autoClose: true,
            duration: 3000,
          });
          return;
        }
        console.error('[reorderPhotos] Error reordering photos:', err);
      }
    },
    [
      listingId,
      currentPhotos,
      hydratePhotosFromBackend,
      showToast,
      t.createListing.toast.errors.updateFailed,
    ]
  );

  const uploadPhotosWithProgress = useCallback(
    async (
      files: File[],
      onProgressByIndex: (index: number, progress: number) => void
    ): Promise<void> => {
      if (!listingId) return;

      const newIds: number[] = [];
      await Promise.all(
        files.map((file, index) =>
          limit(async () => {
            try {
              onProgressByIndex(index, 0);
              const id = await uploadSinglePhotoWithProgress(
                listingId,
                file,
                (p) => {
                  onProgressByIndex(index, p);
                },
                { skipGlobal404Redirect: true }
              );
              newIds.push(id);
              onProgressByIndex(index, 100);
            } catch (err) {
              if (axios.isAxiosError(err) && err.response?.status === 404) {
                showToast({
                  type: 'error',
                  message: t.createListing.toast.errors.saveFailed,
                  autoClose: true,
                  duration: 3000,
                });
              } else {
                console.error(
                  `[uploadPhotosWithProgress] Failed to upload photo ${index}:`,
                  err
                );
              }
              onProgressByIndex(index, -1);
            }
          })
        )
      );

      let allPhotos: ListingPhoto[] = [];
      try {
        const progressData = await getListingProgressData(listingId, {
          skipGlobal404Redirect: true,
        });
        allPhotos = progressData?.photos ?? [];
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          return;
        }
        console.error(
          '[uploadPhotosWithProgress] Error fetching photos after upload:',
          err
        );
      }

      const existing = allPhotos.filter((p) => !newIds.includes(p.id));
      const added = allPhotos.filter((p) => newIds.includes(p.id));
      const merged = [...sortByOrder(existing), ...added];
      const finalList = merged.map((p, i) => ({ ...p, order: i + 1 }));

      if (hasOrderChanged(allPhotos, finalList)) {
        try {
          await updateListingPhotosOrder(listingId, toOrder(finalList), {
            skipGlobal404Redirect: true,
          });
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.status === 404) {
            return;
          }
          console.error(
            '[uploadPhotosWithProgress] Error updating photo order:',
            err
          );
        }
      }

      await hydratePhotosFromBackend();
    },
    [
      listingId,
      hydratePhotosFromBackend,
      limit,
      showToast,
      t.createListing.toast.errors.saveFailed,
    ]
  );

  return {
    generatePhotoOrder,
    generateLocalPhotoData,
    deletePhoto,
    updatePhotoCaption,
    reorderPhotos,
    uploadPhotosWithProgress,
  };
}

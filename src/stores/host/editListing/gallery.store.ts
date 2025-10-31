import { map, type MapStore } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import {
  fetchPhotosFromSpace,
  patchListingPhotoCaption,
  deleteListingPhoto,
} from '@/services/host/edit-listing/gallery';
import type { SpacePhoto } from '@/types/host/edit-listing/spacePhotos';

export type SpacePhotosMap = Record<string, ReadonlyArray<SpacePhoto>>;

type GalleryState = {
  spacePhotos: SpacePhotosMap;
  loadingSpacePhotos: boolean;
  errorSpacePhotos: string | null;
};

const GALLERY_LISTING_KEY = 'gallery:listId' as const;

const keyOf = (id: string | number): string => String(id);

export const $listingId = persistentAtom<string | null>(
  GALLERY_LISTING_KEY,
  null,
  {
    encode: JSON.stringify,
    decode: (v) => {
      try {
        const parsed = JSON.parse(v);
        return typeof parsed === 'string' ? parsed : null;
      } catch {
        return null;
      }
    },
  }
);

export const $gallery: MapStore<GalleryState> = map<GalleryState>({
  spacePhotos: {},
  loadingSpacePhotos: false,
  errorSpacePhotos: null,
});

export function resetGalleryForSecurity(): void {
  $listingId.set(null);
  $gallery.set({
    spacePhotos: {},
    loadingSpacePhotos: false,
    errorSpacePhotos: null,
  });

  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(GALLERY_LISTING_KEY);
    } catch {
      /* noop */
    }
  }
}

export function setListingId(listingId: string | null): void {
  const current = $listingId.get();
  if (current === listingId) {
    return;
  }
  $listingId.set(listingId);
  $gallery.setKey('spacePhotos', {});
  $gallery.setKey('loadingSpacePhotos', false);
  $gallery.setKey('errorSpacePhotos', null);
}

export async function refreshSpacePhotos(
  spaceId: string | number
): Promise<void> {
  const listingId = $listingId.get();
  if (!listingId) {
    $gallery.setKey('spacePhotos', {});
    $gallery.setKey('errorSpacePhotos', 'Missing listingId');
    return;
  }

  const key = keyOf(spaceId);
  try {
    $gallery.setKey('loadingSpacePhotos', true);
    $gallery.setKey('errorSpacePhotos', null);

    const data = await fetchPhotosFromSpace(listingId, key);
    $gallery.setKey('spacePhotos', {
      ...$gallery.get().spacePhotos,
      [key]: data,
    });
  } catch (err) {
    console.error('[refreshSpacePhotos] failed', err);
    $gallery.setKey('errorSpacePhotos', 'Failed to load space photos');
  } finally {
    $gallery.setKey('loadingSpacePhotos', false);
  }
}

export function setSpacePhotos(
  spaceId: string | number,
  photos: ReadonlyArray<SpacePhoto>
): void {
  const key = keyOf(spaceId);
  const prev = $gallery.get().spacePhotos;
  $gallery.setKey('spacePhotos', {
    ...prev,
    [key]: photos,
  });
}

export function getSpacePhotos(
  spaceId: string | number
): ReadonlyArray<SpacePhoto> | undefined {
  const key = keyOf(spaceId);
  return $gallery.get().spacePhotos[key];
}

export function getPhoto(
  spaceId: string | number,
  photoId: string | number
): SpacePhoto | null {
  const key = keyOf(spaceId);
  const list = $gallery.get().spacePhotos[key];
  return list?.find((p) => String(p.id) === String(photoId)) ?? null;
}

export async function updatePhotoCaption(
  spaceId: string | number,
  photoId: number,
  caption: string
): Promise<void> {
  const listingId = $listingId.get();
  if (!listingId) throw new Error('Missing listingId');

  const key = String(spaceId);
  const st = $gallery.get();
  const list = st.spacePhotos[key];
  if (!list) return;

  const current = list.find((p) => p.id === photoId);
  const trimmed = caption.trim();

  if (!current || (current.caption ?? '') === trimmed) return;

  const prevList = list;
  const nextList = list.map((p) =>
    p.id === photoId ? { ...p, caption: trimmed } : p
  );
  $gallery.setKey('spacePhotos', { ...st.spacePhotos, [key]: nextList });

  try {
    await patchListingPhotoCaption(listingId, photoId, trimmed);
  } catch (err) {
    console.error('[updatePhotoCaption] failed', err);
    $gallery.setKey('spacePhotos', { ...st.spacePhotos, [key]: prevList });
    throw err;
  }
}

export async function deleteSpacePhoto(
  spaceId: string | number,
  photoId: number
): Promise<void> {
  const listingId = $listingId.get();
  if (!listingId) throw new Error('Missing listingId');

  const key = keyOf(spaceId);
  const st = $gallery.get();
  const list = st.spacePhotos[key];
  if (!list) return;

  const prevList = list;

  const filtered = list.filter((p) => p.id !== photoId);
  $gallery.setKey('spacePhotos', { ...st.spacePhotos, [key]: filtered });

  try {
    await deleteListingPhoto(listingId, photoId);
  } catch (err) {
    console.error('[deleteSpacePhoto] failed', err);
    $gallery.setKey('spacePhotos', { ...st.spacePhotos, [key]: prevList });
    throw err;
  }
}

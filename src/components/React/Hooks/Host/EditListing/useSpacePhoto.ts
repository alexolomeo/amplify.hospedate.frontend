import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import {
  $gallery,
  getPhoto,
  refreshSpacePhotos,
} from '@/stores/host/editListing/gallery.store';
import type { SpacePhoto } from '@/types/host/edit-listing/spacePhotos';

export function useSpacePhoto(
  listingId: string,
  spaceId: string | number,
  photoId: string | number
) {
  const galleryState = useStore($gallery);

  const [loading, setLoading] = useState(false);
  const lastGood = useRef<SpacePhoto | null>(
    getPhoto(spaceId, photoId) ?? null
  );

  useEffect(() => {
    const p = getPhoto(spaceId, photoId);
    if (p) lastGood.current = p;
  }, [spaceId, photoId, galleryState.spacePhotos]);

  const refetch = async () => {
    setLoading(true);
    try {
      await refreshSpacePhotos(spaceId);
    } finally {
      setLoading(false);
    }
  };

  return { photo: lastGood.current, loading, refetch };
}

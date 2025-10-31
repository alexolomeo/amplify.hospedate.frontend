import type { Photo } from '@/types/listing/space';
import type { MediaPicture } from '@/types/message';

export function mediaPictureToPhoto(m: MediaPicture): Photo {
  return {
    original: m.original,
    srcsetWebp: m.srcsetWebp,
    srcsetAvif: m.srcsetAvif,
  };
}

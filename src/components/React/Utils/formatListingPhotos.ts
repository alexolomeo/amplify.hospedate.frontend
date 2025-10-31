import type { ListingPhoto } from '@/types/createListing';

type SrcSetItem = {
  src: string;
  width: number;
  height: number;
  type?: string;
};

export interface FormattedPhoto {
  key: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  srcSet?: SrcSetItem[];
  sizes: string;
  caption: string;
  order: number;
}

function isValidSrcSetItem(item: SrcSetItem | null): item is SrcSetItem {
  return item !== null;
}

export function formatListingPhotos(
  photos: ListingPhoto[],
  isGallery = false
): FormattedPhoto[] {
  return photos.map((photo, index) => {
    const webpSet = photo.srcsetWebp?.trim()
      ? photo.srcsetWebp
          .split(',')
          .map((src) => {
            const [url, widthStr] = src.trim().split(' ');
            const width = parseInt(widthStr);
            if (isNaN(width) || width <= 0) return null;
            return {
              src: url,
              width,
              height: Math.round(width * 0.75),
            };
          })
          .filter(isValidSrcSetItem)
      : [];

    const avifSet = photo.srcsetAvif?.trim()
      ? photo.srcsetAvif
          .split(',')
          .map((src) => {
            const [url, widthStr] = src.trim().split(' ');
            const width = parseInt(widthStr);
            if (isNaN(width) || width <= 0) return null;
            return {
              src: url,
              width,
              height: Math.round(width * 0.75),
              type: 'image/avif' as const,
            };
          })
          .filter(isValidSrcSetItem)
      : [];

    const mergedSrcSet = [...avifSet, ...webpSet].filter(isValidSrcSetItem);

    const isMainPhoto = index === 0 && !isGallery;

    const result: FormattedPhoto = {
      key: `${photo.id}-${photo.order}`,
      src: photo.original,
      alt: photo.caption || `Imagen ${index + 1}`,
      width: isMainPhoto ? 1200 : 600,
      height: isMainPhoto ? 900 : 450,
      sizes: isMainPhoto ? '50vw' : '25vw',
      caption: photo.caption,
      order: photo.order,
      ...(mergedSrcSet.length > 0 ? { srcSet: mergedSrcSet } : {}),
    };

    return result;
  });
}

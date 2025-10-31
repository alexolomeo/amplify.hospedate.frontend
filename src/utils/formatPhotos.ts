import type { FormattedPhoto, PhotoListingDetail } from '@/types/listing/space';
const DEFAULT_FALLBACK_WIDTH = 1920;

/**
 * Convert srcSet array to HTML srcset string format
 * Groups by type (avif vs webp) for proper source element usage
 */
export function srcSetArrayToString(
  srcSet: { src: string; width: number; height: number; type?: string }[]
): string {
  return srcSet.map((item) => `${item.src} ${item.width}w`).join(', ');
}

/**
 * Get srcSet strings grouped by type for picture element
 */
export function getSrcSetsByType(
  srcSet: { src: string; width: number; height: number; type?: string }[]
): { avif: string; webp: string } {
  const avifItems = srcSet.filter((item) => item.type === 'image/avif');
  const webpItems = srcSet.filter(
    (item) => !item.type || item.type === 'image/webp'
  );

  return {
    avif: avifItems.map((item) => `${item.src} ${item.width}w`).join(', '),
    webp: webpItems.map((item) => `${item.src} ${item.width}w`).join(', '),
  };
}

export function formatPhotosFromListing(
  photos: PhotoListingDetail[],
  isGallery = false
): FormattedPhoto[] {
  return photos
    .sort((a, b) => a.order - b.order)
    .map((photo, index) => {
      const webpSizes = photo.srcsetWebp.split(', ').map((src) => {
        const [url, widthStr] = src.trim().split(' ');
        const width = parseInt(widthStr);
        return {
          src: url,
          width,
          height: Math.round(width * 0.75),
        };
      });
      const avifSizes = photo.srcsetAvif.split(', ').map((src) => {
        const [url, widthStr] = src.trim().split(' ');
        const width = parseInt(widthStr);
        return {
          src: url,
          width,
          height: Math.round(width * 0.75),
          type: 'image/avif',
        };
      });
      const isMainPhoto = index === 0 && !isGallery;
      return {
        key: `${index}-${photo.order}`,
        src: photo.original,
        alt: photo.caption || `Imagen ${index + 1}`,
        width: isMainPhoto ? 1500 : 600,
        height: isMainPhoto ? 1200 : 450,
        srcSet: [...avifSizes, ...webpSizes],
        sizes: isMainPhoto ? '50vw' : '25vw',
        caption: photo.caption,
        order: photo.order,
      };
    });
}

type SrcsetItem = {
  src: string;
  width: number;
  height: number;
  type: 'image/avif' | 'image/webp';
};

function parseSrcset(
  srcset: string | undefined,
  type: 'image/avif' | 'image/webp',
  ratio = 0.75
): SrcsetItem[] {
  if (!srcset || typeof srcset !== 'string') return [];
  return srcset
    .split(',')
    .map((s) => s.trim())
    .map((part) => {
      const lastSpaceIdx = part.lastIndexOf(' ');
      if (lastSpaceIdx === -1) return null;
      const url = part.slice(0, lastSpaceIdx).trim();
      const widthToken = part.slice(lastSpaceIdx + 1).trim();
      if (!widthToken.endsWith('w')) return null;
      const width = parseInt(widthToken.slice(0, -1), 10);
      if (!url || Number.isNaN(width)) return null;
      return { src: url, width, height: Math.round(width * ratio), type };
    })
    .filter((x): x is SrcsetItem => x !== null);
}

export function formatPhotosFromListingBest(
  photos: PhotoListingDetail[],
  aspectRatio = 0.75
): FormattedPhoto[] {
  return photos
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((photo, index) => {
      const avif = photo.srcsetAvif
        ? parseSrcset(photo.srcsetAvif, 'image/avif', aspectRatio)
        : [];
      const webp = photo.srcsetWebp
        ? parseSrcset(photo.srcsetWebp, 'image/webp', aspectRatio)
        : [];
      const all = [...avif, ...webp];

      const best = all.reduce<SrcsetItem | undefined>(
        (acc, cur) => (!acc || cur.width > acc.width ? cur : acc),
        undefined
      );

      const width = best?.width ?? DEFAULT_FALLBACK_WIDTH;
      const height = Math.round(width * aspectRatio);

      return {
        key: `${index}-${photo.order}`,
        src: photo.original,
        alt: photo.caption || `Imagen ${index + 1}`,
        width,
        height,
        srcSet: best ? [best] : [],
        sizes: '100vw',
        caption: photo.caption,
        order: photo.order,
      } as FormattedPhoto;
    });
}

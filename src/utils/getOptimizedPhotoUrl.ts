import type { ListingPhoto } from '@/types/createListing';

export function getOptimizedPhotoUrl(photo: ListingPhoto): string {
  const srcsets = [
    ...(photo.srcsetAvif?.split(',') || []),
    ...(photo.srcsetWebp?.split(',') || []),
  ];

  for (const srcItem of srcsets) {
    const trimmed = srcItem.trim();
    if (!trimmed) continue;
    const [url] = trimmed.split(' ');
    if (url) return url;
  }

  return photo.original ?? '';
}

import type { ListingPhoto } from '@/types/createListing';

export const sortByOrder = (photos: ListingPhoto[]) =>
  photos.slice().sort((a, b) => a.order - b.order);

export const toOrder = (photos: ListingPhoto[]) =>
  photos.map((p, i) => ({ id: p.id, order: i + 1 }));

export const hasOrderChanged = (
  before: ListingPhoto[],
  after: ListingPhoto[]
) => {
  if (before.length !== after.length) return true;
  for (let i = 0; i < before.length; i++) {
    if (before[i].id !== after[i].id || before[i].order !== after[i].order) {
      return true;
    }
  }
  return false;
};

import { persistentAtom } from '@nanostores/persistent';
import { atom } from 'nanostores';
import type { ListingCreationData } from '@/types/createListing';

export const $creationOptions = persistentAtom<ListingCreationData | null>(
  'creationOptions',
  null,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);
export const $isCreateListingReset = atom<boolean>(false);

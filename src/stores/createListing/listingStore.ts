import { persistentAtom } from '@nanostores/persistent';
import type { CreateListingData } from '@/types/createListing';

const INITIAL_DATA: CreateListingData = {
  place_information: { showSpecificLocation: false },
  place_features: {},
  place_setup: {},
};

export const $listingId = persistentAtom<string | null>('listingId', null, {
  encode: (v) => v ?? '',
  decode: (v) => (v === '' ? null : v),
});

export const $currentStep = persistentAtom<number>('currentStep', 0, {
  encode: String,
  decode: (v) => {
    const n = Number.parseInt(v, 10);
    return Number.isNaN(n) ? 0 : n;
  },
});
export const $progressLoadedFor = persistentAtom<string | null>(
  'progressLoadedFor',
  null,
  {
    encode: String,
    decode: (v) => v,
  }
);
export const $listingData = persistentAtom<CreateListingData>(
  'listingData',
  INITIAL_DATA,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);
export const $maxStepAllowed = persistentAtom<number>('maxStepAllowed', 0, {
  encode: String,
  decode: (v) => {
    const n = Number.parseInt(v, 10);
    return Number.isNaN(n) ? 0 : n;
  },
});

import { STEPS } from './create-listing.steps';

export const STEP_SLUGS: Record<number, string> = {
  [STEPS.CREATE_LISTING_COVER]: 'overview',
  [STEPS.PLACE_INFORMATION_COVER]: 'about-your-place',
  [STEPS.PLACE_INFORMATION_PLACE_TYPE]: 'place-type',
  [STEPS.PLACE_INFORMATION_PICK_LOCATION]: 'location',
  [STEPS.PLACE_INFORMATION_CONFIRM_LOCATION]: 'confirm-location',
  [STEPS.PLACE_INFORMATION_CAPACITY]: 'capacity',
  [STEPS.PLACE_FEATURES_COVER]: 'stand-out',
  [STEPS.PLACE_FEATURES_AMENITY]: 'amenities',
  [STEPS.PLACE_FEATURES_UPLOAD_PHOTOS]: 'upload-photos',
  [STEPS.PLACE_FEATURES_GALLERY]: 'photos',
  [STEPS.PLACE_FEATURES_TITLE]: 'title',
  [STEPS.PLACE_FEATURES_DESCRIPTION]: 'description',
  [STEPS.PLACE_SETUP_COVER]: 'finish-setup',
  [STEPS.PLACE_SETUP_PRICING]: 'price',
  [STEPS.PLACE_SETUP_DISCOUNT]: 'discount',
};

export const SLUG_TO_STEP: Record<string, number> = Object.entries(
  STEP_SLUGS
).reduce(
  (acc, [key, value]) => {
    acc[value] = Number(key);
    return acc;
  },
  {} as Record<string, number>
);

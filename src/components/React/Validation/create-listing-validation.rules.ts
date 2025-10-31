import type { CreateListingData } from '@/types/createListing';
import { STEPS } from '@/components/React/Utils/create-listing.steps';

export const STEP_VALIDATIONS: Record<
  number,
  (data: CreateListingData) => boolean
> = {
  [STEPS.CREATE_LISTING_COVER]: () => true,
  [STEPS.PLACE_INFORMATION_COVER]: () => true,
  [STEPS.PLACE_INFORMATION_PLACE_TYPE]: (data) =>
    !!data.place_information.placeTypeId,
  [STEPS.PLACE_INFORMATION_PICK_LOCATION]: (data) => {
    const coords = data.place_information.location?.coordinates;
    return coords?.latitude !== undefined && coords?.longitude !== undefined;
  },
  [STEPS.PLACE_INFORMATION_CONFIRM_LOCATION]: (data) =>
    !!data.place_information.location?.address &&
    !!data.place_information.location.city &&
    !!data.place_information.location.state &&
    !!data.place_information.location.country &&
    data.place_information.location.coordinates?.latitude !== undefined &&
    data.place_information.location.coordinates?.longitude !== undefined &&
    data.place_information.showSpecificLocation !== undefined,
  [STEPS.PLACE_INFORMATION_CAPACITY]: () => true,
  [STEPS.PLACE_FEATURES_COVER]: () => true,
  [STEPS.PLACE_FEATURES_AMENITY]: () => true,
  [STEPS.PLACE_FEATURES_UPLOAD_PHOTOS]: (data) =>
    (data.place_features.photos?.length ?? 0) >= 1,
  [STEPS.PLACE_FEATURES_GALLERY]: (data) =>
    (data.place_features.photos?.length ?? 0) >= 5,
  [STEPS.PLACE_FEATURES_TITLE]: (data) => !!data.place_features.title?.trim(),
  [STEPS.PLACE_FEATURES_DESCRIPTION]: (data) =>
    !!data.place_features.description?.trim(),
  [STEPS.PLACE_SETUP_COVER]: () => true,
  [STEPS.PLACE_SETUP_PRICING]: (data) => {
    const price = data.place_setup.nightlyPrice;
    return typeof price === 'number' && price >= 50 && price <= 10000;
  },
  [STEPS.PLACE_SETUP_DISCOUNT]: (data) => {
    const discount = data.place_setup.discount;
    if (!discount) return true;
    const { weeklyDiscount = 0, monthlyDiscount = 0 } = discount;
    if (
      weeklyDiscount > 0 &&
      monthlyDiscount > 0 &&
      monthlyDiscount <= weeklyDiscount
    ) {
      return false;
    }
    return true;
  },
};

export const getStepValidation = (step: number) => STEP_VALIDATIONS[step];

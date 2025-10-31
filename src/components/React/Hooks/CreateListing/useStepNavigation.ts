import { useCallback, useMemo } from 'react';
import { STEPS } from '@/components/React/Utils/create-listing.steps';
import {
  $currentStep,
  $maxStepAllowed,
} from '@/stores/createListing/listingStore';
import type { CreateListingData } from '@/types/createListing';
import { isStepValid } from '@/components/React/Helper/CreateListing/createListing.helpers';
import { STEP_VALIDATIONS } from '@/components/React/Validation/create-listing-validation.rules';

type OnLocationNeedsConfirm = () => Promise<boolean>;

export function useStepNavigation(
  listingData: CreateListingData,
  totalSteps: number,
  onLocationNeedsConfirm?: OnLocationNeedsConfirm
) {
  const photosLen = useMemo(
    () => listingData.place_features?.photos?.length ?? 0,
    [listingData.place_features?.photos]
  );

  const goToPrevStep = useCallback(() => {
    const current = $currentStep.get();

    if (current === STEPS.PLACE_FEATURES_GALLERY && photosLen > 0) {
      $currentStep.set(STEPS.PLACE_FEATURES_AMENITY);
    } else {
      $currentStep.set(Math.max(current - 1, 0));
    }
  }, [photosLen]);

  const goToNextStep = useCallback(async () => {
    let next = $currentStep.get();

    if (next === STEPS.PLACE_FEATURES_AMENITY && photosLen > 0) {
      next = STEPS.PLACE_FEATURES_GALLERY;
    } else if (
      next === STEPS.PLACE_INFORMATION_CONFIRM_LOCATION &&
      onLocationNeedsConfirm
    ) {
      const ok = await onLocationNeedsConfirm();
      if (!ok) return;
      next = STEPS.PLACE_INFORMATION_CAPACITY;
    } else {
      next = Math.min(next + 1, totalSteps);
    }

    if (isStepValid(next, listingData, STEP_VALIDATIONS)) {
      if (next > $maxStepAllowed.get()) $maxStepAllowed.set(next);
    }
    $currentStep.set(next);
  }, [photosLen, onLocationNeedsConfirm, listingData, totalSteps]);

  return { goToPrevStep, goToNextStep };
}

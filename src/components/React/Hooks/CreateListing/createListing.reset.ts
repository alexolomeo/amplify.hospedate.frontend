import {
  $listingId,
  $currentStep,
  $progressLoadedFor,
  $maxStepAllowed,
  $listingData,
} from '@/stores/createListing/listingStore';
import {
  $creationOptions,
  $isCreateListingReset,
} from '@/stores/createListing/creationOptionsStore';

export function resetCreateListingState() {
  $listingId.set(null);
  $currentStep.set(0);
  $progressLoadedFor.set(null);
  $maxStepAllowed.set(0);
  $listingData.set({
    place_information: { showSpecificLocation: false },
    place_features: {},
    place_setup: {},
  });
  $creationOptions.set(null);
  $isCreateListingReset.set(true);
}

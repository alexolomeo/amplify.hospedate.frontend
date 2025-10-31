import { useEffect } from 'react';
import axios from 'axios';
import { stepMapping } from '@/components/React/Utils/create-listing.step-mapping';
import { STEP_SLUGS } from '@/components/React/Utils/create-listing.step-slugs';
import { getListingProgressData } from '@/services/createListing';
import {
  $listingId,
  $currentStep,
  $progressLoadedFor,
  $listingData,
  $maxStepAllowed,
} from '@/stores/createListing/listingStore';
import {
  replaceUrl,
  nearestIncompleteOrRequested,
} from '@/components/React/Helper/CreateListing/createListing.helpers';
import { STEP_VALIDATIONS } from '@/components/React/Validation/create-listing-validation.rules';
import { useToast } from '@/components/React/CreateListing/ToastContext';
import { resetCreateListingState } from '@/components/React/Hooks/CreateListing/createListing.reset';
import type { SupportedLanguages } from '@/utils/i18n';
import { getTranslation } from '@/utils/i18n';

type Args = {
  initialListingId?: string;
  stepSlug?: string;
  setLoading: (v: boolean) => void;
  lang: SupportedLanguages;
};

export function useListingProgress({
  initialListingId,
  stepSlug,
  setLoading,
  lang = 'es',
}: Args) {
  const t = getTranslation(lang);
  const { showToast } = useToast();

  useEffect(() => {
    const seedId = initialListingId ?? $listingId.get();
    if (seedId && seedId === $progressLoadedFor.get()) {
      setLoading(false);
      return;
    }

    if (seedId) {
      $listingId.set(seedId);
      (async () => {
        try {
          const res = await getListingProgressData(seedId, {
            skipGlobal404Redirect: true,
          });

          $listingData.set({
            place_information: {
              placeTypeId: res.placeTypeId,
              guestNumber: res.guestNumber,
              roomNumber: res.roomNumber,
              bedNumber: res.bedNumber,
              bathNumber: res.bathNumber,
              location: res.location,
              showSpecificLocation: res.showSpecificLocation ?? false,
            },
            place_features: {
              amenities: res.amenities || [],
              photos: res.photos || [],
              title: res.title || '',
              description: res.description || '',
            },
            place_setup: {
              nightlyPrice: res.nightlyPrice,
              discount: res.discount || {
                weeklyDiscount: 0,
                monthlyDiscount: 0,
              },
            },
          });

          const mapped =
            stepMapping[`${res.currentStep}-${res.currentSubStep}`] ?? 0;

          const data = $listingData.get();
          const target = nearestIncompleteOrRequested(
            mapped,
            data,
            STEP_VALIDATIONS
          );

          $currentStep.set(target);
          $maxStepAllowed.set(target);
          $progressLoadedFor.set(seedId);

          if (!stepSlug) {
            const slugPath = `/listing/create/${seedId}/${STEP_SLUGS[target]}`;
            replaceUrl(slugPath);
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            showToast({
              type: 'error',
              message: t.createListing.toast.errors.fetchFailed,
              autoClose: true,
              duration: 3000,
            });

            resetCreateListingState();

            replaceUrl('/listing/create/overview');
          } else {
            throw error;
          }
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [
    initialListingId,
    stepSlug,
    setLoading,
    showToast,
    t.createListing.toast.errors.fetchFailed,
  ]);
}

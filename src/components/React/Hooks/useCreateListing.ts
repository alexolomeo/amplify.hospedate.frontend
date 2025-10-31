import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import type { CreateListingData } from '@/types/createListing';
import {
  createListing,
  updateListingStep,
  finalizeListingCreation,
} from '@/services/createListing';
import { STEPS } from '../Utils/create-listing.steps';
import { stepPaths } from '../Utils/create-listing.step-paths';
import { extractPayloadFromData } from '../Utils/prepareUpdatePayload';
import { STEP_VALIDATIONS } from '../Validation/create-listing-validation.rules';
import { useCreateListingPhotos } from './CreateListing/useCreateListingPhotos';
import { useConfirm } from '@/components/React/CreateListing/ConfirmDialogContext';
import { useToast } from '../CreateListing/ToastContext';
import { navigate } from 'astro:transitions/client';
import { getOptimizedPhotoUrl } from '@/utils/getOptimizedPhotoUrl';
import type { SupportedLanguages } from '@/utils/i18n';
import { getTranslation } from '@/utils/i18n';
import type { ConfirmOptions } from '../CreateListing/ConfirmDialogContext';
import { useStore } from '@nanostores/react';
import { fetchUserMe } from '@/services/users';

import {
  $creationOptions,
  $isCreateListingReset,
} from '@/stores/createListing/creationOptionsStore';
import {
  $listingId,
  $currentStep,
  $listingData,
  $maxStepAllowed,
} from '@/stores/createListing/listingStore';

import { resetCreateListingState } from '@/components/React/Hooks/CreateListing/createListing.reset';
import { useCreationOptions } from '@/components/React/Hooks/CreateListing/useCreationOptions';
import { useListingProgress } from '@/components/React/Hooks/CreateListing/useListingProgress';
import { useStepUrlSync } from '@/components/React/Hooks/CreateListing/useStepUrlSync';
import { useStepNavigation } from '@/components/React/Hooks/CreateListing/useStepNavigation';
import { $userStore } from '@/stores/userStore';

export function useCreateListing(
  initialListingId?: string,
  stepSlug?: string,
  lang: SupportedLanguages = 'es'
) {
  const [initialListingIdLoading, setInitialListingIdLoading] =
    useState<boolean>(!!initialListingId);
  const [loading, setLoading] = useState(false);
  const [invalidSaveAttempt, setInvalidSaveAttempt] = useState(false);
  const totalSteps = 14;

  const creationOptions = useStore($creationOptions);
  const listingId = useStore($listingId);
  const currentStep = useStore($currentStep);
  const listingData = useStore($listingData);
  const currentUser = useStore($userStore);

  const confirm = useConfirm();
  const { confirmToast, showToast } = useToast();
  const t = getTranslation(lang);

  useEffect(() => {
    if ($isCreateListingReset.get()) {
      $isCreateListingReset.set(false);
    }
  }, []);

  // Load options (placeTypes + amenities)
  useCreationOptions();

  // Load progress from backend (used to continue creation)
  useListingProgress({
    initialListingId,
    stepSlug,
    setLoading: setInitialListingIdLoading,
    lang,
  });

  // Bidirectional synchronization Step <-> URL + manual navigation validations
  useStepUrlSync();

  const isValid =
    !STEP_VALIDATIONS[currentStep] ||
    STEP_VALIDATIONS[currentStep](listingData);

  const onLocationNeedsConfirm = useCallback(async () => {
    if (currentStep === STEPS.PLACE_INFORMATION_CONFIRM_LOCATION) {
      const ok = await confirmToast({
        type: 'warning',
        message: t.createListing.toast.confirmAddress.confirmAddressWarning,
        primaryLabel:
          t.createListing.toast.confirmAddress.confirmAddressPrimary,
        secondaryLabel:
          t.createListing.toast.confirmAddress.confirmAddressSecondary,
      });
      return !!ok;
    }
    return true;
  }, [currentStep, confirmToast, t]);

  // Navigation between steps (prev/next) with special rules
  const { goToPrevStep, goToNextStep } = useStepNavigation(
    listingData,
    totalSteps,
    onLocationNeedsConfirm
  );

  // Partial update of the listing data
  const updateData = useCallback(
    <K extends keyof CreateListingData>(
      section: K,
      payload: Partial<CreateListingData[K]>
    ) => {
      const prev = $listingData.get();
      if (!prev) return;
      const updated: CreateListingData = {
        ...prev,
        [section]: { ...prev[section], ...payload },
      };
      $listingData.set(updated);
    },
    []
  );

  const submitStepData = async (): Promise<void> => {
    let idToUse = listingId;
    const updatedListingData = { ...listingData };

    if (!idToUse && currentStep === STEPS.PLACE_INFORMATION_PLACE_TYPE) {
      idToUse = await createListing({
        placeTypeId: listingData.place_information.placeTypeId!,
      });
      $listingId.set(idToUse);
    }

    const stepPath = stepPaths[currentStep];
    if (idToUse && stepPath) {
      const payload = extractPayloadFromData(updatedListingData);
      await updateListingStep(idToUse, stepPath, payload, {
        skipGlobal404Redirect: true,
      });
    }
  };

  const handleStepSubmit = async (): Promise<void> => {
    if (!isValid) return;
    setLoading(true);

    const stepPath = stepPaths[currentStep];
    if (!stepPath) {
      await Promise.resolve();
      await goToNextStep();
      setLoading(false);
      return;
    }

    try {
      await submitStepData();

      if (currentStep === STEPS.PLACE_SETUP_DISCOUNT) {
        const firstPhoto = listingData.place_features.photos?.find(
          (p) => p.order === 1
        );
        const photoUrl = firstPhoto ? getOptimizedPhotoUrl(firstPhoto) : '';

        let modalType: ConfirmOptions['type'] = 'listingPublishedUnregistered';
        try {
          const me = await fetchUserMe();
          modalType = me.identityVerified
            ? 'listingPublishedRegistered'
            : 'listingPublishedUnregistered';
        } catch (e) {
          console.warn('Could not refresh user before publishing:', e);
        }

        const result = await confirm({ type: modalType, data: { photoUrl } });

        switch (result) {
          case 'submitForReview':
          case 'verifyLater':
          case 'verifyNow': {
            try {
              if (!listingId) {
                throw new Error(
                  'listingId is undefined when finalizing listing creation.'
                );
              }
              await finalizeListingCreation(listingId, {
                skipGlobal404Redirect: true,
              });
            } catch (error) {
              console.error('Error at finalizing listing creation:', error);
              confirmToast({
                type: 'warning',
                message: t.createListing.modal.common.finalizationFailed,
              });
              return;
            }

            resetCreateListingState();
            navigate('/hosting/listings');
            break;
          }

          case 'close':
          default:
            break;
        }
      } else {
        await goToNextStep();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        showToast({
          type: 'error',
          message: t.createListing.toast.errors.saveFailed,
          autoClose: true,
          duration: 3000,
        });
      } else {
        console.error(`Error al guardar paso: ${String(error)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const navigateBasedOnUserRole = (): void => {
    if (currentUser?.isHost) {
      navigate('/hosting/listings');
    } else {
      navigate('/');
    }
  };

  const handleSaveAndExit = async (): Promise<void> => {
    setInvalidSaveAttempt(false);
    setLoading(true);

    if (!isValid) {
      const confirmed = await confirm({ type: 'default' });
      if (!confirmed) {
        setInvalidSaveAttempt(true);
        setLoading(false);
        return;
      }
      resetCreateListingState();
      navigateBasedOnUserRole();
      return;
    }

    const stepPath = stepPaths[currentStep];
    if (!stepPath) {
      resetCreateListingState();
      navigateBasedOnUserRole();
      return;
    }

    try {
      await submitStepData();
      resetCreateListingState();
      navigateBasedOnUserRole();
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        showToast({
          type: 'error',
          message: t.createListing.toast.errors.saveFailed,
          autoClose: true,
          duration: 3000,
        });
      } else {
        console.error('Error on Save & Exit:', e);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStep === STEPS.PLACE_INFORMATION_CAPACITY) {
      const { guestNumber, roomNumber, bedNumber, bathNumber } =
        listingData.place_information;

      const patch: Partial<typeof listingData.place_information> = {};

      if (guestNumber === undefined) patch.guestNumber = 1;
      if (roomNumber === undefined) patch.roomNumber = 0;
      if (bedNumber === undefined) patch.bedNumber = 1;
      if (bathNumber === undefined) patch.bathNumber = 0.5;

      if (Object.keys(patch).length > 0) {
        updateData('place_information', patch);
      }
    } else if (currentStep === STEPS.PLACE_FEATURES_AMENITY) {
      const { amenities } = listingData.place_features;
      if (amenities === undefined) {
        updateData('place_features', { amenities: [] });
      }
    } else if (currentStep === STEPS.PLACE_SETUP_DISCOUNT) {
      const { discount } = listingData.place_setup;
      if (discount === undefined) {
        updateData('place_setup', {
          discount: { weeklyDiscount: 0, monthlyDiscount: 0 },
        });
      }
    }
  }, [
    currentStep,
    listingData.place_information,
    listingData.place_features,
    listingData.place_setup,
    updateData,
    listingData,
  ]);

  const {
    deletePhoto,
    updatePhotoCaption,
    reorderPhotos,
    uploadPhotosWithProgress,
  } = useCreateListingPhotos(
    listingId,
    listingData.place_features.photos ?? [],
    (updated) => updateData('place_features', { photos: updated }),
    lang
  );

  useEffect(() => {
    const photos = listingData.place_features.photos ?? [];
    if (
      currentStep === STEPS.PLACE_FEATURES_UPLOAD_PHOTOS &&
      photos.length >= 1 &&
      $currentStep.get() !== STEPS.PLACE_FEATURES_GALLERY
    ) {
      $currentStep.set(STEPS.PLACE_FEATURES_GALLERY);
      if (STEPS.PLACE_FEATURES_GALLERY > $maxStepAllowed.get()) {
        $maxStepAllowed.set(STEPS.PLACE_FEATURES_GALLERY);
      }
    } else if (
      currentStep === STEPS.PLACE_FEATURES_GALLERY &&
      photos.length === 0 &&
      $currentStep.get() !== STEPS.PLACE_FEATURES_UPLOAD_PHOTOS
    ) {
      $currentStep.set(STEPS.PLACE_FEATURES_UPLOAD_PHOTOS);
    }
  }, [currentStep, listingData.place_features.photos]);

  return {
    // state
    initialListingIdLoading,
    currentStep,
    totalSteps,
    listingData,
    creationOptions,

    // actions
    updateData,
    goToPrevStep,
    goToNextStep,
    handleStepSubmit,
    handleSaveAndExit,

    // flags/UI
    isValid,
    loading,
    invalidSaveAttempt,

    // photos
    deletePhoto,
    updatePhotoCaption,
    reorderPhotos,
    uploadPhotosWithProgress,
  };
}

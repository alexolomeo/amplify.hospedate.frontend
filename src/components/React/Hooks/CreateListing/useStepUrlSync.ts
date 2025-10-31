import { useEffect, useCallback, useRef } from 'react';
import { useStore } from '@nanostores/react';
import {
  $currentStep,
  $maxStepAllowed,
  $listingData,
  $listingId,
} from '@/stores/createListing/listingStore';
import { STEP_VALIDATIONS } from '@/components/React/Validation/create-listing-validation.rules';
import {
  parseRequestedStepFromLocation,
  buildPath,
  pushUrlIfChanged,
  replaceUrl,
  nearestIncompleteOrRequested,
} from '@/components/React/Helper/CreateListing/createListing.helpers';

export function useStepUrlSync() {
  const currentStep = useStore($currentStep);
  const listingId = useStore($listingId);

  const didInitRef = useRef(false);

  const handleUrlStepRequest = useCallback(() => {
    const requested = parseRequestedStepFromLocation();
    if (requested === undefined) return;

    const current = $currentStep.get();
    const data = $listingData.get();
    const max = $maxStepAllowed.get();
    const id = $listingId.get();

    if (requested > max + 1) {
      replaceUrl(buildPath(id, current));
      return;
    }

    if (requested === max + 1) {
      const target = nearestIncompleteOrRequested(
        requested,
        data,
        STEP_VALIDATIONS
      );
      if (target !== requested) {
        $currentStep.set(target);
        replaceUrl(buildPath(id, target));
        return;
      }
      $currentStep.set(requested);
      $maxStepAllowed.set(requested);
      return;
    }

    const target = nearestIncompleteOrRequested(
      requested,
      data,
      STEP_VALIDATIONS
    );

    if (target !== current) {
      $currentStep.set(target);
    }
  }, []);

  useEffect(() => {
    handleUrlStepRequest();
    didInitRef.current = true;
  }, [handleUrlStepRequest]);

  useEffect(() => {
    if (!didInitRef.current) return;
    const id = $listingId.get();
    const step = $currentStep.get();
    const path = buildPath(id, step);
    pushUrlIfChanged(path);
  }, [currentStep, listingId]);

  useEffect(() => {
    const onPopState = () => handleUrlStepRequest();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [handleUrlStepRequest]);
}

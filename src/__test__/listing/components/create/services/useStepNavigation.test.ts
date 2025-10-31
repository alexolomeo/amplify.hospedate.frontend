import { describe, it, beforeEach, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStepNavigation } from '@/components/React/Hooks/CreateListing/useStepNavigation';
import {
  $currentStep,
  $maxStepAllowed,
} from '@/stores/createListing/listingStore';
import { STEPS } from '@/components/React/Utils/create-listing.steps';
import type { CreateListingData } from '@/types/createListing';

function makeListingData(
  partial?: Partial<CreateListingData>
): CreateListingData {
  return {
    place_information: {},
    place_features: {},
    place_setup: {},
    ...(partial ?? {}),
  };
}

describe('useStepNavigation', () => {
  const TOTAL_STEPS = 14;

  beforeEach(() => {
    $currentStep.set(0);
    $maxStepAllowed.set(0);
  });

  it('normal backward: goToPrevStep decrements currentStep', async () => {
    $currentStep.set(5);

    const listingData = makeListingData();
    const { result } = renderHook(() =>
      useStepNavigation(listingData, TOTAL_STEPS)
    );

    await act(async () => {
      result.current.goToPrevStep();
    });

    expect($currentStep.get()).toBe(4);
    expect($maxStepAllowed.get()).toBe(0);
  });

  it('special backward: gallery -> amenity when there are photos', async () => {
    $currentStep.set(STEPS.PLACE_FEATURES_GALLERY);

    const listingData = makeListingData({
      place_features: {
        photos: [
          {
            id: 1,
            original: '',
            srcsetWebp: '',
            srcsetAvif: '',
            caption: '',
            order: 1,
          },
        ],
      },
    });

    const { result } = renderHook(() =>
      useStepNavigation(listingData, TOTAL_STEPS)
    );

    await act(async () => {
      result.current.goToPrevStep();
    });

    expect($currentStep.get()).toBe(STEPS.PLACE_FEATURES_AMENITY);
    expect($maxStepAllowed.get()).toBe(0);
  });

  it('normal forward: increments currentStep and updates maxStepAllowed when moving forward', async () => {
    $currentStep.set(3);
    $maxStepAllowed.set(3);

    const listingData = makeListingData({
      place_information: {
        location: {
          address: 'Calle 123',
          city: 'Santa Cruz',
          state: 'Santa Cruz',
          country: 'Bolivia',
          coordinates: { latitude: -17.78, longitude: -63.18 },
        },
        showSpecificLocation: false,
      },
    });

    const { result } = renderHook(() =>
      useStepNavigation(listingData, TOTAL_STEPS)
    );

    await act(async () => {
      await result.current.goToNextStep();
    });

    expect($currentStep.get()).toBe(4);
    expect($maxStepAllowed.get()).toBe(4);
  });

  it('normal forward: does NOT promote maxStepAllowed if next step is invalid', async () => {
    $currentStep.set(3);
    $maxStepAllowed.set(3);

    const listingData = makeListingData();

    const { result } = renderHook(() =>
      useStepNavigation(listingData, TOTAL_STEPS)
    );

    await act(async () => {
      await result.current.goToNextStep();
    });

    expect($currentStep.get()).toBe(4);
    expect($maxStepAllowed.get()).toBe(3);
  });

  it('special forward: amenity -> gallery with <5 photos: does NOT promote maxStepAllowed', async () => {
    $currentStep.set(STEPS.PLACE_FEATURES_AMENITY);
    $maxStepAllowed.set(STEPS.PLACE_FEATURES_AMENITY);

    const listingData = makeListingData({
      place_features: {
        photos: [
          {
            id: 1,
            original: '',
            srcsetWebp: '',
            srcsetAvif: '',
            caption: '',
            order: 1,
          },
        ],
      },
    });

    const { result } = renderHook(() =>
      useStepNavigation(listingData, TOTAL_STEPS)
    );

    await act(async () => {
      await result.current.goToNextStep();
    });

    expect($currentStep.get()).toBe(STEPS.PLACE_FEATURES_GALLERY);
    expect($maxStepAllowed.get()).toBe(STEPS.PLACE_FEATURES_AMENITY);
  });

  it('special forward: amenity -> gallery with >=5 photos: promotes maxStepAllowed', async () => {
    $currentStep.set(STEPS.PLACE_FEATURES_AMENITY);
    $maxStepAllowed.set(STEPS.PLACE_FEATURES_AMENITY);

    const photos = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      original: '',
      srcsetWebp: '',
      srcsetAvif: '',
      caption: '',
      order: i + 1,
    }));

    const listingData = makeListingData({
      place_features: { photos },
    });

    const { result } = renderHook(() =>
      useStepNavigation(listingData, TOTAL_STEPS)
    );

    await act(async () => {
      await result.current.goToNextStep();
    });

    expect($currentStep.get()).toBe(STEPS.PLACE_FEATURES_GALLERY);
    expect($maxStepAllowed.get()).toBe(STEPS.PLACE_FEATURES_GALLERY);
  });

  it('forward with location confirmation: only moves forward if onLocationNeedsConfirm() returns true', async () => {
    $currentStep.set(STEPS.PLACE_INFORMATION_CONFIRM_LOCATION);
    $maxStepAllowed.set(STEPS.PLACE_INFORMATION_CONFIRM_LOCATION);

    const listingData = makeListingData();
    const onLocationNeedsConfirm = async () => true;

    const { result } = renderHook(() =>
      useStepNavigation(listingData, TOTAL_STEPS, onLocationNeedsConfirm)
    );

    await act(async () => {
      await result.current.goToNextStep();
    });

    expect($currentStep.get()).toBe(STEPS.PLACE_INFORMATION_CAPACITY);
    expect($maxStepAllowed.get()).toBe(STEPS.PLACE_INFORMATION_CAPACITY);
  });

  it('forward with location confirmation: does NOT move forward if onLocationNeedsConfirm() returns false', async () => {
    $currentStep.set(STEPS.PLACE_INFORMATION_CONFIRM_LOCATION);
    $maxStepAllowed.set(STEPS.PLACE_INFORMATION_CONFIRM_LOCATION);

    const listingData = makeListingData();
    const onLocationNeedsConfirm = async () => false;

    const { result } = renderHook(() =>
      useStepNavigation(listingData, TOTAL_STEPS, onLocationNeedsConfirm)
    );

    await act(async () => {
      await result.current.goToNextStep();
    });

    expect($currentStep.get()).toBe(STEPS.PLACE_INFORMATION_CONFIRM_LOCATION);
    expect($maxStepAllowed.get()).toBe(
      STEPS.PLACE_INFORMATION_CONFIRM_LOCATION
    );
  });
});

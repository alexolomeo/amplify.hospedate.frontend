import { useCallback } from 'react';
import { STEPS } from '@/components/React/Utils/create-listing.steps';
import type {
  CreateListingData,
  ListingPhoto,
  ListingCreationData,
  PlaceLocation,
  Amenity,
  Discount,
} from '@/types/createListing';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import LoadingSpinner from '../Common/LoadingSpinner';

import CreateListingCover from '@/components/React/CreateListing/Steps/CreateListingCover';
import PlaceInformationCover from '@/components/React/CreateListing/Steps/PlaceInformation/PlaceInformationCover';
import PlaceInformationPlaceType from '@/components/React/CreateListing/Steps/PlaceInformation/PlaceInformationPlaceType';
import PlaceInformationPickLocation from '@/components/React/CreateListing/Steps/PlaceInformation/PlaceInformationPickLocation';
import PlaceInformationConfirmLocation from '@/components/React/CreateListing/Steps/PlaceInformation/PlaceInformationConfirmLocation';
import PlaceInformationCapacity from '@/components/React/CreateListing/Steps/PlaceInformation/PlaceInformationCapacity';
import PlaceFeaturesCover from '@/components/React/CreateListing/Steps/PlaceFeatures/PlaceFeaturesCover';
import PlaceFeaturesAmenity from '@/components/React/CreateListing/Steps/PlaceFeatures/PlaceFeaturesAmenity';
import PlaceFeaturesUploadPhotos from '@/components/React/CreateListing/Steps/PlaceFeatures/PlaceFeaturesPhotos/PlaceFeaturesUploadPhotos';
import PlaceFeaturesGallery from '@/components/React/CreateListing/Steps/PlaceFeatures/PlaceFeaturesPhotos/PlaceFeaturesGallery';
import PlaceFeaturesTitle from '@/components/React/CreateListing/Steps/PlaceFeatures/PlaceFeaturesTitle';
import PlaceFeaturesDescription from '@/components/React/CreateListing/Steps/PlaceFeatures/PlaceFeaturesDescription';
import PlaceSetupCover from '@/components/React/CreateListing/Steps/PlaceSetup/PlaceSetupCover';
import PlaceSetupPricing from '@/components/React/CreateListing/Steps/PlaceSetup/PlaceSetupPricing';
import PlaceSetupDiscount from '@/components/React/CreateListing/Steps/PlaceSetup/PlaceSetupDiscount';

interface Props {
  initialListingIdLoading: boolean;
  currentStep: number;
  listingData: CreateListingData;
  updateData: <K extends keyof CreateListingData>(
    section: K,
    payload: Partial<CreateListingData[K]>
  ) => void;
  creationOptions?: ListingCreationData | null;
  onDeletePhoto: (photoId: number) => Promise<void>;
  onReorderPhotos: (ordered: ListingPhoto[]) => Promise<void>;
  onUpdateCaption: (photoId: number, newCaption: string) => Promise<void>;
  onUploadWithProgress: (
    files: File[],
    onProgressByIndex: (index: number, progress: number) => void
  ) => Promise<void>;
  lang?: SupportedLanguages;
}

export default function WizardStepContent({
  initialListingIdLoading,
  currentStep,
  listingData,
  updateData,
  creationOptions,
  onDeletePhoto,
  onReorderPhotos,
  onUpdateCaption,
  onUploadWithProgress,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);

  // Extract all updateData calls into useCallback functions
  const handlePlaceTypeUpdate = useCallback(
    (val: number) => {
      updateData('place_information', { placeTypeId: val });
    },
    [updateData]
  );

  const handleLocationUpdate = useCallback(
    (val: PlaceLocation) => {
      updateData('place_information', { location: val });
    },
    [updateData]
  );

  const handleShowSpecificLocationToggle = useCallback(
    (val: boolean) => {
      updateData('place_information', { showSpecificLocation: val });
    },
    [updateData]
  );

  const handleCapacityUpdate = useCallback(
    (val: {
      guestNumber: number;
      roomNumber: number;
      bedNumber: number;
      bathNumber: number;
    }) => {
      updateData('place_information', val);
    },
    [updateData]
  );

  const handleAmenitiesUpdate = useCallback(
    (val: Amenity[]) => {
      updateData('place_features', { amenities: val });
    },
    [updateData]
  );

  const handlePhotosUpdate = useCallback(
    (updatedPhotos: ListingPhoto[]) => {
      updateData('place_features', { photos: updatedPhotos });
    },
    [updateData]
  );

  const handleTitleUpdate = useCallback(
    (val: string) => {
      updateData('place_features', { title: val });
    },
    [updateData]
  );

  const handleDescriptionUpdate = useCallback(
    (val: string) => {
      updateData('place_features', { description: val });
    },
    [updateData]
  );

  const handlePricingUpdate = useCallback(
    (val: number) => {
      updateData('place_setup', { nightlyPrice: val });
    },
    [updateData]
  );

  const handleDiscountUpdate = useCallback(
    (val: Discount) => {
      updateData('place_setup', { discount: val });
    },
    [updateData]
  );

  if (initialListingIdLoading) {
    return (
      <LoadingSpinner
        lang={lang}
        className="h-96"
        message={translate(
          getTranslation(lang),
          'createListing.wizardStepContent.loadingListing'
        )}
      />
    );
  }
  switch (currentStep) {
    case STEPS.CREATE_LISTING_COVER:
      return <CreateListingCover lang={lang} />;
    case STEPS.PLACE_INFORMATION_COVER:
      return <PlaceInformationCover lang={lang} />;
    case STEPS.PLACE_INFORMATION_PLACE_TYPE:
      return (
        <PlaceInformationPlaceType
          loading={!creationOptions}
          placeTypes={creationOptions?.placeTypes || []}
          selectedPlaceTypeId={listingData.place_information.placeTypeId || 0}
          onUpdate={handlePlaceTypeUpdate}
          lang={lang}
        />
      );
    case STEPS.PLACE_INFORMATION_PICK_LOCATION:
      return (
        <PlaceInformationPickLocation
          location={listingData.place_information.location}
          onUpdate={handleLocationUpdate}
          lang={lang}
        />
      );
    case STEPS.PLACE_INFORMATION_CONFIRM_LOCATION: {
      return (
        <PlaceInformationConfirmLocation
          location={listingData.place_information.location}
          showSpecificLocation={
            listingData.place_information.showSpecificLocation ?? false
          }
          onLocationUpdate={handleLocationUpdate}
          onShowSpecificLocationToggle={handleShowSpecificLocationToggle}
          lang={lang}
        />
      );
    }
    case STEPS.PLACE_INFORMATION_CAPACITY:
      return (
        <PlaceInformationCapacity
          value={{
            guestNumber: listingData.place_information.guestNumber ?? 1,
            roomNumber: listingData.place_information.roomNumber ?? 0,
            bedNumber: listingData.place_information.bedNumber ?? 1,
            bathNumber: listingData.place_information.bathNumber ?? 0.5,
          }}
          onUpdate={handleCapacityUpdate}
          lang={lang}
        />
      );
    case STEPS.PLACE_FEATURES_COVER:
      return <PlaceFeaturesCover lang={lang} />;
    case STEPS.PLACE_FEATURES_AMENITY:
      return (
        <PlaceFeaturesAmenity
          loading={!creationOptions}
          amenities={creationOptions?.amenities || []}
          value={listingData.place_features.amenities || []}
          onUpdate={handleAmenitiesUpdate}
          lang={lang}
        />
      );
    case STEPS.PLACE_FEATURES_UPLOAD_PHOTOS:
      return (
        <PlaceFeaturesUploadPhotos
          onUploadWithProgress={onUploadWithProgress}
          lang={lang}
        />
      );
    case STEPS.PLACE_FEATURES_GALLERY:
      return (
        <PlaceFeaturesGallery
          photos={listingData.place_features.photos ?? []}
          onUpdatePhotos={handlePhotosUpdate}
          onDeletePhoto={onDeletePhoto}
          onReorderPhotos={onReorderPhotos}
          onUpdateCaption={onUpdateCaption}
          onUploadWithProgress={onUploadWithProgress}
          lang={lang}
        />
      );
    case STEPS.PLACE_FEATURES_TITLE:
      return (
        <PlaceFeaturesTitle
          value={listingData.place_features.title || ''}
          onUpdate={handleTitleUpdate}
          lang={lang}
        />
      );
    case STEPS.PLACE_FEATURES_DESCRIPTION:
      return (
        <PlaceFeaturesDescription
          value={listingData.place_features.description || ''}
          onUpdate={handleDescriptionUpdate}
          lang={lang}
        />
      );
    case STEPS.PLACE_SETUP_COVER:
      return <PlaceSetupCover lang={lang} />;
    case STEPS.PLACE_SETUP_PRICING:
      return (
        <PlaceSetupPricing
          value={listingData.place_setup.nightlyPrice || 0}
          onUpdate={handlePricingUpdate}
          lang={lang}
        />
      );
    case STEPS.PLACE_SETUP_DISCOUNT:
      return (
        <PlaceSetupDiscount
          value={
            listingData.place_setup.discount || {
              weeklyDiscount: 0,
              monthlyDiscount: 0,
            }
          }
          onUpdate={handleDiscountUpdate}
          lang={lang}
        />
      );
    default:
      return (
        <div className="py-10 text-center text-red-600">
          {translate(t, 'createListing.wizardStepContent.stepNotConfigured', {
            step: currentStep,
          })}
        </div>
      );
  }
}

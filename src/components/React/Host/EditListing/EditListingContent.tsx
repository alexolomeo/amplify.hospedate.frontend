import { useEffect } from 'react';
import { type SupportedLanguages } from '@/utils/i18n';
import type { Slug } from '../../Utils/edit-listing/slugs';
import NoContent from '@/components/React/Host/EditListing/Content/NoContent';
import EditTitle from './Content/YourPlace/EditTitle';
import EditCapacity from './Content/YourPlace/EditCapacity';
import EditPropertyType from './Content/YourPlace/EditPropertyType';
import EditDescription from './Content/YourPlace/EditDescription';
import EditAvailability from './Content/YourPlace/EditAvailability';
import EditPrice from './Content/YourPlace/EditPrice';
import EditBookingConfiguration from './Content/YourPlace/EditBookingConfiguration';
import EditHouseRules from './Content/YourPlace/EditHouseRules';
import EditGuestSafety from './Content/YourPlace/EditGuestSafety';
import EditCancellationPolicy from './Content/YourPlace/EditCancellationPolicy';
// import EditCustomLink from './Content/YourPlace/EditCustomLink';
import EditDirections from './Content/ArrivalGuide/EditDirections';
import EditCheckInMethod from './Content/ArrivalGuide/EditCheckInMethod';
// import DeleteSpace from './Content/Preferences/DeleteListing';
import EditAmenities from './Content/YourPlace/EditAmenities/EditAmenities';
import EditPhotoGallery from './Content/YourPlace/EditSpacePhotos/EditPhotoGallery';
import EditLocation from './Content/YourPlace/EditLocation';
import ListingStatusView from '../Listings/ListingStatusView';
import RequestedChanges from './Content/YourPlace/RequestedChanges';
import type { CatalogsSelectors } from '../../Hooks/Host/EditListing/useEditListing';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { ListingStatus } from '@/types/host/edit-listing/editListingValues';
import type { Status } from '../Listings/ListingStatusView';
import { useStore } from '@nanostores/react';
import { $userStore } from '@/stores/userStore';
import type { SectionController } from '../../Utils/edit-listing/section-controller';

interface Props {
  lang: SupportedLanguages;
  listingId: string;
  stepSlug: Slug;
  onNavigate: (
    slug: Slug,
    options?: { subpath?: string; replace?: boolean }
  ) => void;
  gallerySubpath?: string;
  selectors: CatalogsSelectors;
  values?: ListingEditorValues;
  onRegisterController: (ctrl: SectionController | null) => () => void;
  onRefresh?: () => Promise<void>;
}

export default function EditListingContent({
  lang,
  stepSlug,
  onNavigate,
  listingId,
  gallerySubpath,
  selectors,
  values,
  onRegisterController,
  onRefresh,
}: Props) {
  const user = useStore($userStore);
  const rawLoc = values?.yourPlace?.locationSection;

  const locationInitial = rawLoc
    ? {
        location: {
          address: rawLoc.locationData.address ?? '',
          apt: rawLoc.locationData.apartmentNumber ?? '',
          city: rawLoc.locationData.city ?? '',
          state: rawLoc.locationData.state ?? '',
          country: rawLoc.locationData.country?.value ?? 'Bolivia',
          coordinates: {
            latitude: rawLoc.locationData.coordinates?.latitude ?? 0,
            longitude: rawLoc.locationData.coordinates?.longitude ?? 0,
          },
        },
        showExact: Boolean(rawLoc.displaySpecificLocation),
        addressPrivacyOnCancel: Boolean(rawLoc.addressPrivacyForCancellation),
        canEditFields: rawLoc.allowLocationEdition !== false,
      }
    : undefined;

  useEffect(() => {
    const cleanup = onRegisterController(null);
    return cleanup;
  }, [stepSlug, onRegisterController]);

  if (stepSlug === 'overview') return <NoContent lang={lang} />;

  if (stepSlug === 'photo-gallery') {
    return (
      <div className="hide-scrollbar bg-base-100 flex flex-1 flex-col gap-8 overflow-y-auto pb-12">
        <EditPhotoGallery
          lang={lang}
          onNavigate={onNavigate}
          listingId={listingId}
          gallerySubpath={gallerySubpath}
          gallery={values?.yourPlace?.gallerySection}
          listingStatus={values?.setting?.statusSection?.status}
          totalPhotos={values?.yourPlace?.gallerySection?.numPhotos ?? 0}
          onRegisterController={onRegisterController}
          onRefresh={onRefresh}
        />
      </div>
    );
  }

  return (
    <div className="hide-scrollbar bg-base-100 flex flex-1 flex-col gap-8 overflow-y-auto pb-12">
      {(() => {
        switch (stepSlug) {
          case 'title':
            return (
              <EditTitle
                initialValues={values ?? null}
                onRegisterController={onRegisterController}
                lang={lang}
              />
            );
          case 'property-type':
            return (
              <EditPropertyType
                selectors={selectors}
                initialValues={values ?? null}
                onRegisterController={onRegisterController}
                lang={lang}
              />
            );
          case 'price':
            return (
              <EditPrice
                initialValues={values ?? null}
                onRegisterController={onRegisterController}
                lang={lang}
              />
            );
          case 'availability':
            return (
              <EditAvailability
                selectors={selectors}
                initialValues={values ?? null}
                onRegisterController={onRegisterController}
                lang={lang}
              />
            );
          case 'capacity':
            return (
              <EditCapacity
                initialValues={values ?? null}
                onRegisterController={onRegisterController}
                lang={lang}
              />
            );
          case 'description':
            return (
              <EditDescription
                initialValues={values ?? null}
                onRegisterController={onRegisterController}
                lang={lang}
              />
            );
          case 'amenities':
            return (
              <EditAmenities
                selectors={selectors}
                initialSelectedAmenityIds={
                  values?.yourPlace?.amenitiesSection?.amenities?.values ?? []
                }
                lang={lang}
              />
            );
          case 'booking':
            return (
              <EditBookingConfiguration
                initialValues={values ?? null}
                onRegisterController={onRegisterController}
                lang={lang}
              />
            );
          case 'house-rules':
            return (
              <EditHouseRules
                selectors={selectors}
                initialQuietEnabled={
                  values?.yourPlace?.houseRulesSection?.quietHours?.isEnabled ??
                  false
                }
                initialQuietStartId={
                  values?.yourPlace?.houseRulesSection?.quietHours?.startTime
                    ?.value
                }
                initialQuietEndId={
                  values?.yourPlace?.houseRulesSection?.quietHours?.endTime
                    ?.value
                }
                initialCheckinStartId={
                  values?.yourPlace?.houseRulesSection?.checkInOut
                    ?.checkInStartTime?.value
                }
                initialCheckinEndId={
                  values?.yourPlace?.houseRulesSection?.checkInOut
                    ?.checkInEndTime?.value
                }
                initialCheckoutId={
                  values?.yourPlace?.houseRulesSection?.checkInOut?.checkoutTime
                    ?.value
                }
                initialPermissions={{
                  petsAllowed:
                    values?.yourPlace?.houseRulesSection?.permissions
                      ?.petsAllowed ?? false,
                  numPets:
                    values?.yourPlace?.houseRulesSection?.permissions
                      ?.numPets ?? 0,
                  eventsAllowed:
                    values?.yourPlace?.houseRulesSection?.permissions
                      ?.eventsAllowed ?? false,
                  smokingAllowed:
                    values?.yourPlace?.houseRulesSection?.permissions
                      ?.smokingAllowed ?? false,
                  commercialPhotographyAllowed:
                    values?.yourPlace?.houseRulesSection?.permissions
                      ?.commercialPhotographyAllowed ?? false,
                  guestNumber:
                    values?.yourPlace?.houseRulesSection?.permissions
                      ?.guestNumber ?? 0,
                }}
                initialAdditionalRulesText={
                  values?.yourPlace?.houseRulesSection?.additionalRules?.text ??
                  ''
                }
                onRegisterController={onRegisterController}
                lang={lang}
              />
            );
          case 'guest-safety':
            return (
              <EditGuestSafety
                lang={lang}
                initialValues={values ?? null}
                onRegisterController={onRegisterController}
              />
            );
          case 'cancellation-policy':
            return (
              <EditCancellationPolicy
                initialValues={values ?? null}
                onRegisterController={onRegisterController}
                lang={lang}
              />
            );
          // case 'custom-link':
          //   return (
          //     <EditCustomLink
          //       initialTitle={
          //         values?.yourPlace?.customLinkSection?.customLink ?? ''
          //       }
          //       lang={lang}
          //     />
          //   );
          case 'directions':
            return (
              <EditDirections
                initialDirections={
                  values?.arrivalGuide?.indicationsSection?.indications ?? ''
                }
                lang={lang}
                onRegisterController={onRegisterController}
              />
            );
          case 'check-in-method':
            return (
              <EditCheckInMethod
                initialMethodId={
                  values?.arrivalGuide?.checkInMethodsSection?.checkInMethods
                    ?.checkInMethod?.value as
                    | 'SMART_LOCK'
                    | 'KEYPAD_LOCK'
                    | 'LOCK_BOX'
                    | 'BUILDING_STAFF'
                    | 'IN_PERSON'
                    | 'OTHER'
                    | undefined
                }
                initialInstructions={
                  values?.arrivalGuide?.checkInMethodsSection
                    ?.checkInInstructions?.instructions ?? ''
                }
                onRegisterController={onRegisterController}
                lang={lang}
              />
            );
          // case 'delete-listing':
          //   return <DeleteSpace lang={lang} showManTitle={true} />;
          case 'address': {
            return (
              <EditLocation
                lang={lang}
                onRegisterController={onRegisterController}
                initial={locationInitial}
              />
            );
          }
          case 'listing-state': {
            const statusMap: Record<ListingStatus, Status> = {
              APPROVED: 'APPROVED',
              CHANGES_REQUESTED: 'CHANGES_REQUESTED',
              IN_PROGRESS: 'IN_PROGRESS',
              PENDING_APPROVAL: 'PENDING_APPROVAL',
              PUBLISHED: 'PUBLISHED',
              UNLISTED: 'UNLISTED',
            };
            const raw = values?.setting?.statusSection?.status;
            const statusForView: Status = raw ? statusMap[raw] : 'UNLISTED';

            return (
              <ListingStatusView
                lang={lang}
                status={statusForView}
                accountVerified={true}
                onContinueEditing={() => console.log('Ir a editar')}
                onOpenRequestedChanges={() =>
                  onNavigate('request-changes' as Slug)
                }
                listingId={listingId}
                onRefresh={onRefresh}
                totalPhotos={values?.yourPlace?.gallerySection?.numPhotos ?? 0}
              />
            );
          }
          case 'request-changes': {
            return (
              <RequestedChanges
                lang={lang}
                description={
                  values?.yourPlace?.pendingTaskSection?.description ?? null
                }
                identityVerified={user?.identityVerified}
              />
            );
          }
          default:
            return <NoContent lang={lang} />;
        }
      })()}
    </div>
  );
}

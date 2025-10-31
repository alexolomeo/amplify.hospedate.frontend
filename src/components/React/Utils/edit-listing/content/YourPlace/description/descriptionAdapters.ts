import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { DescriptionForm } from './descriptionValidators';

const norm = (s: string): string | null => {
  const trimmed = (s ?? '').trim();
  return trimmed.length === 0 ? null : trimmed;
};

/** values → form */
export function toDescriptionForm(
  initialValues: ListingEditorValues | null
): DescriptionForm {
  const gen = initialValues?.yourPlace?.descriptionSection?.generalDescription;
  const guest = initialValues?.yourPlace?.descriptionSection?.guestExperience;

  return {
    listingDescription: String(gen?.listingDescription ?? ''),
    propertyDescription: String(gen?.propertyDescription ?? ''),
    areasDescription: String(guest?.areasDescription ?? ''),
    interactionDescription: String(guest?.interactionDescription ?? ''),
    additionalNotes: String(guest?.additionalNotes ?? ''),
  };
}

/** form → payload PATCH */
export function toDescriptionPayload(
  form: DescriptionForm
): UpdateListingEditorPayload {
  return {
    yourPlace: {
      descriptionSection: {
        generalDescription: {
          listingDescription: norm(form.listingDescription),
          propertyDescription: norm(form.propertyDescription),
        },
        guestExperience: {
          areasDescription: norm(form.areasDescription),
          interactionDescription: norm(form.interactionDescription),
          additionalNotes: norm(form.additionalNotes),
        },
      },
    },
  };
}

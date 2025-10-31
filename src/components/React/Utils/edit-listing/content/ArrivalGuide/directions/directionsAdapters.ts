import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';
import type { DirectionsForm } from './directionsValidators';

export function toDirectionsForm(
  initial: string | undefined | null
): DirectionsForm {
  return { text: initial ?? '' };
}

export function toDirectionsPatch(
  form: DirectionsForm
): UpdateListingEditorPayload {
  const trimmed = form.text.trim();
  return {
    arrivalGuide: {
      indicationsSection: {
        indications: trimmed === '' ? null : trimmed,
      },
    },
  };
}

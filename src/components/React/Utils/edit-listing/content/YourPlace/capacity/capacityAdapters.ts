import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { CapacityForm } from './capacityValidators';

const clamp = (n: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, Math.floor(n)));

/** values → form */
export function toCapacityForm(
  initialValues: ListingEditorValues | null,
  rules: { min: number; max: number }
): CapacityForm {
  const raw =
    initialValues?.yourPlace?.peopleNumberSection?.peopleNumber ?? rules.min;
  return { people: clamp(raw, rules.min, rules.max) };
}

/** form → payload PATCH */
export function toCapacityPayload(
  form: CapacityForm
): UpdateListingEditorPayload {
  return {
    yourPlace: {
      peopleNumberSection: {
        peopleNumber: form.people,
      },
    },
  };
}

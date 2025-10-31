import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';
import type { CheckInMethodValue } from '@/types/host/edit-listing/editListingValues';
import type { CheckInMethodForm } from './checkInMethodValidators';

export type ToFormParams = {
  initialMethodId?: CheckInMethodValue | null;
  initialInstructions?: string | null;
};

export function toCheckInMethodForm(p: ToFormParams): CheckInMethodForm {
  return {
    selectedMethodId: p.initialMethodId ?? null,
    instructions: (p.initialInstructions ?? '').toString(),
  };
}

export function toCheckInMethodPayload(
  form: CheckInMethodForm
): UpdateListingEditorPayload {
  if (!form.selectedMethodId) {
    throw new Error(
      'Cannot build check-in method payload: method is required.'
    );
  }

  const trimmed = form.instructions.trim();
  const instructions = trimmed === '' ? null : trimmed;

  return {
    arrivalGuide: {
      checkInMethodsSection: {
        checkInMethods: {
          checkInMethod: { value: form.selectedMethodId },
        },
        checkInInstructions: {
          instructions,
        },
      },
    },
  };
}

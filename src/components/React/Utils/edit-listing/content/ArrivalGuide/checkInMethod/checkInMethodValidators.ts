import type { ValidationResult } from '@/components/React/Utils/edit-listing/section-controller';
import type { CheckInMethodValue } from '@/types/host/edit-listing/editListingValues';

export const INSTRUCTIONS_MAX = 2000;

export type CheckInMethodForm = {
  selectedMethodId: CheckInMethodValue | null;
  instructions: string; // se normaliza a null en el payload si queda en ''
};

export type CheckInMethodFieldErrors = Partial<{
  'checkInMethods.checkInMethod': string;
  'checkInInstructions.instructions': string;
}>;

export type CheckInMethodValidationMessages = {
  methodRequired: string;
  instructionsMax: string;
};

export function validateCheckInMethodForm(
  form: CheckInMethodForm,
  m: CheckInMethodValidationMessages
): ValidationResult {
  const errors: CheckInMethodFieldErrors = {};

  if (!form.selectedMethodId) {
    errors['checkInMethods.checkInMethod'] = m.methodRequired;
  }

  const len = form.instructions.trim().length;
  if (len > INSTRUCTIONS_MAX) {
    errors['checkInInstructions.instructions'] = m.instructionsMax;
  }

  return Object.keys(errors).length === 0
    ? { ok: true }
    : { ok: false, errors };
}

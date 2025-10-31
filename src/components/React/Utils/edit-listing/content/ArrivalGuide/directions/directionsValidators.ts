import type { ValidationResult } from '@/components/React/Utils/edit-listing/section-controller';

export const DIRECTIONS_MAX_CHARS = 2000;

export type DirectionsForm = {
  text: string;
};

export type DirectionsFieldErrors = Partial<{
  'directions.text': string;
}>;

export type DirectionsValidationMessages = {
  max: string;
};

export function validateDirectionsForm(
  form: DirectionsForm,
  m: DirectionsValidationMessages
): ValidationResult {
  const errors: DirectionsFieldErrors = {};

  if (form.text.trim().length > DIRECTIONS_MAX_CHARS) {
    errors['directions.text'] = m.max;
  }

  return Object.keys(errors).length === 0
    ? { ok: true }
    : { ok: false, errors };
}

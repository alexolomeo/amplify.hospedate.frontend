import type { ValidationResult } from '@/components/React/Utils/edit-listing/section-controller';

export const CAPTION_MAX_CHARS = 255;

export type PhotoCaptionForm = { text: string };

export type PhotoCaptionFieldErrors = Partial<{
  'photo.caption': string;
}>;

export type PhotoCaptionValidationMessages = {
  required: string;
  max: string;
};

export function validatePhotoCaptionForm(
  form: PhotoCaptionForm,
  m: PhotoCaptionValidationMessages
): ValidationResult {
  const errors: PhotoCaptionFieldErrors = {};
  const trimmed = form.text.trim();

  if (trimmed.length === 0) {
    errors['photo.caption'] = m.required;
  } else if (trimmed.length > CAPTION_MAX_CHARS) {
    errors['photo.caption'] = m.max;
  }

  return Object.keys(errors).length === 0
    ? { ok: true }
    : { ok: false, errors };
}

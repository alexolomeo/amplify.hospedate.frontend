export type TitleForm = {
  title: string;
};

export type FieldErrors = Record<string, string>;

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: FieldErrors };

export type TitleValidationMessages = {
  required: string;
  maxLength: string;
};

export function validateTitleForm(
  form: TitleForm,
  messages: TitleValidationMessages
): ValidationResult {
  const errors: FieldErrors = {};
  const trimmed = form.title.trim();

  if (trimmed.length === 0) {
    errors.title = messages.required;
  } else if (trimmed.length > 50) {
    errors.title = messages.maxLength;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return { ok: true };
}

/** Normaliza para enviar al payload */
export function normalizeTitleForPatch(raw: string): string {
  return raw.trim();
}

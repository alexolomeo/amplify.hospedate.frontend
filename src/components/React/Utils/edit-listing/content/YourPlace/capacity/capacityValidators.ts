export type CapacityForm = {
  people: number;
};

export type CapacityFieldErrors = Partial<{
  people: string;
}>;

export type CapacityValidationResult =
  | { ok: true }
  | { ok: false; errors: CapacityFieldErrors };

export type CapacityValidationMessages = {
  required: string;
  min: string;
  max: string;
};

export type CapacityRules = {
  min: number;
  max: number;
};

export function validateCapacityForm(
  form: CapacityForm,
  m: CapacityValidationMessages,
  rules: CapacityRules
): CapacityValidationResult {
  const errors: CapacityFieldErrors = {};
  const { min, max } = rules;

  if (!Number.isFinite(form.people)) {
    errors.people = m.required;
  } else {
    const v = Math.floor(form.people);
    if (v < min) errors.people = m.min;
    else if (v > max) errors.people = m.max;
  }

  return Object.keys(errors).length === 0
    ? { ok: true }
    : { ok: false, errors };
}

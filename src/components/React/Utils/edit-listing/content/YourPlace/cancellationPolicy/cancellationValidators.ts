import {
  isValidStandard,
  isValidLongStay,
  type StandardPolicyId,
  type LongStayPolicyId,
} from '@/components/React/Utils/edit-listing/cancellationPolicy';

export type CancellationForm = {
  standardId: StandardPolicyId;
  longStayId: LongStayPolicyId;
};

export type FieldErrors = Partial<{
  standardId: string;
  longStayId: string;
}>;

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: FieldErrors };

export type CancellationValidationMessages = {
  standardRequired: string;
  longStayRequired: string;
};

export function validateCancellationForm(
  form: CancellationForm,
  m: CancellationValidationMessages
): ValidationResult {
  const errors: FieldErrors = {};

  if (!isValidStandard(form.standardId)) {
    errors.standardId = m.standardRequired;
  }
  if (!isValidLongStay(form.longStayId)) {
    errors.longStayId = m.longStayRequired;
  }

  return Object.keys(errors).length === 0
    ? { ok: true }
    : { ok: false, errors };
}

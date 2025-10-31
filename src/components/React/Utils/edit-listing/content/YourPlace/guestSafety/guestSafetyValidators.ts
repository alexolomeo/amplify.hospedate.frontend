import type { YesNoWithDetailsPayload } from '@/types/host/edit-listing/updateListingEditorPayload';

export const SC_KEYS = [
  'noChildrenAllowed',
  'noInfantsAllowed',
  'poolOrJacuzziWithNoFence',
  'lakeOrRiverOrWaterBody',
  'climbingOrPlayStructure',
  'heightsWithNoFence',
  'animals',
] as const;
export type SCKey = (typeof SC_KEYS)[number];

export const SD_KEYS = [
  'surveillance',
  'noiseMonitor',
  'carbonMonoxideDetector',
  'smokeDetector',
] as const;
export type SDKey = (typeof SD_KEYS)[number];

export const PI_KEYS = [
  'requiresStairs',
  'potentialNoise',
  'hasPets',
  'limitedParking',
  'sharedSpaces',
  'limitedAmenities',
  'weapons',
] as const;
export type PIKey = (typeof PI_KEYS)[number];

export type DetailKey = `sc.${SCKey}` | `sd.${SDKey}` | `pi.${PIKey}`;

export const MODAL_MAX_CHARS = 300;

export type GuestSafetyForm = {
  sc: Record<SCKey, boolean>;
  sd: Record<SDKey, boolean>;
  pi: Record<PIKey, boolean>;
  details: Partial<Record<DetailKey, string>>;
};

export type FieldErrors = Record<string, string>;

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: FieldErrors };

export type GuestSafetyValidationMessages = {
  detailsMax: string;
  requiredField?: string;
};

export function validateGuestSafetyForm(
  form: GuestSafetyForm,
  m: GuestSafetyValidationMessages
): ValidationResult {
  const errors: FieldErrors = {};

  for (const [k, v] of Object.entries(form.details)) {
    const key = k as DetailKey;
    const txt = (v ?? '').trim();
    if (txt.length > MODAL_MAX_CHARS) {
      errors[key] = m.detailsMax;
    }
  }

  return Object.keys(errors).length === 0
    ? { ok: true }
    : { ok: false, errors };
}

export function toYesNo(
  status: boolean,
  details?: string | null
): YesNoWithDetailsPayload {
  const trimmed = (details ?? '').trim();
  return { status, details: status ? (trimmed.length ? trimmed : null) : null };
}

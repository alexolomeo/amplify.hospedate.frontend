import type { ValidationResult } from '@/components/React/Utils/edit-listing/section-controller';
// -1 is used as a special value to indicate a "flexible" or "not set" identifier.
export const FLEXIBLE_ID = -1 as const;
export const PETS_MIN = 1;
export const PETS_MAX = 5;
export const GUEST_MIN = 1;
export const GUEST_MAX = 16;
export const ADDITIONAL_MAX = 1000;

export type HouseRulesForm = {
  permissions: {
    petsAllowed: boolean;
    numPets: number;
    eventsAllowed: boolean;
    smokingAllowed: boolean;
    commercialPhotographyAllowed: boolean;
    guestNumber: number;
  };
  quietHours: {
    isEnabled: boolean;
    startId: number | null;
    endId: number | null;
  };
  checkInOut: {
    checkInStartId: number | null;
    checkInEndId: number | null;
    checkoutId: number | null;
  };
  additionalRulesText: string;
};

export type FieldErrors = Record<string, string>;

export type HouseRulesValidationMessages = {
  numPetsMin: string;
  numPetsMax: string;
  guestMin: string;
  guestMax: string;
  quietStartRequired: string;
  quietEndRequired: string;
  checkinStartRequired: string;
  checkinEndBeforeStart: string;
  checkoutRequired: string;
  additionalMax: string;
  checkinEndRequired: string;
};

export function validateHouseRulesForm(
  form: HouseRulesForm,
  m: HouseRulesValidationMessages
): ValidationResult {
  const errors: FieldErrors = {};

  // permissions.numPets
  if (form.permissions.petsAllowed) {
    if (form.permissions.numPets < PETS_MIN) {
      errors['permissions.numPets'] = m.numPetsMin;
    } else if (form.permissions.numPets > PETS_MAX) {
      errors['permissions.numPets'] = m.numPetsMax;
    }
  }

  // permissions.guestNumber
  if (form.permissions.guestNumber < GUEST_MIN) {
    errors['permissions.guestNumber'] = m.guestMin;
  } else if (form.permissions.guestNumber > GUEST_MAX) {
    errors['permissions.guestNumber'] = m.guestMax;
  }

  // quietHours
  if (form.quietHours.isEnabled) {
    if (form.quietHours.startId == null) {
      errors['quietHours.startId'] = m.quietStartRequired;
    }
    if (form.quietHours.endId == null) {
      errors['quietHours.endId'] = m.quietEndRequired;
    }
  }

  // checkInOut
  if (form.checkInOut.checkInStartId == null) {
    errors['checkInOut.checkInStartId'] = m.checkinStartRequired;
  } else {
    const s = form.checkInOut.checkInStartId;
    const e = form.checkInOut.checkInEndId;

    if (s !== FLEXIBLE_ID) {
      if (e == null) {
        errors['checkInOut.checkInEndId'] = m.checkinEndRequired;
      } else if (e !== FLEXIBLE_ID && e < s) {
        errors['checkInOut.checkInEndId'] = m.checkinEndBeforeStart;
      }
    }
  }

  if (form.checkInOut.checkoutId == null) {
    errors['checkInOut.checkoutId'] = m.checkoutRequired;
  }

  // additionalRulesText
  if (form.additionalRulesText.trim().length > ADDITIONAL_MAX) {
    errors['additionalRules.text'] = m.additionalMax;
  }

  return Object.keys(errors).length === 0
    ? { ok: true }
    : { ok: false, errors };
}

import type { BookingTypeValue } from '@/types/host/edit-listing/editListingValues';

export type BookingTypeId = BookingTypeValue;
export const ALLOWED_BOOKING_TYPES = new Set<BookingTypeId>([
  'INSTANT',
  'APPROVAL_REQUIRED',
]);

export const WELCOME_MAX_CHARS = 400;

export type BookingForm = {
  selectedTypeId: BookingTypeId | null;
  messagesByType: Record<BookingTypeId, string>;
};

export type FieldErrors = Record<string, string>;

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: FieldErrors };

export type BookingValidationMessages = {
  typeRequired: string;
  welcomeMax: string;
};

export function validateBookingForm(
  form: BookingForm,
  m: BookingValidationMessages
): ValidationResult {
  const errors: FieldErrors = {};
  const type = form.selectedTypeId;

  if (!type || !ALLOWED_BOOKING_TYPES.has(type)) {
    errors.selectedTypeId = m.typeRequired;
  }

  if (type && ALLOWED_BOOKING_TYPES.has(type)) {
    const msg = (form.messagesByType[type] ?? '').trim();
    if (msg.length > WELCOME_MAX_CHARS) {
      errors.welcomeMessage = m.welcomeMax;
    }
  }

  return Object.keys(errors).length === 0
    ? { ok: true }
    : { ok: false, errors };
}

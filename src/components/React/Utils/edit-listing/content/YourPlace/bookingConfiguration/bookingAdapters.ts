import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import {
  ALLOWED_BOOKING_TYPES,
  WELCOME_MAX_CHARS,
  type BookingForm,
  type BookingTypeId,
} from './bookingValidators';

export function toBookingForm(
  initial: ListingEditorValues | null
): BookingForm {
  const rawType =
    initial?.yourPlace?.bookingSettingsSection?.bookingType?.value ?? null;
  const selectedTypeId: BookingTypeId | null =
    rawType && ALLOWED_BOOKING_TYPES.has(rawType as BookingTypeId)
      ? (rawType as BookingTypeId)
      : null;

  const initialWelcome =
    initial?.yourPlace?.bookingSettingsSection?.welcomeMessage ?? '';

  const messagesByType: Record<BookingTypeId, string> = {
    INSTANT: '',
    APPROVAL_REQUIRED: '',
  };

  if (selectedTypeId) {
    messagesByType[selectedTypeId] = String(initialWelcome ?? '');
  }

  return { selectedTypeId, messagesByType };
}

function normalizeWelcomeForPatch(s: string): string | null {
  const trimmed = (s ?? '').trim();
  if (trimmed.length === 0) return null;
  return trimmed.length > WELCOME_MAX_CHARS
    ? trimmed.slice(0, WELCOME_MAX_CHARS)
    : trimmed;
}

export function toBookingPayload(
  form: BookingForm
): UpdateListingEditorPayload {
  if (!form.selectedTypeId || !ALLOWED_BOOKING_TYPES.has(form.selectedTypeId)) {
    throw new Error('Cannot build booking payload: invalid booking type.');
  }
  const type = form.selectedTypeId as BookingTypeId;
  const welcome = normalizeWelcomeForPatch(form.messagesByType[type] ?? '');

  return {
    yourPlace: {
      bookingSettingsSection: {
        bookingType: { value: type },
        welcomeMessage: welcome,
      },
    },
  };
}

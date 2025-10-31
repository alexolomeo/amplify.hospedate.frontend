import type { ValidationResult } from '@/components/React/Utils/edit-listing/section-controller';

export type Coordinates = { latitude: number; longitude: number };

export type LocationForm = {
  address: string;
  apt: string;
  city: string;
  state: string;
  country: string;
  coordinates: Coordinates;
  showExact: boolean;
  addressPrivacyOnCancel: boolean;
};

export type LocationFieldErrors = Partial<{
  'locationData.address': string;
  'locationData.city': string;
  'locationData.state': string;
  'locationData.country': string;
  'locationData.coordinates': string;
  displaySpecificLocation: string;
  addressPrivacyForCancellation: string;
}>;

export type LocationValidationMessages = {
  required: string;
  coordsRequired: string;
  showExactRequired: string;
  privacyRequired: string;
};

export function isValidCoordinates(coords: Coordinates): boolean {
  const { latitude, longitude } = coords;
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude) &&
    !(latitude === 0 && longitude === 0)
  );
}

export function validateLocationForm(
  form: LocationForm,
  m: LocationValidationMessages
): ValidationResult {
  const errors: LocationFieldErrors = {};

  const hasText = (s: string) => s.trim().length > 0;

  if (!hasText(form.address)) errors['locationData.address'] = m.required;
  if (!hasText(form.city)) errors['locationData.city'] = m.required;
  if (!hasText(form.state)) errors['locationData.state'] = m.required;
  if (!hasText(form.country)) errors['locationData.country'] = m.required;

  if (!isValidCoordinates(form.coordinates)) {
    errors['locationData.coordinates'] = m.coordsRequired;
  }

  if (form.showExact == null) {
    errors['displaySpecificLocation'] = m.showExactRequired;
  }

  if (form.addressPrivacyOnCancel == null) {
    errors['addressPrivacyForCancellation'] = m.privacyRequired;
  }

  return Object.keys(errors).length === 0
    ? { ok: true }
    : { ok: false, errors };
}

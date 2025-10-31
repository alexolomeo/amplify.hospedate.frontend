import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';
import type { LocationForm } from './locationValidators';
import { formatCoordsForBackend } from '@/components/React/Utils/location';

export function toLocationForm(initial: {
  location?: {
    address: string;
    apt: string;
    city: string;
    state: string;
    country: string;
    coordinates: { latitude: number; longitude: number };
  };
  showExact?: boolean;
  addressPrivacyOnCancel?: boolean;
}): LocationForm {
  const loc = initial.location ?? {
    address: '',
    apt: '',
    city: '',
    state: '',
    country: 'Bolivia',
    coordinates: { latitude: 0, longitude: 0 },
  };
  return {
    address: loc.address ?? '',
    apt: loc.apt ?? '',
    city: loc.city ?? '',
    state: loc.state ?? '',
    country: loc.country ?? 'Bolivia',
    coordinates: {
      latitude: loc.coordinates?.latitude ?? 0,
      longitude: loc.coordinates?.longitude ?? 0,
    },
    showExact: Boolean(initial.showExact),
    addressPrivacyOnCancel: Boolean(initial.addressPrivacyOnCancel),
  };
}

export function toLocationPayload(
  form: LocationForm
): UpdateListingEditorPayload {
  const apt = form.apt.trim();
  const address = form.address.trim();
  const city = form.city.trim();
  const state = form.state.trim();
  const countryValue = (form.country || 'Bolivia').trim();

  const formattedCoords = formatCoordsForBackend(form.coordinates);

  return {
    yourPlace: {
      locationSection: {
        displaySpecificLocation: form.showExact,
        addressPrivacyForCancellation: form.addressPrivacyOnCancel,
        locationData: {
          country: { value: countryValue || null },
          address: address || null,
          apartmentNumber: apt === '' ? null : apt,
          city: city || null,
          state: state || null,
          coordinates:
            typeof formattedCoords?.latitude === 'number' &&
            typeof formattedCoords?.longitude === 'number'
              ? {
                  latitude: formattedCoords.latitude,
                  longitude: formattedCoords.longitude,
                }
              : undefined,
        },
      },
    },
  };
}

import type {
  CreateListingData,
  UpdateListingStepData,
  PlaceLocation,
} from '@/types/createListing';
import { formatCoordsForBackend } from '@/components/React/Utils/location';

export function extractPayloadFromData(
  data: CreateListingData
): UpdateListingStepData {
  const rawLoc = data.place_information.location;

  let sanitizedLocation: PlaceLocation | undefined;

  if (
    rawLoc &&
    rawLoc.coordinates &&
    typeof rawLoc.coordinates.latitude === 'number' &&
    typeof rawLoc.coordinates.longitude === 'number'
  ) {
    const coords = formatCoordsForBackend(rawLoc.coordinates);

    sanitizedLocation = {
      address: rawLoc.address?.trim(),
      city: rawLoc.city?.trim(),
      state: rawLoc.state?.trim(),
      country: rawLoc.country?.trim(),
      ...(rawLoc.apt && rawLoc.apt.trim() ? { apt: rawLoc.apt.trim() } : {}),
      coordinates: coords,
    };
  } else {
    sanitizedLocation = undefined;
  }

  return {
    placeTypeId: data.place_information.placeTypeId,
    guestNumber: data.place_information.guestNumber,
    roomNumber: data.place_information.roomNumber,
    bedNumber: data.place_information.bedNumber,
    bathNumber: data.place_information.bathNumber,
    location: sanitizedLocation,
    showSpecificLocation: data.place_information.showSpecificLocation ?? false,
    title: data.place_features.title?.trim(),
    description: data.place_features.description?.trim(),
    amenities: data.place_features.amenities?.map((a) => a.id),
    nightlyPrice: data.place_setup.nightlyPrice,
    discount: data.place_setup.discount,
  };
}

import { useCallback } from 'react';
import type { Coordinates, PlaceLocation } from '@/types/createListing';

export function usePlaceFromPrediction() {
  const getPlaceLocation = useCallback(
    async (
      prediction: google.maps.places.PlacePrediction
    ): Promise<PlaceLocation> => {
      const place = prediction.toPlace();
      await place.fetchFields({
        fields: ['displayName', 'location', 'addressComponents'],
      });

      const comps =
        (place.addressComponents as google.maps.places.AddressComponent[]) ??
        [];
      const city =
        comps.find((c) => c.types.includes('locality'))?.longText ?? '';
      const state =
        comps.find((c) => c.types.includes('administrative_area_level_1'))
          ?.longText ?? '';
      const country =
        comps.find((c) => c.types.includes('country'))?.longText ?? '';

      const loc = place.location;
      if (!loc) {
        throw new Error('Place sin coordenadas');
      }

      const coords: Coordinates = {
        latitude: loc.lat(),
        longitude: loc.lng(),
      };

      return {
        address: place.displayName!,
        city,
        state,
        country,
        coordinates: coords,
      };
    },
    []
  );

  return getPlaceLocation;
}

import { useEffect, useRef } from 'react';
import useLoadGoogleMaps from './useLoadGoogleMaps';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodeResult {
  coords: Coordinates;
  components: google.maps.GeocoderAddressComponent[];
}

export function useGeocoder() {
  const isLoaded = useLoadGoogleMaps();
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (isLoaded && window.google?.maps?.Geocoder && !geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, [isLoaded]);

  const geocodeFullAddress = async (
    address: string
  ): Promise<GeocodeResult> => {
    if (!geocoderRef.current) {
      throw new Error('Geocoder not initialized');
    }
    return new Promise<GeocodeResult>((resolve, reject) => {
      geocoderRef.current!.geocode(
        {
          address,
          componentRestrictions: { country: 'BO' },
        },
        (results, status) => {
          if (
            status === window.google.maps.GeocoderStatus.OK &&
            results &&
            results[0]?.geometry.location
          ) {
            const loc = results[0].geometry.location;
            resolve({
              coords: {
                latitude: loc.lat(),
                longitude: loc.lng(),
              },
              components: results[0].address_components ?? [],
            });
          } else {
            reject(new Error(`Geocode failed: ${status}`));
          }
        }
      );
    });
  };

  const geocodeByCoords = async (
    coords: Coordinates
  ): Promise<GeocodeResult> => {
    if (!geocoderRef.current) {
      throw new Error('Geocoder not initialized');
    }

    const location = new window.google.maps.LatLng(
      coords.latitude,
      coords.longitude
    );

    return new Promise<GeocodeResult>((resolve, reject) => {
      geocoderRef.current!.geocode({ location }, (results, status) => {
        if (
          status === window.google.maps.GeocoderStatus.OK &&
          results &&
          results[0]?.geometry.location
        ) {
          const loc = results[0].geometry.location;
          resolve({
            coords: {
              latitude: loc.lat(),
              longitude: loc.lng(),
            },
            components: results[0].address_components ?? [],
          });
        } else {
          reject(new Error(`Reverse geocode failed: ${status}`));
        }
      });
    });
  };

  return { isLoaded, geocodeFullAddress, geocodeByCoords };
}

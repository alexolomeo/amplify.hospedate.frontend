import type { Coordinates } from '@/types/createListing';
const COORD_DECIMALS = 6;
const BOLIVIA_BBOX = {
  minLat: -22.95,
  maxLat: -9.68,
  minLng: -69.65,
  maxLng: -57.45,
};
export async function tryGetUserLocation(): Promise<Coordinates> {
  if (!navigator.geolocation) {
    return Promise.reject(new Error('Geolocation not supported'));
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      (err: GeolocationPositionError) => {
        reject(err);
      },
      { timeout: 10000 }
    );
  });
}
export const formatCoordsForBackend = (coords: Coordinates): Coordinates => {
  if (!coords || coords.latitude == null || coords.longitude == null) {
    return coords;
  }
  const formattedLatitude = parseFloat(coords.latitude.toFixed(COORD_DECIMALS));
  const formattedLongitude = parseFloat(
    coords.longitude.toFixed(COORD_DECIMALS)
  );
  return {
    latitude: formattedLatitude,
    longitude: formattedLongitude,
  };
};
export function isInsideBoliviaBBox({
  latitude,
  longitude,
}: Coordinates): boolean {
  return (
    latitude >= BOLIVIA_BBOX.minLat &&
    latitude <= BOLIVIA_BBOX.maxLat &&
    longitude >= BOLIVIA_BBOX.minLng &&
    longitude <= BOLIVIA_BBOX.maxLng
  );
}

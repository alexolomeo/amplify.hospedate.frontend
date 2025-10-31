import type { Bounds } from '@/types/search';

export function convertBoundsToLiteral(
  bounds: google.maps.LatLngBounds
): Bounds {
  const ne = bounds.getNorthEast();
  const sw = bounds.getSouthWest();
  return {
    northEastLat: ne.lat(),
    northEastLng: ne.lng(),
    southWestLat: sw.lat(),
    southWestLng: sw.lng(),
  };
}

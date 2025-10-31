import { useCallback, useState, useEffect } from 'react';
export interface DistanceResult {
  distance: number;
  isValid: boolean;
}

export function useDistanceBetweenCoords(maxMeters: number) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.google?.maps?.geometry?.spherical) {
      setReady(true);
    } else {
      console.error('Google Maps geometry library not available');
    }
  }, []);

  const compute = useCallback(
    (
      from: { latitude: number; longitude: number },
      to: { latitude: number; longitude: number }
    ): DistanceResult => {
      if (!ready) return { distance: Infinity, isValid: false };
      const { LatLng, geometry } = window.google.maps;
      const d = geometry.spherical.computeDistanceBetween(
        new LatLng(from.latitude, from.longitude),
        new LatLng(to.latitude, to.longitude)
      );
      return { distance: d, isValid: d <= maxMeters };
    },
    [ready, maxMeters]
  );

  return compute;
}

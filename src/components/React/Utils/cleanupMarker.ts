import type { Root } from 'react-dom/client';

export function cleanupMarker(
  id: string,
  markerRefs: Record<string, google.maps.marker.AdvancedMarkerElement>,
  markerRoots: Record<string, Root>
) {
  const marker = markerRefs[id];
  const root = markerRoots[id];

  if (marker) {
    marker.map = null;
    google.maps.event.clearInstanceListeners(marker);
  }

  if (root) {
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(() => root.unmount());
    } else {
      setTimeout(() => root.unmount(), 0);
    }
  }

  delete markerRefs[id];
  delete markerRoots[id];
}

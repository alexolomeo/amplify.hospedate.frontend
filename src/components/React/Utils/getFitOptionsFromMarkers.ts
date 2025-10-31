import type { Listing } from '@/types/listing/listing';
export function getFitOptionsFromMarkers(markers: Listing[]) {
  if (markers.length === 1) {
    return {
      center: {
        lat: markers[0].location.coordinates.latitude,
        lng: markers[0].location.coordinates.longitude,
      },
      zoom: 14,
    };
  }

  const bounds = new window.google.maps.LatLngBounds();
  markers.forEach((m) => {
    bounds.extend(
      new window.google.maps.LatLng(
        m.location.coordinates.latitude,
        m.location.coordinates.longitude
      )
    );
  });

  return { bounds };
}

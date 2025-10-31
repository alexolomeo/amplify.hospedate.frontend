export function latLngToMapPixel(
  map: google.maps.Map,
  latLng: google.maps.LatLng
): { x: number; y: number } | null {
  const projection = map.getProjection();
  const bounds = map.getBounds();

  if (!projection || !bounds) return null;

  const scale = Math.pow(2, map.getZoom()!);

  const nw = projection.fromLatLngToPoint(
    new google.maps.LatLng(
      bounds.getNorthEast().lat(),
      bounds.getSouthWest().lng()
    )
  );

  const worldPoint = projection.fromLatLngToPoint(latLng);

  if (!nw || !worldPoint) return null;

  return {
    x: (worldPoint.x - nw.x) * scale,
    y: (worldPoint.y - nw.y) * scale,
  };
}

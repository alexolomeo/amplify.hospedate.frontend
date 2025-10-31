import type { OverlayInfo } from '@/types/listing/display-map/overlayinfo';
import { getBestAnchorPosition } from '@/components/React/Helper/getBestAnchorPosition';
import { latLngToMapPixel } from '@/components/React/Helper/mapUtils';

export function getOverlayInfoFromLatLng(
  map: google.maps.Map,
  latLng: google.maps.LatLng,
  overlaySize = { width: 258, height: 250 }
): OverlayInfo | null {
  const projection = map.getProjection();
  const bounds = map.getBounds();
  if (!projection || !bounds) {
    console.warn(
      '[getOverlayInfoFromLatLng] Projection or bounds not available.'
    );
    return null;
  }

  const markerPixel = latLngToMapPixel(map, latLng);
  if (!markerPixel) return null;

  const mapWidth = map.getDiv().offsetWidth;
  const mapHeight = map.getDiv().offsetHeight;

  const isOutOfBounds =
    markerPixel.x < 0 ||
    markerPixel.x > mapWidth ||
    markerPixel.y < 0 ||
    markerPixel.y > mapHeight;

  if (isOutOfBounds) {
    console.warn(
      '[getOverlayInfoFromLatLng] Marker is out of visible map bounds.'
    );
    return null;
  }

  const direction = getBestAnchorPosition(
    markerPixel,
    mapWidth,
    mapHeight,
    overlaySize
  );
  return {
    position: latLng,
    direction,
    markerPixel,
    mapWidth,
    mapHeight,
  };
}

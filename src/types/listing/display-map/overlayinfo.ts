export interface OverlayInfo {
  position: google.maps.LatLng;
  direction: string;
  markerPixel: {
    x: number;
    y: number;
  };
  mapWidth: number;
  mapHeight: number;
}

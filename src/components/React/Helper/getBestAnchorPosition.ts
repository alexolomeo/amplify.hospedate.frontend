export type AnchorPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

interface MarkerPixel {
  x: number;
  y: number;
}

interface OverlaySize {
  width: number;
  height: number;
}

export function getBestAnchorPosition(
  marker: MarkerPixel,
  mapWidth: number,
  mapHeight: number,
  overlay: OverlaySize
): AnchorPosition {
  const space = {
    top: marker.y,
    bottom: mapHeight - marker.y,
    left: marker.x,
    right: mapWidth - marker.x,
  };

  const isValid = (pos: AnchorPosition): boolean => {
    switch (pos) {
      case 'top-left':
        return space.top >= overlay.height && space.left >= overlay.width;
      case 'top-center':
        return (
          space.top >= overlay.height &&
          space.left >= overlay.width / 2 &&
          space.right >= overlay.width / 2
        );
      case 'top-right':
        return space.top >= overlay.height && space.right >= overlay.width;
      case 'bottom-left':
        return space.bottom >= overlay.height && space.left >= overlay.width;
      case 'bottom-center':
        return (
          space.bottom >= overlay.height &&
          space.left >= overlay.width / 2 &&
          space.right >= overlay.width / 2
        );
      case 'bottom-right':
        return space.bottom >= overlay.height && space.right >= overlay.width;
    }
  };

  const candidates: AnchorPosition[] =
    space.bottom < overlay.height
      ? [
          'top-center',
          'top-left',
          'top-right',
          'bottom-center',
          'bottom-left',
          'bottom-right',
        ]
      : [
          'bottom-center',
          'bottom-left',
          'bottom-right',
          'top-center',
          'top-left',
          'top-right',
        ];

  for (const pos of candidates) {
    if (isValid(pos)) return pos;
  }

  return 'top-center';
}

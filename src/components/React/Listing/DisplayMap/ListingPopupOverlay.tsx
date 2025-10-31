import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import type { OverlayInfo } from '@/types/listing/display-map/overlayinfo';
import type { SearchListingMarker } from '@/types/listing/display-map/searchListingMarker';
import ListingPopup from '@/components/React/Listing/DisplayMap/ListingPopup';
import { type SupportedLanguages } from '@/utils/i18n';
import { useStore } from '@nanostores/react';
import { $params } from '@/stores/searchStore';

interface Props {
  map: google.maps.Map;
  overlayInfo: OverlayInfo;
  data: SearchListingMarker;
  onClose: () => void;
  lang?: SupportedLanguages;
}

const OVERLAY_SIZE = { width: 258, height: 250 };
const TOP_ANCHOR_OFFSET_Y = 35;
const BOTTOM_ANCHOR_OFFSET_Y = 7;

export default function ListingPopupOverlay({
  map,
  overlayInfo,
  data,
  onClose,
  lang = 'es',
}: Props) {
  const filters = useStore($params);

  const {
    checkInDate,
    checkoutDate,
    adults = 1,
    children = 0,
    infants = 0,
    numPets = 0,
  } = filters;

  const paramsObj: Record<string, string> = {};
  if (checkInDate) paramsObj.checkInDate = checkInDate;
  if (checkoutDate) paramsObj.checkoutDate = checkoutDate;
  paramsObj.adults = String(adults);
  if (children > 0) paramsObj.children = String(children);
  if (infants > 0) paramsObj.infants = String(infants);
  if (numPets > 0) paramsObj.numPets = String(numPets);

  const params = new URLSearchParams(paramsObj).toString();

  const overlayRef = useRef<google.maps.OverlayView | null>(null);

  useEffect(() => {
    if (!map || !window.google) return;

    let containerDiv: HTMLDivElement | undefined;

    let isMouseDownOutside = false;
    let mouseDownTarget: EventTarget | null = null;
    let hasMoved = false;

    const handleMouseDown = (event: MouseEvent) => {
      if (containerDiv && !containerDiv.contains(event.target as Node)) {
        isMouseDownOutside = true;
        mouseDownTarget = event.target;
        hasMoved = false;
      } else {
        isMouseDownOutside = false;
      }
    };

    const handleMouseMove = () => {
      if (isMouseDownOutside) {
        hasMoved = true;
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (
        isMouseDownOutside &&
        !containerDiv?.contains(event.target as Node) &&
        event.target === mouseDownTarget &&
        !hasMoved
      ) {
        onClose();
      }
      isMouseDownOutside = false;
      mouseDownTarget = null;
      hasMoved = false;
    };

    class CustomOverlay extends google.maps.OverlayView {
      div?: HTMLDivElement;
      root?: ReturnType<typeof createRoot>;

      onAdd() {
        this.div = document.createElement('div');
        this.div.style.position = 'absolute';
        this.div.style.zIndex = '999';
        this.div.style.pointerEvents = 'auto';
        this.div.style.background = 'transparent';

        containerDiv = this.div;

        this.root = createRoot(this.div);
        this.root.render(
          <ListingPopup
            data={data}
            onClose={onClose}
            lang={lang}
            params={params}
          />
        );

        const panes = this.getPanes();
        panes?.floatPane?.appendChild(this.div);

        google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.div);

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }

      draw() {
        const projection = this.getProjection();
        if (!projection || !this.div) return;

        const pos = projection.fromLatLngToDivPixel(overlayInfo.position);
        if (!pos) return;

        const { width, height } = OVERLAY_SIZE;
        let left = pos.x;
        let top = pos.y;

        const [vertical, horizontal] = overlayInfo.direction.split('-');

        if (vertical === 'top') top -= height;
        if (horizontal === 'left') left -= width;
        if (horizontal === 'center') left -= width / 2;

        let offsetY = 0;
        if (vertical === 'top') offsetY = -TOP_ANCHOR_OFFSET_Y;
        if (vertical === 'bottom') offsetY = BOTTOM_ANCHOR_OFFSET_Y;

        this.div.style.left = `${left}px`;
        this.div.style.top = `${top + offsetY}px`;
        this.div.style.width = `${width}px`;
        this.div.style.height = `${height}px`;
      }

      onRemove() {
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        if (this.div?.parentNode) {
          this.div.parentNode.removeChild(this.div);
        }
        if (this.root) {
          const rootToUnmount = this.root;
          this.root = undefined;

          if (typeof queueMicrotask === 'function') {
            queueMicrotask(() => rootToUnmount.unmount());
          } else {
            setTimeout(() => rootToUnmount.unmount(), 0);
          }
        }
      }
    }

    const overlay = new CustomOverlay();
    overlay.setMap(map);
    overlayRef.current = overlay;

    return () => {
      overlay.setMap(null);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [map, overlayInfo, data, onClose]);

  return null;
}

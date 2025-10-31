import { createRoot, type Root } from 'react-dom/client';
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import clsx from 'clsx';
import { useStore } from '@nanostores/react';
import { $listings, $hoveredListingId, $isLoading } from '@/stores/searchStore';
import useLoadGoogleMaps from '../../Hooks/useLoadGoogleMaps';
import ListingMarker from '@/components/React/Listing/DisplayMap/ListingMarker';
import ListingPopupOverlay from '../../Listing/DisplayMap/ListingPopupOverlay';
import { getOverlayInfoFromLatLng } from '@/components/React/Helper/getOverlayInfoFromLatLng';
import type { MapState } from '@/types/search';
import { getFitOptionsFromMarkers } from '../../Utils/getFitOptionsFromMarkers';
import type { SupportedLanguages } from '@/utils/i18n';
import type { Listing } from '@/types/listing/listing';
import { convertBoundsToLiteral } from '../../Utils/convertBoundsToLiteral';
import { cleanupMarker } from '../../Utils/cleanupMarker';
import { MapSkeleton } from './SearchResultSkeleton';

const DEFAULT_MAP_CENTER = { lat: -16.29, lng: -63.59 } as const;
const DEFAULT_MAP_ZOOM = 6 as const;

const MARKER_Z_INDEX = {
  SELECTED: 300,
  HOVERED: 250,
  HIGHLIGHTED: 200,
  DEFAULT: 100,
} as const;

export interface ListingGoogleMapProps {
  widthClass?: string;
  heightClass?: string;
  className?: string;
  listings?: Listing[];
  isLoading?: boolean;
  onInteraction?: () => void;
  onMapMove: (state: MapState, opts?: { skipSearch: boolean }) => void;
  onListingHover: (id: string | null) => void;
  lang?: SupportedLanguages;
}

const ListingGoogleMap: React.FC<ListingGoogleMapProps> = ({
  widthClass = 'w-full',
  heightClass = 'h-full',
  className,
  listings: listingsProp,
  onInteraction,
  onMapMove,
  lang = 'es',
}) => {
  const [isUserLoading, setIsUserLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const markerRefs = useRef<
    Record<string, google.maps.marker.AdvancedMarkerElement>
  >({});
  const markerRootsRef = useRef<Record<string, Root>>({});

  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const storeListings = useStore($listings);
  const listingsToRender: Listing[] = listingsProp ?? storeListings;
  const hoveredListingId = useStore($hoveredListingId);
  const isLoaded = useLoadGoogleMaps();
  const mapMovedByUser = useRef(false);
  const skipNextFitBounds = useRef(false);
  const skipNextIdle = useRef(false);
  const storeIsLoading = useStore($isLoading);
  const storeIsLoadingRef = useRef(storeIsLoading);
  const hardStopRef = useRef<number | null>(null);
  const isInitialLoad = useRef(true);

  const loadingTime = 2000;

  const listingsSignature = useMemo(
    () =>
      listingsToRender
        .map(
          (l) =>
            `${l.id}-${l.location.coordinates.latitude}-${l.location.coordinates.longitude}`
        )
        .join(','),
    [listingsToRender]
  );

  const selectedMarker = useMemo(
    () =>
      listingsToRender.find((l) => String(l.id) === selectedMarkerId) || null,
    [selectedMarkerId, listingsToRender]
  );

  const overlayInfo = useMemo(() => {
    if (!selectedMarker || !map) return null;
    return getOverlayInfoFromLatLng(
      map,
      new google.maps.LatLng(
        selectedMarker.location.coordinates.latitude,
        selectedMarker.location.coordinates.longitude
      )
    );
  }, [selectedMarker, map]);

  const handleMarkerClick = useCallback((id: string) => {
    setSelectedMarkerId((currentId) => (currentId === id ? currentId : id));
  }, []);

  const handleWindowResize = useCallback(() => {
    skipNextIdle.current = true;
  }, []);

  const handleZoomIn = useCallback(() => {
    if (!map) return;
    const currentZoom = map.getZoom();
    if (currentZoom !== undefined) {
      map.setZoom(currentZoom + 1);
    }
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (!map) return;
    const currentZoom = map.getZoom();
    if (currentZoom !== undefined) {
      map.setZoom(currentZoom - 1);
    }
  }, [map]);

  const handleFullscreen = useCallback(() => {
    if (!mapContainerRef.current) return;

    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Trigger resize to adjust map
      if (map) {
        window.google.maps.event.trigger(map, 'resize');
        skipNextIdle.current = true;
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [map]);

  useEffect(() => {
    const refsSnapshot = markerRefs.current;
    const rootsSnapshot = markerRootsRef.current;

    return () => {
      Object.keys(refsSnapshot).forEach((id) =>
        cleanupMarker(id, refsSnapshot, rootsSnapshot)
      );
    };
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  useEffect(() => {
    if (isUserLoading) {
      if (hardStopRef.current) clearTimeout(hardStopRef.current);
      hardStopRef.current = window.setTimeout(() => {
        setIsUserLoading(false);
        hardStopRef.current = null;
      }, loadingTime);
    } else {
      if (hardStopRef.current) {
        clearTimeout(hardStopRef.current);
        hardStopRef.current = null;
      }
    }

    return () => {
      if (hardStopRef.current) {
        clearTimeout(hardStopRef.current);
        hardStopRef.current = null;
      }
    };
  }, [isUserLoading, setIsUserLoading]);

  useEffect(() => {
    storeIsLoadingRef.current = storeIsLoading;
    if (!storeIsLoading) setIsUserLoading(false);
  }, [storeIsLoading]);

  useEffect(() => {
    if (!map) return;
    const onUserDrag = () => {
      mapMovedByUser.current = true;
      setIsUserLoading(true);
    };
    const onUserZoom = () => {
      mapMovedByUser.current = true;
      setIsUserLoading(true);
    };

    const dragListener = map.addListener('dragstart', onUserDrag);
    const zoomListener = map.addListener('zoom_changed', onUserZoom);

    const idleListener = map.addListener('idle', () => {
      if (skipNextIdle.current) {
        skipNextIdle.current = false;
        return;
      }
      if (mapMovedByUser.current) {
        mapMovedByUser.current = false;
        skipNextFitBounds.current = true;
        onInteraction?.();
        const bounds = map.getBounds();
        const zoom = map.getZoom();
        if (!bounds || zoom === undefined) {
          console.warn('Map idle: bounds or zoom unavailable');
          return;
        }
        onMapMove({
          bounds: convertBoundsToLiteral(bounds),
          zoom,
        });
      }
    });

    return () => {
      dragListener.remove();
      zoomListener.remove();
      idleListener.remove();
    };
  }, [map, onMapMove, onInteraction]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const result = getFitOptionsFromMarkers(listingsToRender);

    const options: google.maps.MapOptions = {
      mapId: import.meta.env.PUBLIC_GOOGLE_MAPS_MAP_ID,
      disableDefaultUI: true,
      center: 'center' in result ? result.center : DEFAULT_MAP_CENTER,
      zoom: 'center' in result ? result.zoom : DEFAULT_MAP_ZOOM,
      gestureHandling: 'greedy',
      scrollwheel: true,
    };

    mapInstanceRef.current = new window.google.maps.Map(
      mapRef.current,
      options
    );

    if (listingsToRender.length > 0 && 'bounds' in result && result.bounds) {
      skipNextIdle.current = true;
      mapInstanceRef.current.fitBounds(result.bounds);
      const zoom = mapInstanceRef.current.getZoom();
      if (!result.bounds || zoom === undefined) {
        console.warn('Initial fitBounds: bounds or zoom unavailable');
      } else {
        onMapMove(
          { bounds: convertBoundsToLiteral(result.bounds), zoom },
          { skipSearch: true }
        );
      }
    }

    setMap(mapInstanceRef.current);
    // Mark initial load as complete after map is created
    isInitialLoad.current = false;
  }, [isLoaded, listingsToRender, onMapMove]);

  useEffect(() => {
    // Only fit bounds on initial load, not on every listing update
    if (!map || listingsToRender.length === 0 || !isInitialLoad.current) return;

    if (skipNextFitBounds.current) {
      skipNextFitBounds.current = false;
      return;
    } else {
      const result = getFitOptionsFromMarkers(listingsToRender);

      if ('bounds' in result && result.bounds) {
        skipNextIdle.current = true;
        map.fitBounds(result.bounds);

        const literalBounds = convertBoundsToLiteral(result.bounds);
        const zoom = map.getZoom()!;
        onMapMove({ bounds: literalBounds, zoom }, { skipSearch: true });
      } else if ('center' in result) {
        skipNextIdle.current = true;
        map.setCenter(result.center);
        map.setZoom(result.zoom);
        const bounds = map.getBounds();
        const zoom2 = map.getZoom();
        if (!bounds || zoom2 === undefined) {
          console.warn('Update fit: bounds or zoom unavailable');
        } else {
          onMapMove(
            { bounds: convertBoundsToLiteral(bounds), zoom: zoom2 },
            { skipSearch: true }
          );
        }
      }
    }
  }, [listingsToRender, map, onMapMove]);

  useEffect(() => {
    if (!isLoaded || !window.google || !mapInstanceRef.current) return;
    const { AdvancedMarkerElement } = window.google.maps.marker;

    const currentIds = new Set(listingsToRender.map((l) => String(l.id)));

    Object.keys(markerRefs.current)
      .filter((id) => !currentIds.has(id))
      .forEach((id) =>
        cleanupMarker(id, markerRefs.current, markerRootsRef.current)
      );

    listingsToRender.forEach((listing) => {
      const id = String(listing.id);
      let root = markerRootsRef.current[id];
      let marker = markerRefs.current[id];

      if (!root) {
        const container = document.createElement('div');
        root = createRoot(container);
        markerRootsRef.current[id] = root;

        marker = new AdvancedMarkerElement({
          map: mapInstanceRef.current!,
          position: {
            lat: listing.location.coordinates.latitude,
            lng: listing.location.coordinates.longitude,
          },
          content: container,
          title: listing.title,
        });
        marker.addListener('click', () => handleMarkerClick(id));
        markerRefs.current[id] = marker;
      } else {
        marker!.position = {
          lat: listing.location.coordinates.latitude,
          lng: listing.location.coordinates.longitude,
        };
        marker!.map = mapInstanceRef.current;
      }
    });
    // listingsSignature is a memoized value that changes when listingsToRender changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, listingsSignature, handleMarkerClick]);

  useEffect(() => {
    Object.entries(markerRefs.current).forEach(([id, markerInstance]) => {
      const isSelected = selectedMarkerId === id;
      const isHovered = hoveredListingId === id;
      const listing = listingsToRender.find((l) => String(l.id) === id);
      if (!listing) return;

      const newZIndex = isSelected
        ? MARKER_Z_INDEX.SELECTED
        : isHovered
          ? MARKER_Z_INDEX.HOVERED
          : listing.highlighted
            ? MARKER_Z_INDEX.HIGHLIGHTED
            : MARKER_Z_INDEX.DEFAULT;

      if (markerInstance.zIndex !== newZIndex) {
        markerInstance.zIndex = newZIndex;
      }

      const root = markerRootsRef.current[id];
      const zoom = map?.getZoom() ?? DEFAULT_MAP_ZOOM;
      const showByDefault = zoom >= 9 || listingsToRender.length <= 300;
      root?.render(
        <ListingMarker
          showMarker={
            showByDefault || listing.highlighted || isSelected || isHovered
          }
          message={`${listing.pricing.currency} ${listing.pricing.total}`}
          selected={isSelected}
          hoveredFromCard={isHovered}
        />
      );
    });
  }, [selectedMarkerId, hoveredListingId, listingsToRender, map]);

  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!map) return;
    const h = google.maps.event.addListenerOnce(map, 'idle', () => {
      setIsMapReady(true);
    });
    return () => google.maps.event.removeListener(h);
  }, [map]);

  const showInitialOverlay = !isMapReady;

  const showMoveOverlay = isUserLoading;
  return (
    <div
      ref={mapContainerRef}
      className={clsx(
        widthClass,
        heightClass,
        className,
        'relative',
        isFullscreen && 'bg-base-100'
      )}
    >
      <div
        ref={mapRef}
        className={clsx(
          widthClass,
          heightClass,
          isFullscreen ? 'rounded-none' : 'rounded-xl'
        )}
        role="application"
        aria-label="Interactive map showing property listings"
        tabIndex={0}
      />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="border-base-200 bg-base-100 overflow-hidden rounded-lg border shadow-lg">
          <button
            onClick={handleZoomIn}
            className="hover:bg-base-200 border-base-200 flex h-10 w-10 items-center justify-center border-b transition-colors"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="hover:bg-base-200 flex h-10 w-10 items-center justify-center transition-colors"
            aria-label="Zoom out"
            title="Zoom out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12h-15"
              />
            </svg>
          </button>
        </div>

        {/* Fullscreen Control */}
        <button
          onClick={handleFullscreen}
          className="hover:bg-base-200 border-base-200 bg-base-100 flex h-10 w-10 items-center justify-center rounded-lg border shadow-lg transition-colors"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
              />
            </svg>
          )}
        </button>
      </div>

      {showInitialOverlay && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center bg-white/50"
          aria-hidden="true"
        >
          <MapSkeleton />
        </div>
      )}

      {showMoveOverlay && (
        <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2">
          <div
            role="status"
            aria-label="Buscando en el mapa…"
            className="border-base-200 bg-base-100/90 flex w-28 items-center justify-center rounded-full border px-3 py-1.5 shadow-md backdrop-blur"
          >
            <span className="loading loading-bars loading-xl text-primary [animation-duration:1.5s]" />
          </div>
        </div>
      )}

      {overlayInfo && selectedMarker && (
        <ListingPopupOverlay
          map={map!}
          overlayInfo={overlayInfo}
          data={selectedMarker}
          onClose={() => setSelectedMarkerId(null)}
          lang={lang}
        />
      )}
    </div>
  );
};

export default ListingGoogleMap;

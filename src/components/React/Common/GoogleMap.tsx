import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import useLoadGoogleMaps from '../Hooks/useLoadGoogleMaps';
import { useMarkerContent } from '../Hooks/useMarkerContent';

export interface GoogleMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  showMarker?: boolean;
  showRoundedMarker?: boolean;
  interactive?: boolean;
  draggableMarker?: boolean;
  onDragEnd?: (coords: { latitude: number; longitude: number }) => void;
  markerLabel?: string;
  approximateAreaRadius?: number;
  widthClass?: string;
  heightClass?: string;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  latitude,
  longitude,
  zoom = 14,
  showMarker = true,
  showRoundedMarker = false,
  interactive = true,
  draggableMarker = false,
  onDragEnd,
  markerLabel,
  approximateAreaRadius = 500,
  widthClass = 'w-full',
  heightClass = 'h-full',
  className,
}) => {
  const mapId = import.meta.env.PUBLIC_GOOGLE_MAPS_MAP_ID;
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null
  );
  const circleRef = useRef<google.maps.Circle | null>(null);
  const isLoaded = useLoadGoogleMaps();

  const { createPinMarkerContent, createRoundedMarkerContent } =
    useMarkerContent({ markerLabel });

  function toLatLngLiteral(
    pos: google.maps.LatLng | google.maps.LatLngLiteral
  ): google.maps.LatLngLiteral {
    return pos instanceof google.maps.LatLng
      ? { lat: pos.lat(), lng: pos.lng() }
      : pos;
  }

  const onDragEndRef = useRef<typeof onDragEnd>(onDragEnd);
  useEffect(() => {
    onDragEndRef.current = onDragEnd;
  }, [onDragEnd]);

  // Create map once
  useEffect(() => {
    if (!isLoaded || !window.google || !mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom,
        mapId,
        disableDefaultUI: !interactive,
        draggable: interactive,
        scrollwheel: interactive,
        disableDoubleClickZoom: !interactive,
        gestureHandling: interactive ? 'auto' : 'none',
        keyboardShortcuts: interactive,
        zoomControl: interactive,
        streetViewControl: interactive,
        fullscreenControl: interactive,
        mapTypeControl: false,
        rotateControl: interactive,
        scaleControl: interactive,
      });
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
      mapInstanceRef.current = null;
    };
  }, [isLoaded]);

  // Update interactivity
  useEffect(() => {
    if (!window.google || !mapInstanceRef.current) return;

    mapInstanceRef.current.setOptions({
      disableDefaultUI: !interactive,
      draggable: interactive,
      scrollwheel: interactive,
      disableDoubleClickZoom: !interactive,
      gestureHandling: interactive ? 'auto' : 'none',
      keyboardShortcuts: interactive,
      zoomControl: interactive,
      streetViewControl: interactive,
      fullscreenControl: interactive,
      mapTypeControl: false,
      rotateControl: interactive,
      scaleControl: interactive,
    });
  }, [interactive]);

  // Update center and zoom
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    const center = new window.google.maps.LatLng(latitude, longitude);
    mapInstanceRef.current.setCenter(center);
    if (zoom !== undefined) {
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [latitude, longitude, zoom]);

  // Create marker ONCE
  useEffect(() => {
    if (
      !isLoaded ||
      !window.google ||
      !mapInstanceRef.current ||
      markerRef.current ||
      !showMarker
    ) {
      return;
    }

    const { AdvancedMarkerElement } = window.google.maps.marker;

    const marker = new AdvancedMarkerElement({
      map: mapInstanceRef.current,
      position: new window.google.maps.LatLng(latitude, longitude),
      gmpDraggable: !!draggableMarker,
      content: showRoundedMarker
        ? createRoundedMarkerContent()
        : createPinMarkerContent(),
    });

    const listener = marker.addListener('dragend', () => {
      const pos = marker.position;
      if (!pos) return;
      const { lat, lng } = toLatLngLiteral(pos);
      onDragEndRef.current?.({ latitude: lat, longitude: lng });
    });

    markerRef.current = marker;

    return () => {
      window.google.maps.event.removeListener(listener);
      marker.map = null;
      markerRef.current = null;
    };
  }, [isLoaded, showMarker]);

  // Update marker position
  useEffect(() => {
    if (markerRef.current && window.google) {
      markerRef.current.position = new window.google.maps.LatLng(
        latitude,
        longitude
      );
    }
  }, [latitude, longitude]);

  // Update marker draggable
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.gmpDraggable = !!draggableMarker;
    }
  }, [draggableMarker]);

  // Update marker content
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.content = showRoundedMarker
        ? createRoundedMarkerContent()
        : createPinMarkerContent();
    }
  }, [showRoundedMarker, createPinMarkerContent, createRoundedMarkerContent]);

  // Update marker visibility
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.map = showMarker ? mapInstanceRef.current : null;
    }
  }, [showMarker]);

  // Circle (unchanged)
  useEffect(() => {
    if (!isLoaded || !window.google || !mapInstanceRef.current) return;

    if (!showRoundedMarker) {
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
      return;
    }

    if (!circleRef.current) {
      circleRef.current = new window.google.maps.Circle({
        map: mapInstanceRef.current,
        center: { lat: latitude, lng: longitude },
        radius: approximateAreaRadius,
        fillColor: '#4285F4',
        fillOpacity: 0.2,
        strokeColor: '#ffffff',
        strokeOpacity: 0.4,
        strokeWeight: 1,
      });
      mapInstanceRef.current.setOptions({ maxZoom: 16 });
    } else {
      circleRef.current.setCenter({ lat: latitude, lng: longitude });
      circleRef.current.setRadius(approximateAreaRadius);
    }
  }, [isLoaded, latitude, longitude, showRoundedMarker, approximateAreaRadius]);

  return (
    <div
      ref={mapRef}
      className={clsx(widthClass, heightClass, 'rounded-xl', className)}
      aria-label="Listing map"
      role="region"
      tabIndex={0}
    />
  );
};

export default GoogleMap;

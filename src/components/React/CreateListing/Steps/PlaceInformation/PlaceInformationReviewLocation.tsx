import { useState, useRef, useMemo, useCallback } from 'react';
import GoogleMap from '@/components/React/Common/GoogleMap';
import type { Coordinates, PlaceLocation } from '@/types/createListing';
import { useToast } from '../../ToastContext';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import { useDistanceBetweenCoords } from '@/components/React/Hooks/useDistanceBetweenCoords';
import { formatCoordsForBackend } from '@/components/React/Utils/location';

interface Props {
  location: PlaceLocation;
  onNewCoords?: (newCoords: Coordinates) => void;
  onIsMarkerValid?: (isValid: boolean) => void;
  lang?: SupportedLanguages;
}

const MAX_DISTANCE_METERS = 100;

export default function PlaceInformationReviewLocation({
  location,
  onNewCoords,
  onIsMarkerValid,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);

  const originalCoords = useRef<Coordinates>(location.coordinates);

  const [currentCoords, setCurrentCoords] = useState<Coordinates>(
    location.coordinates
  );
  const { showToast, hideToast } = useToast();

  const fullAddress = useMemo(
    () =>
      [location.address, location.city, location.state, location.country]
        .map((s) => s.trim())
        .filter((s) => s)
        .join(', '),
    [location.address, location.city, location.state, location.country]
  );
  const markerLabel = translate(
    t,
    'createListing.wizardStepContent.placeInformationReviewLocation.markerLabel'
  );

  const computeDistance = useDistanceBetweenCoords(MAX_DISTANCE_METERS);

  const handleMarkerUpdate = useCallback(
    (newCoords: Coordinates) => {
      const formattedCoords = formatCoordsForBackend(newCoords);

      const { isValid } = computeDistance(
        originalCoords.current,
        formattedCoords
      );

      setCurrentCoords(formattedCoords);

      if (isValid) {
        hideToast();
        onNewCoords?.(formattedCoords);
      } else {
        const msg = translate(
          t,
          'createListing.wizardStepContent.placeInformationReviewLocation.markerTooFar',
          {
            meters: MAX_DISTANCE_METERS,
          }
        );
        showToast({
          type: 'error',
          message: msg,
          autoClose: true,
          duration: 3000,
        });
      }
      onIsMarkerValid?.(isValid);
    },
    [computeDistance, onIsMarkerValid, hideToast, onNewCoords, t, showToast]
  );

  return (
    <section className="bg-[var(--color-base-100)] px-4 py-6 sm:px-6 md:mb-5 md:px-16 md:py-0 lg:px-24 xl:px-32 2xl:px-60">
      <div className="mx-auto flex max-w-[800px] flex-col items-start justify-center gap-5 md:gap-10">
        {/* Title and description */}
        <div className="flex w-full flex-col items-start space-y-4">
          <h2 className="w-full text-[30px] leading-9 font-bold text-[var(--color-base-content)]">
            {translate(
              t,
              'createListing.wizardStepContent.placeInformationReviewLocation.title'
            )}
          </h2>
          <p className="w-full text-base leading-6 font-normal text-[var(--color-neutral)]">
            {translate(
              t,
              'createListing.wizardStepContent.placeInformationReviewLocation.description'
            )}
          </p>
        </div>

        {/* Map + full address (read-only) */}
        <div className="relative w-full">
          <div className="absolute top-2 left-1/2 z-10 w-full max-w-[423px] -translate-x-1/2 md:top-7">
            <div className="flex h-12 min-h-12 w-full items-center gap-2 rounded-[16px] bg-white px-4 py-3 shadow-md">
              <input
                type="text"
                readOnly
                value={fullAddress}
                className="flex-1 cursor-not-allowed border-none bg-transparent p-0 text-base leading-6 font-normal text-[var(--color-base-content)] focus:outline-none"
              />
            </div>
          </div>

          <GoogleMap
            latitude={currentCoords.latitude}
            longitude={currentCoords.longitude}
            zoom={16}
            showRoundedMarker={false}
            interactive
            draggableMarker
            onDragEnd={handleMarkerUpdate}
            widthClass="w-full"
            heightClass="h-[362px] sm:h-[350px] md:h-[400px]"
            className="rounded-[30.4px]"
            {...(markerLabel && { markerLabel })}
          />
        </div>
      </div>
    </section>
  );
}

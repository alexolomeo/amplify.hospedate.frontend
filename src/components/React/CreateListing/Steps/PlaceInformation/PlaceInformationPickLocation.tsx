import React, { useState, useEffect, useRef, useCallback } from 'react';
import GoogleMap from '@/components/React/Common/GoogleMap';
import { usePlaceAutocompleteSuggestions } from '@/components/React/Hooks/usePlaceAutocompleteSuggestions';
import { usePlaceFromPrediction } from '@/components/React/Hooks/usePlaceFromPrediction';
import useReverseGeocoding from '@/components/React/Hooks/useReverseGeocoding';
import type { PlaceLocation, Coordinates } from '@/types/createListing';
import MapPinSolid from '/src/icons/map-pin-solid.svg?react';
import MapPin from '/src/icons/map-pin.svg?react';
import { useToast } from '../../ToastContext';
import {
  tryGetUserLocation,
  formatCoordsForBackend,
  isInsideBoliviaBBox,
} from '@/components/React/Utils/location';
import { useDebounce } from '@/components/React/Hooks/useDebounce';

import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';

const defaultCoords: Coordinates = {
  latitude: -17.2902,
  longitude: -63.5887,
};

interface Props {
  location?: PlaceLocation;
  onUpdate: (location: PlaceLocation) => void;
  lang?: SupportedLanguages;
}

export default function PlaceInformationPickLocation({
  location,
  onUpdate,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [markerCoords, setMarkerCoords] = useState<Coordinates>(defaultCoords);
  const [lastValidCoords, setLastValidCoords] =
    useState<Coordinates>(defaultCoords);
  const { suggestions } = usePlaceAutocompleteSuggestions(
    debouncedInput,
    dropdownVisible && debouncedInput.trim().length >= 3
  );
  const getPlaceLocation = usePlaceFromPrediction();
  const { reverseGeocode } = useReverseGeocoding();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(5);
  const { showToast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    if (!location?.coordinates) return;

    const { latitude, longitude } = location.coordinates;
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      const initial = { latitude, longitude };

      if (isInsideBoliviaBBox(initial)) {
        setMarkerCoords(initial);
        setLastValidCoords(initial);
        setZoom(16);
      } else {
        setMarkerCoords(defaultCoords);
        setLastValidCoords(defaultCoords);
        setZoom(16);
        showToast({
          type: 'error',
          message: translate(
            t,
            'createListing.wizardStepContent.placeInformationSearchLocation.outsideBoliviaError'
          ),
          autoClose: false,
        });
      }
    }

    if (location.address) setInput(location.address);

    setIsInitialized(true);
  }, [location, isInitialized, showToast, t]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownVisible(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateFromCoords = useCallback(
    async (coordsRaw: Coordinates) => {
      if (!isInsideBoliviaBBox(coordsRaw)) {
        setMarkerCoords(lastValidCoords);
        showToast({
          type: 'error',
          message: translate(
            t,
            'createListing.wizardStepContent.placeInformationSearchLocation.outsideBoliviaError'
          ),
          autoClose: false,
        });
        return;
      }

      try {
        const rev = await reverseGeocode(coordsRaw);

        if (!rev) {
          setMarkerCoords(lastValidCoords);
          showToast({
            type: 'error',
            message: translate(
              t,
              'createListing.wizardStepContent.placeInformationSearchLocation.outsideBoliviaError'
            ),
            autoClose: false,
          });
          return;
        }

        const formatted = formatCoordsForBackend(coordsRaw);

        setMarkerCoords(coordsRaw);
        setZoom(16);
        setInput(rev.address ?? '');

        onUpdate({
          address: rev.address ?? '',
          city: rev.city ?? '',
          state: rev.state ?? '',
          country: rev.country ?? 'Bolivia',
          apt: rev.apt ?? location?.apt ?? '',
          coordinates: formatted,
        });

        setLastValidCoords(coordsRaw);
      } catch (error) {
        console.error('Reverse geocoding failed', error);
        setMarkerCoords(lastValidCoords);
        showToast({
          type: 'error',
          message: translate(
            t,
            'createListing.wizardStepContent.placeInformationSearchLocation.notFound'
          ),
          autoClose: true,
          duration: 3000,
        });
      }
    },
    [lastValidCoords, showToast, t, reverseGeocode, onUpdate, location?.apt]
  );

  const handlePrediction = useCallback(
    async (prediction: google.maps.places.PlacePrediction) => {
      try {
        const placeLoc = await getPlaceLocation(prediction);
        setDropdownVisible(false);
        await updateFromCoords(placeLoc.coordinates);
      } catch (err) {
        console.error('Error converting prediction:', err);
        showToast({
          type: 'error',
          message: translate(
            t,
            'createListing.wizardStepContent.placeInformationSearchLocation.notFound'
          ),
          autoClose: true,
          duration: 3000,
        });
      }
    },
    [getPlaceLocation, updateFromCoords, showToast, t]
  );

  const handleUseCurrentLocation = useCallback(async () => {
    setDropdownVisible(false);
    try {
      const coordsRaw = await tryGetUserLocation();
      await updateFromCoords(coordsRaw);
    } catch (error) {
      if (
        error instanceof GeolocationPositionError &&
        error.code === error.PERMISSION_DENIED
      ) {
        showToast({
          type: 'error',
          message: translate(
            t,
            'createListing.wizardStepContent.placeInformationSearchLocation.permissionDenied'
          ),
          autoClose: false,
        });
        return;
      }
      showToast({
        type: 'error',
        message: translate(
          t,
          'createListing.wizardStepContent.placeInformationSearchLocation.currentLocationNotFound'
        ),
        autoClose: true,
        duration: 3000,
      });
    }
  }, [updateFromCoords, showToast, t]);

  return (
    <section className="bg-[var(--color-base-100)] px-4 py-6 sm:px-6 md:mb-5 md:px-16 md:py-0 lg:px-24 xl:px-32 2xl:px-60">
      <div className="mx-auto flex max-w-[800px] flex-col items-start justify-center gap-5 md:gap-10">
        {/* Title and description */}
        <div className="flex w-full flex-col items-start space-y-4">
          <h2 className="w-full text-[30px] leading-9 font-bold text-[var(--color-base-content)]">
            {translate(
              t,
              'createListing.wizardStepContent.placeInformationSearchLocation.title'
            )}
          </h2>
          <p className="w-full text-base leading-6 font-normal text-[var(--color-neutral)]">
            {translate(
              t,
              'createListing.wizardStepContent.placeInformationSearchLocation.description'
            )}
          </p>
        </div>

        {/* Map + search input */}
        <div className="relative w-full">
          <div
            ref={containerRef}
            className="absolute top-7 left-1/2 z-10 w-full max-w-[423px] -translate-x-1/2"
          >
            <div className="flex h-12 min-h-12 w-full items-center gap-2 rounded-[16px] bg-white px-4 py-3 shadow-md">
              <MapPinSolid className="h-4 w-4 shrink-0 text-[var(--color-neutral)]" />
              <input
                type="text"
                className="flex-1 border-none bg-transparent p-0 text-base leading-6 font-normal text-[var(--color-base-content)] focus:outline-none"
                placeholder={translate(
                  t,
                  'createListing.wizardStepContent.placeInformationSearchLocation.placeholder'
                )}
                value={input}
                onFocus={() => setDropdownVisible(true)}
                onChange={(e) => {
                  setInput(e.target.value);
                  setDropdownVisible(true);
                }}
              />
            </div>

            {dropdownVisible && (
              <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-md">
                {suggestions.length === 0 &&
                  debouncedInput.trim() !== '' &&
                  debouncedInput.trim().length >= 3 && (
                    <li className="px-4 py-2 text-sm text-gray-500 italic">
                      {translate(
                        t,
                        'createListing.wizardStepContent.placeInformationSearchLocation.noSuggestionsFound'
                      )}
                    </li>
                  )}

                {suggestions.map((s) => (
                  <li
                    key={s.placePrediction.placeId}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    onClick={() => handlePrediction(s.placePrediction)}
                  >
                    {s.description}
                  </li>
                ))}

                <li className="w-full px-4 py-2 text-xs leading-4 font-normal text-[var(--Attributes-Raw-value-text)]">
                  {translate(
                    t,
                    'createListing.wizardStepContent.placeInformationSearchLocation.orAlternative'
                  )}
                </li>

                <li
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  onClick={handleUseCurrentLocation}
                >
                  <MapPin className="h-4 w-4 text-[var(--color-secondary)]" />
                  {translate(
                    t,
                    'createListing.wizardStepContent.placeInformationSearchLocation.useCurrentLocation'
                  )}
                </li>
              </ul>
            )}
          </div>

          <GoogleMap
            latitude={markerCoords.latitude}
            longitude={markerCoords.longitude}
            zoom={zoom}
            showRoundedMarker={false}
            interactive
            draggableMarker
            onDragEnd={updateFromCoords}
            widthClass="w-full"
            heightClass="h-[362px]"
            className="rounded-[30.4px]"
          />
        </div>
      </div>
    </section>
  );
}

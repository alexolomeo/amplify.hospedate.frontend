import React, { useState, useEffect, useRef, useCallback } from 'react';
import GoogleMap from '@/components/React/Common/GoogleMap';
import { usePlaceAutocompleteSuggestions } from '@/components/React/Hooks/usePlaceAutocompleteSuggestions';
import { usePlaceFromPrediction } from '@/components/React/Hooks/usePlaceFromPrediction';
import type { PlaceLocation, Coordinates } from '@/types/createListing';
import { useGeocoder } from '@/components/React/Hooks/useGeocoder';
import { useDebounce } from '@/components/React/Hooks/useDebounce';
import MapPinSolid from '/src/icons/map-pin-solid.svg?react';
import MapPin from '/src/icons/map-pin.svg?react';
import PencilSquare from '/src/icons/pencil-square.svg?react';

import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';

const defaultCoords: Coordinates = {
  latitude: -17.2902,
  longitude: -63.5887,
};

function extractComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string
): string | undefined {
  return components.find((c) => c.types.includes(type))?.long_name;
}

interface Props {
  onUpdate: (location: PlaceLocation) => void;
  onIsManualEntrySelected?: (isSelected: boolean) => void;
  lang?: SupportedLanguages;
}

export default function PlaceInformationSearchLocation({
  onUpdate,
  onIsManualEntrySelected,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  const [input, setInput] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const debouncedInput = useDebounce(input, 500);
  const { suggestions } = usePlaceAutocompleteSuggestions(debouncedInput);
  const getPlaceLocation = usePlaceFromPrediction();
  const containerRef = useRef<HTMLDivElement>(null);
  const { geocodeByCoords } = useGeocoder();

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

  const handleManual = useCallback(() => {
    onIsManualEntrySelected?.(true);
    setInput('');
    setDropdownVisible(false);
  }, [onIsManualEntrySelected]);

  const handlePrediction = useCallback(
    async (prediction: google.maps.places.PlacePrediction) => {
      try {
        const placeLoc = await getPlaceLocation(prediction);
        onUpdate(placeLoc);
        setInput('');
        setDropdownVisible(false);
      } catch (err) {
        console.error('Error converting prediction:', err);
      }
    },
    [getPlaceLocation, onUpdate]
  );
  async function getCurrentLocationOnce(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error('La geolocalización no está soportada por este navegador.')
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  const handleUseCurrentLocation = useCallback(async () => {
    setDropdownVisible(false);
    try {
      const coords = await getCurrentLocationOnce();
      const { coords: confirmedCoords, components = [] } =
        await geocodeByCoords(coords);

      const city = extractComponent(components, 'locality') || '';
      const state =
        extractComponent(components, 'administrative_area_level_1') || '';
      const address = extractComponent(components, 'route') || '';

      onUpdate({
        address,
        city,
        state,
        country: 'Bolivia',
        coordinates: confirmedCoords,
      });
    } catch (error: unknown) {
      console.error('Error obteniendo ubicación:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(
          translate(
            t,
            'createListing.wizardStepContent.placeInformationSearchLocation.currentLocationNotFound'
          )
        );
      }
    }
  }, [geocodeByCoords, onUpdate, t]);

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

        {/* Map + input */}
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
                {suggestions.map((s) => (
                  <li
                    key={s.placePrediction.placeId}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    onClick={() => handlePrediction(s.placePrediction)}
                  >
                    {s.description}
                  </li>
                ))}

                {/* Fixed section title */}
                <li className="w-full px-4 py-2 text-xs leading-4 font-normal text-[var(--Attributes-Raw-value-text)]">
                  {translate(
                    t,
                    'createListing.wizardStepContent.placeInformationSearchLocation.orAlternative'
                  )}
                </li>

                {/* Option: Use current location */}
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

                {/* Option: Enter manually */}
                <li
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  onClick={handleManual}
                >
                  <PencilSquare className="h-4 w-4 text-[var(--color-secondary)]" />
                  {translate(
                    t,
                    'createListing.wizardStepContent.placeInformationSearchLocation.manualEntry'
                  )}
                </li>
              </ul>
            )}
          </div>

          <GoogleMap
            latitude={defaultCoords.latitude}
            longitude={defaultCoords.longitude}
            zoom={5}
            showMarker={false}
            interactive={false}
            widthClass="w-full"
            heightClass="h-[362px]"
            className="rounded-[30.4px]"
          />
        </div>
      </div>
    </section>
  );
}

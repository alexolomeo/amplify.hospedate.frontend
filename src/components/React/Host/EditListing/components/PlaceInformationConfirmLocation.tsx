import React, { useEffect, useState, useMemo } from 'react';
import { useGeocoder } from '@/components/React/Hooks/useGeocoder';
import type { PlaceLocation } from '@/types/createListing';
import { useDebounce } from '@/components/React/Hooks/useDebounce';
import GlobeAlt from '/src/icons/globe-alt.svg?react';

import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import TextField from '@/components/React/Common/TextField';

interface Props {
  location?: PlaceLocation;
  showSpecificLocation: boolean;
  onLocationUpdate: (location: PlaceLocation) => void;
  onShowSpecificLocationToggle: (val: boolean) => void;
  onLocationValidationChange?: (needsConfirmation: boolean) => void;
  lang?: SupportedLanguages;
  defaultCountry?: string;
}

type GeocoderAddressComponentLite = {
  long_name?: string | number;
  short_name?: string | number;
  types?: readonly string[];
};

type GeocodeResult = {
  coords: { latitude: number; longitude: number };
  components?: GeocoderAddressComponentLite[];
};

type Coords = { latitude: number; longitude: number };

const isFiniteLatLng = (c?: Partial<Coords>): c is Coords =>
  !!c &&
  Number.isFinite(c.latitude) &&
  Number.isFinite(c.longitude) &&
  Math.abs(c.latitude!) <= 90 &&
  Math.abs(c.longitude!) <= 180 &&
  !(c.latitude === 0 && c.longitude === 0);

const normalize = (...segs: string[]) =>
  segs
    .map((s) => s.trim())
    .filter(Boolean)
    .join(', ');

const extractComponent = (
  comps: ReadonlyArray<GeocoderAddressComponentLite> = [],
  type: string
): string => {
  const hit = comps.find((c) => (c.types ?? []).includes(type));
  return hit?.long_name != null ? String(hit.long_name).trim() : '';
};

export default function PlaceInformationConfirmLocation({
  location: locProp,
  onLocationUpdate,
  onLocationValidationChange,
  lang = 'es',
  defaultCountry,
}: Props) {
  const t = getTranslation(lang);
  const { isLoaded, geocodeFullAddress } = useGeocoder();

  const coordsProp = locProp?.coordinates;
  const placeholderCoords = { latitude: 0, longitude: 0 };

  const location = useMemo(() => {
    return {
      address: locProp?.address ?? '',
      city: locProp?.city ?? '',
      state: locProp?.state ?? '',
      country: locProp?.country ?? '',
      apt: locProp?.apt ?? '',
      coordinates: coordsProp ?? placeholderCoords,
    };
  }, [
    locProp?.address,
    locProp?.city,
    locProp?.state,
    locProp?.country,
    locProp?.apt,
    coordsProp,
    placeholderCoords,
  ]);

  const fullAddress = useMemo(
    () =>
      normalize(
        location.address,
        location.city,
        location.state,
        location.country || defaultCountry || ''
      ),
    [
      location.address,
      location.city,
      location.state,
      location.country,
      defaultCountry,
    ]
  );

  const debouncedFullAddress = useDebounce(fullAddress, 1000);

  const [lastGeocoded, setLastGeocoded] = useState(debouncedFullAddress);

  useEffect(() => {
    if (!isLoaded) return;
    if (!debouncedFullAddress.trim()) return;
    if (debouncedFullAddress === lastGeocoded) return;
    if (debouncedFullAddress.length < 5) return;

    (async () => {
      try {
        const { coords, components = [] } = (await geocodeFullAddress(
          debouncedFullAddress
        )) as GeocodeResult;

        if (!isFiniteLatLng(coords)) {
          console.warn('❌ Geocode returned invalid coords:', coords);
          setLastGeocoded(debouncedFullAddress);
          onLocationValidationChange?.(true);
          return;
        }

        const cityFinal =
          location.city.trim() || extractComponent(components, 'locality');
        const stateFinal =
          location.state.trim() ||
          extractComponent(components, 'administrative_area_level_1');

        const coordsChanged =
          isFiniteLatLng(coords) &&
          (coords.latitude !== location.coordinates.latitude ||
            coords.longitude !== location.coordinates.longitude);

        const cityChanged = cityFinal !== location.city;
        const stateChanged = stateFinal !== location.state;

        if (coordsChanged || cityChanged || stateChanged) {
          onLocationUpdate({
            ...location,
            coordinates: coords,
            city: cityFinal,
            state: stateFinal,
          });
        }

        setLastGeocoded(
          normalize(
            location.address,
            cityFinal,
            stateFinal,
            location.country || defaultCountry || ''
          )
        );
        onLocationValidationChange?.(false);
      } catch (err) {
        console.warn('❌ Geocode failed:', err);
        setLastGeocoded(debouncedFullAddress);
        onLocationValidationChange?.(true);
      }
    })();
  }, [
    debouncedFullAddress,
    isLoaded,
    geocodeFullAddress,
    onLocationUpdate,
    lastGeocoded,
    location,
    onLocationValidationChange,
    defaultCountry,
  ]);

  const handleChange = (key: keyof typeof location) => (val: string) =>
    onLocationUpdate({ ...location, [key]: val });

  return (
    <section className="bg-[var(--color-base-100)]">
      <div className="space-y-3 rounded-2xl bg-[var(--color-base-100)] p-5 md:p-6">
        <TextField
          id="country-input"
          value={location.country || defaultCountry || 'Bolivia'}
          readOnly
          icon={
            <GlobeAlt className="h-4 w-4 shrink-0 text-[var(--color-neutral)]" />
          }
        />
        <TextField
          id="address"
          value={location.address}
          onValueChange={handleChange('address')}
          autoComplete="street-address"
          placeholder={translate(
            t,
            'createListing.wizardStepContent.placeInformationConfirmLocation.addressPlaceholder'
          )}
        />
        <TextField
          id="apt"
          value={location.apt}
          onValueChange={handleChange('apt')}
          placeholder={translate(
            t,
            'createListing.wizardStepContent.placeInformationConfirmLocation.aptPlaceholder'
          )}
        />
        <div className="w-full space-y-3">
          <TextField
            id="city"
            value={location.city}
            onValueChange={handleChange('city')}
            autoComplete="address-level2"
            placeholder={translate(
              t,
              'createListing.wizardStepContent.placeInformationConfirmLocation.cityPlaceholder'
            )}
          />
          <TextField
            id="state"
            value={location.state}
            onValueChange={handleChange('state')}
            autoComplete="address-level1"
            placeholder={translate(
              t,
              'createListing.wizardStepContent.placeInformationConfirmLocation.statePlaceholder'
            )}
            containerClassName="flex h-12 w-full items-center gap-2 rounded-[16px] border border-[var(--color-neutral-content)] bg-[var(--color-base-100)] px-4 md:col-span-2"
          />
        </div>
      </div>
    </section>
  );
}

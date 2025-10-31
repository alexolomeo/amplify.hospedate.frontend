import React, { useEffect, useMemo, useState } from 'react';
import type { SupportedLanguages } from '@/utils/i18n';
import { getTranslation } from '@/utils/i18n';
import CollapseCard from '@/components/React/Common/CollapseCard';
import GoogleMap from '@/components/React/Common/GoogleMap';
import GlobeAlt from '/src/icons/globe-alt.svg?react';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import { toLocationForm } from '@/components/React/Utils/edit-listing/content/YourPlace/location/locationAdapters';
import {
  validateLocationForm,
  type LocationValidationMessages,
} from '@/components/React/Utils/edit-listing/content/YourPlace/location/locationValidators';
import { useLocationForm } from '@/components/React/Utils/edit-listing/content/YourPlace/location/useLocationForm';
import { createLocationController } from '@/components/React/Utils/edit-listing/content/YourPlace/location/LocationController';
import { useGeocoder } from '@/components/React/Hooks/useGeocoder';
import { useDebounce } from '@/components/React/Hooks/useDebounce';

type Coordinates = { latitude: number; longitude: number };

type PlaceLocation = {
  address: string;
  apt: string;
  city: string;
  state: string;
  country: string;
  coordinates: Coordinates;
};

interface EditLocationInitial {
  location?: PlaceLocation;
  showExact?: boolean;
  addressPrivacyOnCancel?: boolean;
  canEditFields?: boolean;
}

interface EditLocationProps {
  lang?: SupportedLanguages;
  initial?: EditLocationInitial;
  onRegisterController: (ctrl: SectionController | null) => () => void;
}

const BOLIVIA_CENTER: Coordinates = { latitude: -16.2902, longitude: -63.5887 };
const BOLIVIA_COUNTRY_ZOOM = 5;

const normalize = (...segs: string[]): string =>
  segs
    .map((s) => s.trim())
    .filter(Boolean)
    .join(', ');

const extractComponent = (
  comps: google.maps.GeocoderAddressComponent[],
  type: string
): string => comps.find((c) => c.types.includes(type))?.long_name?.trim() ?? '';

export default function EditLocation({
  lang = 'es',
  initial,
  onRegisterController,
}: EditLocationProps) {
  const t = getTranslation(lang);
  const el = t.hostContent.editListing.content.editLocation;
  const { isReadOnly } = useEditability();
  const canEditFields = initial?.canEditFields ?? true;

  const initialParams = useMemo(
    () => ({
      location: initial?.location,
      showExact: initial?.showExact,
      addressPrivacyOnCancel: initial?.addressPrivacyOnCancel,
    }),
    [initial?.location, initial?.showExact, initial?.addressPrivacyOnCancel]
  );
  const initialSignature = useMemo(
    () => JSON.stringify(initialParams),
    [initialParams]
  );

  const initialForm = useMemo(
    () => toLocationForm(initialParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initialSignature]
  );

  const {
    form,
    isDirty,
    reset,
    setAddress,
    setApt,
    setCity,
    setStateText,
    setShowExact,
    setPrivacy,
    setCoordinates,
  } = useLocationForm(initialForm);

  const [externalErrors, setExternalErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const messages: LocationValidationMessages = useMemo(
    () => ({
      required: el.validation.required,
      coordsRequired: el.validation.coordsRequired,
      showExactRequired: el.validation.showExactRequired,
      privacyRequired: el.validation.privacyRequired,
    }),
    [el.validation]
  );

  const getIsValid = useMemo(() => {
    return () => validateLocationForm(form, messages).ok;
  }, [form, messages]);

  const controller = useMemo<SectionController>(() => {
    return createLocationController({
      slug: 'address',
      readOnly: isReadOnly,
      form,
      isDirty: () => isDirty,
      reset,
      messages,
      setExternalErrors,
      getIsValid,
    });
  }, [isReadOnly, form, isDirty, reset, messages, getIsValid]);

  useEffect(() => {
    const cleanup = onRegisterController(controller);
    return cleanup;
  }, [controller, onRegisterController]);

  const clientValidation = useMemo(
    () => validateLocationForm(form, messages),
    [form, messages]
  );
  const clientErrors = clientValidation.ok ? null : clientValidation.errors;
  const mergedErrors = externalErrors ?? clientErrors;

  const { isLoaded, geocodeFullAddress } = useGeocoder();

  const fullAddress = useMemo(
    () => normalize(form.address, form.city, form.state),
    [form.address, form.city, form.state]
  );
  const debouncedFullAddress = useDebounce(fullAddress, 900);

  const [lastGeocoded, setLastGeocoded] = useState<string>('');

  useEffect(() => {
    if (isReadOnly || !canEditFields) return;
    if (!isLoaded) return;

    const query = debouncedFullAddress.trim();
    if (query.length < 5) return;
    if (query === lastGeocoded) return;

    let cancelled = false;

    (async () => {
      try {
        const { coords, components = [] } = await geocodeFullAddress(query);
        if (cancelled) return;

        const cityFinal = extractComponent(components, 'locality') || form.city;
        const stateFinal =
          extractComponent(components, 'administrative_area_level_1') ||
          form.state;

        setCity(cityFinal);
        setStateText(stateFinal);
        setCoordinates(coords.latitude, coords.longitude);
        setLastGeocoded(query);
        setExternalErrors(null);
      } catch (error) {
        if (cancelled) return;
        console.error('Geocoding failed:', error);
        setLastGeocoded(query);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    isReadOnly,
    canEditFields,
    isLoaded,
    debouncedFullAddress,
    lastGeocoded,
    geocodeFullAddress,
    form.city,
    form.state,
    setCity,
    setStateText,
    setCoordinates,
  ]);

  const hasValidCoords =
    typeof form.coordinates?.latitude === 'number' &&
    typeof form.coordinates?.longitude === 'number' &&
    !(form.coordinates.latitude === 0 && form.coordinates.longitude === 0);

  const center = hasValidCoords ? form.coordinates : BOLIVIA_CENTER;
  const zoom = hasValidCoords
    ? form.showExact
      ? 16
      : 14
    : BOLIVIA_COUNTRY_ZOOM;

  const showMarker = hasValidCoords;
  const showRoundedMarker = hasValidCoords && !form.showExact;
  const markerLabel =
    hasValidCoords && !form.showExact ? el.approximateLocationLabel : undefined;

  return (
    <section className="bg-[var(--color-base-100)] px-1 py-6 md:mb-5 md:py-0">
      <h2 className="max-w-[485.375px] pb-6 font-sans text-lg font-bold text-[var(--color-base-content)] sm:text-[28px] sm:leading-[34px] md:text-[30px] md:leading-9">
        {el.title}
      </h2>

      <CollapseCard title={el.title}>
        <div className="flex w-full flex-col items-start gap-2">
          {/* Country (read-only) */}
          <div className="flex w-full flex-col items-start">
            <label
              htmlFor="country-input"
              className="w-full px-1 py-2 text-sm font-medium text-[var(--color-base-content)]"
            >
              {el.countryLabel}
            </label>

            <div className="flex h-12 min-h-12 w-full items-center gap-2 rounded-[16px] border border-[var(--color-neutral-content)] bg-[var(--color-base-100)] px-4 py-3">
              <GlobeAlt className="h-4 w-4 shrink-0 text-[var(--color-neutral)]" />
              <input
                id="country-input"
                type="text"
                value={form.country || 'Bolivia'}
                readOnly
                className="w-full bg-transparent text-[var(--color-base-content)] placeholder:text-[var(--color-placeholder)] focus:outline-none"
              />
            </div>
          </div>

          {/* Address */}
          <div className="flex w-full flex-col items-start">
            <label className="w-full px-1 py-2 text-xs font-medium text-[var(--color-base-content)] sm:text-sm">
              {el.addressLabel}
            </label>
            <div className="flex h-12 min-h-12 w-full items-center gap-2 rounded-[16px] border border-[var(--color-placeholder)] bg-[var(--color-base-100)] px-4 py-3">
              <input
                type="text"
                autoComplete="street-address"
                placeholder={el.addressPlaceholder}
                value={form.address}
                onChange={(e) => {
                  if (isReadOnly || !canEditFields) return;
                  setExternalErrors(null);
                  setAddress(e.target.value);
                }}
                disabled={!canEditFields || isReadOnly}
                className="w-full bg-transparent text-[var(--color-base-content)] placeholder:text-[var(--color-placeholder)] focus:outline-none"
                aria-invalid={
                  !isReadOnly && Boolean(mergedErrors?.['locationData.address'])
                }
              />
            </div>
            {!isReadOnly && mergedErrors?.['locationData.address'] && (
              <p className="text-error mt-2 text-sm">
                {mergedErrors['locationData.address']}
              </p>
            )}
          </div>

          {/* Apt (optional) */}
          <div className="flex w-full flex-col items-start">
            <label className="w-full px-1 py-2 text-sm font-medium text-[var(--color-base-content)]">
              {el.aptLabel}
            </label>
            <div className="flex h-12 min-h-12 w-full items-center gap-2 rounded-[16px] border border-[var(--color-placeholder)] bg-[var(--color-base-100)] px-4 py-3">
              <input
                type="text"
                placeholder={el.aptPlaceholder}
                value={form.apt}
                onChange={(e) => {
                  if (isReadOnly || !canEditFields) return;
                  setExternalErrors(null);
                  setApt(e.target.value);
                }}
                disabled={!canEditFields || isReadOnly}
                className="w-full bg-transparent text-[var(--color-base-content)] placeholder:text-[var(--color-placeholder)] focus:outline-none"
              />
            </div>
          </div>

          {/* City + State */}
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex w-full flex-col items-start">
              <label className="w-full px-1 py-2 text-sm font-medium text-[var(--color-base-content)]">
                {el.cityLabel}
              </label>
              <div className="flex h-12 min-h-12 w-full items-center gap-2 rounded-[16px] border border-[var(--color-placeholder)] bg-[var(--color-base-100)] px-4 py-3">
                <input
                  type="text"
                  autoComplete="address-level2"
                  placeholder={el.cityPlaceholder}
                  value={form.city}
                  onChange={(e) => {
                    if (isReadOnly || !canEditFields) return;
                    setExternalErrors(null);
                    setCity(e.target.value);
                  }}
                  disabled={!canEditFields || isReadOnly}
                  className="w-full bg-transparent text-[var(--color-base-content)] placeholder:text-[var(--color-placeholder)] focus:outline-none"
                  aria-invalid={
                    !isReadOnly && Boolean(mergedErrors?.['locationData.city'])
                  }
                />
              </div>
              {!isReadOnly && mergedErrors?.['locationData.city'] && (
                <p className="text-error mt-2 text-sm">
                  {mergedErrors['locationData.city']}
                </p>
              )}
            </div>

            <div className="flex w-full flex-col items-start">
              <label className="w-full px-1 py-2 text-sm font-medium text-[var(--color-base-content)]">
                {el.stateLabel}
              </label>
              <div className="flex h-12 min-h-12 w-full items-center gap-2 rounded-[16px] border border-[var(--color-placeholder)] bg-[var(--color-base-100)] px-4 py-3">
                <input
                  type="text"
                  autoComplete="address-level1"
                  placeholder={el.statePlaceholder}
                  value={form.state}
                  onChange={(e) => {
                    if (isReadOnly || !canEditFields) return;
                    setExternalErrors(null);
                    setStateText(e.target.value);
                  }}
                  disabled={!canEditFields || isReadOnly}
                  className="w-full bg-transparent text-[var(--color-base-content)] placeholder:text-[var(--color-placeholder)] focus:outline-none"
                  aria-invalid={
                    !isReadOnly && Boolean(mergedErrors?.['locationData.state'])
                  }
                />
              </div>
              {!isReadOnly && mergedErrors?.['locationData.state'] && (
                <p className="text-error mt-2 text-sm">
                  {mergedErrors['locationData.state']}
                </p>
              )}
            </div>
          </div>
        </div>
      </CollapseCard>

      {/* Toggle + mapa */}
      <div className="mt-8 flex w-full flex-col items-start gap-8">
        <div className="flex w-full items-center justify-between gap-6">
          <p className="text-xl leading-7 font-bold text-[var(--color-base-content)]">
            {el.showExactLocationTitle}
          </p>
          <input
            type="checkbox"
            className="toggle toggle-primary toggle-md"
            checked={form.showExact}
            onChange={() => {
              if (isReadOnly || !canEditFields) return;
              setExternalErrors(null);
              setShowExact(!form.showExact);
            }}
            disabled={!canEditFields || isReadOnly}
            aria-invalid={
              !isReadOnly && Boolean(mergedErrors?.displaySpecificLocation)
            }
          />
        </div>

        <p className="w-full text-sm leading-5 font-normal text-[var(--color-base-content)] sm:text-base sm:leading-6">
          {el.showExactLocationDescription}
        </p>

        <div className="flex h-[258px] w-full items-center justify-center">
          <GoogleMap
            latitude={center.latitude}
            longitude={center.longitude}
            zoom={zoom}
            showMarker={showMarker}
            showRoundedMarker={showRoundedMarker}
            interactive={false}
            {...(markerLabel && { markerLabel })}
            widthClass="w-full"
            heightClass="h-full"
            className="rounded-[40px]"
          />
        </div>
      </div>

      {/* Privacy */}
      <div className="mt-4">
        <div className="rounded-2xl bg-white p-2">
          <div className="pointer-events-auto relative z-10 flex items-center justify-between gap-4">
            <p className="text-[15px] font-semibold text-[var(--color-base-content)]">
              {el.privacyTitle}
            </p>

            <input
              id="address-privacy-toggle"
              type="checkbox"
              className="toggle toggle-primary toggle-md"
              checked={form.addressPrivacyOnCancel}
              onChange={(e) => {
                if (isReadOnly || !canEditFields) return;
                setExternalErrors(null);
                setPrivacy(e.currentTarget.checked);
              }}
              disabled={!canEditFields || isReadOnly}
              aria-label={el.privacyTitle}
              aria-invalid={
                !isReadOnly &&
                Boolean(mergedErrors?.addressPrivacyForCancellation)
              }
            />
          </div>

          <p className="mt-2 text-sm text-[var(--color-neutral)]">
            {el.privacyDescription}
          </p>
        </div>
      </div>
    </section>
  );
}

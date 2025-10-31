import React, { useMemo, useCallback } from 'react';
import GoogleMap from '@/components/React/Common/GoogleMap';
import type { PlaceLocation } from '@/types/createListing';
import GlobeAlt from '/src/icons/globe-alt.svg?react';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';

interface Props {
  location?: PlaceLocation;
  showSpecificLocation: boolean;
  onLocationUpdate: (location: PlaceLocation) => void;
  onShowSpecificLocationToggle: (val: boolean) => void;
  lang?: SupportedLanguages;
}

export default function PlaceInformationConfirmLocation({
  location: locProp,
  showSpecificLocation,
  onLocationUpdate,
  onShowSpecificLocationToggle,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);

  const location = useMemo<PlaceLocation>(() => {
    const placeholderCoords = { latitude: 0, longitude: 0 };
    return {
      address: locProp?.address ?? '',
      city: locProp?.city ?? '',
      state: locProp?.state ?? '',
      country: locProp?.country ?? 'Bolivia',
      apt: locProp?.apt ?? '',
      coordinates: locProp?.coordinates ?? placeholderCoords,
    };
  }, [locProp]);

  const hasValidCoords =
    typeof location.coordinates?.latitude === 'number' &&
    typeof location.coordinates?.longitude === 'number' &&
    location.coordinates.latitude !== 0 &&
    location.coordinates.longitude !== 0;

  const onChangeField = useCallback(
    (patch: Partial<PlaceLocation>) => {
      onLocationUpdate({ ...location, ...patch, country: 'Bolivia' });
    },
    [location, onLocationUpdate]
  );

  const defaultCoords = { latitude: -17.2902, longitude: -63.5887 };
  const center = hasValidCoords ? location.coordinates : defaultCoords;
  const zoom = hasValidCoords ? (showSpecificLocation ? 16 : 14) : 5;
  const showMarker = hasValidCoords;
  const showRoundedMarker = hasValidCoords && !showSpecificLocation;
  const markerLabel =
    hasValidCoords && !showSpecificLocation
      ? translate(
          t,
          'createListing.wizardStepContent.placeInformationConfirmLocation.approximateLocationLabel'
        )
      : undefined;

  return (
    <section className="bg-[var(--color-base-100)] px-4 py-6 sm:px-6 md:mb-5 md:px-16 md:py-0 lg:px-24 xl:px-32 2xl:px-60">
      <div className="mx-auto flex max-w-[800px] flex-col items-start justify-center gap-10">
        {/* 1) Título + formulario */}
        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex w-full flex-col items-start gap-2">
            <h2 className="max-w-[485.375px] text-[26px] leading-8 font-bold text-[var(--color-base-content)] sm:text-[28px] sm:leading-[34px] md:text-[30px] md:leading-9">
              {translate(
                t,
                'createListing.wizardStepContent.placeInformationConfirmLocation.title'
              )}
            </h2>
            <p className="w-full text-sm leading-5 font-normal text-[var(--color-neutral)] sm:text-base sm:leading-6">
              {translate(
                t,
                'createListing.wizardStepContent.placeInformationConfirmLocation.subtitle'
              )}
            </p>
          </div>

          {/* Campos */}
          <div className="flex w-full flex-col items-start gap-2">
            {/* Country (solo lectura) */}
            <div className="flex w-full flex-col items-start">
              <label
                htmlFor="country-input"
                className="w-full px-1 py-2 text-sm font-medium text-[var(--color-base-content)]"
              >
                {translate(
                  t,
                  'createListing.wizardStepContent.placeInformationConfirmLocation.countryLabel'
                )}
              </label>

              <div className="flex h-12 min-h-12 w-full items-center gap-2 rounded-[16px] border border-[var(--color-neutral-content)] bg-[var(--color-base-100)] px-4 py-3">
                <GlobeAlt className="h-4 w-4 shrink-0 text-[var(--color-neutral)]" />
                <input
                  id="country-input"
                  type="text"
                  value="Bolivia"
                  readOnly
                  className="w-full bg-transparent text-[var(--color-base-content)] placeholder:text-[var(--color-placeholder)] focus:outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex w-full flex-col items-start">
              <label className="w-full px-1 py-2 text-xs font-medium text-[var(--color-base-content)] sm:text-sm">
                {translate(
                  t,
                  'createListing.wizardStepContent.placeInformationConfirmLocation.addressLabel'
                )}
              </label>
              <div className="flex h-12 min-h-12 w-full items-center gap-2 rounded-[16px] border border-[var(--color-placeholder)] bg-[var(--color-base-100)] px-4 py-3">
                <input
                  type="text"
                  autoComplete="street-address"
                  placeholder={translate(
                    t,
                    'createListing.wizardStepContent.placeInformationConfirmLocation.addressPlaceholder'
                  )}
                  value={location.address}
                  onChange={(e) => onChangeField({ address: e.target.value })}
                  className="w-full bg-transparent text-[var(--color-base-content)] placeholder:text-[var(--color-placeholder)] focus:outline-none"
                />
              </div>
            </div>

            {/* Apt (opcional) */}
            <div className="flex w-full flex-col items-start">
              <label className="w-full px-1 py-2 text-sm font-medium text-[var(--color-base-content)]">
                {translate(
                  t,
                  'createListing.wizardStepContent.placeInformationConfirmLocation.aptLabel'
                )}
              </label>
              <div className="flex h-12 min-h-12 w-full items-center gap-2 rounded-[16px] border border-[var(--color-placeholder)] bg-[var(--color-base-100)] px-4 py-3">
                <input
                  type="text"
                  placeholder={translate(
                    t,
                    'createListing.wizardStepContent.placeInformationConfirmLocation.aptPlaceholder'
                  )}
                  value={location.apt}
                  onChange={(e) => onChangeField({ apt: e.target.value })}
                  className="w-full bg-transparent text-[var(--color-base-content)] placeholder:text-[var(--color-placeholder)] focus:outline-none"
                />
              </div>
            </div>

            {/* City + State */}
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex w-full flex-col items-start">
                <label className="w-full px-1 py-2 text-sm font-medium text-[var(--color-base-content)]">
                  {translate(
                    t,
                    'createListing.wizardStepContent.placeInformationConfirmLocation.cityLabel'
                  )}
                </label>
                <div className="flex h-12 min-h-12 w-full items-center gap-2 rounded-[16px] border border-[var(--color-placeholder)] bg-[var(--color-base-100)] px-4 py-3">
                  <input
                    type="text"
                    autoComplete="address-level2"
                    placeholder={translate(
                      t,
                      'createListing.wizardStepContent.placeInformationConfirmLocation.cityPlaceholder'
                    )}
                    value={location.city}
                    onChange={(e) => onChangeField({ city: e.target.value })}
                    className="w-full bg-transparent text-[var(--color-base-content)] placeholder:text-[var(--color-placeholder)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex w-full flex-col items-start">
                <label className="w-full px-1 py-2 text-sm font-medium text-[var(--color-base-content)]">
                  {translate(
                    t,
                    'createListing.wizardStepContent.placeInformationConfirmLocation.stateLabel'
                  )}
                </label>
                <div className="flex h-12 min-h-12 w-full items-center gap-2 rounded-[16px] border border-[var(--color-placeholder)] bg-[var(--color-base-100)] px-4 py-3">
                  <input
                    type="text"
                    autoComplete="address-level1"
                    placeholder={translate(
                      t,
                      'createListing.wizardStepContent.placeInformationConfirmLocation.statePlaceholder'
                    )}
                    value={location.state}
                    onChange={(e) => onChangeField({ state: e.target.value })}
                    className="w-full bg-transparent text-[var(--color-base-content)] placeholder:text-[var(--color-placeholder)] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2) Toggle + mapa (solo visual) */}
        <div className="flex w-full flex-col items-start gap-8">
          <div className="flex w-full items-center justify-between gap-6">
            <p className="text-xl leading-7 font-bold text-[var(--color-base-content)]">
              {translate(
                t,
                'createListing.wizardStepContent.placeInformationConfirmLocation.showExactLocationTitle'
              )}
            </p>
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-md"
              checked={showSpecificLocation}
              onChange={() =>
                onShowSpecificLocationToggle(!showSpecificLocation)
              }
            />
          </div>

          <p className="w-full text-sm leading-5 font-normal text-[var(--color-base-content)] sm:text-base sm:leading-6">
            {translate(
              t,
              'createListing.wizardStepContent.placeInformationConfirmLocation.showExactLocationDescription'
            )}
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
      </div>
    </section>
  );
}

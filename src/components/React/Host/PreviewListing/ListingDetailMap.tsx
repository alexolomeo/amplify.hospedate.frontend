import * as React from 'react';
import GoogleMap from '@/components/React/Common/GoogleMap';
import type { Coordinates } from '@/types/listing/location';
import { getSafeText } from '@/utils/displayHelpers';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

type Props = {
  address: string;
  coordinates?: Coordinates | null;
  showSpecificLocation?: boolean;
  lang?: SupportedLanguages;
  /** opcionales, por si quieres sobreescribir */
  zoom?: number;
  widthClass?: string;
  heightClass?: string;
};

export default function ListingDetailMap({
  address,
  coordinates,
  showSpecificLocation = true,
  lang = 'es',
  zoom = 14,
  widthClass = 'w-full',
  heightClass = 'h-[300px] sm:h-[350px] md:h-[400px]',
}: Props) {
  const t = React.useMemo(() => getTranslation(lang), [lang]);

  const { latitude, longitude } = coordinates ?? {};

  const hasLat = typeof latitude === 'number' && Number.isFinite(latitude);
  const hasLng = typeof longitude === 'number' && Number.isFinite(longitude);

  const showMarker =
    hasLat &&
    hasLng &&
    (latitude as number) !== 0 &&
    (longitude as number) !== 0;

  const showApproximateMarker = showMarker && !showSpecificLocation;

  const markerLabel = showApproximateMarker
    ? t.listingDetail.map.exactLocationAfterReservation
    : undefined;

  return (
    <div className="py-8">
      <h2 className="title-listing">{t.listingDetail.map.title}</h2>

      {showMarker ? (
        <div className="space-y-6">
          <p className="description-listing">{getSafeText(address, lang)}</p>

          <GoogleMap
            latitude={latitude as number}
            longitude={longitude as number}
            zoom={zoom}
            showMarker={showMarker}
            showRoundedMarker={showApproximateMarker}
            {...(markerLabel ? { markerLabel } : {})}
            widthClass={widthClass}
            heightClass={heightClass}
          />
        </div>
      ) : (
        <p className="description-listing">
          {t.listingDetail.map.locationUnavailableMessage}
        </p>
      )}
    </div>
  );
}

import * as React from 'react';
import { getSafeArray } from '@/utils/displayHelpers';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import type { Amenity } from '@/types/listing/amenity';
import { translateAmenity } from '@/utils/translateAmenity';
import Modal from './Modal';
import AppIcon from '@/components/React/Common/AppIcon';

type GroupedListProps = { amenities: Amenity[]; lang?: SupportedLanguages };

type Props = {
  amenities: Amenity[];
  lang?: SupportedLanguages;
  previewLimit?: number;
  AmenitiesGroupedListComponent?: React.ComponentType<GroupedListProps>;
};

export default function ListingDetailAmenity({
  amenities,
  lang = 'es',
  previewLimit = 10,
  AmenitiesGroupedListComponent,
}: Props): React.JSX.Element | null {
  const [open, setOpen] = React.useState(false);
  const t = React.useMemo(() => getTranslation(lang), [lang]);

  const safeAmenities = React.useMemo(
    () => (getSafeArray(amenities, []) as Amenity[]).filter(Boolean),
    [amenities]
  );
  if (safeAmenities.length === 0) return null;

  const previewAmenities = safeAmenities.slice(0, previewLimit);

  const title = t.listingDetail.amenities.title;
  const showAllLabel = t.listingDetail.amenities.showAll;

  return (
    <div>
      <div className="space-y-6 py-8">
        <h2 className="title-listing">{title}</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {previewAmenities.map((amenity, idx) => {
            return (
              <div
                key={`${amenity.icon}-${idx}`}
                className="flex items-center gap-4 text-sm"
              >
                <span className="text-secondary inline-flex h-4 w-4 flex-shrink-0 items-center justify-center">
                  <AppIcon
                    iconName={amenity.icon}
                    folder="amenities"
                    className="text-secondary h-4 w-4"
                  />
                </span>
                <p className="flex-1 justify-center leading-tight font-normal">
                  {translateAmenity(amenity.icon, t)}
                </p>
              </div>
            );
          })}
        </div>

        {safeAmenities.length > previewLimit && (
          <button
            type="button"
            className="btn btn-outline btn-secondary inline-flex items-center gap-1 rounded-full"
            onClick={() => setOpen(true)}
          >
            {showAllLabel}
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="currentColor"
            >
              <path d="M9.29 6.71a1 1 0 0 0 0 1.41L12.17 11l-2.88 2.88a1 1 0 1 0 1.41 1.41l3.59-3.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z" />
            </svg>
          </button>
        )}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        id="amenities_modal"
        title={title}
        showHeader={true}
        showFooter={false}
        maxWidth="max-w-md"
        maxHeight="max-h-md"
        bgColor="bg-[var(--color-base-150)]"
      >
        {AmenitiesGroupedListComponent ? (
          <AmenitiesGroupedListComponent
            amenities={safeAmenities}
            lang={lang}
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3">
            {safeAmenities.map((amenity, idx) => {
              return (
                <li
                  key={`${amenity.icon}-${idx}`}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="text-secondary inline-flex h-4 w-4 flex-shrink-0 items-center justify-center">
                    <AppIcon
                      iconName={amenity.icon}
                      folder="amenities"
                      className="text-secondary h-4 w-4"
                    />
                  </span>
                  <span>{translateAmenity(amenity.icon, t)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </Modal>
    </div>
  );
}

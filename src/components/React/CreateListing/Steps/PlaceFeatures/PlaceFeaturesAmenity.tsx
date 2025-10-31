import { useEffect, useMemo, useState, useCallback } from 'react';
import type { Amenity } from '@/types/createListing';
import LoadingSpinner from '@/components/React/Common/LoadingSpinner';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import AppIcon from '@/components/React/Common/AppIcon';
import { translateAmenity } from '@/utils/translateAmenity';

interface Props {
  loading?: boolean;
  amenities: Amenity[];
  value: Amenity[];
  onUpdate: (updatedAmenities: Amenity[]) => void;
  lang?: SupportedLanguages;
}

const GROUP_ORDER = ['Preferred', 'Standout', 'Safety'];

function groupAmenitiesByType(amenities: Amenity[]): Record<string, Amenity[]> {
  return amenities.reduce(
    (acc, amenity) => {
      const group = amenity.amenityGroupType;
      if (!acc[group]) acc[group] = [];
      acc[group].push(amenity);
      return acc;
    },
    {} as Record<string, Amenity[]>
  );
}

export default function PlaceFeaturesAmenity({
  loading,
  amenities = [],
  value = [],
  onUpdate,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  const [selectedIds, setSelectedIds] = useState<number[]>(
    value.map((a) => a.id)
  );

  useEffect(() => {
    setSelectedIds(value.map((a) => a.id));
  }, [value]);

  const groupedAmenities = useMemo(
    () => groupAmenitiesByType(amenities),
    [amenities]
  );

  const toggleAmenity = useCallback(
    (id: number) => {
      const isSelected = selectedIds.includes(id);
      const updatedIds = isSelected
        ? selectedIds.filter((i) => i !== id)
        : [...selectedIds, id];

      setSelectedIds(updatedIds);

      const selectedAmenities = amenities.filter((a) =>
        updatedIds.includes(a.id)
      );
      onUpdate(selectedAmenities);
    },
    [selectedIds, amenities, onUpdate]
  );

  useEffect(() => {
    return () => {
      setSelectedIds([]);
    };
  }, []);

  if (loading) {
    return <LoadingSpinner className="min-h-[50vh]" lang={lang} />;
  }

  if (amenities.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 text-center text-red-500">
        {translate(
          t,
          'createListing.wizardStepContent.placeFeaturesAmenity.noAmenitiesAvailable'
        )}
      </div>
    );
  }

  const renderAmenityGroup = (group: string) => {
    const items = groupedAmenities[group];
    if (!items) return null;

    return (
      <div key={group} className="space-y-4">
        {/* Description */}
        <p className="self-stretch text-lg leading-5 font-semibold text-[var(--color-base-content)]">
          {translate(
            t,
            `createListing.wizardStepContent.placeFeaturesAmenity.groups.description.${group}`
          )}
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((amenity) => {
            const isSelected = selectedIds.includes(amenity.id);
            return (
              <button
                key={amenity.id}
                type="button"
                onClick={() => toggleAmenity(amenity.id)}
                className={`flex h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[30.4px] border px-4 py-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-[var(--color-base-300)] bg-[var(--color-base-150)] text-[var(--color-base-content)]'
                    : 'border-[var(--color-base-300)] bg-[var(--color-base-100)] text-[var(--color-base-content)] hover:border-[var(--color-primary)]'
                }`}
              >
                <AppIcon
                  iconName={amenity.icon}
                  folder="amenities"
                  className="h-8 w-8 text-[var(--color-secondary)]"
                />
                <span className="text-center text-lg leading-7 font-normal">
                  {translateAmenity(amenity.icon, t)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="bg-[var(--color-base-100)] px-4 py-6 sm:px-6 md:mb-10 md:px-16 md:py-0 lg:px-24 xl:px-32 2xl:px-60">
      <div className="mx-auto flex max-w-[800px] flex-col items-start justify-center gap-5 md:gap-10">
        {/* title & description */}
        <div className="flex w-full flex-col items-start space-y-4">
          <h2 className="w-full text-[30px] leading-9 font-bold text-[var(--color-base-content)]">
            {translate(
              t,
              'createListing.wizardStepContent.placeFeaturesAmenity.title'
            )}
          </h2>
          <p className="w-full text-base leading-6 font-normal text-[var(--color-neutral)]">
            {translate(
              t,
              'createListing.wizardStepContent.placeFeaturesAmenity.description'
            )}
          </p>
        </div>

        {/* amenity groups */}
        <div className="w-full space-y-10">
          {GROUP_ORDER.map(renderAmenityGroup)}
        </div>
      </div>
    </section>
  );
}

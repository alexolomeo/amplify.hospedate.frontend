import type { PlaceType } from '@/types/createListing';
import { useCallback } from 'react';
import LoadingSpinner from '@/components/React/Common/LoadingSpinner';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import AppIcon from '@/components/React/Common/AppIcon';
import { translatePlaceType } from '@/utils/translatePlaceType';

interface Props {
  loading?: boolean;
  placeTypes: PlaceType[];
  selectedPlaceTypeId: number;
  onUpdate: (placeTypeId: number) => void;
  lang?: SupportedLanguages;
}

export default function PlaceInformationPlaceType({
  loading,
  placeTypes,
  selectedPlaceTypeId,
  onUpdate,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);

  const handleSelect = useCallback(
    (id: number) => {
      onUpdate(id);
    },
    [onUpdate]
  );

  if (loading) {
    return <LoadingSpinner className="min-h-[50vh]" lang={lang} />;
  }

  if (placeTypes.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 text-center text-red-500">
        {translate(
          t,
          'createListing.wizardStepContent.placeInformationPlaceType.noPlaceTypesAvailable'
        )}
      </div>
    );
  }

  return (
    <section className="flex flex-col justify-center gap-5 bg-[var(--color-base-100)] px-6 py-8 md:gap-10 md:px-0 md:py-[72px]">
      {/* Title */}
      <h2 className="max-w-2xl text-3xl leading-9 font-bold text-[var(--color-base-content)] md:text-[30px] md:leading-[36px]">
        {translate(
          t,
          'createListing.wizardStepContent.placeInformationPlaceType.title'
        )}
      </h2>

      {/* Card grid */}
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {placeTypes.map((property) => {
          const isSelected = selectedPlaceTypeId === property.id;
          return (
            <button
              key={property.id}
              onClick={() => handleSelect(property.id)}
              className={`flex h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-[30.4px] border px-4 py-2 ${
                isSelected
                  ? 'border-[var(--color-base-300)] bg-[var(--color-base-150)] text-[var(--color-base-content)]'
                  : 'border-[var(--color-base-300)] bg-[var(--color-base-100)] text-[var(--color-base-content)] hover:border-[var(--color-primary)]'
              }`}
            >
              <AppIcon
                iconName={property.icon}
                folder="place-types"
                className="h-8 w-8 text-[var(--color-secondary)]"
              />
              <span className="text-center text-lg leading-7 font-normal">
                {translatePlaceType(property.icon, t)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

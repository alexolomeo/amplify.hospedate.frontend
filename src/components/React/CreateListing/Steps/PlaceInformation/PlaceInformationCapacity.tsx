import { useMemo, useCallback } from 'react';
import Counter from '@/components/React/Common/Counter';
import type { PlaceInformation } from '@/types/createListing';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';

type CapacityFields = Pick<
  PlaceInformation,
  'guestNumber' | 'roomNumber' | 'bedNumber' | 'bathNumber'
>;

interface Props {
  value: Partial<CapacityFields>;
  onUpdate: (val: CapacityFields) => void;
  lang?: SupportedLanguages;
}

export default function PlaceInformationCapacity({
  value,
  onUpdate,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  const capacity = useMemo(() => getSafeCapacity(value), [value]);

  const fieldSettings = useMemo(
    (): Record<
      keyof CapacityFields,
      {
        label: string;
        caption?: string;
        step: number;
        min: number;
        max: number;
      }
    > => ({
      guestNumber: {
        label: translate(
          t,
          'createListing.wizardStepContent.placeInformationCapacity.guestNumber'
        ),
        step: 1,
        min: 1,
        max: 16,
      },
      roomNumber: {
        label: translate(
          t,
          'createListing.wizardStepContent.placeInformationCapacity.roomNumber'
        ),
        step: 1,
        min: 0,
        max: 50,
      },
      bedNumber: {
        label: translate(
          t,
          'createListing.wizardStepContent.placeInformationCapacity.bedNumber'
        ),
        step: 1,
        min: 1,
        max: 50,
      },
      bathNumber: {
        label: translate(
          t,
          'createListing.wizardStepContent.placeInformationCapacity.bathNumber'
        ),
        caption: translate(
          t,
          'createListing.wizardStepContent.placeInformationCapacity.bathNumberCaption'
        ),
        step: 0.5,
        min: 0.5,
        max: 50,
      },
    }),
    [t]
  );

  const handleChange = useCallback(
    (field: keyof CapacityFields, newValue: number) => {
      onUpdate({
        ...capacity,
        [field]: newValue,
      });
    },
    [capacity, onUpdate]
  );

  const handleIncrement = useCallback(
    (field: keyof CapacityFields) => {
      const { step, min, max } = fieldSettings[field];
      const current = capacity[field];
      const newValue = calculateNextValue(current, step, min, max, true);
      handleChange(field, newValue);
    },
    [capacity, fieldSettings, handleChange]
  );

  const handleDecrement = useCallback(
    (field: keyof CapacityFields) => {
      const { step, min, max } = fieldSettings[field];
      const current = capacity[field];
      const newValue = calculateNextValue(current, step, min, max, false);
      handleChange(field, newValue);
    },
    [capacity, fieldSettings, handleChange]
  );

  return (
    <section className="bg-[var(--color-base-100)] px-4 py-6 sm:px-6 md:px-12 md:py-20 lg:px-24 xl:px-32 2xl:px-60">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-10">
        {/* left content: title and description */}
        <div className="flex flex-col items-start gap-2 md:max-w-[40%]">
          <h2 className="w-full text-3xl leading-tight font-bold text-[var(--color-base-content)] md:text-3xl xl:text-4xl">
            {translate(
              t,
              'createListing.wizardStepContent.placeInformationCapacity.title'
            )}
          </h2>
          <p className="w-full text-base leading-relaxed font-normal text-[var(--color-neutral)] md:text-base xl:text-lg">
            {translate(
              t,
              'createListing.wizardStepContent.placeInformationCapacity.description'
            )}
          </p>
        </div>

        {/* right content: counter */}
        <div className="grid w-full gap-6 md:max-w-[50%]">
          {(Object.keys(fieldSettings) as (keyof CapacityFields)[]).map(
            (field) => (
              <Counter
                key={field}
                label={fieldSettings[field].label}
                caption={fieldSettings[field].caption}
                value={capacity[field]}
                onIncrement={() => handleIncrement(field)}
                onDecrement={() => handleDecrement(field)}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

function getSafeCapacity(value: Partial<CapacityFields>): CapacityFields {
  return {
    guestNumber: value.guestNumber ?? 1,
    roomNumber: value.roomNumber ?? 0,
    bedNumber: value.bedNumber ?? 1,
    bathNumber: value.bathNumber ?? 0.5,
  };
}

function calculateNextValue(
  current: number,
  step: number,
  min: number,
  max?: number,
  increment = true
): number {
  const newValue = increment
    ? Math.min(current + step, max ?? Infinity)
    : Math.max(current - step, min);
  return parseFloat(newValue.toFixed(1));
}

import React, { useState, useEffect, useCallback } from 'react';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import { useToast } from '../../ToastContext';
import { useDebounce } from '@/components/React/Hooks/useDebounce';

interface Discount {
  weeklyDiscount: number;
  monthlyDiscount: number;
}

interface Props {
  value: Discount;
  onUpdate: (val: Discount) => void;
  lang?: SupportedLanguages;
}

export default function PlaceSetupDiscount({
  value,
  onUpdate,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  const { showToast, hideToast } = useToast();

  const [discount, setDiscount] = useState<Discount>(value);
  const [enabled, setEnabled] = useState({
    weekly: value.weeklyDiscount > 0,
    monthly: value.monthlyDiscount > 0,
  });
  const [hasShownWarning, setHasShownWarning] = useState(false);

  const debouncedDiscount = useDebounce(discount, 500);

  useEffect(() => {
    const updated: Discount = {
      weeklyDiscount: enabled.weekly ? debouncedDiscount.weeklyDiscount : 0,
      monthlyDiscount: enabled.monthly ? debouncedDiscount.monthlyDiscount : 0,
    };

    const isInvalid =
      enabled.weekly &&
      enabled.monthly &&
      updated.weeklyDiscount > 0 &&
      updated.monthlyDiscount > 0 &&
      updated.monthlyDiscount <= updated.weeklyDiscount;

    if (isInvalid && !hasShownWarning) {
      showToast({
        type: 'error',
        message: translate(
          t,
          'createListing.wizardStepContent.placeSetupDiscount.warning'
        ),
      });
      setHasShownWarning(true);
    }

    if (!isInvalid && hasShownWarning) {
      hideToast();
      setHasShownWarning(false);
    }

    if (
      updated.weeklyDiscount !== value.weeklyDiscount ||
      updated.monthlyDiscount !== value.monthlyDiscount
    ) {
      onUpdate(updated);
    }
  }, [
    debouncedDiscount,
    enabled.weekly,
    enabled.monthly,
    value.weeklyDiscount,
    value.monthlyDiscount,
    onUpdate,
    t,
    showToast,
    hideToast,
    hasShownWarning,
  ]);

  const handleValueChange = useCallback(
    (field: keyof Discount, val: number) => {
      if (val < 0 || val > 99) return;
      setDiscount((prev) => ({
        ...prev,
        [field]: Math.floor(val),
      }));
    },
    []
  );

  const toggleCheckbox = useCallback((field: 'weekly' | 'monthly') => {
    setEnabled((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    setDiscount((prev) => ({
      ...prev,
      [`${field}Discount`]: 0,
    }));
  }, []);

  const renderDiscountCard = (
    field: keyof Discount,
    checkboxField: 'weekly' | 'monthly',
    labelKey: string,
    descriptionKey: string
  ) => (
    <div
      key={field}
      className="flex flex-wrap items-start justify-center gap-4 sm:gap-6 md:flex-nowrap md:items-start md:justify-start"
    >
      <div className="flex items-start pt-4">
        <input
          type="checkbox"
          className="checkbox checkbox-primary"
          checked={enabled[checkboxField]}
          onChange={() => toggleCheckbox(checkboxField)}
        />
      </div>

      <div className="relative w-24 flex-shrink-0">
        <input
          type="number"
          placeholder="0"
          className="border-primary inline-block w-full rounded-lg border-1 bg-transparent py-2 pr-6 pl-2 text-3xl leading-9 font-semibold text-[var(--color-secondary)] focus:outline-none disabled:opacity-50"
          value={
            enabled[checkboxField] && discount[field] === 0
              ? ''
              : discount[field]
          }
          min={0}
          max={99}
          disabled={!enabled[checkboxField]}
          onChange={(e) => handleValueChange(field, Number(e.target.value))}
        />
        <span className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 px-2 text-2xl font-semibold text-[var(--color-secondary)]">
          %
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-medium text-[var(--color-base-content)]">
          {translate(
            t,
            `createListing.wizardStepContent.placeSetupDiscount.${labelKey}`
          )}
        </p>
        <p className="text-sm leading-5 text-[var(--color-neutral)]">
          {translate(
            t,
            `createListing.wizardStepContent.placeSetupDiscount.${descriptionKey}`
          )}
        </p>
      </div>
    </div>
  );

  return (
    <section className="flex flex-col gap-6 bg-[var(--color-base-100)] px-4 py-6 sm:px-10 md:flex-row md:items-start md:gap-14 md:py-20 lg:px-24 xl:px-32 2xl:px-60">
      <div className="flex flex-1 flex-col items-start gap-2 md:self-center">
        <h2 className="text-2xl font-bold text-[var(--color-base-content)] sm:text-3xl">
          {translate(
            t,
            'createListing.wizardStepContent.placeSetupDiscount.title'
          )}
        </h2>
        <p className="text-base text-[var(--color-neutral)]">
          {translate(
            t,
            'createListing.wizardStepContent.placeSetupDiscount.description'
          )}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-8">
        {renderDiscountCard(
          'weeklyDiscount',
          'weekly',
          'weeklyLabel',
          'weeklyDescription'
        )}
        {renderDiscountCard(
          'monthlyDiscount',
          'monthly',
          'monthlyLabel',
          'monthlyDescription'
        )}
      </div>
    </section>
  );
}

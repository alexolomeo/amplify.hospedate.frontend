import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import SliderProgress from '@/components/React/Common/SliderProgress';
import Toggle from '@/components/React/Common/ToggleSwitch';
import CollapseCard from '@/components/React/Common/CollapseCard';

import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import {
  MIN_NIGHT_PRICE,
  WEEK_WEEKDAY_NIGHTS,
  WEEK_WEEKEND_NIGHTS,
  MONTH_WEEKDAY_NIGHTS,
  MONTH_WEEKEND_NIGHTS,
  computeBaseTotal,
  applyDiscount,
  clampWeekly,
  clampMonthly,
} from '@/components/React/Utils/priceMath';
import { useDebounce } from '@/components/React/Hooks/useDebounce';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';

import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';

import { toPriceForm } from '@/components/React/Utils/edit-listing/content/YourPlace/price/priceAdapters';
import { usePriceForm } from '@/components/React/Utils/edit-listing/content/YourPlace/price/usePriceForm';
import { createPriceController } from '@/components/React/Utils/edit-listing/content/YourPlace/price/PriceController';
import {
  validatePriceForm,
  type PriceValidationMessages,
} from '@/components/React/Utils/edit-listing/content/YourPlace/price/priceValidators';
import { handleIntegerKeydown } from '@/utils/preventNonNumeric';

type Props = {
  lang?: SupportedLanguages;
  className?: string;
  initialValues: ListingEditorValues | null;
  onRegisterController: (ctrl: SectionController | null) => () => void;
};

const intFrom = (s: string): number =>
  /^\d+$/.test(s.trim()) ? Number(s) : Number.NaN;

export default function EditPrice({
  lang = 'es',
  className = '',
  initialValues,
  onRegisterController,
}: Props) {
  const t = getTranslation(lang);
  const tt = t.hostContent.editListing.content.editPrice;
  const { isReadOnly } = useEditability();

  // ---- Validations ----
  const messages = useMemo<PriceValidationMessages>(
    () => ({
      requiredNight: tt.validation.requiredNight,
      integerOnly: tt.validation.integerOnly,
      minNight: tt.minNightPriceHint,
      maxNight: tt.validation.maxNightPriceHint,
      minWeekend: tt.validation.minWeekendPriceHint,
      maxWeekend: tt.validation.maxWeekendPriceHint,
      discountsRuleHint: tt.discountsRuleHint,
    }),
    [
      tt.validation.requiredNight,
      tt.validation.integerOnly,
      tt.minNightPriceHint,
      tt.validation.maxNightPriceHint,
      tt.validation.minWeekendPriceHint,
      tt.validation.maxWeekendPriceHint,
      tt.discountsRuleHint,
    ]
  );

  // ---- Adapter: values -> form ----
  const initialForm = useMemo(
    () => toPriceForm(initialValues),
    [initialValues]
  );

  // ---- Form state ----
  const {
    form,
    isDirty,
    reset,
    getNormalized,
    setNightRaw,
    setWeekendEnabled,
    setWeekendRaw,
    setDiscountsEnabled,
    setWeeklyPct,
    setMonthlyPct,
  } = usePriceForm(initialForm);

  // ---- Server errors ----
  const [externalErrors, setExternalErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const getIsValid = useMemo(() => {
    return () => validatePriceForm(form, messages).ok;
  }, [form, messages]);

  // ===== Controller  =====
  const controller = useMemo<SectionController>(() => {
    return createPriceController({
      slug: 'price',
      readOnly: isReadOnly,
      getNormalized,
      isDirty: () => isDirty,
      reset,
      setExternalErrors,
      getIsValid,
    });
  }, [
    isReadOnly,
    getNormalized,
    isDirty,
    reset,
    setExternalErrors,
    getIsValid,
  ]);

  useEffect(() => {
    const cleanup = onRegisterController(controller);
    return cleanup;
  }, [controller, onRegisterController]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const clientValidation = useMemo(
    () => validatePriceForm(form, messages),
    [form, messages]
  );
  const clientErrors = clientValidation.ok ? null : clientValidation.errors;
  const mergedErrors = externalErrors ?? clientErrors;

  const nightInt = useMemo(() => intFrom(form.nightRaw), [form.nightRaw]);
  const weekendInt = useMemo(
    () => (form.weekendEnabled ? intFrom(form.weekendRaw) : null),
    [form.weekendEnabled, form.weekendRaw]
  );

  const dNightInt = useDebounce(nightInt, 150);
  const dWeekendInt = useDebounce(weekendInt, 150);
  const dWeeklyPct = useDebounce(form.weeklyPct, 100);
  const dMonthlyPct = useDebounce(form.monthlyPct, 100);

  const canCompute =
    form.discountsEnabled &&
    Number.isInteger(dNightInt as number) &&
    (dNightInt as number) >= MIN_NIGHT_PRICE;

  const weekendVal =
    form.weekendEnabled && Number.isInteger(dWeekendInt as number)
      ? (dWeekendInt as number)
      : 0;

  const weeklyDisplayValue = useMemo(() => {
    if (!canCompute) return undefined;
    const base = computeBaseTotal(
      dNightInt as number,
      form.weekendEnabled,
      weekendVal,
      WEEK_WEEKDAY_NIGHTS,
      WEEK_WEEKEND_NIGHTS
    );
    return base == null ? undefined : applyDiscount(base, dWeeklyPct ?? 0);
  }, [canCompute, dNightInt, form.weekendEnabled, weekendVal, dWeeklyPct]);

  const monthlyDisplayValue = useMemo(() => {
    if (!canCompute) return undefined;
    const base = computeBaseTotal(
      dNightInt as number,
      form.weekendEnabled,
      weekendVal,
      MONTH_WEEKDAY_NIGHTS,
      MONTH_WEEKEND_NIGHTS
    );
    return base == null ? undefined : applyDiscount(base, dMonthlyPct ?? 0);
  }, [canCompute, dNightInt, form.weekendEnabled, weekendVal, dMonthlyPct]);

  const [discountRuleMsg, setDiscountRuleMsg] = useState('');
  useEffect(() => {
    if (!form.discountsEnabled) setDiscountRuleMsg('');
  }, [form.discountsEnabled]);

  return (
    <section className={clsx('flex flex-col gap-8 px-1', className)}>
      <div className="flex flex-col gap-2">
        <h2 className="text-base-content text-xl font-bold">{tt.stepTitle}</h2>
        <p className="text-neutral text-sm">{tt.description}</p>
      </div>

      {/* Nightly */}
      <CollapseCard
        title={tt.nightlyTitle}
        forceOpen={!isReadOnly && Boolean(mergedErrors?.nightRaw)}
      >
        <p className="text-neutral mb-4 text-sm">{tt.nightlyDescription}</p>
        <input
          type="number"
          className="input focus:border-primary text-base-content w-full rounded-full px-4 py-2 text-left text-base font-semibold outline-none focus:ring-0 focus:outline-none"
          value={form.nightRaw}
          onChange={(e) => {
            if (isReadOnly) return;
            setExternalErrors(null);
            setNightRaw(e.target.value);
          }}
          inputMode="numeric"
          onKeyDown={handleIntegerKeydown}
          readOnly={isReadOnly}
          aria-readonly={isReadOnly}
          aria-invalid={!isReadOnly && Boolean(mergedErrors?.nightRaw)}
          aria-describedby={
            !isReadOnly && mergedErrors?.nightRaw ? 'night-error' : undefined
          }
        />
        {!isReadOnly && mergedErrors?.nightRaw && (
          <p id="night-error" className="text-error mt-2 text-xs">
            {mergedErrors.nightRaw}
          </p>
        )}
      </CollapseCard>

      {/* Weekend */}
      <CollapseCard
        title={tt.weekendTitle}
        forceOpen={
          form.weekendEnabled ||
          (!isReadOnly && Boolean(mergedErrors?.weekendRaw))
        }
      >
        <Toggle
          description={tt.weekendToggleTitle}
          checked={form.weekendEnabled}
          onChange={(enabled) => {
            if (isReadOnly) return;
            setExternalErrors(null);
            setWeekendEnabled(enabled);
          }}
          disabled={isReadOnly}
        />

        {form.weekendEnabled && (
          <>
            <input
              type="number"
              className="input focus:border-primary text-base-content mt-4 w-full rounded-full px-4 py-2 text-left text-base font-semibold outline-none focus:ring-0 focus:outline-none"
              value={form.weekendRaw}
              onChange={(e) => {
                if (isReadOnly) return;
                setExternalErrors(null);
                setWeekendRaw(e.target.value);
              }}
              inputMode="numeric"
              onKeyDown={handleIntegerKeydown}
              readOnly={isReadOnly}
              aria-readonly={isReadOnly}
              aria-invalid={!isReadOnly && Boolean(mergedErrors?.weekendRaw)}
              aria-describedby={
                !isReadOnly && mergedErrors?.weekendRaw
                  ? 'weekend-error'
                  : undefined
              }
            />
            {!isReadOnly && mergedErrors?.weekendRaw && (
              <p id="weekend-error" className="text-error mt-2 text-xs">
                {mergedErrors.weekendRaw}
              </p>
            )}
          </>
        )}
      </CollapseCard>

      {/* Discounts */}
      <CollapseCard
        title={tt.discountsTitle}
        forceOpen={form.discountsEnabled || (!!discountRuleMsg && !isReadOnly)}
      >
        <Toggle
          title={tt.discountsTitle}
          description={tt.discountsDescription}
          checked={form.discountsEnabled}
          onChange={(enabled) => {
            if (isReadOnly) return;
            setExternalErrors(null);
            setDiscountsEnabled(enabled);
            if (!enabled) setDiscountRuleMsg('');
            if (enabled) {
              // Garantiza inmediatamente monthly ≥ weekly en la UI
              setMonthlyPct(Math.max(form.monthlyPct, form.weeklyPct));
            }
          }}
          disabled={isReadOnly}
        />

        {form.discountsEnabled && (
          <div className="mt-4 flex flex-col gap-6">
            <div>
              <p className="mb-1 font-bold">{tt.weekly}</p>
              <p className="text-neutral text-sm">{tt.weeklyHint}</p>
              {mounted ? (
                <SliderProgress
                  value={form.weeklyPct}
                  onChange={(pct) => {
                    if (isReadOnly) return;
                    setExternalErrors(null);
                    const target = Math.max(0, Math.min(100, Math.round(pct)));
                    const clamped = clampWeekly(target, form.monthlyPct);
                    setWeeklyPct(clamped);
                    setDiscountRuleMsg(
                      clamped !== target ? messages.discountsRuleHint : ''
                    );
                  }}
                  displayValue={weeklyDisplayValue}
                  displayUnit={weeklyDisplayValue != null ? 'Bs' : undefined}
                  disabled={isReadOnly || !canCompute}
                />
              ) : (
                <div />
              )}
            </div>

            <div>
              <p className="mb-1 font-bold">{tt.monthly}</p>
              <p className="text-neutral text-sm">{tt.monthlyHint}</p>
              {mounted ? (
                <SliderProgress
                  value={form.monthlyPct}
                  onChange={(pct) => {
                    if (isReadOnly) return;
                    setExternalErrors(null);
                    const target = Math.max(0, Math.min(100, Math.round(pct)));
                    const clamped = clampMonthly(target, form.weeklyPct);
                    setMonthlyPct(clamped);
                    setDiscountRuleMsg(
                      clamped !== target ? messages.discountsRuleHint : ''
                    );
                  }}
                  displayValue={monthlyDisplayValue}
                  displayUnit={monthlyDisplayValue != null ? 'Bs' : undefined}
                  disabled={isReadOnly || !canCompute}
                />
              ) : (
                <div />
              )}
            </div>

            {!!discountRuleMsg && !isReadOnly && (
              <p
                className="text-error mt-1 text-center text-sm"
                role="alert"
                aria-live="polite"
              >
                {discountRuleMsg}
              </p>
            )}
          </div>
        )}
      </CollapseCard>
    </section>
  );
}

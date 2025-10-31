import { useEffect, useMemo, useState } from 'react';
import CollapseCard from '@/components/React/Common/CollapseCard';
// import SelectField from '@/components/React/Common/SelectField';
// import ToggleSwitch from '@/components/React/Common/ToggleSwitch';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';

import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { CatalogsSelectors } from '@/components/React/Hooks/Host/EditListing/useEditListing';

import {
  validateAvailabilityForm,
  type AvailabilityValidationMessages,
  //type NoticeKey,
} from '@/components/React/Utils/edit-listing/content/YourPlace/availability/availabilityValidators';

import { toAvailabilityForm } from '@/components/React/Utils/edit-listing/content/YourPlace/availability/availabilityAdapters';
import { useAvailabilityForm } from '@/components/React/Utils/edit-listing/content/YourPlace/availability/useAvailabilityForm';
import { createAvailabilityController } from '@/components/React/Utils/edit-listing/content/YourPlace/availability/AvailabilityController';
import { handleIntegerKeydown } from '@/utils/preventNonNumeric';

type Props = {
  lang?: SupportedLanguages;
  initialValues: ListingEditorValues | null;
  selectors: CatalogsSelectors;
  onRegisterController: (ctrl: SectionController | null) => () => void;
};

export default function EditAvailability({
  lang = 'es',
  selectors,
  initialValues,
  onRegisterController,
}: Props) {
  const t = getTranslation(lang);
  const { isReadOnly } = useEditability();

  const i18n = t.hostContent.editListing.content.editAvailability;

  // Mapa clave→label para el select de notice
  // const noticeLabelMap = useMemo(
  //   () => i18n.noticeOptions,
  //   [i18n.noticeOptions]
  // );

  // Mensaje “sin aviso” (fallback si no existe en i18n)
  // const noneLabel = i18n.noticePeriod?.noneOption ?? '— Sin aviso —';

  // ---- Mensajes de validación (notice requerido eliminado)
  const messages = useMemo<AvailabilityValidationMessages>(
    () => ({
      tripDuration: {
        integerOnly: i18n.validation.integerOnly,
        min: {
          required: i18n.validation.min.required,
          atLeast1: i18n.validation.min.atLeast1,
          lteMax: (max: number) =>
            i18n.validation.min.lteMax.replace('{max}', String(max)),
        },
        max: {
          required: i18n.validation.max.required,
          gteMin: (min: number) =>
            i18n.validation.max.gteMin.replace('{min}', String(min)),
          lte730: i18n.validation.max.lte730,
        },
      },
      notice: {
        // Solo aplica si SAME_DAY
        cutoffRequired: i18n.validation.notice.cutoffRequired,
      },
    }),
    [i18n.validation]
  );

  // ---- Adapter: values -> form
  const initialForm = useMemo(
    () => toAvailabilityForm(initialValues, selectors),
    [initialValues, selectors]
  );

  // ---- Form hook
  const {
    form,
    isDirty,
    reset,
    setMinNightsRaw,
    setMaxNightsRaw,
    //setNoticeKey,
    // setSameDayCutoffLabel,
    // setAllowRequestSameDay,
  } = useAvailabilityForm(initialForm);

  // Errores de servidor
  const [externalErrors, setExternalErrors] = useState<Record<
    string,
    string
  > | null>(null);

  // Validez para controller
  const getIsValid = useMemo(() => {
    return () => validateAvailabilityForm(form, messages).ok;
  }, [form, messages]);

  // ---- Controller
  const controller = useMemo<SectionController>(() => {
    return createAvailabilityController({
      slug: 'availability',
      readOnly: isReadOnly,
      form,
      isDirty: () => isDirty,
      reset,
      messages,
      setExternalErrors,
      getIsValid,
      selectors,
    });
  }, [
    isReadOnly,
    form,
    isDirty,
    reset,
    messages,
    setExternalErrors,
    getIsValid,
    selectors,
  ]);

  useEffect(() => {
    const cleanup = onRegisterController(controller);
    return cleanup;
  }, [controller, onRegisterController]);

  // ---- Validación cliente para pintar errores
  const clientValidation = useMemo(
    () => validateAvailabilityForm(form, messages),
    [form, messages]
  );
  const clientErrors = clientValidation.ok ? null : clientValidation.errors;
  const mergedErrors = externalErrors ?? clientErrors;

  // ---- Opciones de notice con “sin aviso”
  // const noticeOptions: string[] = useMemo(
  //   () => [noneLabel, ...Object.values(noticeLabelMap)],
  //   [noticeLabelMap, noneLabel]
  // );

  // Valor visible del select de notice
  // const noticeValueLabel = useMemo<string>(() => {
  //   if (!form.noticeKey) return noneLabel;
  //   return noticeLabelMap[form.noticeKey] ?? noneLabel;
  // }, [form.noticeKey, noticeLabelMap, noneLabel]);

  // onChange de notice que permite limpiar a “sin aviso”
  // const onNoticeChange = (label: string) => {
  //   if (isReadOnly) return;
  //   setExternalErrors(null);

  //   if (label === noneLabel) {
  //     setNoticeKey(null);
  //     setSameDayCutoffLabel(null);
  //     setAllowRequestSameDay(false);
  //     return;
  //   }

  // const entry = Object.entries(noticeLabelMap).find(([, v]) => v === label);
  // const key = (entry?.[0] ?? null) as NoticeKey | null;

  //   setSameDayCutoffLabel(null);
  //   setNoticeKey(key);
  // };

  // Opciones para cutoff (solo se usa cuando SAME_DAY)
  // const cutoffOptions: string[] = useMemo(
  //   () => selectors.sameDayAdvanceNoticeTimes.map((c) => c.name),
  //   [selectors.sameDayAdvanceNoticeTimes]
  // );

  // const isSameDaySelected = form.noticeKey === 'SAME_DAY';
  // const noticeSelected = form.noticeKey !== null;

  return (
    <div className="flex flex-col gap-8 px-1">
      <div className="flex flex-col gap-2">
        <h1 className="text-base-content text-lg font-bold">
          {i18n.stepTitle}
        </h1>
        <p className="text-neutral text-sm">{i18n.description}</p>
      </div>

      {/* Duración de la estadía */}
      <CollapseCard title={i18n.stayDuration.title}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-base-content mb-1 block text-sm">
              {i18n.stayDuration.minNights}
            </label>
            <input
              type="number"
              value={form.minNightsRaw}
              onChange={(e) => {
                if (isReadOnly) return;
                setExternalErrors(null);
                setMinNightsRaw(e.target.value);
              }}
              className="input focus:border-primary w-full rounded-full text-base font-semibold outline-none focus:ring-0 focus:outline-none"
              inputMode="numeric"
              onKeyDown={handleIntegerKeydown}
              readOnly={isReadOnly}
              aria-readonly={isReadOnly}
              aria-invalid={!isReadOnly && Boolean(mergedErrors?.minNightsRaw)}
              aria-describedby={
                !isReadOnly && mergedErrors?.minNightsRaw
                  ? 'min-error'
                  : undefined
              }
            />
            {!isReadOnly && mergedErrors?.minNightsRaw && (
              <p id="min-error" className="text-error mt-2 text-sm">
                {mergedErrors.minNightsRaw}
              </p>
            )}
          </div>

          <div>
            <label className="text-base-content mb-1 block text-sm">
              {i18n.stayDuration.maxNights}
            </label>
            <input
              type="number"
              value={form.maxNightsRaw}
              onChange={(e) => {
                if (isReadOnly) return;
                setExternalErrors(null);
                setMaxNightsRaw(e.target.value);
              }}
              className="input focus:border-primary w-full rounded-full text-base font-semibold outline-none focus:ring-0 focus:outline-none"
              inputMode="numeric"
              onKeyDown={handleIntegerKeydown}
              readOnly={isReadOnly}
              aria-readonly={isReadOnly}
              aria-invalid={!isReadOnly && Boolean(mergedErrors?.maxNightsRaw)}
              aria-describedby={
                !isReadOnly && mergedErrors?.maxNightsRaw
                  ? 'max-error'
                  : undefined
              }
            />
            {!isReadOnly && mergedErrors?.maxNightsRaw && (
              <p id="max-error" className="text-error mt-2 text-sm">
                {mergedErrors.maxNightsRaw}
              </p>
            )}
          </div>
        </div>
      </CollapseCard>

      {/* Periodo de aviso (opcional) */}
      {/* <CollapseCard title={i18n.noticePeriod.title}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-base-content mb-1 block text-sm">
              {i18n.noticePeriod.selectLabel}
            </label>
            <SelectField
              options={noticeOptions}
              value={noticeValueLabel}
              onChange={onNoticeChange}
              disabled={isReadOnly}
            />
          </div>

          {isSameDaySelected && (
            <div>
              <label className="text-base-content mb-1 block text-sm">
                {i18n.noticePeriod.cutoffLabel}
              </label>
              <SelectField
                options={cutoffOptions}
                value={form.sameDayCutoffLabel ?? ''}
                onChange={(v) => {
                  if (isReadOnly) return;
                  setExternalErrors(null);
                  setSameDayCutoffLabel(v || null);
                }}
                disabled={isReadOnly || !noticeSelected}
              />
              {!isReadOnly && mergedErrors?.sameDayCutoffLabel && (
                <p className="text-error mt-2 text-sm">
                  {mergedErrors.sameDayCutoffLabel}
                </p>
              )}
            </div>
          )}

          <ToggleSwitch
            title={i18n.sameDayToggleLabel}
            description={i18n.sameDayToggleDescription}
            checked={form.allowRequestSameDay}
            onChange={(checked) => {
              if (isReadOnly) return;
              setExternalErrors(null);
              setAllowRequestSameDay(checked);
            }}
            disabled={isReadOnly || !noticeSelected}
          />
        </div>
      </CollapseCard> */}
    </div>
  );
}

// @/components/React/Host/EditListing/Content/YourPlace/EditCapacity.tsx
import { useEffect, useMemo, useState } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import DropdownV2, { type Option } from '@/components/React/Common/DropdownV2';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';

import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';

import { toCapacityForm } from '@/components/React/Utils/edit-listing/content/YourPlace/capacity/capacityAdapters';
import { useCapacityForm } from '@/components/React/Utils/edit-listing/content/YourPlace/capacity/useCapacityForm';
import { createCapacityController } from '@/components/React/Utils/edit-listing/content/YourPlace/capacity/CapacityController';
import {
  validateCapacityForm,
  type CapacityValidationMessages,
  type CapacityRules,
} from '@/components/React/Utils/edit-listing/content/YourPlace/capacity/capacityValidators';

type Props = {
  lang?: SupportedLanguages;
  initialValues: ListingEditorValues | null;
  onRegisterController: (ctrl: SectionController | null) => () => void;
};

export default function EditCapacity({
  lang = 'es',
  initialValues,
  onRegisterController,
}: Props) {
  const t = getTranslation(lang);
  const { isReadOnly } = useEditability();

  // Labels i18n
  const labels = useMemo(
    () => t.hostContent.editListing.content.editCapacity.options as string[],
    [t]
  );

  // Opciones 1..N (N = labels.length)
  const options = useMemo<Option<number>[]>(() => {
    return labels.map((label, idx) => ({ value: idx + 1, label }));
  }, [labels]);

  // Reglas de validación derivadas de options
  const rules = useMemo<CapacityRules>(() => {
    const max = Math.max(1, options.length || 1);
    return { min: 1, max };
  }, [options.length]);

  // Mensajes i18n
  const messages = useMemo<CapacityValidationMessages>(
    () => ({
      required:
        t.hostContent.editListing.content.editCapacity.validation.required,
      min: t.hostContent.editListing.content.editCapacity.validation.min,
      max: t.hostContent.editListing.content.editCapacity.validation.max,
    }),
    [
      t.hostContent.editListing.content.editCapacity.validation.required,
      t.hostContent.editListing.content.editCapacity.validation.min,
      t.hostContent.editListing.content.editCapacity.validation.max,
    ]
  );

  // Adapter: values -> form (clamp según reglas)
  const initialForm = useMemo(
    () => toCapacityForm(initialValues, rules),
    [initialValues, rules]
  );

  // Estado local + dirty + reset
  const { form, isDirty, reset, setPeople } = useCapacityForm(initialForm);

  // Errores de servidor
  const [externalErrors, setExternalErrors] = useState<Record<
    string,
    string
  > | null>(null);

  // Validez pura (para controller/orquestador)
  const getIsValid = useMemo(() => {
    return () => validateCapacityForm(form, messages, rules).ok;
  }, [form, messages, rules]);

  // Controller recreable (como Title/Price)
  const controller = useMemo<SectionController>(() => {
    return createCapacityController({
      slug: 'capacity',
      readOnly: isReadOnly,
      form,
      isDirty: () => isDirty,
      reset,
      messages,
      rules,
      setExternalErrors,
      getIsValid,
    });
  }, [
    isReadOnly,
    form,
    isDirty,
    reset,
    messages,
    rules,
    setExternalErrors,
    getIsValid,
  ]);

  useEffect(() => {
    const cleanup = onRegisterController(controller);
    return cleanup;
  }, [controller, onRegisterController]);

  // Validación cliente para pintar UI (si quisieras mostrar algún hint)
  const clientValidation = useMemo(
    () => validateCapacityForm(form, messages, rules),
    [form, messages, rules]
  );
  const clientErrors = clientValidation.ok ? null : clientValidation.errors;
  const mergedErrors = externalErrors ?? clientErrors;

  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-8 self-stretch pb-30">
      <div className="flex flex-col items-start gap-8 self-stretch">
        <h2 className="text-base-content w-full text-lg leading-7 font-bold">
          {t.hostContent.editListing.content.editCapacity.stepTitle}
        </h2>

        <div className="w-full">
          <DropdownV2<number>
            options={options}
            value={form.people}
            onChange={(val) => {
              if (isReadOnly) return;
              setExternalErrors(null);
              // nunca aceptamos null en este selector
              setPeople(val ?? rules.min);
            }}
            className="w-full"
            buttonHeight="h-[64px]"
            labelFontSize="text-lg"
            lang={lang}
            disabled={isReadOnly}
          />
          {/* Ejemplo opcional de error visual (si quieres mostrarlo bajo el dropdown) */}
          {!isReadOnly && mergedErrors?.people && (
            <p className="text-error mt-2 text-sm">{mergedErrors.people}</p>
          )}
        </div>
      </div>
    </div>
  );
}

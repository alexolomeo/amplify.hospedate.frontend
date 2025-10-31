import { useEffect, useMemo, useState } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';

import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import { toDirectionsForm } from '@/components/React/Utils/edit-listing/content/ArrivalGuide/directions/directionsAdapters';
import {
  DIRECTIONS_MAX_CHARS,
  validateDirectionsForm,
  type DirectionsValidationMessages,
} from '@/components/React/Utils/edit-listing/content/ArrivalGuide/directions/directionsValidators';
import { useDirectionsForm } from '@/components/React/Utils/edit-listing/content/ArrivalGuide/directions/useDirectionsForm';
import { createDirectionsController } from '@/components/React/Utils/edit-listing/content/ArrivalGuide/directions/DirectionsController';

type Props = {
  lang?: SupportedLanguages;
  initialDirections?: string;
  onRegisterController: (ctrl: SectionController | null) => () => void;
};

export default function EditDirections({
  lang = 'es',
  initialDirections = '',
  onRegisterController,
}: Props) {
  const t = getTranslation(lang);
  const { isReadOnly } = useEditability();

  const messages: DirectionsValidationMessages = useMemo(
    () => ({
      max: t.hostContent.editListing.content.editDirections.validation.max,
    }),
    [t]
  );

  const initialForm = useMemo(
    () => toDirectionsForm(initialDirections),
    [initialDirections]
  );

  const { form, isDirty, reset, setText } = useDirectionsForm(initialForm);

  const [externalErrors, setExternalErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const getIsValid = useMemo(() => {
    return () => validateDirectionsForm(form, messages).ok;
  }, [form, messages]);

  const controller = useMemo<SectionController>(() => {
    return createDirectionsController({
      slug: 'directions',
      readOnly: isReadOnly,
      form,
      isDirty: () => isDirty,
      reset,
      messages,
      setExternalErrors,
      getIsValid,
    });
  }, [
    isReadOnly,
    form,
    isDirty,
    reset,
    messages,
    setExternalErrors,
    getIsValid,
  ]);

  useEffect(() => {
    const cleanup = onRegisterController(controller);
    return cleanup;
  }, [controller, onRegisterController]);

  const clientValidation = useMemo(
    () => validateDirectionsForm(form, messages),
    [form, messages]
  );
  const clientErrors = clientValidation.ok ? null : clientValidation.errors;
  const mergedErrors = externalErrors ?? clientErrors;

  const titleId = 'edit-directions-title';

  return (
    <div className="bg-base-100 flex flex-1 flex-col items-start gap-8 px-1 pb-20">
      <h2
        id={titleId}
        className="text-base-content text-lg leading-7 font-bold"
      >
        {t.hostContent.editListing.content.editDirections.title}
      </h2>

      <textarea
        rows={6}
        className="edit-listing-text-area w-full text-base"
        placeholder={
          t.hostContent.editListing.content.editDirections.placeholder
        }
        value={form.text}
        onChange={(e) => {
          if (isReadOnly) return;
          setExternalErrors(null);
          setText(e.target.value);
        }}
        readOnly={isReadOnly}
        aria-labelledby={titleId}
        maxLength={DIRECTIONS_MAX_CHARS}
        aria-invalid={!isReadOnly && Boolean(mergedErrors?.['directions.text'])}
      />
      {!isReadOnly && mergedErrors?.['directions.text'] && (
        <p className="text-error text-sm">{mergedErrors['directions.text']}</p>
      )}
    </div>
  );
}

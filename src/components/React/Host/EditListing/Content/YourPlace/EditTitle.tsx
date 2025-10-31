import { useEffect, useMemo, useState } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';

import { useTitleForm } from '@/components/React/Utils/edit-listing/content/YourPlace/title/useTitleForm';
import { createTitleController } from '@/components/React/Utils/edit-listing/content/YourPlace/title/TitleController';
import { toTitleForm } from '@/components/React/Utils/edit-listing/content/YourPlace/title/titleAdapters';
import type { TitleValidationMessages } from '@/components/React/Utils/edit-listing/content/YourPlace/title/titleValidators';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';

type Props = {
  lang?: SupportedLanguages;
  initialValues: ListingEditorValues | null;
  onRegisterController: (ctrl: SectionController | null) => void;
};

export default function EditTitle({
  lang = 'es',
  initialValues,
  onRegisterController,
}: Props) {
  const t = getTranslation(lang);
  const { isReadOnly } = useEditability();

  // Validations
  const messages = useMemo<TitleValidationMessages>(
    () => ({
      required: t.hostContent.editListing.content.editTitle.validation.required,
      maxLength:
        t.hostContent.editListing.content.editTitle.validation.maxLength,
    }),
    [
      t.hostContent.editListing.content.editTitle.validation.required,
      t.hostContent.editListing.content.editTitle.validation.maxLength,
    ]
  );

  // Adapter: values -> form
  const initialForm = useMemo(
    () => toTitleForm(initialValues),
    [initialValues]
  );

  // Local & dirty state
  const { form, setTitle, isDirty, reset } = useTitleForm(initialForm);

  // Backend errors
  const [externalError, setExternalError] = useState<string | null>(null);

  const getIsValid = useMemo(() => {
    return () => {
      const trimmed = form.title.trim();
      if (trimmed.length === 0) return false;
      if (trimmed.length > 50) return false;
      return true;
    };
  }, [form.title]);

  // Controller
  const controller = useMemo<SectionController>(() => {
    return createTitleController({
      slug: 'title',
      readOnly: isReadOnly,
      form,
      isDirty: () => isDirty,
      reset,
      messages,
      setExternalError,
      getIsValid,
    });
  }, [
    isReadOnly,
    form,
    isDirty,
    reset,
    messages,
    setExternalError,
    getIsValid,
  ]);

  // Registro y cleanup del controller (para watchers)
  useEffect(() => {
    const cleanup = onRegisterController(controller);
    return cleanup;
  }, [controller, onRegisterController]);

  // UI handlers
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (isReadOnly) return;
    setExternalError(null);
    setTitle(e.target.value);
  };

  const trimmed = form.title.trim();
  const localError =
    trimmed.length === 0
      ? messages.required
      : trimmed.length > 50
        ? messages.maxLength
        : null;

  // Si hay error de servidor, lo mostramos con prioridad
  const errorToShow = externalError ?? localError;

  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-8 self-stretch pb-30">
      <div className="flex flex-col items-start gap-8 self-stretch">
        <h2 className="text-base-content w-full text-lg leading-7 font-bold">
          {t.hostContent.editListing.content.editTitle.stepTitle}
        </h2>

        <div className="flex w-full flex-col items-start self-stretch">
          <input
            value={form.title}
            onChange={onChange}
            readOnly={isReadOnly}
            aria-readonly={isReadOnly}
            placeholder={
              t.hostContent.editListing.content.editTitle.placeholder
            }
            className="input input-lg focus:border-primary h-16 min-h-16 w-full rounded-full leading-6 focus:ring-0 focus:outline-none"
            aria-invalid={!isReadOnly && errorToShow !== null}
            aria-describedby={
              !isReadOnly && errorToShow ? 'title-error' : undefined
            }
          />
          {!isReadOnly && errorToShow && (
            <p id="title-error" className="text-error mt-2 text-sm">
              {errorToShow}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import CollapseCard from '@/components/React/Common/CollapseCard';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';

import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';

import {
  LISTING_MAX_CHARS,
  validateDescriptionForm,
  type DescriptionValidationMessages,
} from '@/components/React/Utils/edit-listing/content/YourPlace/description/descriptionValidators';

import { toDescriptionForm } from '@/components/React/Utils/edit-listing/content/YourPlace/description/descriptionAdapters';
import { useDescriptionForm } from '@/components/React/Utils/edit-listing/content/YourPlace/description/useDescriptionForm';
import { createDescriptionController } from '@/components/React/Utils/edit-listing/content/YourPlace/description/DescriptionController';

type Props = {
  lang?: SupportedLanguages;
  initialValues: ListingEditorValues | null;
  onRegisterController: (ctrl: SectionController | null) => () => void;
};

export default function EditDescription({
  lang = 'es',
  initialValues,
  onRegisterController,
}: Props) {
  const t = getTranslation(lang);
  const { isReadOnly } = useEditability();
  const ed = t.hostContent.editListing.content.editDescription;

  // Validations
  const messages = useMemo<DescriptionValidationMessages>(
    () => ({
      listing: {
        required: ed.spaceSection.validation.required,
        max: ed.spaceSection.validation.max,
      },
      property: {
        max: ed.propertySection.validation.max,
      },
      access: {
        max: ed.guestExperience.access.validation.max,
      },
      interaction: {
        max: ed.guestExperience.interaction.validation.max,
      },
      highlights: {
        max: ed.guestExperience.highlights.validation.max,
      },
    }),
    [ed]
  );

  // Adapter: values -> form
  const initialForm = useMemo(
    () => toDescriptionForm(initialValues),
    [initialValues]
  );

  //  local + dirty + reset
  const {
    form,
    isDirty,
    reset,
    setListingDescription,
    setPropertyDescription,
    setAreasDescription,
    setInteractionDescription,
    setAdditionalNotes,
  } = useDescriptionForm(initialForm);

  // server errors
  const [externalErrors, setExternalErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const getIsValid = useMemo(() => {
    return () => validateDescriptionForm(form, messages).ok;
  }, [form, messages]);

  // Controller
  const controller = useMemo<SectionController>(() => {
    return createDescriptionController({
      slug: 'description',
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
    () => validateDescriptionForm(form, messages),
    [form, messages]
  );
  const clientErrors = clientValidation.ok ? null : clientValidation.errors;
  const mergedErrors = externalErrors ?? clientErrors;

  const remainingListing = Math.max(
    0,
    LISTING_MAX_CHARS - form.listingDescription.length
  );

  return (
    <section className="flex flex-col gap-8 px-1">
      <h2 className="text-base-content text-xl font-bold">{ed.stepTitle}</h2>

      {/* SPACE (listingDescription) */}
      <CollapseCard title={ed.spaceSection.title}>
        <div className="flex flex-col gap-4 px-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="desc-space"
              className="text-sm font-semibold text-[var(--color-base-content)]"
            >
              {ed.spaceSection.label}
            </label>

            <textarea
              id="desc-space"
              rows={3}
              className="edit-listing-text-area text-sm"
              placeholder={ed.spaceSection.placeholder}
              value={form.listingDescription}
              onChange={(e) => {
                if (isReadOnly) return;
                setExternalErrors(null);
                setListingDescription(e.target.value);
              }}
              maxLength={LISTING_MAX_CHARS}
              aria-describedby="space-char-counter"
              readOnly={isReadOnly}
              aria-readonly={isReadOnly}
              aria-invalid={
                !isReadOnly && Boolean(mergedErrors?.listingDescription)
              }
            />
            <p
              id="space-char-counter"
              className="text-right text-xs text-[var(--color-neutral)]"
              role="status"
              aria-live="polite"
            >
              {remainingListing} {ed.charactersAvailable}
            </p>
            {!isReadOnly && mergedErrors?.listingDescription && (
              <p className="text-error mt-2 text-sm">
                {mergedErrors.listingDescription}
              </p>
            )}
          </div>

          {/* PROPERTY (propertyDescription) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="desc-property"
              className="text-sm font-semibold text-[var(--color-base-content)]"
            >
              {ed.propertySection.title}
            </label>
            <p className="text-sm text-[var(--color-neutral)]">
              {ed.propertySection.description}
            </p>
            <textarea
              id="desc-property"
              rows={3}
              className="edit-listing-text-area text-sm"
              placeholder={ed.propertySection.placeholder}
              value={form.propertyDescription}
              onChange={(e) => {
                if (isReadOnly) return;
                setExternalErrors(null);
                setPropertyDescription(e.target.value);
              }}
              readOnly={isReadOnly}
              aria-readonly={isReadOnly}
              aria-invalid={
                !isReadOnly && Boolean(mergedErrors?.propertyDescription)
              }
            />
            {!isReadOnly && mergedErrors?.propertyDescription && (
              <p className="text-error mt-2 text-sm">
                {mergedErrors.propertyDescription}
              </p>
            )}
          </div>
        </div>
      </CollapseCard>

      {/* GUEST EXPERIENCE */}
      <CollapseCard title={ed.guestExperience.title}>
        <div className="flex flex-col gap-6 px-3">
          {/* ACCESS (areasDescription) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="desc-access"
              className="text-sm font-semibold text-[var(--color-base-content)]"
            >
              {ed.guestExperience.access.title}
            </label>
            <p className="text-sm text-[var(--color-neutral)]">
              {ed.guestExperience.access.description}
            </p>
            <textarea
              id="desc-access"
              rows={3}
              className="edit-listing-text-area text-sm"
              placeholder={ed.guestExperience.access.placeholder}
              value={form.areasDescription}
              onChange={(e) => {
                if (isReadOnly) return;
                setExternalErrors(null);
                setAreasDescription(e.target.value);
              }}
              readOnly={isReadOnly}
              aria-readonly={isReadOnly}
              aria-invalid={
                !isReadOnly && Boolean(mergedErrors?.areasDescription)
              }
            />
            {!isReadOnly && mergedErrors?.areasDescription && (
              <p className="text-error mt-2 text-sm">
                {mergedErrors.areasDescription}
              </p>
            )}
          </div>

          {/* INTERACTION (interactionDescription) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="desc-interaction"
              className="text-sm font-semibold text-[var(--color-base-content)]"
            >
              {ed.guestExperience.interaction.title}
            </label>
            <p className="text-sm text-[var(--color-neutral)]">
              {ed.guestExperience.interaction.description}
            </p>
            <textarea
              id="desc-interaction"
              rows={3}
              className="edit-listing-text-area text-sm"
              placeholder={ed.guestExperience.interaction.placeholder}
              value={form.interactionDescription}
              onChange={(e) => {
                if (isReadOnly) return;
                setExternalErrors(null);
                setInteractionDescription(e.target.value);
              }}
              readOnly={isReadOnly}
              aria-readonly={isReadOnly}
              aria-invalid={
                !isReadOnly && Boolean(mergedErrors?.interactionDescription)
              }
            />
            {!isReadOnly && mergedErrors?.interactionDescription && (
              <p className="text-error mt-2 text-sm">
                {mergedErrors.interactionDescription}
              </p>
            )}
          </div>

          {/* HIGHLIGHTS (additionalNotes) */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="desc-highlights"
              className="text-sm font-semibold text-[var(--color-base-content)]"
            >
              {ed.guestExperience.highlights.title}
            </label>
            <p className="text-sm text-[var(--color-neutral)]">
              {ed.guestExperience.highlights.description}
            </p>
            <textarea
              id="desc-highlights"
              rows={3}
              className="edit-listing-text-area text-sm"
              placeholder={ed.guestExperience.highlights.placeholder}
              value={form.additionalNotes}
              onChange={(e) => {
                if (isReadOnly) return;
                setExternalErrors(null);
                setAdditionalNotes(e.target.value);
              }}
              readOnly={isReadOnly}
              aria-readonly={isReadOnly}
              aria-invalid={
                !isReadOnly && Boolean(mergedErrors?.additionalNotes)
              }
            />
            {!isReadOnly && mergedErrors?.additionalNotes && (
              <p className="text-error mt-2 text-sm">
                {mergedErrors.additionalNotes}
              </p>
            )}
          </div>
        </div>
      </CollapseCard>
    </section>
  );
}

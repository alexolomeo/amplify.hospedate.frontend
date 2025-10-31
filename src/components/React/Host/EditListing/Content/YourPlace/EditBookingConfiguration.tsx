import { useEffect, useMemo, useState } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';

import {
  ALLOWED_BOOKING_TYPES,
  WELCOME_MAX_CHARS,
  validateBookingForm,
  type BookingTypeId,
  type BookingValidationMessages,
} from '@/components/React/Utils/edit-listing/content/YourPlace/bookingConfiguration/bookingValidators';

import { toBookingForm } from '@/components/React/Utils/edit-listing/content/YourPlace/bookingConfiguration/bookingAdapters';
import { useBookingForm } from '@/components/React/Utils/edit-listing/content/YourPlace/bookingConfiguration/useBookingForm';
import { createBookingController } from '@/components/React/Utils/edit-listing/content/YourPlace/bookingConfiguration/BookingController';

type Props = {
  lang?: SupportedLanguages;
  initialValues: ListingEditorValues | null;
  onRegisterController: (ctrl: SectionController | null) => () => void;
};

function getCopyForType(
  id: BookingTypeId,
  t: ReturnType<typeof getTranslation>
): { title: string; description?: string; placeholder: string } {
  if (id === 'INSTANT') {
    return {
      title: t.hostContent.editListing.content.booking.instantBooking,
      description:
        t.hostContent.editListing.content.booking.instantBookingDescription,
      placeholder:
        t.hostContent.editListing.content.booking.writeDescriptionHere,
    };
  }
  return {
    title: t.hostContent.editListing.content.booking.approveAllReservations,
    description:
      t.hostContent.editListing.content.booking
        .approveAllReservationsDescription,
    placeholder: t.hostContent.editListing.content.booking.writeDescriptionHere,
  };
}

const BOOKING_TYPES: ReadonlyArray<BookingTypeId> = [
  'INSTANT',
  'APPROVAL_REQUIRED',
];

export default function EditBookingConfiguration({
  lang = 'es',
  initialValues,
  onRegisterController,
}: Props) {
  const t = getTranslation(lang);
  const { isReadOnly } = useEditability();

  // Validations
  const messages = useMemo<BookingValidationMessages>(() => {
    const v = t.hostContent.editListing.content.booking.validation;
    return {
      typeRequired: v.typeRequired,
      welcomeMax: v.welcomeMax,
    };
  }, [t]);

  // Adapter: values -> form
  const initialForm = useMemo(
    () => toBookingForm(initialValues),
    [initialValues]
  );

  // local state + dirty + setters
  const { form, isDirty, reset, setSelectedType, setMessageForType } =
    useBookingForm(initialForm);

  // Server errors
  const [externalErrors, setExternalErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const getIsValid = useMemo(() => {
    return () => validateBookingForm(form, messages).ok;
  }, [form, messages]);

  // Controller
  const controller = useMemo<SectionController>(() => {
    return createBookingController({
      slug: 'booking',
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
    () => validateBookingForm(form, messages),
    [form, messages]
  );
  const clientErrors = clientValidation.ok ? null : clientValidation.errors;
  const mergedErrors = externalErrors ?? clientErrors;

  const selectedTypeId = form.selectedTypeId;
  const messageValue =
    selectedTypeId && ALLOWED_BOOKING_TYPES.has(selectedTypeId)
      ? (form.messagesByType[selectedTypeId] ?? '')
      : '';

  const remaining = Math.max(0, WELCOME_MAX_CHARS - messageValue.length);

  return (
    <div className="space-y-8">
      <h1 className="edit-listing-title">
        {t.hostContent.editListing.content.booking.title}
      </h1>

      {BOOKING_TYPES.map((typeId, idx) => {
        const copy = getCopyForType(typeId, t);
        const checked = selectedTypeId === typeId;

        return (
          <div key={typeId} className="flex gap-4">
            <input
              type="radio"
              name="booking-type"
              className="radio radio-primary radio-sm"
              checked={checked}
              onChange={() => {
                if (isReadOnly) return;
                setExternalErrors(null);
                setSelectedType(typeId);
              }}
              aria-labelledby={`booking-type-title-${idx}`}
              disabled={isReadOnly}
            />

            <div className="flex flex-1 flex-col gap-y-6">
              <div className="space-y-[5px]">
                <p id={`booking-type-title-${idx}`} className="font-medium">
                  {copy.title}
                </p>
                {copy.description && (
                  <p className="text-xs">{copy.description}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <p className="edit-listing-description px-3">
                  {t.hostContent.editListing.content.booking.addCustomMessage}
                </p>

                <textarea
                  className={`edit-listing-text-area text-sm ${checked ? '' : 'opacity-60'}`}
                  rows={1}
                  placeholder={copy.placeholder}
                  value={checked ? (form.messagesByType[typeId] ?? '') : ''}
                  onChange={(e) => {
                    if (!checked || isReadOnly) return;
                    setExternalErrors(null);
                    setMessageForType(typeId, e.target.value);
                  }}
                  maxLength={WELCOME_MAX_CHARS}
                  disabled={!checked || isReadOnly}
                  aria-readonly={!checked || isReadOnly}
                  aria-invalid={
                    !isReadOnly && Boolean(mergedErrors?.welcomeMessage)
                  }
                />

                {checked && (
                  <p
                    className="text-right text-xs text-[var(--color-neutral)]"
                    role="status"
                    aria-live="polite"
                  >
                    {remaining}
                  </p>
                )}

                {!isReadOnly && mergedErrors?.selectedTypeId && (
                  <p className="text-error mt-2 text-sm">
                    {mergedErrors.selectedTypeId}
                  </p>
                )}
                {!isReadOnly && mergedErrors?.welcomeMessage && (
                  <p className="text-error mt-2 text-sm">
                    {mergedErrors.welcomeMessage}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

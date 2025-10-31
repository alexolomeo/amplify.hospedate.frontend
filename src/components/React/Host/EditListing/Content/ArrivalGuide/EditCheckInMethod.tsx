import { useEffect, useMemo, useState } from 'react';
import CollapseCard from '@/components/React/Common/CollapseCard';
import { RadioOption } from '@/components/React/Common/RadioOption';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';

import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import type { CheckInMethodValue } from '@/types/host/edit-listing/editListingValues';

import {
  INSTRUCTIONS_MAX,
  validateCheckInMethodForm,
  type CheckInMethodValidationMessages,
} from '@/components/React/Utils/edit-listing/content/ArrivalGuide/checkInMethod/checkInMethodValidators';
import { toCheckInMethodForm } from '@/components/React/Utils/edit-listing/content/ArrivalGuide/checkInMethod/checkInMethodAdapters';
import { useCheckInMethodForm } from '@/components/React/Utils/edit-listing/content/ArrivalGuide/checkInMethod/useCheckInMethodForm';
import { createCheckInMethodController } from '@/components/React/Utils/edit-listing/content/ArrivalGuide/checkInMethod/CheckInMethodController';

type CheckInOption = {
  id: CheckInMethodValue;
  label: string;
  description: string;
  buttonLabel?: string;
  buttonAction?: () => void;
};

type Props = {
  lang?: SupportedLanguages;
  initialMethodId?: CheckInMethodValue;
  initialInstructions?: string;
  onRegisterController: (ctrl: SectionController | null) => () => void;
};

export default function EditCheckInMethod({
  lang = 'es',
  initialMethodId,
  initialInstructions = '',
  onRegisterController,
}: Props) {
  const t = getTranslation(lang);
  const { isReadOnly } = useEditability();

  // i18n messages
  const messages: CheckInMethodValidationMessages = useMemo(
    () => ({
      methodRequired:
        t.hostContent.editListing.content.editCheckInMethod.validation
          .methodRequired,
      instructionsMax:
        t.hostContent.editListing.content.editCheckInMethod.validation
          .instructionsMax,
    }),
    [t]
  );

  // Opciones (i18n)
  const checkInOptions: ReadonlyArray<CheckInOption> = useMemo(() => {
    const opts =
      t.hostContent.editListing.content.editCheckInMethod.method.options;
    const title =
      t.hostContent.editListing.content.editCheckInMethod.method.title;

    return [
      {
        id: 'SMART_LOCK',
        label: opts.smartLock.label,
        description: opts.smartLock.description,
        // buttonLabel: opts.smartLock.buttonLabel,
        buttonAction: () => alert(title),
      },
      {
        id: 'KEYPAD_LOCK',
        label: opts.keypad.label,
        description: opts.keypad.description,
      },
      {
        id: 'LOCK_BOX',
        label: opts.lockbox.label,
        description: opts.lockbox.description,
      },
      {
        id: 'BUILDING_STAFF',
        label: opts.staff.label,
        description: opts.staff.description,
      },
      {
        id: 'IN_PERSON',
        label: opts.inPerson.label,
        description: opts.inPerson.description,
      },
      {
        id: 'OTHER',
        label: opts.other.label,
        description: opts.other.description,
      },
    ] as const;
  }, [t]);

  // Form inicial
  const initialForm = useMemo(
    () =>
      toCheckInMethodForm({
        initialMethodId: initialMethodId ?? null,
        initialInstructions: initialInstructions ?? '',
      }),
    [initialMethodId, initialInstructions]
  );

  const { form, isDirty, reset, setSelectedMethodId, setInstructions } =
    useCheckInMethodForm(initialForm);

  // errores externos (servidor)
  const [externalErrors, setExternalErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const getIsValid = useMemo(() => {
    return () => validateCheckInMethodForm(form, messages).ok;
  }, [form, messages]);

  // Controller
  const controller = useMemo<SectionController>(() => {
    return createCheckInMethodController({
      slug: 'check-in-method',
      readOnly: isReadOnly,
      form,
      isDirty: () => isDirty,
      reset,
      messages,
      setExternalErrors,
      getIsValid,
    });
  }, [isReadOnly, form, isDirty, reset, messages, getIsValid]);

  useEffect(() => {
    const cleanup = onRegisterController(controller);
    return cleanup;
  }, [controller, onRegisterController]);

  // Validación de cliente para pintar errores
  const clientValidation = useMemo(
    () => validateCheckInMethodForm(form, messages),
    [form, messages]
  );
  const clientErrors = clientValidation.ok ? null : clientValidation.errors;
  const mergedErrors = externalErrors ?? clientErrors;

  return (
    <div className="flex w-full flex-col gap-8 px-1">
      <h2 className="text-base-content text-lg leading-7 font-bold">
        {t.hostContent.editListing.content.editCheckInMethod.title}
      </h2>

      <CollapseCard
        title={t.hostContent.editListing.content.editCheckInMethod.method.title}
      >
        <div className="flex flex-col gap-6 pt-2">
          {checkInOptions.map((option) => (
            <RadioOption
              key={option.id}
              id={option.id}
              name="checkInMethod"
              label={option.label}
              description={option.description}
              checked={form.selectedMethodId === option.id}
              onChange={(id) => setSelectedMethodId(id as CheckInMethodValue)}
              buttonLabel={option.buttonLabel}
              buttonAction={option.buttonAction}
              disabled={isReadOnly}
            />
          ))}

          {!isReadOnly && mergedErrors?.['checkInMethods.checkInMethod'] && (
            <p className="text-error -mt-2 text-xs">
              {mergedErrors['checkInMethods.checkInMethod']}
            </p>
          )}
        </div>
      </CollapseCard>

      <CollapseCard
        title={
          t.hostContent.editListing.content.editCheckInMethod.instructions.title
        }
      >
        <div className="flex flex-col gap-1.5 px-3">
          <p className="text-sm text-[var(--color-neutral)]">
            {
              t.hostContent.editListing.content.editCheckInMethod.instructions
                .subtitle
            }
          </p>
          <p className="text-sm text-[var(--color-neutral)]">
            {
              t.hostContent.editListing.content.editCheckInMethod.instructions
                .description
            }
          </p>

          <textarea
            rows={3}
            className="edit-listing-text-area text-sm"
            placeholder={
              t.hostContent.editListing.content.editCheckInMethod.instructions
                .placeholder
            }
            value={form.instructions}
            onChange={(e) => setInstructions(e.target.value)}
            disabled={isReadOnly}
            maxLength={INSTRUCTIONS_MAX}
            aria-invalid={
              !isReadOnly &&
              Boolean(mergedErrors?.['checkInInstructions.instructions'])
            }
          />
          {!isReadOnly &&
            mergedErrors?.['checkInInstructions.instructions'] && (
              <p className="text-error mt-1 text-xs">
                {mergedErrors['checkInInstructions.instructions']}
              </p>
            )}
        </div>
      </CollapseCard>
    </div>
  );
}

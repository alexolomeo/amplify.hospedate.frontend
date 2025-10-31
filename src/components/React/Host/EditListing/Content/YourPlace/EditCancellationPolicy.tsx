import { useEffect, useMemo, useState } from 'react';
import CollapseCard from '@/components/React/Common/CollapseCard';
import { RadioOption } from '@/components/React/Common/RadioOption';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import {
  isValidStandard,
  isValidLongStay,
  type StandardPolicyId,
  type LongStayPolicyId,
} from '@/components/React/Utils/edit-listing/cancellationPolicy';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';

import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';

import {
  validateCancellationForm,
  type CancellationValidationMessages,
} from '@/components/React/Utils/edit-listing/content/YourPlace/cancellationPolicy/cancellationValidators';
import { toCancellationForm } from '@/components/React/Utils/edit-listing/content/YourPlace/cancellationPolicy/cancellationAdapters';
import { useCancellationForm } from '@/components/React/Utils/edit-listing/content/YourPlace/cancellationPolicy/useCancellationForm';
import { createCancellationController } from '@/components/React/Utils/edit-listing/content/YourPlace/cancellationPolicy/CancellationController';

type Props = {
  lang?: SupportedLanguages;
  initialValues: ListingEditorValues | null;
  onRegisterController: (ctrl: SectionController | null) => () => void;
};

type PolicyItem<TId extends string> = {
  id: TId;
  label: string;
  description: string;
};

export default function EditCancellationPolicy({
  lang = 'es',
  initialValues,
  onRegisterController,
}: Props) {
  const t = getTranslation(lang);
  const { isReadOnly } = useEditability();

  // Validation messages
  const messages = useMemo<CancellationValidationMessages>(
    () => ({
      standardRequired:
        t.hostContent.editListing.content.cancellationPolicy.validation
          .standardRequired,
      longStayRequired:
        t.hostContent.editListing.content.cancellationPolicy.validation
          .longStayRequired,
    }),
    [t]
  );

  // values -> form
  const initialForm = useMemo(
    () => toCancellationForm(initialValues),
    [initialValues]
  );

  // local state + dirty + setters
  const { form, isDirty, reset, setStandardId, setLongStayId } =
    useCancellationForm(initialForm);

  // Server errors
  const [externalErrors, setExternalErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const getIsValid = useMemo(() => {
    return () => validateCancellationForm(form, messages).ok;
  }, [form, messages]);

  // controller
  const controller = useMemo<SectionController>(() => {
    return createCancellationController({
      slug: 'cancellation-policy',
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

  const clientValidation = useMemo(
    () => validateCancellationForm(form, messages),
    [form, messages]
  );
  const clientErrors = clientValidation.ok ? null : clientValidation.errors;
  const mergedErrors = externalErrors ?? clientErrors;

  const STANDARD_POLICIES: ReadonlyArray<PolicyItem<StandardPolicyId>> =
    useMemo(
      () => [
        {
          id: '1',
          label:
            t.hostContent.editListing.content.cancellationPolicy.standardPolicy
              .flexible.label,
          description:
            t.hostContent.editListing.content.cancellationPolicy.standardPolicy
              .flexible.description,
        },
        {
          id: '2',
          label:
            t.hostContent.editListing.content.cancellationPolicy.standardPolicy
              .moderate.label,
          description:
            t.hostContent.editListing.content.cancellationPolicy.standardPolicy
              .moderate.description,
        },
        {
          id: '3',
          label:
            t.hostContent.editListing.content.cancellationPolicy.standardPolicy
              .firm.label,
          description:
            t.hostContent.editListing.content.cancellationPolicy.standardPolicy
              .firm.description,
        },
        {
          id: '4',
          label:
            t.hostContent.editListing.content.cancellationPolicy.standardPolicy
              .strict.label,
          description:
            t.hostContent.editListing.content.cancellationPolicy.standardPolicy
              .strict.description,
        },
      ],
      [t]
    );

  const LONG_STAY_POLICIES: ReadonlyArray<PolicyItem<LongStayPolicyId>> =
    useMemo(
      () => [
        {
          id: '5',
          label:
            t.hostContent.editListing.content.cancellationPolicy.longTermPolicy
              .firm.label,
          description:
            t.hostContent.editListing.content.cancellationPolicy.longTermPolicy
              .firm.description,
        },
        {
          id: '6',
          label:
            t.hostContent.editListing.content.cancellationPolicy.longTermPolicy
              .strict.label,
          description:
            t.hostContent.editListing.content.cancellationPolicy.longTermPolicy
              .strict.description,
        },
      ],
      [t]
    );

  return (
    <div className="space-y-8 px-1">
      <h1 className="edit-listing-title">
        {t.hostContent.editListing.content.cancellationPolicy.title}
      </h1>

      <CollapseCard
        title={
          t.hostContent.editListing.content.cancellationPolicy.standardPolicy
            .title
        }
      >
        <div className="space-y-4">
          {STANDARD_POLICIES.map((policy) => (
            <RadioOption
              key={policy.id}
              id={policy.id}
              name="standardPolicy"
              label={policy.label}
              description={policy.description}
              checked={form.standardId === policy.id}
              onChange={(id) => {
                if (isValidStandard(id)) {
                  setExternalErrors(null);
                  setStandardId(id);
                }
              }}
              disabled={isReadOnly}
            />
          ))}

          {!isReadOnly && mergedErrors?.standardId && (
            <p className="text-error mt-1 text-sm">{mergedErrors.standardId}</p>
          )}
        </div>
      </CollapseCard>

      <CollapseCard
        title={
          t.hostContent.editListing.content.cancellationPolicy.longTermPolicy
            .title
        }
      >
        <div className="space-y-4">
          {LONG_STAY_POLICIES.map((policy) => (
            <RadioOption
              key={policy.id}
              id={policy.id}
              name="longTermPolicy"
              label={policy.label}
              description={policy.description}
              checked={form.longStayId === policy.id}
              onChange={(id) => {
                if (isValidLongStay(id)) {
                  setExternalErrors(null);
                  setLongStayId(id);
                }
              }}
              disabled={isReadOnly}
            />
          ))}

          {!isReadOnly && mergedErrors?.longStayId && (
            <p className="text-error mt-1 text-sm">{mergedErrors.longStayId}</p>
          )}
        </div>
      </CollapseCard>
    </div>
  );
}

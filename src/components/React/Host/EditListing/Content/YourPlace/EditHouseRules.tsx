import CollapseCard from '@/components/React/Common/CollapseCard';
import SelectField from '@/components/React/Common/SelectField';
import QuantitySelector from '@/components/React/Common/QuantitySelector';
import ToggleSwitch from '@/components/React/Common/ToggleSwitch';
import { useMemo, useState, useEffect } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import type { CatalogsSelectors } from '@/components/React/Hooks/Host/EditListing/useEditListing';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';

import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import { toHouseRulesForm } from '@/components/React/Utils/edit-listing/content/YourPlace/houseRules/houseRulesAdapters';
import { useHouseRulesForm } from '@/components/React/Utils/edit-listing/content/YourPlace/houseRules/useHouseRulesForm';
import {
  validateHouseRulesForm,
  type HouseRulesValidationMessages,
  GUEST_MIN,
  GUEST_MAX,
  PETS_MIN,
  PETS_MAX,
} from '@/components/React/Utils/edit-listing/content/YourPlace/houseRules/houseRulesValidators';
import { createHouseRulesController } from '@/components/React/Utils/edit-listing/content/YourPlace/houseRules/HouseRulesController';
import { FLEXIBLE_ID } from '@/components/React/Utils/edit-listing/content/YourPlace/houseRules/houseRulesValidators';

type PermissionsInit = {
  petsAllowed: boolean;
  numPets: number;
  eventsAllowed: boolean;
  smokingAllowed: boolean;
  commercialPhotographyAllowed: boolean;
  guestNumber: number;
};

type Props = {
  lang: SupportedLanguages;
  selectors: CatalogsSelectors;

  initialQuietEnabled?: boolean;
  initialQuietStartId?: number | null;
  initialQuietEndId?: number | null;

  initialCheckinStartId?: number | null;
  initialCheckinEndId?: number | null;
  initialCheckoutId?: number | null;

  initialPermissions?: PermissionsInit;
  initialAdditionalRulesText?: string;

  onRegisterController: (ctrl: SectionController | null) => () => void;
};

export default function EditHouseRules({
  lang,
  selectors,
  initialQuietEnabled = false,
  initialQuietStartId,
  initialQuietEndId,
  initialCheckinStartId,
  initialCheckinEndId,
  initialCheckoutId,
  initialPermissions,
  initialAdditionalRulesText = '',
  onRegisterController,
}: Props) {
  const t = getTranslation(lang);
  const { isReadOnly } = useEditability();

  // --- options (id/label)
  const toOptions = (arr: { id: number; name: string }[]) =>
    arr.map((x) => ({ value: String(x.id), label: x.name }));

  const quietStartOptions = useMemo(
    () => toOptions(selectors.quietHoursStartTimes),
    [selectors.quietHoursStartTimes]
  );
  const quietEndOptions = useMemo(
    () => toOptions(selectors.quietHoursEndTimes),
    [selectors.quietHoursEndTimes]
  );
  const checkInStartOptions = useMemo(
    () => toOptions(selectors.checkInStartTimes),
    [selectors.checkInStartTimes]
  );
  const checkInEndOptions = useMemo(
    () => toOptions(selectors.checkInEndTimes),
    [selectors.checkInEndTimes]
  );
  const checkoutOptions = useMemo(
    () => toOptions(selectors.checkoutTimes),
    [selectors.checkoutTimes]
  );

  // --- Validation messages
  const messages: HouseRulesValidationMessages = useMemo(
    () => ({
      numPetsMin:
        t.hostContent.editListing.content.houseRules.validation.numPetsMin,
      numPetsMax:
        t.hostContent.editListing.content.houseRules.validation.numPetsMax,
      guestMin:
        t.hostContent.editListing.content.houseRules.validation.guestMin,
      guestMax:
        t.hostContent.editListing.content.houseRules.validation.guestMax,
      quietStartRequired:
        t.hostContent.editListing.content.houseRules.validation
          .quietStartRequired,
      quietEndRequired:
        t.hostContent.editListing.content.houseRules.validation
          .quietEndRequired,
      checkinStartRequired:
        t.hostContent.editListing.content.houseRules.validation
          .checkinStartRequired,
      checkinEndBeforeStart:
        t.hostContent.editListing.content.houseRules.validation
          .checkinEndBeforeStart,
      checkoutRequired:
        t.hostContent.editListing.content.houseRules.validation
          .checkoutRequired,
      additionalMax:
        t.hostContent.editListing.content.houseRules.validation.additionalMax,
      checkinEndRequired:
        t.hostContent.editListing.content.houseRules.validation
          .checkinEndRequired,
    }),
    [t]
  );

  const ipPetsAllowed = initialPermissions?.petsAllowed ?? false;
  const ipNumPets = initialPermissions?.numPets ?? 0;
  const ipEventsAllowed = initialPermissions?.eventsAllowed ?? false;
  const ipSmokingAllowed = initialPermissions?.smokingAllowed ?? false;
  const ipCommercialPhotographyAllowed =
    initialPermissions?.commercialPhotographyAllowed ?? false;
  const ipGuestNumber = initialPermissions?.guestNumber ?? 0;

  // --- initial form
  const initialForm = useMemo(
    () =>
      toHouseRulesForm({
        initialQuietEnabled,
        initialQuietStartId,
        initialQuietEndId,
        initialCheckinStartId,
        initialCheckinEndId,
        initialCheckoutId,
        initialPermissions: {
          petsAllowed: ipPetsAllowed,
          numPets: ipNumPets,
          eventsAllowed: ipEventsAllowed,
          smokingAllowed: ipSmokingAllowed,
          commercialPhotographyAllowed: ipCommercialPhotographyAllowed,
          guestNumber: ipGuestNumber,
        },
        initialAdditionalRulesText,
      }),
    [
      initialQuietEnabled,
      initialQuietStartId,
      initialQuietEndId,
      initialCheckinStartId,
      initialCheckinEndId,
      initialCheckoutId,
      ipPetsAllowed,
      ipNumPets,
      ipEventsAllowed,
      ipSmokingAllowed,
      ipCommercialPhotographyAllowed,
      ipGuestNumber,
      initialAdditionalRulesText,
    ]
  );

  const {
    form,
    isDirty,
    reset,
    setPetsAllowed,
    setNumPets,
    setEventsAllowed,
    setSmokingAllowed,
    setCommercialPhotographyAllowed,
    setGuestNumber,
    setQuietEnabled,
    setQuietStartId,
    setQuietEndId,
    setCheckinStartId,
    setCheckinEndId,
    setCheckoutId,
    setAdditionalRulesText,
  } = useHouseRulesForm(initialForm);

  // server errors
  const [externalErrors, setExternalErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const getIsValid = useMemo(() => {
    return () => validateHouseRulesForm(form, messages).ok;
  }, [form, messages]);

  // controller
  const controller = useMemo<SectionController>(() => {
    return createHouseRulesController({
      slug: 'house-rules',
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
    () => validateHouseRulesForm(form, messages),
    [form, messages]
  );
  const clientErrors = clientValidation.ok ? null : clientValidation.errors;
  const mergedErrors = externalErrors ?? clientErrors;

  const quietStartValue =
    form.quietHours.startId != null ? String(form.quietHours.startId) : '';
  const quietEndValue =
    form.quietHours.endId != null ? String(form.quietHours.endId) : '';
  const checkinStartValue =
    form.checkInOut.checkInStartId != null
      ? String(form.checkInOut.checkInStartId)
      : '';
  const isEndDisabled =
    isReadOnly || form.checkInOut.checkInStartId === FLEXIBLE_ID;

  const checkinEndValue =
    form.checkInOut.checkInStartId === FLEXIBLE_ID
      ? ''
      : form.checkInOut.checkInEndId != null
        ? String(form.checkInOut.checkInEndId)
        : '';
  const checkoutValue =
    form.checkInOut.checkoutId != null
      ? String(form.checkInOut.checkoutId)
      : '';

  return (
    <div className="space-y-8 px-1">
      <div className="space-y-2">
        <h1 className="edit-listing-title">
          {t.hostContent.editListing.content.houseRules.title}
        </h1>
        <p className="edit-listing-description">
          {t.hostContent.editListing.content.houseRules.description}
        </p>
      </div>

      {/* Permissions */}
      <CollapseCard
        title={t.hostContent.editListing.content.houseRules.permissions.title}
      >
        <div className="space-y-6">
          <div className="space-y-1">
            <ToggleSwitch
              title={
                t.hostContent.editListing.content.houseRules.permissions
                  .petsAllowed
              }
              description={
                t.hostContent.editListing.content.houseRules.permissions
                  .petsAllowedDescription
              }
              checked={form.permissions.petsAllowed}
              onChange={setPetsAllowed}
              disabled={isReadOnly}
            />
            <div className="pl-4">
              <QuantitySelector
                title={
                  t.hostContent.editListing.content.houseRules.permissions
                    .maxPetsAllowed
                }
                value={form.permissions.numPets}
                onIncrement={() =>
                  setNumPets(Math.min(PETS_MAX, form.permissions.numPets + 1))
                }
                onDecrement={() =>
                  setNumPets(Math.max(PETS_MIN, form.permissions.numPets - 1))
                }
                min={PETS_MIN}
                max={PETS_MAX}
                disabled={!form.permissions.petsAllowed || isReadOnly}
              />
              {!isReadOnly && mergedErrors?.['permissions.numPets'] && (
                <p className="text-error mt-1 text-xs">
                  {mergedErrors['permissions.numPets']}
                </p>
              )}
            </div>
          </div>

          <ToggleSwitch
            title={
              t.hostContent.editListing.content.houseRules.permissions
                .eventsAllowed
            }
            checked={form.permissions.eventsAllowed}
            onChange={setEventsAllowed}
            disabled={isReadOnly}
          />

          <ToggleSwitch
            title={
              t.hostContent.editListing.content.houseRules.permissions
                .smokingVapingShishaAllowed
            }
            checked={form.permissions.smokingAllowed}
            onChange={setSmokingAllowed}
            disabled={isReadOnly}
          />

          <ToggleSwitch
            title={
              t.hostContent.editListing.content.houseRules.permissions
                .commercialPhotographyFilmingAllowed
            }
            checked={form.permissions.commercialPhotographyAllowed}
            onChange={setCommercialPhotographyAllowed}
            disabled={isReadOnly}
          />

          <QuantitySelector
            title={
              t.hostContent.editListing.content.houseRules.permissions
                .maxPeopleAllowed
            }
            value={form.permissions.guestNumber}
            onIncrement={() =>
              setGuestNumber(
                Math.min(GUEST_MAX, form.permissions.guestNumber + 1)
              )
            }
            onDecrement={() =>
              setGuestNumber(
                Math.max(GUEST_MIN, form.permissions.guestNumber - 1)
              )
            }
            min={GUEST_MIN}
            max={GUEST_MAX}
            disabled={isReadOnly}
          />
          {!isReadOnly && mergedErrors?.['permissions.guestNumber'] && (
            <p className="text-error -mt-1 text-xs">
              {mergedErrors['permissions.guestNumber']}
            </p>
          )}
        </div>
      </CollapseCard>

      {/* Quiet hours */}
      <CollapseCard
        title={t.hostContent.editListing.content.houseRules.quietHours.title}
      >
        <div className="space-y-5">
          <ToggleSwitch
            title={
              t.hostContent.editListing.content.houseRules.quietHours
                .toggleLabel
            }
            checked={form.quietHours.isEnabled}
            onChange={setQuietEnabled}
            disabled={isReadOnly}
          />

          <div className="space-y-1">
            <p className="edit-listing-description">
              {
                t.hostContent.editListing.content.houseRules.quietHours
                  .startTime
              }
            </p>
            <SelectField
              options={quietStartOptions}
              value={quietStartValue}
              onChange={(val) => setQuietStartId(Number(val))}
              className="w-full"
              buttonHeight="h-[35px]"
              labelFontSize="text-sm"
              disabled={!form.quietHours.isEnabled || isReadOnly}
              side="bottom"
              maxPanelPx={240}
              placeholder={
                t.hostContent.editListing.content.houseRules.placeholder
              }
            />
            {!isReadOnly && mergedErrors?.['quietHours.startId'] && (
              <p className="text-error mt-1 text-xs">
                {mergedErrors['quietHours.startId']}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <p className="edit-listing-description">
              {t.hostContent.editListing.content.houseRules.quietHours.endTime}
            </p>
            <SelectField
              options={quietEndOptions}
              value={quietEndValue}
              onChange={(val) => setQuietEndId(Number(val))}
              buttonHeight="h-[35px]"
              labelFontSize="text-sm"
              disabled={!form.quietHours.isEnabled || isReadOnly}
              side="bottom"
              maxPanelPx={240}
              placeholder={
                t.hostContent.editListing.content.houseRules.placeholder
              }
            />
            {!isReadOnly && mergedErrors?.['quietHours.endId'] && (
              <p className="text-error mt-1 text-xs">
                {mergedErrors['quietHours.endId']}
              </p>
            )}
          </div>
        </div>
      </CollapseCard>

      {/* Check-in/out */}
      <CollapseCard
        title={
          t.hostContent.editListing.content.houseRules.checkInOutHours.title
        }
      >
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs leading-none font-bold">
              {
                t.hostContent.editListing.content.houseRules.checkInOutHours
                  .arrivalHour
              }
            </p>

            <div className="space-y-1">
              <p className="edit-listing-description">
                {
                  t.hostContent.editListing.content.houseRules.checkInOutHours
                    .startTime
                }
              </p>
              <SelectField
                options={checkInStartOptions}
                value={checkinStartValue}
                onChange={(val) => {
                  const id = Number(val);
                  setCheckinStartId(id);
                  if (id === FLEXIBLE_ID) setCheckinEndId(null);
                }}
                buttonHeight="h-[35px]"
                labelFontSize="text-sm"
                side="bottom"
                maxPanelPx={240}
                placeholder={
                  t.hostContent.editListing.content.houseRules.placeholder
                }
                disabled={isReadOnly}
              />
              {!isReadOnly && mergedErrors?.['checkInOut.checkInStartId'] && (
                <p className="text-error mt-1 text-xs">
                  {mergedErrors['checkInOut.checkInStartId']}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <p className="edit-listing-description">
                {
                  t.hostContent.editListing.content.houseRules.checkInOutHours
                    .endTime
                }
              </p>
              <SelectField
                options={checkInEndOptions}
                value={checkinEndValue}
                onChange={(val) => setCheckinEndId(Number(val))}
                buttonHeight="h-[35px]"
                labelFontSize="text-sm"
                side="bottom"
                maxPanelPx={240}
                placeholder={
                  t.hostContent.editListing.content.houseRules.placeholder
                }
                disabled={isReadOnly || isEndDisabled}
              />
              {!isReadOnly &&
                form.checkInOut.checkInStartId !== FLEXIBLE_ID &&
                mergedErrors?.['checkInOut.checkInEndId'] && (
                  <p className="text-error mt-1 text-xs">
                    {mergedErrors['checkInOut.checkInEndId']}
                  </p>
                )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs leading-none font-bold">
              {
                t.hostContent.editListing.content.houseRules.checkInOutHours
                  .departureHour
              }
            </p>
            <div className="space-y-1">
              <p className="edit-listing-description">
                {
                  t.hostContent.editListing.content.houseRules.checkInOutHours
                    .selectTime
                }
              </p>
              <SelectField
                options={checkoutOptions}
                value={checkoutValue}
                onChange={(val) => setCheckoutId(Number(val))}
                buttonHeight="h-[35px]"
                labelFontSize="text-sm"
                side="bottom"
                maxPanelPx={240}
                placeholder={
                  t.hostContent.editListing.content.houseRules.placeholder
                }
                disabled={isReadOnly}
              />
              {!isReadOnly && mergedErrors?.['checkInOut.checkoutId'] && (
                <p className="text-error mt-1 text-xs">
                  {mergedErrors['checkInOut.checkoutId']}
                </p>
              )}
            </div>
          </div>
        </div>
      </CollapseCard>

      {/* Additional rules */}
      <CollapseCard
        title={
          t.hostContent.editListing.content.houseRules.additionalRules.title
        }
      >
        <div className="space-y-1.5">
          <p className="edit-listing-description px-3">
            {
              t.hostContent.editListing.content.houseRules.additionalRules
                .description
            }
          </p>
          <textarea
            className="edit-listing-text-area text-sm"
            rows={1}
            placeholder={
              t.hostContent.editListing.content.houseRules.additionalRules
                .textAreaPlaceholder
            }
            value={form.additionalRulesText}
            onChange={(e) => setAdditionalRulesText(e.target.value)}
            disabled={isReadOnly}
            aria-invalid={
              !isReadOnly && Boolean(mergedErrors?.['additionalRules.text'])
            }
          />
          {!isReadOnly && mergedErrors?.['additionalRules.text'] && (
            <p className="text-error mt-1 text-xs">
              {mergedErrors['additionalRules.text']}
            </p>
          )}
        </div>
      </CollapseCard>
    </div>
  );
}

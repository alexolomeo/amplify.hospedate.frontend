import React, { useEffect, useMemo, useState, useCallback } from 'react';
import CollapseCard from '@/components/React/Common/CollapseCard';
import ToggleSwitch from '@/components/React/Common/ToggleSwitch';
import Modal from '@/components/React/Common/Modal';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import XMarkMini from '/src/icons/x-mark-mini.svg?react';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';

import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';

import {
  type DetailKey,
  MODAL_MAX_CHARS,
  validateGuestSafetyForm,
  type GuestSafetyValidationMessages,
} from '@/components/React/Utils/edit-listing/content/YourPlace/guestSafety/guestSafetyValidators';

import { toGuestSafetyForm } from '@/components/React/Utils/edit-listing/content/YourPlace/guestSafety/guestSafetyAdapters';
import { useGuestSafetyForm } from '@/components/React/Utils/edit-listing/content/YourPlace/guestSafety/useGuestSafetyForm';
import { createGuestSafetyController } from '@/components/React/Utils/edit-listing/content/YourPlace/guestSafety/GuestSafetyController';

type Props = {
  lang?: SupportedLanguages;
  initialValues: ListingEditorValues | null;
  onRegisterController: (ctrl: SectionController | null) => () => void;
};

export default function EditGuestSafety({
  lang = 'es',
  initialValues,
  onRegisterController,
}: Props) {
  const t = getTranslation(lang);
  const { isReadOnly } = useEditability();

  // Validation messages
  const messages = useMemo<GuestSafetyValidationMessages>(() => {
    const fallback = 'Máximo 300 caracteres.';
    return {
      detailsMax:
        (
          t.hostContent.editListing.content.guestSafety.validation as {
            detailsMax?: string;
          }
        )?.detailsMax ??
        (
          t.hostContent.editListing.content.guestSafety?.validation as {
            maxChars300?: string;
          }
        )?.maxChars300 ??
        fallback,
    };
  }, [t]);

  // Adapter values -> form
  const initialForm = useMemo(
    () => toGuestSafetyForm(initialValues),
    [initialValues]
  );

  // local state + dirty + setters
  const { form, isDirty, reset, setSc, setSd, setPi, setDetail } =
    useGuestSafetyForm(initialForm);

  // server errors
  const [externalErrors, setExternalErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const getIsValid = useMemo(() => {
    return () => validateGuestSafetyForm(form, messages).ok;
  }, [form, messages]);

  // Controller
  const controller = useMemo<SectionController>(() => {
    return createGuestSafetyController({
      slug: 'guest-safety',
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
    () => validateGuestSafetyForm(form, messages),
    [form, messages]
  );
  const clientErrors = clientValidation.ok ? null : clientValidation.errors;
  const mergedErrors = externalErrors ?? clientErrors;

  // -------- Modal (form.details) --------
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoText, setInfoText] = useState('');
  const [activeKey, setActiveKey] = useState<DetailKey | null>(null);

  const openInfoModalFor = useCallback(
    (key: DetailKey) => {
      if (isReadOnly) return;
      setActiveKey(key);
      setInfoText((form.details[key] ?? '').trim());
      setInfoOpen(true);
    },
    [form.details, isReadOnly]
  );

  const closeInfoModal = useCallback(() => {
    setInfoOpen(false);
    setActiveKey(null);
    setInfoText('');
  }, []);

  const onSaveInfo = useCallback(() => {
    if (!activeKey) return closeInfoModal();
    setDetail(activeKey, infoText);
    closeInfoModal();
  }, [activeKey, infoText, setDetail, closeInfoModal]);

  const Block = ({
    checked,
    onChange,
    title,
    description,
    infoKey,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    title: string;
    description: string;
    infoKey: DetailKey;
  }) => (
    <div className="space-y-1">
      <ToggleSwitch
        disabled={isReadOnly}
        title={title}
        description={description}
        checked={checked}
        onChange={onChange}
      />
      {checked && (
        <button
          type="button"
          className={`mt-1 pl-1 text-sm underline ${
            isReadOnly
              ? 'cursor-not-allowed text-[var(--color-base-content)]/50'
              : 'text-primary cursor-pointer'
          }`}
          onClick={() => openInfoModalFor(infoKey)}
          disabled={isReadOnly}
          aria-disabled={isReadOnly}
        >
          {t.hostContent.editListing.content.guestSafety.addInformation}
        </button>
      )}
      {mergedErrors?.[infoKey] && (
        <p className="text-error mt-1 text-xs">{mergedErrors[infoKey]}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8 px-1">
      <div className="space-y-2">
        <h1 className="edit-listing-title">
          {t.hostContent.editListing.content.guestSafety.title}
        </h1>
        <p className="edit-listing-description">
          {t.hostContent.editListing.content.guestSafety.description}
        </p>
      </div>

      {/* Safety considerations */}
      <CollapseCard
        title={
          t.hostContent.editListing.content.guestSafety.safetyConsiderations
            .title
        }
      >
        <div className="space-y-6">
          <Block
            checked={form.sc.noChildrenAllowed}
            onChange={(v) => setSc('noChildrenAllowed', v)}
            infoKey={'sc.noChildrenAllowed'}
            title={
              t.hostContent.editListing.content.guestSafety.safetyConsiderations
                .notGoodForKidsAge2To12.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.safetyConsiderations
                .notGoodForKidsAge2To12.description
            }
          />
          <Block
            checked={form.sc.noInfantsAllowed}
            onChange={(v) => setSc('noInfantsAllowed', v)}
            infoKey={'sc.noInfantsAllowed'}
            title={
              t.hostContent.editListing.content.guestSafety.safetyConsiderations
                .notGoodForInfantsUnder2.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.safetyConsiderations
                .notGoodForInfantsUnder2.description
            }
          />
          <Block
            checked={form.sc.poolOrJacuzziWithNoFence}
            onChange={(v) => setSc('poolOrJacuzziWithNoFence', v)}
            infoKey={'sc.poolOrJacuzziWithNoFence'}
            title={
              t.hostContent.editListing.content.guestSafety.safetyConsiderations
                .unfencedPoolOrHotTub.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.safetyConsiderations
                .unfencedPoolOrHotTub.description
            }
          />
          <Block
            checked={form.sc.lakeOrRiverOrWaterBody}
            onChange={(v) => setSc('lakeOrRiverOrWaterBody', v)}
            infoKey={'sc.lakeOrRiverOrWaterBody'}
            title={
              t.hostContent.editListing.content.guestSafety.safetyConsiderations
                .nearBodyOfWater.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.safetyConsiderations
                .nearBodyOfWater.description
            }
          />
          <Block
            checked={form.sc.climbingOrPlayStructure}
            onChange={(v) => setSc('climbingOrPlayStructure', v)}
            infoKey={'sc.climbingOrPlayStructure'}
            title={
              t.hostContent.editListing.content.guestSafety.safetyConsiderations
                .structuresToClimbOrPlay.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.safetyConsiderations
                .structuresToClimbOrPlay.description
            }
          />
          <Block
            checked={form.sc.heightsWithNoFence}
            onChange={(v) => setSc('heightsWithNoFence', v)}
            infoKey={'sc.heightsWithNoFence'}
            title={
              t.hostContent.editListing.content.guestSafety.safetyConsiderations
                .unprotectedElevatedAreas.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.safetyConsiderations
                .unprotectedElevatedAreas.description
            }
          />
          <Block
            checked={form.sc.animals}
            onChange={(v) => setSc('animals', v)}
            infoKey={'sc.animals'}
            title={
              t.hostContent.editListing.content.guestSafety.safetyConsiderations
                .potentiallyDangerousAnimals.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.safetyConsiderations
                .potentiallyDangerousAnimals.description
            }
          />
        </div>
      </CollapseCard>

      {/* Security devices */}
      <CollapseCard
        title={
          t.hostContent.editListing.content.guestSafety.securityDevices.title
        }
      >
        <div className="space-y-6">
          <Block
            checked={form.sd.surveillance}
            onChange={(v) => setSd('surveillance', v)}
            infoKey={'sd.surveillance'}
            title={
              t.hostContent.editListing.content.guestSafety.securityDevices
                .outdoorSecurityCamera.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.securityDevices
                .outdoorSecurityCamera.description
            }
          />
          <Block
            checked={form.sd.noiseMonitor}
            onChange={(v) => setSd('noiseMonitor', v)}
            infoKey={'sd.noiseMonitor'}
            title={
              t.hostContent.editListing.content.guestSafety.securityDevices
                .noiseDecibelMonitor.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.securityDevices
                .noiseDecibelMonitor.description
            }
          />
          <Block
            checked={form.sd.carbonMonoxideDetector}
            onChange={(v) => setSd('carbonMonoxideDetector', v)}
            infoKey={'sd.carbonMonoxideDetector'}
            title={
              t.hostContent.editListing.content.guestSafety.securityDevices
                .carbonMonoxideDetector.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.securityDevices
                .carbonMonoxideDetector.description
            }
          />
          <Block
            checked={form.sd.smokeDetector}
            onChange={(v) => setSd('smokeDetector', v)}
            infoKey={'sd.smokeDetector'}
            title={
              t.hostContent.editListing.content.guestSafety.securityDevices
                .smokeDetector.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.securityDevices
                .smokeDetector.description
            }
          />
        </div>
      </CollapseCard>

      {/* Property information */}
      <CollapseCard
        title={
          t.hostContent.editListing.content.guestSafety.propertyInformation
            .title
        }
      >
        <div className="space-y-6">
          <Block
            checked={form.pi.requiresStairs}
            onChange={(v) => setPi('requiresStairs', v)}
            infoKey={'pi.requiresStairs'}
            title={
              t.hostContent.editListing.content.guestSafety.propertyInformation
                .guestsMustClimbStairs.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.propertyInformation
                .guestsMustClimbStairs.description
            }
          />
          <Block
            checked={form.pi.potentialNoise}
            onChange={(v) => setPi('potentialNoise', v)}
            infoKey={'pi.potentialNoise'}
            title={
              t.hostContent.editListing.content.guestSafety.propertyInformation
                .noiseDuringStay.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.propertyInformation
                .noiseDuringStay.description
            }
          />
          <Block
            checked={form.pi.hasPets}
            onChange={(v) => setPi('hasPets', v)}
            infoKey={'pi.hasPets'}
            title={
              t.hostContent.editListing.content.guestSafety.propertyInformation
                .petsLiveOnProperty.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.propertyInformation
                .petsLiveOnProperty.description
            }
          />
          <Block
            checked={form.pi.limitedParking}
            onChange={(v) => setPi('limitedParking', v)}
            infoKey={'pi.limitedParking'}
            title={
              t.hostContent.editListing.content.guestSafety.propertyInformation
                .noParkingOnProperty.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.propertyInformation
                .noParkingOnProperty.description
            }
          />
          <Block
            checked={form.pi.sharedSpaces}
            onChange={(v) => setPi('sharedSpaces', v)}
            infoKey={'pi.sharedSpaces'}
            title={
              t.hostContent.editListing.content.guestSafety.propertyInformation
                .commonAreas.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.propertyInformation
                .commonAreas.description
            }
          />
          <Block
            checked={form.pi.limitedAmenities}
            onChange={(v) => setPi('limitedAmenities', v)}
            infoKey={'pi.limitedAmenities'}
            title={
              t.hostContent.editListing.content.guestSafety.propertyInformation
                .limitedBasicServices.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.propertyInformation
                .limitedBasicServices.description
            }
          />
          <Block
            checked={form.pi.weapons}
            onChange={(v) => setPi('weapons', v)}
            infoKey={'pi.weapons'}
            title={
              t.hostContent.editListing.content.guestSafety.propertyInformation
                .weaponsPresent.label
            }
            description={
              t.hostContent.editListing.content.guestSafety.propertyInformation
                .weaponsPresent.description
            }
          />
        </div>
      </CollapseCard>

      {/* MODAL */}
      <Modal
        open={infoOpen}
        onClose={closeInfoModal}
        backgroundColorClass="bg-[var(--color-primary-content)]"
        widthClass="w-[92vw] md:max-w-[460px]"
        heightClass="md:max-h-[85vh]"
        title={t.hostContent.editListing.content.guestSafety.addInformation}
        titleClass="text-xl font-bold"
        titleTextColorClass="text-[var(--color-base-content)]"
        TitleSubtitleContentClass="mx-0 flex flex-col items-start text-left"
        headerBgClass="bg-[var(--color-primary-content)]"
        topLeftButton={false}
        topRightAction={
          <button
            type="button"
            onClick={closeInfoModal}
            aria-label={lang === 'es' ? 'Cerrar' : 'Close'}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[16px]"
          >
            <XMarkMini className="h-[14px] w-[14px]" />
          </button>
        }
        contentClassName="px-6 pb-2 pt-4"
        ariaLabelledbyId="guest-safety-add-info-title"
        footerLeft={
          <button
            type="button"
            onClick={closeInfoModal}
            className="text-primary h-6 cursor-pointer px-2 font-semibold underline"
          >
            {t.common.cancel}
          </button>
        }
        footer={
          <button
            type="button"
            onClick={onSaveInfo}
            className="h-12 cursor-pointer rounded-full bg-[var(--color-primary)] px-4 font-semibold text-[var(--color-primary-content)] shadow-sm"
          >
            {t.common.save}
          </button>
        }
        footerPaddingClass="px-6 py-4"
        escToClose
      >
        <div className="flex w-full flex-col gap-2">
          <textarea
            rows={6}
            className="edit-listing-text-area w-full text-sm"
            placeholder={
              t.hostContent.editListing.content.guestSafety.modalPlaceholder
            }
            value={infoText}
            onChange={(e) => setInfoText(e.target.value)}
            maxLength={MODAL_MAX_CHARS}
            aria-describedby="guest-safety-info-counter"
            id="guest-safety-info-textarea"
            disabled={isReadOnly}
          />
          <p
            id="guest-safety-info-counter"
            className="pl-1 text-[10px] font-semibold text-[var(--color-neutral)]"
          >
            {MODAL_MAX_CHARS - infoText.length}{' '}
            {
              t.hostContent.editListing.content.editDescription
                .charactersAvailable
            }
          </p>

          {activeKey && mergedErrors?.[activeKey] && (
            <p className="text-error mt-1 text-xs">{mergedErrors[activeKey]}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}

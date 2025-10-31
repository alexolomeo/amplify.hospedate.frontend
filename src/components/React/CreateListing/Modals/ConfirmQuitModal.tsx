import XMarkMiniIcon from '@/icons/x-mark-mini.svg?react';
import InformationCircleIcon from '@/icons/information-circle.svg?react';
import ExclamationTriangleIcon from '@/icons/exclamation-triangle.svg?react';
import AppButton from '@/components/React/Common/AppButton';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  lang?: SupportedLanguages;
}

export default function ConfirmQuitModal({
  onConfirm,
  onCancel,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  return (
    <div className="flex w-full max-w-xs flex-col items-start gap-8 rounded-[40px] bg-[#EEF7FF] p-6 sm:w-[325px]">
      <div className="flex w-full items-start justify-between gap-6">
        <h2 className="text-3xl leading-9 font-bold text-[var(--color-base-content)]">
          {t.createListing.modal.confirmQuit.heading}
        </h2>
        <button
          onClick={onCancel}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[16px]"
        >
          <XMarkMiniIcon className="h-5 w-5 text-[var(--color-base-content)]" />
        </button>
      </div>

      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full items-start gap-2">
          <div>
            <InformationCircleIcon className="h-[20px] w-[20px] text-[var(--color-info-bg)]" />
          </div>
          <p className="text-base leading-6 text-[var(--color-base-content)]">
            {t.createListing.modal.confirmQuit.saved}
          </p>
        </div>

        <div className="flex w-full items-start gap-2">
          <div>
            <ExclamationTriangleIcon className="h-[20px] w-[20px] text-[var(--color-warning)]" />
          </div>
          <p className="text-base leading-6 text-[var(--color-base-content)]">
            {t.createListing.modal.confirmQuit.unsaved}
          </p>
        </div>
      </div>

      <div className="box-border flex w-full gap-3 pt-2">
        <AppButton
          label={t.createListing.modal.confirmQuit.backToEdit}
          onClick={onCancel}
          size="md"
          className="h-12 flex-1 rounded-full text-sm font-semibold shadow-sm"
        />
        <AppButton
          label={t.createListing.modal.confirmQuit.saveAndExit}
          onClick={onConfirm}
          size="md"
          className="h-12 flex-1 rounded-full text-sm font-semibold shadow-sm"
        />
      </div>
    </div>
  );
}

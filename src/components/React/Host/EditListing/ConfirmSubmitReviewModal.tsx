import Modal from '@/components/React/Common/Modal';
import AppButton from '@/components/React/Common/AppButton';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import XMarkMini from '/src/icons/x-mark-mini.svg?react';
import ExclamationTriangleIcon from '@/icons/exclamation-triangle.svg?react';
import InformationCircleIcon from '@/icons/information-circle.svg?react';

interface Props {
  open: boolean;
  lang?: SupportedLanguages;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmSubmitReviewModal({
  open,
  lang = 'es',
  onCancel,
  onConfirm,
}: Props) {
  const t = getTranslation(lang);

  const title =
    t.hostContent?.editListing?.commonComponents?.modal?.confirmSubmitReview
      ?.title;

  const p1 =
    t.hostContent?.editListing?.commonComponents?.modal?.confirmSubmitReview
      ?.p1;

  const p2 =
    t.hostContent?.editListing?.commonComponents?.modal?.confirmSubmitReview
      ?.p2;

  const labelConfirm =
    t.hostContent?.editListing?.commonComponents?.modal?.confirmSubmitReview
      ?.confirm;

  const labelBack =
    t.hostContent?.editListing?.commonComponents?.modal?.confirmSubmitReview
      ?.back;

  return (
    <Modal
      open={open}
      onClose={onCancel}
      topLeftButton={false}
      topRightAction={
        <button
          type="button"
          onClick={onCancel}
          aria-label={lang === 'es' ? 'Cerrar' : 'Close'}
          className="flex h-8 w-8 items-center justify-center rounded-[16px] transition hover:bg-[var(--color-base-200-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          <XMarkMini className="h-[14px] w-[14px]" />
        </button>
      }
      title={title}
      subtitle={undefined}
      titleClass="text-2xl md:text-2xl leading-8 font-bold"
      titleTextColorClass="text-[color:var(--color-base-content)]"
      TitleSubtitleContentClass="text-left mx-0 flex w-full flex-col items-start"
      backgroundColorClass="bg-[var(--color-base-150)]"
      headerBgClass="bg-[var(--color-base-150)]"
      widthClass="w-full max-w-md md:max-w-[438px]"
      heightClass="max-h-[95vh]"
      contentClassName="w-full flex flex-col items-start gap-4 md:gap-6 px-6 md:px-8 py-4 md:py-6"
      showCancelButton={false}
      footerFullWidth
      footerPaddingClass="px-6 md:px-8 pt-2 pb-6 md:pt-4 md:pb-8"
      footer={
        <div className="flex w-full flex-col-reverse gap-3 md:flex-row md:items-start md:justify-between">
          <AppButton
            type="button"
            variant="dangerGhost"
            size="lg"
            rounded
            onClick={onConfirm}
            label={
              <span className="text-[var(--color-success)]">
                {labelConfirm}
              </span>
            }
            className="h-12 w-full px-4 md:h-16 md:w-auto md:min-w-[200px]"
          />
          <AppButton
            type="button"
            rounded
            onClick={onCancel}
            label={labelBack}
            className="h-12 w-full bg-[var(--color-primary)] px-4 text-sm text-[var(--color-primary-content)] shadow-sm hover:opacity-90 md:h-16 md:w-auto md:min-w-[160px]"
          />
        </div>
      }
      escToClose={false}
      closeOnBackdropClick={false}
    >
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full items-start gap-3">
          <span className="mt-1 flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-[var(--color-info-bg)]" />
          </span>
          <p className="leading-6 text-[color:var(--color-base-content)]">
            {p1}
          </p>
        </div>

        <div className="flex w-full items-start gap-3">
          <span className="mt-1 flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-[var(--color-warning)]" />
          </span>
          <p className="leading-6 text-[color:var(--color-base-content)]">
            {p2}
          </p>
        </div>
      </div>
    </Modal>
  );
}

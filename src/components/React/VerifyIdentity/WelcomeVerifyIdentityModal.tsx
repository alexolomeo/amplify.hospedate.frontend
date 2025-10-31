import Modal from '@/components/React/Common/Modal';
import AppButton from '@/components/React/Common/AppButton';
import XMarkMini from '/src/icons/x-mark-mini.svg?react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import EmphasizePart from '../Common/EmphazisePart';

type Props = {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  lang?: SupportedLanguages;
};

export default function WelcomeVerifyIdentityModal({
  open,
  onClose,
  onContinue,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnBackdropClick={false}
      title={t.profile.idv.noticeTitle}
      topLeftButton={false}
      topRightAction={
        <button
          aria-label={t.profile.idv.noticeClose}
          onClick={onClose}
          className="hover:bg-base-200 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[16px] bg-[var(--color-base-150)]"
        >
          <XMarkMini className="text-base-content h-[14px] w-[14px]" />
        </button>
      }
      widthClass="w-[min(92vw,476px)]"
      heightClass="max-h-[85vh]"
      backgroundColorClass="bg-[var(--color-base-150)]"
      titleClass="text-2xl leading-9 font-bold text-base-content"
      TitleSubtitleContentClass="text-center mx-auto flex max-w-[80%] flex-col items-center"
      centerContent
      showCancelButton={false}
      contentClassName="flex-col items-center gap-3 md:gap-6 px-3 md:px-6 py-2 md:py-5"
      footerPaddingClass="px-6 pt-2 pb-6"
      footerFullWidth
      footer={
        <AppButton
          label={t.profile.idv.noticeCta}
          onClick={onContinue}
          size="md"
          fontSemibold
          className="btn-block !h-12 !min-h-12 text-base md:!h-12 md:!min-h-12"
        />
      }
    >
      <img
        src="/images/verify-identity/dni.webp"
        alt={t.profile.idv.noticeId}
        className="h-auto w-[158px] select-none"
        loading="eager"
        decoding="async"
      />

      <div className="text-base-content text-center leading-7">
        <EmphasizePart
          text={t.profile.idv.noticeMessage}
          emphasize={t.profile.idv.noticeRolesEmphasis}
        />
      </div>
    </Modal>
  );
}

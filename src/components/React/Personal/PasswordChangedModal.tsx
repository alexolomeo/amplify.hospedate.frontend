import CheckBadgeSolidIcon from '/src/icons/check-badge-solid.svg?react';
import Modal from '../Common/Modal';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface PasswordChangedModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lang: SupportedLanguages;
}

export default function PasswordChangedModal({
  open,
  onClose,
  onConfirm,
  lang,
}: PasswordChangedModalProps) {
  const t = getTranslation(lang).users;

  return (
    <Modal
      open={open}
      onClose={onClose}
      showCancelButton={false}
      widthClass="max-w-[320px]"
      footer={
        <button
          onClick={onConfirm}
          className="bg-primary flex h-12 w-full items-center justify-center rounded-full px-6 shadow-sm"
        >
          <span className="text-base-100 text-sm font-semibold">
            {t.confirmButton}
          </span>
        </button>
      }
    >
      <div className="bg-base-150 relative flex flex-row items-center justify-center gap-8 rounded-[40px]">
        <div className="flex w-full flex-col items-center gap-2">
          <CheckBadgeSolidIcon className="text-success h-12 w-12" />
          <div className="text-neutral-10 flex w-full items-center justify-center px-6 text-center text-lg font-normal">
            {t.passwordChangedSuccess}
          </div>
        </div>
      </div>
    </Modal>
  );
}

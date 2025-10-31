import React from 'react';
import Modal from '../Common/Modal';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import CloseIcon from '/src/icons/x-mark-mini.svg?react';

interface ModalDeactivateAccountProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  lang: SupportedLanguages;
  loading?: boolean;
  error?: string | null;
}

export default function ModalDeactivateAccount({
  open,
  onClose,
  onConfirm,
  lang,
  loading = false,
  error = null,
}: ModalDeactivateAccountProps) {
  const t = getTranslation(lang);

  function handleSubmit() {
    if (loading || !onConfirm) return;
    onConfirm();
  }

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      title={t.users.modal.deactivateAccountTitle}
      lang={lang}
      showCancelButton={false}
      topLeftButton={false}
      TitleSubtitleContentClass="text-center flex max-w-[80%] flex-col items-center"
      titleClass="text-xl leading-7 font-semibold text-error"
      widthClass="md:max-w-sm"
      heightClass="md:max-h-lg"
      backgroundColorClass="bg-[var(--color-error-content)]"
      footerPaddingClass="px-5 pt-2 pb-2 md:px-3 md:pt-4 md:pb-4"
    >
      <div className="w-full">
        <CloseIcon
          className="absolute top-4 right-10 mt-1 h-6 w-6 cursor-pointer md:top-6 md:mt-0"
          onClick={onClose}
        />
        <>
          <div className="text-base">
            {t.users.modal.deactivateAccountDescription}
          </div>
          {error && (
            <div className="text-error mt-4 text-center text-sm">{error}</div>
          )}
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="bg-error text-primary-content flex w-full cursor-pointer items-center justify-center rounded-full px-2 py-4 text-sm shadow-sm disabled:opacity-60"
              disabled={loading}
            >
              {t.users.modal.goBack}
            </button>
            <button
              onClick={handleSubmit}
              className="text-primary flex cursor-pointer items-center justify-center rounded-full px-2 pt-4 text-sm underline disabled:opacity-60"
              disabled={loading}
            >
              {loading
                ? t.users.modal.deactivating || 'Procesando...'
                : t.users.modal.deactivateAccountConfirm}
            </button>
          </div>
        </>
      </div>
    </Modal>
  );
}

import React from 'react';
import Modal from '../../Common/Modal';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import CloseIcon from '/src/icons/x-mark-mini.svg?react';

interface ModalRejectRequestProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (payload: { isConfirmed: boolean }) => void;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
  loading?: boolean;
  error?: string | null;
}

export default function ModalRejectRequest({
  open,
  onClose,
  onSubmit,
  t,
  lang,
  loading = false,
  error = null,
}: ModalRejectRequestProps) {
  function handleSubmit() {
    if (!loading) {
      onSubmit?.({ isConfirmed: false });
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={translate(t, 'tripDetail.modal.rejectRequest')}
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
            {translate(t, 'tripDetail.modal.areYouSureReject')}
          </div>
          {error && (
            <div className="text-error mt-4 text-center text-sm">{error}</div>
          )}
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="bg-error text-primary-content flex cursor-pointer items-center justify-center rounded-full px-2 py-4 text-sm shadow-sm disabled:opacity-60 md:w-full"
              disabled={loading}
            >
              {translate(t, 'tripDetail.modal.goBack')}
            </button>
            <button
              onClick={handleSubmit}
              className="text-primary flex cursor-pointer items-center justify-center rounded-full px-2 pt-4 text-sm underline disabled:opacity-60"
              disabled={loading}
            >
              {loading
                ? translate(t, 'tripDetail.modal.loading') || 'Loading...'
                : translate(t, 'tripDetail.modal.yesToReject')}
            </button>
          </div>
        </>
      </div>
    </Modal>
  );
}

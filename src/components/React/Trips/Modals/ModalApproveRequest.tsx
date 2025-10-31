import React from 'react';
import Modal from '../../Common/Modal';
import { translate, type SupportedLanguages } from '@/utils/i18n';

import CloseIcon from '/src/icons/x-mark-mini.svg?react';

interface ModalApproveRequestProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSubmit?: (payload: { isConfirmed: boolean }) => void;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
  loading?: boolean;
  error?: string | null;
  success?: boolean;
}

export default function ModalApproveRequest({
  open,
  onClose,
  onSubmit,
  onSuccess,
  t,
  lang,
  loading = false,
  error = null,
  success = false,
}: ModalApproveRequestProps) {
  function handleSubmit() {
    if (!loading) {
      onSubmit?.({ isConfirmed: true });
    }
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={translate(
        t,
        success
          ? 'tripDetail.modal.requestApproved'
          : 'tripDetail.modal.approveRequest'
      )}
      lang={lang}
      showCancelButton={false}
      topLeftButton={false}
      TitleSubtitleContentClass="text-center flex max-w-[80%] flex-col items-center"
      titleClass="text-xl leading-7 font-semibold"
      widthClass="md:max-w-sm"
      heightClass="md:max-h-lg"
      footerPaddingClass="px-5 pt-2 pb-2 md:px-3 md:pt-4 md:pb-4"
    >
      <div className="w-full">
        <CloseIcon
          className="absolute top-4 right-10 mt-1 h-6 w-6 cursor-pointer md:top-6 md:mt-0"
          onClick={() => {
            onClose();
          }}
        />

        {!success ? (
          <>
            <div className="text-base">
              {translate(t, 'tripDetail.modal.areYouSureApprove')}
            </div>
            {error && (
              <div className="text-error mt-4 -mb-4 text-center text-xs">
                {error}
              </div>
            )}
            <div className="mt-8 flex w-full flex-col items-center justify-center gap-3">
              <button
                onClick={handleSubmit}
                className="bg-primary text-primary-content flex cursor-pointer items-center justify-center rounded-full px-2 py-4 text-sm shadow-sm disabled:opacity-60 md:w-full"
                disabled={loading}
              >
                {loading
                  ? translate(t, 'tripDetail.modal.loading') || 'Loading...'
                  : translate(t, 'tripDetail.modal.yesToApprove')}
              </button>
              <button
                onClick={onClose}
                className="text-primary flex cursor-pointer items-center justify-center rounded-full px-2 pt-4 text-sm underline disabled:opacity-60"
                disabled={loading}
              >
                {translate(t, 'tripDetail.modal.goBack')}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="frame-228 flex w-full flex-col items-center gap-2">
              <img
                src="/images/like3d.webp"
                alt="Thumbs up"
                className="h-[120px] w-[120px] rounded-md object-cover sm:h-[159px] sm:w-[172px]"
              />
              <p className="m-auto w-full text-center font-semibold">
                {translate(t, 'tripDetail.modal.youApprovedRequest')}
              </p>
            </div>

            <div className="mt-8 flex w-full flex-col items-center justify-center gap-3">
              <button
                onClick={onSuccess}
                className="bg-primary text-primary-content flex cursor-pointer items-center justify-center rounded-full px-2 py-4 text-sm shadow-sm md:w-full"
              >
                {translate(t, 'tripDetail.modal.goBackActivities')}
              </button>
              <button
                onClick={onClose}
                className="text-primary flex cursor-pointer items-center justify-center rounded-full px-2 pt-4 text-sm underline"
              >
                {translate(t, 'tripDetail.modal.watchDetails')}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

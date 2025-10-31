import React, { useEffect, useRef, useState } from 'react';
import Modal from '@/components/React/Common/Modal';
import AppButton from '@/components/React/Common/AppButton';
import XMarkMini from '/src/icons/x-mark-mini.svg?react';
import LoadingSpinner from '@/components/React/Common/LoadingSpinner';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirmDone: () => void;
  qrSrc?: string;
  lang?: SupportedLanguages;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  expiresAt?: string;
};

const isExpiredAt = (iso?: string): boolean =>
  !iso ? false : new Date(iso).getTime() <= Date.now();

export default function VerifyIdentityQrModal({
  open,
  onClose,
  onConfirmDone,
  qrSrc,
  lang = 'es',
  loading = false,
  error = null,
  onRetry,
  expiresAt,
}: Props) {
  const t = getTranslation(lang);

  const [expired, setExpired] = useState<boolean>(() => isExpiredAt(expiresAt));
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (open && expiresAt) {
      const msLeft = new Date(expiresAt).getTime() - Date.now();
      if (msLeft <= 0) {
        setExpired(true);
      } else {
        setExpired(false);
        timeoutRef.current = window.setTimeout(() => setExpired(true), msLeft);
      }
    } else {
      setExpired(false);
    }
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [open, expiresAt]);

  const disableConfirm = loading || !qrSrc || expired;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnBackdropClick={false}
      title={t.profile.idv.qrTitle}
      subtitle={undefined}
      topLeftButton={false}
      topRightAction={
        <button
          aria-label={t.commonComponents.modal.close}
          onClick={onClose}
          className="hover:bg-base-200 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[16px] bg-[var(--color-base-150)]"
        >
          <XMarkMini className="text-base-content h-[14px] w-[14px]" />
        </button>
      }
      widthClass="w-[min(92vw,476px)]"
      heightClass="max-h-[100vh]"
      backgroundColorClass="bg-[var(--color-base-150)]"
      titleClass="text-2xl leading-8 md:leading-9 font-bold text-base-content"
      TitleSubtitleContentClass="mx-auto w-full text-left"
      centerContent
      showCancelButton={false}
      contentClassName="flex-1 overflow-y-auto flex-col items-center gap-4 px-4 pt-4 pb-2 md:gap-3 md:px-6 md:pt-6"
      footerPaddingClass="px-6 pt-2 pb-6"
      footerFullWidth
      footer={
        <AppButton
          label={t.profile.idv.qrCtaDone}
          onClick={onConfirmDone}
          size="md"
          fontSemibold
          disabled={disableConfirm}
          className="btn-block !h-12 !min-h-12 md:!h-12 md:!min-h-12"
        />
      }
    >
      {/* QR / Loading / Error / Expired */}
      <div className="flex w-full flex-col items-center gap-3">
        <div className="flex w-full justify-center">
          {loading ? (
            <div className="bg-base-100 relative aspect-square w-[min(68vw,246px)] rounded-xl shadow-sm md:w-60">
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner size="lg" lang={lang} message="" />
              </div>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-error text-sm md:text-base">
                {t.profile.idv.qrErrorGeneric}
              </p>
              {onRetry && (
                <div className="mt-2">
                  <AppButton
                    variant="link"
                    size="sm"
                    label={t.profile.idv.qrRetry}
                    onClick={onRetry}
                  />
                </div>
              )}
            </div>
          ) : expired ? (
            <div className="text-center">
              <p className="text-warning text-sm md:text-base">
                {t.profile.idv.qrExpired}
              </p>
              {onRetry && (
                <div className="mt-2">
                  <AppButton
                    variant="link"
                    size="sm"
                    label={t.profile.idv.qrGenerateNew}
                    onClick={onRetry}
                  />
                </div>
              )}
            </div>
          ) : (
            <img
              src={qrSrc ?? '/images/verify-identity/qr-demo.webp'}
              alt={t.profile.idv.qrImageAlt}
              loading="eager"
              decoding="async"
              className="bg-base-100 aspect-square w-[min(68vw,246px)] rounded-xl p-1 shadow-sm select-none md:w-60"
            />
          )}
        </div>
      </div>

      {/* List */}
      <ol className="text-base-content w-full list-decimal space-y-2 pl-5 text-sm leading-6 sm:text-base md:leading-7">
        {t.profile.idv.qrSteps.map((step, i) => (
          <li className="text-left" key={i}>
            {step}
          </li>
        ))}
      </ol>
    </Modal>
  );
}

import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import XMarkMini from '/src/icons/x-mark-mini.svg?react';
import React, { useEffect, useRef } from 'react';

export interface CommonModalProps {
  open: boolean;
  topRightAction?: React.ReactNode;
  title?: string | null;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
  widthClass?: string;
  heightClass?: string;
  backgroundColorClass?: string;
  titleTextColorClass?: string;
  centerContent?: boolean;
  showCancelButton?: boolean;
  lang?: SupportedLanguages;
  subtitleClass?: string;
  titleClass?: string;
  TitleSubtitleContentClass?: string;
  topLeftButton?: boolean;
  TextCancelar?: string;
  showSkipForNow?: boolean;
  contentClassName?: string;
  headerBgClass?: string;
  footerLeft?: React.ReactNode;
  ariaLabelledbyId?: string;
  ariaDescribedbyId?: string;
  escToClose?: boolean;
  footerFullWidth?: boolean;
  footerPaddingClass?: string;
  closeOnBackdropClick?: boolean;
  closeDisabled?: boolean;
}

export default function Modal({
  open,
  topRightAction,
  title,
  subtitle,
  children,
  footer,
  onClose,
  widthClass = 'md:max-w-[580px]',
  heightClass = 'md:max-h-[calc(95vh-200px)]',
  backgroundColorClass = 'bg-[var(--color-primary-content)]',
  titleTextColorClass = 'text-base-content',
  centerContent = false,
  showCancelButton = true,
  lang = 'es',
  subtitleClass = 'text-base-content text-sm leading-[14px] font-normal',
  titleClass = 'text-xl leading-7 font-normal',
  TitleSubtitleContentClass = 'text-center mx-auto flex max-w-[80%] flex-col items-center md:max-w-[270px]',
  topLeftButton = true,
  showSkipForNow = false,
  contentClassName,
  headerBgClass,
  footerLeft,
  ariaLabelledbyId,
  ariaDescribedbyId,
  escToClose = false,
  footerFullWidth = false,
  footerPaddingClass = 'px-5 pt-2 pb-6 md:px-3 md:pt-4 md:pb-10',
  closeOnBackdropClick = true,
  closeDisabled = false,
}: CommonModalProps) {
  const t = getTranslation(lang);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!escToClose || !open || closeDisabled) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [escToClose, open, closeDisabled, onClose]);

  const centerCls = centerContent
    ? 'items-center justify-center text-center'
    : 'items-start';

  const contentCls = contentClassName
    ? `flex ${centerCls} ${contentClassName}`
    : `flex max-h-[calc(95vh-200px)] flex-wrap gap-4 overflow-y-auto px-5 py-2 md:gap-6 md:px-8 ${centerCls}`;

  return (
    <dialog
      ref={dialogRef}
      className={`modal ${open ? 'modal-open' : ''}`}
      aria-labelledby={ariaLabelledbyId}
      aria-describedby={ariaDescribedbyId}
    >
      <div
        className={`modal-box flex flex-col md:w-full ${widthClass} ${heightClass ?? ''} overflow-hidden rounded-[40px] ${backgroundColorClass ?? 'bg-[var(--color-primary-content)]'} p-0`}
      >
        {/* HEADER */}
        <div
          className={`${headerBgClass ?? 'bg-base-150'} relative flex items-center justify-between rounded-t-[40px] px-12 pt-4 pb-4 md:px-10 md:pt-5 md:pb-5`}
        >
          {topLeftButton && (
            <button
              onClick={closeDisabled ? undefined : onClose}
              disabled={closeDisabled}
              aria-label={lang === 'es' ? 'Cerrar' : 'Close'}
              className={`absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-[16px] ${closeDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <XMarkMini className="h-[14px] w-[14px]" />
            </button>
          )}

          <div className={TitleSubtitleContentClass}>
            {title && (
              <h3
                id={ariaLabelledbyId}
                className={`${titleClass} ${titleTextColorClass}`}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p id={ariaDescribedbyId} className={subtitleClass}>
                {subtitle}
              </p>
            )}
          </div>

          {topRightAction && (
            <div className="absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[16px]">
              {topRightAction}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className={contentCls}>{children}</div>

        {/* FOOTER */}
        <div
          className={`bg-base-150 flex items-center rounded-b-[40px] ${footerPaddingClass} ${
            !showCancelButton && footer ? 'justify-center' : 'justify-between'
          }`}
        >
          {showCancelButton ? (
            (footerLeft ?? (
              <button
                onClick={closeDisabled ? undefined : onClose}
                disabled={closeDisabled}
                className={`flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold ${closeDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                {showSkipForNow
                  ? t.commonComponents.modal.skipForNow
                  : t.commonComponents.modal.close}
              </button>
            ))
          ) : (
            <div />
          )}

          {showCancelButton ? (
            <div className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-7">
              {footer}
            </div>
          ) : footerFullWidth ? (
            <div className="flex w-full px-4">{footer}</div>
          ) : (
            <div className="flex w-full justify-center px-4">
              <div className="flex w-full max-w-[320px]">{footer}</div>
            </div>
          )}
        </div>
      </div>

      <div
        className="modal-backdrop"
        onClick={closeOnBackdropClick && !closeDisabled ? onClose : undefined}
      />
    </dialog>
  );
}

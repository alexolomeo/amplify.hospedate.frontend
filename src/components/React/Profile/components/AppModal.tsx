import React, { useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';

interface AppModalProps {
  id: string;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showHeader?: boolean;
  maxWidth?: string;
  maxHeight?: string;
  maxHeightBody?: string;
  bgColor?: string;
  titleSize?: string;
  isOpen: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export function AppModal({
  id,
  title = '',
  children,
  footer,
  showHeader = true,
  maxWidth = 'max-w-[440px]',
  maxHeight = 'max-h-[100vh]',
  maxHeightBody = 'max-h-[64vh]',
  bgColor = 'bg-[var(--color-primary-content)]',
  titleSize = 'text-2xl',
  showCloseButton = true,
  isOpen,
  onClose,
}: AppModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const handleNativeModalClose = useCallback(() => onClose?.(), [onClose]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (isOpen) {
      if (!el.open) el.showModal();
    } else {
      if (el.open) el.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    el.addEventListener('close', handleNativeModalClose);
    return () => el.removeEventListener('close', handleNativeModalClose);
  }, [handleNativeModalClose]);

  return (
    <dialog
      id={id}
      className={clsx('modal', { hidden: !isOpen })}
      ref={dialogRef}
    >
      <div
        className={clsx(
          'modal-box relative overflow-hidden rounded-[28px] p-0 shadow-xl',
          maxWidth,
          bgColor,
          maxHeight
        )}
      >
        {showHeader && (
          <div className="sticky top-0 z-10 bg-[var(--color-primary-content)] px-6 pt-6 pb-3">
            <div className="flex items-center justify-between">
              <h2 className={clsx('text-xl font-semibold', titleSize)}>
                {title}
              </h2>
              {showCloseButton && (
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-soft btn-primary">
                    ✕
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        <div
          className={clsx(
            'no-scrollbar overflow-y-auto px-6 pb-6',
            maxHeightBody
          )}
        >
          {children}
        </div>

        {footer && <div className="sticky bottom-0 px-6 py-4">{footer}</div>}
      </div>
    </dialog>
  );
}

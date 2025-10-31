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
  maxWidth = 'max-w-md',
  maxHeight = 'max-h-[80vh]',
  maxHeightBody = 'max-h-[70vh]',
  bgColor = 'bg-base-100',
  titleSize = 'text-xl md:text-2xl lg:text-3xl',
  showCloseButton = true,
  isOpen,
  onClose,
}: AppModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const handleNativeModalClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (dialogElement) {
      if (isOpen) {
        if (!dialogElement.open) {
          dialogElement.showModal();
        }
      } else {
        if (dialogElement.open) {
          dialogElement.close();
        }
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (dialogElement) {
      dialogElement.addEventListener('close', handleNativeModalClose);
    }

    return () => {
      if (dialogElement) {
        dialogElement.removeEventListener('close', handleNativeModalClose);
      }
    };
  }, [handleNativeModalClose]);

  return (
    <dialog
      id={id}
      className={clsx('modal', { hidden: !isOpen })}
      ref={dialogRef}
    >
      <div
        className={clsx(
          'modal-box relative rounded-[40px]', // p-0 padding
          maxWidth,
          bgColor,
          maxHeight
        )}
      >
        {/* HEADER */}
        {showHeader && (
          <div className="sticky top-0 z-10 pt-4">
            <div className="mb-4 flex items-center justify-between">
              {/* Title */}
              <div
                className={clsx('self-stretch leading-9 font-bold', titleSize)}
                data-testid={`test-${id}-title`}
              >
                {title}
              </div>
              {/* Close button */}
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

        {/* CONTENT */}
        <div className={clsx('overflow-y-auto', maxHeightBody)}>{children}</div>

        {/* FOOTER */}
        {footer && (
          <div
            className={clsx(
              'bg-base-150 flex items-center rounded-b-[40px] px-5 pt-2 pb-6 md:px-3 md:pt-4 md:pb-10',
              {
                'justify-center': !showCloseButton && footer,
                'justify-between': showCloseButton || footer,
              }
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </dialog>
  );
}

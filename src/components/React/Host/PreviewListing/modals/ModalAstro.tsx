import * as React from 'react';
import clsx from 'clsx';

export type ModalAstroProps = {
  open: boolean;
  onClose: () => void;

  id?: string;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  maxWidth?: string;
  maxHeight?: string;
  maxHeightBody?: string;
  bgColor?: string;

  children: React.ReactNode;
  footer?: React.ReactNode;

  closeOnBackdropClick?: boolean;
  escToClose?: boolean;
};

export default function ModalAstro({
  open,
  onClose,
  id = 'default-modal',
  title = '',
  showHeader = true,
  showFooter = true,
  maxWidth = 'max-w-md',
  maxHeight = 'max-h-[80vh]',
  maxHeightBody = 'max-h-[70vh]',
  bgColor = '',
  children,
  footer,
  closeOnBackdropClick = true,
  escToClose = true,
}: ModalAstroProps): React.JSX.Element | null {
  React.useEffect(() => {
    if (!escToClose || !open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [escToClose, open, onClose]);

  if (!open) return null;

  return (
    <dialog
      id={id}
      open={open}
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={showHeader ? `${id}-title` : undefined}
    >
      <div
        className={clsx(
          'modal-box relative rounded-[40px]',
          maxWidth,
          bgColor,
          maxHeight
        )}
      >
        {showHeader && (
          <div className="sticky top-0 z-10">
            <div className="mb-4 flex items-center justify-between">
              <div
                id={`${id}-title`}
                className="self-stretch text-xl leading-9 font-bold md:text-2xl lg:text-3xl"
              >
                {title}
              </div>
              <button
                type="button"
                className="btn btn-circle"
                aria-label="Cerrar"
                onClick={onClose}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className={clsx('overflow-y-auto', maxHeightBody)}>{children}</div>

        {showFooter && (
          <div className="mt-4 flex justify-end">
            {footer ?? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                Cerrar
              </button>
            )}
          </div>
        )}
      </div>

      <div
        className="modal-backdrop"
        onClick={closeOnBackdropClick ? onClose : undefined}
      />
    </dialog>
  );
}

import clsx from 'clsx';
import XMarkMini from '/src/icons/x-mark-mini.svg?react';
import InformationCircleSolidIcon from '/src/icons/information-circle-solid.svg?react';

type ToastType = 'error' | 'warning' | 'success';

interface ToastProps {
  type?: ToastType;
  message: string;
  visible?: boolean;
  showButtons?: boolean;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  onClose?: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  className?: string;
}

const toastStyles: Record<ToastType, string[]> = {
  error: [
    'border-[var(--color-error)]',
    'bg-[var(--color-error-content)]',
    'text-[var(--color-error)]',
  ],
  warning: [
    'border-[var(--color-warning)]',
    'bg-[var(--color-base-100)]',
    'text-[var(--color-warning)]',
  ],
  success: [
    'border-[var(--color-primary)]',
    'bg-[var(--color-base-150)]',
    'text-[var(--color-primary)]',
  ],
};

export default function Toast({
  type = 'error',
  message,
  visible = true,
  showButtons = true,
  onPrimaryClick,
  onSecondaryClick,
  onClose,
  primaryLabel = 'Confirm',
  secondaryLabel = 'Cancel',
  className = '',
}: ToastProps) {
  const [border, background, text] = toastStyles[type];

  return (
    <div
      className={clsx(
        'flex w-full flex-col items-end gap-3 rounded-xl border px-3 py-3 transition-opacity duration-300 sm:max-w-sm sm:px-4 sm:py-2',
        border,
        background,
        visible ? 'opacity-100' : 'opacity-0',
        className
      )}
    >
      <div className="flex w-full items-start gap-2">
        <InformationCircleSolidIcon
          className={clsx('mt-0.5 h-5 w-5 flex-shrink-0 sm:h-6 sm:w-6', text)}
        />
        <p
          className={clsx(
            'flex-1 text-sm leading-5 font-normal sm:text-sm',
            text
          )}
        >
          {message}
        </p>
        <button onClick={onClose} className={clsx('ml-1 flex-shrink-0', text)}>
          <XMarkMini className="h-5 w-5" />
        </button>
      </div>

      {showButtons && (
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            onClick={onPrimaryClick}
            className={clsx(
              'flex h-8 cursor-pointer items-center justify-center gap-2 rounded-md border px-4 text-sm shadow-sm sm:h-6 sm:px-2',
              border,
              text
            )}
          >
            {primaryLabel}
          </button>
          <button
            onClick={onSecondaryClick}
            className={clsx(
              'flex h-8 cursor-pointer items-center justify-center gap-2 rounded-xl bg-transparent px-4 text-sm underline sm:h-6 sm:px-2',
              text
            )}
          >
            {secondaryLabel}
          </button>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import ErrorIcon from '@/icons/error.svg?react';
import {
  type SupportedLanguages,
  getTranslation,
  translate,
} from '@/utils/i18n';

interface ErrorStateProps {
  /** The error message to display */
  message: string;
  /** Optional title for the error */
  title?: string;
  /** Callback function for retry action */
  onRetry?: () => void;
  /** Label for the retry button */
  retryLabel?: string;
  /** Language for proper styling */
  lang?: SupportedLanguages;
  /** Custom icon to display (optional) */
  icon?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show retry button */
  showRetry?: boolean;
  /** Size variant for the error state */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the retry action is loading */
  isRetrying?: boolean;
  /** Custom retry button variant */
  retryVariant?: 'primary' | 'secondary' | 'outline';
  /** Label for retry loading state */
  retryingLabel?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  title,
  onRetry,
  retryLabel,
  lang = 'es',
  icon,
  className = '',
  showRetry = true,
  size = 'md',
  isRetrying = false,
  retryVariant = 'primary',
  retryingLabel,
}) => {
  const t = getTranslation(lang);
  const sizeClasses = {
    sm: {
      container: 'py-12',
      icon: 'h-12 w-12',
      iconInner: 'h-6 w-6',
      title: 'text-base font-medium',
      message: 'text-sm max-w-xs',
      button: 'px-3 py-1.5 text-xs',
    },
    md: {
      container: 'py-20',
      icon: 'h-16 w-16',
      iconInner: 'h-8 w-8',
      title: 'text-lg font-semibold',
      message: 'text-base max-w-md',
      button: 'px-4 py-2 text-sm',
    },
    lg: {
      container: 'py-24',
      icon: 'h-20 w-20',
      iconInner: 'h-10 w-10',
      title: 'text-xl font-bold',
      message: 'text-lg max-w-lg',
      button: 'px-6 py-3 text-base',
    },
  };

  const buttonVariants = {
    primary:
      'bg-primary hover:bg-primary/80 text-primary-content focus:ring-primary',
    secondary:
      'bg-neutral hover:bg-neutral/80 text-neutral-content focus:ring-neutral',
    outline: 'border-2 border-info text-info hover:bg-info/10 focus:ring-info',
  };

  const currentSize = sizeClasses[size];

  const defaultIcon = (
    <ErrorIcon className={`${currentSize.iconInner} text-error`} />
  );

  // Use translation keys if not provided as props
  const resolvedTitle =
    title ?? translate(t, 'error.defaultTitle') ?? 'Something went wrong';
  const resolvedRetryLabel =
    retryLabel ?? translate(t, 'error.retry') ?? 'Retry';
  const resolvedRetryingLabel =
    retryingLabel ?? translate(t, 'error.retrying') ?? 'Retrying...';

  return (
    <section
      className={`flex flex-col items-center justify-center ${currentSize.container} ${className}`}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Icon */}
        <div
          className={`flex ${currentSize.icon} bg-error-content items-center justify-center rounded-full`}
        >
          {icon || defaultIcon}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className={`${currentSize.title} text-base-content`}>
            {resolvedTitle}
          </h3>
          <p className={`${currentSize.message} text-neutral`}>{message}</p>
        </div>

        {/* Retry Button */}
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className={`inline-flex items-center gap-2 rounded-lg ${currentSize.button} font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${buttonVariants[retryVariant]}`}
          >
            {isRetrying ? resolvedRetryingLabel : resolvedRetryLabel}
          </button>
        )}
      </div>
    </section>
  );
};

export default ErrorState;

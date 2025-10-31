import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  lang?: SupportedLanguages;
}

export default function LoadingSpinner({
  message,
  size = 'lg',
  className = '',
  lang = 'es',
}: LoadingSpinnerProps) {
  const t = getTranslation(lang);

  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-4 ${className}`}
    >
      <span
        className={`loading loading-spinner loading-${size} text-primary`}
      />
      <p className="text-sm text-gray-600">
        {message ??
          translate(t, 'commonComponents.loadingSpinner.defaultMessage')}
      </p>
    </div>
  );
}

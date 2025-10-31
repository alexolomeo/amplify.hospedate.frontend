import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import AppButton from '../../Common/AppButton';

interface Props {
  lang?: SupportedLanguages;
  title?: string;
  message?: string;
  onClose: () => void;
}

const ConfirmationStep: React.FC<Props> = ({
  lang = 'es',
  title,
  message,
  onClose,
}) => {
  const t = getTranslation(lang);

  return (
    <div className="space-y-6 text-center">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-base-content mb-2 text-2xl font-semibold">
          {title || t.auth.welcomeTitle}
        </h1>
        <p className="text-neutral text-sm">
          {message || t.auth.welcomeMessage}
        </p>
      </div>

      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="bg-success flex h-16 w-16 items-center justify-center rounded-full">
          <svg
            className="text-success-content h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Continue Button */}
      <AppButton
        label={t.auth.continue}
        className="h-[48px] w-full"
        onClick={onClose}
      />
    </div>
  );
};

export default ConfirmationStep;

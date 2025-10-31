import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import AppButton from '@/components/React/Common/AppButton';
import EmphasizePart from '../Common/EmphazisePart';

interface MobileVerificationSuccessProps {
  onClose: () => void;
  lang?: SupportedLanguages;
}

export default function VerificationSuccess({
  onClose,
  lang = 'es',
}: MobileVerificationSuccessProps) {
  // Get translations
  const t = getTranslation(lang);

  return (
    <div className="relative flex min-h-full flex-col items-center bg-white px-6 py-4">
      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center py-4 text-center">
        {/* Title */}
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t.profile.idv.successTitle}
        </h2>

        {/* Image / Illustration */}
        <img
          src="/images/verify-identity/identity-verified.webp"
          alt="Identity Verified"
          className="mb-4 h-auto w-32 sm:w-40"
        />

        {/* Description */}
        <EmphasizePart
          className="text-base-content max-w-md text-center leading-7"
          text={t.profile.idv.successMessage}
          emphasize="Hospédate"
        />
      </div>

      <div className="pb-safe w-full max-w-sm flex-shrink-0 pt-4">
        <AppButton
          onClick={onClose}
          label={t.profile.idv.continue}
          className="w-full py-4 text-base sm:py-6 sm:text-lg"
        />
      </div>
    </div>
  );
}

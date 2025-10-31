import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import AppButton from '@/components/React/Common/AppButton';

interface DocumentsSubmittedProps {
  onClose: () => void;
  lang?: SupportedLanguages;
}

export default function DocumentsSubmitted({
  onClose,
  lang = 'es',
}: DocumentsSubmittedProps) {
  // Get translations
  const t = getTranslation(lang);

  const handleClose = () => {
    // Call the onClose callback which should handle navigation
    onClose();
  };

  return (
    <div className="bg-base-200 relative flex min-h-full flex-col px-4 py-4">
      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto py-4 text-center">
        {/* Image / Illustration */}
        <img
          src="/images/verify-identity/identity-verified.webp"
          alt="Documents Submitted"
          className="mb-6 h-auto w-40"
        />

        {/* Title */}
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          {t.profile.idv.documentsSubmittedTitle}
        </h2>

        {/* Message */}
        <div className="mb-6 max-w-sm text-center">
          <p className="mb-4 text-gray-600">
            {t.profile.idv.documentsSubmittedMessage}
          </p>
          <p className="text-sm text-gray-500">
            {t.profile.idv.documentsSubmittedNotification}
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-primary-content mx-auto mb-6 w-full max-w-sm rounded-2xl px-4 py-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                {t.profile.idv.documentsSubmittedInfoTitle}
              </h3>
              <p className="mt-1 text-xs text-gray-600">
                {t.profile.idv.documentsSubmittedInfoMessage}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="pb-safe mx-auto w-full max-w-sm flex-shrink-0 pt-4">
        <AppButton
          onClick={handleClose}
          label={t.profile.idv.documentsSubmittedButton}
          className="w-full py-4 text-base"
        />
      </div>
    </div>
  );
}

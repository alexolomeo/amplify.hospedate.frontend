import React from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface UploadingScreenProps {
  lang?: SupportedLanguages;
}

export default function UploadingScreen({ lang = 'es' }: UploadingScreenProps) {
  // Get translations
  const t = getTranslation(lang);

  return (
    <div className="bg-base-200 relative flex min-h-full flex-col items-center justify-center px-4 py-4">
      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto py-4 text-center">
        {/* Spinner */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <svg
              className="text-primary h-12 w-12 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          {t.profile.idv.uploadingTitle}
        </h2>

        {/* Message */}
        <p className="mb-6 max-w-sm text-center text-gray-600">
          {t.profile.idv.uploadingMessage}
        </p>

        {/* Progress indicator */}
        <div className="w-full max-w-sm">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>{t.profile.idv.uploadingProgress}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

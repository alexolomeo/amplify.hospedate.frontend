import React from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import type { RateLimitInfo } from '@/types/verify-identity/verification';
import { useKycStatusPolling } from '@/components/React/Hooks/useKycStatusPolling';

interface ProcessingScreenProps {
  lang?: SupportedLanguages;
  sessionToken?: string;
  onComplete?: (
    success: boolean,
    message?: string,
    rateLimitInfo?: RateLimitInfo
  ) => void;
  onError?: (error: string, rateLimitInfo?: RateLimitInfo) => void;
}

export default function ProcessingScreen({
  sessionToken,
  onComplete,
  onError,
  lang = 'es',
}: ProcessingScreenProps) {
  // Get translations
  const t = getTranslation(lang);

  const polling = useKycStatusPolling({
    sessionToken,
    enabled: Boolean(sessionToken),
    onComplete: (results) => {
      if (results?.verificationPassed) {
        onComplete?.(
          true,
          results.message || t.profile.idv.successMessage,
          polling.rateLimitInfo
        );
      } else {
        onComplete?.(
          false,
          results?.message || t.profile.idv.errorMessage,
          polling.rateLimitInfo
        );
      }
    },
    onError: (error) => {
      console.error('[KYC Polling] Error checking status:', error);
      onError?.(error, polling.rateLimitInfo);
    },
  });

  // Get processing status message
  const getStatusMessage = () => {
    if (polling.status === 'error') {
      return polling.error || t.profile.idv.errorMessage;
    }

    // Simple, honest messaging without fake progress stages
    if (polling.status === 'polling') {
      return t.profile.idv.processingStatusAnalyzing;
    }

    return t.profile.idv.processingTitle;
  };

  return (
    <div className="flex min-h-full flex-col bg-white">
      {/* Header */}
      <div className="px-4 pt-4 text-center">
        <h2 className="text-primary text-lg font-semibold">
          {t.profile.idv.noticeTitle}
        </h2>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-4">
        <p className="mb-2 text-gray-600">
          {t.profile.idv.processingWaitMessage}
        </p>

        {/* Loading animation */}
        <div className="mb-8">
          <div className="relative h-32 w-32">
            {/* Simple animated spinning circle - no fake progress */}
            <div className="border-t-primary absolute inset-0 animate-spin rounded-full border-4 border-transparent"></div>
            <div
              className="border-t-primary absolute inset-1 animate-spin rounded-full border-4 border-transparent opacity-40"
              style={{ animationDirection: 'reverse', animationDuration: '3s' }}
            ></div>
          </div>
        </div>

        {/* Processing message */}
        <div className="text-center">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            {t.profile.idv.processingMessage}
          </h2>

          {/* Status message */}
          <p className="mb-2 text-gray-600">{getStatusMessage()}</p>

          {/* Show polling info in development for debugging */}
          {import.meta.env.DEV && polling.currentInterval && (
            <p className="mt-2 text-xs text-gray-400">
              Attempt {polling.attemptCount} {' • '} Next check in{' '}
              {Math.round(polling.currentInterval / 1000)}s
            </p>
          )}

          {/* Error state */}
          {polling.status === 'error' && (
            <div className="mt-4 text-center text-red-600">
              <p>{polling.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

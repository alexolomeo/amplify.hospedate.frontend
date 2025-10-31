import React from 'react';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import type { RateLimitInfo } from '@/types/verify-identity/verification';
import AppButton from '@/components/React/Common/AppButton';
import EmphasizePart from '../Common/EmphazisePart';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MobileVerificationErrorProps {
  onRetry: () => void;
  lang?: SupportedLanguages;
  rateLimitInfo?: RateLimitInfo;
  errorMessage?: string;
}

export default function VerificationError({
  onRetry,
  rateLimitInfo,
  errorMessage,
  lang = 'es',
}: MobileVerificationErrorProps) {
  // Get translations
  const t = getTranslation(lang);

  // Get contact info from environment variables
  const supportEmail =
    import.meta.env.PUBLIC_SUPPORT_EMAIL || 'contacto@hospedatebolivia.com';
  const supportWhatsApp =
    import.meta.env.PUBLIC_SUPPORT_WHATSAPP || '+591 75321619';
  const supportWhatsAppUrl =
    import.meta.env.PUBLIC_SUPPORT_WHATSAPP_URL || 'https://wa.me/59175321619';

  // Check if user is locked out
  const isLockedOut =
    rateLimitInfo?.lockedUntil &&
    new Date(rateLimitInfo.lockedUntil) > new Date();

  // Check if user has no attempts left
  const noAttemptsLeft = rateLimitInfo?.remainingAttempts === 0;

  // Format locked until date
  const formatLockedUntil = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
  };

  // Get appropriate title based on status
  const getTitle = () => {
    if (isLockedOut || noAttemptsLeft) {
      return t.profile.idv.rateLimitTitle;
    }
    return t.profile.idv.errorTitle;
  };

  // Get appropriate description based on status
  const getDescription = () => {
    if (isLockedOut) {
      return t.profile.idv.rateLimitMessage
        .replace('{maxAttempts}', String(rateLimitInfo?.maxAttempts))
        .replace('{date}', formatLockedUntil(rateLimitInfo!.lockedUntil!));
    }

    if (noAttemptsLeft) {
      return t.profile.idv.rateLimitExhausted.replace(
        '{maxAttempts}',
        String(rateLimitInfo?.maxAttempts)
      );
    }

    return errorMessage || t.profile.idv.errorMessage;
  };

  // Get emphasized part of description
  const getEmphasizedText = () => {
    if (isLockedOut || noAttemptsLeft) {
      return t.profile.idv.rateLimitSupport;
    }
    return t.profile.idv.errorMessageRetry;
  };
  return (
    <div className="relative flex min-h-full flex-col items-center bg-white px-6 py-4">
      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto py-4 text-center">
        {/* Title */}
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {getTitle()}
        </h2>

        {/* Image / Illustration */}
        <img
          src="/images/verify-identity/identity-error.webp"
          alt="Verification Error"
          className="mb-4 h-auto w-32 sm:w-40"
        />

        {/* Description */}
        <EmphasizePart
          className="text-base-content text-center leading-7"
          text={getDescription()}
          emphasize={getEmphasizedText()}
        />

        {/* Rate Limit Information */}
        {rateLimitInfo && !isLockedOut && !noAttemptsLeft && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="mb-2 flex items-center">
              <svg
                className="mr-2 h-5 w-5 text-amber-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-amber-800">
                {t.profile.idv.attemptsRemaining}
              </span>
            </div>
            <p className="text-sm text-amber-700">
              {translate(t, 'profile.idv.attemptsRemainingMessage', {
                remaining: String(rateLimitInfo.remainingAttempts),
                max: String(rateLimitInfo.maxAttempts),
              })}
            </p>
          </div>
        )}

        {/* Support Contact for Locked Users */}
        {(isLockedOut || noAttemptsLeft) && (
          <div className="border-base-200 bg-base-200 mt-6 rounded-lg border p-4">
            <div className="text-center">
              <h3 className="mb-2 text-sm font-medium">
                {t.profile.idv.supportContact}
              </h3>
              <p className="text-neutral mb-3 text-sm">
                {t.profile.idv.supportMessage}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{supportEmail}</span>
                </div>
                <div className="flex items-center justify-center">
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>WhatsApp: {supportWhatsApp}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pb-safe w-full max-w-sm flex-shrink-0 pt-4">
        {!isLockedOut && !noAttemptsLeft ? (
          <AppButton
            onClick={onRetry}
            label={t.profile.idv.retryButton}
            className="w-full py-4 text-base sm:py-6 sm:text-lg"
          />
        ) : (
          <AppButton
            onClick={() => window.open(supportWhatsAppUrl, '_blank')}
            label={t.profile.idv.supportButton}
            className="bg-primary w-full py-4 text-base sm:py-6 sm:text-lg"
          />
        )}
      </div>
    </div>
  );
}

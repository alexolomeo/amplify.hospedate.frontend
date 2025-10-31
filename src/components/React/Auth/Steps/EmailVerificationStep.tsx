import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import AppButton from '../../Common/AppButton';
import { useState } from 'react';
import GoogleIcon from '/src/icons/google.svg?react';
import validator from 'validator';

interface Props {
  lang?: SupportedLanguages;
  onVerifyEmail: (email: string) => void;
  isVerifyingEmail: boolean;
  externalErrorMessage?: string | null;
  errorGoogleLogin?: string | null;
  onGoogleLogin?: () => void;
  isGoogleLoginInProgress: boolean;
}

const EmailVerificationStep: React.FC<Props> = ({
  lang = 'es',
  onVerifyEmail,
  isVerifyingEmail,
  externalErrorMessage,
  onGoogleLogin,
  isGoogleLoginInProgress,
  errorGoogleLogin,
}) => {
  const t = getTranslation(lang);
  const MAX_CHARS = 255;
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!validator.isEmail(email)) {
      setError(t.auth.invalidEmail);
      return;
    }
    setError('');
    onVerifyEmail(email.toLowerCase());
    setEmail('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-base-content mb-2 text-2xl font-semibold">
          {t.auth.title}
        </h1>
      </div>

      {/* Email Input */}
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-neutral text-xs">{t.auth.email}</p>
          <input
            type="email"
            value={email}
            maxLength={MAX_CHARS}
            data-testid="test-input-verification-email"
            className="register-input"
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="email"
            placeholder={t.auth.email}
          />
        </div>

        {/* Error Messages */}
        {(error || externalErrorMessage) && (
          <div className="alert alert-error">
            <span>{error || externalErrorMessage}</span>
          </div>
        )}

        {errorGoogleLogin && (
          <div className="alert alert-error">
            <span>{errorGoogleLogin}</span>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <AppButton
        label={isVerifyingEmail ? t.auth.loading : t.auth.continue}
        className="h-[48px] w-full"
        data-testid="test-button-verification-email"
        disabled={isVerifyingEmail || !email.trim()}
        onClick={handleSubmit}
      />

      {/* Divider */}
      <div className="divider text-neutral py-2 text-xs">{t.auth.maybe}</div>

      {/* Google Login Button */}
      <button
        onClick={onGoogleLogin}
        disabled={isGoogleLoginInProgress}
        className="btn btn-bg-200 h-[48px] w-full rounded-full"
        data-testid="test-button-google-login"
      >
        <div className="flex items-center justify-center gap-x-2">
          <GoogleIcon />
          <span className="text-base-content">
            {isGoogleLoginInProgress ? t.auth.loading : t.auth.continueGoogle}
          </span>
        </div>
      </button>
    </div>
  );
};

export default EmailVerificationStep;

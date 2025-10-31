import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import AppButton from '../Common/AppButton';
import { useState } from 'react';
import GoogleIcon from '/src/icons/google.svg?react';
import validator from 'validator';
import { AppModal } from '../Common/AppModal';
interface Props {
  lang?: SupportedLanguages;
  onVerifyEmail: (email: string) => void;
  isVerifyingEmail: boolean;
  externalErrorMessage?: string | null;
  errorGoogleLogin?: string | null;
  onGoogleLogin?: () => void;
  isGoogleLoginInProgress: boolean;
  onClose?: () => void;
  isOpen: boolean;
}

const ModalEmailVerification: React.FC<Props> = ({
  lang = 'es',
  onVerifyEmail,
  isVerifyingEmail,
  externalErrorMessage,
  onGoogleLogin,
  isGoogleLoginInProgress,
  onClose,
  isOpen,
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
  const closeModal = () => {
    setEmail('');
    onClose?.();
  };
  return (
    <AppModal
      id="modal-verification-email"
      showHeader={true}
      title={t.auth.title}
      maxWidth={'max-w-md'}
      maxHeight={'max-h-[90vh]'}
      bgColor={'bg-primary-content'}
      onClose={closeModal}
      isOpen={isOpen}
    >
      <div>
        <div className="space-y-3 pt-4 pb-8">
          <p>{t.auth.welcomeMessage}</p>
          <div className="space-y-1">
            <p className="text-neutral text-xs">{t.auth.email}</p>
            <input
              type="email"
              value={email}
              data-testid="test-input-email-verification"
              className="register-input"
              onChange={(e) => setEmail(e.target.value)}
              maxLength={MAX_CHARS}
            />
            {error && <p className="text-error text-xs">{error}</p>}
          </div>
          {externalErrorMessage && (
            <div className="alert alert-error mt-4">
              <span>{externalErrorMessage}</span>
            </div>
          )}
          {errorGoogleLogin && (
            <div className="alert alert-error mt-4">
              <span>{errorGoogleLogin}</span>
            </div>
          )}
        </div>
        <AppButton
          label={isVerifyingEmail ? t.auth.loading : t.auth.continue}
          className="h-[48px] w-full"
          data-testid="test-button-email-verification"
          onClick={handleSubmit}
          disabled={isVerifyingEmail}
        />
        <div className="divider text-neutral py-4 text-xs">{t.auth.maybe}</div>
        <div className="pb-1">
          <button
            className="btn btn-bg-200 h-[48px] w-full rounded-full"
            onClick={onGoogleLogin}
            data-testid="test-button-google-login"
            disabled={isGoogleLoginInProgress}
          >
            <div className="flex items-center justify-center gap-x-2">
              <GoogleIcon></GoogleIcon>
              <span className="text-base-content">{t.auth.continueGoogle}</span>
            </div>
          </button>
        </div>
      </div>
    </AppModal>
  );
};
export default ModalEmailVerification;

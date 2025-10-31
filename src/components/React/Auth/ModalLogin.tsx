import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import AppButton from '../Common/AppButton';
import UserPlusIcon from '/src/icons/user-plus-mini.svg?react';
import { useState, useMemo } from 'react';
import { AppModal } from '../Common/AppModal';
import ForgotPasswordSentModal from './ForgotPassword/ForgotPasswordSentModal';
import AppPasswordRevealInput from '@/components/React/Common/AppPasswordRevealInput';

interface Props {
  lang?: SupportedLanguages;
  login: (password: string) => void;
  isVerifying: boolean;
  errorMessage?: string | null;
  onClose?: () => void;
  isOpen: boolean;
  onUseOtherAccount: () => void;
}

const ModalLogin: React.FC<Props> = ({
  lang = 'es',
  login,
  isVerifying,
  errorMessage,
  onClose,
  isOpen,
  onUseOtherAccount,
}) => {
  const t = getTranslation(lang);
  const [password, setPassword] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const showPwLabel = t.forgotPassword?.resetPage.showPassword;
  const hidePwLabel = t.forgotPassword?.resetPage.hidePassword;

  const translatedErrorMessage = useMemo(() => {
    if (!errorMessage) return null;

    const errorMessages = t.auth?.error;

    let message = '';

    if (errorMessages && errorMessage in errorMessages) {
      message = (errorMessages as Record<string, string>)[errorMessage] || '';
    } else {
      message = errorMessage;
    }

    return message;
  }, [errorMessage, t]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying) return;
    if (!password.trim()) return;
    login(password);
  };

  const closeModal = () => {
    setPassword('');
    onClose?.();
  };

  const handleForgotClick = () => {
    onClose?.();
    setTimeout(() => setForgotOpen(true), 150);
  };

  return (
    <div>
      <AppModal
        id="modal-login"
        showHeader={true}
        title={t.auth.titleLogin}
        maxWidth={'max-w-md'}
        maxHeight={'max-h-[90vh]'}
        bgColor={'bg-primary-content'}
        onClose={closeModal}
        isOpen={isOpen}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-3 pt-4 pb-8">
            <div className="space-y-1">
              <p className="text-neutral text-xs">{t.auth.password}</p>
              <AppPasswordRevealInput
                id="login-password"
                value={password}
                onChange={setPassword}
                ariaLabelShow={showPwLabel}
                ariaLabelHide={hidePwLabel}
                autoComplete="current-password"
              />
            </div>

            {/* translatedErrorMessage */}
            {translatedErrorMessage && (
              <div className="alert alert-error mt-4">
                <span>{translatedErrorMessage}</span>
              </div>
            )}

            <div className="text-center">
              <button
                type="button"
                className="text-neutral cursor-pointer text-xs underline disabled:opacity-60"
                onClick={handleForgotClick}
              >
                {t.forgotPassword?.cta}
              </button>
            </div>
          </div>
          <AppButton
            label={isVerifying ? t.auth.loading : t.auth.continue}
            className="h-[48px] w-full"
            data-testid="test-button-login"
            disabled={isVerifying}
            type="submit"
          />
          <div className="divider text-neutral py-4 text-xs">
            {t.auth.maybe}
          </div>
          <button
            onClick={onUseOtherAccount}
            type="button"
            className="btn btn-bg-200 mb-2 h-[48px] w-full rounded-full"
          >
            <div className="flex items-center justify-center gap-x-2">
              <UserPlusIcon></UserPlusIcon>
              <span className="text-base-content">{t.auth.createAccount}</span>
            </div>
          </button>
        </form>
      </AppModal>
      <ForgotPasswordSentModal
        lang={lang}
        isOpen={forgotOpen}
        onClose={() => setForgotOpen(false)}
      />
    </div>
  );
};
export default ModalLogin;

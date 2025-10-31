import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import AppButton from '../../Common/AppButton';
import UserPlusIcon from '/src/icons/user-plus-mini.svg?react';
import { useState } from 'react';
import AppPasswordRevealInput from '@/components/React/Common/AppPasswordRevealInput';

interface Props {
  lang?: SupportedLanguages;
  login: (password: string) => void;
  isVerifying: boolean;
  errorMessage?: string | null;
  onUseOtherAccount: () => void;
  email?: string;
}

const LoginStep: React.FC<Props> = ({
  lang = 'es',
  login,
  isVerifying,
  errorMessage,
  onUseOtherAccount,
  email,
}) => {
  const t = getTranslation(lang);
  const [password, setPassword] = useState('');
  const showPwLabel = t.forgotPassword?.resetPage.showPassword;
  const hidePwLabel = t.forgotPassword?.resetPage.hidePassword;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isVerifying) return;
    if (!password.trim()) return;
    login(password);
    setPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-base-content mb-2 text-2xl font-semibold">
          {t.auth.titleLogin}
        </h1>
        {email && <p className="text-neutral text-sm">{email}</p>}
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="mb-6 space-y-4">
          <div className="space-y-1">
            <p className="text-neutral text-xs">{t.auth.password}</p>
            <AppPasswordRevealInput
              id="login-password"
              value={password}
              onChange={setPassword}
              ariaLabelShow={showPwLabel}
              ariaLabelHide={hidePwLabel}
              autoComplete="current-password"
              inputClassName="register-input"
              inputTestId="test-input-login-password"
            />
          </div>
          {errorMessage && (
            <div className="alert alert-error">
              <span>{errorMessage}</span>
            </div>
          )}
          {/* TODO: Uncomment this section once the functionality is implemented */}
          {/* <div className="text-center">
            <a className="text-neutral cursor-pointer text-[10px] underline">
              {t.auth.forgotPassword}
            </a>
          </div> */}
        </div>

        <AppButton
          label={isVerifying ? t.auth.loading : t.auth.continue}
          className="mb-4 h-[48px] w-full"
          data-testid="test-button-login"
          disabled={isVerifying}
          type="submit"
        />

        <div className="divider text-neutral py-2 text-xs">{t.auth.maybe}</div>

        <button
          type="button"
          onClick={onUseOtherAccount}
          className="btn btn-bg-200 h-[48px] w-full rounded-full"
        >
          <div className="flex items-center justify-center gap-x-2">
            <UserPlusIcon />
            <span className="text-base-content">{t.auth.createAccount}</span>
          </div>
        </button>
      </form>
    </div>
  );
};

export default LoginStep;

import { useCallback, useState, useEffect } from 'react';
import validator from 'validator';
import type { CommonModalProps } from '../Common/Modal';
import Modal from '../Common/Modal';
import KeyIcon from '/src/icons/key.svg?react';
import EyeIcon from '/src/icons/eye.svg?react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { Button } from '@/components/ui/button';

interface ChangePasswordModalProps
  extends Omit<CommonModalProps, 'children' | 'title' | 'footer'> {
  onClose: () => void;
  onVerify: (oldPassword: string, newPassword: string) => void;
  lang: SupportedLanguages;
  userName?: string;
  email?: string;
  errorMessage?: string | null;
}

export default function ChangePasswordModal({
  open,
  onClose,
  onVerify,
  lang,
  userName = '',
  email = '',
  errorMessage = null,
  ...modalProps
}: ChangePasswordModalProps) {
  const t = getTranslation(lang);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // Validation error states
  const [newPasswordError, setNewPasswordError] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');

  const handleCancel = () => {
    setOldPassword('');
    setNewPassword('');
    setRepeatPassword('');
    setNewPasswordError('');
    setRepeatPasswordError('');
    onClose();
  };

  const handleVerify = () => {
    if (!oldPassword || !newPassword || !repeatPassword) {
      return;
    }

    // Validate new password
    const passwordValidationError = validatePassword(
      newPassword,
      userName,
      email
    );
    if (passwordValidationError) {
      setNewPasswordError(passwordValidationError);
      return;
    }

    // Validate password match
    if (newPassword !== repeatPassword) {
      setRepeatPasswordError(t.register.passwordsDoNotMatch);
      return;
    }

    // Clear any existing errors before proceeding
    setNewPasswordError('');
    setRepeatPasswordError('');

    onVerify(oldPassword, newPassword);
  };

  const validatePassword = useCallback(
    (value: string, name: string, userEmail: string): string => {
      if (!validator.isLength(value, { min: 8 })) {
        return t.register.passwordTooShort;
      }

      if (/^\d+$/.test(value)) {
        return t.register.passwordCannotBeAllNumbers;
      }

      if (/^[a-zA-Z]+$/.test(value)) {
        return t.register.passwordCannotBeAllLetters;
      }

      if (!/\d|[^a-zA-Z0-9]/.test(value)) {
        return t.register.passwordNeedsNumberOrSymbol;
      }

      const normalizeString = (str: string) =>
        str
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '');

      const normalizedPassword = normalizeString(value);
      if (name) {
        const normalizedName = normalizeString(name);
        if (
          normalizedName.length >= 3 &&
          normalizedPassword.includes(normalizedName)
        ) {
          return t.register.passwordContainsPersonalInfo;
        }
      }

      if (userEmail) {
        const normalizedEmailUser = normalizeString(userEmail.split('@')[0]);
        if (
          normalizedEmailUser.length >= 3 &&
          normalizedPassword.includes(normalizedEmailUser)
        ) {
          return t.register.passwordContainsPersonalInfo;
        }
      }

      return '';
    },
    [t.register]
  );

  // Handle new password change with validation
  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);

    // Real-time validation
    if (value) {
      const error = validatePassword(value, userName, email);
      setNewPasswordError(error);
    } else {
      setNewPasswordError('');
    }
  };

  // Re-validate repeat password when new password changes
  useEffect(() => {
    if (repeatPassword && newPassword) {
      if (repeatPassword !== newPassword) {
        setRepeatPasswordError(t.register.passwordsDoNotMatch);
      } else {
        setRepeatPasswordError('');
      }
    }
  }, [newPassword, repeatPassword, t.register.passwordsDoNotMatch]);

  // Handle repeat password change with validation
  const handleRepeatPasswordChange = (value: string) => {
    setRepeatPassword(value);

    // Real-time validation for password matching
    if (value && newPassword) {
      if (value !== newPassword) {
        setRepeatPasswordError(t.register.passwordsDoNotMatch);
      } else {
        setRepeatPasswordError('');
      }
    } else {
      setRepeatPasswordError('');
    }
  };

  // Check if form is valid
  const isFormValid =
    oldPassword &&
    newPassword &&
    repeatPassword &&
    !newPasswordError &&
    !repeatPasswordError &&
    newPassword === repeatPassword;

  // Error rendering function
  const renderError = (field: 'newPassword' | 'repeatPassword') => {
    const error =
      field === 'newPassword' ? newPasswordError : repeatPasswordError;
    if (!error) return null;
    return <p className="mt-1 px-1 text-xs text-red-500">{error}</p>;
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title={t.users.changePasswordTitle}
      showCancelButton={false}
      widthClass="max-w-[320px]"
      heightClass="max-h-[calc(95vh-200px)]"
      centerContent={false}
      lang={lang}
      {...modalProps}
      footer={
        <div className="flex w-full justify-between gap-4">
          <button
            onClick={handleCancel}
            className="text-base-content flex h-12 cursor-pointer items-center justify-center rounded-[16px] bg-transparent px-4 text-sm font-normal underline"
          >
            {t.users.cancel}
          </button>
          <Button
            onClick={handleVerify}
            disabled={!isFormValid}
            className="bg-primary text-primary-content flex h-12 cursor-pointer items-center justify-center rounded-full px-4 font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            form="change-password-form"
          >
            {t.users.verify}
          </Button>
        </div>
      }
    >
      <form
        id="change-password-form"
        autoComplete="on"
        className="modal-change-password bg-base-150 flex w-full flex-col gap-8 rounded-[40px]"
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}
      >
        {/* Hidden username field for accessibility */}
        <input
          type="text"
          name="username"
          autoComplete="username"
          style={{ display: 'none' }}
          tabIndex={-1}
          aria-hidden="true"
        />

        {/* Old password */}
        <div className="old-pass flex w-full flex-col gap-2">
          <div className="text-neutral text-xs font-normal">
            {t.users.enterOldPasswordNote}
          </div>
          <div className="text-input-template-t-password flex w-full flex-col gap-0">
            <label className="label-top-container flex items-center px-1">
              <span className="label-main text-neutral text-sm font-normal">
                {t.users.oldPasswordLabel}
              </span>
            </label>
            <div className="input-container relative flex h-8 items-center gap-2 rounded-[16px] border border-[rgba(31,45,76,0.2)] bg-white px-3">
              <input
                type="password"
                autoComplete="current-password"
                placeholder="•••••••"
                className="text-base-content flex-1 bg-transparent text-sm font-normal outline-none"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                name="oldPassword"
              />
            </div>
          </div>
        </div>

        {/* New password */}
        <div className="new-pass flex w-full flex-col gap-2">
          <div className="text-neutral text-xs font-normal">
            {t.users.enterNewPasswordNote}
          </div>
          <div className="inputs flex w-full flex-col gap-4">
            {/* New Password */}
            <div className="text-input-template-t-password flex w-full flex-col gap-0">
              <label className="label-top-container flex items-center px-1">
                <span className="label-main text-neutral text-sm font-normal">
                  {t.users.newPasswordLabel}
                </span>
              </label>
              <div className="relative flex h-8 items-center gap-2 rounded-[16px] border border-[rgba(31,45,76,0.2)] bg-white px-3">
                <KeyIcon className="text-placeholder h-4 w-4" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="•••••••"
                  className="text-base-content min-w-0 flex-1 bg-transparent text-sm font-normal outline-none"
                  value={newPassword}
                  onChange={(e) => handleNewPasswordChange(e.target.value)}
                  name="newPassword"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="focus:outline-none"
                  aria-label={
                    showNewPassword
                      ? t.users.hidePassword
                      : t.users.showPassword
                  }
                >
                  <EyeIcon
                    className={
                      showNewPassword
                        ? 'text-neutral h-4 w-4'
                        : 'text-success h-4 w-4'
                    }
                  />
                </button>
              </div>
              {renderError('newPassword')}
            </div>

            {/* Repeat Password */}
            <div className="text-input flex w-full flex-col gap-0">
              <label className="label-top-container flex items-center px-1">
                <span className="label-main text-neutral text-sm font-normal">
                  {t.users.repeatPasswordLabel}
                </span>
              </label>
              <div className="relative flex h-8 items-center gap-2 rounded-[16px] border border-[rgba(31,45,76,0.2)] bg-white px-3">
                <KeyIcon className="text-placeholder h-4 w-4" />
                <input
                  type={showRepeatPassword ? 'text' : 'password'}
                  placeholder="•••••••"
                  className="text-base-content min-w-0 flex-1 bg-transparent text-sm font-normal outline-none"
                  value={repeatPassword}
                  onChange={(e) => handleRepeatPasswordChange(e.target.value)}
                  name="repeatPassword"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowRepeatPassword((v) => !v)}
                  className="focus:outline-none"
                  aria-label={
                    showRepeatPassword
                      ? t.users.hidePassword
                      : t.users.showPassword
                  }
                >
                  <EyeIcon
                    className={
                      showRepeatPassword
                        ? 'text-neutral h-4 w-4'
                        : 'text-success h-4 w-4'
                    }
                  />
                </button>
              </div>
              {renderError('repeatPassword')}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="text-neutral text-xs font-normal">
          {t.users.recommendationIntro}
          <ul className="mt-1 list-disc pl-5">
            <li>{t.users.recommendationNumbers}</li>
            <li>{t.users.recommendationSymbols}</li>
            <li>{t.users.recommendationUppercase}</li>
          </ul>
        </div>
      </form>
      {errorMessage && (
        <div className="mt-1 px-1 text-xs text-red-500">{errorMessage}</div>
      )}
    </Modal>
  );
}

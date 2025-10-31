import { useState, useEffect, useCallback } from 'react';
import validator from 'validator';
import type { CommonModalProps } from '../Common/Modal';
import Modal from '../Common/Modal';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { Button } from '@/components/ui/button';

interface EmailModalProps
  extends Omit<CommonModalProps, 'children' | 'title' | 'footer'> {
  onCancel: () => void;
  onSave: (email: string) => void;
  lang: SupportedLanguages;
  email?: string;
}

export default function EmailModal({
  open,
  onClose,
  onCancel,
  onSave,
  lang,
  email = '',
  ...modalProps
}: EmailModalProps) {
  const t = getTranslation(lang);

  const [emailValue, setEmailValue] = useState(email);
  const [emailError, setEmailError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setEmailValue(email);
      setEmailError('');
    }
  }, [open, email]);

  const validateEmail = useCallback(
    (value: string): string => {
      if (!value.trim()) {
        return ''; // Empty is allowed - optional field
      }
      if (!validator.isEmail(value)) {
        return t.users.invalidEmailError;
      }
      return '';
    },
    [t.users.invalidEmailError]
  );

  // Memoize only the input change handler
  const handleEmailChange = useCallback(
    (value: string) => {
      setEmailValue(value);
      if (value.trim()) {
        const error = validateEmail(value);
        setEmailError(error);
      } else {
        setEmailError('');
      }
    },
    [validateEmail]
  );

  const handleCancel = () => {
    setEmailValue(email);
    setEmailError('');
    onCancel();
  };

  const handleSave = () => {
    const emailTrimmed = emailValue.trim();
    // Validate before saving if there's a value
    const emailValidationError = emailTrimmed
      ? validateEmail(emailTrimmed)
      : '';
    setEmailError(emailValidationError);
    if (emailValidationError) {
      return;
    }
    onSave(emailTrimmed);
  };

  // Check if form is valid - email is optional but must be valid if provided
  const isFormValid = !emailError;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.users.addOrModifyEmailTitle}
      showCancelButton={false}
      widthClass="max-w-sm"
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
            onClick={handleSave}
            disabled={!isFormValid}
            className="bg-primary text-primary-content flex h-12 cursor-pointer items-center justify-center rounded-full px-4 font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.users.save}
          </Button>
        </div>
      }
    >
      <form
        id="email-form"
        className="modal-email bg-base-150 flex w-full flex-col gap-6 rounded-[40px]"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {/* Description */}
        <div className="text-neutral text-xs font-normal">
          {t.users.emailModalDescription}
        </div>

        {/* Input */}
        <div className="text-input flex w-full flex-col gap-0">
          <label className="label-top-container flex items-center px-1">
            <span className="label-main text-neutral text-xs font-normal">
              {t.users.emailLabel}
            </span>
          </label>
          <div className="input-container relative flex min-h-8 items-center gap-2 rounded-[12px] border border-[rgba(31,45,76,0.2)] bg-white px-3 py-1">
            <input
              type="email"
              placeholder={t.users.emailPlaceholderText}
              className="text-base-content placeholder:text-placeholder flex-1 bg-transparent text-xs font-normal outline-none"
              value={emailValue}
              onChange={(e) => handleEmailChange(e.target.value)}
              name="email"
            />
          </div>
          {emailError && (
            <p className="mt-1 px-1 text-xs text-red-500">{emailError}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}

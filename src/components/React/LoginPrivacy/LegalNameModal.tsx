import { useState, useEffect, useCallback } from 'react';
import type { CommonModalProps } from '../Common/Modal';
import Modal from '../Common/Modal';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { Button } from '@/components/ui/button';

interface LegalNameModalProps
  extends Omit<CommonModalProps, 'children' | 'title' | 'footer'> {
  onCancel: () => void;
  onSave: (firstName: string, lastName: string) => void;
  lang: SupportedLanguages;
  firstName?: string;
  lastName?: string;
}

export default function LegalNameModal({
  open,
  onClose,
  onCancel,
  onSave,
  lang,
  firstName = '',
  lastName = '',
  ...modalProps
}: LegalNameModalProps) {
  const t = getTranslation(lang);

  const [firstNameValue, setFirstNameValue] = useState(firstName);
  const [lastNameValue, setLastNameValue] = useState(lastName);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFirstNameValue(firstName);
      setLastNameValue(lastName);
      setFirstNameError('');
      setLastNameError('');
    }
  }, [open, firstName, lastName]);

  const validateName = useCallback(
    (value: string): string => {
      // Allow letters (including accented), spaces, hyphens, and apostrophes
      // Reject only numbers and most special characters
      const hasInvalidChars = /[0-9!@#$%^&*()_+=[\]{};:"\\|,.<>/?~`]/.test(
        value
      );
      if (hasInvalidChars) {
        return t.users.invalidCharactersError;
      }
      return '';
    },
    [t.users.invalidCharactersError]
  );

  const handleFirstNameChange = useCallback(
    (value: string) => {
      setFirstNameValue(value);
      if (value.trim()) {
        const error = validateName(value);
        setFirstNameError(error);
      } else {
        setFirstNameError('');
      }
    },
    [validateName]
  );

  const handleLastNameChange = useCallback(
    (value: string) => {
      setLastNameValue(value);
      if (value.trim()) {
        const error = validateName(value);
        setLastNameError(error);
      } else {
        setLastNameError('');
      }
    },
    [validateName]
  );

  const handleCancel = () => {
    setFirstNameValue(firstName);
    setLastNameValue(lastName);
    setFirstNameError('');
    setLastNameError('');
    onCancel();
  };

  const handleSave = () => {
    const firstNameTrimmed = firstNameValue.trim();
    const lastNameTrimmed = lastNameValue.trim();

    // Validate before saving
    const firstNameValidationError = firstNameTrimmed
      ? validateName(firstNameTrimmed)
      : '';
    const lastNameValidationError = lastNameTrimmed
      ? validateName(lastNameTrimmed)
      : '';

    setFirstNameError(firstNameValidationError);
    setLastNameError(lastNameValidationError);

    if (firstNameValidationError || lastNameValidationError) {
      return;
    }

    onSave(firstNameTrimmed, lastNameTrimmed);
  };

  // Check if form is valid
  const isFormValid =
    firstNameValue.trim() &&
    lastNameValue.trim() &&
    !firstNameError &&
    !lastNameError;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.users.addOrModifyLegalNameTitle}
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
        id="legal-name-form"
        className="modal-legal-name bg-base-150 flex w-full flex-col gap-6 rounded-[40px]"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {/* Description */}
        <div className="text-neutral text-xs font-normal">
          {t.users.legalNameModalDescription}
        </div>

        {/* Inputs */}
        <div className="inputs flex w-full flex-col gap-4">
          {/* First Name */}
          <div className="text-input flex w-full flex-col gap-0">
            <label className="label-top-container flex items-center px-1">
              <span className="label-main text-neutral text-xs font-normal">
                {t.users.firstNameLabel}
              </span>
            </label>
            <div className="input-container relative flex min-h-8 items-center gap-2 rounded-[12px] border border-[rgba(31,45,76,0.2)] bg-white px-3 py-1">
              <input
                type="text"
                placeholder={t.users.firstNamePlaceholder}
                className="text-base-content placeholder:text-placeholder flex-1 bg-transparent text-xs font-normal outline-none"
                value={firstNameValue}
                onChange={(e) => handleFirstNameChange(e.target.value)}
                name="firstName"
              />
            </div>
            {firstNameError && (
              <p className="mt-1 px-1 text-xs text-red-500">{firstNameError}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="text-input flex w-full flex-col gap-0">
            <label className="label-top-container flex items-center px-1">
              <span className="label-main text-neutral text-xs font-normal">
                {t.users.lastNameLabel}
              </span>
            </label>
            <div className="input-container relative flex min-h-8 items-center gap-2 rounded-[12px] border border-[rgba(31,45,76,0.2)] bg-white px-3 py-1">
              <input
                type="text"
                placeholder={t.users.lastNamePlaceholder}
                className="text-base-content placeholder:text-placeholder flex-1 bg-transparent text-xs font-normal outline-none"
                value={lastNameValue}
                onChange={(e) => handleLastNameChange(e.target.value)}
                name="lastName"
              />
            </div>
            {lastNameError && (
              <p className="mt-1 px-1 text-xs text-red-500">{lastNameError}</p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}

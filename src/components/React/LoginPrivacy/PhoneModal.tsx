import { useState, useEffect, useCallback } from 'react';
import type { CommonModalProps } from '../Common/Modal';
import Modal from '../Common/Modal';
import CheckBadgeSolidIcon from '/src/icons/check-badge-solid.svg?react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { Button } from '@/components/ui/button';

interface PhoneModalProps
  extends Omit<CommonModalProps, 'children' | 'title' | 'footer'> {
  onCancel: () => void;
  onSave: (phone: string) => void;
  lang: SupportedLanguages;
  phone?: string;
}

type PhoneModalStep = 'input' | 'verification' | 'success';

export default function PhoneModal({
  open,
  onClose,
  onCancel,
  onSave,
  lang,
  phone = '',
  ...modalProps
}: PhoneModalProps) {
  const t = getTranslation(lang);

  const [currentStep, setCurrentStep] = useState<PhoneModalStep>('input');
  const [phoneValue, setPhoneValue] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [codeError, setCodeError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setCurrentStep('input');
      // Use existing phone or default to "+591 "
      if (phone) {
        setPhoneValue(phone);
      } else {
        setPhoneValue('+591 ');
      }
      setVerificationCode('');
      setPhoneError('');
      setCodeError('');
    }
  }, [open, phone]);

  const validatePhone = useCallback(
    (value: string): string => {
      if (!value.trim()) {
        return t.users.invalidPhoneError;
      }
      // Basic phone validation - should start with + and have at least 10 digits
      const phoneRegex = /^\+\d{1,3}\s?\d{8,14}$/;
      if (!phoneRegex.test(value)) {
        return t.users.invalidPhoneError;
      }
      return '';
    },
    [t.users.invalidPhoneError]
  );

  const validateCode = useCallback(
    (value: string): string => {
      if (!value.trim()) {
        return t.users.invalidCodeError;
      }
      // Basic code validation - should be at least 4 characters
      if (value.trim().length < 4) {
        return t.users.invalidCodeError;
      }
      return '';
    },
    [t.users.invalidCodeError]
  );

  const handlePhoneChange = useCallback(
    (value: string) => {
      setPhoneValue(value);
      if (value.trim()) {
        const error = validatePhone(value);
        setPhoneError(error);
      } else {
        setPhoneError('');
      }
    },
    [validatePhone]
  );

  const handleCodeChange = useCallback(
    (value: string) => {
      setVerificationCode(value);
      if (value.trim()) {
        const error = validateCode(value);
        setCodeError(error);
      } else {
        setCodeError('');
      }
    },
    [validateCode]
  );

  const handleCancel = () => {
    setCurrentStep('input');
    // Reset to original phone or default
    if (phone) {
      setPhoneValue(phone);
    } else {
      setPhoneValue('+591 ');
    }
    setVerificationCode('');
    setPhoneError('');
    setCodeError('');
    onCancel();
  };

  const handleVerifyPhone = () => {
    const phoneValidationError = validatePhone(phoneValue);

    setPhoneError(phoneValidationError);

    if (phoneValidationError) {
      return;
    }

    // Move to verification step
    setCurrentStep('verification');
  };

  const handleVerifyCode = () => {
    const codeTrimmed = verificationCode.trim();
    const codeValidationError = validateCode(codeTrimmed);

    setCodeError(codeValidationError);

    if (codeValidationError) {
      return;
    }

    // Move to success step
    setCurrentStep('success');
  };

  const handleResendCode = () => {
    // TODO: Implement resend code logic
    console.log('Resending verification code for:', phoneValue);
  };

  const handleSuccess = () => {
    // Remove spaces when saving
    const cleanPhone = phoneValue.replace(/\s/g, '');
    onSave(cleanPhone);
  };

  // Check if current step form is valid
  const isPhoneStepValid = phoneValue.trim() && !phoneError;
  const isCodeStepValid = verificationCode.trim() && !codeError;

  // Render different content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'input':
        return (
          <>
            {/* Description */}
            <div className="text-neutral text-xs font-normal">
              {t.users.phoneModalDescription}
            </div>

            {/* Input */}
            <div className="text-input flex w-full flex-col gap-0">
              <label className="label-top-container flex items-center px-1">
                <span className="label-main text-neutral text-xs font-normal">
                  {t.users.phoneLabel}
                </span>
              </label>
              <div className="input-container relative flex min-h-8 items-center gap-2 rounded-[12px] border border-[rgba(31,45,76,0.2)] bg-white px-3 py-1">
                <input
                  type="tel"
                  placeholder={t.users.phonePlaceholderText}
                  className="text-base-content placeholder:text-placeholder flex-1 bg-transparent text-xs font-normal outline-none"
                  value={phoneValue}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  name="phone"
                />
              </div>
              {phoneError && (
                <p className="mt-1 px-1 text-xs text-red-500">{phoneError}</p>
              )}
            </div>
          </>
        );

      case 'verification':
        return (
          <>
            {/* Description */}
            <div className="text-neutral text-xs font-normal">
              {t.users.phoneVerificationDescription}
            </div>

            {/* Input */}
            <div className="text-input flex w-full flex-col gap-0">
              <label className="label-top-container flex items-center px-1">
                <span className="label-main text-neutral text-xs font-normal">
                  {t.users.verificationCodeLabel}
                </span>
              </label>
              <div className="input-container relative flex min-h-8 items-center gap-2 rounded-[12px] border border-[rgba(31,45,76,0.2)] bg-white px-3 py-1">
                <input
                  type="text"
                  placeholder={t.users.verificationCodePlaceholder}
                  className="text-base-content placeholder:text-placeholder flex-1 bg-transparent text-xs font-normal outline-none"
                  value={verificationCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  name="verificationCode"
                />
              </div>
              {codeError && (
                <p className="mt-1 px-1 text-xs text-red-500">{codeError}</p>
              )}
            </div>

            {/* Resend Code Button */}
            <button
              type="button"
              onClick={handleResendCode}
              className="text-primary hover:text-neutral cursor-pointer text-sm font-normal underline"
            >
              {t.users.resendCode}
            </button>
          </>
        );

      case 'success':
        return (
          <div className="bg-base-150 relative flex flex-row items-center justify-center gap-8 rounded-[40px]">
            <div className="flex w-full flex-col items-center gap-2">
              <CheckBadgeSolidIcon className="text-success h-12 w-12" />
              <div className="text-neutral-10 flex w-full items-center justify-center px-6 text-center text-lg font-normal">
                {t.users.phoneVerifiedSuccess.replace(
                  '{phoneNumber}',
                  phoneValue
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render different footer based on current step
  const renderFooter = () => {
    switch (currentStep) {
      case 'input':
        return (
          <div className="flex w-full justify-between gap-4">
            <button
              onClick={handleCancel}
              className="text-base-content flex h-12 cursor-pointer items-center justify-center rounded-[16px] bg-transparent px-4 text-sm font-normal underline"
            >
              {t.users.cancel}
            </button>
            <Button
              onClick={handleVerifyPhone}
              disabled={!isPhoneStepValid}
              className="bg-primary text-primary-content flex h-12 cursor-pointer items-center justify-center rounded-full px-4 font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.users.verify}
            </Button>
          </div>
        );

      case 'verification':
        return (
          <div className="flex w-full justify-between gap-4">
            <button
              onClick={handleCancel}
              className="text-base-content flex h-12 cursor-pointer items-center justify-center rounded-[16px] bg-transparent px-4 text-sm font-normal underline"
            >
              {t.users.cancel}
            </button>
            <Button
              onClick={handleVerifyCode}
              disabled={!isCodeStepValid}
              className="bg-primary text-primary-content flex h-12 cursor-pointer items-center justify-center rounded-full px-4 font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.users.verify}
            </Button>
          </div>
        );

      case 'success':
        return (
          <button
            onClick={handleSuccess}
            className="bg-primary flex h-12 w-full cursor-pointer items-center justify-center rounded-full px-6 shadow-sm"
          >
            <span className="text-base-100 text-sm font-semibold">
              {t.users.ready}
            </span>
          </button>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (currentStep) {
      case 'input':
      case 'verification':
        return t.users.addOrModifyPhoneTitle;
      case 'success':
        return '';
      default:
        return t.users.addOrModifyPhoneTitle;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={getModalTitle()}
      showCancelButton={false}
      widthClass="max-w-sm"
      centerContent={false}
      lang={lang}
      {...modalProps}
      footer={renderFooter()}
    >
      <form
        id="phone-form"
        className="modal-phone bg-base-150 flex w-full flex-col gap-6 rounded-[40px]"
        onSubmit={(e) => {
          e.preventDefault();
          if (currentStep === 'input') {
            handleVerifyPhone();
          } else if (currentStep === 'verification') {
            handleVerifyCode();
          } else if (currentStep === 'success') {
            handleSuccess();
          }
        }}
      >
        {renderStepContent()}
      </form>
    </Modal>
  );
}

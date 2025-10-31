import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import AppButton from '../Common/AppButton';
import { AppModal } from '../Common/AppModal';
import { useRef, useState, type ChangeEvent } from 'react';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  lang?: SupportedLanguages;
  sendCode: () => void;
  finallyRegister: (code: string) => void;
  errorSendCode?: string | null;
  errorRegister?: string | null;
  isSendCodeInProgress: boolean;
  isRegisterInProgress: boolean;
  goback: () => void;
}
const ModalConfirmationEmail: React.FC<Props> = ({
  lang = 'es',
  isOpen,
  onClose,
  sendCode,
  finallyRegister,
  errorSendCode,
  errorRegister,
  isSendCodeInProgress,
  isRegisterInProgress,
  goback,
}) => {
  const t = getTranslation(lang);
  const [code, setCode] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>(
    new Array(6).fill(null)
  );
  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (value === '') {
      const newCode = [...code];
      newCode[index] = ''; // Clear the current input's value
      setCode(newCode);
      return;
    }

    if (!/^\d$/.test(value)) {
      return; // Don't update state if it's not a single digit
    }
    const newCode = [...code];
    newCode[index] = value.slice(-1); // Take only the last character entered
    setCode(newCode);

    // Auto-focus to the next input if a digit was entered and it's not the last input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleSendCode = () => {
    setCode(new Array(6).fill(''));
    sendCode();
  };

  // Function to handle backspace and navigation
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const fullCode = code.join('');

  const closeModal = () => {
    setCode(new Array(6).fill(''));
    onClose?.();
  };
  return (
    <AppModal
      id="modal-confirmation-email"
      showHeader={true}
      title={t.auth.confirmationEmail}
      maxWidth={'max-w-md'}
      bgColor={'bg-primary-content'}
      isOpen={isOpen}
      onClose={closeModal}
      titleSize="text-lg"
    >
      <div className="space-y-8">
        <div className="space-y-6">
          <p
            className="text-neutral text-sm font-normal"
            data-testid="test-confirmation-email-verification-sent"
          >
            {t.auth.verificationCodeSent}
          </p>
          <div className="space-y-1">
            <p
              className="text-neutral text-xs"
              data-testid="test-confirmation-email-verification-code"
            >
              {t.auth.verificationCode}
            </p>
            <div className="flex gap-2">
              {new Array(6).fill(null).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  maxLength={1}
                  value={code[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  className="focus:border-primary focus:ring-primary text-primary bg-base-100 h-16 w-14 rounded-md border border-gray-300 text-center text-lg font-bold focus:outline-none"
                  data-testid={`code-input-${index}`}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-start">
            <button
              onClick={() => handleSendCode()}
              className="cursor-pointer text-sm underline"
              disabled={isSendCodeInProgress}
              data-testid="test-button-confirmatiom-email-send-code"
            >
              {isSendCodeInProgress ? t.auth.loading : t.auth.resendCode}
            </button>
          </div>
          {errorSendCode && (
            <div
              className="alert alert-error mt-4"
              data-testid="error-send-code"
            >
              <span>{errorSendCode}</span>
            </div>
          )}
          {errorRegister && (
            <div
              className="alert alert-error mt-4"
              data-testid="error-register"
            >
              <span>{errorRegister}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pb-1">
          <button
            disabled={isRegisterInProgress || isSendCodeInProgress}
            data-testid="test-button-confirmatiom-email-go-back"
            onClick={goback}
            className="text-primary cursor-pointer text-sm font-semibold"
          >
            {isSendCodeInProgress ? t.auth.loading : t.auth.goBack}
          </button>
          <AppButton
            label={isRegisterInProgress ? t.auth.loading : t.auth.registerEmail}
            data-testid="test-button-confirmatiom-email-register"
            className="h-[48px] text-sm font-normal"
            disabled={isRegisterInProgress || fullCode.length !== 6}
            onClick={() => finallyRegister(fullCode)}
          />
        </div>
      </div>
    </AppModal>
  );
};
export default ModalConfirmationEmail;

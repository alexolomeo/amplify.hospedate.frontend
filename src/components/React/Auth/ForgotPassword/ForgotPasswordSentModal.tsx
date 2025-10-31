import { useEffect, useMemo, useState } from 'react';
import validator from 'validator';
import { AppModal } from '@/components/React/Common/AppModal';
import AppButton from '@/components/React/Common/AppButton';
import { requestPasswordReset } from '@/services/auth';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
type Step = 'REQUEST' | 'SENT';

interface Props {
  lang?: SupportedLanguages;
  isOpen: boolean;
  onClose: () => void;
}

const MAX_CHARS = 255;

const ForgotPasswordModal: React.FC<Props> = ({
  lang = 'es',
  isOpen,
  onClose,
}) => {
  const t = getTranslation(lang);

  const [step, setStep] = useState<Step>('REQUEST');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [resending, setResending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('REQUEST');
      setEmail('');
      setSending(false);
      setResending(false);
      setFormError(null);
      setResendError(null);
    }
  }, [isOpen]);

  const isEmailValid = useMemo(() => validator.isEmail(email.trim()), [email]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    if (!isEmailValid) {
      setFormError(t.auth.invalidEmail);
      return;
    }

    setFormError(null);
    try {
      setSending(true);
      const normalized = email.trim().toLowerCase();
      await requestPasswordReset(normalized, { skipGlobal404Redirect: true });

      setStep('SENT');
      setResendError(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (t.common?.unexpectedError ?? 'Error');
      setFormError(msg);
    } finally {
      setSending(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    try {
      setResendError(null);
      setResending(true);
      const normalized = email.trim().toLowerCase();
      await requestPasswordReset(normalized, { skipGlobal404Redirect: true });
    } catch (e) {
      const msg =
        (e as { message?: string })?.message ??
        t.common?.unexpectedError ??
        'Error';
      setResendError(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <AppModal
      id="modal-forgot-password"
      title={t.forgotPassword?.title}
      showHeader
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-[92vw] sm:max-w-[360px]"
      maxHeight="max-h-[90vh]"
      maxHeightBody="max-h-[80vh]"
      bgColor="bg-primary-content"
      titleSize="text-lg leading-7 font-bold text-primary"
    >
      {step === 'REQUEST' ? (
        <form
          noValidate
          onSubmit={handleRequest}
          className="flex flex-col gap-5 px-4 pt-4 pb-6"
        >
          <p className="text-base-content text-sm leading-5">
            {t.forgotPassword?.instructions}
          </p>

          <div className="flex flex-col gap-2">
            <label className="text-base-content text-xs leading-4">
              {t.forgotPassword?.emailLabel}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder={t.forgotPassword?.placeholder}
              className="register-input h-[48px] w-full"
              autoComplete="email"
              data-testid="forgot-input-email"
              maxLength={MAX_CHARS}
              aria-invalid={!!formError}
              aria-describedby={formError ? 'forgot-email-error' : undefined}
            />
            {formError && (
              <p
                id="forgot-email-error"
                className="text-error text-xs"
                role="alert"
              >
                {formError}
              </p>
            )}
          </div>

          <AppButton
            label={sending ? t.common?.loading : t.forgotPassword?.sendButton}
            className="h-12 w-full rounded-full shadow-sm"
            type="submit"
            disabled={sending}
            data-testid="forgot-send-button"
            aria-busy={sending}
          />
        </form>
      ) : (
        <div className="flex flex-col items-center gap-6 px-4 pt-8 pb-10">
          <img
            src="/images/envelope.webp"
            alt={t.forgotPassword?.illustrationAlt}
            width={128}
            height={141}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="pointer-events-none h-[141px] w-[128px] object-contain select-none"
          />

          <p className="text-base-content text-center text-sm leading-5">
            {t.forgotPassword?.checkEmail}
          </p>

          {resendError && (
            <div className="alert alert-error w-full" role="alert">
              <span>{resendError}</span>
            </div>
          )}

          <div className="pt-1">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              aria-busy={resending}
              className="text-secondary text-sm underline disabled:opacity-60"
              data-testid="forgot-resend-button"
            >
              {resending ? t.common?.loading : t.forgotPassword?.resend}
            </button>
          </div>
        </div>
      )}
    </AppModal>
  );
};

export default ForgotPasswordModal;

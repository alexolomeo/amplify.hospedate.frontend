import { useMemo, useState, useEffect } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import AppButton from '@/components/React/Common/AppButton';
import type { PasswordErrorCode } from '@/components/React/Utils/forgot-password/password';
import { validatePassword } from '@/components/React/Utils/forgot-password/password';
import { restorePassword, validateAuthToken } from '@/services/auth';
import AppPasswordRevealInput from '@/components/React/Common/AppPasswordRevealInput';

interface Props {
  token: string;
  lang?: SupportedLanguages;
}

const MIN_LEN = 8;

const ResetPasswordForm: React.FC<Props> = ({ token, lang = 'es' }) => {
  const t = getTranslation(lang);

  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const showPwLabel =
    t.forgotPassword?.resetPage.showPassword ?? 'Mostrar contraseña';
  const hidePwLabel =
    t.forgotPassword?.resetPage.hidePassword ?? 'Ocultar contraseña';

  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    if (!token) {
      window.location.replace('/reset-password-404');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await validateAuthToken(token, 'RESTORE_PASSWORD', {
          skipGlobal404Redirect: true,
        });
        if (!cancelled) setTokenReady(true);
      } catch {
        window.location.replace('/reset-password-404');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const pwErrorCode = useMemo<PasswordErrorCode | null>(() => {
    if (!pw) return null;
    return validatePassword(pw);
  }, [pw]);

  const pwErrorMessage = useMemo(() => {
    if (!pwErrorCode) return null;
    const m: Record<PasswordErrorCode, string | undefined> = {
      tooShort: t.forgotPassword?.resetPage.tooShort,
      allNumbers: t.forgotPassword?.resetPage.cannotBeAllNumbers,
      allLetters: t.forgotPassword?.resetPage.cannotBeAllLetters,
      needsNumberOrSymbol: t.forgotPassword?.resetPage.needsNumberOrSymbol,
      containsPersonalInfo: t.forgotPassword?.resetPage.containsPersonalInfo,
    };
    return m[pwErrorCode] ?? null;
  }, [pwErrorCode, t]);

  const confirmErrorMessage = useMemo(() => {
    if (confirm.length > 0 && pw !== confirm) {
      return t.forgotPassword?.resetPage.mustMatch;
    }
    return null;
  }, [pw, confirm, t]);

  const validationMsg = pwErrorMessage ?? confirmErrorMessage;
  const canSubmit =
    tokenReady &&
    pw.length >= MIN_LEN &&
    !pwErrorCode &&
    pw === confirm &&
    !!token;

  function buildRestore404Message(
    t: ReturnType<typeof getTranslation>
  ): string {
    const title = t.forgotPassword?.resetPage.restoreError?.title;
    const intro = t.forgotPassword?.resetPage.restoreError?.intro;
    const b = t.forgotPassword?.resetPage.restoreError?.bullets;

    const bullets: string[] = [
      b?.minLength ?? '',
      b?.notAllNumbers ?? '',
      b?.notAllLetters ?? '',
      b?.numberOrSymbol ?? '',
      b?.notContainUser ?? '',
      b?.notCommon ?? '',
    ].filter((s) => s.length > 0);

    return [title, intro, ...bullets.map((line) => `• ${line}`)].join('\n');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    try {
      setSubmitting(true);
      setApiError(null);

      await validateAuthToken(token, 'RESTORE_PASSWORD', {
        skipGlobal404Redirect: true,
      });

      await restorePassword(token, pw);

      window.location.replace('/auth?reset=ok');
    } catch (err: unknown) {
      if (err instanceof Error) {
        const msg = err.message;

        if (
          msg === 'invalidToken' ||
          msg === 'unauthorized' ||
          msg === 'notFound' ||
          msg === 'restoreTokenNotFound' ||
          msg === 'invalidTokenResponse'
        ) {
          window.location.replace('/reset-password-404');
          return;
        }

        if (msg === 'restoreValidationFailed') {
          setApiError(buildRestore404Message(t));
        } else {
          setApiError(msg || t.common?.unexpectedError);
        }
      } else {
        setApiError(t.common?.unexpectedError);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto my-5 w-screen max-w-5xl md:my-10 lg:my-15 xl:max-w-6xl 2xl:max-w-7xl">
      <div className="grid place-items-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-primary-content w-full max-w-[420px] rounded-[40px] shadow-lg sm:max-w-[370px]"
        >
          <div className="px-6 pt-6">
            <h1 className="text-base-content text-lg leading-7 font-bold">
              {t.forgotPassword?.resetPage.enterNewPassword}
            </h1>
          </div>

          <div className="flex flex-col gap-3 px-6">
            <div className="flex flex-col gap-3 py-10">
              <AppPasswordRevealInput
                value={pw}
                onChange={setPw}
                label={t.forgotPassword?.resetPage.passwordLabel}
                placeholder={t.forgotPassword?.resetPage.passwordPlaceholder}
                ariaLabelShow={showPwLabel}
                ariaLabelHide={hidePwLabel}
                inputTestId="reset-input-password"
                buttonTestId="toggle-new-password-visibility"
                error={pwErrorMessage ?? null}
              />

              <AppPasswordRevealInput
                value={confirm}
                onChange={setConfirm}
                placeholder={t.forgotPassword?.resetPage.confirmPlaceholder}
                ariaLabelShow={showPwLabel}
                ariaLabelHide={hidePwLabel}
                inputTestId="reset-input-confirm"
                buttonTestId="toggle-confirm-password-visibility"
                error={confirmErrorMessage ?? null}
              />

              {validationMsg && (
                <div
                  className="mt-1 px-1 text-xs text-red-500"
                  role="status"
                  aria-live="polite"
                >
                  <span>{validationMsg}</span>
                </div>
              )}

              {apiError && (
                <div
                  className="mt-1 px-1 text-sm whitespace-pre-line text-red-500"
                  role="alert"
                  aria-live="assertive"
                  data-testid="reset-api-error"
                >
                  <span>{apiError}</span>
                </div>
              )}
            </div>

            <AppButton
              label={t.forgotPassword?.resetPage.changeAndSignIn}
              className="h-12 w-full rounded-full shadow-sm"
              disabled={!canSubmit || submitting}
              type="submit"
              data-testid="reset-submit"
              aria-busy={submitting}
            />
          </div>

          <div className="pb-10" />
        </form>
      </div>
    </section>
  );
};

export default ResetPasswordForm;

import AppButton from '../Common/AppButton';
import type { CompleteRegister, UserRegister } from '@/types/auth';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import { useRegistrationForm } from '../Hooks/Auth/useRegistrationForm';
import { AppModal } from '../Common/AppModal';
import AppPasswordRevealInput from '@/components/React/Common/AppPasswordRevealInput';

interface Props {
  lang?: SupportedLanguages;
  register: (data: UserRegister) => void;
  completeRegister: (data: CompleteRegister) => void;
  isVerifying: boolean;
  email: string;
  errors?: string | null;
  isRegisterCompleted: boolean;
  onClose?: () => void;
  isOpen: boolean;
}

const ModalRegister: React.FC<Props> = ({
  lang = 'es',
  register,
  isVerifying,
  email,
  errors,
  isRegisterCompleted,
  completeRegister,
  onClose,
  isOpen,
}) => {
  const {
    formData,
    isValid,
    maxChars,
    updateField,
    markFieldAsTouched,
    handleSubmit,
    getFieldError,
    shouldShowError,
    resetForm,
  } = useRegistrationForm({
    email,
    lang,
    register: register,
    completeRegister: completeRegister,
    isRegisterForm: isRegisterCompleted,
  });
  const t = getTranslation(lang);
  const showPwLabel = t.forgotPassword?.resetPage.showPassword;
  const hidePwLabel = t.forgotPassword?.resetPage.hidePassword;
  const renderError = (field: keyof typeof formData) => {
    if (!shouldShowError(field)) return null;
    return <p className="text-xs text-red-500">{getFieldError(field)}</p>;
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const closeModal = () => {
    resetForm();
    onClose?.();
  };

  return (
    <div>
      <AppModal
        id="modal-register-new-user"
        showHeader={true}
        title={t.register.title}
        maxWidth={'max-w-md'}
        maxHeight={'max-h-[90vh]'}
        bgColor={'bg-primary-content'}
        onClose={closeModal}
        isOpen={isOpen}
      >
        <form onSubmit={handleFormSubmit} className="space-y-6 px-1 py-4">
          {/* Full Name Section */}
          <div className="space-y-3">
            <p className="text-xs font-bold">{t.register.fullNameLabel}</p>
            <input
              type="text"
              value={formData.firstName}
              placeholder={t.register.nameInputPlaceholder}
              data-testid="test-input-first-name-register"
              className="register-input"
              onChange={(e) => updateField('firstName', e.target.value)}
              onBlur={() => markFieldAsTouched('firstName')}
              maxLength={maxChars}
              autoComplete="firstname"
            />
            {renderError('firstName')}

            <input
              type="text"
              value={formData.lastName}
              placeholder={t.register.lastnameInputPlaceholder}
              data-testid="test-input-last-name-register"
              className="register-input"
              onChange={(e) => updateField('lastName', e.target.value)}
              onBlur={() => markFieldAsTouched('lastName')}
              maxLength={maxChars}
              autoComplete="lastname"
            />
            {renderError('lastName')}
            <p className="text-neutral text-xs">{t.register.nameNote}</p>
          </div>

          {/* Birth Date Section */}
          <div className="space-y-3">
            <p className="text-xs font-bold">{t.register.birthDateLabel}</p>
            <input
              type="date"
              value={formData.birthDate}
              data-testid="test-input-date-register"
              placeholder={t.register.birthDateInputPlaceholder}
              className="register-input"
              onChange={(e) => updateField('birthDate', e.target.value)}
              onBlur={() => markFieldAsTouched('birthDate')}
              autoComplete="bday"
            />
            {renderError('birthDate')}
            <p className="text-neutral text-xs">{t.register.birthDateNote}</p>
          </div>

          {/* Email Section */}
          <div className="space-y-3">
            <p className="text-xs font-bold">{t.register.emailLabel}</p>
            <input
              type="text"
              value={email}
              data-testid="test-input-email-register"
              className="register-input"
              disabled
              autoComplete="email"
            />
          </div>

          {/* Password Section */}
          {isRegisterCompleted && (
            <div className="space-y-3">
              <p className="text-xs font-bold">{t.register.passwordLabel}</p>

              <AppPasswordRevealInput
                id="register-password"
                value={formData.password}
                onChange={(v) => updateField('password', v)}
                onBlur={() => markFieldAsTouched('password')}
                placeholder={t.register.passwordPlaceholder}
                ariaLabelShow={showPwLabel}
                ariaLabelHide={hidePwLabel}
                autoComplete="new-password"
                inputClassName="register-input"
                inputTestId="test-input-password-register"
                error={
                  shouldShowError('password') ? getFieldError('password') : null
                }
              />

              <AppPasswordRevealInput
                id="register-confirm-password"
                value={formData.confirmPassword}
                onChange={(v) => updateField('confirmPassword', v)}
                onBlur={() => markFieldAsTouched('confirmPassword')}
                placeholder={t.register.confirmPasswordPlaceholder}
                ariaLabelShow={showPwLabel}
                ariaLabelHide={hidePwLabel}
                autoComplete="new-password"
                inputClassName="register-input"
                inputTestId="test-input-confirm-password-register"
                error={
                  shouldShowError('confirmPassword')
                    ? getFieldError('confirmPassword')
                    : null
                }
              />
            </div>
          )}

          <p
            className="text-xs"
            dangerouslySetInnerHTML={{ __html: t.register.termsNote }}
          />

          {errors && (
            <div
              style={{ whiteSpace: 'pre-line' }}
              className="alert alert-error mt-4 text-xs"
            >
              <span>{errors}</span>
            </div>
          )}

          <AppButton
            label={isVerifying ? t.auth.loading : t.register.acceptAndContinue}
            className="h-[48px] w-full"
            data-testid="test-button-register"
            type="submit"
            disabled={!isValid || isVerifying}
          />
        </form>
      </AppModal>
    </div>
  );
};

export default ModalRegister;

import React from 'react';
import type { SupportedLanguages } from '@/utils/i18n.ts';

import ModalEmailVerification from './ModalEmailVerification';
import ModalLogin from './ModalLogin';
import ModalRegister from './ModalRegister';
import ModalConfirmationRegister from './ModalConfirmationRegister';
import ModalGoogleLogin from './ModalGoogleLogin';
import ModalConfirmationEmail from './ModalConfirmationEmail';

import { usePopupListener } from '@/components/React/Hooks/usePopupListener';
import { Provider } from '@/types/enums/provider';
import { Platform } from '@/types/enums/platform';
import { useAuthFlow } from '../Hooks/Auth/useAuthFlow';

interface Props {
  lang?: SupportedLanguages;
}

const AuthContainer: React.FC<Props> = ({ lang = 'es' }) => {
  const auth = useAuthFlow(lang);
  const { openPopup } = usePopupListener();
  const openGooglePopup = () => {
    openPopup(
      `${import.meta.env.PUBLIC_API_URL}/auth/social-login-redirect?provider=${Provider.Google}&platform=${Platform.Web}`,
      {
        windowName: 'googleLoginPopup',
        width: 500,
        height: 600,
      }
    );
  };

  return (
    <div>
      {/* Paso 1: Verif Email */}
      <ModalEmailVerification
        lang={lang}
        isOpen={auth.isEmailVerificationModalOpen}
        onClose={auth.closeEmailVerificationModal}
        onVerifyEmail={auth.handleVerifyEmail}
        onGoogleLogin={openGooglePopup}
        isVerifyingEmail={auth.emailVerification.isLoading}
        externalErrorMessage={auth.emailVerification.error}
        isGoogleLoginInProgress={auth.loginGoogle.isLoading}
        errorGoogleLogin={auth.loginGoogle.error}
      />

      {/* Paso 2: Login (exit Account) */}
      <ModalLogin
        lang={lang}
        isOpen={auth.isLoginModalOpen}
        onClose={auth.closeLoginModal}
        login={auth.handleLogin}
        isVerifying={auth.login.isLoading}
        errorMessage={auth.login.error}
        onUseOtherAccount={() => {
          auth.closeLoginModal();
          auth.openEmailVerificationModal();
        }}
      />

      {/* Paso 3: Registration (basic data and/or complete registration) */}
      <ModalRegister
        lang={lang}
        isOpen={auth.isRegisterModalOpen}
        onClose={auth.closeRegisterModal}
        register={auth.registrationInitialStep}
        completeRegister={auth.handleCompleteRegister}
        email={auth.emailInput}
        isVerifying={auth.register.isLoading}
        errors={auth.register.error}
        isRegisterCompleted={auth.isRegisterCompleted}
      />

      {/* Visual confirmation upon completing registration */}
      <ModalConfirmationRegister
        lang={lang}
        isOpen={auth.isConfirmationModalOpen}
        onClose={auth.closeConfirmationModal}
      />

      {/* Code confirmation via email (registration with verification) */}
      <ModalConfirmationEmail
        lang={lang}
        isOpen={auth.isConfirmationEmailModalOpen}
        onClose={auth.closeConfirmationEmailModal}
        sendCode={auth.handleMagicLink}
        finallyRegister={auth.handleRegisterWithCode}
        errorSendCode={auth.sendCode.error}
        errorRegister={auth.register.error}
        isSendCodeInProgress={auth.sendCode.isLoading}
        isRegisterInProgress={auth.register.isLoading}
        goback={() => {
          auth.goBackRegister();
        }}
      />

      {/* Login with Google (when the provider is Google) */}
      <ModalGoogleLogin
        lang={lang}
        isOpen={auth.isGoogleLoginModalOpen}
        onClose={auth.closeGoogleLoginModal}
        email={auth.emailInput}
        googleLogin={openGooglePopup}
        name={auth.checkEmailResponse?.username}
        profilePicture={auth.checkEmailResponse?.profilePicture}
        onUseOtherAccount={() => {
          auth.closeGoogleLoginModal();
          auth.openEmailVerificationModal();
        }}
        errorMessageGoogle={auth.loginGoogle.error}
        isGoogleLoggedIn={auth.loginGoogle.isLoading}
      />
    </div>
  );
};

export default AuthContainer;

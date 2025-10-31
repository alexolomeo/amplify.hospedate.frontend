import React, { useCallback, useEffect } from 'react';
import type { SupportedLanguages } from '@/utils/i18n';
import { useAuthLogic } from '@/components/React/Hooks/Auth/useAuthLogic';
import {
  AuthStep,
  useAuthSteps,
} from '@/components/React/Hooks/Auth/useAuthSteps';
import { usePopupListener } from '@/components/React/Hooks/usePopupListener';
import { Provider } from '@/types/enums/provider';
import { Platform } from '@/types/enums/platform';
import type { UserRegister } from '@/types/auth';
import EmailVerificationStep from './Steps/EmailVerificationStep';
import LoginStep from './Steps/LoginStep';
import RegisterStep from './Steps/RegisterStep';
import GoogleLoginStep from './Steps/GoogleLoginStep';
import ConfirmationStep from './Steps/ConfirmationStep';
import ConfirmationEmailStep from './Steps/ConfirmationEmailStep';
import { AuthEventEmitter } from '@/utils/authEventEmitter';
import { fetchUserMe } from '@/services/users';

type Props = {
  lang?: SupportedLanguages;
};

const AuthPageContainer: React.FC<Props> = ({ lang = 'es' }) => {
  const auth = useAuthLogic(lang);
  const [stepState, stepActions] = useAuthSteps(AuthStep.EMAIL_VERIFICATION);
  const { openPopup } = usePopupListener();
  const openGooglePopup = useCallback(() => {
    openPopup(
      `${import.meta.env.PUBLIC_API_URL}/auth/social-login-redirect?provider=${Provider.Google}&platform=${Platform.Web}`,
      { windowName: 'googleLoginPopup', width: 500, height: 600 }
    );
  }, [openPopup]);

  // Redirect post-login/registro
  const navigateAfterAuth = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    const target = redirect ? decodeURIComponent(redirect) : '/';
    window.location.assign(target);
  }, []);

  useEffect(() => {
    const handleLoginSuccess = async () => {
      try {
        const me = await fetchUserMe();
        if (me && !me.isRegisterCompleted) {
          auth.saveEmail(me.email);
          stepActions.goToRegister();
        } else {
          navigateAfterAuth();
        }
      } catch (e) {
        console.error('Error fetching user after loginSuccess', e);
      }
    };
    AuthEventEmitter.on('auth.loginSuccess', handleLoginSuccess);
    return () => {
      AuthEventEmitter.off('auth.loginSuccess', handleLoginSuccess);
    };
  }, [auth, navigateAfterAuth, stepActions]);

  useEffect(() => {
    const handleSocialToken = async (token: string) => {
      try {
        await auth.handleLoginWithToken(token);
      } catch (error) {
        console.error(
          'Error handling social token in AuthPageContainer:',
          error
        );
      }
    };

    AuthEventEmitter.on('auth.socialToken', handleSocialToken);
    return () => {
      AuthEventEmitter.off('auth.socialToken', handleSocialToken);
    };
  }, [auth]);

  const handleVerifyEmail = useCallback(
    async (email: string) => {
      auth.resetOperationState('login');
      auth.resetOperationState('loginGoogle');
      const res = await auth.handleCheckEmail(email);
      if (res.ok) {
        const next =
          res.data.provider === Provider.Hospedate
            ? stepActions.goToLogin
            : res.data.provider === Provider.Google
              ? stepActions.goToGoogleLogin
              : undefined;
        if (next) next();
        else console.warn(`No handler for provider: ${res.data.provider}`);
        return;
      }
      if (
        res.error &&
        (res.error.includes('not found') || res.error.includes('notFound'))
      ) {
        auth.resetOperationState('register');
        stepActions.goToRegister();
        return;
      }
    },
    [auth, stepActions]
  );

  const handleLogin = useCallback(
    async (password: string) => {
      try {
        await auth.handleLogin(password);
      } catch (e) {
        console.error('Login failed:', e);
      }
    },
    [auth]
  );

  const handleRegisterInitial = useCallback(
    async (data: UserRegister) => {
      try {
        auth.resetOperationState('register');
        const isValidPassword = await auth.handleRegister(data);
        if (isValidPassword) {
          await auth.handleMagicLink();
          stepActions.goToConfirmationEmail();
        }
      } catch (e) {
        console.error('Register init failed:', e);
      }
    },
    [auth, stepActions]
  );

  const handleRegisterWithCode = useCallback(
    async (code: string) => {
      try {
        auth.resetOperationState('register');
        await auth.handleRegisterWithCode(code);
        stepActions.goToConfirmationRegister();
      } catch (e) {
        console.error(' Register with code failed:', e);
      }
    },
    [auth, stepActions]
  );

  const handleCompleteRegister = useCallback(
    async (data: Parameters<typeof auth.handleCompleteRegister>[0]) => {
      try {
        await auth.handleCompleteRegister(data);
        stepActions.goToConfirmationRegister();
      } catch (e) {
        console.error('Complete register failed:', e);
      }
    },
    [auth, stepActions]
  );

  // Render de pasos
  const { emailVerification, login, register, sendCode, loginGoogle } =
    auth.operationStates;
  const { email, checkEmailResponse, isRegisterCompleted } = auth;

  const renderStep = () => {
    switch (stepState.currentStep) {
      case AuthStep.EMAIL_VERIFICATION:
        return (
          <EmailVerificationStep
            // Paso 1: Verif email
            lang={lang}
            onVerifyEmail={handleVerifyEmail}
            isVerifyingEmail={emailVerification.isLoading}
            externalErrorMessage={emailVerification.error}
            onGoogleLogin={openGooglePopup}
            isGoogleLoginInProgress={loginGoogle.isLoading}
            errorGoogleLogin={loginGoogle.error}
          />
        );

      case AuthStep.LOGIN:
        return (
          <LoginStep
            //Paso 2: Login (exit Account)
            lang={lang}
            login={handleLogin}
            isVerifying={login.isLoading}
            errorMessage={login.error}
            onUseOtherAccount={stepActions.goToEmailVerification}
            email={email}
          />
        );

      case AuthStep.REGISTER:
        return (
          <RegisterStep
            //Paso 3: Registration (basic data and/or complete registration)
            lang={lang}
            register={handleRegisterInitial}
            completeRegister={handleCompleteRegister}
            email={email}
            isVerifying={register.isLoading}
            errors={register.error}
            isRegisterCompleted={isRegisterCompleted}
          />
        );

      case AuthStep.GOOGLE_LOGIN:
        return (
          //Login with Google (when the provider is Google)
          <GoogleLoginStep
            lang={lang}
            email={email}
            googleLogin={openGooglePopup}
            name={checkEmailResponse?.username}
            profilePicture={checkEmailResponse?.profilePicture}
            onUseOtherAccount={() => {
              auth.resetOperationState('emailVerification');
              auth.resetOperationState('loginGoogle');
              stepActions.goToEmailVerification();
            }}
            errorMessageGoogle={loginGoogle.error}
            isGoogleLoggedIn={loginGoogle.isLoading}
          />
        );
      case AuthStep.CONFIRMATION_EMAIL:
        return (
          // Code confirmation via email (registration with verification)
          <ConfirmationEmailStep
            lang={lang}
            sendCode={auth.handleMagicLink}
            finallyRegister={handleRegisterWithCode}
            errorSendCode={sendCode.error}
            errorRegister={register.error}
            isSendCodeInProgress={sendCode.isLoading}
            isRegisterInProgress={register.isLoading}
            goback={() => {
              auth.resetOperationState('register');
              auth.resetOperationState('sendCode');
              stepActions.goToRegister();
            }}
          />
        );
      case AuthStep.CONFIRMATION_REGISTER:
        //Visual confirmation upon completing registration
        return <ConfirmationStep lang={lang} onClose={navigateAfterAuth} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-base-200 flex flex-1 items-center justify-center p-4">
      <div className="bg-primary-content w-full max-w-md rounded-2xl p-8 shadow-lg">
        {renderStep()}
      </div>
    </div>
  );
};

export default AuthPageContainer;

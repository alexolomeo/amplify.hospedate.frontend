import { useCallback, useMemo, useEffect } from 'react';
import { useAuthModals } from './useAuthModals';
import { useAuthLogic } from './useAuthLogic';
import { AuthEventEmitter } from '@/utils/authEventEmitter';
import { Provider } from '@/types/enums/provider';
import type { UserRegister, CompleteRegister } from '@/types/auth';
import { fetchUserMe } from '@/services/users';
import type { SupportedLanguages } from '@/utils/i18n';

export function useAuthFlow(lang: SupportedLanguages = 'es') {
  const [modalState, modalActions] = useAuthModals();
  const authLogic = useAuthLogic(lang);
  const providerModalMap = useMemo<Record<string, () => void>>(
    () => ({
      [Provider.Hospedate]: modalActions.openLoginModal,
      [Provider.Google]: modalActions.openGoogleLoginModal,
    }),
    [modalActions]
  );
  useEffect(() => {
    const openAuth = () => {
      authLogic.resetOperationState('emailVerification');
      authLogic.resetOperationState('loginGoogle');
      authLogic.resetOperationState('login');
      modalActions.openEmailVerificationModal();
    };
    AuthEventEmitter.on('ui.openAuth', openAuth);
    return () => AuthEventEmitter.off('ui.openAuth', openAuth);
  }, [modalActions, authLogic.resetOperationState, authLogic]);

  // Listen to events from the logic layer to control the UI
  useEffect(() => {
    // When the API requires authentication, we open the email verification modal.
    const handleAuthRequired = () => {
      modalActions.openEmailVerificationModal();
    };

    // When the login or token refresh is successful, we close all the modals.
    const handleLoginSuccess = async () => {
      modalActions.closeAllModals();
      try {
        const me = await fetchUserMe();
        if (me && !me.isRegisterCompleted && !modalState.isRegisterModalOpen) {
          authLogic.saveEmail(me.email);
          modalActions.openRegisterModal();
        }
      } catch (e) {
        console.error('Error fetching user after loginSuccess', e);
      }
    };

    AuthEventEmitter.on('auth.required', handleAuthRequired);
    AuthEventEmitter.on('auth.loginSuccess', handleLoginSuccess);

    return () => {
      AuthEventEmitter.off('auth.required', handleAuthRequired);
      AuthEventEmitter.off('auth.loginSuccess', handleLoginSuccess);
    };
  }, [modalActions, authLogic, modalState.isRegisterModalOpen]);

  useEffect(() => {
    const handleSocialToken = async (token: string) => {
      try {
        await authLogic.handleLoginWithToken(token);
      } catch (error) {
        console.error('Error handling social token in useAuthFlow:', error);
      }
    };

    AuthEventEmitter.on('auth.socialToken', handleSocialToken);
    return () => {
      AuthEventEmitter.off('auth.socialToken', handleSocialToken);
    };
  }, [authLogic]);

  // UI functions that call the business logic and control the UI
  const handleVerifyEmail = useCallback(
    async (email: string) => {
      const res = await authLogic.handleCheckEmail(email);
      if (res.ok) {
        modalActions.closeEmailVerificationModal();
        const openNextModal = providerModalMap[res.data.provider];
        if (openNextModal) openNextModal();
        else
          console.warn(`No handler found for provider: ${res.data?.provider}`);
        return;
      }

      if (res.error === 'notFound') {
        modalActions.closeEmailVerificationModal();
        modalActions.openRegisterModal();
        return;
      }
    },
    [authLogic, modalActions, providerModalMap]
  );

  const handleLogin = useCallback(
    async (password: string) => {
      try {
        await authLogic.handleLogin(password);
      } catch (error) {
        console.error('Login failed in useAuthFlow:', error);
      }
    },
    [authLogic]
  );

  const handleCompleteRegister = useCallback(
    async (data: CompleteRegister) => {
      try {
        authLogic.resetOperationState('register');
        await authLogic.handleCompleteRegister(data);
        modalActions.closeRegisterModal();
        modalActions.openConfirmationModal();
      } catch (error) {
        console.error('Complete registration failed in useAuthFlow:', error);
      }
    },
    [authLogic, modalActions]
  );

  const handleRegisterWithCode = useCallback(
    async (code: string) => {
      try {
        authLogic.resetOperationState('register');
        authLogic.resetOperationState('sendCode');
        await authLogic.handleRegisterWithCode(code);
        modalActions.closeConfirmationEmailModal();
        modalActions.openConfirmationModal();
      } catch (error) {
        console.error('Registration with code failed in useAuthFlow:', error);
      }
    },
    [authLogic, modalActions]
  );
  const registrationInitialStep = useCallback(
    async (data: UserRegister) => {
      try {
        authLogic.resetOperationState('register');
        authLogic.resetOperationState('sendCode');
        const isValidPassword = await authLogic.handleRegister(data);
        if (isValidPassword) {
          await authLogic.handleMagicLink();
          modalActions.closeRegisterModal();
          modalActions.openConfirmationEmailModal();
        }
      } catch (err) {
        console.error('Error during initial registration step:', err);
      }
    },
    [authLogic, modalActions]
  );

  const goBackRegister = useCallback(async () => {
    authLogic.resetOperationState('register');
    authLogic.resetOperationState('sendCode');
    modalActions.closeConfirmationEmailModal();
    modalActions.openRegisterModal();
  }, [authLogic, modalActions]);

  return {
    // Modal states (from useAuthModals)
    ...modalState,
    // Operation states and data (from useAuthLogic)
    ...authLogic.operationStates,
    emailInput: authLogic.email,
    checkEmailResponse: authLogic.checkEmailResponse,
    dataRegister: authLogic.dataRegister,

    // Modal actions (from useAuthModals)
    ...modalActions,

    // UI actions that use the logic (from useAuthLogic)
    handleVerifyEmail,
    handleLogin,
    goBackRegister,
    handleRegisterWithCode,
    handleCompleteRegister,
    registrationInitialStep,
    handleMagicLink: authLogic.handleMagicLink,
    handleLoginWithToken: authLogic.handleLoginWithToken,
    isRegisterCompleted: authLogic.isRegisterCompleted,
  };
}

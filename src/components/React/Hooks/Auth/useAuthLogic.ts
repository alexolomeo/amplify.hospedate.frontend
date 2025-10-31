import { $isLoggedInHint } from '@/stores/authHint';
import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  checkEmail,
  login,
  loginWithToken,
  register,
  sendCode,
  logout as apiLogout,
  verificationPassword,
} from '@/services/auth';
import { completeRegister, fetchUserMe } from '@/services/users';
import { AuthEventEmitter } from '@/utils/authEventEmitter';
import {
  type CheckEmailResponse,
  type CompleteRegister,
  type UserRegister,
} from '@/types/auth';
import { sessionService } from '@/services/SessionService';
import { $userStore } from '@/stores/userStore';
import { useStore } from '@nanostores/react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import axios from 'axios';

interface OperationState {
  isLoading: boolean;
  error: string | null;
}

interface AuthLogicState {
  email: string;
  dataRegister: UserRegister | null;
  checkEmailResponse: CheckEmailResponse | null;
  operationStates: {
    emailVerification: OperationState;
    login: OperationState;
    register: OperationState;
    sendCode: OperationState;
    loginGoogle: OperationState;
  };
}

const initialState: AuthLogicState = {
  email: '',
  dataRegister: null,
  checkEmailResponse: null,
  operationStates: {
    emailVerification: { isLoading: false, error: null },
    login: { isLoading: false, error: null },
    register: { isLoading: false, error: null },
    sendCode: { isLoading: false, error: null },
    loginGoogle: { isLoading: false, error: null },
  },
};

/**
 * This hook encapsulates all business and session logic for authentication.
 * It is UI-agnostic and has no knowledge of modals or components.
 */

export function useAuthLogic(lang: SupportedLanguages = 'es') {
  const t = getTranslation(lang);
  const [state, setState] = useState<AuthLogicState>(initialState);
  const isLoggedInHint = useStore($isLoggedInHint);
  const user = useStore($userStore);

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  const computedIsRegisterCompleted = useMemo(() => {
    if (!isHydrated) return true;
    if (!isLoggedInHint) return true;
    return user?.isRegisterCompleted ?? true;
  }, [isHydrated, isLoggedInHint, user]);
  const updateState = useCallback((updates: Partial<AuthLogicState>) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  }, []);

  const saveEmail = useCallback(
    (email: string) => {
      updateState({ email: email });
    },
    [updateState]
  );

  const updateOperationState = useCallback(
    (key: keyof AuthLogicState['operationStates'], update: OperationState) => {
      setState((prevState) => ({
        ...prevState,
        operationStates: {
          ...prevState.operationStates,
          [key]: update,
        },
      }));
    },
    []
  );

  const handleCheckEmail = useCallback(
    async (
      emailInputFromModal: string
    ): Promise<
      { ok: true; data: CheckEmailResponse } | { ok: false; error: string }
    > => {
      updateOperationState('emailVerification', {
        isLoading: true,
        error: null,
      });
      updateState({ email: emailInputFromModal, checkEmailResponse: null });
      try {
        const response = await checkEmail(emailInputFromModal, {
          skipGlobal404Redirect: true,
        });
        updateState({ checkEmailResponse: response });
        updateOperationState('emailVerification', {
          isLoading: false,
          error: null,
        });
        return { ok: true, data: response };
      } catch (error) {
        const errorKey =
          error instanceof Error ? error.message : 'networkError';
        updateOperationState('emailVerification', {
          isLoading: false,
          error: errorKey,
        });
        updateState({ checkEmailResponse: null });
        return { ok: false, error: errorKey };
      }
    },
    [updateState, updateOperationState]
  );

  const handleLogin = useCallback(
    async (password: string) => {
      updateOperationState('login', { isLoading: true, error: null });
      if (!state.email) {
        updateOperationState('login', {
          isLoading: false,
          error: 'invalidEmail',
        });
        return;
      }
      try {
        await login(state.email, password);
        // Emit success to close modals and trigger fetchUserMe (via listener)
        AuthEventEmitter.emit('auth.loginSuccess');
        updateOperationState('login', { isLoading: false, error: null });
      } catch (error) {
        const errorKey =
          error instanceof Error ? error.message : 'networkError';
        updateOperationState('login', { isLoading: false, error: errorKey });
        throw error;
      }
    },
    [state.email, updateOperationState]
  );

  const handleMagicLink = useCallback(async () => {
    updateOperationState('sendCode', { isLoading: true, error: null });
    updateOperationState('register', { isLoading: true, error: null });
    if (!state.email) {
      updateOperationState('sendCode', {
        isLoading: false,
        error: 'invalidEmail',
      });
      return;
    }
    try {
      await sendCode(state.email);
      updateOperationState('sendCode', { isLoading: false, error: null });
    } catch (error) {
      const errorKey = error instanceof Error ? error.message : 'networkError';
      updateOperationState('sendCode', { isLoading: false, error: errorKey });
      throw error;
    } finally {
      updateOperationState('register', { isLoading: false, error: null });
    }
  }, [state.email, updateOperationState]);

  const handleLoginWithToken = useCallback(
    async (token: string) => {
      updateOperationState('loginGoogle', { isLoading: true, error: null });
      try {
        await loginWithToken(token);
        AuthEventEmitter.emit('auth.loginSuccess');
        updateOperationState('loginGoogle', { isLoading: false, error: null });
      } catch (error) {
        console.error('[useAuthLogic] Login with token failed', {
          error,
          errorMessage: error instanceof Error ? error.message : 'unknown',
        });

        // Clear any lingering token from localStorage on error
        try {
          localStorage.removeItem('googleLoginToken');
        } catch {
          // ignore
        }

        const errorKey =
          error instanceof Error ? error.message : 'networkError';
        updateOperationState('loginGoogle', {
          isLoading: false,
          error: errorKey,
        });
        throw error;
      }
    },
    [updateOperationState]
  );

  const handleLogout = useCallback(async () => {
    updateOperationState('login', { isLoading: true, error: null });
    try {
      await apiLogout();
    } finally {
      sessionService.clearTokens();
      updateOperationState('login', { isLoading: false, error: null });
    }
  }, [updateOperationState]);

  const buildPasswordRequirementsMessage = useCallback((): string => {
    const bullets: string[] = [
      t.register.passwordTooShort ?? '',
      t.register.passwordCannotBeAllNumbers ?? '',
      t.register.passwordCannotBeAllLetters ?? '',
      t.register.passwordNeedsNumberOrSymbol ?? '',
      t.register.passwordContainsPersonalInfo ?? '',
      t.register.passwordNotCommon ?? '',
    ].filter((s) => s.length > 0);
    return bullets.map((line) => `• ${line}`).join('\n');
  }, [t.register]);

  const handleRegister = useCallback(
    async (data: UserRegister) => {
      updateOperationState('register', { isLoading: true, error: null });
      try {
        await verificationPassword(data);
        updateState({ dataRegister: data });
        updateOperationState('register', { isLoading: false, error: null });
        return true;
      } catch (error) {
        const isPasswordError =
          axios.isAxiosError(error) && error.response?.status === 400;
        updateOperationState('register', {
          isLoading: false,
          error: isPasswordError
            ? buildPasswordRequirementsMessage()
            : t.auth.error.networkError,
        });
        return false;
      }
    },
    [
      updateOperationState,
      updateState,
      buildPasswordRequirementsMessage,
      t.auth.error,
    ]
  );

  const handleRegisterWithCode = useCallback(
    async (code: string) => {
      updateOperationState('register', { isLoading: true, error: null });
      if (!state.dataRegister) {
        updateOperationState('register', {
          isLoading: false,
          error: 'registrationDataMissing',
        });
        return;
      }
      try {
        const dataToRegisterWithCode: UserRegister = {
          ...state.dataRegister,
          verification_code: code,
        };
        await register(dataToRegisterWithCode);
        await login(
          dataToRegisterWithCode.email,
          dataToRegisterWithCode.password
        );
        AuthEventEmitter.emit('auth.loginSuccess');
        updateOperationState('register', { isLoading: false, error: null });
      } catch (error) {
        const errorKey =
          error instanceof Error ? error.message : 'networkError';
        updateOperationState('register', { isLoading: false, error: errorKey });
        throw error;
      }
    },
    [state.dataRegister, updateOperationState]
  );

  const handleCompleteRegister = useCallback(
    async (data: CompleteRegister) => {
      updateOperationState('register', { isLoading: true, error: null });
      try {
        await completeRegister(data);
        await fetchUserMe();
        updateOperationState('register', { isLoading: false, error: null });
      } catch (error) {
        const errorKey =
          error instanceof Error ? error.message : 'networkError';
        updateOperationState('register', { isLoading: false, error: errorKey });
        throw error;
      }
    },
    [updateOperationState]
  );

  const resetOperationState = useCallback(
    (key: keyof AuthLogicState['operationStates']) => {
      updateOperationState(key, {
        isLoading: false,
        error: null,
      });
    },
    [updateOperationState]
  );

  return {
    ...state,
    handleCheckEmail,
    handleLogin,
    handleMagicLink,
    handleLoginWithToken,
    handleLogout,
    handleRegister,
    handleRegisterWithCode,
    handleCompleteRegister,
    resetOperationState,
    isRegisterCompleted: computedIsRegisterCompleted,
    saveEmail,
  };
}

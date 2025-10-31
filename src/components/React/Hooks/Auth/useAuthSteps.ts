import { useState, useCallback } from 'react';

export enum AuthStep {
  EMAIL_VERIFICATION = 'email_verification',
  LOGIN = 'login',
  REGISTER = 'register',
  GOOGLE_LOGIN = 'google_login',
  CONFIRMATION_EMAIL = 'confirmation_email',
  CONFIRMATION_REGISTER = 'confirmation_register',
}

interface AuthStepState {
  currentStep: AuthStep;
}

interface AuthStepActions {
  setStep: (step: AuthStep) => void;
  goToEmailVerification: () => void;
  goToLogin: () => void;
  goToRegister: () => void;
  goToGoogleLogin: () => void;
  goToConfirmationEmail: () => void;
  goToConfirmationRegister: () => void;
}

export const useAuthSteps = (
  initialStep: AuthStep = AuthStep.EMAIL_VERIFICATION
): [AuthStepState, AuthStepActions] => {
  const [currentStep, setCurrentStep] = useState<AuthStep>(initialStep);

  const setStep = useCallback((step: AuthStep) => {
    setCurrentStep(step);
  }, []);

  const goToEmailVerification = useCallback(
    () => setStep(AuthStep.EMAIL_VERIFICATION),
    [setStep]
  );
  const goToLogin = useCallback(() => setStep(AuthStep.LOGIN), [setStep]);
  const goToRegister = useCallback(() => setStep(AuthStep.REGISTER), [setStep]);
  const goToGoogleLogin = useCallback(
    () => setStep(AuthStep.GOOGLE_LOGIN),
    [setStep]
  );
  const goToConfirmationEmail = useCallback(
    () => setStep(AuthStep.CONFIRMATION_EMAIL),
    [setStep]
  );
  const goToConfirmationRegister = useCallback(
    () => setStep(AuthStep.CONFIRMATION_REGISTER),
    [setStep]
  );

  const state: AuthStepState = { currentStep };
  const actions: AuthStepActions = {
    setStep,
    goToEmailVerification,
    goToLogin,
    goToRegister,
    goToGoogleLogin,
    goToConfirmationEmail,
    goToConfirmationRegister,
  };

  return [state, actions];
};

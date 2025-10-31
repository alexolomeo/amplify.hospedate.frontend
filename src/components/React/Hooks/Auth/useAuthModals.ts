import { useState, useCallback, useMemo } from 'react';

interface AuthModalState {
  isEmailVerificationModalOpen: boolean;
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  isConfirmationModalOpen: boolean;
  isGoogleLoginModalOpen: boolean;
  isConfirmationEmailModalOpen: boolean;
}

interface AuthModalActions {
  openEmailVerificationModal: () => void;
  closeEmailVerificationModal: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  openConfirmationModal: () => void;
  closeConfirmationModal: () => void;
  openGoogleLoginModal: () => void;
  closeGoogleLoginModal: () => void;
  openConfirmationEmailModal: () => void;
  closeConfirmationEmailModal: () => void;
  closeAllModals: () => void;
}

const initialState: AuthModalState = {
  isEmailVerificationModalOpen: false,
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  isConfirmationModalOpen: false,
  isGoogleLoginModalOpen: false,
  isConfirmationEmailModalOpen: false,
};

export const useAuthModals = (): [AuthModalState, AuthModalActions] => {
  const [modalState, setModalState] = useState<AuthModalState>(initialState);

  const updateModal = useCallback(
    (key: keyof AuthModalState, isOpen: boolean) => {
      setModalState((prevState) => ({ ...prevState, [key]: isOpen }));
    },
    []
  );

  const closeAllModals = useCallback(() => {
    setModalState(initialState);
  }, []);

  const actions: AuthModalActions = useMemo(
    () => ({
      openEmailVerificationModal: () =>
        updateModal('isEmailVerificationModalOpen', true),
      closeEmailVerificationModal: () =>
        updateModal('isEmailVerificationModalOpen', false),
      openLoginModal: () => updateModal('isLoginModalOpen', true),
      closeLoginModal: () => updateModal('isLoginModalOpen', false),
      openRegisterModal: () => updateModal('isRegisterModalOpen', true),
      closeRegisterModal: () => updateModal('isRegisterModalOpen', false),
      openConfirmationModal: () => updateModal('isConfirmationModalOpen', true),
      closeConfirmationModal: () =>
        updateModal('isConfirmationModalOpen', false),
      openGoogleLoginModal: () => updateModal('isGoogleLoginModalOpen', true),
      closeGoogleLoginModal: () => updateModal('isGoogleLoginModalOpen', false),
      openConfirmationEmailModal: () =>
        updateModal('isConfirmationEmailModalOpen', true),
      closeConfirmationEmailModal: () =>
        updateModal('isConfirmationEmailModalOpen', false),
      closeAllModals,
    }),
    [updateModal, closeAllModals]
  );

  return [modalState, actions];
};

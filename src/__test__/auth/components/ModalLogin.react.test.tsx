import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import ModalLogin from '@/components/React/Auth/ModalLogin';

jest.mock('@/components/React/Common/AppModal', () => ({
  AppModal: ({
    children,
    isOpen,
    onClose,
    title,
  }: React.PropsWithChildren<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
  }>) => {
    return isOpen ? (
      <div
        data-testid="mock-app-modal"
        aria-modal="true"
        role="dialog"
        aria-label={title}
      >
        <h2 data-testid="modal-title">{title}</h2>
        {children}
        <button data-testid="mock-modal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null;
  },
}));

jest.mock('/src/icons/user-plus-mini.svg?react', () => {
  const UserPlusIcon = () => <svg data-testid="user-plus-icon" />;
  UserPlusIcon.displayName = 'UserPlusIcon';
  return { __esModule: true, default: UserPlusIcon };
});

jest.mock(
  '@/components/React/Auth/ForgotPassword/ForgotPasswordSentModal',
  () => {
    function ForgotPasswordSentModalStub({
      isOpen,
      onClose,
      lang,
    }: {
      isOpen: boolean;
      onClose: () => void;
      lang?: 'es' | 'en';
    }) {
      if (!isOpen) return null;
      return (
        <div data-testid="forgot-password-modal-stub">
          <p>FORGOT STUB — lang: {lang}</p>
          <button onClick={onClose} data-testid="forgot-stub-close">
            Close forgot
          </button>
        </div>
      );
    }
    return { __esModule: true, default: ForgotPasswordSentModalStub };
  }
);

describe('ModalLogin', () => {
  const mockLogin = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnUseOtherAccount = jest.fn();

  const defaultProps = {
    lang: 'es' as const,
    login: mockLogin,
    isVerifying: false,
    isOpen: true,
    onClose: mockOnClose,
    onUseOtherAccount: mockOnUseOtherAccount,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering and UI', () => {
    it('renders core elements', () => {
      render(<ModalLogin {...defaultProps} isOpen={true} />);

      expect(screen.getByTestId('mock-app-modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent(
        'Ingresa tu contraseña'
      );
      expect(screen.getByText('Contraseña')).toBeInTheDocument();
      expect(screen.getByText('Continuar')).toBeInTheDocument();
      expect(screen.getByText('Crea una cuenta')).toBeInTheDocument();

      const passwordInputById = document.getElementById(
        'login-password'
      ) as HTMLInputElement;
      expect(passwordInputById).toBeInTheDocument();
      expect(passwordInputById.type).toBe('password');

      const createAccountBtn = screen.getByRole('button', {
        name: /Crea una cuenta/i,
      });
      expect(
        within(createAccountBtn).getByTestId('user-plus-icon')
      ).toBeInTheDocument();
    });

    it('does NOT render content when isOpen is false', () => {
      render(<ModalLogin {...defaultProps} isOpen={false} />);
      expect(screen.queryByTestId('mock-app-modal')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Ingresa tu contraseña')
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Contraseña')).not.toBeInTheDocument();
    });

    it('shows loading state when isVerifying is true', () => {
      render(<ModalLogin {...defaultProps} isVerifying={true} />);
      const button = screen.getByTestId('test-button-login');
      expect(button).toHaveTextContent('Cargando');
      expect(button).toBeDisabled();
    });

    it('shows normal state when isVerifying is false', () => {
      render(<ModalLogin {...defaultProps} isVerifying={false} />);
      const button = screen.getByTestId('test-button-login');
      expect(button).toHaveTextContent('Continuar');
      expect(button).not.toBeDisabled();
    });

    it('shows an error message when errorMessage prop is provided', () => {
      const errorMessage = 'Contraseña incorrecta';
      render(<ModalLogin {...defaultProps} errorMessage={errorMessage} />);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Form handling', () => {
    it('updates input value when user types', () => {
      render(<ModalLogin {...defaultProps} />);
      const passwordInput = document.getElementById(
        'login-password'
      ) as HTMLInputElement;

      fireEvent.change(passwordInput, { target: { value: 'mi-password-123' } });
      expect(passwordInput.value).toBe('mi-password-123');
    });

    it('calls login with entered password when clicking Continue', () => {
      render(<ModalLogin {...defaultProps} />);
      const passwordInput = document.getElementById(
        'login-password'
      ) as HTMLInputElement;
      const continueButton = screen.getByTestId('test-button-login');

      fireEvent.change(passwordInput, { target: { value: 'mi-password-123' } });
      fireEvent.click(continueButton);

      expect(mockLogin).toHaveBeenCalledWith('mi-password-123');
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe('Forgot password flow (with stub)', () => {
    it('clicking "He olvidado mi contraseña" closes login modal and opens forgot (stub)', async () => {
      render(<ModalLogin {...defaultProps} />);

      const forgotLink = screen.getByRole('button', {
        name: /he\s+olvidad[oa]\s+mi\s+contraseña/i,
      });
      fireEvent.click(forgotLink);

      expect(mockOnClose).toHaveBeenCalledTimes(1);

      await screen.findByTestId('forgot-password-modal-stub');

      fireEvent.click(screen.getByTestId('forgot-stub-close'));
      expect(
        screen.queryByTestId('forgot-password-modal-stub')
      ).not.toBeInTheDocument();
    });
  });
});

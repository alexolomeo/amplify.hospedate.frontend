import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalEmailVerification from '@/components/React/Auth/ModalEmailVerification';
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
describe('ModalEmailVerification', () => {
  const mockVerifEmail = jest.fn();
  const mockGoogleLogin = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    lang: 'es' as const,
    onVerifyEmail: mockVerifEmail,
    isVerifyingEmail: false,
    onGoogleLogin: mockGoogleLogin,
    isGoogleLoginInProgress: false,
    isOpen: true,
    onClose: mockOnClose,
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering and UI', () => {
    it('should render all elements correctly', () => {
      render(<ModalEmailVerification {...defaultProps} />);
      expect(
        screen.getByText('Inicia sesión o regístrate')
      ).toBeInTheDocument();
      expect(screen.getByText('Te damos la bienvenida')).toBeInTheDocument();
      expect(screen.getByText('Correo electrónico')).toBeInTheDocument();
      expect(
        screen.getByTestId('test-input-email-verification')
      ).toBeInTheDocument();
      expect(screen.getByText('Continuar con Google')).toBeInTheDocument();
    });

    it('should show loading state when isVerifying is true', () => {
      render(
        <ModalEmailVerification
          {...defaultProps}
          isVerifyingEmail={true}
          isGoogleLoginInProgress={true}
        />
      );
      const button = screen.getByTestId('test-button-email-verification');
      const buttonGoogle = screen.getByTestId('test-button-google-login');
      expect(button).toHaveTextContent('Cargando');
      expect(button).toBeDisabled();
      expect(buttonGoogle).toBeDisabled();
    });

    it('should show normal text when isVerifying is false', () => {
      render(
        <ModalEmailVerification {...defaultProps} isVerifyingEmail={false} />
      );
      const button = screen.getByTestId('test-button-email-verification');
      const buttonGoogle = screen.getByTestId('test-button-google-login');
      expect(button).toHaveTextContent('Continuar');
      expect(button).not.toBeDisabled();
      expect(buttonGoogle).not.toBeDisabled();
    });
  });

  describe('Email validation', () => {
    it('should show error when the email is invalid', async () => {
      render(<ModalEmailVerification {...defaultProps} />);
      const input = screen.getByTestId('test-input-email-verification');
      const button = screen.getByTestId('test-button-email-verification');
      fireEvent.change(input, { target: { value: 'email-invalido' } });
      fireEvent.click(button);
      await waitFor(() => {
        expect(
          screen.getByText('Correo electrónico inválido')
        ).toBeInTheDocument();
      });
      expect(mockVerifEmail).not.toHaveBeenCalled();
    });

    it('should clear the error when the email becomes valid', async () => {
      render(<ModalEmailVerification {...defaultProps} />);
      const input = screen.getByTestId('test-input-email-verification');
      const button = screen.getByTestId('test-button-email-verification');

      // first intent with email invalid
      fireEvent.change(input, { target: { value: 'email-invalido' } });
      fireEvent.click(button);
      await waitFor(() => {
        expect(
          screen.getByText('Correo electrónico inválido')
        ).toBeInTheDocument();
      });

      // second intent with email invalid
      fireEvent.change(input, { target: { value: 'email@valido.com' } });
      fireEvent.click(button);
      await waitFor(() => {
        expect(
          screen.queryByText('Correo electrónico inválido')
        ).not.toBeInTheDocument();
      });
    });

    it('should call verifEmail when the email is valid', async () => {
      render(<ModalEmailVerification {...defaultProps} />);
      const input = screen.getByTestId('test-input-email-verification');
      const button = screen.getByTestId('test-button-email-verification');
      fireEvent.change(input, { target: { value: 'email@valido.com' } });
      fireEvent.click(button);
      await waitFor(() => {
        expect(mockVerifEmail).toHaveBeenCalledWith('email@valido.com');
      });
    });
  });

  describe('Form handling', () => {
    it('should update the input value when the user types', () => {
      render(<ModalEmailVerification {...defaultProps} />);
      const input = screen.getByTestId(
        'test-input-email-verification'
      ) as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'test@example.com' } });
      expect(input.value).toBe('test@example.com');
    });

    it('should clear the input after a successful submission', async () => {
      render(<ModalEmailVerification {...defaultProps} />);
      const input = screen.getByTestId(
        'test-input-email-verification'
      ) as HTMLInputElement;

      const button = screen.getByTestId('test-button-email-verification');

      fireEvent.change(input, { target: { value: 'test@example.com' } });
      expect(input.value).toBe('test@example.com');
      fireEvent.click(button);
      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });
  });
});

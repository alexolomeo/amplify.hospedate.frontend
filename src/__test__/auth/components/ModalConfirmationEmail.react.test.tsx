import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalConfirmationEmail from '@/components/React/Auth/ModalConfirmationEmail';

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
        data-testid="modal-confirmation-email"
        aria-modal="true"
        role="dialog"
        aria-label={title}
      >
        <h2 data-testid="modal-title">{title}</h2>
        {children}
        <button data-testid="modal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null;
  },
}));

describe('ModalConfirmationEmail', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    sendCode: jest.fn(),
    finallyRegister: jest.fn(),
    isSendCodeInProgress: false,
    isRegisterInProgress: false,
    goback: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering Tests ---
  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<ModalConfirmationEmail {...defaultProps} isOpen={false} />);
      expect(
        screen.queryByTestId('modal-confirmation-email')
      ).not.toBeInTheDocument();
    });

    it('should render correctly when isOpen is true', () => {
      render(<ModalConfirmationEmail {...defaultProps} />);
      expect(
        screen.getByTestId('modal-confirmation-email')
      ).toBeInTheDocument();
      expect(screen.getByTestId('modal-title')).toHaveTextContent(
        'Confirma tu correo'
      );
      expect(
        screen.queryByTestId('test-confirmation-email-verification-sent')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('test-confirmation-email-verification-code')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('test-button-confirmatiom-email-go-back')
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('test-button-confirmatiom-email-register')
      ).toBeInTheDocument();

      // Check for 6 code input fields
      for (let i = 0; i < 6; i++) {
        expect(screen.getByTestId(`code-input-${i}`)).toBeInTheDocument();
        expect(screen.getByTestId(`code-input-${i}`)).toHaveValue('');
      }
    });

    it('should display errorSendCode when provided', () => {
      const errorMessage = 'Error al reenviar el código.';
      render(
        <ModalConfirmationEmail
          {...defaultProps}
          errorSendCode={errorMessage}
        />
      );
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should display errorRegister when provided', () => {
      const errorMessage = 'Error al registrar el usuario.';
      render(
        <ModalConfirmationEmail
          {...defaultProps}
          errorRegister={errorMessage}
        />
      );
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should show loading text for resendCode button when isSendCodeInProgress is true', () => {
      render(
        <ModalConfirmationEmail {...defaultProps} isSendCodeInProgress={true} />
      );
      const buttonSendCode = screen.getByTestId(
        'test-button-confirmatiom-email-send-code'
      );
      expect(buttonSendCode).toHaveTextContent('Cargando');
      expect(buttonSendCode).toBeDisabled();
      const buttonGoBack = screen.getByTestId(
        'test-button-confirmatiom-email-go-back'
      );
      expect(buttonGoBack).toHaveTextContent('Cargando');
      expect(buttonGoBack).toBeDisabled();
    });
    it('should show loading text for resendCode button when isRegisterInProgress is true', () => {
      render(
        <ModalConfirmationEmail {...defaultProps} isRegisterInProgress={true} />
      );
      const button = screen.getByTestId(
        'test-button-confirmatiom-email-register'
      );
      expect(button).toHaveTextContent('Cargando');
      expect(button).toBeDisabled();
    });
  });

  // --- Input Interaction Tests ---
  describe('Code Input Interaction', () => {
    it('should allow entering digits into the code inputs', () => {
      render(<ModalConfirmationEmail {...defaultProps} />);
      const input0 = screen.getByTestId('code-input-0') as HTMLInputElement;
      const input1 = screen.getByTestId('code-input-1') as HTMLInputElement;

      fireEvent.change(input0, { target: { value: '1' } });
      expect(input0).toHaveValue('1');
      expect(input1).toHaveFocus(); // Should auto-focus to the next

      fireEvent.change(input1, { target: { value: '2' } });
      expect(input1).toHaveValue('2');
      expect(screen.getByTestId('code-input-2')).toHaveFocus();
    });

    it('should only accept single digits per input', () => {
      render(<ModalConfirmationEmail {...defaultProps} />);
      const input0 = screen.getByTestId('code-input-0') as HTMLInputElement;

      // Test 1: Typing a single digit
      fireEvent.change(input0, { target: { value: '1' } });
      expect(input0).toHaveValue('1');

      // Test 2: Attempting to type multiple digits (should be blocked)
      fireEvent.change(input0, { target: { value: '123' } });
      expect(input0).toHaveValue('1'); // Value should remain '1' from previous valid input

      // Test 3: Attempting to type a non-numeric character (should be blocked)
      fireEvent.change(input0, { target: { value: 'a' } });
      expect(input0).toHaveValue('1'); // Value should still be '1'

      // Test 4: Clearing the input
      fireEvent.change(input0, { target: { value: '' } });
      expect(input0).toHaveValue('');
    });

    it('should navigate with arrow keys', () => {
      render(<ModalConfirmationEmail {...defaultProps} />);
      const input0 = screen.getByTestId('code-input-0') as HTMLInputElement;
      const input1 = screen.getByTestId('code-input-1') as HTMLInputElement;
      const input2 = screen.getByTestId('code-input-2') as HTMLInputElement;

      input0.focus();
      expect(input0).toHaveFocus();

      fireEvent.keyDown(input0, { key: 'ArrowRight' });
      expect(input1).toHaveFocus();

      fireEvent.keyDown(input1, { key: 'ArrowRight' });
      expect(input2).toHaveFocus();

      fireEvent.keyDown(input2, { key: 'ArrowLeft' });
      expect(input1).toHaveFocus();
    });
  });

  // // --- Button Action Tests ---
  describe('Button Actions', () => {
    it('should call sendCode prop when "Reenviar código" button is clicked', () => {
      render(<ModalConfirmationEmail {...defaultProps} />);
      const resendButton = screen.getByTestId(
        'test-button-confirmatiom-email-send-code'
      );
      fireEvent.click(resendButton);
      expect(defaultProps.sendCode).toHaveBeenCalledTimes(1);
    });

    it('should call finallyRegister prop with the full code when "Registrar correo" button is clicked and code is complete', () => {
      render(<ModalConfirmationEmail {...defaultProps} />);
      const registerButton = screen.getByTestId(
        'test-button-confirmatiom-email-register'
      );
      expect(registerButton).toBeDisabled(); // Initially disabled

      // Fill all inputs
      const codeToEnter = '123456';
      for (let i = 0; i < codeToEnter.length; i++) {
        fireEvent.change(screen.getByTestId(`code-input-${i}`), {
          target: { value: codeToEnter[i] },
        });
      }

      expect(registerButton).not.toBeDisabled(); // Should be enabled now

      fireEvent.click(registerButton);
      expect(defaultProps.finallyRegister).toHaveBeenCalledTimes(1);
      expect(defaultProps.finallyRegister).toHaveBeenCalledWith(codeToEnter);
    });

    it('should keep "Registrar correo" button disabled if code is incomplete', () => {
      render(<ModalConfirmationEmail {...defaultProps} />);
      const registerButton = screen.getByTestId(
        'test-button-confirmatiom-email-register'
      );
      expect(registerButton).toBeDisabled();

      // Enter only 3 digits
      fireEvent.change(screen.getByTestId('code-input-0'), {
        target: { value: '1' },
      });
      fireEvent.change(screen.getByTestId('code-input-1'), {
        target: { value: '2' },
      });
      fireEvent.change(screen.getByTestId('code-input-2'), {
        target: { value: '3' },
      });

      expect(registerButton).toBeDisabled(); // Still disabled
      expect(defaultProps.finallyRegister).not.toHaveBeenCalled(); // Should not have been called
    });

    it('should call goback prop when "Volver Atras" button is clicked', () => {
      render(<ModalConfirmationEmail {...defaultProps} />);
      const gobackButton = screen.getByTestId(
        'test-button-confirmatiom-email-go-back'
      );
      fireEvent.click(gobackButton);
      expect(defaultProps.goback).toHaveBeenCalledTimes(1);
    });
  });
});

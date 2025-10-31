import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalRegister from '@/components/React/Auth/ModalRegister';
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
const fillForm = ({ firstName = '', lastName = '', date = '' } = {}) => {
  fireEvent.change(screen.getByTestId('test-input-first-name-register'), {
    target: { value: firstName },
  });
  fireEvent.blur(screen.getByTestId('test-input-first-name-register'));

  fireEvent.change(screen.getByTestId('test-input-last-name-register'), {
    target: { value: lastName },
  });
  fireEvent.blur(screen.getByTestId('test-input-last-name-register'));

  fireEvent.change(screen.getByTestId('test-input-date-register'), {
    target: { value: date },
  });
  fireEvent.blur(screen.getByTestId('test-input-date-register'));
};

describe('Modal Complet Register', () => {
  const mockRegister = jest.fn();
  const mockCompleteRegister = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    lang: 'es' as const,
    register: mockRegister,
    completeRegister: mockCompleteRegister,
    isVerifying: false,
    email: 'test@example.com',
    errors: '',
    isRegisterCompleted: false,
    isOpen: true,
    onClose: mockOnClose,
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering and UI', () => {
    it('should render all elements correctly', () => {
      render(<ModalRegister {...defaultProps} />);
      const button = screen.getByTestId('test-button-register');
      const InputFirstName = screen.getByTestId(
        'test-input-first-name-register'
      );
      const InputFirstLastName = screen.getByTestId(
        'test-input-last-name-register'
      );
      const InputDate = screen.getByTestId('test-input-date-register');
      const InputEmail = screen.getByTestId('test-input-email-register');
      expect(InputFirstName).toBeInTheDocument();
      expect(InputFirstLastName).toBeInTheDocument();
      expect(InputDate).toBeInTheDocument();
      expect(InputEmail).toBeInTheDocument();
      expect(InputEmail).toBeDisabled();
      expect(button).toBeInTheDocument();
      expect(
        screen.queryByTestId('test-input-password-register')
      ).not.toBeInTheDocument();

      expect(
        screen.queryByTestId('test-input-confirm-password-register')
      ).not.toBeInTheDocument();
    });

    it('should show loading state when isVerifying is true', () => {
      render(<ModalRegister {...defaultProps} isVerifying={true} />);
      const button = screen.getByTestId('test-button-register');
      expect(button).toHaveTextContent('Cargando');
      expect(button).toBeDisabled();
    });

    it('should show disabled button  when isVerifying is false', () => {
      render(<ModalRegister {...defaultProps} isVerifying={false} />);
      const button = screen.getByTestId('test-button-register');
      expect(button).toHaveTextContent('Aceptar y continuar');
      expect(button).toBeDisabled();
    });
  });

  describe('Form validation', () => {
    it('should show required errors when fields are empty and user clicks submit', async () => {
      render(<ModalRegister {...defaultProps} />);
      fireEvent.click(screen.getByTestId('test-button-register'));
      expect(defaultProps.register).not.toHaveBeenCalled();
    });
  });

  describe('Form handling', () => {
    it('should clear the inputs after successful submission', async () => {
      render(<ModalRegister {...defaultProps} />);
      const firstNameInput = screen.getByTestId(
        'test-input-first-name-register'
      ) as HTMLInputElement;
      const lastNameInput = screen.getByTestId(
        'test-input-last-name-register'
      ) as HTMLInputElement;
      const dateInput = screen.getByTestId(
        'test-input-date-register'
      ) as HTMLInputElement;

      fireEvent.change(firstNameInput, { target: { value: 'Melanie' } });
      fireEvent.change(lastNameInput, { target: { value: 'Yupanqui' } });
      fireEvent.change(dateInput, { target: { value: '2000-01-01' } });
      expect(firstNameInput.value).toBe('Melanie');
      expect(lastNameInput.value).toBe('Yupanqui');
      expect(dateInput.value).toBe('2000-01-01');

      fireEvent.click(screen.getByTestId('test-button-register'));
      await waitFor(() => {
        expect(firstNameInput.value).toBe('');
        expect(lastNameInput.value).toBe('');
        expect(dateInput.value).toBe('');
      });
    });

    it('should call register with the correct data on click', async () => {
      render(<ModalRegister {...defaultProps} />);
      fillForm({
        firstName: 'Melanie',
        lastName: 'Yupanqui',
        date: '2000-01-01',
      });
      fireEvent.click(screen.getByTestId('test-button-register'));
      await waitFor(() => {
        expect(mockCompleteRegister).toHaveBeenCalledWith({
          firstName: 'Melanie',
          lastName: 'Yupanqui',
          birthDate: '2000-01-01',
        });
        expect(mockCompleteRegister).toHaveBeenCalledTimes(1);
      });
    });
  });
});

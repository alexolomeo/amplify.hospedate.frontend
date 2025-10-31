import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalGoogleLogin from '@/components/React/Auth/ModalGoogleLogin';

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
const mockGoogleLogin = jest.fn();
const mockOtherCount = jest.fn();
const mockOnClose = jest.fn();

const defaultProps = {
  lang: 'es' as const,
  email: 'test@gmail.com',
  name: 'test name',
  profilePicture: {
    original:
      'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.jpg',
    srcsetWebp:
      'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 480w',
    srcsetAvif:
      'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 480w',
  },
  googleLogin: mockGoogleLogin,
  onUseOtherAccount: mockOtherCount,
  isGoogleLoggedIn: false,
  isOpen: true,
  onClose: mockOnClose,
};
describe('ModalLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering and UI', () => {
    it('should render all elements correctly', () => {
      render(<ModalGoogleLogin {...defaultProps} />);
      expect(
        screen.getByText('Ingresa con tu cuenta de Google')
      ).toBeInTheDocument();
      expect(screen.getByText(defaultProps.name)).toBeInTheDocument();
      expect(screen.getByText('t•••t@gmail.com')).toBeInTheDocument();
      expect(
        screen.getByTestId('test-button-google-login')
      ).toBeInTheDocument();
      expect(screen.getByTestId('test-button-other-count')).toBeInTheDocument();
    });
    it('should show loading state when isVerifying is true', () => {
      render(<ModalGoogleLogin {...defaultProps} isGoogleLoggedIn={true} />);
      const buttonGoogle = screen.getByTestId('test-button-google-login');
      expect(buttonGoogle).toBeDisabled();
    });

    it('should show normal text when isVerifying is false', () => {
      render(<ModalGoogleLogin {...defaultProps} isGoogleLoggedIn={false} />);
      const buttonGoogle = screen.getByTestId('test-button-google-login');
      expect(buttonGoogle).not.toBeDisabled();
    });
  });

  describe('User interaction', () => {
    it('calls googleLogin handler when clicking on the Google login button', async () => {
      render(<ModalGoogleLogin {...defaultProps} />);
      const ButtonGoogleLogin = screen.getByTestId('test-button-google-login');
      fireEvent.click(ButtonGoogleLogin);
      await waitFor(() => {
        expect(mockGoogleLogin).toHaveBeenCalled();
      });
    });
    it('calls otherCount handler when clicking on the "use other account" button', async () => {
      render(<ModalGoogleLogin {...defaultProps} />);
      const ButtonOtherCount = screen.getByTestId('test-button-other-count');
      fireEvent.click(ButtonOtherCount);
      await waitFor(() => {
        expect(mockOtherCount).toHaveBeenCalled();
      });
    });
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgotPasswordModal from '@/components/React/Auth/ForgotPassword/ForgotPasswordSentModal';

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
    if (!isOpen) return null;
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-testid="mock-app-modal"
      >
        <h2>{title}</h2>
        {children}
        <button onClick={onClose} data-testid="mock-close">
          Close
        </button>
      </div>
    );
  },
}));

jest.mock('@/utils/i18n', () => {
  const t = {
    common: { loading: 'Cargando', unexpectedError: 'Error inesperado' },
    auth: {
      invalidEmail: 'Correo inválido',
      titleLogin: 'Ingresa tu contraseña',
    },
    forgotPassword: {
      title: 'Recuperar contraseña',
      instructions: 'Ingresa tu correo para enviarte el enlace.',
      emailLabel: 'Correo',
      placeholder: 'tu@correo.com',
      sendButton: 'Enviar enlace',
      checkEmail: 'Revisa tu correo y sigue las instrucciones.',
      resend: 'Reenviar',
      illustrationAlt: 'Sobre de email',
      cta: 'He olvidado mi contraseña',
      resetPage: {
        showPassword: 'Mostrar contraseña',
        hidePassword: 'Ocultar contraseña',
      },
    },
  };
  return {
    __esModule: true,
    getTranslation: () => t,
  };
});

jest.mock('@/services/auth', () => ({
  __esModule: true,
  requestPasswordReset: jest.fn<
    Promise<void>,
    [string, { skipGlobal404Redirect: boolean }]
  >(),
}));
import { requestPasswordReset } from '@/services/auth';

describe('ForgotPasswordModal', () => {
  const onClose = jest.fn();

  const openProps = {
    lang: 'es' as const,
    isOpen: true,
    onClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders REQUEST step UI (input y enviar)', () => {
    render(<ForgotPasswordModal {...openProps} />);
    expect(screen.getByTestId('mock-app-modal')).toBeInTheDocument();
    expect(screen.getByText('Recuperar contraseña')).toBeInTheDocument();
    expect(
      screen.getByText('Ingresa tu correo para enviarte el enlace.')
    ).toBeInTheDocument();

    const email = screen.getByTestId('forgot-input-email');
    expect(email).toBeInTheDocument();
    expect(email).toHaveAttribute('type', 'email');

    const sendBtn = screen.getByTestId('forgot-send-button');
    expect(sendBtn).toHaveTextContent('Enviar enlace');
    expect(sendBtn).not.toBeDisabled();
  });

  it('shows validation error when email is invalid', async () => {
    render(<ForgotPasswordModal {...openProps} />);

    const email = screen.getByTestId('forgot-input-email') as HTMLInputElement;
    const sendBtn = screen.getByTestId('forgot-send-button');

    fireEvent.change(email, { target: { value: 'no-es-email' } });
    fireEvent.click(sendBtn);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Correo inválido');
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email.getAttribute('aria-describedby')).toBe('forgot-email-error');
  });

  it('submits valid email, normaliza y pasa a SENT', async () => {
    (requestPasswordReset as jest.Mock).mockResolvedValueOnce(undefined);

    render(<ForgotPasswordModal {...openProps} />);

    const email = screen.getByTestId('forgot-input-email') as HTMLInputElement;
    const sendBtn = screen.getByTestId('forgot-send-button');

    fireEvent.change(email, { target: { value: '  USUARIO@EXAMPLE.com  ' } });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(requestPasswordReset).toHaveBeenCalledWith('usuario@example.com', {
        skipGlobal404Redirect: true,
      });
    });

    expect(
      await screen.findByText('Revisa tu correo y sigue las instrucciones.')
    ).toBeInTheDocument();

    expect(screen.getByTestId('forgot-resend-button')).toBeInTheDocument();
  });

  it('resend calls service again con el mismo email normalizado y muestra loading', async () => {
    (requestPasswordReset as jest.Mock).mockResolvedValueOnce(undefined);
    (requestPasswordReset as jest.Mock).mockResolvedValueOnce(undefined);

    render(<ForgotPasswordModal {...openProps} />);

    const email = screen.getByTestId('forgot-input-email') as HTMLInputElement;
    fireEvent.change(email, { target: { value: ' User@Mail.COM ' } });
    fireEvent.click(screen.getByTestId('forgot-send-button'));

    await screen.findByText('Revisa tu correo y sigue las instrucciones.');

    const resend = screen.getByTestId('forgot-resend-button');
    expect(resend).toHaveTextContent('Reenviar');

    fireEvent.click(resend);

    await waitFor(() => {
      expect(resend).toHaveAttribute('aria-busy', 'true');
    });

    await waitFor(() => {
      expect(requestPasswordReset).toHaveBeenLastCalledWith('user@mail.com', {
        skipGlobal404Redirect: true,
      });
    });

    expect(resend).toHaveTextContent('Reenviar');
  });

  it('resend muestra error cuando el servicio falla', async () => {
    (requestPasswordReset as jest.Mock).mockResolvedValueOnce(undefined);
    (requestPasswordReset as jest.Mock).mockRejectedValueOnce(
      new Error('manyRequests')
    );

    render(<ForgotPasswordModal {...openProps} />);

    const email = screen.getByTestId('forgot-input-email') as HTMLInputElement;
    fireEvent.change(email, { target: { value: 'user@mail.com' } });
    fireEvent.click(screen.getByTestId('forgot-send-button'));

    await screen.findByText('Revisa tu correo y sigue las instrucciones.');

    fireEvent.click(screen.getByTestId('forgot-resend-button'));

    const resendAlert = await screen.findByRole('alert');
    expect(resendAlert).toHaveTextContent('manyRequests');
  });

  it('REQUEST muestra error del servicio cuando la petición falla', async () => {
    (requestPasswordReset as jest.Mock).mockRejectedValueOnce(
      new Error('badRequest')
    );

    render(<ForgotPasswordModal {...openProps} />);

    const email = screen.getByTestId('forgot-input-email') as HTMLInputElement;
    const send = screen.getByTestId('forgot-send-button');

    fireEvent.change(email, { target: { value: 'user@mail.com' } });
    fireEvent.click(send);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('badRequest');
  });

  it('al cerrar (isOpen=false) resetea estado y al abrir vuelve a REQUEST limpio', async () => {
    const { rerender } = render(<ForgotPasswordModal {...openProps} />);

    (requestPasswordReset as jest.Mock).mockResolvedValueOnce(undefined);
    fireEvent.change(screen.getByTestId('forgot-input-email'), {
      target: { value: 'user@mail.com' },
    });
    fireEvent.click(screen.getByTestId('forgot-send-button'));
    await screen.findByText('Revisa tu correo y sigue las instrucciones.');

    rerender(<ForgotPasswordModal {...openProps} isOpen={false} />);
    expect(screen.queryByTestId('mock-app-modal')).not.toBeInTheDocument();

    rerender(<ForgotPasswordModal {...openProps} isOpen={true} />);
    expect(screen.getByTestId('mock-app-modal')).toBeInTheDocument();
    expect(screen.getByTestId('forgot-input-email')).toHaveValue('');
    expect(screen.getByTestId('forgot-send-button')).toHaveTextContent(
      'Enviar enlace'
    );
    expect(
      screen.queryByText('Revisa tu correo y sigue las instrucciones.')
    ).not.toBeInTheDocument();
  });
});

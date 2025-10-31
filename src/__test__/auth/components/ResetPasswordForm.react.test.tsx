import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResetPasswordForm from '@/components/React/Auth/ForgotPassword/ResetPasswordForm';

jest.mock('/src/icons/eye.svg?react', () => ({
  __esModule: true,
  default: () => <svg data-testid="icon-eye" />,
}));
jest.mock('/src/icons/eye-slash.svg?react', () => ({
  __esModule: true,
  default: () => <svg data-testid="icon-eye-off" />,
}));

jest.mock('@/utils/i18n', () => {
  const t = {
    common: { unexpectedError: 'Unexpected error' },
    forgotPassword: {
      cta: 'He olvidado mi contraseña',
      resetPage: {
        enterNewPassword: 'Ingresa tu nueva contraseña',
        passwordLabel: 'Nueva contraseña',
        passwordPlaceholder: 'Escribe tu nueva contraseña',
        confirmPlaceholder: 'Confirma tu nueva contraseña',
        changeAndSignIn: 'Cambiar y entrar',
        tooShort: 'La contraseña es demasiado corta',
        cannotBeAllNumbers: 'No puede ser solo números',
        cannotBeAllLetters: 'No puede ser solo letras',
        needsNumberOrSymbol: 'Debe tener números o símbolos',
        containsPersonalInfo: 'No puede contener tu información personal',
        mustMatch: 'Las contraseñas deben coincidir',
        showPassword: 'Mostrar contraseña',
        hidePassword: 'Ocultar contraseña',
        restoreError: {
          title: 'No se pudo restablecer la contraseña',
          intro: 'Revisa que tu contraseña cumpla:',
          bullets: {
            minLength: 'Mínimo 8 caracteres',
            notAllNumbers: 'No solo números',
            notAllLetters: 'No solo letras',
            numberOrSymbol: 'Incluye número o símbolo',
            notContainUser: 'No contenga datos personales',
            notCommon: 'No sea demasiado común',
          },
        },
      },
    },
  };
  return {
    __esModule: true,
    getTranslation: () => t,
  };
});

import type { PasswordErrorCode } from '@/components/React/Utils/forgot-password/password';
jest.mock('@/components/React/Utils/forgot-password/password', () => {
  return {
    __esModule: true,
    validatePassword: jest.fn<PasswordErrorCode | null, [string]>(),
  };
});
import { validatePassword } from '@/components/React/Utils/forgot-password/password';

jest.mock('@/services/auth', () => {
  return {
    __esModule: true,
    validateAuthToken: jest.fn<
      Promise<void>,
      [string, string, { skipGlobal404Redirect?: boolean }]
    >(),
    restorePassword: jest.fn<Promise<void>, [string, string]>(),
  };
});
import { validateAuthToken, restorePassword } from '@/services/auth';

const setupLocationReplaceSpy = () => {
  const original = window.location;
  const replaceMock = jest.fn();

  Object.defineProperty(window, 'location', {
    value: {
      ...original,
      replace: replaceMock,
    },
    writable: true,
    configurable: true,
  });

  return {
    replaceMock,
    restore: () =>
      Object.defineProperty(window, 'location', { value: original }),
  };
};

describe('ResetPasswordForm', () => {
  const token = 'valid-restore-token';

  beforeEach(() => {
    jest.clearAllMocks();
    (validateAuthToken as jest.Mock).mockResolvedValue(undefined);
    (restorePassword as jest.Mock).mockResolvedValue(undefined);
    (validatePassword as jest.Mock).mockReturnValue(null);
  });

  it('renders form and disables submit until requirements are met', async () => {
    render(<ResetPasswordForm token={token} lang="es" />);

    expect(validateAuthToken).toHaveBeenCalledWith(token, 'RESTORE_PASSWORD', {
      skipGlobal404Redirect: true,
    });

    expect(
      await screen.findByText('Ingresa tu nueva contraseña')
    ).toBeInTheDocument();
    const pwInput = screen.getByTestId(
      'reset-input-password'
    ) as HTMLInputElement;
    const confirmInput = screen.getByTestId(
      'reset-input-confirm'
    ) as HTMLInputElement;
    const submit = screen.getByTestId('reset-submit');

    expect(pwInput).toBeInTheDocument();
    expect(confirmInput).toBeInTheDocument();
    expect(submit).toBeDisabled();

    fireEvent.change(pwInput, { target: { value: 'short' } });
    fireEvent.change(confirmInput, { target: { value: 'short' } });
    expect(submit).toBeDisabled();

    (validatePassword as jest.Mock).mockReturnValueOnce('allNumbers');
    fireEvent.change(pwInput, { target: { value: '12345678' } });
    fireEvent.change(confirmInput, { target: { value: '12345678' } });

    const alerts1 = await screen.findAllByRole('alert');
    expect(
      alerts1.some((a) => a.textContent?.includes('No puede ser solo números'))
    ).toBe(true);
    expect(submit).toBeDisabled();
  });

  it('shows "must match" message when confirmation does not match', async () => {
    render(<ResetPasswordForm token={token} lang="es" />);
    const pwInput = await screen.findByTestId('reset-input-password');
    const confirmInput = screen.getByTestId('reset-input-confirm');

    (validatePassword as jest.Mock).mockReturnValue(null);
    fireEvent.change(pwInput, { target: { value: 'StrongPwd1' } });
    fireEvent.change(confirmInput, { target: { value: 'Different' } });

    const alerts2 = await screen.findAllByRole('alert');
    expect(
      alerts2.some((a) =>
        a.textContent?.includes('Las contraseñas deben coincidir')
      )
    ).toBe(true);
  });

  it('toggles password visibility for both fields', async () => {
    render(<ResetPasswordForm token={token} lang="es" />);
    const pwInput = (await screen.findByTestId(
      'reset-input-password'
    )) as HTMLInputElement;
    const confirmInput = screen.getByTestId(
      'reset-input-confirm'
    ) as HTMLInputElement;

    const toggleNew = screen.getByTestId('toggle-new-password-visibility');
    const toggleConfirm = screen.getByTestId(
      'toggle-confirm-password-visibility'
    );

    expect(pwInput.type).toBe('password');
    expect(confirmInput.type).toBe('password');

    fireEvent.click(toggleNew);
    expect(pwInput.type).toBe('text');

    fireEvent.click(toggleConfirm);
    expect(confirmInput.type).toBe('text');
  });

  it('submits successfully and redirects to /auth?reset=ok', async () => {
    const { replaceMock, restore } = setupLocationReplaceSpy();
    try {
      render(<ResetPasswordForm token={token} lang="es" />);

      const pwInput = await screen.findByTestId('reset-input-password');
      const confirmInput = screen.getByTestId('reset-input-confirm');
      const submit = screen.getByTestId('reset-submit');

      (validatePassword as jest.Mock).mockReturnValue(null);
      fireEvent.change(pwInput, { target: { value: 'StrongPwd1' } });
      fireEvent.change(confirmInput, { target: { value: 'StrongPwd1' } });

      await waitFor(() => expect(submit).toBeEnabled());

      fireEvent.click(submit);

      await waitFor(() => {
        expect(validateAuthToken).toHaveBeenCalledTimes(2);
        expect(restorePassword).toHaveBeenCalledWith(token, 'StrongPwd1');
        expect(replaceMock).toHaveBeenCalledWith('/auth?reset=ok');
      });
    } finally {
      restore();
    }
  });

  it('redirects to /reset-password-404 when token is invalid on mount', async () => {
    const { replaceMock, restore } = setupLocationReplaceSpy();
    (validateAuthToken as jest.Mock).mockRejectedValueOnce(
      new Error('invalidToken')
    );
    try {
      render(<ResetPasswordForm token={token} lang="es" />);
      await waitFor(() => {
        expect(replaceMock).toHaveBeenCalledWith('/reset-password-404');
      });
    } finally {
      restore();
    }
  });

  it('redirects to /reset-password-404 when backend returns restoreTokenNotFound on submit', async () => {
    const { replaceMock, restore } = setupLocationReplaceSpy();
    try {
      render(<ResetPasswordForm token={token} lang="es" />);

      const pwInput = await screen.findByTestId('reset-input-password');
      const confirmInput = screen.getByTestId('reset-input-confirm');
      const submit = screen.getByTestId('reset-submit');

      (validatePassword as jest.Mock).mockReturnValue(null);
      fireEvent.change(pwInput, { target: { value: 'StrongPwd1' } });
      fireEvent.change(confirmInput, { target: { value: 'StrongPwd1' } });

      await waitFor(() => expect(submit).toBeEnabled());

      (restorePassword as jest.Mock).mockRejectedValueOnce(
        new Error('restoreTokenNotFound')
      );

      fireEvent.click(submit);

      await waitFor(() =>
        expect(replaceMock).toHaveBeenCalledWith('/reset-password-404')
      );
    } finally {
      restore();
    }
  });

  it('shows restore 404 message when backend returns restoreValidationFailed', async () => {
    render(<ResetPasswordForm token={token} lang="es" />);

    const pwInput = await screen.findByTestId('reset-input-password');
    const confirmInput = screen.getByTestId('reset-input-confirm');
    const submit = screen.getByTestId('reset-submit');

    (validatePassword as jest.Mock).mockReturnValue(null);
    fireEvent.change(pwInput, { target: { value: 'StrongPwd1' } });
    fireEvent.change(confirmInput, { target: { value: 'StrongPwd1' } });

    await waitFor(() => expect(submit).toBeEnabled());

    (restorePassword as jest.Mock).mockRejectedValueOnce(
      new Error('restoreValidationFailed')
    );
    fireEvent.click(submit);

    const alert = await screen.findByTestId('reset-api-error');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('No se pudo restablecer la contraseña');
  });

  it('shows unexpected error message for other errors', async () => {
    render(<ResetPasswordForm token={token} lang="es" />);

    const pwInput = await screen.findByTestId('reset-input-password');
    const confirmInput = screen.getByTestId('reset-input-confirm');
    const submit = screen.getByTestId('reset-submit');

    (validatePassword as jest.Mock).mockReturnValue(null);
    fireEvent.change(pwInput, { target: { value: 'StrongPwd1' } });
    fireEvent.change(confirmInput, { target: { value: 'StrongPwd1' } });

    await waitFor(() => expect(submit).toBeEnabled());

    (restorePassword as jest.Mock).mockRejectedValueOnce(new Error('weird'));
    fireEvent.click(submit);

    const alert = await screen.findByTestId('reset-api-error');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('weird');
  });
});

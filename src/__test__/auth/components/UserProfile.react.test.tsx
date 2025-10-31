import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfile from '@/components/React/Header/UserProfile';
import { logout } from '@/services/auth';
import { $auth } from '@/stores/auth';
import { $userStore } from '@/stores/userStore';
import type { UserStore } from '@/types/user';
import AvatarDisplay from '@/components/React/Common/AvatarDisplay';

jest.mock('@/services/SessionService', () => ({
  sessionService: { clearTokens: jest.fn() },
}));

jest.mock('@nanostores/persistent', () => {
  const listeners = new Set<(v: unknown) => void>();
  let value: unknown = null;
  return {
    persistentAtom: () => ({
      get: () => value,
      set: (v: unknown) => {
        value = v;
        listeners.forEach((l) => l(value));
      },
      listen: (cb: (v: unknown) => void) => {
        listeners.add(cb);
        return () => listeners.delete(cb);
      },
      setKey: (_k: string, v: unknown) => {
        value = v;
        listeners.forEach((l) => l(value));
      },
    }),
  };
});

jest.mock(
  '@/stores/timezoneStore',
  () => ({
    $timezone: {
      get: jest.fn(() => null),
      set: jest.fn(),
      listen: jest.fn(() => () => {}),
    },
  }),
  { virtual: true }
);

jest.mock('@/services/auth', () => ({
  logout: jest.fn(() => Promise.resolve()),
}));

jest.mock('@/stores/auth', () => ({
  $auth: {
    get: jest.fn(),
    listen: jest.fn(() => () => {}),
    setKey: jest.fn(),
  },
}));

jest.mock('@/stores/userStore', () => ({
  $userStore: {
    get: jest.fn(),
    listen: jest.fn(() => () => {}),
    set: jest.fn(),
  },
}));

jest.mock('@/components/React/Common/AvatarDisplay', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/stores/authHint', () => ({
  $isLoggedInHint: {
    set: jest.fn(),
  },
}));

const mockedAuthStore = $auth as jest.Mocked<typeof $auth>;
const mockedUserStore = $userStore as jest.Mocked<typeof $userStore>;
const mockedAvatarDisplay = AvatarDisplay as jest.Mock;

describe('UserProfile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuthStore.get.mockReturnValue({
      isLoading: false,
      accessToken: null,
    });
    mockedUserStore.get.mockReturnValue(null);
  });

  it('should render the loading skeleton when isLoading is true', () => {
    mockedAuthStore.get.mockReturnValue({ isLoading: true, accessToken: null });
    render(<UserProfile lang="es" />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should render the logged-out state correctly', () => {
    render(<UserProfile lang="es" />);
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(mockedAvatarDisplay).not.toHaveBeenCalled();
  });

  it('should call AvatarDisplay with null user when logged in but user data is not yet available', () => {
    mockedAuthStore.get.mockReturnValue({
      isLoading: false,
      accessToken: 'fake-token',
    });
    mockedUserStore.get.mockReturnValue(null);

    render(<UserProfile lang="es" />);

    expect(mockedAvatarDisplay).toHaveBeenCalledTimes(1);
    expect(mockedAvatarDisplay.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        profilePicture: undefined,
        size: 'h-7 w-7 md:h-8 md:w-8',
        sizeText: 'text-sm',
        username: undefined,
      })
    );
  });

  it('should call AvatarDisplay with user data when logged in and user data is available', () => {
    const mockUser: UserStore = {
      firstName: 'John',
      email: 'test@test.com',
      identityVerified: true,
      profilePicture: { original: 'test.jpg', srcsetAvif: '', srcsetWebp: '' },
      isRegisterCompleted: true,
      isHost: true,
    };

    mockedAuthStore.get.mockReturnValue({
      isLoading: false,
      accessToken: 'fake-token',
    });
    mockedUserStore.get.mockReturnValue(mockUser);

    render(<UserProfile lang="es" />);

    expect(mockedAvatarDisplay).toHaveBeenCalledTimes(1);
    expect(mockedAvatarDisplay.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        profilePicture: mockUser.profilePicture,
        size: 'h-7 w-7 md:h-8 md:w-8',
        sizeText: 'text-sm',
        username: 'John',
      })
    );
  });

  it('should disable the button and call logout on click', async () => {
    mockedAuthStore.get.mockReturnValue({
      isLoading: false,
      accessToken: 'fake-token',
    });
    render(<UserProfile lang="es" />);
    const logoutButton = screen.getByText('Cerrar Sesión');

    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(logoutButton).toBeDisabled();
    });
    expect(logout).toHaveBeenCalledTimes(1);
  });
});

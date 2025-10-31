import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useStore } from '@nanostores/react';
import { $auth } from '@/stores/auth';
import { $userStore } from '@/stores/userStore';
import { logout } from '@/services/auth';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import clsx from 'clsx';
import UserCircleOutlineIcon from '/src/icons/user-circle-outline.svg?react';
import ChevronDownIcon from '/src/icons/chevron-down.svg?react';
import AvatarDisplay from '../Common/AvatarDisplay';
import MenuIcon from '/src/icons/menu.svg?react';
import { AuthEventEmitter } from '@/utils/authEventEmitter';
import { sessionService } from '@/services/SessionService';

interface Props {
  lang?: SupportedLanguages;
  viewHosting?: boolean;
}
export interface AstroWindow extends Window {
  Astro?: {
    navigate?: (url: string) => void;
  };
}

export default React.memo(function UserProfile({
  lang = 'es',
  viewHosting = false,
}: Props) {
  const { isLoading: isSessionLoading, accessToken } = useStore($auth);
  const user = useStore($userStore);
  const isLoggedIn = !!accessToken;

  const [hasMounted, setHasMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const t = useMemo(() => getTranslation(lang), [lang]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuBlur = useCallback((e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsMenuOpen(false);
    }
  }, []);

  const handleMenuClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isMenuOpen) {
        (e.currentTarget as HTMLElement).blur();
        setIsMenuOpen(false);
      } else {
        setIsMenuOpen(true);
      }
    },
    [isMenuOpen]
  );

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await logout().catch(() => {});
    } catch (error) {
      console.error('Logout API failed', error);
    } finally {
      sessionService.clearTokens();
      setIsLoggingOut(false);
      window.location.replace('/');
    }
  }, [isLoggingOut]);

  const handleOpenLogin = useCallback(() => {
    const redirect = location.pathname || '/';
    AuthEventEmitter.emit('ui.openAuth', { redirect });
  }, []);

  if (!hasMounted || isSessionLoading) {
    return (
      <div className="bg-base-200 h-12 w-24 animate-pulse rounded-[16px]"></div>
    );
  }
  // TODO: Uncomment this section once the functionality is implemented
  const loggedIn = [
    // { href: '/users/save', label: t.userProfile.saved },
    { href: '/users/profile', label: t.userProfile.profile },
    { href: '/users/account', label: t.userProfile.settings },
    { href: '/users/messages', label: t.userProfile.messages },
    { href: '/users/trips', label: t.userProfile.trips },
    ...(!user?.isHost
      ? [{ href: '/listing/create', label: t.userProfile.rentYourPlace }]
      : []),
    ...(user?.isHost
      ? [
          ...(viewHosting
            ? [{ href: '/', label: t.userProfile.guest }]
            : [{ href: '/hosting', label: t.userProfile.hosting }]),
          ...(viewHosting
            ? [
                { href: '/hosting', label: t.menu.dashboard },
                { href: '/hosting/calendar', label: t.menu.calendar },
                { href: '/hosting/listings', label: t.menu.listings },
              ]
            : []),
        ]
      : []),
  ];

  return (
    <div
      className={clsx(
        'dropdown dropdown-end',
        isLoggingOut && 'pointer-events-none opacity-50'
      )}
    >
      <div
        tabIndex={0}
        role="button"
        className="btn btn-outline btn-primary group hidden h-10 items-center gap-1.5 rounded-[16px] px-2 md:flex md:h-12 md:gap-2 md:px-3"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full md:h-8 md:w-8">
          {isLoggedIn ? (
            <AvatarDisplay
              profilePicture={user?.profilePicture}
              username={user?.firstName}
              size="h-7 w-7 md:h-8 md:w-8"
              sizeText="text-sm"
            />
          ) : (
            <UserCircleOutlineIcon className="h-7 w-7 md:h-8 md:w-8" />
          )}
        </div>
        <ChevronDownIcon className="h-4 w-4" />
      </div>
      <div
        tabIndex={0}
        role="button"
        onClick={handleMenuClick}
        onBlur={handleMenuBlur}
        className="flex h-10 items-center justify-center px-2 md:hidden md:h-12 md:gap-2 md:px-3"
      >
        <MenuIcon className="text-secondary h-5 w-5" />
      </div>
      <div
        tabIndex={0}
        className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-[var(--color-base-150)] p-3 shadow"
      >
        <ul>
          {isLoggedIn ? (
            <>
              {loggedIn.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="hover:bg-base-200 text-sm hover:rounded-full"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  type="button"
                  className="hover:bg-base-200 text-sm hover:rounded-full"
                >
                  {isLoggingOut
                    ? t.userProfile.loggingOut
                    : t.userProfile.logout}
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button
                  onClick={handleOpenLogin}
                  type="button"
                  className="hover:bg-base-200 text-sm hover:rounded-full"
                >
                  {t.userProfile.signUp}
                </button>
              </li>
              <li>
                <button
                  onClick={handleOpenLogin}
                  type="button"
                  className="hover:bg-base-200 text-sm hover:rounded-full"
                >
                  {t.userProfile.login}
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
});

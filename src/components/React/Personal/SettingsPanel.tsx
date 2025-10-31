import React, { useState, useEffect, useCallback } from 'react';
import { useFetch } from '../Hooks/useFetch';
import { fetchUserMe, getLoginInfo } from '@/services/users';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorState from '../Common/ErrorState';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import ChangePasswordModal from './ChangePasswordModal';
import { changePassword, deactivateAccount, logout } from '@/services/auth';

import NotFoundState from '../Common/NotFoundState';
import PasswordChangedModal from './PasswordChangedModal';
import ModalDeactivateAccount from './ModalDeactivateAccount';
import type { AstroWindow } from '../Header/UserProfile';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage';
import { sessionService } from '@/services/SessionService';

interface SettingsPanelProps {
  lang: SupportedLanguages;
}

const SettingsPanel = ({ lang }: SettingsPanelProps) => {
  const t = getTranslation(lang);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSuccessModal, setshowSuccessModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [lastUpdatedPassword, setLastUpdatedPassword] = useState('');
  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname : '/';
  const [changePasswordError, setChangePasswordError] = useState<string | null>(
    null
  );
  const {
    data: userMe,
    isLoading,
    error,
    isRetrying,
    fetchData,
    retry,
  } = useFetch(fetchUserMe);

  const {
    data: loginInfo,
    isLoading: isLoadingInfo,
    fetchData: fetchDataInfo,
  } = useFetch(getLoginInfo);

  useEffect(() => {
    fetchData();
    fetchDataInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loginInfo) return;
    setLastUpdatedPassword(loginInfo.lastUpdatedPassword);
  }, [loginInfo]);

  const handleCancelChangePassword = () => {
    setShowChangePassword(false);
    setChangePasswordError(null);
  };

  const handleVerifyChangePassword = async (
    oldPassword: string,
    newPassword: string
  ) => {
    setChangePasswordError(null);
    try {
      await changePassword(oldPassword, newPassword);
      setShowChangePassword(false);
      setshowSuccessModal(true);
    } catch (error: unknown) {
      setChangePasswordError(
        getApiErrorMessage(error, 'Error changing password')
      );
    }
  };

  const handleDeactivateAccount = useCallback(async () => {
    if (isDeactivating) return;
    setIsDeactivating(true);
    try {
      await deactivateAccount();
      await logout();
      sessionService.clearTokens();
      if (currentPath !== '/') {
        const win = window as AstroWindow;
        if (
          typeof win.Astro !== 'undefined' &&
          typeof win.Astro.navigate === 'function'
        ) {
          win.Astro.navigate?.('/'); // Use Astro's navigation if available
        } else {
          window.location.href = '/'; // Fallback to native if Astro.navigate isn't available
        }
      }
      setShowDeactivateModal(false);
    } catch (error) {
      console.error('Account deactivation failed:', error);
    } finally {
      setIsDeactivating(false);
    }
  }, [isDeactivating, currentPath]);

  // Utility to get relative time string
  const getRelativeTime = useCallback(
    (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';

      const now = new Date();
      const { time } = t.users;

      const diffMs = now.getTime() - date.getTime();
      if (diffMs < 0) return time.justNow;

      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffSec / 3600);
      const diffDay = Math.floor(diffSec / 86400);

      let yearDiff = now.getFullYear() - date.getFullYear();
      let monthDiff = now.getMonth() - date.getMonth() + yearDiff * 12;
      yearDiff = Math.max(1, yearDiff);
      monthDiff = Math.max(1, monthDiff);

      let relative = '';

      if (diffSec < 60) {
        relative = time.justNow;
      } else if (diffMin < 60) {
        relative =
          diffMin === 1
            ? time.minute
            : time.minutes.replace('{count}', String(diffMin));
      } else if (diffHour < 24) {
        relative =
          diffHour === 1
            ? time.hour
            : time.hours.replace('{count}', String(diffHour));
      } else if (diffDay < 30) {
        // until ~1 month, we don't approximate
        relative =
          diffDay === 1
            ? time.day
            : time.days.replace('{count}', String(diffDay));
      } else if (monthDiff < 12) {
        // months
        relative =
          monthDiff === 1
            ? time.month
            : time.months.replace('{count}', String(monthDiff));
      } else {
        // year
        relative =
          yearDiff === 1
            ? time.year
            : time.years.replace('{count}', String(yearDiff));
      }

      return time.lastUpdated.replace('{time}', relative);
    },
    [t.users]
  );

  if (isLoading || isLoadingInfo) {
    return <LoadingSpinner className="h-8 w-8" lang={lang} />;
  }
  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={retry}
        isRetrying={isRetrying}
        lang={lang}
      />
    );
  }
  if (!userMe || !loginInfo) {
    return <NotFoundState message={t.users.notFound} />;
  }

  const isHospedateUser = userMe.provider === 'hospedate';

  return (
    <div className="flex flex-1 flex-col gap-6">
      {isHospedateUser && (
        <>
          {/* Login Title */}
          <div className="text-neutral flex items-center text-lg leading-[20px] font-semibold">
            {t.users.loginTitle}
          </div>

          {/* Password Card */}
          <div className="flex w-full flex-row items-start gap-6">
            <div className="flex flex-1 flex-col gap-0">
              <div className="flex items-center text-sm leading-5 font-semibold">
                {t.users.passwordTitle}
              </div>
              <div className="text-neutral flex items-center text-xs leading-4 font-normal">
                {getRelativeTime(lastUpdatedPassword)}
              </div>
            </div>
            <div className="flex h-12 items-center justify-center bg-transparent px-4">
              <button
                className="text-primary hover:text-neutral cursor-pointer text-sm leading-4 font-normal underline"
                type="button"
                onClick={() => setShowChangePassword(true)}
              >
                {t.users.edit}
              </button>
            </div>
          </div>

          <div className="border-base-200 -mt-[1px] border-t"></div>
        </>
      )}

      {/* <div className="border-base-200 -mt-[1px] border-t"></div> */}

      {/* Social Accounts */}
      {/* <div className="text-neutral flex items-center text-lg leading-[20px] font-semibold">
        {t.users.socialAccountsTitle}
      </div> */}

      {/* Facebook Card */}
      {/* <div className="flex w-full flex-row items-start gap-6">
        <div className="flex flex-1 flex-col gap-0">
          <div className="flex items-center text-sm leading-5 font-semibold">
            {t.users.facebookTitle}
          </div>
          <div className="text-neutral flex items-center text-xs leading-4 font-normal">
            {t.users.notConnected}
          </div>
        </div>
        <div className="flex h-12 items-center justify-center bg-transparent px-4">
          <button
            className="text-primary hover:text-neutral cursor-pointer text-sm leading-4 font-normal underline"
            type="button"
            onClick={() =>
              requireRegistration(() => console.log('Connect Facebook'))
            }
          >
            {t.users.edit}
          </button>
        </div>
      </div> */}

      {/* Account Section */}
      <div className="text-neutral flex items-center text-lg leading-[20px] font-semibold">
        {t.users.accountTitle}
      </div>

      {/* Deactivate Account Card */}
      <div className="flex w-full flex-row items-center gap-6">
        <div className="flex flex-1 flex-col gap-0">
          <div className="text-neutral flex items-center text-xs leading-4 font-normal">
            {t.users.deactivateAccount}
          </div>
        </div>
        <div className="flex h-12 items-center justify-center bg-transparent px-4">
          <button
            className="text-primary hover:text-neutral cursor-pointer text-sm leading-4 font-normal underline"
            type="button"
            onClick={() => {
              setShowDeactivateModal(true);
            }}
          >
            {t.users.deactivate}
          </button>
        </div>
      </div>

      <ChangePasswordModal
        open={showChangePassword}
        onClose={handleCancelChangePassword}
        onVerify={handleVerifyChangePassword}
        lang={lang}
        userName={userMe.firstName}
        email={userMe.email}
        errorMessage={changePasswordError}
      />

      <PasswordChangedModal
        open={showSuccessModal}
        onClose={() => setshowSuccessModal(false)}
        onConfirm={() => setshowSuccessModal(false)}
        lang={lang}
      />

      <ModalDeactivateAccount
        open={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={handleDeactivateAccount}
        lang={lang}
        loading={isDeactivating}
      />
    </div>
  );
};

export default SettingsPanel;

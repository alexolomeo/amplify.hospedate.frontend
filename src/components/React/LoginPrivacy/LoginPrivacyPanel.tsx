import React, { useState, useEffect } from 'react';
import { useFetch } from '../Hooks/useFetch';
import { fetchUserMe } from '@/services/users';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorState from '../Common/ErrorState';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

import NotFoundState from '../Common/NotFoundState';
import LoginPrivacyModals from './LoginPrivacyModals';

interface LoginPrivacyPanelProps {
  lang: SupportedLanguages;
}

type ModalType =
  | 'legalName'
  | 'preferredName'
  | 'email'
  | 'phone'
  | 'identity'
  | null;

const LoginPrivacyPanel = ({ lang }: LoginPrivacyPanelProps) => {
  const t = getTranslation(lang);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const {
    data: userMe,
    isLoading,
    error,
    isRetrying,
    fetchData,
    retry,
  } = useFetch(fetchUserMe);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (modalType: ModalType) => setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);
  const handleIdentityVerification = () => {
    // TODO: Redirect to identity verification page
    console.log('Redirecting to identity verification page');
  };

  if (isLoading) {
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
  if (!userMe) {
    return <NotFoundState message={t.users.notFound} />;
  }

  // Display full name or fallback
  const displayName =
    userMe.firstName && userMe.lastName
      ? `${userMe.firstName} ${userMe.lastName}`
      : userMe.preferredName || t.users.legalNamePlaceholder;
  return (
    <>
      <div className="flex flex-1 flex-col gap-6">
        {/* Name Section */}
        <div className="text-neutral flex items-center text-lg leading-[20px] font-semibold">
          {t.users.nameSection}
        </div>

        {/* Legal Name Card */}
        <div className="flex w-full flex-row items-start gap-6">
          <div className="flex flex-1 flex-col gap-0">
            <div className="flex items-center text-sm leading-5 font-semibold">
              {t.users.legalNameTitle}
            </div>
            <div className="text-neutral flex items-center text-xs leading-4 font-normal">
              {displayName}
            </div>
          </div>
          <div className="flex h-12 items-center justify-center bg-transparent px-4">
            <button
              className="text-primary hover:text-neutral cursor-pointer text-sm leading-[14px] font-normal underline"
              type="button"
              onClick={() => openModal('legalName')}
            >
              {t.users.edit}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-base-200 -mt-[1px] border-t"></div>

        {/* Preferred Name Card */}
        <div className="flex w-full flex-row items-start gap-6">
          <div className="flex flex-1 flex-col gap-0">
            <div className="flex items-center text-sm leading-5 font-semibold">
              {t.users.preferredNameTitle}
            </div>
            <div className="text-neutral flex items-center text-xs leading-4 font-normal">
              {userMe.preferredName || t.users.preferredNamePlaceholder}
            </div>
          </div>
          <div className="flex h-12 items-center justify-center bg-transparent px-4">
            <button
              className="text-primary hover:text-neutral cursor-pointer text-sm leading-[14px] font-normal underline"
              type="button"
              onClick={() => openModal('preferredName')}
            >
              {t.users.edit}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-base-200 -mt-[1px] border-t"></div>

        {/* Contact Section */}
        <div className="text-neutral flex items-center text-lg leading-[20px] font-semibold">
          {t.users.contactSection}
        </div>

        {/* Email Address Card */}
        <div className="flex w-full flex-row items-start gap-6">
          <div className="flex flex-1 flex-col gap-0">
            <div className="flex items-center text-sm leading-5 font-semibold">
              {t.users.emailAddressTitle}
            </div>
            <div className="text-neutral flex items-center text-xs leading-4 font-normal">
              {userMe.email || t.users.emailAddressPlaceholder}
            </div>
          </div>
          <div className="flex h-12 items-center justify-center bg-transparent px-4">
            <button
              className="text-primary hover:text-neutral cursor-pointer text-sm leading-[14px] font-normal underline"
              type="button"
              onClick={() => openModal('email')}
            >
              {t.users.edit}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-base-200 -mt-[1px] border-t"></div>

        {/* Phone Number Card */}
        <div className="flex w-full flex-row items-start gap-6">
          <div className="flex flex-1 flex-col gap-0">
            <div className="flex items-center text-sm leading-5 font-semibold">
              {t.users.phoneNumberTitle}
            </div>
            <div className="text-neutral flex items-center text-xs leading-4 font-normal">
              {t.users.phoneNumberDescription}
            </div>
          </div>
          <div className="flex h-12 items-center justify-center bg-transparent px-4">
            <button
              className="text-primary hover:text-neutral cursor-pointer text-sm leading-[14px] font-normal underline"
              type="button"
              onClick={() => openModal('phone')}
            >
              {t.users.edit}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-base-200 -mt-[1px] border-t"></div>

        {/* Platform Registration Section */}
        <div className="text-neutral flex items-center text-lg leading-[20px] font-semibold">
          {t.users.platformRegistrationSection}
        </div>

        {/* Identity Verification Card */}
        <div className="flex w-full flex-row items-start gap-6">
          <div className="flex flex-1 flex-col gap-0">
            <div className="flex items-center text-sm leading-5 font-semibold">
              {t.users.identityVerificationTitle}
            </div>
            <div className="text-neutral flex items-center text-xs leading-4 font-normal">
              {t.users.identityVerificationDescription}
            </div>
          </div>
          <div className="bg-warning flex h-8 items-center justify-center rounded-full px-3">
            <button
              className="text-error-content cursor-pointer text-sm leading-[14px] font-semibold"
              type="button"
              onClick={handleIdentityVerification}
            >
              {t.users.addButton}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginPrivacyModals
        activeModal={activeModal}
        onClose={closeModal}
        firstName={userMe.firstName}
        lastName={userMe.lastName}
        preferredName={userMe.preferredName}
        email={userMe.email}
        phone={userMe.phone}
        lang={lang}
      />
    </>
  );
};

export default LoginPrivacyPanel;

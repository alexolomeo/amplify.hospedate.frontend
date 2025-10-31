import { useState } from 'react';
import XMarkMiniIcon from '@/icons/x-mark-mini.svg?react';
import FlagIcon from '@/icons/flag-outline.svg?react';
import CalendarIcon from '@/icons/calendar-outline.svg?react';
import UserPlusIcon from '@/icons/user-plus-outline.svg?react';
import AppButton from '@/components/React/Common/AppButton';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import type { RegisteredResult } from '@/components/React/CreateListing/ConfirmDialogContext';
import LoadingSpinner from '@/components/React/Common/LoadingSpinner';

interface Props {
  photoUrl: string;
  onClose: (result: RegisteredResult) => void;
  lang?: SupportedLanguages;
}

export default function RegisteredUserModal({
  photoUrl,
  onClose,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="flex w-full max-w-[787px] flex-col items-start gap-6 overflow-y-auto rounded-[40px] bg-[var(--color-base-150)] p-6 lg:p-8">
      <div className="flex w-full items-start justify-between gap-6">
        <h2 className="font-outfit text-base-content flex-1 text-xl leading-7 font-semibold">
          {t.createListing.modal.registeredUserModal.title}
        </h2>
        <button
          onClick={() => onClose('close')}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg"
          aria-label={t.createListing.modal.common.close}
        >
          <XMarkMiniIcon className="text-base-content h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex w-full flex-col items-start gap-8 lg:flex-row">
        <div className="relative flex-1">
          {isImageLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <LoadingSpinner size="lg" lang={lang} message="" />
            </div>
          )}
          <img
            src={photoUrl}
            alt={t.createListing.modal.registeredUserModal.imageAlt}
            className={`h-[313px] w-full rounded-[30.4px] object-cover transition-opacity duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoading(false)}
          />
        </div>

        <div className="flex flex-1 flex-col items-start gap-8">
          <div className="flex w-full flex-col items-start gap-4">
            <p className="font-outfit text-base-content w-full text-base leading-6 font-normal">
              {t.createListing.modal.registeredUserModal.reviewIntro}
            </p>

            <div className="flex w-full items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                <FlagIcon className="text-secondary h-6 w-6" />
              </div>
              <p className="font-outfit text-neutral text-sm leading-4 font-normal">
                {t.createListing.modal.registeredUserModal.reviewDetail.part1}{' '}
                <strong className="text-base-content font-semibold">
                  {t.createListing.modal.registeredUserModal.reviewDetail.bold}
                </strong>{' '}
                {t.createListing.modal.registeredUserModal.reviewDetail.part2}
              </p>
            </div>

            <p className="font-outfit text-base-content w-full text-base leading-6 font-normal">
              {t.createListing.modal.registeredUserModal.postPublishIntro}
            </p>

            <div className="flex gap-3">
              <CalendarIcon className="text-secondary h-6 w-6 flex-shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="font-outfit text-base-content text-sm leading-4 font-bold">
                  {t.createListing.modal.registeredUserModal.stepCalendar}
                </span>
                <p className="font-outfit text-neutral text-sm leading-4 font-normal">
                  {
                    t.createListing.modal.registeredUserModal
                      .stepCalendarDescription
                  }
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <UserPlusIcon className="text-secondary h-6 w-6 flex-shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="font-outfit text-base-content text-sm leading-4 font-bold">
                  {t.createListing.modal.registeredUserModal.stepReadyGuest}
                </span>
                <p className="font-outfit text-neutral text-sm leading-4 font-normal">
                  {
                    t.createListing.modal.registeredUserModal
                      .stepReadyGuestDescription
                  }
                </p>
              </div>
            </div>
          </div>

          <AppButton
            label={t.createListing.modal.registeredUserModal.cta}
            onClick={() => onClose('submitForReview')}
            size="md"
            className="h-12 w-full rounded-full shadow-sm"
            icon={FlagIcon}
            iconPosition="right"
          />
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import VerifiedIcon from '@/icons/verified.svg?react';
import FlagIcon from '@/icons/flag-outline.svg?react';
import XMarkMiniIcon from '@/icons/x-mark-mini.svg?react';
import AppButton from '@/components/React/Common/AppButton';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import LoadingSpinner from '@/components/React/Common/LoadingSpinner';
import UserCircleIcon from '@/icons/user-circle-outline.svg?react';

interface Props {
  photoUrl: string;
  onVerifyNow: () => void;
  onVerifyLater: () => void;
  onClose: () => void;
  lang?: SupportedLanguages;
}

export default function UnregisteredUserModal({
  photoUrl,
  onVerifyNow,
  onVerifyLater,
  onClose,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="flex w-full max-w-[787px] flex-col items-start gap-6 overflow-y-auto rounded-[40px] bg-[var(--color-base-150)] p-6 lg:p-8">
      <div className="flex w-full items-start justify-between gap-6">
        <h2 className="font-outfit text-base-content flex-1 text-xl leading-7 font-semibold">
          {t.createListing.modal.unregisteredUserModal.title}
        </h2>
        <button
          onClick={onClose}
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
            alt={t.createListing.modal.unregisteredUserModal.imageAlt}
            className={`h-[313px] w-full rounded-[30.4px] object-cover transition-opacity duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoading(false)}
          />
        </div>

        <div className="flex flex-1 flex-col items-start gap-4">
          <div className="flex flex-col items-start gap-4 self-stretch">
            <p className="font-outfit text-base-content self-stretch text-base leading-6 font-normal">
              {t.createListing.modal.unregisteredUserModal.description}
            </p>

            <div className="flex flex-col items-start gap-1 self-stretch">
              <div className="flex items-center gap-3">
                <VerifiedIcon className="text-secondary h-6 w-6 flex-shrink-0" />
                <span className="font-outfit text-base-content text-base leading-4 font-bold">
                  {t.createListing.modal.unregisteredUserModal.identity.title}
                </span>
              </div>
              <div className="flex items-center gap-2 self-stretch pl-9">
                <p className="font-outfit text-neutral flex-1 text-sm leading-4 font-normal">
                  {
                    t.createListing.modal.unregisteredUserModal.identity
                      .description
                  }
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-1 self-stretch">
              <div className="flex items-center gap-3">
                <FlagIcon className="text-secondary h-6 w-6 flex-shrink-0" />
                <span className="font-outfit text-base-content text-base leading-4 font-bold">
                  {t.createListing.modal.unregisteredUserModal.review.title}
                </span>
              </div>
              <div className="flex items-center gap-2 self-stretch pl-9">
                <p className="font-outfit text-neutral flex-1 text-sm leading-4 font-normal">
                  {
                    t.createListing.modal.unregisteredUserModal.review
                      .description.part1
                  }{' '}
                  <strong className="text-base-content font-semibold">
                    {
                      t.createListing.modal.unregisteredUserModal.review
                        .description.bold
                    }
                  </strong>{' '}
                  {
                    t.createListing.modal.unregisteredUserModal.review
                      .description.part2
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 self-stretch">
            <AppButton
              label={t.createListing.modal.unregisteredUserModal.ctaPrimary}
              onClick={onVerifyNow}
              size="md"
              className="h-12 w-full rounded-full shadow-sm"
              icon={UserCircleIcon}
              iconPosition="right"
            />

            <button
              onClick={onVerifyLater}
              className="font-outfit text-primary cursor-pointer text-sm leading-5 font-medium underline"
            >
              {t.createListing.modal.unregisteredUserModal.ctaSecondary}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

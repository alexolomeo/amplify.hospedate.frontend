import React from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { AppModal } from './AppModal';
import PlusIcon from '/src/icons/plus.svg?react';
import AvatarDisplay from '../../Common/AvatarDisplay';
import AppButton from '../../Common/AppButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onEdit: () => void;
  lang?: SupportedLanguages;
  photoUrl: string;
  username?: string;
  uploading?: boolean;
  uploadError?: string | null;
  onClearError?: () => void;
}

const ProfilePhotoConfirmModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  onEdit,
  lang = 'es',
  photoUrl,
  username = '',
  uploading = false,
  uploadError = null,
  onClearError,
}) => {
  const t = getTranslation(lang);

  // Convert string URL to Photo object for AvatarDisplay
  const photoObject = photoUrl
    ? {
        original: photoUrl,
        srcsetWebp: photoUrl,
        srcsetAvif: photoUrl,
      }
    : null;

  return (
    <AppModal
      id="modal-confirm-profile-photo"
      title={t.profile.uploadProfilePhoto}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex max-h-[72vh] flex-col bg-[var(--color-primary-content)]">
        <div className="no-scrollbar flex-1 overflow-y-auto pr-1">
          <div className="mt-8 gap-8 space-y-6">
            <div className="flex flex-col items-center">
              <h3 className="mb-2 text-center text-base font-bold">
                {t.profile.looksGood}
              </h3>
              <p className="text-center text-sm text-gray-600">
                {t.profile.photoDescription}
              </p>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="relative">
                <div className="relative h-32 w-32">
                  <AvatarDisplay
                    profilePicture={photoObject}
                    username={username}
                    size="h-full w-full"
                    sizeText="text-4xl"
                  />
                  {/* Edit photo button overlay */}
                  <button
                    type="button"
                    onClick={onEdit}
                    className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700"
                    title={t.profile.editPhoto}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 mt-4 border-t border-neutral-200 bg-[var(--color-primary-content)] px-0 py-4 backdrop-blur">
          <div className="flex flex-col gap-3">
            {uploadError && (
              <div className="mx-4 rounded-lg bg-red-50 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-red-600">{uploadError}</p>
                  <button
                    type="button"
                    onClick={onClearError}
                    className="ml-2 text-red-400 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-col items-center gap-1">
              <AppButton
                type="button"
                label={uploading ? t.profile.uploading : t.profile.ready}
                className="h-11 w-full max-w-[92%] rounded-2xl px-4 normal-case sm:max-w-[340px] sm:justify-center"
                disabled={uploading}
                onClick={onConfirm}
              />
            </div>
          </div>
        </div>
      </div>
    </AppModal>
  );
};

export default ProfilePhotoConfirmModal;

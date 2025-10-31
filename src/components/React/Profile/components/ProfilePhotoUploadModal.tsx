import React, { useRef, useState } from 'react';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import { validateProfilePhoto } from '@/utils/validateImage';
import { AppModal } from './AppModal';
import PlusIcon from '/src/icons/plus.svg?react';
import AvatarDisplay from '../../Common/AvatarDisplay';
import AppButton from '../../Common/AppButton';
import ExclamationTriangleIcon from '/src/icons/exclamation-triangle.svg?react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSelect: (file: File) => void;
  onSkip: () => void;
  onUpload: () => void;
  lang?: SupportedLanguages;
  currentPhoto?: string | null;
  selectedPhoto?: string | null;
  hasSelectedPhoto?: boolean;
  username?: string;
  loading?: boolean;
}

const ProfilePhotoUploadModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onPhotoSelect,
  onSkip,
  onUpload,
  lang = 'es',
  currentPhoto,
  selectedPhoto,
  hasSelectedPhoto = false,
  username = '',
  loading = false,
}) => {
  const t = getTranslation(lang);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsValidating(true);
      setValidationError(null);

      // Validate the profile photo with profile-specific rules
      const error = await validateProfilePhoto(file, translate.bind(null, t));

      if (error) {
        setValidationError(error);
        setIsValidating(false);
        // Clear the input
        if (event.target) {
          event.target.value = '';
        }
        return;
      }

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setValidationError(null);
      setIsValidating(false);
      onPhotoSelect(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setValidationError(null);
    onClose();
  };

  const displayPhoto =
    selectedPhoto || previewUrl || currentPhoto
      ? {
          original: selectedPhoto || previewUrl || currentPhoto || '',
          srcsetWebp: selectedPhoto || previewUrl || currentPhoto || '',
          srcsetAvif: selectedPhoto || previewUrl || currentPhoto || '',
        }
      : null;

  return (
    <AppModal
      id="modal-add-profile-photo"
      title={t.profile.uploadProfilePhoto}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <div className="flex max-h-[72vh] flex-col bg-[var(--color-primary-content)]">
        <div className="no-scrollbar flex-1 overflow-y-auto pr-1">
          <div className="mt-8 gap-8 space-y-6">
            <div className="flex flex-col items-center">
              <h3 className="mb-2 text-center text-base font-bold">
                {t.profile.personalizeAccount}
              </h3>
              <p className="text-center text-sm text-gray-600">
                {t.profile.photoDescription}
              </p>
              <div className="mt-3 rounded-md bg-blue-50 px-4 py-2">
                <p className="text-center text-xs text-gray-700">
                  {t.profile.photoRequirements}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="relative">
                <div className="relative h-32 w-32">
                  <AvatarDisplay
                    profilePicture={displayPhoto}
                    username={username}
                    size="h-full w-full"
                    sizeText="text-4xl"
                  />
                  {/* Add photo button overlay */}
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700"
                    title={t.profile.addPhoto}
                    disabled={isValidating || loading}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="mx-auto flex max-w-md items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 text-red-600" />
                <p className="flex-1">{validationError}</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        <div className="sticky bottom-0 mt-4 border-t border-neutral-200 bg-[var(--color-primary-content)] px-0 py-4 backdrop-blur">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col items-center gap-1">
              <AppButton
                type="button"
                label={loading ? t.profile.uploading : t.profile.uploadPhoto}
                className="h-11 w-full max-w-[92%] rounded-2xl px-4 normal-case sm:max-w-[340px] sm:justify-center"
                disabled={
                  !hasSelectedPhoto ||
                  loading ||
                  !!validationError ||
                  isValidating
                }
                onClick={onUpload}
              />
              <button
                type="button"
                className="text-base font-semibold text-neutral-600 underline-offset-2 hover:underline"
                onClick={onSkip}
              >
                {t.profile.skipForNow}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppModal>
  );
};

export default ProfilePhotoUploadModal;

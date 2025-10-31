import { useEffect, useMemo, useState } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import ChevronLeftIcon from '/src/icons/chevron-left.svg?react';
import TrashIcon from '/src/icons/trash.svg?react';
import DeleteModal from './DeleteModal';
import ChangeSpaceModal from './ChangeSpaceModal';
import type { SpaceType } from '@/types/listing/space';
import type { GalleryNav } from '@/types/host/edit-listing/galleryNav';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import { useSpacePhoto } from '@/components/React/Hooks/Host/EditListing/useSpacePhoto';
import { deleteSpacePhoto } from '@/stores/host/editListing/gallery.store';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';

import {
  CAPTION_MAX_CHARS,
  validatePhotoCaptionForm,
  type PhotoCaptionValidationMessages,
} from '@/components/React/Utils/edit-listing/content/YourPlace/gallery/photoCaptionValidators';
import { usePhotoCaptionForm } from '@/components/React/Utils/edit-listing/content/YourPlace/gallery/usePhotoCaptionForm';
import { createPhotoCaptionController } from '@/components/React/Utils/edit-listing/content/YourPlace/gallery/PhotoCaptionController';
import type { ListingStatus } from '@/types/host/edit-listing/editListingValues';
import { useToast } from '@/components/React/CreateListing/ToastContext';

interface Props {
  lang?: SupportedLanguages;
  listingId: string;
  spaceId: string | number;
  photoId: string | number;
  nav: GalleryNav;
  listingStatus?: ListingStatus;
  totalPhotos?: number;
  onRegisterController?: (ctrl: SectionController | null) => () => void;
  onRefresh?: () => Promise<void>;
}

function getMinPhotosForStatus(status?: ListingStatus): number {
  if (status === 'PUBLISHED') return 5;
  if (status === 'CHANGES_REQUESTED' || status === 'UNLISTED') return 1;
  return 0;
}

export default function EditSpacePhoto({
  lang = 'es',
  listingId,
  spaceId,
  photoId,
  nav,
  listingStatus,
  totalPhotos = 0,
  onRegisterController,
  onRefresh,
}: Props) {
  const t = getTranslation(lang);
  const { showToast } = useToast();

  const { isReadOnly } = useEditability();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSelectSpaceOpen, setIsSelectSpaceOpen] = useState(false);

  const { photo, loading } = useSpacePhoto(listingId, spaceId, photoId);

  const messages: PhotoCaptionValidationMessages = useMemo(
    () => ({
      required:
        t.hostContent?.editListing?.content?.gallery?.validation
          ?.requiredCaption || 'Caption is required',
      max:
        t.hostContent?.editListing?.content?.gallery?.validation?.maxCaption ||
        'Max 255 characters',
    }),
    [t]
  );

  const initialForm = useMemo(
    () => ({ text: (photo?.caption ?? '').toString() }),
    [photo?.caption]
  );
  const { form, isDirty, reset, setText } = usePhotoCaptionForm(initialForm);

  const [externalErrors, setExternalErrors] = useState<Record<
    string,
    string
  > | null>(null);

  const controller = useMemo<SectionController | null>(() => {
    if (!photo) return null;
    return createPhotoCaptionController({
      slug: 'photo-gallery',
      readOnly: isReadOnly,
      listingId,
      spaceId,
      photoId: Number(photoId),
      form,
      isDirty: () => isDirty,
      reset,
      messages,
      setExternalErrors,
    });
  }, [
    photo,
    isReadOnly,
    listingId,
    spaceId,
    photoId,
    form,
    isDirty,
    reset,
    messages,
    setExternalErrors,
  ]);

  useEffect(() => {
    if (!onRegisterController) return;
    const cleanup = onRegisterController(controller);
    return cleanup;
  }, [onRegisterController, controller]);

  const clientValidation = useMemo(
    () => validatePhotoCaptionForm(form, messages),
    [form, messages]
  );
  const clientErrors = clientValidation.ok ? null : clientValidation.errors;
  const mergedErrors = externalErrors ?? clientErrors;

  const handleDelete = async () => {
    try {
      const min = getMinPhotosForStatus(listingStatus);
      const baseMsg =
        listingStatus === 'PUBLISHED'
          ? t.hostContent?.editListing?.content?.gallery?.validation
              ?.cannotDeleteBelowMinPublished
          : t.hostContent?.editListing?.content?.gallery?.validation
              ?.cannotDeleteBelowMin;

      const message = baseMsg.replace('{min}', String(min));

      if (totalPhotos <= min) {
        setIsDeleteModalOpen(false);
        showToast({
          type: 'error',
          message: message,
          autoClose: true,
          duration: 4000,
        });
        return;
      }

      await deleteSpacePhoto(spaceId, Number(photoId));
      setIsDeleteModalOpen(false);
      await onRefresh?.();
      nav.backFromPhoto(spaceId);
    } catch (e) {
      console.error(e);
      setIsDeleteModalOpen(false);
    }
  };

  const handleAssignPhoto = (space: SpaceType) => {
    // TODO: mover foto con endpoint real cuando esté disponible
    nav.toSpace(space.id);
    setIsSelectSpaceOpen(false);
  };

  if (loading && !photo) {
    return (
      <div className="flex h-56 items-center justify-center">
        <span className="loading loading-spinner" />
      </div>
    );
  }
  if (!photo) {
    return (
      <div className="text-error p-6 text-sm">
        {t.hostContent.editListing.content.gallery.photoNotFound ??
          'Photo not found'}
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="pt-10">
        <div className="mx-5 flex max-w-xl items-center justify-between md:mx-auto lg:max-w-3xl">
          <button
            type="button"
            onClick={() => nav.backFromPhoto(spaceId)}
            className="hidden cursor-pointer items-center gap-4 font-bold md:flex"
            aria-label={t.hostContent.editListing.content.gallery.back}
            title={t.hostContent.editListing.content.gallery.back}
          >
            <ChevronLeftIcon className="h-3 w-3" />
            {t.hostContent.editListing.content.gallery.back}
          </button>

          <div className="flex items-center gap-2">
            <button
              disabled={isReadOnly}
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-primary h-12 w-12 cursor-pointer"
              aria-label={'Eliminar'}
              title={'Eliminar'}
            >
              <TrashIcon className="h-12 w-12" />
            </button>
          </div>
        </div>

        <div className="mx-5 flex h-90 max-w-xl flex-col gap-8 pt-10 md:mx-auto md:flex-row lg:max-w-3xl 2xl:h-140">
          <div className="basis-2/3">
            <ResponsiveImage
              photo={photo.photo}
              alt={photo.caption || 'Photo'}
              className="h-72 w-full rounded-[30.40px] object-cover md:h-full"
            />
          </div>

          <div className="space-y-1.5">
            <p className="edit-listing-description px-3">
              {t.hostContent.editListing.content.gallery.spaceDescription}
            </p>
            <textarea
              className="edit-listing-text-area text-sm"
              rows={1}
              value={form.text}
              onChange={(e) => {
                if (isReadOnly) return;
                setExternalErrors(null);
                setText(e.currentTarget.value);
              }}
              readOnly={isReadOnly}
              maxLength={CAPTION_MAX_CHARS}
              aria-invalid={
                !isReadOnly && Boolean(mergedErrors?.['photo.caption'])
              }
            />
            {!isReadOnly && mergedErrors?.['photo.caption'] && (
              <p className="text-error text-sm">
                {mergedErrors['photo.caption']}
              </p>
            )}
          </div>
        </div>
      </div>

      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        lang={lang}
        title={t.hostContent.editListing.content.gallery.deletePhotoQuestion}
        description={
          t.hostContent.editListing.content.gallery.deletePhotoWarning
        }
        handleDelete={handleDelete}
      />

      <ChangeSpaceModal
        open={isSelectSpaceOpen}
        onClose={() => setIsSelectSpaceOpen(false)}
        lang={lang}
        next={handleAssignPhoto}
      />
    </div>
  );
}

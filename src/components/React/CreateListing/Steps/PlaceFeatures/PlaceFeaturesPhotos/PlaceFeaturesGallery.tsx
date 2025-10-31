import clsx from 'clsx';
import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ListingPhoto } from '@/types/createListing';
import SortableGallery from './Masonry/SortableGallery';
import Modal from '@/components/React/Common/Modal';
import UploadPhotosModal from './UploadPhotosModal';
import { ColumnsPhotoAlbum } from 'react-photo-album';
import { formatListingPhotos } from '@/components/React/Utils/formatListingPhotos';
import { useToast } from '@/components/React/CreateListing/ToastContext';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import EllipsisHorizontalIcon from '/src/icons/ellipsis-horizontal.svg?react';
import TrashIcon from '/src/icons/trash-outline.svg?react';
import PlusMiniIcon from '/src/icons/plus-mini.svg?react';

interface Props {
  photos: ListingPhoto[];
  onUpdatePhotos: (photos: ListingPhoto[]) => void;
  onDeletePhoto: (photoId: number) => Promise<void>;
  onReorderPhotos: (orderedPhotos: ListingPhoto[]) => Promise<void>;
  onUpdateCaption: (photoId: number, newCaption: string) => Promise<void>;
  onUploadWithProgress: (
    files: File[],
    onProgressByIndex: (index: number, progress: number) => void
  ) => Promise<void>;
  lang?: SupportedLanguages;
}

function reorderPhotoArray(
  photos: ListingPhoto[],
  oldIndex: number,
  newIndex: number
): ListingPhoto[] {
  const updated = [...photos];
  const [moved] = updated.splice(oldIndex, 1);
  updated.splice(newIndex, 0, moved);
  return updated;
}

export default function PlaceFeaturesGallery({
  photos,
  onUpdatePhotos,
  onDeletePhoto,
  onReorderPhotos,
  onUpdateCaption,
  onUploadWithProgress,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  const { showToast } = useToast();

  const [editPhotoIndex, setEditPhotoIndex] = useState<number | null>(null);
  const [photoIndexToDelete, setPhotoIndexToDelete] = useState<number | null>(
    null
  );
  const [editCaption, setEditCaption] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hasMinimumPhotos = photos.length >= 5;

  const movePhoto = useCallback(
    async (oldIndex: number, newIndex: number) => {
      if (oldIndex >= photos.length || newIndex >= photos.length) return;
      const updated = reorderPhotoArray(photos, oldIndex, newIndex);
      onUpdatePhotos(updated);
      try {
        await onReorderPhotos(updated);
      } catch (reorderErr) {
        console.error('Error reordering photos:', reorderErr);
      }
    },
    [photos, onUpdatePhotos, onReorderPhotos]
  );

  const handleEditClick = (index: number) => setEditPhotoIndex(index);
  const closeEditModal = () => setEditPhotoIndex(null);

  const handleDeleteClick = (index: number) => {
    setPhotoIndexToDelete(index);
    setConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (photoIndexToDelete === null) return;
    const photo = photos[photoIndexToDelete];
    setIsDeleting(true);
    try {
      if (photo.original.startsWith('blob:')) {
        URL.revokeObjectURL(photo.original);
      }

      await onDeletePhoto(photo.id);
      const updated = photos.filter((p) => p.id !== photo.id);
      onUpdatePhotos(updated);
      setConfirmDeleteModalOpen(false);
      setPhotoIndexToDelete(null);
      try {
        await onReorderPhotos(updated);
      } catch (reorderErr) {
        console.error('Error reordering photos:', reorderErr);
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
      showToast({
        type: 'error',
        message: translate(
          t,
          'createListing.wizardStepContent.placeFeaturesGallery.deleteErrorMessage'
        ),
      });
      return;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSave = async () => {
    if (editPhotoIndex === null) return;

    setIsSaving(true);

    try {
      const photo = photos[editPhotoIndex];
      await onUpdateCaption(photo.id, editCaption);

      const updated = photos.map((p, i) =>
        i === editPhotoIndex ? { ...p, caption: editCaption } : p
      );

      onUpdatePhotos(updated);
      closeEditModal();
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (editPhotoIndex !== null) {
      setEditCaption(photos[editPhotoIndex].caption || '');
    }
  }, [editPhotoIndex, photos]);

  const formattedPhotos = useMemo(() => {
    const formatted = formatListingPhotos(photos, true);
    return [
      ...formatted,
      {
        key: 'placeholder-add',
        src: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
        width: 227,
        height: 227,
      },
    ];
  }, [photos]);

  useEffect(() => {
    return () => {
      setEditPhotoIndex(null);
      setPhotoIndexToDelete(null);
      setEditCaption('');
    };
  }, []);

  return (
    <div className="flex flex-col items-start justify-center gap-5 bg-white px-6 py-6 sm:px-10 md:gap-10 md:px-[70px] md:py-0 lg:px-[200px] xl:px-[350px]">
      <div className="flex flex-col items-start gap-2 self-stretch">
        <h2 className="text-[30px] leading-9 font-bold text-[var(--Text-Primary,#152E51)]">
          {hasMinimumPhotos
            ? translate(
                t,
                'createListing.wizardStepContent.placeFeaturesGallery.titleWithPhotos'
              )
            : translate(
                t,
                'createListing.wizardStepContent.placeFeaturesGallery.titleWithoutPhotos'
              )}
        </h2>

        <p className="text-base leading-6 font-normal text-[var(--Attributes-Raw-value-text,#73787C)]">
          {hasMinimumPhotos
            ? translate(
                t,
                'createListing.wizardStepContent.placeFeaturesGallery.descriptionWithPhotos'
              )
            : translate(
                t,
                'createListing.wizardStepContent.placeFeaturesGallery.descriptionWithoutPhotos'
              )}
        </p>
      </div>

      <div className="w-full">
        <SortableGallery
          gallery={ColumnsPhotoAlbum}
          photos={formattedPhotos}
          spacing={28}
          padding={0}
          columns={(containerWidth) => {
            if (containerWidth < 400) return 1;
            return 2;
          }}
          movePhoto={movePhoto}
          render={{
            image: (props) => (
              <img
                {...props}
                srcSet={props.srcSet}
                sizes={props.sizes}
                alt={props.alt || 'Hospedate'}
                className={clsx(
                  props.className,
                  'aspect-square h-[227px] w-[227px] flex-shrink-0 rounded-[40px] object-cover shadow-none'
                )}
              />
            ),

            extras: (_, { index }) => {
              const isRealPhoto = index < photos.length;

              return (
                <div className="absolute inset-0 flex items-center justify-center">
                  {isRealPhoto ? (
                    <div>
                      {index === 0 && (
                        <span className="border-base-300 bg-base-100 text-base-content absolute top-4 left-4 inline-flex items-center justify-center gap-2 rounded-full border px-2 py-1 text-sm leading-5 font-normal shadow-sm">
                          {translate(
                            t,
                            'createListing.wizardStepContent.placeFeaturesGallery.coverPhoto'
                          )}
                        </span>
                      )}
                      <div className="absolute top-4 right-4 inline-flex items-center gap-2">
                        {/* edit button */}
                        <button
                          onClick={() => handleEditClick(index)}
                          className="bg-base-200 flex h-6 w-6 cursor-pointer items-center justify-center rounded-[16px] shadow-sm"
                          aria-label="Editar foto"
                        >
                          <EllipsisHorizontalIcon className="text-base-content h-3.5 w-3.5" />
                        </button>

                        {/* close button */}
                        <button
                          onClick={() => handleDeleteClick(index)}
                          className="bg-base-200 flex h-6 w-6 cursor-pointer items-center justify-center rounded-[16px] shadow-sm"
                          aria-label="Eliminar foto"
                        >
                          <TrashIcon className="text-base-content h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[40px] border border-dashed border-[#83D1F7] bg-[#EEF7FF] px-3 py-8 sm:gap-4 sm:px-4 sm:py-10 md:py-12"
                    >
                      <img
                        src="/images/create-listing/place-features/open-upload-photos.webp"
                        alt="Icono de galería"
                        className="h-20 w-20 object-contain sm:h-[100px] sm:w-[97px] md:h-[111px] md:w-[107px]"
                      />
                      <div className="flex h-8 items-center justify-center gap-2 rounded-full border border-[#42A200] px-3 text-xs font-semibold text-[#42A200] shadow-sm sm:h-9 sm:px-4 sm:text-sm md:text-base">
                        {translate(
                          t,
                          'createListing.wizardStepContent.placeFeaturesGallery.addPhoto'
                        )}
                        <PlusMiniIcon
                          className="h-3.5 w-3.5 text-[#42A200] sm:h-4 sm:w-4"
                          aria-hidden="true"
                        />
                      </div>
                    </button>
                  )}
                </div>
              );
            },
          }}
        />
      </div>

      <Modal
        open={confirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
        title={translate(
          t,
          'createListing.wizardStepContent.placeFeaturesGallery.deleteConfirmTitle'
        )}
        backgroundColorClass="bg-[var(--color-error-content)]"
        titleTextColorClass="text-[var(--color-error)]"
        footer={
          <button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="flex h-12 w-full max-w-[158px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--color-error)] px-4 text-sm leading-[14px] font-semibold text-[var(--color-base-100)] shadow-sm disabled:opacity-50 sm:w-[158px]"
          >
            {isDeleting
              ? translate(
                  t,
                  'createListing.wizardStepContent.placeFeaturesGallery.deleting'
                )
              : translate(
                  t,
                  'createListing.wizardStepContent.placeFeaturesGallery.deleteButton'
                )}
          </button>
        }
        lang={lang}
      >
        <p className="text-base leading-6 text-[var(--Attributes-Raw-value-text)]">
          {translate(
            t,
            'createListing.wizardStepContent.placeFeaturesGallery.deleteConfirmText'
          )}
        </p>
      </Modal>

      <Modal
        open={editPhotoIndex !== null}
        onClose={closeEditModal}
        title={translate(
          t,
          'createListing.wizardStepContent.placeFeaturesGallery.editCaptionTitle'
        )}
        footer={
          <button
            onClick={handleEditSave}
            disabled={isSaving}
            className="flex h-12 w-full max-w-[158px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-4 text-sm leading-[14px] font-semibold text-[var(--color-primary-content)] shadow-sm disabled:opacity-50 sm:w-[158px]"
          >
            {isSaving
              ? translate(
                  t,
                  'createListing.wizardStepContent.placeFeaturesGallery.saving'
                )
              : translate(
                  t,
                  'createListing.wizardStepContent.placeFeaturesGallery.editCaptionSave'
                )}
          </button>
        }
        lang={lang}
      >
        <textarea
          className="w-full resize-none rounded-[16px] border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
          rows={4}
          placeholder={translate(
            t,
            'createListing.wizardStepContent.placeFeaturesGallery.captionPlaceholder'
          )}
          value={editCaption}
          onChange={(e) => setEditCaption(e.target.value)}
        />
      </Modal>

      <UploadPhotosModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadWithProgress={onUploadWithProgress}
        lang={lang}
      />
    </div>
  );
}

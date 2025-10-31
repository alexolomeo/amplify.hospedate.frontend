import { useEffect, useState } from 'react';
import ChevronLeftIcon from '/src/icons/chevron-left.svg?react';
import PlusIcon from '/src/icons/plus.svg?react';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import AssignPhotosModal from './AssignPhotosModal';
import UploadPhotosModal from '@/components/React/CreateListing/Steps/PlaceFeatures/PlaceFeaturesPhotos/UploadPhotosModal';
import DeleteModal from './DeleteModal';
import type { SupportedLanguages } from '@/utils/i18n';
import { getTranslation, translate } from '@/utils/i18n';
import type { GalleryNav } from '@/types/host/edit-listing/galleryNav';
import type { SpacePhoto } from '@/types/host/edit-listing/spacePhotos';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';

import {
  fetchPhotosFromSpace,
  uploadSpacePhotoWithProgress,
} from '@/services/host/edit-listing/gallery';

import { setSpacePhotos } from '@/stores/host/editListing/gallery.store';

interface Props {
  lang?: SupportedLanguages;
  spaceId: number;
  nav: GalleryNav;
  listingId: string;
  onRefresh?: () => Promise<void>;
}

export default function EditSpace({
  lang = 'es',
  spaceId,
  nav,
  listingId,
  onRefresh,
}: Props) {
  const t = getTranslation(lang);
  const { isReadOnly } = useEditability();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAssignPhotoOpen, setIsAssignPhotoOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [photos, setPhotos] = useState<SpacePhoto[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState<boolean>(false);
  const [errorPhotos, setErrorPhotos] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingPhotos(true);
        setErrorPhotos(null);

        const data = await fetchPhotosFromSpace(listingId, String(spaceId));
        if (cancelled) return;

        setPhotos(data);
        setSpacePhotos(spaceId, data);
      } catch {
        if (!cancelled) {
          setErrorPhotos('Failed to load space photos');
          setPhotos([]);
          setSpacePhotos(spaceId, []);
        }
      } finally {
        if (!cancelled) setLoadingPhotos(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [listingId, spaceId]);

  const goBackToGalleryRoot = (): void => nav.backFromSpace();

  const goToSinglePhoto = (photoId?: number): void => {
    if (!photoId) return;
    nav.toPhoto(spaceId, String(photoId));
  };

  const onUploadWithProgress = async (
    files: File[],
    onProgressByIndex: (index: number, progress: number) => void
  ): Promise<void> => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        await uploadSpacePhotoWithProgress(
          listingId,
          spaceId,
          file,
          (percent) => onProgressByIndex(i, percent)
        );
      } catch (err) {
        onProgressByIndex(i, -1);
        console.error(`Error uploading photo [${i}]`, err);
      }
    }

    try {
      const refreshed = await fetchPhotosFromSpace(listingId, String(spaceId));
      setPhotos(refreshed);
      setSpacePhotos(spaceId, refreshed);
      await onRefresh?.();
    } catch (err) {
      console.error('Failed to refresh photos after upload', err);
    }
  };

  const handleDelete = (): void => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="space-y-8 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChevronLeftIcon
              className="h-4 w-4 cursor-pointer"
              onClick={goBackToGalleryRoot}
            />
            <p className="text-lg font-bold">
              {t.hostContent.editListing.content.gallery.photos}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="dropdown dropdown-end">
              <button
                disabled={isReadOnly}
                tabIndex={0}
                role="button"
                className="btn btn-outline btn-circle btn-secondary h-12 w-12"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu z-1 w-80 bg-[var(--color-base-150)] p-2 text-sm shadow-sm"
              >
                <li>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="hover:bg-base-200 hover:rounded-full"
                  >
                    {t.hostContent.editListing.content.gallery.uploadFromDevice}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {loadingPhotos && (
            <p className="text-xs">
              {t.hostContent.editListing.content.gallery.uploadLoading}
            </p>
          )}
          {errorPhotos && <p className="text-error text-xs">{errorPhotos}</p>}
        </div>

        <div className="grid w-full grid-cols-2 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {photos.map((item) => (
            <button
              key={item.id}
              type="button"
              className="group flex-shrink-0 cursor-pointer"
              onClick={() => goToSinglePhoto(item.id)}
            >
              <ResponsiveImage
                photo={item.photo}
                alt={item.caption || 'photo'}
                className="h-35 w-full rounded-[30.40px] object-cover lg:h-35 xl:h-35 2xl:h-40"
              />
            </button>
          ))}
        </div>
      </div>

      <UploadPhotosModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadWithProgress={onUploadWithProgress}
        lang={lang}
      />

      <AssignPhotosModal
        open={isAssignPhotoOpen}
        id={spaceId}
        nameSpace={''}
        onClose={() => setIsAssignPhotoOpen(false)}
        lang={lang}
        title={translate(t, `spaceTypes.space`)}
        description={
          t.hostContent.editListing.content.gallery.addThesePhotosQuestion
        }
        showSkipForNow={false}
      />

      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        lang={lang}
        title={t.hostContent.editListing.content.gallery.deleteListingQuestion}
        description={
          t.hostContent.editListing.content.gallery.deleteListingWarning
        }
        handleDelete={handleDelete}
      />
    </>
  );
}

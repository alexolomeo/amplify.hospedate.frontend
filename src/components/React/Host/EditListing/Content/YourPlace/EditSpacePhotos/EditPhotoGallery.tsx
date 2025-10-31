import { useMemo, useEffect } from 'react';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import type { Slug } from '@/components/React/Utils/edit-listing/slugs';
import EditAllPhotosGallery from '@/components/React/Host/EditListing/Content/YourPlace/EditSpacePhotos/EditAllPhotosGallery';
import ShowSpaces from './ShowSpaces';
import EditSpacePhoto from '@/components/React/Host/EditListing/Content/YourPlace/EditSpacePhotos/EditSpacePhoto';
import type { GalleryNav } from '@/types/host/edit-listing/galleryNav';
import { setListingId } from '@/stores/host/editListing/gallery.store';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import type { ListingStatus } from '@/types/host/edit-listing/editListingValues';

export interface MediaPicture {
  original: string;
  srcsetWebp: string;
  srcsetAvif: string;
}

export interface Space {
  id: number;
  name: string;
  numPhotos: number;
  photo: MediaPicture;
  isDefault?: boolean;
}

export interface GallerySection {
  numPhotos: number;
  placeInfo: {
    roomNumber?: number;
    bedNumber?: number;
    bathNumber?: number;
  };
  spaces: Space[];
}

interface Props {
  lang?: SupportedLanguages;
  onNavigate: (slug: Slug, options?: { subpath?: string }) => void;
  listingId: string;
  gallerySubpath?: string;
  gallery?: GallerySection | null;
  listingStatus?: ListingStatus;
  totalPhotos?: number;
  onRegisterController?: (ctrl: SectionController | null) => () => void;
  onRefresh?: () => Promise<void>;
}

export default function EditPhotoGallery({
  lang = 'es',
  onNavigate,
  listingId,
  gallerySubpath = '',
  gallery,
  listingStatus,
  totalPhotos,
  onRegisterController,
  onRefresh,
}: Props) {
  const t = getTranslation(lang);
  useEffect(() => {
    setListingId(listingId);
  }, [listingId]);

  const segments = useMemo(() => {
    const sub = (gallerySubpath || '').replace(/\/+$/, '');
    return sub ? sub.split('/') : [];
  }, [gallerySubpath]);

  useEffect(() => {
    if (!onRegisterController) return;

    const isSpacePhoto = segments.length === 3 && segments[1] === 'space-photo';

    if (isSpacePhoto) {
      return () => {
        onRegisterController(null);
      };
    }

    const cleanup = onRegisterController(null);
    return cleanup;
  }, [onRegisterController, segments]);

  const spaces: Space[] = gallery?.spaces ?? [];

  const nav: GalleryNav = {
    toRoot: () => onNavigate('photo-gallery'),
    toAllPhotos: () => onNavigate('photo-gallery', { subpath: 'photos' }),
    toSpace: (spaceId) =>
      onNavigate('photo-gallery', { subpath: String(spaceId) }),
    toPhoto: (spaceId, photoId) =>
      onNavigate('photo-gallery', {
        subpath: `${spaceId}/space-photo/${photoId}`,
      }),

    backFromSpace: () => onNavigate('photo-gallery'),
    backFromPhoto: (spaceId) =>
      onNavigate('photo-gallery', { subpath: String(spaceId) }),
    backFromAllPhotos: () => onNavigate('photo-gallery'),
  };

  const handleSpaceClick = (space: Space) => {
    nav.toSpace(space.id);
  };

  if (segments[0] === 'photos') {
    return <EditAllPhotosGallery lang={lang} nav={nav} />;
  }

  if (segments.length === 3 && segments[1] === 'space-photo') {
    const spaceId = segments[0];
    const photoId = segments[2];
    return (
      <EditSpacePhoto
        lang={lang}
        listingId={listingId}
        spaceId={spaceId}
        photoId={photoId}
        nav={nav}
        listingStatus={listingStatus}
        totalPhotos={totalPhotos}
        onRegisterController={onRegisterController}
        onRefresh={onRefresh}
      />
    );
  }

  if (segments.length === 1 && segments[0]) {
    const spaceId = Number(segments[0]);
    if (isNaN(spaceId)) {
      nav.toRoot();
      return null;
    }
    return (
      <ShowSpaces
        lang={lang}
        spaceId={spaceId}
        nav={nav}
        listingId={listingId}
        onRefresh={onRefresh}
      />
    );
  }

  return (
    <>
      <div className="space-y-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
          <div className="basis-2/3 space-y-1">
            <h1 className="edit-listing-title">
              {t.hostContent.editListing.content.gallery.title}
            </h1>
            <p className="text-neutral text-xs">
              {t.hostContent.editListing.content.gallery.description}
            </p>
          </div>
        </div>

        {spaces.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center"
            role="status"
            aria-live="polite"
          >
            <img
              src="/images/host/listings/fallback-card-image.webp"
              alt={
                t.hostContent.editListing.content.gallery.noSpacesImageAlt ??
                'No spaces yet'
              }
              loading="lazy"
              className="h-40 w-40"
            />
            <p className="text-xl leading-7 font-bold">
              {t.hostContent.editListing.content.gallery.emptyGallery}
            </p>
            <p>
              {
                t.hostContent.editListing.content.gallery
                  .emptyGalleryDescription
              }
            </p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-2 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {spaces.map((item) => {
              const displayName =
                translate(t, `spaceTypes.${item.name}`) || item.name;

              return (
                <button
                  type="button"
                  className="group flex-shrink-0 cursor-pointer text-left"
                  key={item.id}
                  onClick={() => handleSpaceClick(item)}
                >
                  <ResponsiveImage
                    photo={item.photo}
                    alt={displayName || 'Space image'}
                    className="h-35 w-full rounded-[30.40px] object-cover lg:h-35 xl:h-35 2xl:h-40"
                  />
                  <div className="pt-3 text-start">
                    <p className="group-hover:text-secondary text-sm leading-tight group-hover:font-extrabold">
                      {displayName}
                    </p>
                    <p className="text-neutral text-xs">
                      {item.numPhotos > 0
                        ? translate(
                            t,
                            'hostContent.editListing.content.gallery.photoCount',
                            { count: item.numPhotos }
                          )
                        : t.hostContent.editListing.content.gallery.addPhotos}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

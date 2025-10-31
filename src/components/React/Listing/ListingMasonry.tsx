import { ColumnsPhotoAlbum } from 'react-photo-album';
import 'react-photo-album/columns.css';
import { getSafeArray } from '@/utils/displayHelpers';
import type { PhotoListingDetail, Space } from '@/types/listing/space';
import { formatPhotosFromListing } from '@/utils/formatPhotos';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import React from 'react';
import PhotoIcon from '/src/icons/photo.svg?react';

interface ListingMasonryProps {
  spaces?: Space[];
  width?: string;
  spacing?: number;
  columns?: number | ((containerWidth: number) => number);
  lang?: SupportedLanguages;
  open: () => void;
}
const ListingMasonry: React.FC<ListingMasonryProps> = ({
  spaces = [],
  width = '100%',
  spacing = 0,
  columns = (containerWidth) => (containerWidth < 600 ? 2 : 3),
  lang = 'es',
  open,
}) => {
  const t = getTranslation(lang);
  const safeSpaces = getSafeArray(spaces);
  const allPhotos: PhotoListingDetail[] = React.useMemo(
    () =>
      safeSpaces.flatMap((space) =>
        getSafeArray(space.photos).map((photo) => ({ ...photo }))
      ),
    [safeSpaces]
  );

  const sortedPhotos = React.useMemo(
    () => [...allPhotos].sort((a, b) => a.order - b.order).slice(0, 5),
    [allPhotos]
  );
  const formattedPhotos = React.useMemo(
    () => formatPhotosFromListing(sortedPhotos),
    [sortedPhotos]
  );

  return spaces.length === 0 ? (
    <p>{t.listingDetail.photo.noPhotos}</p>
  ) : (
    <div style={{ width }} className="relative">
      <div className="absolute right-2 bottom-3 z-10">
        <button
          className="btn bg-base-200 font-semibol rounded-3xl text-sm"
          onClick={() => open()}
          data-testid="test-button-view-photos"
        >
          {t.listingDetail.photo.showAllPhotos}
          <PhotoIcon className="h-4 w-4"></PhotoIcon>
        </button>
      </div>
      <ColumnsPhotoAlbum
        photos={formattedPhotos}
        spacing={spacing}
        columns={columns}
        onClick={() => open()}
        render={{
          image: (props, { index }) => {
            const rawPhoto = sortedPhotos[index];
            if (!rawPhoto) {
              return (
                <img
                  {...props}
                  alt={props.alt || 'Hospedate'}
                  className={`${props.className} rounded-[40px]`}
                  style={{ objectFit: 'cover' }}
                />
              );
            }
            return (
              <picture>
                {rawPhoto.srcsetAvif && (
                  <source
                    srcSet={rawPhoto.srcsetAvif}
                    type="image/avif"
                    sizes={props.sizes}
                  />
                )}
                {rawPhoto.srcsetWebp && (
                  <source
                    srcSet={rawPhoto.srcsetWebp}
                    type="image/webp"
                    sizes={props.sizes}
                  />
                )}
                <img
                  src={props.src}
                  alt={props.alt || 'Hospedate'}
                  className={`${props.className} rounded-[40px]`}
                  style={props.style}
                  width={props.width}
                  height={props.height}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                />
              </picture>
            );
          },
        }}
      />
    </div>
  );
};

export default ListingMasonry;

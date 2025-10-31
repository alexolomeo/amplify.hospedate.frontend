import type { FormattedPhoto, Space } from '@/types/listing/space';
import { getSafeArray } from '@/utils/displayHelpers';
import {
  formatPhotosFromListing,
  formatPhotosFromListingBest,
} from '@/utils/formatPhotos';
import React from 'react';
import { ColumnsPhotoAlbum } from 'react-photo-album';

const SpaceSection: React.FC<{
  space: Space;
  spacing: number;
  onPhotoClick: (index: number, slides: FormattedPhoto[]) => void;
  isUniqueSpace?: boolean;
}> = ({ space, spacing, onPhotoClick, isUniqueSpace = false }) => {
  const safePhotos = React.useMemo(
    () => getSafeArray(space.photos),
    [space.photos]
  );

  const gridPhotos = React.useMemo(
    () => formatPhotosFromListing(safePhotos, true),
    [safePhotos]
  );

  const lightboxPhotos = React.useMemo(
    () => formatPhotosFromListingBest(safePhotos),
    [safePhotos]
  );

  const handleClick = React.useCallback(
    ({ index }: { index: number }) => onPhotoClick(index, lightboxPhotos),
    [lightboxPhotos, onPhotoClick]
  );

  return (
    <div className="mb-10 space-y-1">
      {!isUniqueSpace && (
        <>
          <h2 className="text-base font-semibold md:text-lg lg:text-xl">
            {space.name}
          </h2>
          {space.amenities && (
            <p className="text-sm opacity-70">
              {space.amenities.map((a) => a.name).join(' • ')}
            </p>
          )}
          <br />
        </>
      )}
      <ColumnsPhotoAlbum
        photos={gridPhotos}
        columns={2}
        spacing={spacing}
        onClick={handleClick}
        render={{
          image: (props, { index }) => {
            const rawPhoto = safePhotos[index];
            if (!rawPhoto) {
              return (
                <img
                  {...props}
                  alt={props.alt || ''}
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
                  alt={props.alt || ''}
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

export default SpaceSection;

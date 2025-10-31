import type { Photo } from '@/types/listing/space';
import React from 'react';

interface ResponsiveImageProps {
  photo: Photo;
  alt: string;
  className: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  pictureClassName?: string;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  photo,
  alt,
  className,
  sizes = '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, 1920px',
  loading = 'lazy',
  onLoad,
  onError,
  pictureClassName,
}) => (
  <picture className={pictureClassName ?? undefined}>
    <source srcSet={photo.srcsetAvif} type="image/avif" sizes={sizes} />
    <source srcSet={photo.srcsetWebp} type="image/webp" sizes={sizes} />
    <img
      src={photo.original}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async" // Hint: better perceived performance
      onLoad={onLoad}
      onError={onError}
    />
  </picture>
);

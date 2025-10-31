import type { Photo } from 'react-photo-album';
import OptimizedImage from '@/components/React/Common/OptimizedImage';

type OverlayProps = {
  photo: Photo;
  width: number;
  height: number;
  padding?: string;
  className?: string;
};

export default function Overlay({
  photo: { src, alt, srcSet },
  width,
  height,
  padding,
  className,
}: OverlayProps) {
  return (
    <div style={{ padding }} className={className}>
      <OptimizedImage
        src={src}
        alt={alt || 'Hospedate'}
        width={width}
        height={height}
        sizes={`${width}px`}
        srcSet={srcSet
          ?.map((image) => `${image.src} ${image.width}w`)
          .join(', ')}
      />
    </div>
  );
}

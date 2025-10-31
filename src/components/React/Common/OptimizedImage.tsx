import React, { useState } from 'react';

interface OptimizedImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  /**
   * Srcset for responsive images - provide different sizes
   * Example: "/images/photo-320w.webp 320w, /images/photo-640w.webp 640w"
   */
  srcSet?: string;
  /**
   * Sizes attribute for responsive images
   * Example: "(max-width: 640px) 100vw, 640px"
   */
  sizes?: string;
  /**
   * Blur placeholder data URL for perceived performance improvement
   * Generate using: https://blurha.sh/ or similar
   */
  blurDataURL?: string;
  /**
   * Show blur-up effect (requires blurDataURL)
   */
  enableBlurUp?: boolean;
}

/**
 * Optimized image component with:
 * - Lazy loading by default
 * - Responsive images support (srcset/sizes)
 * - Blur-up placeholder effect
 * - Async decoding for better performance
 *
 * Use fetchPriority="high" for above-the-fold images
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  loading = 'lazy',
  fetchPriority = 'auto',
  srcSet,
  sizes,
  blurDataURL,
  enableBlurUp = true,
  className = '',
  style,
  onLoad,
  onError,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const showBlurUp = enableBlurUp && blurDataURL && !imageLoaded;

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageError(true);
    setImageLoaded(true);
    onError?.(e);
  };

  // If blur-up is enabled, wrap in a container
  if (showBlurUp) {
    return (
      <div className="relative overflow-hidden">
        {/* Blur placeholder */}
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl transition-opacity duration-300"
          style={{
            opacity: imageLoaded ? 0 : 1,
          }}
        />

        {/* Main image */}
        <img
          src={src}
          alt={alt}
          srcSet={srcSet}
          sizes={sizes}
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`relative z-10 transition-opacity duration-300 ${className}`}
          style={{
            ...style,
            opacity: imageLoaded || imageError ? 1 : 0,
          }}
          {...props}
        />
      </div>
    );
  }

  // No blur-up, return image directly
  return (
    <img
      src={src}
      alt={alt}
      srcSet={srcSet}
      sizes={sizes}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      onLoad={handleLoad}
      onError={handleError}
      className={`transition-opacity duration-300 ${className}`}
      style={{
        ...style,
        opacity: imageLoaded || imageError ? 1 : 0,
      }}
      {...props}
    />
  );
};

export default OptimizedImage;

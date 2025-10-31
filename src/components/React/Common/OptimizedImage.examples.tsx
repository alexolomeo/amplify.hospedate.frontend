/**
 * Example usage of OptimizedImage componexport funcexport funcexport funcexport funcexport function CardImageExample() {
  return (
    <OptimizedImage
      src="/images/listing.webp"
      alt="Property listing"
      srcSet="/images/listing-320w.webp 320w, /images/listing-640w.webp 640w, /images/listing-1024w.webp 1024w"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQpoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
      className="h-[300px] w-full rounded-lg"
    />
  );
}geExample() {
  return (
    <OptimizedImage
      src="/images/listing.webp"
      alt="Property listing"
      srcSet="/images/listing-320w.webp 320w, /images/listing-640w.webp 640w, /images/listing-1024w.webp 1024w"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQpoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
      className="h-[300px] w-full rounded-lg"
    />
  );
}geExample() {
  return (
    <OptimizedImage
      src="/images/listing.webp"
      alt="Property listing"
      srcSet="/images/listing-320w.webp 320w, /images/listing-640w.webp 640w, /images/listing-1024w.webp 1024w"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQpoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
      className="h-[300px] w-full rounded-lg"
    />
  );
}geExample() {
  return (
    <OptimizedImage
      src="/images/listing.webp"
      alt="Property listing"
      srcSet="/images/listing-320w.webp 320w, /images/listing-640w.webp 640w, /images/listing-1024w.webp 1024w"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
      className="h-[300px] w-full rounded-lg"
    />
  );
}geExample() {
  return (
    <OptimizedImage
      src="/images/listing.webp"
      alt="Property listing"
      srcSet="/images/listing-320w.webp 320w, /images/listing-640w.webp 640w, /images/listing-1024w.webp 1024w"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
      className="h-[300px] w-full rounded-lg"
    />
  );
}ponsive images and blur placeholders
 *
 * This file demonstrates the different ways to use the enhanced OptimizedImage component
 */

import React from 'react';
import OptimizedImage from './OptimizedImage';
import {
  getResponsiveSrcSet,
  getResponsiveSizes,
  RESPONSIVE_CONFIGS,
} from '../../../utils/imageOptimization';

/**
 * Example 1: Basic usage with lazy loading (default)
 */
export function BasicImageExample() {
  return <OptimizedImage src="/images/example.webp" alt="Example image" />;
}

/**
 * Example 2: Hero image with responsive sizes and blur placeholder
 */
export function HeroImageExample() {
  return (
    <OptimizedImage
      src="/images/hero.webp"
      alt="Hero banner"
      srcSet={getResponsiveSrcSet(
        '/images/hero.webp',
        RESPONSIVE_CONFIGS.hero.sizes
      )}
      sizes={RESPONSIVE_CONFIGS.hero.sizesAttr}
      blurDataURL="/images/hero-blur.webp"
      loading="eager"
      fetchPriority="high"
      className="h-[600px] w-full"
    />
  );
}

/**
 * Example 3: Card image with responsive sizes
 */
export function CardImageExample() {
  return (
    <OptimizedImage
      src="/images/listing.webp"
      alt="Property listing"
      srcSet="/images/listing-320w.webp 320w, /images/listing-640w.webp 640w, /images/listing-1024w.webp 1024w"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
      className="h-[300px] w-full rounded-lg"
    />
  );
}

/**
 * Example 4: Gallery thumbnail with custom sizes
 */
export function ThumbnailImageExample() {
  return (
    <OptimizedImage
      src="/images/photo.webp"
      alt="Gallery photo"
      srcSet={getResponsiveSrcSet(
        '/images/photo.webp',
        RESPONSIVE_CONFIGS.thumbnail.sizes
      )}
      sizes={RESPONSIVE_CONFIGS.thumbnail.sizesAttr}
      blurDataURL="/images/photo-blur.webp"
      className="h-[240px] w-[320px] rounded"
    />
  );
}

/**
 * Example 5: Above-the-fold image without blur (faster initial render)
 */
export function AboveFoldImageExample() {
  return (
    <OptimizedImage
      src="/images/banner.webp"
      alt="Banner"
      loading="eager"
      fetchPriority="high"
      enableBlurUp={false}
      className="h-[400px] w-full"
    />
  );
}

/**
 * Example 6: Using pre-defined configs for common patterns
 */
export function GalleryImageExample() {
  const config = RESPONSIVE_CONFIGS.gallery;

  return (
    <OptimizedImage
      src="/images/gallery-photo.webp"
      alt="Gallery photo"
      srcSet={getResponsiveSrcSet('/images/gallery-photo.webp', config.sizes)}
      sizes={config.sizesAttr}
      blurDataURL="/images/gallery-photo-blur.webp"
      className="w-full"
    />
  );
}

/**
 * Example 7: Custom breakpoints for specific layouts
 */
export function CustomBreakpointsExample() {
  return (
    <OptimizedImage
      src="/images/custom.webp"
      alt="Custom layout image"
      srcSet="/images/custom-480w.webp 480w, /images/custom-800w.webp 800w, /images/custom-1200w.webp 1200w"
      sizes={getResponsiveSizes({
        768: '100vw',
        1024: '66vw',
        1440: '50vw',
      })}
      blurDataURL="/images/custom-blur.webp"
    />
  );
}

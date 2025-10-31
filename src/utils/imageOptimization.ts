/**
 * Image optimization utilities for performance
 */

/**
 * Generate a tiny blur placeholder from an image
 * This should be run at build time or server-side
 */
export function generateBlurPlaceholder(): string {
  // In a real implementation, you would use sharp or similar library
  // to generate a low-quality placeholder at build time
  // For now, returning a simple placeholder pattern

  // Example base64 blur placeholder (10x10 gray pixel)
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg==';
}

/**
 * Get responsive image sizes for srcset
 * @param basePath - Base image path without size suffix
 * @param sizes - Array of widths to generate
 * @returns srcset string
 */
export function getResponsiveSrcSet(
  basePath: string,
  sizes: number[] = [320, 640, 1024, 1920]
): string {
  // Remove file extension
  const pathWithoutExt = basePath.replace(/\.(webp|jpg|jpeg|png)$/i, '');
  const ext = basePath.match(/\.(webp|jpg|jpeg|png)$/i)?.[0] || '.webp';

  return sizes
    .map((size) => `${pathWithoutExt}-${size}w${ext} ${size}w`)
    .join(', ');
}

/**
 * Get sizes attribute for responsive images
 * @param breakpoints - Object with breakpoint -> size mapping
 * @returns sizes string
 */
export function getResponsiveSizes(
  breakpoints: Record<number, string> = {
    640: '100vw',
    1024: '50vw',
    1920: '33vw',
  }
): string {
  const sorted = Object.entries(breakpoints)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([bp, size]) => `(max-width: ${bp}px) ${size}`);

  return sorted.join(', ');
}

/**
 * Pre-defined responsive configurations for common use cases
 */
export const RESPONSIVE_CONFIGS = {
  hero: {
    sizes: [640, 1024, 1920, 2560] as number[],
    sizesAttr: '100vw',
  },
  card: {
    sizes: [320, 640, 1024] as number[],
    sizesAttr: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  },
  thumbnail: {
    sizes: [160, 320, 480] as number[],
    sizesAttr: '(max-width: 640px) 50vw, 320px',
  },
  gallery: {
    sizes: [480, 800, 1200] as number[],
    sizesAttr: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px',
  },
};

/**
 * Generate blur hash placeholder (for runtime use)
 * This is a lightweight alternative to full blur placeholders
 */
export function generateBlurHash(color = '#e5e7eb'): string {
  // Simple solid color placeholder
  // In production, you might want to use blurhash library
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 3;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 4, 3);
  }

  return canvas.toDataURL();
}

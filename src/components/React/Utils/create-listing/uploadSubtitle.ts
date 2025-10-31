import { IMAGE_VALIDATION } from '@/config/image.validation';

function mapMimeToShortLabel(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
      return 'JPEG';
    case 'image/jpg':
      return 'JPG';
    case 'image/png':
      return 'PNG';
    case 'image/webp':
      return 'WEBP';
    case 'image/avif':
      return 'AVIF';
    case 'image/heic':
      return 'HEIC';
    default:
      return mime.toUpperCase();
  }
}

function collapseJpegJpg(labels: string[]): string[] {
  const hasJPG = labels.includes('JPG');
  const hasJPEG = labels.includes('JPEG');
  if (hasJPG && hasJPEG) {
    return labels.filter((l) => l !== 'JPEG');
  }
  return labels;
}

export function getUploadSubtitleMetaParams() {
  const {
    allowedFormats,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    minSizeKB,
    maxSizeMB,
  } = IMAGE_VALIDATION;

  const labels = collapseJpegJpg(allowedFormats.map(mapMimeToShortLabel));

  return {
    formats: labels.join(', '),
    minSizeKB: String(minSizeKB),
    maxSizeMB: String(maxSizeMB),
    minRes: `${minWidth}×${minHeight}`,
    maxRes: `${maxWidth}×${maxHeight}`,
  };
}

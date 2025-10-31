import {
  IMAGE_VALIDATION,
  PROFILE_PHOTO_VALIDATION,
} from '@/config/image.validation';

type ValidationConfig = {
  allowedFormats: string[];
  minSizeKB: number;
  maxSizeMB: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
};

export async function validateImage(
  file: File,
  translate: (key: string, params?: Record<string, string | number>) => string,
  config: ValidationConfig = IMAGE_VALIDATION
): Promise<string | null> {
  const {
    allowedFormats,
    minSizeKB,
    maxSizeMB,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
  } = config;

  if (!allowedFormats.includes(file.type)) {
    return translate(
      'createListing.wizardStepContent.uploadPhotosModal.validation.invalidFormat'
    );
  }

  const sizeKB = file.size / 1024;
  const sizeMB = file.size / (1024 * 1024);

  if (sizeKB < minSizeKB) {
    return translate(
      'createListing.wizardStepContent.uploadPhotosModal.validation.tooSmall',
      { minSize: minSizeKB }
    );
  }

  if (sizeMB > maxSizeMB) {
    return translate(
      'createListing.wizardStepContent.uploadPhotosModal.validation.tooLarge',
      { maxSize: maxSizeMB }
    );
  }

  const image = new Image();
  const objectURL = URL.createObjectURL(file);

  return new Promise((resolve) => {
    image.onload = () => {
      URL.revokeObjectURL(objectURL);

      const { width, height } = image;

      if (width < minWidth || height < minHeight) {
        resolve(
          translate(
            'createListing.wizardStepContent.uploadPhotosModal.validation.tooSmallDimensions',
            { minWidth, minHeight }
          )
        );
        return;
      }

      if (width > maxWidth || height > maxHeight) {
        resolve(
          translate(
            'createListing.wizardStepContent.uploadPhotosModal.validation.tooLargeDimensions',
            { maxWidth, maxHeight }
          )
        );
        return;
      }

      resolve(null);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectURL);
      resolve(
        translate(
          'createListing.wizardStepContent.uploadPhotosModal.validation.couldNotLoad'
        )
      );
    };

    image.src = objectURL;
  });
}

// Helper function specifically for profile photos
export async function validateProfilePhoto(
  file: File,
  translate: (key: string, params?: Record<string, string | number>) => string
): Promise<string | null> {
  return validateImage(file, translate, PROFILE_PHOTO_VALIDATION);
}

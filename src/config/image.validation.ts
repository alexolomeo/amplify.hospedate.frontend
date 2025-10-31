// Validation for listing photos (property images)
export const IMAGE_VALIDATION = {
  allowedFormats: ['image/jpeg', 'image/jpg', 'image/png'],
  minWidth: 1024,
  minHeight: 768,
  maxWidth: 5000,
  maxHeight: 5000,
  minSizeKB: 50,
  maxSizeMB: 10,
};

// Validation for profile pictures (user avatars)
export const PROFILE_PHOTO_VALIDATION = {
  allowedFormats: ['image/jpeg', 'image/jpg', 'image/png'],
  minWidth: 400,
  minHeight: 400,
  maxWidth: 5000,
  maxHeight: 5000,
  minSizeKB: 10,
  maxSizeMB: 5,
};

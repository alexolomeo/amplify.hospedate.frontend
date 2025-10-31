export type GalleryNav = {
  toRoot(): void; // /photo-gallery
  toAllPhotos(): void; // /photo-gallery/photos
  toSpace(spaceId: string | number): void; // /photo-gallery/:spaceId
  toPhoto(spaceId: string | number, photoId: string | number): void; // /photo-gallery/:sid/space-photo/:pid

  backFromSpace(): void; // root
  backFromPhoto(spaceId: string | number): void; // → space(sid)
  backFromAllPhotos(): void; // root
};

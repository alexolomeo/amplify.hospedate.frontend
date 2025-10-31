import type { SleepingArrangementType } from '../enums/sleepingArrangement';
import type { Amenity } from './amenity';

export interface Photo {
  original: string;
  srcsetWebp: string;
  srcsetAvif: string;
}
export interface PhotoListingDetail {
  id?: string;
  original: string;
  srcsetWebp: string;
  srcsetAvif: string;
  caption?: string;
  order: number;
}
export interface Space {
  id: number;
  name: string;
  isDefault: boolean;
  amenities: Amenity[];
  photos: PhotoListingDetail[];
  sleepingArrangements?: SleepingArrangements[];
}
export interface SleepingArrangements {
  type: SleepingArrangementType;
  quantity: number;
}
export interface FormattedPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  srcSet: { src: string; width: number; height: number; type?: string }[];
  sizes: string;
  caption?: string;
  order: number;
}

export interface ListingSpaces {
  id: number;
  name: string;
  numPhotos: number;
  photo: Photo;
}

export interface SpaceType {
  id: number;
  name: string;
  photo: Photo;
}

export interface ListingPhoto {
  id: number;
  photo: Photo;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PlaceLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates: Coordinates;
  apt?: string;
}

export interface PlaceInformation {
  placeTypeId: number;
  location: PlaceLocation;
  guestNumber: number;
  roomNumber: number;
  bedNumber: number;
  bathNumber: number;
  showSpecificLocation: boolean;
}

export interface Amenity {
  id: number;
  name: string;
  icon: string;
  amenityGroupType: string;
}

export interface ListingPhoto {
  id: number;
  original: string;
  srcsetWebp: string;
  srcsetAvif: string;
  caption: string;
  order: number;
}

export interface PlaceFeatures {
  amenities: Amenity[];
  photos: ListingPhoto[];
  title: string;
  description: string;
}

export interface Discount {
  weeklyDiscount: number;
  monthlyDiscount: number;
}

export interface PlaceSetup {
  nightlyPrice: number;
  discount: Discount;
}

export interface CreateListingData {
  place_information: Partial<PlaceInformation>;
  place_features: Partial<PlaceFeatures>;
  place_setup: Partial<PlaceSetup>;
}

export interface PlaceType {
  id: number;
  name: string;
  icon: string;
}

export interface ListingCreationData {
  amenities: Amenity[];
  placeTypes: PlaceType[];
}

export interface CreateListingInput {
  placeTypeId: number;
}

export interface ListingProgressData
  extends PlaceInformation,
    PlaceFeatures,
    PlaceSetup {
  currentStep: number;
  currentSubStep: number;
}

export interface UpdateListingStepData {
  placeTypeId?: number;
  nightlyPrice?: number;
  guestNumber?: number;
  roomNumber?: number;
  bedNumber?: number;
  bathNumber?: number;
  title?: string;
  description?: string;
  location?: PlaceLocation;
  discount?: Discount;
  amenities?: number[];
  showSpecificLocation?: boolean;
}

export interface UploadPhoto {
  file: File;
}

export interface UpdatePhoto {
  caption?: string;
}

export interface UpdatePhotoOrder {
  id: number;
  order: number;
}

export type FileWithValidation = {
  file: File;
  previewUrl: string;
  error: string | null;
  isUploading: boolean;
  isUploadComplete: boolean;
  isUploadSuccessful: boolean;
  progress: number;
};

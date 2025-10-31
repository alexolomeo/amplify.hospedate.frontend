export interface SearchListingMarker {
  id: number;
  title: string;
  totalReviews: number;
  score: number;
  photos: ListingPhoto[];
  wishlisted: boolean;
  highlighted: boolean;
  location: ListingLocation;
  availabilitySummary?: AvailabilitySummary;
  pricing: ListingPricing;
  placeInfo: PlaceInfo;
}

export interface ListingPhoto {
  original: string;
  srcsetWebp: string;
  srcsetAvif: string;
}

export interface ListingLocation {
  address: string;
  apt?: string;
  city: string;
  state: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface AvailabilitySummary {
  startDate: string;
  endDate: string;
}

export interface ListingPricing {
  subtotalBeforeServiceFee: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  currency: string;
  weeklyDiscountAmount: number;
  monthlyDiscountAmount: number;
}

export interface PlaceInfo {
  placeType: string;
  guestNumber: number;
  roomNumber: number;
  bedNumber: number;
  bathNumber: number;
}

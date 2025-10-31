import type { Host } from './host';
import type { Space } from './space';
import type { Photo } from './space';
import type { Review } from './review';
import type { SafetyProperty } from './safetyProperty';
import type { Amenity } from './amenity';
import type { Location } from './location';
import type { BlockedCalendarDays, CalendarSettings, Pricing } from './pricing';
import type { Rating } from './rating';
import type { CancellationPolicy } from './cancellationPolicy';
import type { CheckInStartTime } from '../enums/houseRules/checkInStartTime';
import type { CheckInEndTime } from '../enums/houseRules/checkInEndTime';
import type { CheckoutTime } from '../enums/houseRules/checkoutTime';

export interface Listing {
  id: number;
  title: string;
  pricing: Pricing;
  totalReviews: number;
  location: Location;
  score: number;
  photos: Photo[];
  wishlisted: boolean;
  availabilitySummary?: {
    startDate: string;
    endDate: string;
  };
  placeInfo: PlaceInfo;
  highlighted: boolean;
}

export interface PaginatedListings {
  limit: number;
  offset: number;
  count: number;
  next: string | null;
  previous: string | null;
  results: Listing[];
}

export interface ListingDetail {
  id: number;
  title: string;
  description: string;
  host: Host;
  location: Location;
  amenities: Amenity[];
  spaces: Space[];
  pricing: Pricing;
  rating?: Rating;
  reviews?: Review;
  houseRules: HouseRules;
  safetyProperty: SafetyProperty;
  placeInfo: PlaceInfo;
  showSpecificLocation: boolean;
  wishlisted: boolean;
  calendar: CalendarSettings;
}
export interface PlaceInfo {
  placeType: string;
  guestNumber: number;
  roomNumber: number;
  bedNumber: number;
  bathNumber: number;
}

export interface HouseRules {
  checkInStartTime: CheckInStartTime;
  checkInEndTime: CheckInEndTime;
  checkoutTime: CheckoutTime;
  guestNumber: number;
  petsAllowed: boolean;
  pets: number;
  eventsAllowed: boolean;
  smokingAllowed: boolean;
  quietHoursStartTime?: string;
  quietHoursEndTime?: string;
  commercialPhotographyAllowed: boolean;
  additionalRules?: string;
}
export interface ParamsListingAvailibility {
  checkInDate: string;
  checkoutDate: string;
  adults: number;
  children?: number;
  infants?: number;
  pets?: number;
}

export interface ListingAvailibility {
  pricing: Pricing;
  calendar: BlockedCalendarDays;
  cancellationPolicy: CancellationPolicy;
  isAvailable: boolean;
}

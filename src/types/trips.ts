export interface GuestTripsResponse {
  cancelled: Trip[];
  finished: Trip[];
  rejected: Trip[];
  scheduled: Trip[];
}

export interface Trip {
  bookingCancellationBy?: BookingCancellationBy;
  endDate: string;
  host: Host;
  id: number;
  listing: Listing;
  location: Location;
  pendingReview: boolean;
  photos: MediaPicture[];
  reasonForCancellation: string;
  score?: number;
  startDate: string;
  status: Status;
  title: string;
  wishlisted: boolean;
}

export enum BookingCancellationBy {
  CancelledByGuest = 'CANCELLED_BY_GUEST',
  CancelledByHost = 'CANCELLED_BY_HOST',
}

export interface Host {
  profilePicture?: ProfilePicture;
  username: string;
}

export interface ProfilePicture {
  original: string;
  srcsetAvif: string;
  srcsetWebp: string;
}

export interface Listing {
  id: number;
}

export interface Location {
  address: string;
  apt?: string;
  city: string;
  country: string;
  state: string;
}

export interface MediaPicture {
  original: string;
  srcsetAvif: string;
  srcsetWebp: string;
}

export enum Status {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Rejected = 'REJECTED',
  WaitingConfirmation = 'WAITING_CONFIRMATION',
  WaitingPaymentConfirmation = 'WAITING_PAYMENT_CONFIRMATION',
}

export enum StatusColor {
  TODAY = 'today',
  DAYS = 'days',
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

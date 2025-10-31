import type { Photo } from '../listing/space';

export interface ReservationEventsSummary {
  cancelled: ReservationEvent[];
  checkIns: ReservationEvent[];
  checkouts: ReservationEvent[];
  inProgress: ReservationEvent[];
  pendingConfirmation: ReservationEvent[];
  pendingReviews: ReservationEvent[];
  scheduled: ReservationEvent[];
}

/**
 * reservation event
 */
export interface ReservationEvent {
  checkInDate: string;
  checkoutDate: string;
  checkInStartTime: CheckInStartTime;
  checkInEndTime?: CheckInEndTime;
  checkoutTime: CheckOutTime;
  guest: Guest;
  /**
   * ID
   */
  id: number;
  listing: SimpleListing;
  status?: Status;
}

export interface Guest {
  /**
   * ID
   */
  id: number;
  profilePicture?: Photo;
  username: string;
}

/**
 * simple listing
 */
export interface SimpleListing {
  /**
   * ID
   */
  id: number;
  photo: Photo;
  title: string;
}

export enum CheckInStartTime {
  TIME_FLEXIBLE = -1,
  TIME_8_AM = 8,
  TIME_9_AM = 9,
  TIME_10_AM = 10,
  TIME_11_AM = 11,
  TIME_12_PM = 12,
  TIME_1_PM = 13,
  TIME_2_PM = 14,
  TIME_3_PM = 15,
  TIME_4_PM = 16,
  TIME_5_PM = 17,
  TIME_6_PM = 18,
  TIME_7_PM = 19,
  TIME_8_PM = 20,
  TIME_9_PM = 21,
  TIME_10_PM = 22,
  TIME_11_PM = 23,
}

export enum CheckInEndTime {
  TIME_FLEXIBLE = -1,
  TIME_10_AM = 10,
  TIME_11_AM = 11,
  TIME_12_PM = 12,
  TIME_1_PM = 13,
  TIME_2_PM = 14,
  TIME_3_PM = 15,
  TIME_4_PM = 16,
  TIME_5_PM = 17,
  TIME_6_PM = 18,
  TIME_7_PM = 19,
  TIME_8_PM = 20,
  TIME_9_PM = 21,
  TIME_10_PM = 22,
  TIME_11_PM = 23,
  TIME_12_AM = 0,
  TIME_1_AM = 1,
  TIME_2_AM = 2,
}

export enum CheckOutTime {
  TIME_12_AM = 0,
  TIME_1_AM = 1,
  TIME_2_AM = 2,
  TIME_3_AM = 3,
  TIME_4_AM = 4,
  TIME_5_AM = 5,
  TIME_6_AM = 6,
  TIME_7_AM = 7,
  TIME_8_AM = 8,
  TIME_9_AM = 9,
  TIME_10_AM = 10,
  TIME_11_AM = 11,
  TIME_12_PM = 12,
  TIME_1_PM = 13,
  TIME_2_PM = 14,
  TIME_3_PM = 15,
  TIME_4_PM = 16,
  TIME_5_PM = 17,
  TIME_6_PM = 18,
  TIME_7_PM = 19,
  TIME_8_PM = 20,
  TIME_9_PM = 21,
  TIME_10_PM = 22,
  TIME_11_PM = 23,
}

export enum Status {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Rejected = 'REJECTED',
  WaitingConfirmation = 'WAITING_CONFIRMATION',
  WaitingPaymentConfirmation = 'WAITING_PAYMENT_CONFIRMATION',
}

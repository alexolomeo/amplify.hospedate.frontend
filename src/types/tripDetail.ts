/**
 * TripDetail
 */
export interface TripDetail {
  booking: SimpleBooking;
  cancellation?: Cancellation;
  cancellationPolicy: CancellationPolicy;
  guest: GuestTripProfile;
  guestSecurity: GuestSecurity[];
  host: Host;
  houseRules: HouseRules;
  id: number;
  listing: Listing;
  location: Location;
  paymentDetail: PaymentDetail;
  pendingReview: boolean;
  photos: MediaPicture[];
  safetyRules: SafetyRules;
  score?: number;
  /**
   * status
   */
  status: TripStatus;
  title: string;
  wishlisted: boolean;
}

/**
 * SimpleBooking
 */
export interface SimpleBooking {
  checkInDate: string;
  checkoutDate: string;
  createdAt: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
  reservationCode: string;
  chatId?: number;
}

/**
 * Cancellation
 */
export interface Cancellation {
  cancellationDate: string;
  cancellationStatus: CancellationStatus;
  cancelledBy: CancelledBy;
  hospedateFee: number;
  paymentBeforeCancellation: number;
  penaltyDescription: string;
  /**
   * to people with pets
   */
  petsFee?: number;
  reasonForCancellation: string;
  totalAmountRefundableGuest: number;
  ruleCancellationApplied: RuleCancellationApplied;
  /**
   * to host view
   */
  totalAmountRefundableHost?: number;
  totalRefundableNights: number;
}

export enum CancellationStatus {
  CancelledWithPenalty = 'CANCELLED_WITH_PENALTY',
  CancelledWithoutPenalty = 'CANCELLED_WITHOUT_PENALTY',
}

export enum CancelledBy {
  CancelledByGuest = 'CANCELLED_BY_GUEST',
  CancelledByHost = 'CANCELLED_BY_HOST',
}

/**
 * RuleCancellationApplied
 */
export interface RuleCancellationApplied {
  bookingWindowHours?: number;
  deadline: number;
  descriptionKey: string;
  descriptionPlaceholders: DescriptionPlaceholders;
  nonRefundableNights: number;
  refund: RuleCancellationAppliedRefund;
  ruleType: RuleType;
}

/**
 * DescriptionPlaceholders
 */
export interface DescriptionPlaceholders {
  bookingWindowHours?: number;
  deadline: string;
  deadline1?: string;
  deadline2?: string;
  deadline3?: string;
  nonRefundableNights?: number;
  refundPercentage?: number;
}

export interface RuleCancellationAppliedRefund {
  includeServiceFee: boolean;
  percentage: number;
}

export enum RuleType {
  BookingBased = 'BOOKING_BASED',
  CheckInBased = 'CHECK_IN_BASED',
}

/**
 * CancellationPolicy
 */
export interface CancellationPolicy {
  /**
   * name
   */
  name: string;
  policyType: string;
  rules: Rule[];
  /**
   * Translation key
   */
  summaryKey: string;
  summaryPlaceholders: SummaryPlaceholders;
}

export interface Rule {
  bookingWindowHours: number;
  deadline: string;
  descriptionKey: string;
  descriptionPlaceholders: DescriptionPlaceholders;
  nonRefundableNights: number;
  refund: RuleRefund;
  ruleType: RuleType;
}

export interface DescriptionPlaceholders {
  bookingWindowHours?: number;
  deadline: string;
  deadline1?: string;
  deadline2?: string;
  deadline3?: string;
  nonRefundableNights?: number;
  refundPercentage?: number;
}

export interface RuleRefund {
  includeServiceFee: boolean;
  percentage: number;
}

export interface SummaryPlaceholders {
  bookingWindowHours?: number;
  deadline?: string;
  deadline1?: string;
  deadline2?: string;
  deadline3?: string;
  nonRefundableNights?: number;
  refundPercentage?: number;
}

/**
 * GuestTripProfile
 */
export interface GuestTripProfile {
  /**
   * Date user registered in the application
   */
  becameUserAt: string;
  city?: string;
  country?: string;
  id: number;
  identityVerified: boolean;
  profilePicture?: GuestProfilePicture;
  totalReviews: number;
  /**
   * User preferred name or first name
   */
  username: string;
}

/**
 * MediaPicture
 */
export interface GuestProfilePicture {
  original: string;
  srcsetAvif: string;
  srcsetWebp: string;
}

/**
 * SafetyRules
 */
export interface SafetyRules {
  carbonMonoxideDetector: boolean;
  carbonMonoxideDetectorDetails?: null | string;
  expectationAnimals?: boolean | null;
  expectationAnimalsDetails?: null | string;
  expectationClimbingOrPlayStructure?: boolean | null;
  expectationClimbingOrPlayStructureDetails?: null | string;
  expectationHasPets?: boolean | null;
  expectationHasPetsDetails?: null | string;
  expectationHeightsWithNoFence?: boolean | null;
  expectationHeightsWithNoFenceDetails?: null | string;
  expectationLakeOrRiverOrWaterBody?: boolean | null;
  expectationLakeOrRiverOrWaterBodyDetails?: null | string;
  expectationLimitedParking?: boolean | null;
  expectationLimitedParkingDetails?: null | string;
  expectationNoiseMonitor?: boolean | null;
  expectationNoiseMonitorDetails?: null | string;
  expectationPoolOrJacuzziWithNoFence?: boolean | null;
  expectationPoolOrJacuzziWithNoFenceDetails?: null | string;
  expectationPotentialNoise?: boolean | null;
  expectationPotentialNoiseDetails?: null | string;
  expectationRequiresStairs?: boolean | null;
  expectationRequiresStairsDetails?: null | string;
  expectationSharedSpaces?: boolean | null;
  expectationSharedSpacesDetails?: null | string;
  expectationSurveillance?: boolean | null;
  expectationSurveillanceDetails?: null | string;
  expectationWeapons?: boolean | null;
  expectationWeaponsDetails?: null | string;
  expectedLimitedAmenities?: boolean | null;
  expectedLimitedAmenitiesDetails?: null | string;
  noChildrenAllowed?: boolean | null;
  noChildrenAllowedDetails?: null | string;
  noInfantsAllowed?: boolean | null;
  noInfantsAllowedDetails?: null | string;
  smokeDetector: boolean;
  smokeDetectorDetails?: null | string;
}

/**
 * guestSecurity
 */
export interface GuestSecurity {
  icon: string;
  name: string;
}

/**
 * HostTripProfile
 */
export interface Host {
  /**
   * Date user registered in the application
   */
  becameHostAt: string;
  city?: string;
  country?: string;
  id: number;
  identityVerified: boolean;
  profilePicture?: HostProfilePicture;
  totalReviews: number;
  /**
   * User preferred name or first name
   */
  username: string;
}

/**
 * MediaPicture
 */
export interface HostProfilePicture {
  original: string;
  srcsetAvif: string;
  srcsetWebp: string;
}

/**
 * HouseRules
 */
export interface HouseRules {
  additionalRules?: string;
  checkInEndTime: number;
  checkInStartTime: number;
  checkInType?: CheckInType;
  checkoutTime: number;
  commercialPhotographyAllowed: boolean;
  eventsAllowed: boolean;
  guests: number;
  petsAllowed: boolean;
  quietHoursEndTime?: number;
  quietHoursStartTime?: number;
}

export enum CheckInType {
  BuildingStaff = 'BUILDING_STAFF',
  InPerson = 'IN_PERSON',
  KeypadLock = 'KEYPAD_LOCK',
  LockBox = 'LOCK_BOX',
  Other = 'OTHER',
  SmartLock = 'SMART_LOCK',
}

export interface Listing {
  id: number;
}

/**
 * Location
 */
export interface Location {
  address: string;
  apt?: string;
  city: string;
  coordinates: Coordinates;
  country: string;
  state: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * PaymentDetail
 */
export interface PaymentDetail {
  monthlyDiscount: number;
  totalCleaningFee: number;
  totalNightlyPrice: number;
  totalPrice: number;
  totalServiceFee: number;
  weeklyDiscount: number;
  currency: string;
  totalGuestFee?: number;
  totalNightlyPriceHost?: number;
  totalHostFee?: number;
}

/**
 * MediaPicture
 */
export interface MediaPicture {
  original: string;
  srcsetAvif: string;
  srcsetWebp: string;
}

/**
 * status
 *
 * TripStatus
 */
export enum TripStatus {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Rejected = 'REJECTED',
  WaitingConfirmation = 'WAITING_CONFIRMATION',
  WaitingPaymentConfirmation = 'WAITING_PAYMENT_CONFIRMATION',
}

/**
 * Extra enums for frontend states
 */
export enum StatusColor {
  PENDING = 'yellow',
  DAYS = 'blue',
  TODAY = 'green',
  REVIEW = 'purple',
  CANCELLED = 'red',
}

export enum TripDetailStatusColor {
  PENDING = 'yellow',
  DAYS = 'blue',
  TODAY = 'green',
  REVIEW = 'purple',
  CANCELLED = 'red',
}

export enum TripDetailsCases {
  PENDING_APPROVAL = 'pendingApproval',
  PENDING_PAYMENT = 'pendingPayment',
  CHECKING_IN_TODAY = 'checkingInToday',
  CHECKING_IN_DAYS = 'checkingInDays',
  CHECKED_IN_NOW = 'checkedInNow',
  CHECKING_OUT_TODAY = 'checkingOutToday',
  LEAVE_REVIEW = 'leaveReview',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

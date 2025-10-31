export interface ListingEditorValues {
  yourPlace?: YourPlace;
  arrivalGuide?: ArrivalGuide;
  setting?: Setting;
}

export interface YourPlace {
  titleSection?: TitleSection;
  propertyTypeSection?: PropertyTypeSection;
  pricesSection?: PricesSection;
  availabilitySection?: AvailabilitySection;
  peopleNumberSection?: PeopleNumberSection;
  descriptionSection?: DescriptionSection;
  amenitiesSection?: AmenitiesSection;
  locationSection?: LocationSection;
  bookingSettingsSection?: BookingSettingsSection;
  houseRulesSection?: HouseRulesSection;
  guestSecuritySection?: GuestSecuritySection;
  cancellationPolicySection?: CancellationPolicySection;
  customLinkSection?: CustomLinkSection;
  gallerySection?: GallerySection;
  pendingTaskSection?: PendingTaskSection;
}

/** ---------- Title ---------- */
export interface TitleSection {
  listingTitle: string | null;
}

/** ---------- Property Type ---------- */
export interface PropertyTypeSection {
  propertyTypeGroup: { value: number };
  propertyType: { value: number };
  floorNumber: number | null;
  yearBuilt: number | null;
  propertySize: number | null;
  propertySizeUnit: { value: string | null };
}

/** ---------- Prices ---------- */
export interface PricesSection {
  perNight: { price: number };
  perWeekend: { price: number | null };
  discounts: { weekly: number | null; monthly: number | null };
}

/** ---------- Availability ---------- */
export interface AvailabilitySection {
  tripDuration: { min: number; max: number };
  notice: {
    advanceNoticeHours: { id: number };
    sameDayAdvanceNoticeTime: { id: number };
    allowRequestSameDay: boolean;
  };
}

/** ---------- People ---------- */
export interface PeopleNumberSection {
  peopleNumber: number;
}

/** ---------- Description ---------- */
export interface DescriptionSection {
  generalDescription: {
    listingDescription: string | null;
    propertyDescription: string | null;
  };
  guestExperience: {
    areasDescription: string | null;
    interactionDescription: string | null;
    additionalNotes: string | null;
  };
}

/** ---------- Amenities ---------- */
export interface AmenitiesSection {
  amenities: {
    values: number[];
  };
}

/** ---------- Location ---------- */
export interface LocationSection {
  locationData: {
    country: { value: string | null };
    address: string | null;
    apartmentNumber: string | null;
    city: string | null;
    state: string | null;
    coordinates?: { latitude: number; longitude: number };
  };
  displaySpecificLocation: boolean;
  addressPrivacyForCancellation: boolean;
  // backend mencionó este flag en tu ejemplo extendido
  allowLocationEdition?: boolean;
}

/** ---------- Booking Settings ---------- */
export type BookingTypeValue = 'APPROVAL_REQUIRED' | 'INSTANT';

export interface BookingSettingsSection {
  bookingType: { value: BookingTypeValue };
  welcomeMessage: string | null;
}

/** ---------- House Rules ---------- */
export interface HouseRulesSection {
  permissions: {
    petsAllowed: boolean;
    numPets: number;
    eventsAllowed: boolean;
    smokingAllowed: boolean;
    commercialPhotographyAllowed: boolean;
    guestNumber: number;
  };
  quietHours: {
    isEnabled: boolean;
    startTime?: { value: number };
    endTime?: { value: number };
  };
  checkInOut: {
    checkInStartTime: { value: number };
    checkInEndTime: { value: number };
    checkoutTime: { value: number };
  };
  additionalRules: { text: string | null };
}

/** ---------- Guest Security ---------- */
export interface GuestSecuritySection {
  safetyConsiderations: {
    noChildrenAllowed: YesNoWithDetails;
    noInfantsAllowed: YesNoWithDetails;
    poolOrJacuzziWithNoFence: YesNoWithDetails;
    lakeOrRiverOrWaterBody: YesNoWithDetails;
    climbingOrPlayStructure: YesNoWithDetails;
    heightsWithNoFence: YesNoWithDetails;
    animals: YesNoWithDetails;
  };
  safetyDevices: {
    surveillance: YesNoWithDetails;
    noiseMonitor: YesNoWithDetails;
    carbonMonoxideDetector: YesNoWithDetails;
    smokeDetector: YesNoWithDetails;
  };
  propertyInformation: {
    requiresStairs: YesNoWithDetails;
    potentialNoise: YesNoWithDetails;
    hasPets: YesNoWithDetails;
    limitedParking: YesNoWithDetails;
    sharedSpaces: YesNoWithDetails;
    limitedAmenities: YesNoWithDetails;
    weapons: YesNoWithDetails;
  };
}
export interface YesNoWithDetails {
  status: boolean;
  details: string;
}

/** ---------- Cancellation Policy ---------- */
export interface CancellationPolicySection {
  standardPolicy: { value: number };
  longStayPolicy: { value: number };
}

/** ---------- Custom Link ---------- */
export interface CustomLinkSection {
  customLink: string | null;
}

/** ---------- Gallery (solo lectura aquí) ---------- */
export interface GallerySection {
  numPhotos: number;
  placeInfo: { roomNumber: number; bedNumber: number; bathNumber: number };
  spaces: Array<{
    id: number;
    name: string;
    numPhotos: number;
    isDefault: boolean;
    photo: {
      original: string;
      srcsetWebp: string;
      srcsetAvif: string;
    };
  }>;
}

/** ---------- Arrival Guide ---------- */
export interface ArrivalGuide {
  indicationsSection?: { indications: string | null };
  checkInMethodsSection?: {
    checkInMethods: { checkInMethod: { value: CheckInMethodValue } };
    checkInInstructions: { instructions: string | null };
  };
}

export type CheckInMethodValue =
  | 'BUILDING_STAFF'
  | 'IN_PERSON'
  | 'KEYPAD_LOCK'
  | 'LOCK_BOX'
  | 'OTHER'
  | 'SMART_LOCK';

/** ---------- Setting (status, lectura) ---------- */
export interface Setting {
  statusSection: { status: ListingStatus };
}
export type ListingStatus =
  | 'APPROVED'
  | 'CHANGES_REQUESTED'
  | 'IN_PROGRESS'
  | 'PENDING_APPROVAL'
  | 'PUBLISHED'
  | 'UNLISTED';

/** ---------- PendingTaskSection ---------- */
/**
 * Represents a section that appears when there are pending tasks required to complete the listing setup.
 * This section is present only if the listing has outstanding actions that the host needs to address.
 * @property description - A message describing the pending tasks or actions required from the host.
 */
export interface PendingTaskSection {
  description: string | null;
}

type SafetyConsiderationKey =
  | 'noChildrenAllowed'
  | 'noInfantsAllowed'
  | 'poolOrJacuzziWithNoFence'
  | 'lakeOrRiverOrWaterBody'
  | 'climbingOrPlayStructure'
  | 'heightsWithNoFence'
  | 'animals';

type SafetyDeviceKey =
  | 'surveillance'
  | 'noiseMonitor'
  | 'carbonMonoxideDetector'
  | 'smokeDetector';

type PropertyInformationKey =
  | 'requiresStairs'
  | 'potentialNoise'
  | 'hasPets'
  | 'limitedParking'
  | 'sharedSpaces'
  | 'limitedAmenities'
  | 'weapons';

type SafetyKey =
  | SafetyConsiderationKey
  | SafetyDeviceKey
  | PropertyInformationKey;

export const SAFETY_KEYS = [
  'noChildrenAllowed',
  'noInfantsAllowed',
  'poolOrJacuzziWithNoFence',
  'lakeOrRiverOrWaterBody',
  'climbingOrPlayStructure',
  'heightsWithNoFence',
  'animals',
  'surveillance',
  'noiseMonitor',
  'carbonMonoxideDetector',
  'smokeDetector',
  'requiresStairs',
  'potentialNoise',
  'hasPets',
  'limitedParking',
  'sharedSpaces',
  'limitedAmenities',
  'weapons',
] as const satisfies readonly SafetyKey[];

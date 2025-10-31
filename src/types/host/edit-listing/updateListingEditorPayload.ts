import type {
  BookingTypeValue,
  CheckInMethodValue,
} from '@/types/host/edit-listing/editListingValues';

/** Payload for partial PATCH by sections of the Listing Editor */
export interface UpdateListingEditorPayload {
  yourPlace?: YourPlacePayload;
  arrivalGuide?: ArrivalGuidePayload;
}

/* -------------------- Arrival Guide -------------------- */

export interface ArrivalGuidePayload {
  checkInMethodsSection?: CheckInMethodsSectionPayload;
  indicationsSection?: IndicationsSectionPayload;
}

export interface CheckInMethodsSectionPayload {
  checkInInstructions: { instructions: string | null };
  checkInMethods: { checkInMethod: { value: CheckInMethodValue } };
}

export interface IndicationsSectionPayload {
  indications: string | null;
}

/* -------------------- Your Place -------------------- */

export interface YourPlacePayload {
  titleSection?: TitleSectionPayload;
  propertyTypeSection?: PropertyTypeSectionPayload;
  pricesSection?: PricesSectionPayload;
  availabilitySection?: AvailabilitySectionPayload;
  peopleNumberSection?: PeopleNumberSectionPayload;
  descriptionSection?: DescriptionSectionPayload;
  /** amenitiesSection: NOT SUPPORTED by this endpoint */
  locationSection?: LocationSectionPayload;
  bookingSettingsSection?: BookingSettingsSectionPayload;
  houseRulesSection?: HouseRulesSectionPayload;
  guestSecuritySection?: GuestSecuritySectionPayload;
  cancellationPolicySection?: CancellationPolicySectionPayload;
  customLinkSection?: CustomLinkSectionPayload;
  /** gallerySection/pendingTaskSection/setting: read-only → excluded */
}

/** ---------- Title ---------- */
export interface TitleSectionPayload {
  listingTitle: string | null;
}

/** ---------- Property Type ---------- */
export interface PropertyTypeSectionPayload {
  propertyTypeGroup: { value: number };
  propertyType: { value: number };
  floorNumber: number | null;
  yearBuilt: number | null;
  propertySize: number | null;
  propertySizeUnit: { value: string | null };
}

/** ---------- Prices ---------- */
export interface PricesSectionPayload {
  perNight: { price: number };
  perWeekend: { price: number | null };
  discounts: { weekly: number | null; monthly: number | null };
}

/** ---------- Availability ---------- */
export interface AvailabilitySectionPayload {
  tripDuration: { min: number; max: number };
  notice?: {
    advanceNoticeHours: { id: number };
    sameDayAdvanceNoticeTime?: { id: number };
    allowRequestSameDay: boolean;
  };
}

/** ---------- People ---------- */
export interface PeopleNumberSectionPayload {
  peopleNumber: number;
}

/** ---------- Description ---------- */
export interface DescriptionSectionPayload {
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

/** ---------- Location ---------- */
export interface LocationSectionPayload {
  displaySpecificLocation: boolean;
  addressPrivacyForCancellation: boolean;
  locationData: {
    country: { value: string | null };
    address: string | null;
    apartmentNumber: string | null;
    city: string | null;
    state: string | null;
    coordinates?: { latitude: number; longitude: number };
  };
}

/** ---------- Booking Settings ---------- */
export interface BookingSettingsSectionPayload {
  bookingType: { value: BookingTypeValue };
  welcomeMessage: string | null;
}

/** ---------- House Rules ---------- */
export interface HouseRulesSectionPayload {
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
    checkInEndTime?: { value: number };
    checkoutTime: { value: number };
  };
  additionalRules: { text: string | null };
}

/** ---------- Guest Security ---------- */
export interface GuestSecuritySectionPayload {
  safetyConsiderations: YesNoWithDetailsGroupPayload;
  safetyDevices: YesNoWithDetailsGroupPayload;
  propertyInformation: YesNoWithDetailsGroupPayload;
}

export interface YesNoWithDetailsPayload {
  status: boolean;
  details: string | null;
}

export interface YesNoWithDetailsGroupPayload {
  [key: string]: YesNoWithDetailsPayload;
}

/** ---------- Cancellation Policy ---------- */
export interface CancellationPolicySectionPayload {
  standardPolicy: { value: number };
  longStayPolicy: { value: number };
}

/** ---------- Custom Link ---------- */
export interface CustomLinkSectionPayload {
  customLink: string | null;
}

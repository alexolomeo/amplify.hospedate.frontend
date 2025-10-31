export interface EditListingCatalog {
  amenitiesSection: AmenitiesSection;
  availabilitySection: AvailabilitySection;
  houseRulesSection: HouseRulesSection;
  propertyTypeSection: PropertyTypeSection;
}

export interface AmenitiesSection {
  amenityGroups: AmenityGroup[];
}

export interface AmenityGroup {
  id: number;
  name: string;
  amenities: Amenity[];
}

export interface Amenity {
  id: number;
  name: string;
  icon: string;
}

export interface AvailabilitySection {
  advanceNoticeHours: AdvanceNoticeHour[];
  sameDayAdvanceNoticeTimes: SameDayAdvanceNoticeTime[];
}

export interface AdvanceNoticeHour {
  id: number;
  name: string;
}

export interface SameDayAdvanceNoticeTime {
  id: number;
  name: string;
}

export interface HouseRulesSection {
  checkInOut: CheckInOut;
  quietHours: QuietHours;
}

export interface CheckInOut {
  checkInStartTimes: CheckInStartTime[];
  checkInEndTimes: CheckInEndTime[];
  checkoutTimes: CheckoutTime[];
}

export interface CheckInStartTime {
  id: number;
  name: string;
}

export interface CheckInEndTime {
  id: number;
  name: string;
}

export interface CheckoutTime {
  id: number;
  name: string;
}

export interface QuietHours {
  startTimes: StartTime[];
  endTimes: EndTime[];
}

export interface StartTime {
  id: number;
  name: string;
}

export interface EndTime {
  id: number;
  name: string;
}

export interface PropertyTypeSection {
  propertyTypeGroups: PropertyTypeGroup[];
  propertySizeUnits: PropertySizeUnit[];
}

export interface PropertyTypeGroup {
  id: number;
  name: string;
  propertyTypes: PropertyType[];
}

export interface PropertyType {
  id: number;
  name: string;
  description: string;
  isBuilding: boolean;
}

export interface PropertySizeUnit {
  id: string;
  name: string;
}

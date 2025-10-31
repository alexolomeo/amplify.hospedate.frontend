export interface Availability {
  availabilitySection: AvailabilitySection;
  note?: string;
  priceSection: PriceSection;
}

export interface AvailabilitySection {
  /**
   * if selectedType is "SIMPLE"
   */
  availability?: boolean;
  /**
   * if selectedType is "MIXED"
   */
  mixedAvailability?: MixedAvailability;
  selectedType: SelectedType;
}

/**
 * if selectedType is "MIXED"
 */
export interface MixedAvailability {
  blockedNights?: number;
  nightsAvailable?: number;
  notes?: number;
}

export enum SelectedType {
  Mixed = 'MIXED',
  Simple = 'SIMPLE',
}

export interface PriceSection {
  mixedPrice?: MixedPrice;
  nightlyPrice?: number;
  selectedType: SelectedType;
  summary: Summary;
}

export interface MixedPrice {
  max: number;
  min: number;
}

export interface Summary {
  basePrice: number;
  guestPrice: number;
  guestServiceFee: number;
  hostPrice: number;
}

export interface UpdateAvailability {
  availabilitySection?: { availability: boolean | null };
  note?: string | null;
  priceSection?: {
    nightlyPrice: number | null;
  };
}

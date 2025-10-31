import type {
  GuestSecuritySection,
  YesNoWithDetails,
} from '@/types/host/edit-listing/editListingValues';
import { SAFETY_KEYS } from '@/types/host/edit-listing/editListingValues';

type SafetyKey = (typeof SAFETY_KEYS)[number];

export const SAFETY_MAP: Record<
  SafetyKey,
  { icon: string; iconDisabled?: string; i18nKey: string }
> = {
  poolOrJacuzziWithNoFence: {
    icon: 'expectation-pool-or-jacuzzi-with-no-fence',
    i18nKey: 'guestSafety.items.poolOrJacuzziWithNoFence',
  },
  animals: {
    icon: 'expectation-animals',
    i18nKey: 'guestSafety.items.animals',
  },
  climbingOrPlayStructure: {
    icon: 'expectation-climbing-or-play-structure',
    i18nKey: 'guestSafety.items.climbingOrPlayStructure',
  },
  heightsWithNoFence: {
    icon: 'expectation-heights-with-no-fence',
    i18nKey: 'guestSafety.items.heightsWithNoFence',
  },
  lakeOrRiverOrWaterBody: {
    icon: 'expectation-lake-or-river-or-water-body',
    i18nKey: 'guestSafety.items.lakeOrRiverOrWaterBody',
  },
  noChildrenAllowed: {
    icon: 'no-children-allowed',
    i18nKey: 'guestSafety.items.noChildrenAllowed',
  },
  noInfantsAllowed: {
    icon: 'no-infants-allowed',
    i18nKey: 'guestSafety.items.noInfantsAllowed',
  },

  // propertyInformation
  hasPets: {
    icon: 'expectation-has-pets',
    i18nKey: 'guestSafety.items.hasPets',
  },
  limitedAmenities: {
    icon: 'expected-limited-amenities',
    i18nKey: 'guestSafety.items.limitedAmenities',
  },
  limitedParking: {
    icon: 'expectation-limited-parking',
    i18nKey: 'guestSafety.items.limitedParking',
  },
  potentialNoise: {
    icon: 'expectation-potencial-noise',
    i18nKey: 'guestSafety.items.potentialNoise',
  },
  requiresStairs: {
    icon: 'expectation-require-stairs',
    i18nKey: 'guestSafety.items.requiresStairs',
  },
  sharedSpaces: {
    icon: 'expectation-shared-spaces',
    i18nKey: 'guestSafety.items.sharedSpaces',
  },
  weapons: {
    icon: 'expectation-weapons',
    i18nKey: 'guestSafety.items.weapons',
  },

  // safetyDevices
  carbonMonoxideDetector: {
    icon: 'carbon-monoxide-detector',
    iconDisabled: 'carbon-monoxide-detector-disabled',
    i18nKey: 'guestSafety.items.carbonMonoxideDetector',
  },
  smokeDetector: {
    icon: 'smoke-detector',
    iconDisabled: 'smoke-detector-disabled',
    i18nKey: 'guestSafety.items.smokeDetector',
  },
  noiseMonitor: {
    icon: 'expectation-noise-monitor',
    i18nKey: 'guestSafety.items.noiseMonitor',
  },
  surveillance: {
    icon: 'expectation-surveillance',
    i18nKey: 'guestSafety.items.surveillance',
  },
};

// 3) Indexado seguro: convierte las sub-secciones a mapas parciales por SafetyKey
const pickField = (
  section: GuestSecuritySection | undefined,
  key: SafetyKey
): YesNoWithDetails | undefined => {
  const sc = section?.safetyConsiderations as
    | Partial<Record<SafetyKey, YesNoWithDetails>>
    | undefined;
  const pi = section?.propertyInformation as
    | Partial<Record<SafetyKey, YesNoWithDetails>>
    | undefined;
  const sd = section?.safetyDevices as
    | Partial<Record<SafetyKey, YesNoWithDetails>>
    | undefined;

  return sc?.[key] ?? pi?.[key] ?? sd?.[key];
};

export type SafetyItem = {
  key: string;
  label: string;
};

export function buildSafetyItems(
  guestSecuritySection: GuestSecuritySection | undefined,
  tr: (k: string) => string
): SafetyItem[] {
  const items: SafetyItem[] = [];

  for (const key of SAFETY_KEYS) {
    const conf = SAFETY_MAP[key];
    const node = pickField(guestSecuritySection, key);
    if (!node || typeof node.status !== 'boolean') continue;

    const status = !!node.status;
    const label = tr(`${conf.i18nKey}.${status ? 'true' : 'false'}`);
    const finalKey = status ? conf.icon : (conf.iconDisabled ?? conf.icon);

    items.push({ key: finalKey, label });
  }

  return items;
}

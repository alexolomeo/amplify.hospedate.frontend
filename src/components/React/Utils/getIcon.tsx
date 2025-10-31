import type { ComponentType, SVGProps } from 'react';
import ShieldCheckIcon from '../../../icons/shield-check.svg?react';
import CarbonMonoxideDetector from '../../../icons/safety-property/carbon-monoxide-detector.svg?react';
import CarbonMonoxideDetectorDisabled from '../../../icons/safety-property/carbon-monoxide-detector-disabled.svg?react';
import ExpectationAnimals from '../../../icons/safety-property/expectation-animals.svg?react';
import ExpectationClimbingOrPlayStructure from '../../../icons/safety-property/expectation-climbing-or-play-structure.svg?react';
import ExpectationHasPets from '../../../icons/safety-property/expectation-has-pets.svg?react';
import ExpectationHeightsWithNoFence from '../../../icons/safety-property/expectation-heights-with-no-fence.svg?react';
import ExpectationLakeOrRiverOrWaterBody from '../../../icons/safety-property/expectation-lake-or-river-or-water-body.svg?react';
import ExpectationLimitedParking from '../../../icons/safety-property/expectation-limited-parking.svg?react';
import ExpectationNoiseMonitor from '../../../icons/safety-property/expectation-noise-monitor.svg?react';
import ExpectationPoolOrJacuzziWithNoFence from '../../../icons/safety-property/expectation-pool-or-jacuzzi-with-no-fence.svg?react';
import ExpectationPotencialNoise from '../../../icons/safety-property/expectation-potencial-noise.svg?react';
import ExpectationRequireStairs from '../../../icons/safety-property/expectation-require-stairs.svg?react';
import ExpectationSharedSpaces from '../../../icons/safety-property/expectation-shared-spaces.svg?react';
import ExpectationSurveillance from '../../../icons/safety-property/expectation-surveillance.svg?react';
import ExpectationWeapons from '../../../icons/safety-property/expectation-weapons.svg?react';
import ExpectedLimitedAmenities from '../../../icons/safety-property/expected-limited-amenities.svg?react';
import NoChildrenAllowed from '../../../icons/safety-property/no-children-allowed.svg?react';
import NoInfantsAllowed from '../../../icons/safety-property/no-infants-allowed.svg?react';
import SmokeDetector from '../../../icons/safety-property/smoke-detector.svg?react';
import SmokeDetectorDisabled from '../../../icons/safety-property/smoke-detector-disabled.svg?react';

const safetyIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  'carbon-monoxide-detector': CarbonMonoxideDetector,
  'carbon-monoxide-detector-disabled': CarbonMonoxideDetectorDisabled,
  'expectation-animals': ExpectationAnimals,
  'expectation-climbing-or-play-structure': ExpectationClimbingOrPlayStructure,
  'expectation-has-pets': ExpectationHasPets,
  'expectation-heights-with-no-fence': ExpectationHeightsWithNoFence,
  'expectation-lake-or-river-or-water-body': ExpectationLakeOrRiverOrWaterBody,
  'expectation-limited-parking': ExpectationLimitedParking,
  'expectation-noise-monitor': ExpectationNoiseMonitor,
  'expectation-pool-or-jacuzzi-with-no-fence':
    ExpectationPoolOrJacuzziWithNoFence,
  'expectation-potencial-noise': ExpectationPotencialNoise,
  'expectation-require-stairs': ExpectationRequireStairs,
  'expectation-shared-spaces': ExpectationSharedSpaces,
  'expectation-surveillance': ExpectationSurveillance,
  'expectation-weapons': ExpectationWeapons,
  'expected-limited-amenities': ExpectedLimitedAmenities,
  'no-children-allowed': NoChildrenAllowed,
  'no-infants-allowed': NoInfantsAllowed,
  'smoke-detector': SmokeDetector,
  'smoke-detector-disabled': SmokeDetectorDisabled,
};

export function getSafetyIcon(
  iconName?: string
): React.ComponentType<React.SVGProps<SVGSVGElement>> {
  if (!iconName) return ShieldCheckIcon;
  return safetyIcons[iconName] ?? ShieldCheckIcon;
}

export default getSafetyIcon;

import React from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import type { SafetyRules } from '@/types/tripDetail';
import { AppModal } from '@/components/React/Common/AppModal';
import getSafetyIcon from '../Utils/getIcon';

interface SafetyPropertyItem {
  label: string;
  icon: string;
  description?: string | boolean | null | undefined;
}

interface SafetyPropertySection {
  title: string;
  items: SafetyPropertyItem[];
}

interface ModalSafetyPropertyProps {
  safetyRules: SafetyRules;
  isOpen: boolean;
  onClose: () => void;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
}

const ModalSafetyProperty: React.FC<ModalSafetyPropertyProps> = ({
  safetyRules,
  isOpen,
  onClose,
  t,
}) => {
  const basePath = 'listingDetail.thingsToKnow.safetyProperty';

  const makeItem = (
    label: string,
    icon: string,
    description?: string | boolean | undefined
  ): SafetyPropertyItem => ({
    label,
    icon,
    description,
  });

  const safetyConsiderationsConfig: {
    key: keyof SafetyRules;
    required: boolean;
    icon: string;
  }[] = [
    {
      key: 'expectationClimbingOrPlayStructure',
      required: false,
      icon: 'safety-property/expectation-climbing-or-play-structure',
    },
    {
      key: 'expectationHeightsWithNoFence',
      required: false,
      icon: 'safety-property/expectation-heights-with-no-fence',
    },
    {
      key: 'expectationLakeOrRiverOrWaterBody',
      required: false,
      icon: 'safety-property/expectation-lake-or-river-or-water-body',
    },
    {
      key: 'expectationPoolOrJacuzziWithNoFence',
      required: false,
      icon: 'safety-property/expectation-pool-or-jacuzzi-with-no-fence',
    },
    {
      key: 'noChildrenAllowed',
      required: false,
      icon: 'safety-property/no-children-allowed',
    },
    {
      key: 'noInfantsAllowed',
      required: false,
      icon: 'safety-property/no-infants-allowed',
    },
  ];

  const safetyDevicesConfig: {
    key: keyof SafetyRules;
    required: boolean;
    icon: string;
  }[] = [
    {
      key: 'carbonMonoxideDetector',
      required: true,
      icon: 'safety-property/carbon-monoxide-detector',
    },
    {
      key: 'smokeDetector',
      required: true,
      icon: 'safety-property/smoke-detector',
    },
    {
      key: 'expectationSurveillance',
      required: false,
      icon: 'safety-property/expectation-surveillance',
    },
    {
      key: 'expectationNoiseMonitor',
      required: false,
      icon: 'safety-property/expectation-noise-monitor',
    },
  ];

  const propertyInformationConfig: {
    key: keyof SafetyRules;
    required: boolean;
    icon: string;
  }[] = [
    {
      key: 'expectationHasPets',
      required: false,
      icon: 'safety-property/expectation-has-pets',
    },
    {
      key: 'expectationAnimals',
      required: false,
      icon: 'safety-property/expectation-animals',
    },
    {
      key: 'expectationWeapons',
      required: false,
      icon: 'safety-property/expectation-weapons',
    },
    {
      key: 'expectationRequiresStairs',
      required: false,
      icon: 'safety-property/expectation-require-stairs',
    },
    {
      key: 'expectationSharedSpaces',
      required: false,
      icon: 'safety-property/expectation-shared-spaces',
    },
    {
      key: 'expectedLimitedAmenities',
      required: false,
      icon: 'safety-property/expected-limited-amenities',
    },
    {
      key: 'expectationPotentialNoise',
      required: false,
      icon: 'safety-property/expectation-potencial-noise',
    },
    {
      key: 'expectationLimitedParking',
      required: false,
      icon: 'safety-property/expectation-limited-parking',
    },
  ];

  const processItems = (
    config: { key: keyof SafetyRules; required: boolean; icon: string }[],
    section: string
  ): SafetyPropertyItem[] => {
    return config.reduce(
      (items: SafetyPropertyItem[], { key, required, icon }) => {
        const value = safetyRules[key];
        if (required || value === true) {
          let label = translate(t, `${basePath}.${section}.${key}`);
          const descriptionKey = `${key}Details` as keyof SafetyRules;
          const description = safetyRules[descriptionKey] ?? undefined;
          if (required) {
            const keyStatus = value === true ? 'yes' : 'no';
            const dynamicKey = `${basePath}.${section}.${key}.${keyStatus}`;
            label = translate(t, dynamicKey);
            icon = value === true ? icon : `${icon}-disabled`;
          }
          items.push(makeItem(label, icon, description));
        }
        return items;
      },
      []
    );
  };

  const safetyConsiderationsItems = processItems(
    safetyConsiderationsConfig,
    'safetyConsiderations'
  );
  const safetyDevicesItems = processItems(safetyDevicesConfig, 'safetyDevices');
  const propertyInformationItems = processItems(
    propertyInformationConfig,
    'propertyInformation'
  );

  const safetyPropertySections: SafetyPropertySection[] = [
    {
      title: translate(t, `${basePath}.safetyConsiderations.title`),
      items: safetyConsiderationsItems,
    },
    {
      title: translate(t, `${basePath}.safetyDevices.title`),
      items: safetyDevicesItems,
    },
    {
      title: translate(t, `${basePath}.propertyInformation.title`),
      items: propertyInformationItems,
    },
  ].filter((section) => section.items.length > 0);

  return (
    <AppModal
      id="safety-property-modal"
      title={translate(t, 'listingDetail.thingsToKnow.safetyProperty.title')}
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-2xl"
      maxHeight="max-h-[90vh]"
      bgColor="bg-[var(--color-base-150)]"
      showHeader={true}
      showCloseButton={true}
      titleSize={'text-xl md:text-2xl lg:text-3xl pl-5'}
    >
      <div className="flex flex-col gap-3 px-6 pb-6">
        <p className="my-3 justify-center self-stretch text-sm leading-normal font-normal">
          {translate(
            t,
            'listingDetail.thingsToKnow.safetyProperty.description'
          )}
        </p>
        {safetyPropertySections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.items.length > 0 && (
              <p className="self-stretch text-xl leading-loose font-semibold">
                {section.title}
              </p>
            )}
            {section.items.map((item, itemIndex) => {
              // Extract the icon name from the full path (e.g., 'safety-property/carbon-monoxide-detector' -> 'carbon-monoxide-detector')
              const iconName = item.icon.includes('/')
                ? item.icon.split('/').pop() || item.icon
                : item.icon;
              const IconComponent = getSafetyIcon(iconName);

              return (
                <div
                  key={itemIndex}
                  className="flex items-center justify-start gap-3 self-stretch py-3"
                >
                  <IconComponent className="text-secondary h-5 w-5 flex-shrink-0" />
                  <div className="inline-flex flex-1 flex-col items-start justify-center pr-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.description && (
                      <p className="text-xs text-gray-500">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </AppModal>
  );
};

export default ModalSafetyProperty;

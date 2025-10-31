import * as React from 'react';
import ModalAstro from './ModalAstro';
import {
  translate,
  getTranslation,
  type SupportedLanguages,
} from '@/utils/i18n';
import type { SafetyProperty } from '@/types/listing/safetyProperty';
import { useUiIcon } from '@/utils/ui-icons.client';

function FallbackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

type SafetyPropertyItem = {
  label: string;
  icon: string;
  description?: string | boolean | null | undefined;
};

type SafetyPropertySection = {
  title: string;
  items: SafetyPropertyItem[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  safetyProperty: SafetyProperty;
  lang?: SupportedLanguages;
};

function SafetyItemRow({ item }: { item: SafetyPropertyItem }) {
  const Icon = useUiIcon(item.icon);
  return (
    <div className="flex items-center justify-start gap-3 self-stretch py-3">
      {Icon ? (
        <Icon className="text-secondary h-5 w-5" />
      ) : (
        <FallbackIcon className="text-secondary h-5 w-5" />
      )}
      <div className="inline-flex flex-1 flex-col items-start justify-center pr-2">
        <span className="text-sm font-medium">{item.label}</span>
        {item.description != null && item.description !== '' && (
          <p className="text-xs text-gray-500">{String(item.description)}</p>
        )}
      </div>
    </div>
  );
}

export default function ModalSafetyProperty({
  open,
  onClose,
  safetyProperty,
  lang = 'es',
}: Props) {
  const t = React.useMemo(() => getTranslation(lang), [lang]);

  const basePath = 'listingDetail.thingsToKnow.safetyProperty';

  const makeItem = (
    label: string,
    icon: string,
    description?: string | boolean | null | undefined
  ): SafetyPropertyItem => ({ label, icon, description });

  const safetyConsiderationsConfig: {
    key: keyof SafetyProperty;
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
    key: keyof SafetyProperty;
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
    key: keyof SafetyProperty;
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
      key: 'expectationRequireStairs',
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
      key: 'expectationPotencialNoise',
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
    config: { key: keyof SafetyProperty; required: boolean; icon: string }[],
    section: 'safetyConsiderations' | 'safetyDevices' | 'propertyInformation'
  ): SafetyPropertyItem[] => {
    return config.reduce(
      (items: SafetyPropertyItem[], { key, required, icon }) => {
        const value = safetyProperty[key];

        if (required || value === true) {
          let label = translate(t, `${basePath}.${section}.${String(key)}`);

          const descriptionKey =
            `${String(key)}Details` as keyof SafetyProperty;
          const description = safetyProperty[descriptionKey] ?? undefined;

          if (required) {
            const keyStatus = value === true ? 'yes' : 'no';
            const dynamicKey = `${basePath}.${section}.${String(key)}.${keyStatus}`;
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
  ];

  return (
    <ModalAstro
      open={open}
      onClose={onClose}
      id="safety-property"
      showFooter={false}
      showHeader={true}
      title={t.listingDetail.thingsToKnow.safetyProperty.title}
      maxWidth="max-w-2xl"
      maxHeight="max-h-[90vh]"
      bgColor="bg-[var(--color-base-150)]"
    >
      <div className="flex flex-col gap-3">
        <p className="my-3 justify-center self-stretch text-sm leading-normal font-normal">
          {t.listingDetail.thingsToKnow.safetyProperty.description}
        </p>

        {safetyPropertySections.map((section, sIdx) => (
          <div key={sIdx}>
            {section.items.length > 0 && (
              <p className="self-stretch text-xl leading-loose font-semibold">
                {section.title}
              </p>
            )}
            {section.items.map((item, iIdx) => (
              <SafetyItemRow key={`${item.icon}-${iIdx}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </ModalAstro>
  );
}

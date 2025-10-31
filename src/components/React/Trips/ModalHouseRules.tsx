import React from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import type { HouseRules } from '@/types/tripDetail';
import { formatHour } from '@/utils/formatHour';
import { AppModal } from '@/components/React/Common/AppModal';

// Import house rules icons
import ClockIcon from '/src/icons/house-rules/clock.svg?react';
import GuestNumberIcon from '/src/icons/house-rules/guest-number.svg?react';
import PetIcon from '/src/icons/house-rules/pet.svg?react';
import WithoutPetIcon from '/src/icons/house-rules/without-pet.svg?react';
import EventsEnableIcon from '/src/icons/house-rules/events-enable.svg?react';
import EventsDisabledIcon from '/src/icons/house-rules/events-disabled.svg?react';
import CommercialPhotographyIcon from '/src/icons/house-rules/commercial-photography.svg?react';
import CommercialPhotographyDisabledIcon from '/src/icons/house-rules/commercial-photography-disabled.svg?react';
import QuietHoursIcon from '/src/icons/house-rules/quiet-hours.svg?react';
import AdditionalRulesIcon from '/src/icons/house-rules/additional-rules.svg?react';

interface HouseRuleItem {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description?: string;
}

interface HouseRuleSection {
  title: string;
  items: HouseRuleItem[];
}

interface ModalHouseRulesProps {
  houseRules: HouseRules;
  checkInMessage: string;
  checkoutMessage: string;
  isOpen: boolean;
  onClose: () => void;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
}

const ModalHouseRules: React.FC<ModalHouseRulesProps> = ({
  houseRules,
  checkInMessage,
  checkoutMessage,
  isOpen,
  onClose,
  t,
}) => {
  const basePath = 'listingDetail.thingsToKnow.houseRules';
  const duringStayPath = `${basePath}.duringStay`;

  const makeItem = (
    label: string,
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
    description?: string
  ): HouseRuleItem => ({
    label,
    icon,
    description,
  });

  const checkInCheckoutItems = [
    makeItem(checkInMessage, ClockIcon),
    makeItem(checkoutMessage, ClockIcon),
  ];

  const duringStayItems = [
    makeItem(
      translate(t, `${duringStayPath}.guestNumber`, {
        count: houseRules.guests,
      }),
      GuestNumberIcon
    ),
    makeItem(
      translate(
        t,
        houseRules.petsAllowed
          ? `${duringStayPath}.pets.yes`
          : `${duringStayPath}.pets.no`
      ),
      houseRules.petsAllowed ? PetIcon : WithoutPetIcon
    ),
    makeItem(
      translate(
        t,
        houseRules.eventsAllowed
          ? `${duringStayPath}.events.yes`
          : `${duringStayPath}.events.no`
      ),
      houseRules.eventsAllowed ? EventsEnableIcon : EventsDisabledIcon
    ),
    makeItem(
      translate(
        t,
        houseRules.commercialPhotographyAllowed
          ? `${duringStayPath}.commercialPhotography.yes`
          : `${duringStayPath}.commercialPhotography.no`
      ),
      houseRules.commercialPhotographyAllowed
        ? CommercialPhotographyIcon
        : CommercialPhotographyDisabledIcon
    ),
  ];

  const beforeLeaveItems: HouseRuleItem[] = [];

  if (houseRules.additionalRules) {
    beforeLeaveItems.push(
      makeItem(
        translate(t, `${basePath}.beforeLeave.additionalRules`),
        AdditionalRulesIcon,
        houseRules.additionalRules
      )
    );
  }

  if (houseRules.quietHoursStartTime && houseRules.quietHoursEndTime) {
    duringStayItems.push(
      makeItem(
        translate(t, `${duringStayPath}.quietHours`),
        QuietHoursIcon,
        `${formatHour(houseRules.quietHoursStartTime)} - ${formatHour(houseRules.quietHoursEndTime)}`
      )
    );
  }

  const ruleSections: HouseRuleSection[] = [
    {
      title: translate(t, `${basePath}.checkInOut.title`),
      items: checkInCheckoutItems,
    },
    {
      title: translate(t, `${basePath}.duringStay.title`),
      items: duringStayItems,
    },
    {
      title: translate(t, `${basePath}.beforeLeave.title`),
      items: beforeLeaveItems,
    },
  ].filter((section) => section.items.length > 0);

  return (
    <AppModal
      id="house-rules-modal"
      title={translate(t, 'listingDetail.thingsToKnow.houseRules.title')}
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
          {translate(t, 'listingDetail.thingsToKnow.houseRules.description')}
        </p>
        {ruleSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <p className="self-stretch text-xl leading-loose font-semibold">
              {section.title}
            </p>
            {section.items.map((item, itemIndex) => {
              const IconComponent = item.icon;
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

export default ModalHouseRules;

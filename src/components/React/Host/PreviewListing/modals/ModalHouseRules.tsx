import * as React from 'react';
import Modal from './ModalAstro';
import {
  translate,
  getTranslation,
  type SupportedLanguages,
} from '@/utils/i18n';
import type { HouseRules } from '@/types/listing/listing';
import { useUiIcon } from '@/utils/ui-icons.client';

function FallbackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function RuleItemRow({ item }: { item: HouseRuleItem }) {
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
        {item.description && (
          <p className="text-xs text-gray-500">{item.description}</p>
        )}
      </div>
    </div>
  );
}

type HouseRuleItem = { label: string; icon: string; description?: string };
type HouseRuleSection = { title: string; items: HouseRuleItem[] };

type Props = {
  open: boolean;
  onClose: () => void;
  houseRules: HouseRules;
  checkInMessage: string;
  checkoutMessage: string;
  lang?: SupportedLanguages;
};

export default function ModalHouseRules({
  open,
  onClose,
  houseRules,
  checkInMessage,
  checkoutMessage,
  lang = 'es',
}: Props) {
  const t = React.useMemo(() => getTranslation(lang), [lang]);

  const basePath = 'listingDetail.thingsToKnow.houseRules';
  const duringStayPath = `${basePath}.duringStay`;

  const makeItem = (
    label: string,
    icon: string,
    description?: string
  ): HouseRuleItem => ({
    label,
    icon,
    description,
  });

  const checkInCheckoutItems: HouseRuleItem[] = [
    makeItem(checkInMessage, 'house-rules/clock'),
    makeItem(checkoutMessage, 'house-rules/clock'),
  ];

  const duringStayItems: HouseRuleItem[] = [
    makeItem(
      translate(t, `${duringStayPath}.guestNumber`, {
        count: houseRules.guestNumber,
      }),
      'house-rules/guest-number'
    ),
    makeItem(
      translate(
        t,
        houseRules.petsAllowed
          ? `${duringStayPath}.pets.yes`
          : `${duringStayPath}.pets.no`
      ),
      houseRules.petsAllowed ? 'house-rules/pet' : 'house-rules/without-pet'
    ),
    makeItem(
      translate(
        t,
        houseRules.smokingAllowed
          ? `${duringStayPath}.smoking.yes`
          : `${duringStayPath}.smoking.no`
      ),
      houseRules.smokingAllowed
        ? 'house-rules/smoke'
        : 'house-rules/smoke-disabled'
    ),
    makeItem(
      translate(
        t,
        houseRules.eventsAllowed
          ? `${duringStayPath}.events.yes`
          : `${duringStayPath}.events.no`
      ),
      houseRules.eventsAllowed
        ? 'house-rules/events-enable'
        : 'house-rules/events-disabled'
    ),
    makeItem(
      translate(
        t,
        houseRules.commercialPhotographyAllowed
          ? `${duringStayPath}.commercialPhotography.yes`
          : `${duringStayPath}.commercialPhotography.no`
      ),
      houseRules.commercialPhotographyAllowed
        ? 'house-rules/commercial-photography'
        : 'house-rules/commercial-photography-disabled'
    ),
  ];

  if (houseRules.quietHoursStartTime && houseRules.quietHoursEndTime) {
    duringStayItems.push(
      makeItem(
        translate(t, `${duringStayPath}.quietHours`),
        'house-rules/quiet-hours',
        `${houseRules.quietHoursStartTime} - ${houseRules.quietHoursEndTime}`
      )
    );
  }

  const beforeLeaveItems: HouseRuleItem[] = [];
  if (houseRules.additionalRules) {
    beforeLeaveItems.push(
      makeItem(
        translate(t, `${basePath}.beforeLeave.additionalRules`),
        'house-rules/additional-rules',
        houseRules.additionalRules
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
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      id="rule-houses"
      showFooter={false}
      showHeader={true}
      title={t.listingDetail.thingsToKnow.houseRules.title}
      maxWidth="max-w-2xl"
      maxHeight="max-h-[90vh]"
      bgColor="bg-[var(--color-base-150)]"
    >
      <div className="flex flex-col gap-3">
        <p className="my-3 justify-center self-stretch text-sm leading-normal font-normal">
          {t.listingDetail.thingsToKnow.houseRules.description}
        </p>

        {ruleSections.map((section, sIdx) => (
          <div key={sIdx}>
            <p className="self-stretch text-xl leading-loose font-semibold">
              {section.title}
            </p>
            {section.items.map((item, iIdx) => (
              <RuleItemRow key={`${item.icon}-${iIdx}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
}

import React, { useState } from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import type { TripDetail } from '@/types/tripDetail';
import getSafetyIcon from '../Utils/getIcon';
import ModalSafetyProperty from './ModalSafetyProperty';

interface TripDetailSecurityProps {
  tripDetail: TripDetail;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
  isConversationCard?: boolean;
}

const TripDetailSecurity: React.FC<TripDetailSecurityProps> = ({
  tripDetail,
  t,
  lang,
  isConversationCard,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { safetyRules } = tripDetail;
  const basePath = 'listingDetail.thingsToKnow.safetyProperty';

  // Display the required safety devices: carbonMonoxideDetector and smokeDetector
  const displayedSecurityItems = [
    {
      key: 'carbonMonoxideDetector',
      value: safetyRules.carbonMonoxideDetector,
      icon: safetyRules.carbonMonoxideDetector
        ? 'carbon-monoxide-detector'
        : 'carbon-monoxide-detector-disabled',
      label: translate(
        t,
        `${basePath}.safetyDevices.carbonMonoxideDetector.${safetyRules.carbonMonoxideDetector ? 'yes' : 'no'}`
      ),
    },
    {
      key: 'smokeDetector',
      value: safetyRules.smokeDetector,
      icon: safetyRules.smokeDetector
        ? 'smoke-detector'
        : 'smoke-detector-disabled',
      label: translate(
        t,
        `${basePath}.safetyDevices.smokeDetector.${safetyRules.smokeDetector ? 'yes' : 'no'}`
      ),
    },
  ];

  return (
    <>
      <section className="relative flex flex-col gap-4 px-4 sm:gap-6 sm:px-0">
        <h3 className="text-base-content text-lg font-bold sm:text-xl">
          {translate(t, 'tripDetail.security.title')}
        </h3>

        <div
          className={`${isConversationCard ? 'flex-col items-start' : 'flex flex-wrap items-end justify-between'} flex`}
        >
          <div className="flex flex-col gap-0">
            {displayedSecurityItems.length > 0 &&
              displayedSecurityItems.map((securityItem, index) => {
                const Icon = getSafetyIcon(securityItem.icon);
                return (
                  <div
                    key={index}
                    className="flex h-auto items-start gap-3 py-1 sm:h-9 sm:items-center sm:py-0"
                  >
                    <Icon className="text-secondary mt-0.5 h-5 w-5 flex-shrink-0 sm:mt-0 sm:h-6 sm:w-6" />
                    <span className="text-base-content flex-1 text-xs leading-relaxed sm:text-sm">
                      {securityItem.label}
                    </span>
                  </div>
                );
              })}
          </div>

          <button
            className={`${!isConversationCard && 'relative right-0 sm:absolute sm:right-0 sm:bottom-4'} ml-auto flex h-8 cursor-pointer items-center justify-center rounded-full bg-transparent px-3 py-0`}
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-primary text-xs underline sm:text-sm">
              {translate(t, 'tripDetail.actions.viewMore')}
            </span>
          </button>
        </div>
      </section>

      <ModalSafetyProperty
        safetyRules={tripDetail.safetyRules}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        t={t}
        lang={lang}
      />
    </>
  );
};

export default TripDetailSecurity;

import * as React from 'react';
import clsx from 'clsx';

import type { HouseRules } from '@/types/listing/listing';
import type { SafetyProperty } from '@/types/listing/safetyProperty';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import { formatHour } from '@/utils/formatHour';
import { CheckInStartTime } from '@/types/enums/houseRules/checkInStartTime';
import { CheckInEndTime } from '@/types/enums/houseRules/checkInEndTime';

import ModalHouseRules from './modals/ModalHouseRules';
import ModalSafetyProperty from './modals/ModalSafetyProperty';
import AppButton from './common/AppButton';

type Props = {
  houseRules: HouseRules;
  safetyProperty: SafetyProperty;
  lang?: SupportedLanguages;
  className?: string;
};

export default function ListingDetailThingsToKnow({
  houseRules,
  safetyProperty,
  lang = 'es',
  className,
}: Props) {
  const t = React.useMemo(() => getTranslation(lang), [lang]);

  const basePath = 'listingDetail.thingsToKnow';
  const baseHouse = 'listingDetail.thingsToKnow.houseRules';
  const baseSafety = 'listingDetail.thingsToKnow.safetyProperty';

  const title = translate(t, `${basePath}.title`);
  const titleHouse = translate(t, `${baseHouse}.title`);

  const checkInStartTime = houseRules?.checkInStartTime;
  const checkInEndTime = houseRules?.checkInEndTime;

  let checkInMessage: string;
  if (
    checkInStartTime === CheckInStartTime.TIME_FLEXIBLE &&
    checkInEndTime === CheckInEndTime.TIME_FLEXIBLE
  ) {
    checkInMessage = translate(t, `${baseHouse}.checkInOut.flexibleCheckIn`);
  } else if (
    checkInStartTime &&
    checkInEndTime === CheckInEndTime.TIME_FLEXIBLE
  ) {
    const formattedStart = formatHour(checkInStartTime);
    checkInMessage = translate(t, `${baseHouse}.checkInOut.checkInFrom`, {
      start: formattedStart,
    });
  } else {
    const formattedStart = formatHour(checkInStartTime);
    const formattedEnd = formatHour(checkInEndTime);
    checkInMessage = translate(t, `${baseHouse}.checkInOut.startEnd`, {
      start: formattedStart,
      end: formattedEnd,
    });
  }

  const formattedCheckout = formatHour(houseRules.checkoutTime);
  const checkoutMessage = translate(t, `${baseHouse}.checkInOut.checkout`, {
    checkout: formattedCheckout,
  });
  const guestNumber = translate(t, `${baseHouse}.duringStay.guestNumber`, {
    count: houseRules.guestNumber,
  });

  const titleSafetyProperty = translate(t, `${baseSafety}.title`);
  const knowMore = translate(t, `${basePath}.knowMore`);
  const titleCancellationPolicy = translate(
    t,
    `${basePath}.cancellationPolicy.title`
  );

  const carbonMonoxideDetector = safetyProperty.carbonMonoxideDetector
    ? translate(t, `${baseSafety}.safetyDevices.carbonMonoxideDetector.yes`)
    : translate(t, `${baseSafety}.safetyDevices.carbonMonoxideDetector.no`);

  const smokeDetector = safetyProperty.smokeDetector
    ? translate(t, `${baseSafety}.safetyDevices.smokeDetector.yes`)
    : translate(t, `${baseSafety}.safetyDevices.smokeDetector.no`);

  const [openRules, setOpenRules] = React.useState(false);
  const [openSafety, setOpenSafety] = React.useState(false);

  return (
    <section className={clsx('my-8 space-y-6', className)}>
      <h1 className="title-listing">{title}</h1>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-3 lg:grid-cols-3">
        <div className="space-y-4">
          <h2 className="justify-center self-stretch text-xl leading-loose font-medium lg:text-2xl">
            {titleHouse}
          </h2>

          <ul className="flex flex-col gap-2 text-sm font-medium">
            <li>{checkInMessage}</li>
            <li>{checkoutMessage}</li>
            <li>{guestNumber}</li>
          </ul>

          <AppButton
            label={knowMore}
            variant="link"
            size="xs"
            icon="chevron-right"
            className="px-0"
            onClick={() => setOpenRules(true)}
          />

          <ModalHouseRules
            open={openRules}
            onClose={() => setOpenRules(false)}
            houseRules={houseRules}
            checkInMessage={checkInMessage}
            checkoutMessage={checkoutMessage}
            lang={lang}
          />
        </div>

        <div className="space-y-4">
          <h2 className="justify-center self-stretch text-xl leading-loose font-medium lg:text-2xl">
            {titleSafetyProperty}
          </h2>

          <ul className="flex flex-col gap-2 text-sm font-medium">
            <li>{carbonMonoxideDetector}</li>
            <li>{smokeDetector}</li>
          </ul>

          <AppButton
            label={knowMore}
            variant="link"
            size="xs"
            icon="chevron-right"
            className="px-0"
            onClick={() => setOpenSafety(true)}
          />

          <ModalSafetyProperty
            open={openSafety}
            onClose={() => setOpenSafety(false)}
            safetyProperty={safetyProperty}
            lang={lang}
          />
        </div>

        <div>
          <h2 className="justify-center self-stretch text-xl leading-loose font-medium lg:text-2xl">
            {titleCancellationPolicy}
          </h2>
          <div id="cancellation-policy-container" />
        </div>
      </div>
    </section>
  );
}

import type { CancellationPolicy } from '@/types/listing/cancellationPolicy';
import { safeFormatDate } from '@/utils/dateUtils';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import React, { useMemo } from 'react';
import ModalCancellationPolicy from './ModalCancellationPolicy';
import AppButton from '../Common/AppButton';
import ChevronRightIcon from '/src/icons/chevron-right.svg?react';
import { differenceInCalendarDays, isBefore, parseISO } from 'date-fns';
import clsx from 'clsx';

interface Props {
  checkIn: Date | null;
  checkout: Date | null;
  cancellationPolicy: CancellationPolicy | null | undefined;
  lang?: SupportedLanguages;
  today: Date;
  isFormValid: boolean;
  description2?: boolean;
  textSize?: string;
}

const hasTranslation = (
  tObj: Record<string, unknown>,
  fullKey: string
): boolean => {
  if (!fullKey || typeof fullKey !== 'string') return false;
  const keys = fullKey.split('.');
  let text: unknown = tObj;
  for (const k of keys) {
    if (text && typeof text === 'object') {
      text = (text as Record<string, unknown>)[k];
    } else {
      text = undefined;
      break;
    }
  }
  return typeof text === 'string';
};

const ListingCancellationPolicy: React.FC<Props> = ({
  checkIn,
  checkout,
  cancellationPolicy,
  lang = 'es',
  today,
  isFormValid,
  description2 = false,
  textSize = 'text-sm',
}) => {
  const t = getTranslation(lang);
  const basePath = 'listingDetail.thingsToKnow.cancellationPolicy';
  const nights = useMemo(
    () =>
      checkIn && checkout ? differenceInCalendarDays(checkout, checkIn) : 0,
    [checkIn, checkout]
  );
  const summaryText = useMemo(() => {
    if (
      cancellationPolicy &&
      cancellationPolicy.summaryKey &&
      cancellationPolicy.summaryPlaceholders
    ) {
      const transKey = `${basePath}.${cancellationPolicy.summaryKey}`;
      if (!hasTranslation(t, transKey)) return '';
      if (nights < 2)
        return t.listingDetail.thingsToKnow.cancellationPolicy
          .booking_no_refund;
      if (cancellationPolicy.summaryPlaceholders.deadline) {
        const deadline = parseISO(
          cancellationPolicy.summaryPlaceholders.deadline
        );
        if (isBefore(deadline, today)) {
          return t.listingDetail.thingsToKnow.cancellationPolicy
            .booking_no_refund;
        }
      }
      return translate(t, `${basePath}.${cancellationPolicy.summaryKey}`, {
        booking_window_hours:
          cancellationPolicy.summaryPlaceholders.bookingWindowHours ?? 0,
        deadline: cancellationPolicy.summaryPlaceholders.deadline
          ? safeFormatDate(cancellationPolicy.summaryPlaceholders.deadline)
          : '',
        deadline1: cancellationPolicy.summaryPlaceholders.deadline1
          ? safeFormatDate(cancellationPolicy.summaryPlaceholders.deadline1)
          : '',
        deadline2: cancellationPolicy.summaryPlaceholders.deadline2
          ? safeFormatDate(cancellationPolicy.summaryPlaceholders.deadline2)
          : '',
        deadline3: cancellationPolicy.summaryPlaceholders.deadline3
          ? safeFormatDate(cancellationPolicy.summaryPlaceholders.deadline3)
          : '',
        refund_percentage:
          cancellationPolicy.summaryPlaceholders.refundPercentage ?? 0,
        non_refundable_nights:
          cancellationPolicy.summaryPlaceholders.nonRefundableNights ?? 0,
      });
    }
    return null;
  }, [cancellationPolicy, nights, t, today]);

  const openModal = () => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('cancellation-policy');
    const modal = el instanceof HTMLDialogElement ? el : null;
    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();
    }
  };

  const scrollBooking = () => {
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div>
      {isFormValid ? (
        <div>
          <ul
            className={clsx(
              'my-4 flex flex-col gap-2 text-sm font-medium',
              textSize
            )}
          >
            <li data-testid={cancellationPolicy?.summaryKey}>{summaryText}</li>
            {description2 && (
              <li>
                {
                  t.listingDetail.thingsToKnow.cancellationPolicy
                    .hostPolicyMessage
                }
              </li>
            )}
          </ul>
          <AppButton
            type="button"
            label={t.listingDetail.thingsToKnow.knowMore}
            onClick={openModal}
            variant="link"
            data-testid="button-cancellation-policy-know-more"
            size="xs"
            icon={ChevronRightIcon}
          ></AppButton>
          <ModalCancellationPolicy
            cancellationPolicy={cancellationPolicy}
            lang={lang}
            checkIn={checkIn}
            nights={nights}
            today={today}
          ></ModalCancellationPolicy>
        </div>
      ) : (
        <div>
          <p className="my-4 text-sm font-medium">
            {t.listingDetail.thingsToKnow.cancellationPolicy.addDateMessage}
          </p>
          <AppButton
            type="button"
            label={t.listingDetail.thingsToKnow.cancellationPolicy.addDate}
            onClick={scrollBooking}
            variant="link"
            data-testid="button-cancellation-policy-add-date"
          ></AppButton>
        </div>
      )}
    </div>
  );
};

export default ListingCancellationPolicy;

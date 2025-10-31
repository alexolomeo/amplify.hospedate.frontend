import type {
  CancellationPolicy,
  Rule,
} from '@/types/listing/cancellationPolicy';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import React, { useCallback, useMemo } from 'react';
import { safeFormatDate } from '@/utils/dateUtils';
import { Modal } from '../Common/ModalDialog';
import { format, isBefore, isValid, parseISO } from 'date-fns';
import AppButton from '../Common/AppButton';

interface Props {
  checkIn: Date | null;
  cancellationPolicy: CancellationPolicy | null | undefined;
  lang?: SupportedLanguages;
  nights: number;
  today: Date;
}

const BEFORE_KEYS = new Set<string>([
  // Standard – Flexible / Moderate / Firm / Strict
  'cancellation_policy_standard_rule_flexible_full_refund',
  'cancellation_policy_standard_rule_moderate_full_refund',
  'cancellation_policy_standard_rule_firm_full_refund',
  'cancellation_policy_standard_rule_firm_full_refund_booking_window',
  'cancellation_policy_standard_rule_firm_partial_refund',
  'cancellation_policy_standard_rule_strict_full_refund',
  'cancellation_policy_standard_rule_strict_partial_refund',
  'cancellation_policy_standard_rule_strict_partial_refund_booking_window',

  // Long-term stay
  'cancellation_policy_long_term_stay_rule_firm_full_refund',
  'cancellation_policy_long_term_stay_rule_strict_full_refund',
]);

const AFTER_KEYS = new Set<string>([
  'cancellation_policy_standard_rule_flexible_partial_refund',
  'cancellation_policy_standard_rule_moderate_partial_refund',
  'cancellation_policy_standard_rule_firm_no_refund',
  'cancellation_policy_standard_rule_strict_no_refund',

  // Long-term stay
  'cancellation_policy_long_term_stay_rule_firm_partial_refund',
  'cancellation_policy_long_term_stay_rule_strict_partial_refund',
]);

export const NON_RULE_KEYS = new Set<string>([
  'cancellation_policy_standard_flexible_description',
  'cancellation_policy_standard_flexible_summary',
  'cancellation_policy_standard_moderate_description',
  'cancellation_policy_standard_moderate_summary',
  'cancellation_policy_standard_firm_description',
  'cancellation_policy_standard_firm_summary',
  'cancellation_policy_standard_strict_description',
  'cancellation_policy_standard_strict_summary',

  'cancellation_policy_long_term_stay_firm_description',
  'cancellation_policy_long_term_stay_firm_summary',
  'cancellation_policy_long_term_stay_strict_description',
  'cancellation_policy_long_term_stay_strict_summary',
]);
const ModalCancellationPolicy: React.FC<Props> = ({
  cancellationPolicy,
  lang = 'es',
  checkIn,
  nights,
  today,
}) => {
  const t = getTranslation(lang);
  const basePath = 'listingDetail.thingsToKnow.cancellationPolicy';
  const description =
    t.listingDetail.thingsToKnow.cancellationPolicy.description;
  const buttonText =
    t.listingDetail.thingsToKnow.cancellationPolicy.moreInformation;

  const handleMoreInfoClick = useCallback(() => {
    window.open('/cancellation', '_blank');
  }, []);

  const hasTranslation = (
    tObj: Record<string, unknown>,
    fullKey: string
  ): boolean => {
    if (!fullKey || typeof fullKey !== 'string') return false;
    const keys = fullKey.split('.');
    let text: unknown = tObj;
    for (const k of keys) {
      if (text && typeof text === 'object') {
        // text is an object; access property safely via index signature
        text = (text as Record<string, unknown>)[k];
      } else {
        text = undefined;
        break;
      }
    }
    return typeof text === 'string';
  };

  const summaryText = useCallback(
    (rule: CancellationPolicy['rules'][number]) => {
      const transKey = `${basePath}.${rule.descriptionKey}`;
      if (!hasTranslation(t, transKey)) return '';
      return translate(t, transKey, {
        booking_window_hours:
          rule.descriptionPlaceholders.bookingWindowHours ?? 0,
        // Use safe formatting for the deadline placeholder
        deadline: safeFormatDate(rule.descriptionPlaceholders.deadline, lang),
        refund_percentage: rule.descriptionPlaceholders.refundPercentage ?? 0,
        non_refundable_nights:
          rule.descriptionPlaceholders.nonRefundableNights ?? 0,
      });
    },
    [t, lang]
  );

  const getTypeRefund = (percentage: number, includeServiceFee: boolean) => {
    if (percentage === 100)
      return includeServiceFee
        ? t.listingDetail.thingsToKnow.cancellationPolicy.full_refund
        : t.listingDetail.thingsToKnow.cancellationPolicy.partial_refund;
    if (percentage === 50)
      return t.listingDetail.thingsToKnow.cancellationPolicy.partial_refund;
    if (percentage === 0)
      return t.listingDetail.thingsToKnow.cancellationPolicy.no_refund;
    return '';
  };

  const getTitleDeadline = useCallback(
    (deadline: string, descriptionKey: string) => {
      if (!deadline || !checkIn) return '';
      const deadlineDate = parseISO(deadline);
      if (!isValid(deadlineDate)) return '';
      const isBeforeDeadline = isBefore(deadlineDate, checkIn);
      const verif = isBeforeDeadline && BEFORE_KEYS.has(descriptionKey);
      return verif
        ? t.listingDetail.thingsToKnow.cancellationPolicy.before
        : t.listingDetail.thingsToKnow.cancellationPolicy.after;
    },
    [t, checkIn]
  );

  const safeCancellation = useSafeCancellation(
    cancellationPolicy,
    nights,
    today
  );
  return (
    <Modal
      id="cancellation-policy"
      showHeader={true}
      title={t.listingDetail.thingsToKnow.cancellationPolicy.title}
      maxWidth={'max-w-xl'}
      maxHeight={'max-h-[90vh]'}
      bgColor={'bg-[var(--color-base-150)]'}
    >
      <div>
        <p className="justify-center self-stretch py-4 text-sm leading-normal font-normal">
          {description}
        </p>
        {safeCancellation.length != 0 ? (
          safeCancellation.map((rule, index) => (
            <div
              key={index}
              className="flex flex-row gap-x-4 self-stretch py-4 leading-none font-normal"
            >
              <div className="basis-1/4">
                <p className="flex flex-nowrap text-sm font-medium whitespace-nowrap">
                  {getTitleDeadline(rule.deadline, rule.descriptionKey)}
                </p>
                <p className="pr-5 text-xs text-gray-500 lg:pr-1">
                  {safeFormatDate(rule.deadline, lang, true)}
                </p>
              </div>
              <div className="basis-3/4">
                <p className="text-sm font-medium">
                  {getTypeRefund(
                    rule.refund.percentage,
                    rule.refund.includeServiceFee
                  )}
                </p>
                <p className="text-xs text-gray-500">{summaryText(rule)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-row gap-x-4 self-stretch py-4 leading-none font-normal">
            <div className="basis-1/4">
              <p className="flex flex-nowrap text-sm font-medium whitespace-nowrap">
                {t.listingDetail.thingsToKnow.cancellationPolicy.after}
              </p>
              <p className="pr-5 text-xs text-gray-500 lg:pr-1">
                {format(today, 'd MMM hh:mm aaaa')}
              </p>
            </div>
            <div className="basis-3/4">
              <p className="text-sm font-medium">
                {' '}
                {t.listingDetail.thingsToKnow.cancellationPolicy.no_refund}
              </p>
              <p className="text-xs text-gray-500">
                {
                  t.listingDetail.thingsToKnow.cancellationPolicy
                    .booking_no_refund
                }
              </p>
            </div>
          </div>
        )}
        <AppButton
          label={buttonText}
          variant="link"
          size="xs"
          data-testid="button-cancellation-policy-more-info"
          onClick={handleMoreInfoClick}
        />
      </div>
    </Modal>
  );
};

export default ModalCancellationPolicy;

export function useSafeCancellation(
  cancellationPolicy: CancellationPolicy | undefined | null,
  nights: number,
  today: Date
) {
  const safeCancellation = useMemo<Rule[]>(() => {
    const rules: Rule[] = cancellationPolicy?.rules ?? [];
    if (nights < 2) return [];

    return rules
      .map((rule) => ({ rule, deadline: parseISO(rule.deadline) }))
      .filter((x) => x.deadline && !isNaN(x.deadline.getTime()))
      .filter((x) => {
        const isPast = isBefore(x.deadline!, today); // deadline < today 00:00 ?
        const key = x.rule.descriptionKey;

        if (isPast) {
          // past: show only rulser "after"
          return AFTER_KEYS.has(key);
        }
        // today or future: show all (before and after)
        return true;
      })
      .sort((a, b) => a.deadline!.getTime() - b.deadline!.getTime())
      .map((x) => x.rule);
  }, [cancellationPolicy?.rules, nights, today]);

  return safeCancellation;
}

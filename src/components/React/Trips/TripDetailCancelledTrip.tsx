import React, { useState } from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import type { CancellationPolicy, TripDetail } from '@/types/tripDetail';
import {
  getPolicy,
  useCancellationPolicies,
  type PolicyType,
} from '../Hooks/useCancellationPolicies';
import Modal from '../Common/Modal';
import CloseIcon from '/src/icons/x-mark-mini.svg?react';
import ModalCancellationPolicy from '../Listing/ModalCancellationPolicy';
import { differenceInCalendarDays, parseISO } from 'date-fns';

interface TripDetailCancelledTripProps {
  tripDetail: TripDetail;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
  isHost?: boolean;
}

const TripDetailCancelledTrip: React.FC<TripDetailCancelledTripProps> = ({
  tripDetail,
  t,
  lang,
  isHost = false,
}) => {
  const cancellation = tripDetail.cancellation;
  const cancellationPolicy: CancellationPolicy = tripDetail.cancellationPolicy;

  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);

  const { policyType, name } = tripDetail.cancellationPolicy;
  const { STANDARD_POLICIES, LONG_STAY_POLICIES, fallback } =
    useCancellationPolicies(t);
  const policy = getPolicy(
    policyType as PolicyType,
    name,
    STANDARD_POLICIES,
    LONG_STAY_POLICIES,
    fallback
  );

  // Early return if no cancellation data
  if (!cancellation) {
    return null;
  }

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  };

  const formatCurrency = (amount: number) => {
    return translate(t, 'tripDetail.payment.currency', {
      amount: amount.toString(),
    });
  };

  const openModalPolicy = () => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('cancellation-policy');
    const modal = el instanceof HTMLDialogElement ? el : null;
    if (modal && typeof modal.showModal === 'function') {
      modal.showModal();
    }
  };

  const nights = differenceInCalendarDays(
    tripDetail.booking.checkoutDate,
    tripDetail.booking.checkInDate
  );

  return (
    <section className="flex flex-col gap-6 px-4 sm:px-0">
      {/* Cancellation Reason */}
      <div className="flex flex-col gap-3">
        <h3 className="text-error text-lg font-bold sm:text-xl">
          {translate(t, 'tripDetail.cancellation.reasonTitle')}
        </h3>
        <p className="text-base-content text-base leading-relaxed sm:text-xl">
          &quot;{cancellation.reasonForCancellation}&quot;
        </p>
      </div>

      {/* Policy Information */}
      <div className="flex flex-col gap-4">
        <h3 className="text-error text-lg font-bold sm:text-xl">
          {translate(t, 'tripDetail.cancellation.policyTitle')}
        </h3>
        <div className="flex flex-col gap-0.5">
          {/* Cancelled By */}
          <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <span className="text-base-content text-sm">
              {translate(t, 'tripDetail.cancellation.cancelledBy')}
            </span>
            <span className="text-neutral text-xs">
              {translate(
                t,
                `tripDetail.cancellation.${cancellation.cancelledBy}`
              )}
            </span>
          </div>

          {/* Cancellation Date */}
          <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <span className="text-base-content text-sm">
              {translate(t, 'tripDetail.cancellation.cancellationDate')}
            </span>
            <span className="text-neutral text-xs">
              {formatDate(cancellation.cancellationDate)}
            </span>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <span className="text-base-content text-sm">
              {translate(t, 'tripDetail.cancellation.status')}
            </span>
            <div className="inline-flex">
              <div className="border-error text-error flex h-6 items-center justify-center rounded-full border px-2 py-0 text-xs font-semibold shadow-sm">
                {translate(
                  t,
                  `tripDetail.cancellation.${cancellation.cancellationStatus}`
                )}
              </div>
            </div>
          </div>

          {/* Policy Application */}
          <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
            <span className="text-base-content flex-1 text-sm">
              {translate(t, 'tripDetail.cancellation.policyApplication')}
            </span>
            <div className="flex flex-col items-start gap-1 sm:flex-1 sm:items-end">
              <span
                className="text-error cursor-pointer text-xs underline"
                onClick={() => openModalPolicy()}
              >
                {policy.label}
              </span>
              <span className="text-neutral text-left text-xs leading-4 sm:text-right">
                {policy.description}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Data */}
      <div className="flex flex-col gap-4">
        <h3 className="text-error text-lg font-bold sm:text-xl">
          {translate(t, 'tripDetail.cancellation.dataTitle')}
        </h3>
        <div className="flex flex-col gap-0.5">
          {/* Guest Payment Before Cancellation */}
          <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <span className="text-base-content flex-1 text-sm">
              {translate(t, 'tripDetail.cancellation.guestPaymentBefore')}
            </span>
            <span className="text-neutral flex-1 text-left text-xs sm:text-right">
              {formatCurrency(cancellation.paymentBeforeCancellation)}
            </span>
          </div>

          {/* Hospedate Fee */}
          <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <span className="text-base-content flex-1 text-sm">
              {translate(t, 'tripDetail.cancellation.hospedateFee')}
            </span>
            <span className="text-neutral flex-1 text-left text-xs sm:text-right">
              {cancellation.hospedateFee
                ? formatCurrency(cancellation.hospedateFee)
                : translate(t, 'tripDetail.cancellation.notApplicable')}
            </span>
          </div>

          {/* Total Refund to Guest */}
          <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <span className="text-base-content flex-1 text-sm">
              {translate(t, 'tripDetail.cancellation.totalRefundGuest')}
            </span>
            <span className="text-neutral flex-1 text-left text-xs sm:text-right">
              {/* Calculate refund based on payment before cancellation minus hospedate fee */}
              {formatCurrency(cancellation.totalAmountRefundableGuest)}
            </span>
          </div>

          {/* Night Refund (only host view) */}
          {isHost && (
            <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
              <span className="text-base-content flex-1 text-sm">
                {translate(t, 'tripDetail.cancellation.refundedNights')}
              </span>
              <span className="text-neutral flex-1 text-left text-xs sm:text-right">
                {translate(t, 'tripDetail.cancellation.refundedNightsValue', {
                  nights: cancellation.totalRefundableNights,
                  amount: (
                    cancellation.totalAmountRefundableGuest ?? 0
                  ).toFixed(2),
                })}
              </span>
            </div>
          )}

          {/* Amount Paid to Host */}
          <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <span className="text-base-content flex-1 text-sm">
              {translate(t, 'tripDetail.cancellation.amountPaidHost')}
            </span>
            <span className="text-neutral flex-1 text-left text-xs sm:text-right">
              {cancellation.totalAmountRefundableHost
                ? formatCurrency(cancellation.totalAmountRefundableHost)
                : translate(t, 'tripDetail.cancellation.notApplicable')}
            </span>
          </div>

          {/* Penalty Description */}
          <div className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
            <span className="text-base-content flex-1 text-sm">
              {translate(t, 'tripDetail.cancellation.penaltyDescription')}
            </span>
            <span className="text-neutral flex-1 text-left text-xs sm:text-right">
              <p>
                {translate(
                  t,
                  `tripDetail.cancellation.cancelStatus.${cancellation.cancellationStatus}`
                )}
              </p>
              <p
                className="text-error cursor-pointer text-xs underline"
                onClick={() => setIsPenaltyModalOpen(true)}
              >
                {translate(t, 'tripDetail.cancellation.seeMore')}
              </p>
            </span>
          </div>
        </div>
      </div>

      {/*Modal Policy applied */}
      <ModalCancellationPolicy
        cancellationPolicy={cancellationPolicy}
        lang={lang}
        checkIn={parseISO(tripDetail.booking.checkInDate)}
        nights={nights}
        today={parseISO(tripDetail.booking.createdAt)}
      ></ModalCancellationPolicy>

      {/*Modal Penalty Description */}
      <Modal
        open={isPenaltyModalOpen}
        widthClass="md:max-w-[480px]"
        onClose={() => setIsPenaltyModalOpen(false)}
        title={translate(t, 'tripDetail.cancellation.penaltyDescription')}
        lang={lang}
        showCancelButton={false}
        topLeftButton={false}
        TitleSubtitleContentClass="text-center flex max-w-[80%] flex-col items-center"
        titleClass="text-xl leading-7 font-semibold"
        footerFullWidth={true}
        footer={
          <button
            onClick={() => setIsPenaltyModalOpen(false)}
            className="bg-primary text-primary-content flex h-10 w-full cursor-pointer items-center justify-center rounded-full px-2 text-sm shadow-sm"
          >
            {translate(t, 'common.close')}
          </button>
        }
      >
        <div className="w-full">
          <CloseIcon
            className="absolute top-4 right-10 mt-1 h-6 w-6 cursor-pointer md:top-6 md:mt-0"
            onClick={() => setIsPenaltyModalOpen(false)}
          />
          <p className="mb-2 text-sm font-bold">
            {translate(
              t,
              `tripDetail.cancellation.cancelStatus.${cancellation.cancellationStatus}`
            )}
          </p>
          <p className="text-neutral/80 text-xs">
            {cancellation.penaltyDescription ||
              translate(t, 'tripDetail.cancellation.noPenalty')}
          </p>
        </div>
      </Modal>
    </section>
  );
};

export default TripDetailCancelledTrip;

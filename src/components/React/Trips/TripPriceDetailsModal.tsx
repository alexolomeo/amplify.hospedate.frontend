import React from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import type { PaymentDetail, SimpleBooking } from '@/types/tripDetail';
import { AppModal } from '../Common/AppModal';

interface TripPriceDetailsModalProps {
  open: boolean;
  onClose: () => void;
  payment: PaymentDetail;
  booking: SimpleBooking;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
}

const renderPriceBreakdown = (
  payment: PaymentDetail,
  booking: SimpleBooking,
  t: ReturnType<typeof translate>
) => {
  const checkIn = new Date(booking.checkInDate);
  const checkOut = new Date(booking.checkoutDate);
  const msPerDay = 1000 * 60 * 60 * 24;
  const calculatedNights = Math.round(
    (checkOut.getTime() - checkIn.getTime()) / msPerDay
  );
  const nights = Math.max(1, isNaN(calculatedNights) ? 1 : calculatedNights);

  const weeklyApplicable = nights >= 7 && (payment.weeklyDiscount ?? 0) > 0;
  const monthlyApplicable = nights >= 28 && (payment.monthlyDiscount ?? 0) > 0;
  const anyDiscount = weeklyApplicable || monthlyApplicable;

  const currency = payment.currency ?? translate(t, 'booking.details.currency');

  return (
    <div className="flex flex-col gap-2 px-1 md:px-2">
      {/* Total total Nightly Price */}
      <div className="grid grid-cols-[1fr_auto] items-center gap-2">
        <div className="text-base-content/60 text-sm font-medium md:text-base">
          {translate(t, 'booking.details.priceDetails.nights', {
            count: nights,
          })}
        </div>
        <div className="flex items-baseline justify-end space-x-1 text-sm tabular-nums md:text-base">
          <span className="text-sm md:text-base">{currency}</span>
          <span className="min-w-[55px] font-mono">
            {payment.totalNightlyPrice}
          </span>
        </div>
      </div>

      {/* Total total service fee */}
      <div className="grid grid-cols-[1fr_auto] items-center gap-2">
        <div className="text-base-content/60 text-sm font-medium md:text-base">
          {translate(t, 'booking.details.priceDetails.serviceFee')}
        </div>
        <div className="text-error flex items-baseline justify-end space-x-1 text-sm tabular-nums md:text-base">
          <span className="text-sm md:text-base">+</span>
          <span className="text-sm md:text-base">{currency}</span>
          <span className="min-w-[55px] font-mono">
            {payment.totalServiceFee}
          </span>
        </div>
      </div>

      {monthlyApplicable && payment.monthlyDiscount > 0 && (
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <div className="text-base-content/60 text-sm font-medium md:text-base">
            {translate(t, 'booking.details.priceDetails.monthlyDiscountLabel')}
          </div>
          <div className="text-secondary flex items-baseline justify-end space-x-1 text-sm tabular-nums md:text-base">
            <span className="text-sm md:text-base">-</span>
            <span className="text-sm md:text-base">{currency}</span>
            <span className="min-w-[55px] font-mono">
              {payment.monthlyDiscount}
            </span>
          </div>
        </div>
      )}

      {weeklyApplicable && payment.weeklyDiscount > 0 && (
        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
          <div className="text-base-content/60 text-sm font-medium md:text-base">
            {translate(t, 'booking.details.priceDetails.weeklyDiscountLabel')}
          </div>
          <div className="text-secondary flex items-baseline justify-end space-x-1 text-sm tabular-nums md:text-base">
            <span className="text-sm md:text-base">-</span>
            <span className="text-sm md:text-base">{currency}</span>
            <span className="min-w-[55px] font-mono">
              {payment.weeklyDiscount}
            </span>
          </div>
        </div>
      )}

      <div className="border-base-200 my-1 border-t" />

      <div className="grid grid-cols-[1fr_auto] items-center gap-2">
        <div className="text-sm font-semibold sm:text-base md:text-lg">
          {anyDiscount
            ? translate(t, 'booking.details.priceDetails.priceAfterDiscount')
            : translate(t, 'booking.details.priceDetails.totalPrice')}
        </div>
        <div className="flex items-baseline justify-end space-x-1 text-base font-semibold tabular-nums md:text-lg">
          <span className="text-sm sm:text-base md:text-lg">{currency}</span>
          <span className="font-mono">{payment.totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default function TripPriceDetailsModal({
  open,
  onClose,
  payment,
  booking,
  t,
}: TripPriceDetailsModalProps) {
  return (
    <AppModal
      id="trip-price-details-modal"
      isOpen={open}
      onClose={onClose}
      title={translate(t, 'booking.details.priceDetails.title')}
      showHeader={true}
      showCloseButton={true}
      maxWidth="max-w-sm md:max-w-md"
      titleSize="text-lg md:text-xl leading-6 md:leading-7 font-semibold pl-1 pb-1"
    >
      <div className="w-full">{renderPriceBreakdown(payment, booking, t)}</div>
    </AppModal>
  );
}

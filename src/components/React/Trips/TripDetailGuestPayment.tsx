import React from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import type { TripDetail } from '@/types/tripDetail';
import InfoRowSection from './InfoRowSectiont';

interface TripDetailGuestPaymentProps {
  tripDetail: TripDetail;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
  className?: string;
}

const TripDetailGuestPayment: React.FC<TripDetailGuestPaymentProps> = ({
  tripDetail,
  t,
  className = '',
}) => {
  const paymentDetail = tripDetail.paymentDetail;
  const booking = tripDetail.booking;
  // Calculate nights between check-in and check-out
  const checkInDate = new Date(booking.checkInDate);
  const checkOutDate = new Date(booking.checkoutDate);
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate guest fee (total service fee + cleaning fee + discounts)
  const totalGuestFee =
    paymentDetail.totalGuestFee ||
    paymentDetail.totalServiceFee +
      paymentDetail.totalCleaningFee -
      paymentDetail.weeklyDiscount -
      paymentDetail.monthlyDiscount;

  // Calculate total guest payment (totalNightlyPrice + totalGuestFee + occupancyTax)
  const totalGuestPayment = paymentDetail.totalNightlyPrice + totalGuestFee;

  const items = [
    {
      label: `${paymentDetail.currency || 'Bs'} ${(paymentDetail.totalNightlyPrice / nights).toFixed(0)} x ${nights} ${translate(t, 'trips.nights')}`,
      value: `${paymentDetail.currency || 'Bs'} ${paymentDetail.totalNightlyPrice}`,
    },
    {
      label: translate(t, 'trips.guestFee'),
      value: `${paymentDetail.currency || 'Bs'} ${totalGuestFee.toFixed(2)}`,
    },
    {
      label: translate(t, 'trips.total'),
      value: `${paymentDetail.currency || 'Bs'} ${totalGuestPayment.toFixed(2)}`,
    },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <InfoRowSection
        title={translate(t, 'trips.guestPayment')}
        items={items}
      />
    </div>
  );
};

export default TripDetailGuestPayment;

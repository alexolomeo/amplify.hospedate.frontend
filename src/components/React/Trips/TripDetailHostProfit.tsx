import React from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import type { TripDetail } from '@/types/tripDetail';
import InfoRowSection from './InfoRowSectiont';

interface TripDetailHostProfitProps {
  tripDetail: TripDetail;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
  className?: string;
}

const TripDetailHostProfit: React.FC<TripDetailHostProfitProps> = ({
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

  // Calculate host earnings based on the new structure
  const totalNightlyPriceHost = paymentDetail.totalNightlyPriceHost || 0;
  const totalHostFee = paymentDetail.totalHostFee || 0;
  const totalHostProfit = parseFloat(
    (totalNightlyPriceHost - totalHostFee).toFixed(2)
  );

  const items = [
    {
      label: `${translate(t, 'trips.grossEarnings', { nights })}`,
      value: `${paymentDetail.currency || 'Bs'} ${totalNightlyPriceHost}`,
    },
    {
      label: `${translate(t, 'trips.serviceFee')}`,
      value: `${paymentDetail.currency || 'Bs'} ${totalHostFee}`,
    },
    {
      label: translate(t, 'trips.total'),
      value: `${paymentDetail.currency || 'Bs'} ${totalHostProfit}`,
    },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <InfoRowSection
        title={translate(t, 'trips.yourEarnings')}
        items={items}
      />
    </div>
  );
};

export default TripDetailHostProfit;

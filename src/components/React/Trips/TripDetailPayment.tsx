import React from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import type { TripDetail } from '@/types/tripDetail';
import TripPriceDetailsModal from './TripPriceDetailsModal';

interface TripDetailPaymentProps {
  tripDetail: TripDetail;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
}

const TripDetailPayment: React.FC<TripDetailPaymentProps> = ({
  tripDetail,
  t,
  lang,
}) => {
  const payment = tripDetail.paymentDetail;

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleViewPaymentDetails = () => {
    setIsModalOpen(true);
  };

  return (
    <section className="flex flex-col gap-4 px-4 sm:px-0">
      <h3 className="text-base-content text-lg font-bold sm:text-xl">
        {translate(t, 'tripDetail.payment.title')}
      </h3>

      <div>
        <div className="flex h-auto flex-col gap-2 sm:h-8 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <span className="text-neutral text-sm">
            {translate(t, 'tripDetail.payment.totalPaid')}
          </span>
          <span className="text-base-content text-sm font-bold">
            {translate(t, 'tripDetail.payment.currency', {
              amount: payment.totalPrice,
            })}
          </span>
        </div>

        <div className="flex h-auto flex-col gap-2 sm:h-8 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <span className="text-neutral text-sm">
            {translate(t, 'tripDetail.payment.reservationCode')}
          </span>
          <span className="text-base-content text-sm font-bold">
            {tripDetail.booking.reservationCode}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
        <button
          onClick={handleViewPaymentDetails}
          className="border-secondary text-secondary flex h-10 cursor-pointer items-center justify-center rounded-full border px-6 py-0 shadow-sm sm:h-12 sm:px-8"
        >
          <span className="text-xs font-semibold sm:text-sm">
            {translate(t, 'tripDetail.actions.paymentDetails')}
          </span>
        </button>

        {/* <button
          onClick={handleDownloadReceipt}
          className="flex h-10 cursor-pointer items-center justify-center rounded-full bg-transparent px-6 py-0 sm:h-12 sm:px-8"
        >
          <span className="text-primary text-xs underline sm:text-sm">
            {translate(t, 'tripDetail.actions.downloadReceipt')}
          </span>
        </button> */}
      </div>

      <TripPriceDetailsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        payment={payment}
        booking={tripDetail.booking}
        t={t}
        lang={lang}
      />
    </section>
  );
};

export default TripDetailPayment;

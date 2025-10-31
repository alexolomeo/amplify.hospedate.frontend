import React from 'react';
// ...existing imports from TripDetailPanel
import { translate, type SupportedLanguages } from '@/utils/i18n';
import { getTripDetailStatus } from '@/utils/trips';
import TripDetailBanner from './TripDetailBanner';
import TripDetailHost from './TripDetailHost';
import TripDetailBooking from './TripDetailBooking';
import TripDetailPayment from './TripDetailPayment';
import TripDetailHouseRules from './TripDetailHouseRules';
import TripDetailSecurity from './TripDetailSecurity';
import TripDetailCancellation from './TripDetailCancellation';
import TripDetailReservationData from './TripDetailReservationData';
//import TripDetailSupport from './TripDetailSupport';
import TripDetailHostAbout from './TripDetailHostAbout';
import GoogleMap from '../Common/GoogleMap';
import { TripDetailsCases } from '@/types/tripDetail';
import TripDetailCancelledTrip from './TripDetailCancelledTrip';
import type { TripDetail } from '@/types/tripDetail';
import ChevronRight from '/src/icons/chevron-right.svg?react';
import { navigate } from 'astro/virtual-modules/transitions-router.js';

interface TripDetailGuestPageProps {
  lang: SupportedLanguages;
  t: ReturnType<typeof translate>;
  tripDetail: TripDetail;
}

const TripDetailGuestPage: React.FC<TripDetailGuestPageProps> = (props) => {
  const { lang, t, tripDetail } = props;
  const status = getTripDetailStatus(t, tripDetail);
  const isFormValid =
    !!tripDetail.booking.checkInDate && !!tripDetail.cancellationPolicy;

  const handlePayment = () => {
    // Navigate to payment page for the listing
    navigate(`/booking/payment/${tripDetail.id}`);
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
      {/* Left Column - Main Content (6/10) */}
      <div className="flex flex-col gap-8 lg:col-span-5 xl:col-span-6">
        <TripDetailBanner
          tripDetail={tripDetail}
          t={t}
          lang={lang}
          status={status}
        />

        <TripDetailHost
          tripDetail={tripDetail}
          t={t}
          lang={lang}
          status={status}
          handlePayment={handlePayment}
        />

        <div className="border-base-200 border-t"></div>

        <TripDetailBooking tripDetail={tripDetail} lang={lang} />

        <div className="border-base-200 border-t"></div>

        {tripDetail.cancellation &&
          status.case === TripDetailsCases.CANCELLED && (
            <>
              <TripDetailCancelledTrip
                tripDetail={tripDetail}
                t={t}
                lang={lang}
              />

              <div className="border-base-200 border-t"></div>
            </>
          )}

        <TripDetailHostAbout tripDetail={tripDetail} t={t} lang={lang} />

        <div className="border-base-200 border-t"></div>
        <TripDetailReservationData tripDetail={tripDetail} lang={lang} />
        <div className="border-base-200 border-t"></div>

        <TripDetailPayment tripDetail={tripDetail} t={t} lang={lang} />

        <div className="border-base-200 border-t"></div>

        <TripDetailHouseRules tripDetail={tripDetail} t={t} lang={lang} />

        <div className="border-base-200 border-t"></div>

        <TripDetailSecurity tripDetail={tripDetail} t={t} lang={lang} />

        {isFormValid && (
          <>
            <div className="border-base-200 border-t"></div>
            <TripDetailCancellation tripDetail={tripDetail} t={t} lang={lang} />
          </>
        )}

        {/* Payment request from Guest */}
        {status.case === TripDetailsCases.PENDING_PAYMENT && (
          <>
            <div className="border-base-200 border-t"></div>
            <div className="bg-base-200/30 flex flex-col items-start justify-start gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:rounded-[30.4px] sm:p-5">
              <div className="flex flex-1 flex-col gap-1">
                <div className="text-base-content text-left text-xs leading-4 font-normal sm:text-sm sm:leading-5">
                  {t.tripDetail.paymentRequest.haveBeenApproved}
                </div>
                <div className="text-base-content text-left text-sm leading-5 font-bold sm:text-base sm:leading-6">
                  {t.tripDetail.paymentRequest.payToReserve}
                </div>
              </div>
              <button
                onClick={handlePayment}
                className="bg-primary text-base-100 flex h-10 w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-full px-4 shadow-sm sm:h-12 sm:w-auto sm:max-w-md sm:flex-1"
              >
                <div className="text-center text-xs leading-4 font-semibold sm:text-sm">
                  {t.tripDetail.paymentRequest.goToPayment}
                </div>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>
          </>
        )}

        {/* <TripDetailSupport
          tripDetail={tripDetail}
          t={t}
          lang={lang}
          status={status}
        /> */}
      </div>

      {/* Right Column - Sidebar (4/10) */}
      <div className="lg:col-span-5 xl:col-span-4">
        {/* Right column content will be added later */}
        <div className="sticky top-[100px] h-[560px] w-full pb-5 xl:min-w-[500px]">
          <div className="h-full w-full overflow-hidden rounded-xl">
            <GoogleMap
              latitude={tripDetail.location.coordinates.latitude}
              longitude={tripDetail.location.coordinates.longitude}
              zoom={16}
              showMarker={true}
              showRoundedMarker={false}
              interactive={true}
              widthClass="w-full"
              heightClass="h-full"
              className="rounded-[30.4px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailGuestPage;

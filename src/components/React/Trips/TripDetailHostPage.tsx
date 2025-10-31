import React from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import { getTripDetailStatus } from '@/utils/trips';
import TripDetailBanner from './TripDetailBanner';
import TripDetailHost from './TripDetailHost';
import TripDetailBooking from './TripDetailBooking';
//import TripDetailSupport from './TripDetailSupport';
import TripDetailHostAbout from './TripDetailHostAbout';
import GoogleMap from '../Common/GoogleMap';
import { TripDetailsCases } from '@/types/tripDetail';
import TripDetailCancelledTrip from './TripDetailCancelledTrip';
import TripDetailReservationData from './TripDetailReservationData';
import TripDetailHostProfit from './TripDetailHostProfit';
//import TripDetailPrivateNotes from './TripDetailPrivateNotes';
//import TripDetailHouseCover from './TripDetailHouseCover';
import type { TripDetail } from '@/types/tripDetail';

interface TripDetailHostPageProps {
  lang: SupportedLanguages;
  t: ReturnType<typeof translate>;
  tripDetail: TripDetail;
  fetchTripDetail?: () => void;
}

const TripDetailHostPage: React.FC<TripDetailHostPageProps> = (props) => {
  const { lang, t, tripDetail, fetchTripDetail } = props;

  const status = getTripDetailStatus(t, tripDetail, true);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
      {/* Left Column - Main Content (6/10) */}
      <div className="flex flex-col gap-8 lg:col-span-5 xl:col-span-6">
        <TripDetailBanner
          tripDetail={tripDetail}
          t={t}
          lang={lang}
          status={status}
          isHost={true}
        />

        <TripDetailHost
          tripDetail={tripDetail}
          t={t}
          lang={lang}
          status={status}
          isHost={true}
          fetchTripDetail={fetchTripDetail}
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
                isHost={true}
              />

              <div className="border-base-200 border-t"></div>
            </>
          )}

        <TripDetailHostAbout
          tripDetail={tripDetail}
          t={t}
          lang={lang}
          isHost={true}
        />

        <div className="border-base-200 border-t"></div>

        <TripDetailReservationData tripDetail={tripDetail} lang={lang} />

        <div className="border-base-200 border-t"></div>

        <TripDetailHostProfit tripDetail={tripDetail} t={t} lang={lang} />

        {/* <div className="border-base-200 border-t"></div>

        <TripDetailPrivateNotes tripDetail={tripDetail} t={t} lang={lang} />

        <div className="border-base-200 border-t"></div>

        <TripDetailHouseCover tripDetail={tripDetail} t={t} lang={lang} />

        <div className="border-base-200 border-t"></div>

        <TripDetailSupport
          tripDetail={tripDetail}
          t={t}
          lang={lang}
          isHost={true}
          status={status}
        /> */}
      </div>

      {/* Right Column - Sidebar (4/10) */}
      <div className="lg:col-span-5 xl:col-span-4">
        {/* Right column content will be added later */}
        <div className="sticky top-[100px] h-[560px] w-full pb-5 xl:min-w-[500px]">
          <div className="h-full w-full rounded-xl">
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

export default TripDetailHostPage;

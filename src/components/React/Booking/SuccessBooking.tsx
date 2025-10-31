import { getTripDetail } from '@/services/users';
import type { TripDetail } from '@/types/tripDetail';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useEffect, useState } from 'react';
import { ResponsiveImage } from '../Common/ResponsiveImage';
import { $userStore } from '@/stores/userStore';
import { useStore } from '@nanostores/react';
import { formatCurrency } from '@/utils/formatCurrency';
import HomeModernIcon from '/src/icons/home-modern.svg?react';

interface DescriptionPlaceProps {
  lang?: SupportedLanguages;
  tripId: string;
}

export default function SuccessBooking({
  lang = 'es',
  tripId,
}: DescriptionPlaceProps) {
  const t = getTranslation(lang);
  const successTxt = t.booking.success;
  const [tripDetail, setTripDetail] = useState<TripDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useStore($userStore);

  useEffect(() => {
    const fetchPaymentUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        const detail = await getTripDetail(tripId);
        setTripDetail(detail);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (tripId) {
      fetchPaymentUrl();
    }
  }, [tripId]);

  if (loading) {
    return <div></div>;
  }
  if (error) {
    return <div></div>;
  }
  const fallbackPhoto = {
    original: '/images/host/listings/fallback-card-image.webp',
    srcsetWebp: '',
    srcsetAvif: '',
  };
  return (
    <section className="mx-auto max-w-4xl px-5 pt-6 pb-22 lg:max-w-7xl xl:max-w-7xl 2xl:max-w-7xl">
      <div className="flex flex-col gap-10 md:flex-row">
        {/* Trip */}
        <div className="order-1 overflow-auto md:order-2 md:basis-3/7">
          <div className="border-base-200 sticky top-5 rounded-lg border">
            <ResponsiveImage
              photo={tripDetail?.photos[0] || fallbackPhoto}
              alt="image"
              className="h-50 w-full rounded-lg object-cover pb-6"
              sizes="384px"
            />
            <div className="space-y-10 px-10 pt-6 pb-10">
              <div className="space-y-10">
                <div className="space-y-2">
                  <p className="text-lg font-bold">
                    {successTxt.stayWith}
                    {tripDetail?.host.username}
                  </p>
                  <p className="text-neutral">
                    {tripDetail?.location.address}, {tripDetail?.location.city},{' '}
                    {tripDetail?.location.state}
                  </p>
                </div>
                <div className="space-y-2">
                  {tripDetail?.paymentDetail && (
                    <div className="flex justify-between">
                      <span className="text-neutral">{successTxt.total} </span>
                      <span className="font-bold">
                        {formatCurrency(
                          tripDetail?.paymentDetail.totalPrice,
                          tripDetail?.paymentDetail.currency,
                          lang
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral">
                      {' '}
                      {successTxt.reservationCode}
                    </span>
                    <span>{tripDetail?.booking.reservationCode}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <p className="text-lg font-bold">{successTxt.viewDetails}</p>
                <a
                  className="btn btn-primary flex h-12 w-full items-center justify-center gap-2 rounded-full"
                  href="/users/trips"
                >
                  {successTxt.goToMyTrips}
                  <HomeModernIcon></HomeModernIcon>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="order-2 flex flex-col gap-y-16 md:order-1 md:basis-4/7">
          <div className="space-y-2">
            <img
              src="/images/success-booking.webp"
              alt="success-login"
              className="h-80 w-80 object-contain"
            />
            <h1 className="text-2xl font-semibold">
              {successTxt.reservationConfirmed}
            </h1>
            <p className="text-neutral">
              {successTxt.confirmationEmailSent} {user?.email ?? ''}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

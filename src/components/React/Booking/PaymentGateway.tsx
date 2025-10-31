import { retrieveReservationPayment } from '@/services/booking';
import { getTripDetail } from '@/services/users';
import { TripStatus, type TripDetail } from '@/types/tripDetail';
import { type SupportedLanguages } from '@/utils/i18n';
import { useEffect, useState } from 'react';
import ReservationSummaryPanel from './ReservationDetails';
import type { Guests } from '@/types/search';
import { parseISO } from 'date-fns';
import { getPaymentChannelForBooking } from '@/services/realtime/channels';
import { useAblyChannel } from '@/components/React/Hooks/useAblyChannel';
import { navigate } from 'astro/virtual-modules/transitions-router.js';

interface Props {
  lang?: SupportedLanguages;
  tripId: string;
}
interface AblyMessageData {
  success: boolean;
  type: string;
}

function isValidAblyData(data: unknown): data is AblyMessageData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    typeof (data as Record<string, unknown>).success === 'boolean' &&
    'type' in data &&
    typeof (data as Record<string, unknown>).type === 'string'
  );
}

function parseAndValidateAblyData(rawData: unknown): AblyMessageData | null {
  let parsed: unknown;

  try {
    parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
  } catch (err) {
    console.error('Error parsing Ably message data:', err);
    return null;
  }

  if (
    isValidAblyData(parsed) &&
    parsed.success &&
    parsed.type === 'reservation'
  ) {
    return parsed;
  }

  return null;
}
export default function PaymentGateway({ lang = 'es', tripId }: Props) {
  const [tripDetail, setTripDetail] = useState<TripDetail | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        const detail = await getTripDetail(tripId);
        if (detail.status !== TripStatus.WaitingPaymentConfirmation) {
          window.location.href = `/users/trips/${tripId}`;
          return;
        }
        setTripDetail(detail);
        const reservationCode = detail?.booking?.reservationCode;
        if (reservationCode) {
          const url = await retrieveReservationPayment(reservationCode);
          if (url) {
            setPaymentUrl(url);
          } else {
            setError('Failed to retrieve payment URL.');
          }
        } else {
          setError('Reservation code not found.');
        }
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

  useAblyChannel(
    tripId ? getPaymentChannelForBooking(tripId) : '',
    (msg) => {
      if (!msg?.data) return;
      const data = parseAndValidateAblyData(msg.data);
      if (data) {
        navigate(`/booking/success/${tripId}`);
      }
    },
    { events: ['new_message'] }
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-16 md:flex-row">
        {/* Trip */}
        <div className="order-1 md:order-2 md:basis-2/5">
          <div className="h-36 w-80 rounded-[50px] bg-sky-50"></div>
        </div>
        {/* Payment */}
        <div className="order-2 flex flex-col md:order-1 md:basis-3/5">
          <div className="h-[588px] w-96 rounded-[40px] bg-[var(--color-base-150)] p-10"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div></div>;
  }
  const safeParse = (s?: string) => (s ? parseISO(s) : null);
  const from = safeParse(tripDetail?.booking?.checkInDate);
  const to = safeParse(tripDetail?.booking?.checkoutDate);
  const guest: Guests = {
    adults: tripDetail?.booking.adults ?? 0,
    children: 0,
    infants: 0,
    pets: tripDetail?.booking.pets ?? 0,
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Trip */}
      <div className="order-1 overflow-auto md:order-2 md:basis-2/5">
        {tripDetail && (
          <div className="border-base-200 sticky top-5 border">
            <ReservationSummaryPanel
              listing={null}
              cancellationPolicy={tripDetail.cancellationPolicy}
              from={from}
              to={to}
              guest={guest}
              currency={tripDetail.paymentDetail.currency}
              weeklyDiscount={tripDetail.paymentDetail.weeklyDiscount}
              monthlyDiscount={tripDetail.paymentDetail.monthlyDiscount}
              total={tripDetail.paymentDetail.totalPrice}
              perNight={tripDetail.paymentDetail.totalNightlyPrice}
              title={tripDetail.title}
              photo={tripDetail.photos[0]}
              lang={lang}
              serviceFee={tripDetail.paymentDetail.totalServiceFee}
              today={parseISO(tripDetail.booking.createdAt)}
            />
          </div>
        )}
      </div>
      {/* Payment */}
      <div className="order-2 flex flex-col md:order-1 md:basis-3/5">
        {paymentUrl && (
          <iframe
            src={paymentUrl}
            title="Payment Gateway"
            loading="eager"
            className="h-[80vh] w-full flex-grow border-none md:h-[90vh]"
            allow="payment; web-share; clipboard-write"
            sandbox="
              allow-forms
              allow-scripts
              allow-same-origin
              allow-popups
              allow-popups-to-escape-sandbox
              allow-downloads
              allow-top-navigation"
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        )}
      </div>
    </div>
  );
}

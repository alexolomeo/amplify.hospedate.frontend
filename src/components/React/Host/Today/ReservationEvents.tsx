import { useCallback, useEffect, useState } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import type { Listing } from '@/types/host/listing';
import {
  Status,
  type ReservationEvent,
  type ReservationEventsSummary,
} from '@/types/host/reservations';
import { fetchReservationEvents } from '@/services/host/reservations';
import { ReservationEventsSkeleton } from './TodaySkeleton';
import AppIcon from '../../Common/AppIcon';
import AvatarDisplay from '../../Common/AvatarDisplay';
import { ResponsiveImage } from '../../Common/ResponsiveImage';
import { differenceInDays, format } from 'date-fns';
import { formatDateRange } from '@/utils/dateUtils';

interface Props {
  lang: SupportedLanguages;
  listings: Listing[];
}
function formatHour(timeValue: number) {
  const date = new Date(2020, 0, 1, timeValue, 0, 0);
  return format(date, 'hh:mm a');
}
type ReservationCategoryKey = keyof ReservationEventsSummary;

export default function ReservationEvents({ lang, listings }: Props) {
  const t = getTranslation(lang);
  const categories: {
    key: ReservationCategoryKey;
    label: string;
    icon: string;
  }[] = [
    {
      key: 'pendingConfirmation',
      label: t.today.categories.pendingConfirmation,
      icon: 'check-badge',
    },
    {
      key: 'scheduled',
      label: t.today.categories.scheduled,
      icon: 'calendar-outline',
    },
    { key: 'checkIns', label: t.today.categories.checkIns, icon: 'lock-open' },
    { key: 'inProgress', label: t.today.categories.inProgress, icon: 'clock' },
    {
      key: 'checkouts',
      label: t.today.categories.checkouts,
      icon: 'lock-closed',
    },
    // {
    //   key: 'pendingReviews',
    //   label: t.today.categories.pendingReviews,
    //   icon: 'star-line',
    // },
    {
      key: 'cancelled',
      label: t.today.categories.cancelled,
      icon: 'x-mark-mini',
    },
  ];
  const [reservationSummary, setReservationSummary] =
    useState<ReservationEventsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ReservationCategoryKey>(
    'pendingConfirmation'
  );
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchReservationEvents(listings)
      .then((data) => {
        setReservationSummary(data);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching reservation events');
      })
      .finally(() => setLoading(false));
  }, [listings]);
  const eventsToShow = reservationSummary?.[activeCategory] || [];

  const textHeader = useCallback(
    (event: ReservationEvent) => {
      switch (activeCategory) {
        case 'cancelled':
          return (
            <button className="border-error text-error rounded-full border px-2 text-xs">
              {t.today.cancelledByGuest}
            </button>
          );
        case 'checkIns':
          return (
            <button className="border-warning text-warning rounded-full border px-2 text-xs">
              {event.checkInStartTime == -1 ? (
                <span> {t.today.flexibleCheckIn}</span>
              ) : (
                <span>
                  {t.today.checkInToday} {formatHour(event.checkInStartTime)}
                </span>
              )}
            </button>
          );
        case 'checkouts':
          return (
            <button className="border-error text-error rounded-full border px-2 text-xs">
              {t.today.checkOutToday} {formatHour(event.checkoutTime)}
            </button>
          );
        case 'inProgress':
          return (
            <button className="border-secondary text-secondary rounded-full border px-2 text-xs">
              {t.today.lodgedNow}
            </button>
          );
        case 'pendingConfirmation': {
          const isPendingPayment =
            event.status === Status.WaitingPaymentConfirmation;
          const translatedText = isPendingPayment
            ? t.today.pendingPayment
            : t.today.pendingApproval;
          const colorButton = isPendingPayment
            ? 'text-primary border-primary'
            : 'text-warning border-warning';
          return (
            <button
              className={`border ${colorButton} rounded-full px-2 text-xs`}
            >
              {translatedText}
            </button>
          );
        }
        case 'pendingReviews':
          return (
            <button className="border-secondary text-secondary rounded-full border px-2 text-xs">
              {t.today.mustReview}
            </button>
          );
        case 'scheduled':
          return (
            <button className="border-primary text-primary rounded-full border px-2 text-xs">
              {t.today.willStay}{' '}
              {differenceInDays(new Date(event.checkInDate), new Date())}{' '}
              {t.today.days}
            </button>
          );
        default:
          return '';
      }
    },
    [activeCategory, t.today]
  );

  if (loading) return <ReservationEventsSkeleton></ReservationEventsSkeleton>;
  if (error) return <div></div>;
  return (
    <div>
      {/* Pestañas */}
      <div className="mb-4 flex flex-nowrap items-center justify-start gap-4 overflow-x-auto">
        {categories.map((category) => (
          <button
            key={category.key}
            className={`flex flex-1 cursor-pointer items-center pb-1 text-sm whitespace-nowrap ${activeCategory === category.key ? 'border-neutral border-b-2' : 'border-neutral-content border-b'}`}
            onClick={() => setActiveCategory(category.key)}
          >
            <AppIcon
              iconName={category.icon}
              folder="today"
              className="mr-2 h-4 w-4"
            />
            {category.label}
            <span
              className={`p-1 ${category.key === 'cancelled' ? 'text-error' : ''} ${category.key === 'pendingConfirmation' ? 'text-primary' : ''} ${category.key !== 'cancelled' && category.key !== 'pendingConfirmation' ? 'text-secondary' : ''}`}
            >
              ({reservationSummary?.[category.key]?.length || 0})
            </span>
          </button>
        ))}
      </div>

      {/* Mostrar eventos */}
      {eventsToShow.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {eventsToShow.map((event) => (
            <div
              key={event.id}
              className="border-base-200 w-full space-y-3 rounded-[30.40px] border p-4"
            >
              {textHeader(event)}
              <div className="flex w-full items-center gap-1">
                <div className="relative flex-none">
                  <ResponsiveImage
                    photo={event.listing.photo}
                    alt="User profile picture"
                    className="h-10 w-10 rounded-2xl object-cover"
                  />
                  <div className="bg-primary absolute top-0 right-0 rounded-full border-2 border-white">
                    <AvatarDisplay
                      profilePicture={event.guest.profilePicture}
                      username={event.guest.username}
                      size="h-5 w-5"
                      sizeText="text-4xl"
                    />
                  </div>
                </div>
                <div className="w-full text-sm">
                  <p className="w-full truncate">{event.guest.username}</p>
                  <p className="font-bold">
                    {formatDateRange(
                      event.checkInDate,
                      event.checkoutDate,
                      lang
                    )}
                  </p>
                  <p className="w-9/12 truncate">{event.listing.title}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                {/* TODO: Uncomment this section once the functionality is implemented */}
                {/* <a className="flex items-center gap-2 underline">
                  {t.today.message}
                  <PaperAirPlaneIcon className="text-primary h-4 w-4"></PaperAirPlaneIcon>
                </a> */}
                <a
                  className="btn btn-outline btn-secondary btn-sm rounded-full"
                  href={`/hosting/trips/${event.id}`}
                >
                  {t.today.viewMore}
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <img
            src="/images/checkList.webp"
            alt="step1"
            className="h-32 w-48 rounded-[40px] object-cover"
          />
          <p>{t.today.noEvents}</p>
        </div>
      )}
    </div>
  );
}

import type { ListingDetail } from '@/types/listing/listing';
import {
  getTranslation,
  translate,
  translatePlural,
  type SupportedLanguages,
} from '@/utils/i18n';
import { ResponsiveImage } from '../Common/ResponsiveImage';
import { formatAddress } from '@/utils/formatAddress';
import StarIcon from '/src/icons/star.svg?react';
import ChatBubbleOvalIcon from '/src/icons/chat-bubble-oval-left.svg?react';
import type { Guests } from '@/types/search';
import { useSearch } from '../Hooks/useSearch';
import { differenceInCalendarDays } from 'date-fns';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/dateUtils';
import type { CancellationPolicy } from '@/types/tripDetail';
import type { Photo } from '@/types/listing/space';
import ListingCancellationPolicy from '../Listing/ListingCancellationPolicy';

interface DiscountRow {
  label: string;
  amount: string;
  testId: string;
}
export interface ReservationSummaryPanelProps {
  lang?: SupportedLanguages;
  listing: ListingDetail | null;
  cancellationPolicy: CancellationPolicy;
  from: Date | null;
  to: Date | null;
  guest: Guests;
  weeklyDiscount: number;
  monthlyDiscount: number;
  total: number;
  serviceFee: number;
  perNight: number;
  currency: string;
  title: string;
  photo: Photo;
  today: Date;
}

export default function ReservationSummaryPanel({
  lang = 'es',
  listing,
  cancellationPolicy,
  from,
  to,
  guest,
  weeklyDiscount,
  monthlyDiscount,
  total,
  serviceFee,
  perNight,
  currency,
  title,
  photo,
  today,
}: ReservationSummaryPanelProps) {
  const t = getTranslation(lang);
  const fallbackPhoto = {
    original: '/images/host/listings/fallback-card-image.webp',
    srcsetWebp: '',
    srcsetAvif: '',
  };
  const addGuestsText = t.search.addGuests;
  const { getGuestSubtitle } = useSearch(guest, t);
  // prices
  const nights = from && to ? differenceInCalendarDays(to, from) : 0;
  const hasWeeklyDiscount = weeklyDiscount > 0;
  const hasMonthlyDiscount = monthlyDiscount > 0;
  const discountRows: DiscountRow[] = [
    hasMonthlyDiscount && {
      label: translate(t, t.listingDetail.booking.monthlyDiscount),
      amount: formatCurrency(monthlyDiscount, currency, lang),
      testId: 'listing-booking-monthly-discount',
    },
    hasWeeklyDiscount && {
      label: translate(t, t.listingDetail.booking.weeklyDiscount),
      amount: formatCurrency(weeklyDiscount, currency, lang),
      testId: 'listing-booking-weekly-discount',
    },
  ].filter(Boolean) as DiscountRow[];

  return (
    <div className="space-y-6 p-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <ResponsiveImage
          photo={photo || fallbackPhoto}
          alt="image"
          className="h-20 w-20 rounded-lg object-cover"
          sizes="80px"
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          {listing && (
            <>
              <p className="text-neutral mt-1 text-sm">
                {formatAddress(listing)}
              </p>
              <div className="mt-2 flex items-center gap-4 text-sm">
                {listing.rating && (
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4"></StarIcon>{' '}
                    {listing.rating.score.toFixed(1)}
                  </div>
                )}
                {listing.reviews && (
                  <div className="flex items-center gap-1">
                    <ChatBubbleOvalIcon className="h-3.5 w-3.5"></ChatBubbleOvalIcon>{' '}
                    {listing.reviews.totalReviews}
                    {t.listingDetail.review.review}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cancellation */}
      <div>
        <h3 className="text-base font-semibold">{t.booking.policy.title}</h3>
        {from && to && (
          <ListingCancellationPolicy
            checkIn={from}
            checkout={to}
            cancellationPolicy={cancellationPolicy}
            lang={lang}
            isFormValid={true}
            today={today}
            textSize={'text-xs'}
          />
        )}
      </div>
      {/* Travel details */}
      <div className="space-y-1">
        <h3 className="text-base font-semibold">
          {t.booking.details.tripDetails}
        </h3>
        {from && to && (
          <p className="text-neutral text-sm">
            {formatDate(from, lang)} - {formatDate(to, lang)}
          </p>
        )}
        <p className="text-neutral text-sm">
          {getGuestSubtitle(addGuestsText)}
        </p>
      </div>

      {/* Price breakdown */}
      <div>
        <h3 className="text-base font-semibold">
          {t.booking.details.priceInformation}
        </h3>
        <div className="mt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral">
              {nights}{' '}
              {translatePlural(t, 'listingDetail.booking.night', nights)}:
            </span>
            <span className="font-bold">
              {formatCurrency(perNight, currency, lang)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral font-normal">
              {t.listingDetail.booking.serviceFee}:
            </span>
            <span
              className="font-normal"
              data-testid="listing-booking-detail-perNight"
            >
              {formatCurrency(serviceFee, currency, lang)}
            </span>
          </div>
          {discountRows.map((row, index) => (
            <div
              key={index}
              className="flex justify-between"
              data-testid={row.testId}
            >
              <span className="text-neutral font-normal">{row.label}</span>
              <span className="font-bold text-lime-600">- {row.amount}</span>
            </div>
          ))}
          <div className="border-base-300 flex justify-between border-t pt-5 font-bold">
            <span>{translate(t, t.listingDetail.booking.total)}</span>
            <span data-testid="listing-booking-detail-total">
              {formatCurrency(total, currency, lang)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

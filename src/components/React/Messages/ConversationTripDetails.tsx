import React, { useState } from 'react';
import ShieldCheckIcon from 'src/icons/shield-check.svg?react';
import StarIcon from 'src/icons/star.svg?react';
import ArrowUpIcon from 'src/icons/arrow-up-tray.svg?react';
import HomeIcon from 'src/icons/home.svg?react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import type { ConversationVM } from '@/adapters/messages';
import type { TripDetail } from '@/types/tripDetail';
import type { ListingDetail } from '@/types/listing/listing';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import type { Photo } from '@/types/listing/space';
import { navigate } from 'astro:transitions/client';
import TripPriceDetailsModal from '@/components/React/Trips/TripPriceDetailsModal';
import TripDetailHouseRules from '@/components/React/Trips/TripDetailHouseRules.tsx';
import TripDetailSecurity from '@/components/React/Trips/TripDetailSecurity.tsx';
// import TripDetailSupport from '@/components/React/Trips/TripDetailSupport.tsx';
// import { getTripDetailStatus } from '@/utils/trips.ts';
import HomeModernIcon from 'src/icons/home-modern.svg?react';
import TripDetailBooking from '@/components/React/Trips/TripDetailBooking.tsx';
import ChevronRightIcon from 'src/icons/chevron-right.svg?react';

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object';
}

// Guard: object with required photo fields
function isPhoto(v: unknown): v is Photo {
  if (!isRecord(v)) return false;

  const hasOriginal =
    'original' in v &&
    typeof (v as { original?: unknown }).original === 'string';

  const hasSrcsetWebp =
    'srcsetWebp' in v &&
    typeof (v as { srcsetWebp?: unknown }).srcsetWebp === 'string';

  const hasSrcsetAvif =
    'srcsetAvif' in v &&
    typeof (v as { srcsetAvif?: unknown }).srcsetAvif === 'string';

  return hasOriginal && (hasSrcsetWebp || hasSrcsetAvif);
}

const isUrl = (v: unknown): v is string =>
  typeof v === 'string' && v.length > 0;

type PersonView = {
  id?: number | null;
  name: string;
  verified: boolean;
  reviews: number | null;
  joinedYear: string;
  livesIn: string;
  avatarPhoto: Photo | null;
  avatarUrl: string | null;
  profileUrl: string | null;
  titleText: string;
  roleLabel: string;
  verifiedLabel: string;
  reviewsLabel: (count: number) => string;
  joinedLabel: (year: string) => string;
  livesInLabel: (location: string) => string;
  viewProfileLabel: string;
};

const ConversationTripDetails: React.FC<{
  selectedConversation: ConversationVM | null;
  tripDetail?: TripDetail | null;
  listingDetail?: ListingDetail | null;
  lang?: SupportedLanguages;
  onClose: () => void;
  currentUserId: number | null;
}> = ({
  selectedConversation,
  tripDetail,
  listingDetail,
  lang = 'es',
  onClose,
  currentUserId,
}) => {
  const t = getTranslation(lang);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const title =
    tripDetail?.title ??
    listingDetail?.title ??
    selectedConversation?.listing?.title ??
    '';

  // Candidates for the main image (original code)
  const candidates: unknown[] = [
    tripDetail?.photos?.[0],
    listingDetail?.spaces?.[0]?.photos?.[0],
    listingDetail?.spaces?.flatMap((s) => s.photos ?? [])?.[0],
    selectedConversation?.placeImage,
    selectedConversation?.listing?.photo,
  ];

  const tripListingPhoto = (candidates.find(isPhoto) ?? null) as Photo | null;
  const tripListingPhotoUrl = (candidates.find(isUrl) ?? null) as string | null;

  // Source objects
  const host = tripDetail?.host ?? listingDetail?.host;
  const guest = tripDetail?.guest;

  const hostId = host?.id ?? null;
  const viewerIsHost = Boolean(
    currentUserId && hostId && currentUserId === hostId
  );

  // Build unified the "person view" depending on who is viewing:
  // If the viewer is the host -> show guest info, otherwise show host info.
  const person: PersonView = (() => {
    if (viewerIsHost && guest) {
      // Map Guest -> PersonView
      const name = guest.username || '';
      const avatarCandidate = guest.profilePicture ?? null;
      const avatarPhoto = isPhoto(avatarCandidate) ? avatarCandidate : null;
      const avatarUrl = isPhoto(avatarCandidate)
        ? avatarCandidate.original
        : null;
      const joinedYear = guest.becameUserAt
        ? new Date(guest.becameUserAt).getFullYear().toString()
        : '';
      const livesIn = guest.city || '';

      return {
        id: guest.id,
        name,
        verified: Boolean(guest.identityVerified),
        reviews: Number.isFinite(guest.totalReviews)
          ? guest.totalReviews
          : null,
        joinedYear,
        livesIn,
        avatarPhoto,
        avatarUrl,
        profileUrl: guest.id ? `/users/${guest.id}` : null,
        titleText: t.messages.guest.aboutGuest.replace(
          '{guestName}',
          name || '—'
        ),
        roleLabel: t.messages.guest.reservedBy,
        verifiedLabel: t.messages.guest.verified,
        reviewsLabel: (count: number) =>
          t.messages.guest.reviews.replace('{count}', String(count)),
        joinedLabel: (year: string) =>
          t.messages.guest.joined.replace('{year}', year),
        livesInLabel: (location: string) =>
          t.messages.guest.livesIn.replace('{location}', location),
        viewProfileLabel: t.messages.guest.viewProfile,
      };
    }

    // Default: show Host
    const hostName =
      (isRecord(host) &&
      'username' in host &&
      typeof (host as { username?: unknown }).username === 'string'
        ? (host as { username: string }).username
        : undefined) ?? '';

    const hostAvatarCandidate =
      (isRecord(host) && 'profilePicture' in host
        ? ((host as { profilePicture?: unknown }).profilePicture ?? null)
        : null) ?? null;

    const hostAvatarPhoto = isPhoto(hostAvatarCandidate)
      ? hostAvatarCandidate
      : null;
    const hostAvatarUrl = isPhoto(hostAvatarCandidate)
      ? hostAvatarCandidate.original
      : null;

    const hostVerified =
      isRecord(host) &&
      'verified' in host &&
      typeof (host as { verified?: unknown }).verified === 'boolean'
        ? Boolean((host as { verified?: boolean }).verified)
        : false;

    const hostReviews = host?.totalReviews ?? null;
    const hostJoinedYear = host?.becameHostAt
      ? new Date(host.becameHostAt).getFullYear().toString()
      : '';
    const hostLivesIn = host?.city || '';

    return {
      id: host?.id ?? null,
      name: hostName,
      verified: hostVerified,
      reviews: Number.isFinite(hostReviews) ? Number(hostReviews) : null,
      joinedYear: hostJoinedYear,
      livesIn: hostLivesIn,
      avatarPhoto: hostAvatarPhoto,
      avatarUrl: hostAvatarUrl,
      profileUrl: host?.id ? `/users/${host.id}` : null,
      titleText: t.messages.host.aboutHost.replace(
        '{hostName}',
        hostName || '—'
      ),
      roleLabel: t.messages.host.hostedBy,
      verifiedLabel: t.messages.host.verified,
      reviewsLabel: (count: number) =>
        t.messages.host.reviews.replace('{count}', String(count)),
      joinedLabel: (year: string) =>
        t.messages.host.joined.replace('{year}', year),
      livesInLabel: (location: string) =>
        t.messages.host.livesIn.replace('{location}', location),
      viewProfileLabel: t.messages.host.viewProfile,
    };
  })();

  const currency = tripDetail?.paymentDetail.currency || 'BOB';
  const totalPaid = tripDetail?.paymentDetail.totalPrice;
  const payment = tripDetail?.paymentDetail;
  const bookingData = tripDetail?.booking;

  if (!tripDetail && !listingDetail) return null;

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto md:max-w-2xs lg:max-w-xs xl:max-w-sm">
      {/* Backdrop only for mobile */}
      <div className="fixed inset-0 z-10 bg-black/60 transition-opacity md:hidden" />

      {/* Close (mobile) */}
      <button
        type="button"
        className="bg-base-100/80 absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full text-gray-600 shadow-md transition hover:text-gray-900 md:hidden"
        onClick={onClose}
        aria-label={t.messages.backToConversations}
        tabIndex={0}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Header (desktop) */}
      <div className="bg-base-100 sticky top-0 z-10 hidden w-full items-center justify-between shadow-sm md:flex md:py-9">
        <div className="flex flex-1 justify-center">
          <h3 className="line-clamp-1 text-center text-base leading-6 font-bold">
            {t.messages.reservation.title}
          </h3>
        </div>
        <button
          type="button"
          className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer hover:opacity-70 md:static md:translate-y-0"
          onClick={onClose}
          aria-label={t.messages.backToConversations}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="divide-base-300 fixed inset-0 z-20 mt-4 flex h-full w-full flex-col divide-y overflow-y-auto rounded-3xl bg-white px-2 pt-10 md:relative md:inset-auto md:mt-0 md:rounded-none md:px-2 md:pt-0">
        {/* Hero / title / person (host or guest) */}
        <div className="flex w-full flex-col gap-6 pb-6 md:pt-2">
          {tripListingPhoto ? (
            <ResponsiveImage
              photo={tripListingPhoto}
              className="flex max-h-60 w-full rounded-2xl object-contain"
              pictureClassName="rounded-2xl flex justify-center"
              alt={title || 'Listing photo'}
              sizes="384px"
            />
          ) : tripListingPhotoUrl ? (
            <img
              src={tripListingPhotoUrl}
              alt={title || 'Listing photo'}
              className="flex max-h-60 w-full justify-center rounded-2xl object-contain"
            />
          ) : (
            <div className="h-40 w-full rounded-2xl bg-gray-200" />
          )}

          {title && (
            <div>
              <span className="text-3xl leading-9 font-bold">{title}</span>
            </div>
          )}

          {(person.name || person.avatarPhoto || person.avatarUrl) && (
            <div className="inline-flex gap-3">
              {person.avatarPhoto ? (
                <a href={person.profileUrl ?? '#'}>
                  <ResponsiveImage
                    photo={person.avatarPhoto}
                    alt={person.name || 'User'}
                    className="h-12 w-12 rounded-full"
                    sizes="48px"
                  />
                </a>
              ) : person.avatarUrl ? (
                <a href={person.profileUrl ?? '#'}>
                  <img
                    src={person.avatarUrl}
                    alt={person.name || 'User'}
                    className="h-12 w-12 rounded-full"
                  />
                </a>
              ) : (
                <div
                  className="h-12 w-12 rounded-full bg-gray-200"
                  aria-hidden
                />
              )}
              <div className="flex flex-col">
                <span className="text-sm">{person.roleLabel}</span>
                <a
                  href={person.profileUrl ?? '#'}
                  className="text-primary w-fit leading-7 font-bold"
                >
                  {person.name || '—'}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Listing section */}
        {listingDetail && (
          <div className="flex flex-col py-6">
            <a
              className="flex cursor-pointer items-center gap-6"
              href={`/listing/${listingDetail.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <HomeModernIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              <div className="flex flex-col">
                <h3 className="text-xl leading-7 font-bold">
                  {t.messages.listing.label}
                </h3>
                <span className="text-neutral leading-6">
                  {listingDetail.location.address}
                </span>
              </div>
              <div className="ml-auto">
                <ChevronRightIcon />
              </div>
            </a>
          </div>
        )}

        {/* Reservation details */}
        {tripDetail && (
          <div className="flex flex-col py-6">
            <TripDetailBooking tripDetail={tripDetail} lang={lang} />
          </div>
        )}

        {/* Person details (host or guest) */}
        {(person.name ||
          person.avatarPhoto ||
          person.avatarUrl ||
          person.verified ||
          person.reviews !== null ||
          person.joinedYear ||
          person.livesIn) && (
          <div className="flex flex-col py-6">
            <div className="inline-flex justify-between pb-4">
              <span className="leading 7 text-xl font-bold">
                {person.titleText}
              </span>

              {person.avatarPhoto ? (
                <ResponsiveImage
                  photo={person.avatarPhoto}
                  className="h-8 w-8 rounded-full"
                  alt={person.name || 'User'}
                  sizes="32px"
                />
              ) : person.avatarUrl ? (
                <img
                  src={person.avatarUrl}
                  alt={person.name || 'User'}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-200" aria-hidden />
              )}
            </div>

            <div className="flex flex-col gap-2">
              {person.verified && (
                <div className="inline-flex">
                  <ShieldCheckIcon className="text-secondary h-6 w-6 pr-0.5" />
                  <span className="text-sm">{person.verifiedLabel}</span>
                </div>
              )}
              {typeof person.reviews === 'number' && (
                <div className="inline-flex">
                  <StarIcon className="text-secondary h-6 w-6 pr-0.5" />
                  <span className="text-sm">
                    {person.reviewsLabel(person.reviews)}
                  </span>
                </div>
              )}
              {person.joinedYear && (
                <div className="inline-flex">
                  <ArrowUpIcon className="h-6 w-6 fill-white pr-0.5" />
                  <span className="text-sm">
                    {person.joinedLabel(person.joinedYear)}
                  </span>
                </div>
              )}
              {person.livesIn && (
                <div className="inline-flex">
                  <HomeIcon className="text-secondary h-6 w-6 pr-0.5" />
                  <span className="text-sm">
                    {person.livesInLabel(person.livesIn)}
                  </span>
                </div>
              )}
            </div>

            <div className="text-secondary flex w-full flex-col gap-2 pt-4">
              <button
                onClick={() => person.profileUrl && navigate(person.profileUrl)}
                className="border-secondary hover:bg-secondary-content h-12 w-full cursor-pointer rounded-full border text-sm font-semibold"
              >
                {person.viewProfileLabel}
              </button>
            </div>
          </div>
        )}

        {/* Payment details */}
        {currency && totalPaid && (
          <div className="flex flex-col py-6">
            <span className="leading 7 text-xl font-bold">
              {t.messages.payment.title}
            </span>
            <div className="inline-flex w-full justify-between py-4">
              <span className="text-neutral text-sm leading-5">
                {t.messages.payment.totalPaid}
              </span>
              <span>{`${currency ?? ''}${` ${totalPaid}`}`}</span>
            </div>
            <div className="flex w-full items-center justify-center">
              <button
                className="border-secondary hover:bg-secondary-content text-secondary h-12 w-full cursor-pointer rounded-full border text-sm font-semibold"
                onClick={() => setIsPaymentModalOpen(true)}
              >
                {t.messages.payment.details}
              </button>
            </div>
          </div>
        )}

        {/* House rules*/}
        <div className="flex flex-col py-6">
          <TripDetailHouseRules
            listingDetail={listingDetail}
            t={t}
            lang={lang}
            isConversationCard={true}
          />
        </div>

        {/* Security */}
        {tripDetail && (
          <div className="flex flex-col py-6">
            <TripDetailSecurity
              tripDetail={tripDetail}
              t={t}
              lang={lang}
              isConversationCard={true}
            />
          </div>
        )}

        {/* Support*/}
        {/* {tripDetail && (
          <TripDetailSupport
            tripDetail={tripDetail}
            t={t}
            status={getTripDetailStatus(t, tripDetail)}
            lang={lang}
            isConversationCard={true}
          />
        )} */}
      </div>

      {/* Price details modal */}
      {tripDetail && payment && bookingData && (
        <TripPriceDetailsModal
          open={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          payment={payment}
          booking={bookingData}
          t={t}
          lang={lang}
        />
      )}
    </div>
  );
};

export default ConversationTripDetails;

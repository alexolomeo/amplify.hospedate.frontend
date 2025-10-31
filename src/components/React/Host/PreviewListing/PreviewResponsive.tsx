import * as React from 'react';
import { getSafeText } from '@/utils/displayHelpers';
import { formatAddress } from '@/utils/formatAddress';
import { type SupportedLanguages, getTranslation } from '@/utils/i18n';

import ListingDetailInfo from './ListingDetailInfo';
import ListingDetailDescription from './ListingDetailDescription';
import ListingDetailAmenity from './ListingDetailAmenity';
import ListingDetailReview from './ListingDetailReview';
import ListingDetailRating from './ListingDetailRating';
import ListingDetailHost from './ListingDetailHost';
import ListingDetailThingsToKnow from './ListingDetailThingsToKnow';
import ListingDetailMap from './ListingDetailMap';
import { GalleryContainer } from '../../Listing/GalleryContainer';
import { useListingPreview } from '../../Hooks/Host/EditListing/useListingPreview';
import LoadingSpinner from '../../Common/LoadingSpinner';
import BookingContainer from '../../Listing/BookingContainer';

type Props = {
  id: string;
  lang?: SupportedLanguages;
};

export default function PreviewResponsive({ id, lang = 'es' }: Props) {
  const t = React.useMemo(() => getTranslation(lang), [lang]);
  const listingIdNumber = Number(id);

  const { previewData: listing, status, error } = useListingPreview(id, lang);

  // 🔹 Loading view
  if (status === 'loading' || !listing) {
    return (
      <div className="px-[clamp(1rem,8vw,143px)] pt-16">
        <LoadingSpinner />
      </div>
    );
  }

  // 🔹 Error view
  if (status === 'error') {
    return (
      <div className="px-[clamp(1rem,8vw,143px)] pt-16">
        <div className="text-error mb-4">
          {error ?? 'Failed to load listing.'}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          {t.hostContent.editListing.commonMessages.retry}
        </button>
      </div>
    );
  }

  // 🔹 Success view
  return (
    <section className="overflow-y-scroll px-5 py-10 pt-6 [scrollbar-width:none] md:px-15 [&::-webkit-scrollbar]:hidden">
      <div className="py-4">
        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl lg:text-5xl">
          {getSafeText(listing.title, lang)}
        </h1>
      </div>

      <div id="mansory-container" className="my-4" />

      <div className="grid grid-cols-1 gap-6 py-10 md:grid-cols-10">
        <div className="col-span-1 md:col-span-6">
          <ListingDetailInfo listing={listing} />
          <ListingDetailDescription description={listing.description} />
          <div id="sleeping-container" />
          <ListingDetailAmenity amenities={listing.amenities} />
          <div id="calendar-container" />
        </div>

        <div className="sticky top-10 self-start py-8 md:col-span-4">
          <div id="booking-container" />
        </div>
      </div>

      {!!listing.rating && (
        <ListingDetailRating rating={listing.rating} lang={lang} />
      )}

      {listing.reviews &&
        listing.rating &&
        Number.isFinite(listingIdNumber) && (
          <ListingDetailReview
            reviews={listing.reviews}
            rating={listing.rating}
            listingId={listingIdNumber}
            lang={lang}
          />
        )}

      <ListingDetailHost host={listing.host} lang={lang} />

      <BookingContainer
        id={listing.id}
        city={listing.location.city}
        petsAllowed={listing.houseRules.petsAllowed}
        maxGuests={listing.placeInfo.guestNumber}
        calendarSettings={listing.calendar}
        houseRules={listing.houseRules}
        preview
      />
      <ListingDetailMap
        address={formatAddress(listing)}
        coordinates={listing.location.coordinates}
        showSpecificLocation={listing.showSpecificLocation}
        lang={lang}
      />
      <ListingDetailThingsToKnow
        houseRules={listing.houseRules}
        safetyProperty={listing.safetyProperty}
        lang={lang}
      />
      <GalleryContainer spaces={listing.spaces} lang={lang} />
    </section>
  );
}

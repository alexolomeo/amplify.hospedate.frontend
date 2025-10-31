import { useEffect, useState } from 'react';
import ReservationSummaryPanel from './ReservationDetails';
import DescriptionPlace from './DescriptionPlace';
import QrPaymentForm from './payments/QrPaymentForm';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import CancellationPolicy from '../Common/booking/CancellationPolicy';
import AppButton from '../Common/AppButton';
import SectionMessageHost from './SectionMessageHost';
import { $userStore } from '@/stores/userStore';
import ShowVerifyIdentityModal from '../VerifyIdentity/ShowVerifyIdentityModal';
import { KycSessionManager } from '@/utils/kycSession';
import { useStore } from '@nanostores/react';
import { createReservationPayment } from '@/services/booking';
import ModalNotAvailabilityPayment from './ModalNotAvailabilityPayment';
import type { ReservationPaymentAvailability } from '@/types/booking';
import type { Guests } from '@/types/search';
import { parseISO } from 'date-fns';
import ShieldCheckIcon from '/src/icons/shield-check.svg?react';
import {
  fetchListingById,
  fetchListingAvailability,
} from '@/services/listings';
import type {
  ListingAvailibility,
  ListingDetail,
  ParamsListingAvailibility,
} from '@/types/listing/listing';

interface Props {
  lang?: SupportedLanguages;
  listingId: string;
  params: ParamsListingAvailibility;
}

export default function BookingBase({ lang = 'es', listingId, params }: Props) {
  const t = getTranslation(lang);

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [availability, setAvailability] = useState<ListingAvailibility | null>(
    null
  );

  const [loadingFetch, setLoadingFetch] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [showIdvModal, setShowIdvModal] = useState(false);
  const user = useStore($userStore);

  const [nit, setNit] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState({ nit: false, name: false });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isNotAvailabilityPayment, setIsNotAvailabilityPayment] =
    useState(false);
  const [reservationPayment, setReservationPayment] =
    useState<ReservationPaymentAvailability | null>(null);

  const { checkInDate, checkoutDate, adults, children, infants, pets } = params;

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoadingFetch(true);
        setApiError(null);

        const [listing, availability] = await Promise.all([
          fetchListingById(Number(listingId)),
          fetchListingAvailability(Number(listingId), {
            checkInDate,
            checkoutDate,
            adults,
            children,
            infants,
            pets,
          }),
        ]);

        if (ignore) return;

        if (!listing || !availability) {
          setListing(null);
          setAvailability(null);
          setApiError(t.booking.error.loadData);
          return;
        }

        setListing(listing);
        setAvailability(availability);
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setApiError(t.booking.error.loadData);
        }
      } finally {
        if (!ignore) setLoadingFetch(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [
    listingId,
    checkInDate,
    checkoutDate,
    adults,
    children,
    infants,
    pets,
    t.booking.error.loadData,
  ]);

  const openIdvModal = async () => {
    try {
      await KycSessionManager.handleVerification(() => setShowIdvModal(true));
    } catch (error) {
      console.error('Failed to initiate identity verification:', error);
    }
  };
  const closeIdvModal = () => setShowIdvModal(false);
  const handleIdvFinished = async () => {
    console.log('Identity verification completed');
    closeIdvModal();
  };

  const validateNit = (v: string) => {
    const digits = v.replace(/\D+/g, '');
    if (!digits) return t.paymentMethod.validation.required;
    if (!/^\d{5,15}$/.test(digits)) return t.paymentMethod.validation.nitDigits;
    return null;
  };
  const validateName = (v: string) => {
    const s = v.trim();
    if (!s) return t.paymentMethod.validation.required;
    if (s.length < 2) return t.paymentMethod.validation.nameShort;
    return null;
  };
  const nitError = validateNit(nit);
  const nameError = validateName(name);

  const handleFormSubmit = async () => {
    if (bookingLoading) return;
    setTouched({ nit: true, name: true });
    const isFormValid = !nitError && !nameError;
    if (isFormValid) {
      try {
        setBookingLoading(true);
        setApiError(null);
        const data = await createReservationPayment(
          params,
          message,
          nit,
          name,
          listingId
        );
        setReservationPayment(data);
        if (data?.isAvailabilityPayment) {
          window.location.href = `/booking/payment/${data.tripId}`;
        } else {
          setIsNotAvailabilityPayment(true);
        }
      } catch (error) {
        console.error('Failed to create reservation payment', error);
        setApiError(t.booking.error.reservationPayment);
      } finally {
        setBookingLoading(false);
      }
    }
  };

  if (loadingFetch) {
    return (
      <div className="py-16 text-center">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  if (apiError || !listing || !availability) {
    return (
      <div className="alert alert-error">
        {apiError ?? t.booking.error.loadData}
      </div>
    );
  }

  const from = parseISO(params.checkInDate);
  const to = parseISO(params.checkoutDate);
  const guest: Guests = {
    adults: params.adults,
    children: params.children ?? 0,
    infants: params.infants ?? 0,
    pets: params.pets ?? 0,
  };
  const today = new Date();

  return (
    <div>
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="order-1 md:order-2 md:basis-2/5">
          <div className="border-base-200 sticky top-20 rounded-xl border">
            <ReservationSummaryPanel
              listing={listing}
              cancellationPolicy={availability.cancellationPolicy}
              from={from}
              to={to}
              guest={guest}
              currency={availability.pricing.currency}
              weeklyDiscount={availability.pricing.weeklyDiscountAmount}
              monthlyDiscount={availability.pricing.monthlyDiscountAmount}
              total={availability.pricing.total}
              serviceFee={availability.pricing.serviceFee}
              perNight={availability.pricing.subtotalBeforeServiceFee}
              title={listing.title}
              photo={listing.spaces[0].photos[0]}
              today={today}
            />
          </div>
        </div>

        <div className="order-2 flex flex-col space-y-14 md:order-1 md:basis-3/5">
          {user && user.identityVerified ? (
            <>
              <DescriptionPlace lang={lang} params={params} />
              <QrPaymentForm
                lang={lang}
                nit={nit}
                setNit={setNit}
                name={name}
                setName={setName}
                touched={touched}
                setTouched={setTouched}
                nitError={nitError}
                nameError={nameError}
              />
              <SectionMessageHost
                lang={lang}
                username={listing.host.username}
                profilePicture={listing.host.profilePicture}
                rating={
                  listing.host.score && listing.host.score > 0
                    ? listing.host.score
                    : null
                }
                message={message}
                setMessage={setMessage}
              />
              <CancellationPolicy lang={lang} />
              <div className="w-full">
                {apiError && (
                  <div className="alert alert-error alert-soft mb-5">
                    {apiError}
                  </div>
                )}
                {user?.id === listing.host.id && (
                  <div className="alert alert-warning alert-soft mb-5">
                    {t.paymentMethod.cannotBookYourOwnListing}
                  </div>
                )}
                <AppButton
                  label={
                    bookingLoading
                      ? t.auth.loading
                      : t.paymentMethod.bookListing
                  }
                  type="submit"
                  variant="default"
                  size="sm"
                  rounded
                  fontSemibold
                  disabled={
                    bookingLoading ||
                    !!nitError ||
                    !!nameError ||
                    user?.id === listing.host.id
                  }
                  onClick={handleFormSubmit}
                  className={`w-full pt-7 pb-7 text-lg font-extralight ${
                    bookingLoading || !!nitError || !!nameError
                      ? 'cursor-not-allowed'
                      : ''
                  }`}
                />
              </div>
            </>
          ) : (
            <div className="space-y-8">
              <img
                src="/images/verify-identity/dni.webp"
                alt="DNI Verification"
                className="h-auto w-40"
              />
              <div className="inline-flex flex-col items-start justify-start gap-6 self-stretch">
                <div className="text-2xl leading-loose font-medium">
                  {t.booking.verify.title}
                </div>
                <div className="text-sm leading-tight font-normal">
                  {t.booking.verify.description}
                </div>
              </div>
              <button
                className="btn btn-primary flex items-center gap-2 rounded-full"
                onClick={openIdvModal}
              >
                {t.booking.verify.button} <ShieldCheckIcon />
              </button>
            </div>
          )}
        </div>
      </div>

      <ShowVerifyIdentityModal
        isOpen={showIdvModal}
        onClose={closeIdvModal}
        onFinished={handleIdvFinished}
        lang={lang}
      />

      {reservationPayment && (
        <ModalNotAvailabilityPayment
          open={isNotAvailabilityPayment}
          onClose={() => setIsNotAvailabilityPayment(false)}
          lang={lang}
          tripId={reservationPayment.tripId}
        />
      )}
    </div>
  );
}

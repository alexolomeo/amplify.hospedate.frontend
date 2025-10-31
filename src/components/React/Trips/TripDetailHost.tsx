import React, { useState } from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import { TripDetailsCases } from '@/types/tripDetail';
import type { TripDetail } from '@/types/tripDetail';
//import StarIcon from '/src/icons/star-line.svg?react';
import ChevronRight from '/src/icons/chevron-right.svg?react';
import CalendarIcon from '/src/icons/calendar-outline.svg?react';
import OptimizedImage from '@/components/React/Common/OptimizedImage';
import SharedReviewModal from './SharedReviewModal';
import { navigate } from 'astro/virtual-modules/transitions-router.js';
import { formatDateRangeWithYear } from '@/utils/dateUtils';
import ModalApproveRequest from './Modals/ModalApproveRequest';
import ModalRejectRequest from './Modals/ModalRejectRequest';
import { patchTripRequest } from '@/services/host/trip';

interface TripDetailHostProps {
  tripDetail: TripDetail;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
  status: { case: TripDetailsCases | undefined };
  isHost?: boolean;
  handlePayment?: () => void;
  fetchTripDetail?: () => void;
}

const TripDetailHost: React.FC<TripDetailHostProps> = ({
  tripDetail,
  t,
  status,
  lang,
  isHost = false,
  handlePayment,
  fetchTripDetail,
}) => {
  const info = isHost ? tripDetail.guest : tripDetail.host;

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showApproveRequestModal, setShowApproveRequestModal] = useState(false);
  const [showRejectRequestModal, setShowRejectRequestModal] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [errorApprove, setErrorApprove] = useState<string | null>(null);
  const [errorReject, setErrorReject] = useState<string | null>(null);
  const [approveSuccess, setApproveSuccess] = useState(false);

  /* const handleLeaveReview = () => {
    setShowReviewModal(true);
  }; */

  const handleSubmitReview = (payload: {
    text: string;
    ratings: Record<string, number>;
  }) => {
    // Represent sending data to backend: log payload and switch view inside shared modal
    console.log('submit review', payload);
  };

  const handleRevisit = () => {
    navigate(`/listing/${tripDetail.listing.id}`);
  };

  const handleRequest = async (payload: { isConfirmed: boolean }) => {
    if (payload && payload.isConfirmed !== null) {
      if (payload.isConfirmed) {
        setLoadingApprove(true);
        setErrorApprove(null);
        const result = await patchTripRequest(
          tripDetail.id.toString(),
          payload
        );
        if (result) {
          setApproveSuccess(true);
        } else {
          setErrorApprove(t.tripDetail.modal.approveRequestError);
        }
        setLoadingApprove(false);
      } else {
        setLoadingReject(true);
        setErrorReject(null);
        const result = await patchTripRequest(
          tripDetail.id.toString(),
          payload
        );
        if (result) {
          setShowRejectRequestModal(false);
          fetchTripDetail?.();
          navigate('/hosting');
        } else {
          setErrorReject(t.tripDetail.modal.rejectRequestError);
        }
        setLoadingReject(false);
      }
    }
  };

  const handleSuccessRequest = () => {
    setShowApproveRequestModal(false);
    navigate('/hosting');
  };

  const handleCloseApproveModal = () => {
    setShowApproveRequestModal(false);
    setErrorApprove(null);
    setTimeout(() => setApproveSuccess(false), 300);
    if (approveSuccess) {
      fetchTripDetail?.();
    }
  };

  /* const hostReview =
    status.case === TripDetailsCases.LEAVE_REVIEW && isHost;
  const guestReview =
    status.case === TripDetailsCases.LEAVE_REVIEW && !isHost; */
  const requireApproval =
    status.case === TripDetailsCases.PENDING_APPROVAL && isHost;
  const revisitExperience = status.case === undefined && !isHost;
  const requirePayment =
    status.case === TripDetailsCases.PENDING_PAYMENT && !isHost;

  return (
    <>
      <section className="flex flex-col gap-6 px-4 sm:px-0 md:flex-row md:flex-wrap md:justify-between">
        {/* Host Info Header */}
        {isHost ? (
          <div className="flex items-start gap-3 pt-2">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 sm:h-12 sm:w-12">
              <OptimizedImage
                src={
                  info.profilePicture?.original || '/images/user_profile.webp'
                }
                alt={info.username}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate p-0 text-sm sm:text-base">
                {info.username}
              </p>
              <p className="m-0 truncate p-0 text-sm font-bold sm:text-base">
                {formatDateRangeWithYear(
                  tripDetail.booking.checkInDate,
                  tripDetail.booking.checkoutDate,
                  lang
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 pt-2">
            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200 sm:h-12 sm:w-12">
              <OptimizedImage
                src={
                  info.profilePicture?.original || '/images/user_profile.webp'
                }
                alt={info.username}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-neutral text-xs sm:text-sm">
                {translate(t, 'tripDetail.host.hostedBy')}
              </p>
              <h3 className="text-primary truncate text-base font-bold sm:text-lg">
                {info.username}
              </h3>
            </div>
          </div>
        )}
        {/* Payment request from Guest */}
        {requirePayment && (
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
              onClick={() => handlePayment?.()}
              disabled={!handlePayment}
              aria-disabled={!handlePayment}
              className="bg-primary text-base-100 flex h-10 w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-full px-4 shadow-sm sm:h-12 sm:w-auto"
            >
              <div className="text-center text-xs leading-4 font-semibold sm:text-sm">
                {t.tripDetail.paymentRequest.goToPayment}
              </div>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        )}
        {/* Experience Section Guest */}
        {/* {guestReview && (
          <div className="bg-base-200/30 flex flex-col items-start justify-start gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:rounded-[30.4px] sm:p-5">
            <div className="flex flex-1 flex-col gap-1">
              <div className="text-base-content text-left text-sm leading-5 font-bold sm:text-base sm:leading-6">
                {t.tripDetail.experience.leaveReview.title}
              </div>
              <div className="text-base-content text-left text-xs leading-4 font-normal sm:text-sm sm:leading-5">
                {t.tripDetail.experience.leaveReview.subtitle}
              </div>
            </div>
            <button
              onClick={handleLeaveReview}
              className="bg-accent flex h-10 w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-full px-4 shadow-sm sm:h-12 sm:w-auto"
            >
              <div className="text-center text-xs leading-4 font-semibold sm:text-sm">
                {t.tripDetail.experience.leaveReview.button}
              </div>
              <StarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        )} */}
        {/* Experience Section Host*/}
        {/* {hostReview && (
          <div className="flex max-w-md flex-1 flex-col items-start justify-start gap-2 rounded-2xl p-2 sm:items-center sm:rounded-sm">

            <button className="bg-accent flex h-10 w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-full px-4 shadow-sm sm:h-12">
              <span className="text-center text-xs leading-4 font-semibold whitespace-nowrap sm:text-sm">
                {t.tripDetail.experience.leaveReview.qualifyGuest}
              </span>
              <StarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>

            <button className="text-secondary flex h-10 cursor-pointer items-center justify-center rounded-full px-4 py-0 text-xs font-semibold sm:h-12 sm:text-sm">
              {t.tripDetail.experience.leaveReview.requestQualify}
            </button>
          </div>
        )} */}
        {/* Request Approval Host*/}
        {requireApproval && (
          <div className="flex max-w-md flex-1 flex-col items-start justify-start gap-2 rounded-2xl p-2 sm:items-center sm:rounded-sm">
            {/* First button */}
            <button
              onClick={() => setShowApproveRequestModal(true)}
              className="bg-primary flex h-10 w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-full px-4 shadow-sm sm:h-12"
            >
              <span className="text-primary-content text-center text-xs font-semibold whitespace-nowrap sm:text-sm">
                {t.tripDetail.actions.approveRequest}
              </span>
            </button>

            {/* Second button */}
            <button
              onClick={() => setShowRejectRequestModal(true)}
              className="text-primary flex h-10 cursor-pointer items-center justify-center rounded-full px-4 py-0 text-xs font-semibold underline sm:h-12 sm:text-sm"
            >
              {t.tripDetail.actions.rejectRequest}
            </button>
          </div>
        )}
        {revisitExperience && (
          <div className="bg-base-200/30 flex flex-col items-start justify-start gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:rounded-[30.4px] sm:p-5">
            <div className="flex flex-1 flex-col gap-1">
              <div className="text-base-content text-left text-sm leading-5 font-bold sm:text-base sm:leading-6">
                {t.tripDetail.experience.revisit.title}
              </div>
              <div className="text-base-content text-left text-xs leading-4 font-normal sm:text-sm sm:leading-5">
                {t.tripDetail.experience.revisit.subtitle}
              </div>
            </div>
            <button
              onClick={handleRevisit}
              className="bg-primary text-base-100 flex h-10 w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-full px-4 shadow-sm sm:h-12 sm:w-auto"
            >
              <div className="text-center text-xs leading-4 font-semibold sm:text-sm">
                {t.tripDetail.experience.revisit.button}
              </div>
              <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        )}
      </section>
      {/* Trip review modal */}
      <SharedReviewModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        hostName={info.username}
        imageSrc={info.profilePicture?.original || '/images/user_profile.webp'}
        t={t}
        lang={lang}
        onSubmit={(payload) => handleSubmitReview(payload)}
      />

      {/* Approve request modal */}

      <ModalApproveRequest
        open={showApproveRequestModal}
        onClose={handleCloseApproveModal}
        onSuccess={handleSuccessRequest}
        onSubmit={handleRequest}
        t={t}
        lang={lang}
        loading={loadingApprove}
        error={errorApprove}
        success={approveSuccess}
      />

      {/* Reject request modal */}

      <ModalRejectRequest
        open={showRejectRequestModal}
        onClose={() => setShowRejectRequestModal(false)}
        onSubmit={handleRequest}
        t={t}
        lang={lang}
        loading={loadingReject}
        error={errorReject}
      />
    </>
  );
};

export default TripDetailHost;

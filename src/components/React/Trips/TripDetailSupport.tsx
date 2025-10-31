import React from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import type { TripDetail } from '@/types/tripDetail';
import { TripDetailsCases } from '@/types/tripDetail';
import EnvelopeIcon from '/src/icons/envelope.svg?react';
// import ExclamationTriangleIcon from '/src/icons/exclamation-triangle.svg?react';
// import FlagIcon from '/src/icons/flag.svg?react';
import ChevronRightIcon from '/src/icons/chevron-right-mini.svg?react';

interface TripDetailSupportProps {
  tripDetail: TripDetail;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
  status: { case: TripDetailsCases | undefined };
  isHost?: boolean;
  isConversationCard?: boolean;
}

const TripDetailSupport: React.FC<TripDetailSupportProps> = ({
  t,
  isHost = false,
  status,
  isConversationCard,
}) => {
  const emailUser = isHost
    ? 'tripDetail.support.emailGuest'
    : 'tripDetail.support.emailHost';
  // const reportUser = isHost
  //   ? 'tripDetail.support.reportGuest'
  //   : 'tripDetail.support.reportHost';

  const supportOptions = [
    { id: 1, icon: EnvelopeIcon, label: translate(t, emailUser) },
    // {
    //   id: 2,
    //   icon: ExclamationTriangleIcon,
    //   label: translate(t, 'tripDetail.support.cancelReservation'),
    // },
    // { id: 3, icon: FlagIcon, label: translate(t, reportUser) },
    // {
    //   id: 4,
    //   icon: FlagIcon,
    //   label: translate(t, 'tripDetail.support.reportProblem'),
    // },
  ];

  let allowed: number[] = [];
  if (!isHost) {
    switch (status.case) {
      case TripDetailsCases.PENDING_APPROVAL:
      case TripDetailsCases.CHECKING_IN_TODAY:
      case TripDetailsCases.CHECKING_IN_DAYS:
      case TripDetailsCases.CHECKED_IN_NOW:
      case TripDetailsCases.CHECKING_OUT_TODAY:
        // allowed = [1, 2, 3, 4];
        allowed = [1];
        break;
      case TripDetailsCases.CANCELLED:
      case TripDetailsCases.REJECTED:
        // allowed = [1, 3];
        allowed = [1];
        break;
      case TripDetailsCases.LEAVE_REVIEW:
      default:
        allowed = [];
        break;
    }
  } else {
    switch (status.case) {
      case TripDetailsCases.PENDING_APPROVAL:
      case TripDetailsCases.PENDING_PAYMENT:
        // allowed = [1, 3];
        allowed = [1];
        break;
      case TripDetailsCases.CHECKING_IN_TODAY:
      case TripDetailsCases.CHECKING_IN_DAYS:
      case TripDetailsCases.CHECKED_IN_NOW:
      case TripDetailsCases.CHECKING_OUT_TODAY:
      case TripDetailsCases.LEAVE_REVIEW:
        // allowed = [1, 2, 3];
        allowed = [1];
        break;
      case TripDetailsCases.CANCELLED:
      case TripDetailsCases.REJECTED:
        // allowed = [3];
        allowed = [];
        break;
      default:
        allowed = [];
        break;
    }
  }

  const visibleOptions = supportOptions.filter((opt) =>
    allowed.includes(opt.id)
  );

  return (
    visibleOptions.length > 0 && (
      <section className="flex flex-col gap-6">
        <h3
          className={`text-base-content ${isConversationCard ? 'text-lg sm:text-xl' : 'text-base'} font-bold`}
        >
          {translate(t, 'tripDetail.support.title')}
        </h3>

        <div className="flex flex-col gap-2">
          {visibleOptions.map((option, index) => (
            <div key={index} className="flex h-9 items-center gap-3">
              <option.icon className="text-secondary h-6 w-6" />
              <span className="text-base-content flex-1 text-sm">
                {option.label}
              </span>
              <ChevronRightIcon className="text-base-content h-4 w-4 cursor-pointer opacity-40" />
            </div>
          ))}
        </div>
      </section>
    )
  );
};

export default TripDetailSupport;

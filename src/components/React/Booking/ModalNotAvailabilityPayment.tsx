import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { AppModal } from '../Common/AppModal';
import Calendar from '/src/icons/calendar-outline.svg?react';
import Clock from '/src/icons/clock.svg?react';

interface Props {
  open: boolean;
  onClose: () => void;
  lang?: SupportedLanguages;
  tripId: string;
}

export default function ModalNotAvailabilityPayment({
  lang = 'es',
  open,
  onClose,
  tripId,
}: Props) {
  const t = getTranslation(lang);
  return (
    <AppModal
      id="modal-availability-payment"
      showHeader={false}
      title={'Modal'}
      maxWidth={'max-w-md'}
      maxHeight={'max-h-[95vh]'}
      maxHeightBody={'max-h-[70vh]'}
      bgColor={'bg-primary-content'}
      isOpen={open}
      onClose={onClose}
      titleSize="text-lg leading-tight self-stretch"
    >
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t.booking.policy.pendingTitle}</h1>
        <div className="flex items-start gap-4 py-4">
          <div className="relative h-16 w-16 shrink-0">
            <Calendar className="text-primary absolute inset-0 h-16 w-16" />
            <span className="bg-base-100 absolute -right-1 -bottom-1 grid h-8 w-8 place-items-center rounded-full">
              <Clock className="text-secondary h-10 w-10" />
            </span>
          </div>
          <ul className="flex flex-1 list-disc flex-col px-6">
            <li className="text-sm leading-6">
              {t.booking.policy.notification}
            </li>
            <li className="text-sm leading-6">
              {t.booking.policy.hostAcceptance}
            </li>
            <li className="text-sm leading-6">{t.booking.policy.payment}</li>
          </ul>
        </div>
        <div className="flex justify-end">
          <a
            href={`/users/trips/${tripId}`}
            className="btn btn-primary h-14 cursor-pointer rounded-full text-base font-bold"
          >
            {t.booking.policy.goToReservation}
          </a>
        </div>
      </div>
    </AppModal>
  );
}

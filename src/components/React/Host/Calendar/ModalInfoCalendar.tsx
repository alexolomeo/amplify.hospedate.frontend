import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import Modal from '@/components/React/Common/Modal';

interface Props {
  isOpen: boolean;
  close: () => void;
  lang?: SupportedLanguages;
}
const ModalInfoCalendar: React.FC<Props> = ({ lang = 'es', isOpen, close }) => {
  const t = getTranslation(lang);
  const infotext = t.hostContent.calendar.info;
  const data = [
    {
      title: infotext.today.title,
      description: infotext.today.description,
      image: '/images/calendar/today.webp',
    },
    {
      title: infotext.selectCells.title,
      description: infotext.selectCells.description,
      image: '/images/calendar/selectCells.webp',
    },
    {
      title: infotext.scheduledDays.title,
      description: infotext.scheduledDays.description,
      image: '/images/calendar/scheduledDays.webp',
    },
    {
      title: infotext.preparationDays.title,
      description: infotext.preparationDays.description,
      image: '/images/calendar/preparationDays.webp',
    },
    {
      title: infotext.externalPlatformBookings.title,
      description: infotext.externalPlatformBookings.description,
      image: '/images/calendar/externalPlatform.webp',
    },
    {
      title: infotext.blockedDays.title,
      description: infotext.blockedDays.description,
      image: '/images/calendar/blockedDays.webp',
    },
  ];

  return (
    <Modal
      open={isOpen}
      title={infotext.title}
      titleClass="text-lg font-semibold "
      onClose={() => close()}
      footer={
        <div className="flex w-full justify-end">
          <button
            onClick={close}
            className="btn btn-primary w-full rounded-full text-sm font-medium"
          >
            {infotext.closeInfo}
          </button>
        </div>
      }
      topLeftButton={false}
      lang={lang}
      widthClass="max-w-lg"
      heightClass="max-h-[90vh]"
      showCancelButton={false}
    >
      <div className="flex flex-col items-center justify-start gap-10 self-stretch">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex w-full flex-col items-start justify-start gap-3"
          >
            <div className="justify-center text-sm leading-none font-bold">
              {item.title}
            </div>

            <div className="inline-flex items-start justify-start gap-4 self-stretch">
              <div className="relative h-24 w-24 overflow-hidden">
                <img
                  className="absolute top-0 left-0 h-24 w-24"
                  src={item.image}
                  alt={item.title}
                />
              </div>

              <div className="inline-flex flex-1 flex-col items-start justify-start gap-2.5 overflow-hidden">
                <div className="text-neutral justify-center text-sm leading-tight font-normal">
                  {item.description}
                </div>
              </div>
            </div>
            <div className="outline-base-200 h-0 self-stretch outline"></div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
export default ModalInfoCalendar;

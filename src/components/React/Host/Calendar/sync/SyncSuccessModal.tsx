import AppButton from '@/components/React/Common/AppButton';
import { AppModal } from '@/components/React/Common/AppModal';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';

interface Props {
  isOpen: boolean;
  close: () => void;
  lang?: SupportedLanguages;
  name: string;
}
const SyncSuccessModal: React.FC<Props> = ({
  lang = 'es',
  isOpen,
  close,
  name,
}) => {
  const t = getTranslation(lang);
  const syncText = t.hostContent.calendar.sync;
  return (
    <AppModal
      id="modal-sync-success"
      showHeader={true}
      title={syncText.syncFinishedTitle}
      maxWidth={'max-w-sm'}
      maxHeight={'max-h-[95vh]'}
      maxHeightBody={'max-h-[70vh]'}
      bgColor={'bg-primary-content'}
      isOpen={isOpen}
      onClose={close}
      titleSize="text-lg leading-tight self-stretch"
    >
      <div className="space-y-6">
        <div className="flex justify-center">
          <img
            src="/images/calendar.webp"
            alt="step2"
            className="h-32 w-32 object-cover"
          />
        </div>
        <p>
          {syncText.syncFinishedDescription}
          {name}
        </p>
        <div className="p-1">
          <AppButton
            label={syncText.backToMyCalendarButton}
            className="h-[48px] w-full"
            size="md"
            onClick={close}
            fontSemibold={true}
          />
        </div>
      </div>
    </AppModal>
  );
};
export default SyncSuccessModal;

import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import AppButton from '@/components/React/Common/AppButton';

interface Props {
  lang?: SupportedLanguages;
  title?: string;
  canSave: boolean;
  saving: boolean;
  onSave: () => Promise<'ok' | 'error' | 'cancel'>;
  saveLabelOverride?: string;
}

export default function EditListingFooter({
  lang = 'es',
  title,
  canSave,
  saving,
  onSave,
  saveLabelOverride,
}: Props) {
  const t = getTranslation(lang);

  const disabled = !canSave || saving;
  const defaultLabel = t.hostContent.editListing.footer.save;
  const label = saving
    ? t.hostContent.editListing.footer.saving
    : (saveLabelOverride ?? defaultLabel);

  return (
    <div className="border-base-200 bg-base-100 flex items-center justify-between border-t px-[clamp(1rem,8vw,143px)] py-4">
      <span className="text-base-content text-xl font-semibold">
        {title ?? t.hostContent.editListing.footer.title}{' '}
      </span>

      <AppButton
        label={label}
        type="button"
        variant="default"
        size="sm"
        rounded
        fontSemibold
        className="h-12 w-[122px] px-4 text-sm leading-[14px] shadow-sm"
        onClick={onSave}
        disabled={disabled}
        aria-disabled={disabled}
        aria-busy={saving}
      />
    </div>
  );
}

import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
interface Props {
  lang?: SupportedLanguages;
}
export default function NoContent({ lang = 'es' }: Props) {
  const t = getTranslation(lang);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
      <img
        src="/images/edit-listing/select-step.webp"
        alt="select-step"
        className="h-[204px] w-[168px] object-contain"
      />

      <p className="text-neutral text-sm leading-5 font-normal whitespace-pre-line">
        {t.hostContent.editListing.content.noContentText}
      </p>
    </div>
  );
}

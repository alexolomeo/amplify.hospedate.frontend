import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
interface Props {
  lang?: SupportedLanguages;
}
export default function LocalLegislation({ lang = 'es' }: Props) {
  const t = getTranslation(lang);

  return (
    <div className="space-y-8">
      <h1 className="edit-listing-title">
        {t.hostContent.editListing.content.localLegislation.title}
      </h1>
      <ul className="list-outside list-decimal px-4 text-sm font-normal">
        <li>{t.hostContent.editListing.content.localLegislation.point1}</li>
        <li>{t.hostContent.editListing.content.localLegislation.point2}</li>
        <li>{t.hostContent.editListing.content.localLegislation.point3}</li>
        <li>{t.hostContent.editListing.content.localLegislation.point4}</li>
      </ul>
      <p className="text-neutral text-sm leading-tight font-normal">
        {t.hostContent.editListing.content.localLegislation.disclaimer}
      </p>
    </div>
  );
}

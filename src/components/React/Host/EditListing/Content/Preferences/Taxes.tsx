import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
interface Props {
  lang?: SupportedLanguages;
}
export default function Taxes({ lang = 'es' }: Props) {
  const t = getTranslation(lang);

  return (
    <div className="space-y-8">
      <h1 className="edit-listing-title">
        {t.hostContent.editListing.content.taxes.title}
      </h1>
      <div className="text-neutral space-y-4 text-sm">
        <div>
          <span className="font-bold">
            {t.hostContent.editListing.content.taxes.introQuestion}
          </span>{' '}
          <br />
          {t.hostContent.editListing.content.taxes.introText} <br />
          {t.hostContent.editListing.content.taxes.nationalTaxesTitle}
          <ul className="list-outside list-decimal px-4">
            <li>
              {t.hostContent.editListing.content.taxes.iva.title} <br />{' '}
              {t.hostContent.editListing.content.taxes.iva.description}{' '}
            </li>
            <li>
              {t.hostContent.editListing.content.taxes.it.title} <br />{' '}
              {t.hostContent.editListing.content.taxes.it.description}{' '}
            </li>
            <li>
              {t.hostContent.editListing.content.taxes.iue.title} <br />{' '}
              {t.hostContent.editListing.content.taxes.iue.description}{' '}
            </li>
          </ul>
        </div>
        <div>
          <span className="font-bold">
            {t.hostContent.editListing.content.taxes.municipalTaxesTitle}
          </span>{' '}
          <ul className="list-outside list-decimal px-4">
            <li>
              {t.hostContent.editListing.content.taxes.iaem.title} <br />{' '}
              {t.hostContent.editListing.content.taxes.iaem.description}{' '}
            </li>
            <li>
              {t.hostContent.editListing.content.taxes.ipbi.title} <br />{' '}
              {t.hostContent.editListing.content.taxes.ipbi.description}{' '}
            </li>
          </ul>
        </div>
        <div>
          <span className="font-bold">
            {t.hostContent.editListing.content.taxes.whoPaysTitle}
          </span>
          <br />
          {t.hostContent.editListing.content.taxes.whoPaysDescription} <br />
        </div>
        <div>
          <span className="font-bold">
            {t.hostContent.editListing.content.taxes.taxComplianceTitle}
          </span>
          <br />
          {t.hostContent.editListing.content.taxes.taxComplianceDescription}
          <br />
          {t.hostContent.editListing.content.taxes.summary}
        </div>
      </div>
    </div>
  );
}

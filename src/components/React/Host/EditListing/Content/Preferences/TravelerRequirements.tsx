import ToggleSwitch from '@/components/React/Common/ToggleSwitch';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
interface Props {
  lang?: SupportedLanguages;
}
export default function TravelerRequirements({ lang = 'es' }: Props) {
  const t = getTranslation(lang);
  return (
    <div className="space-y-8">
      <h1 className="edit-listing-title">
        {t.hostContent.editListing.content.travelerRequirements.title}
      </h1>
      <ToggleSwitch
        title={
          t.hostContent.editListing.content.travelerRequirements
            .requestProfilePhoto.label
        }
        description={
          t.hostContent.editListing.content.travelerRequirements
            .requestProfilePhoto.description
        }
        checked={true}
        onChange={() => {}}
        titleClassName="text-base font-bold leading-normal pb-2"
        descriptionClassName="text-neutral text-sm leading-tight font-normal"
      />
      <div className="border-base-200 border-b"></div>
      <p className="text-base font-bold">
        {t.hostContent.editListing.content.travelerRequirements.allGuestsMust}
      </p>
      <ul className="text-neutral list-outside list-disc px-4 text-sm font-normal">
        <li>
          {t.hostContent.editListing.content.travelerRequirements.requirement1}
        </li>
        <li>
          {t.hostContent.editListing.content.travelerRequirements.requirement2}
        </li>
        <li>
          {t.hostContent.editListing.content.travelerRequirements.requirement3}
        </li>
      </ul>
    </div>
  );
}

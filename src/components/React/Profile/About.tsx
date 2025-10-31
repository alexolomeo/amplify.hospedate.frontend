import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import MapPin from '/src/icons/map-pin.svg?react';
import AppIcon from '../Common/AppIcon';
import type { Language, User } from '@/types/user';
import LanguageIcon from '/src/icons/language.svg?react';
import BirthDecadeIcon from '/src/icons/about-user/birth-decade.svg?react';

interface Props {
  lang?: SupportedLanguages;
  user: User;
  isOwnProfile?: boolean;
  spokenLanguages?: Language[];
  isModoEdit?: boolean;
  showBirthDecade?: boolean;
}
const About: React.FC<Props> = ({
  lang = 'es',
  user,
  isOwnProfile = false,
  spokenLanguages = [],
  isModoEdit = false,
  showBirthDecade = false,
}) => {
  const t = getTranslation(lang);
  const infoEntries = Object.entries(user.info || {})
    .filter(
      ([key, value]) =>
        value &&
        !['about', 'languages', 'showBirthDecade', 'birthDecade'].includes(key)
    )
    .map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(', ') : value,
    ]);

  const location = [user?.country, user?.state, user?.city]
    .filter(Boolean)
    .join(', ');

  const hasExperiences =
    infoEntries.length > 0 ||
    location ||
    spokenLanguages.length > 0 ||
    showBirthDecade;
  return (
    <>
      {(hasExperiences || isModoEdit) && (
        <p className="pt-7 text-xl leading-7 font-bold">
          {isOwnProfile
            ? t.profile.experiencesOwn
            : translate(t, 'profile.experiencesOther', {
                username: user.username,
              })}
        </p>
      )}
      {hasExperiences && (
        <div className="space-y-5 py-7">
          <ul className="grid space-y-2 text-sm font-normal lg:grid-cols-2">
            {spokenLanguages.length > 0 && (
              <li className="flex gap-x-2 py-1">
                <LanguageIcon className="text-secondary h-5 w-5" />
                {t.listingDetail.host.info.languages}:{' '}
                {spokenLanguages.map((lang) => lang.name).join(', ')}
              </li>
            )}
            {location && (
              <li className="flex gap-x-2 py-1">
                <MapPin className="text-secondary h-5 w-5" />
                {t.listingDetail.host.livesIn} :{location}
              </li>
            )}
            {user.info && showBirthDecade && (
              <li className="flex gap-x-2 py-1">
                <BirthDecadeIcon className="text-secondary h-5 w-5" />
                {t.listingDetail.host.info.birthDecade}:{' '}
                {user.info.birthDecade === 0 ? '00' : user.info.birthDecade}
              </li>
            )}
            {infoEntries.map(([key, value]) => {
              const iconKey = String(key)
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                .toLowerCase();
              return (
                <li key={key} className="flex gap-x-2 py-1">
                  <AppIcon
                    iconName={iconKey}
                    folder="about-user"
                    className="text-secondary h-5 w-5"
                    loaderCompact={true}
                  />
                  {t.listingDetail.host.info[
                    key as keyof typeof t.listingDetail.host.info
                  ] ?? key}
                  : {value}
                </li>
              );
            })}
            {!isOwnProfile && user.identityVerified && (
              <li className="flex gap-x-2 py-1">
                <AppIcon
                  iconName="verified"
                  folder="about-user"
                  className="text-secondary h-5 w-5"
                  loaderCompact={true}
                />
                {t.profile.identityVerified}{' '}
              </li>
            )}
            {!isOwnProfile && user.emailVerified && (
              <li className="flex gap-x-2 py-1">
                <AppIcon
                  iconName="identity-verified"
                  folder="about-user"
                  className="text-secondary h-5 w-5"
                  loaderCompact={true}
                />
                {t.profile.emailVerified}{' '}
              </li>
            )}
            {!isOwnProfile && user.phoneVerified && (
              <li className="flex gap-x-2 py-1">
                <AppIcon
                  iconName="verified"
                  folder="about-user"
                  className="text-secondary h-5 w-5"
                  loaderCompact={true}
                />
                {t.profile.phoneVerified}{' '}
              </li>
            )}
          </ul>
        </div>
      )}

      {!hasExperiences && isModoEdit && (
        <div className="space-y-5 py-7">
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-500">
              {isOwnProfile
                ? t.profile.experiencesPlaceholder
                : t.profile.experiencesEmpty}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default About;

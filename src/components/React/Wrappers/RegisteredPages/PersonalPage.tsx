import SettingsPanel from '@/components/React/Personal/SettingsPanel';
import ChevronLeftIcon from '/src/icons/chevron-left.svg?react';
import ChevronRightIcon from '/src/icons/chevron-right.svg?react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { navigate } from 'astro/virtual-modules/transitions-router.js';

interface PersonalPageProps {
  lang: SupportedLanguages;
}

const PersonalPage: React.FC<PersonalPageProps> = ({ lang }) => {
  const t = getTranslation(lang);
  return (
    <div className="flex flex-col gap-4 bg-white px-4 pt-8 pb-24 sm:px-6 sm:pt-10 md:px-12 md:pt-12 xl:px-[140px]">
      {/* Back button */}
      <div
        className="flex h-8 w-8 cursor-pointer items-center justify-start p-0"
        onClick={() => navigate('/users/account')}
      >
        <ChevronLeftIcon />
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-2 md:min-w-sm">
          {/* Title */}
          <div className="flex items-center text-xl leading-8 font-bold sm:text-2xl">
            {t.users.personalInfoTitle}
          </div>

          {/* Breadcrumbs */}
          <div className="flex flex-row items-center gap-2">
            <div className="flex h-9 flex-row items-center gap-1.5">
              <div className="text-sm leading-5 font-normal">
                {t.users.personalInfoBreadcrumbAccount}
              </div>
              <ChevronRightIcon className="text-gray-400" />
            </div>

            <div className="flex h-9 flex-row items-center gap-1.5">
              <div className="text-sm leading-5 font-normal">
                {t.users.personalInfoBreadcrumbCurrent}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:max-w-lg xl:max-w-2xl">
          <SettingsPanel lang={lang} />
        </div>
      </div>
    </div>
  );
};

export default PersonalPage;

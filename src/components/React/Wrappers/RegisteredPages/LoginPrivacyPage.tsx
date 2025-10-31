import LoginPrivacyPanel from '@/components/React/LoginPrivacy/LoginPrivacyPanel';
import ChevronLeftIcon from '/src/icons/chevron-left.svg?react';
import ChevronRightIcon from '/src/icons/chevron-right.svg?react';
import type { SupportedLanguages, translate } from '@/utils/i18n';
import { navigate } from 'astro/virtual-modules/transitions-router.js';

interface LoginPrivacyPageProps {
  lang: SupportedLanguages;
  t: ReturnType<typeof translate>;
}

const LoginPrivacyPage: React.FC<LoginPrivacyPageProps> = ({ lang, t }) => {
  return (
    <div className="flex flex-col gap-4 bg-white px-4 pt-8 pb-24 sm:px-6 sm:pt-10 md:px-12 md:pt-12 xl:px-[140px]">
      {/* Back button */}
      <div
        className="flex h-8 w-8 cursor-pointer items-center justify-start p-0"
        onClick={() => {
          navigate('/hosting/account');
        }}
      >
        <ChevronLeftIcon />
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-2 md:min-w-sm">
          {/* Title */}
          <div className="flex items-center text-xl leading-8 font-bold sm:text-2xl">
            {t.users.loginAndPrivacyTitle}
          </div>

          {/* Breadcrumbs */}
          <div className="flex flex-row items-center gap-2">
            <div className="flex h-9 flex-row items-center gap-1.5">
              <div className="text-sm leading-5 font-normal">
                {t.users.loginAndPrivacyBreadcrumbAccount}
              </div>
              <ChevronRightIcon className="text-gray-400" />
            </div>

            <div className="flex h-9 flex-row items-center gap-1.5">
              <div className="text-sm leading-5 font-normal">
                {t.users.loginAndPrivacyBreadcrumbCurrent}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:max-w-lg xl:max-w-2xl">
          <LoginPrivacyPanel lang={lang} />
        </div>
      </div>
    </div>
  );
};

export default LoginPrivacyPage;

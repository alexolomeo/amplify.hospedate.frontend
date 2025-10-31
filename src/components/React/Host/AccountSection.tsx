import { useStore } from '@nanostores/react';
import { $userStore } from '@/stores/userStore';
import IdentificationIcon from '/src/icons/identification.svg?react';
//import UserCircleOutlineIcon from '/src/icons/user-circle-outline.svg?react';
import NewspaperIcon from '/src/icons/newspaper.svg?react';
// import InboxStackIcon from '/src/icons/inbox-stack.svg?react';
import ChevronRightMiniIcon from '/src/icons/chevron-right-mini.svg?react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { navigate } from 'astro:transitions/client';

interface Props {
  lang: SupportedLanguages;
}

export default function AccountSection({ lang }: Props) {
  const user = useStore($userStore);
  const t = getTranslation(lang);

  if (!user) return null;

  return (
    <section className="flex w-full flex-col px-4 pt-0 pb-10 md:px-12 xl:px-44">
      <div className="flex w-full flex-col items-start gap-6 py-10 md:flex-row md:items-end">
        <div className="flex flex-1 flex-col items-start gap-1">
          <p className="text-base-content w-full text-lg leading-7 font-bold">
            {t.hostContent.account.title}
          </p>
          <h1 className="text-primary w-full text-3xl leading-9 font-bold">
            {t.hostContent.account.greeting.replace('{name}', user.firstName)}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-base-content text-sm">{user.email}</p>
          <a
            href="/users/profile"
            className="text-secondary border-secondary hover:bg-secondary flex items-center gap-2 rounded-full border p-3 text-sm font-bold hover:text-white"
          >
            <p>{t.hostContent.account.goToProfile}</p>
            <ChevronRightMiniIcon className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="flex w-full flex-wrap content-start items-start gap-10">
        <button
          onClick={() => {
            // Navigate to personal info
            navigate('/users/personal');
          }}
          className="border-base-200 bg-base-100 flex h-[212px] w-full cursor-pointer flex-col items-start gap-4 rounded-xl border p-10 text-left transition-colors hover:bg-[var(--color-base-200-hover)] md:w-[calc(50%-20px)] xl:w-[calc(25%-30px)]"
        >
          <IdentificationIcon className="h-8 w-8" />
          <div className="flex w-full flex-col gap-1">
            <h2 className="text-base-content text-base leading-6 font-normal">
              {t.hostContent.account.personalInfoTitle}
            </h2>
            <p className="text-neutral text-xs leading-4 font-normal">
              {t.hostContent.account.personalInfoDesc}
            </p>
          </div>
        </button>
        {/* TODO: Uncomment this section once all the functionality is implemented */}
        {/* <button
          onClick={() => {
            // Navigate to login and privacy settings
            navigate('/users/login-privacy');
          }}
          className="border-base-200 bg-base-100 flex h-[212px] w-full cursor-pointer flex-col items-start gap-4 rounded-xl border p-10 text-left transition-colors hover:bg-[var(--color-base-200-hover)] md:w-[calc(50%-20px)] xl:w-[calc(25%-30px)]"
        >
          <UserCircleOutlineIcon className="h-8 w-8" />
          <div className="flex w-full flex-col gap-1">
            <h2 className="text-base-content text-base leading-6 font-normal">
              {t.hostContent.account.securityTitle}
            </h2>
            <p className="text-neutral text-xs leading-4 font-normal">
              {t.hostContent.account.securityDesc}
            </p>
          </div>
        </button> */}
        {/* TODO: Uncomment this section once the functionality is implemented */}
        <button
          onClick={() => {
            navigate('/users/earnings');
          }}
          className="border-base-200 bg-base-100 flex h-[212px] w-full cursor-pointer flex-col items-start gap-4 rounded-xl border p-10 text-left transition-colors hover:bg-[var(--color-base-200-hover)] md:w-[calc(50%-20px)] xl:w-[calc(25%-30px)]"
        >
          <NewspaperIcon className="h-8 w-8" />
          <div className="flex w-full flex-col gap-1">
            <h2 className="text-base-content text-base leading-6 font-normal">
              {t.hostContent.account.paymentsTitle}
            </h2>
            <p className="text-neutral text-xs leading-4 font-normal">
              {t.hostContent.account.paymentsDesc}
            </p>
          </div>
        </button>
        {/* <button
          onClick={() => {
            // Navigate to Taxes
          }}
          className="border-base-200 bg-base-100 flex h-[212px] w-full cursor-pointer flex-col items-start gap-4 rounded-xl border p-10 text-left transition-colors hover:bg-[var(--color-base-200-hover)] md:w-[calc(50%-20px)] xl:w-[calc(25%-30px)]"
        >
          <InboxStackIcon className="h-8 w-8 " />
          <div className="flex w-full flex-col gap-1">
            <h2 className="text-base-content text-base leading-6 font-normal">
              {t.hostContent.account.taxesTitle}
            </h2>
            <p className="text-neutral text-xs leading-4 font-normal">
              {t.hostContent.account.taxesDesc}
            </p>
          </div>
        </button> */}
      </div>
    </section>
  );
}

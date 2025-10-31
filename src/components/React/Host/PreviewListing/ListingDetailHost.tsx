import * as React from 'react';
import HostCard from '@/components/React/Common/HostCard';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import type { Host } from '@/types/listing/host';
import AppButton from './common/AppButton';
import ChevronRightIcon from '/src/icons/chevron-right-mini.svg?react';
import AppIcon from '../../Common/AppIcon';

type Props = {
  host?: Host;
  lang?: SupportedLanguages;
};

export default function ListingDetailHost({ host, lang = 'es' }: Props) {
  const t = React.useMemo(() => getTranslation(lang), [lang]);

  const infoEntries = React.useMemo(() => {
    const pairs = Object.entries(host?.info ?? {}) as [string, unknown][];
    return pairs
      .filter(([key, value]) => value != null && key !== 'about')
      .map<[string, string]>(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(', ') : String(value),
      ])
      .slice(0, 2);
  }, [host?.info]);

  if (!host) return null;

  const title = t.listingDetail.host.title;
  // const subtitle = t.listingDetail.host.subtitle;
  const subtitleSuperHost = translate(
    t,
    'listingDetail.host.subtitleSuperHost',
    {
      name: host.username,
    }
  );
  //const responseRateLabel = t.listingDetail.host.responseRate;
  const descriptionSuperHost = t.listingDetail.host.descriptionSuperHost;

  // const getResponseTimeText = (minutes: number): string => {
  //   const m = Number.isFinite(minutes)
  //     ? minutes
  //     : Number(host.responseTime ?? 0);
  //   const hours = Math.ceil(m / 60);
  //   if (hours <= 1) return t.listingDetail.host.responseTime.lessThanHour;
  //   if (hours < 24) return t.listingDetail.host.responseTime.lessThanDay;
  //   return t.listingDetail.host.responseTime.moreThanDay;
  // };

  const safeScore =
    typeof host.score === 'number' && host.score > 0 ? host.score : null;

  return (
    <div className="space-y-6 py-8">
      <h1 className="title-listing">{title}</h1>

      <div className="grid grid-cols-1 space-y-8 gap-x-10 md:grid-cols-5 lg:grid-cols-6">
        <div className="col-span-1 space-y-8 md:col-span-2 lg:col-span-2">
          <HostCard
            profilePicture={host.profilePicture}
            username={host.username}
            isSuperHost={host.isSuperHost}
            isHost={true}
            totalReviews={host.totalReviews ?? null}
            becameAt={host.becameHostAt}
            score={safeScore}
            id={host.id}
            enableClick={false}
            isOwnProfile={false}
          />

          <ul className="space-y-2 pt-6 text-sm">
            {infoEntries.map(([key, value]) => {
              const label =
                t.listingDetail.host.info[
                  key as keyof typeof t.listingDetail.host.info
                ] ?? key;
              const iconKey = String(key)
                .replace(/([a-z])([A-Z])/g, '$1-$2')
                .toLowerCase();
              return (
                <li key={key} className="flex items-center gap-x-2">
                  <AppIcon
                    iconName={iconKey}
                    folder="about-user"
                    className="text-secondary h-5 w-5"
                    loaderCompact={true}
                  />
                  <span className="font-medium">{label}:</span>
                  <span>{value}</span>
                </li>
              );
            })}
          </ul>

          <div className="space-y-1 text-sm">
            {host.info?.about && <p>{host.info.about}</p>}
            <AppButton
              label={t.listingDetail.host.moreInfo}
              icon="chevron-right"
              size="sm"
              variant="link"
              className="btn btn-link btn-sm text-primary inline-flex items-center gap-1 px-0 no-underline"
              onClick={() => {
                window.location.assign(`/users/${host.id}`);
              }}
            />
          </div>
        </div>

        <div className="col-span-1 space-y-4 md:col-span-3 lg:col-span-4">
          {host.isSuperHost && (
            <div>
              <h2 className="self-stretch text-xl leading-7">
                {subtitleSuperHost}
              </h2>
              <p className="pt-4 text-sm">{descriptionSuperHost}</p>
            </div>
          )}
          <div className="space-y-5">
            <h2 className="self-stretch text-xl leading-7">
              {t.listingDetail.host.subtitle}
            </h2>
            <button className="btn btn-primary flex h-12 items-center rounded-full font-normal">
              {t.listingDetail.host.contact}
              <ChevronRightIcon className="h-5 w-5"></ChevronRightIcon>
            </button>
          </div>

          <div>
            {/* <h2 className="self-stretch text-xl leading-7">{subtitle}</h2> */}
            {/* <div className="space-y-2 self-stretch pt-4 text-sm">
              {typeof host.responseRate === 'number' && (
                <p>
                  {responseRateLabel}: {host.responseRate} %
                </p>
              )}
              {host.responseTime != null && (
                <p>{getResponseTimeText(Number(host.responseTime))}</p>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

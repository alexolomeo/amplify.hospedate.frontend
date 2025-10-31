import React, { useCallback } from 'react';
import { useStore } from '@nanostores/react';
import {
  recentSearches,
  type RecentSearchItem,
} from '@/stores/recentSearchesStore';
import { SearchCalendarTab, type SearchState } from '@/types/search';
import { useSearchNavigation } from '../Hooks/Search/useSearchNavigation';
import {
  getTranslation,
  translatePlural,
  type SupportedLanguages,
} from '@/utils/i18n';
import { formatDate } from '@/utils/dateUtils';

interface Props {
  lang?: SupportedLanguages;
}
export const RecentSearch: React.FC<Props> = ({ lang = 'es' }) => {
  const t = getTranslation(lang);
  const $recentSearches = useStore(recentSearches);
  const { navigate } = useSearchNavigation();

  const handleRecentSearchClick = useCallback(
    (item: RecentSearchItem) => {
      const searchState: SearchState = {
        destination: {
          placeId: item.placeId,
          googleDescription: item.googleDescription,
          userInput: item.userInput,
        },
        dates: item.dates,
        guestCount: item.guestCount,
      };
      navigate(searchState);
    },
    [navigate]
  );

  if ($recentSearches.length === 0) {
    return (
      <>
        <div className="w-full">
          <li className="text-neutral p-4 pb-2 text-xs">
            {t.search.recentSearch}
          </li>
          <li className="text-neutral p-4 pb-2 text-xs">
            {t.search.noRecentSearchesMessage}
          </li>
        </div>
      </>
    );
  }

  return (
    <div className="w-full">
      <li className="text-neutral p-4 pb-2 text-xs">{t.search.recentSearch}</li>
      {$recentSearches.map((item) => (
        <li
          key={`${item.placeId}-${item.timestamp}`}
          className="list-row cursor-pointer"
          onClick={() => handleRecentSearchClick(item)}
        >
          <div className="space-x-3">
            <div className="flex flex-col items-start gap-1">
              <span className="text-sm font-normal">
                {item.googleDescription}
              </span>
              <span className="text-neutral text-sm">
                {item.dates.activeTab === SearchCalendarTab.Calendar ? (
                  <>
                    {item.dates.checkIn ? formatDate(item.dates.checkIn) : ''}
                    {item.dates.checkIn && item.dates.checkOut ? ' - ' : ''}
                    {item.dates.checkOut ? formatDate(item.dates.checkOut) : ''}
                  </>
                ) : (
                  <>
                    {formatDate(item.dates.monthlyStart)}
                    {item.dates.monthlyStart && item.dates.monthlyEnd
                      ? ' - '
                      : ''}
                    {formatDate(item.dates.monthlyEnd)}
                  </>
                )}
                {' - '}
                {translatePlural(
                  t,
                  `search.guests.guest`,
                  item.guestCount.adults +
                    item.guestCount.children +
                    item.guestCount.infants
                )}
              </span>
            </div>
          </div>
        </li>
      ))}
    </div>
  );
};

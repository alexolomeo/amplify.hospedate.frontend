import SearchBar from './SearchBar.tsx';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import { useSearchState } from '../Hooks/Search/useSearchState.ts';
import { useSearchNavigation } from '../Hooks/Search/useSearchNavigation.ts';
import { useSearchInit } from '../Hooks/Search/useSearchInit.ts';
import FilterIcon from '/src/icons/adjusments-horizontal.svg?react';
import { useStore } from '@nanostores/react';
import { $countFilter, $isLoading } from '@/stores/searchStore.ts';
import { useEffect } from 'react';
import { HeaderSkeleton } from '../Common/Skeleton/HeaderSkeleton.tsx';

interface Props {
  lang?: SupportedLanguages;
  isCompactMode: boolean;
  isFilter?: boolean;
}
const SearchContainer: React.FC<Props> = ({
  lang = 'es',
  isCompactMode,
  isFilter = false,
}) => {
  const t = getTranslation(lang);
  const { state, actions } = useSearchState();
  const { navigate } = useSearchNavigation();
  const { loading, error } = useSearchInit(actions.loadFromUrl);
  const isLoading = useStore($isLoading);
  const countFilter = useStore($countFilter);
  const showSkeleton = loading;
  useEffect(() => {
    const ready = !loading && !error;
    if (ready) {
      window.dispatchEvent(
        new CustomEvent('header:island-ready', { detail: 'search' })
      );
    }
  }, [loading, isLoading, isCompactMode, isFilter, error]);
  const handleSearch = () => {
    navigate(state);
  };
  const openModal = () => {
    const modal = document.getElementById('filter-modal');
    if (modal && modal instanceof HTMLDialogElement) {
      modal.showModal();
    }
  };
  if (showSkeleton) {
    return <HeaderSkeleton />;
  }
  if (error) {
    return <></>;
  }
  return (
    <div className="flex items-center justify-end md:justify-center">
      <SearchBar
        state={state}
        onSearch={handleSearch}
        lang={lang}
        compactMode={isCompactMode}
        onUpdateCalendar={actions.updateCalendarDates}
        onUpdateFlexible={actions.updateFlexible}
        onUpdateMonths={actions.updateMonthlyDates}
        onUpdateDestination={actions.updateDestination}
        onUpdateGuest={actions.updateGuestCount}
        onUpdateActiveTab={actions.updateActiveTab}
      />
      {isCompactMode && isFilter && (
        <div className="relative">
          <button
            className="btn btn-secondary btn-outline flex h-12 items-center rounded-full"
            onClick={openModal}
            disabled={isLoading}
          >
            {isLoading ? (
              <span
                className={`loading loading-spinner loading-sm text-secondary`}
              />
            ) : (
              <>
                <span className="logo-condensed hidden w-auto lg:block">
                  {t.filter.title}
                </span>
                <FilterIcon className="h-4 w-4" />
              </>
            )}
          </button>
          {!isLoading && countFilter !== 0 && (
            <div className="bg-secondary absolute top-0 right-0 h-5 w-5 rounded-full text-center">
              <p className="text-secondary-content text-sm">{countFilter} </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default SearchContainer;

import SearchDestination from './SearchDestination.tsx';
import React, { useEffect, useMemo, useState } from 'react';
import SearchCalendar from './SearchCalendar.tsx';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n.ts';
import { useSearch } from '../Hooks/useSearch.ts';
import GuestCounter from '../GuestCounter.tsx';
import SearchIcon from '/src/icons/search.svg?react';
import {
  SearchCalendarTab,
  type Flexible,
  type Guests,
  type SearchState,
} from '@/types/search.ts';
import SearchBarModal from './SearchBarModal.tsx';
export interface SearchBarProps {
  state: SearchState;
  onUpdateMonths: (monthStartDate: Date, monthEndDate: Date) => void;
  onUpdateFlexible: (flexible: Flexible) => void;
  onUpdateActiveTab: (updateActiveTab: SearchCalendarTab) => void;
  onUpdateDestination: (
    placeId: string | null,
    googleDescription: string,
    userInput: string
  ) => void;
  onUpdateCalendar: (checkIn: Date | null, checkout: Date | null) => void;
  onUpdateGuest: (guest: Guests) => void;
  onSearch: () => void;
  lang?: SupportedLanguages;
  compactMode: boolean;
}
const SearchDivider: React.FC<{
  show: boolean;
}> = ({ show }) =>
  show ? (
    <div className="outline-base-200 h-5 w-0 outline"></div>
  ) : (
    <div className="h-5 w-0"></div>
  );
type SearchSection = 'destination' | 'checkIn' | 'checkout' | 'guests' | null;
const SearchBar: React.FC<SearchBarProps> = ({
  state,
  onUpdateCalendar,
  onUpdateMonths,
  onUpdateFlexible,
  onUpdateActiveTab,
  onUpdateDestination,
  onUpdateGuest,
  onSearch,
  lang = 'es',
  compactMode,
}) => {
  const t = getTranslation(lang);
  const { getGuestSubtitle } = useSearch(state.guestCount, t);
  const [activeSection, setActiveSection] = useState<SearchSection>(null);
  const [hoveredSection, setHoveredSection] = useState<SearchSection>(null);
  const [compactModeLocal, setCompactLocal] = useState<boolean>(compactMode);
  const { destination, guestCount } = state;
  useEffect(() => {
    setCompactLocal(compactMode);
  }, [compactMode]);
  const getSectionClasses = (sectionName: SearchSection) => {
    return activeSection === sectionName
      ? 'h-full py-2 px-4 bg-base-100 rounded-full border border-base-200 '
      : `h-full hover:border-base-200 py-2 px-4 hover:rounded-full hover:border hover:bg-[var(--color-base-150)] ${
          activeSection !== null
            ? 'border border-[var(--color-base-150)]'
            : 'border border-base-100 bg-base-100'
        }`;
  };
  const openModal = () => {
    const modal = document.getElementById('mobile_search') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };
  const chooseSection = (section: SearchSection) => {
    setActiveSection(section);
    setCompactLocal(false);
  };
  const shouldShowDivider = (pos: string) => {
    if (hoveredSection === null) return true;
    const map: Record<string, SearchSection[]> = {
      'destination-checkin': ['destination', 'checkIn'],
      'checkin-checkout': ['checkIn'],
      'checkout-guests': ['checkIn', 'guests'],
    };
    return !map[pos]?.includes(hoveredSection);
  };

  const renderTabContent = useMemo(() => {
    switch (state.dates.activeTab) {
      case SearchCalendarTab.Calendar: {
        const { checkIn, checkOut } = state.dates;
        if (checkIn && checkOut) {
          const formatter = new Intl.DateTimeFormat(lang, {
            day: 'numeric',
            month: 'short',
          });
          return `${formatter.format(checkIn)} - ${formatter.format(checkOut)}`;
        }
        return null;
      }
      case SearchCalendarTab.Months: {
        const { monthlyStart, monthlyEnd } = state.dates;
        if (monthlyStart && monthlyEnd) {
          const formatter = new Intl.DateTimeFormat(lang, {
            day: 'numeric',
            month: 'short',
          });
          return `${formatter.format(monthlyStart)} - ${formatter.format(monthlyEnd)}`;
        }
        return null;
      }
      case SearchCalendarTab.Flexible:
        return state.dates.flexible
          ? translate(t, `search.dates.${state.dates.flexible.toLowerCase()}`)
          : null;
      default:
        return null;
    }
  }, [state.dates, t, lang]);
  return (
    <section className="flex-1">
      {/* botton responsive */}
      <div className="hide-from-1041 text-center">
        <button
          className="outline-base-200 bg-base-100 h-12 w-56 rounded-[16px] outline"
          onClick={openModal}
        >
          <span className="flex items-center justify-center gap-1 text-sm font-medium">
            {destination.userInput && state.dates.activeTab ? (
              <div className="flex flex-col justify-center">
                <p className="w-48 truncate text-sm font-normal">
                  {destination.userInput || destination.googleDescription}
                </p>
                <div className="text-neutral flex items-center gap-1 text-xs">
                  <p className="w-25 truncate">{renderTabContent}</p>
                  <p className="w-20 truncate">
                    {getGuestSubtitle(translate(t, t.search.who))}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <SearchIcon className="text-neutral h-4 w-4" />
                <span className="text-neutral">
                  {translate(t, t.search.startSearch)}
                </span>
              </>
            )}
          </span>
        </button>
      </div>
      {/* search */}
      <div
        className={`show-from-1041 rounded-full ${
          activeSection !== null ? 'bg-[var(--color-base-150)]' : 'bg-base-100'
        } ${compactModeLocal ? 'h-14' : 'h-16'}`}
      >
        <div className="border-base-200 flex w-full items-center rounded-full border">
          {/* destination */}
          <div
            className={`h-full flex-1 rounded-l-full ${getSectionClasses('destination')}`}
            onClick={() => chooseSection('destination')}
            onMouseEnter={() => setHoveredSection('destination')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <SearchDestination
              googleDescription={destination.googleDescription}
              userInput={destination.userInput}
              onUpdate={onUpdateDestination}
              title={translate(t, t.search.where)}
              lang={lang}
              compactMode={compactModeLocal}
            />
          </div>
          <SearchDivider
            show={
              shouldShowDivider('destination-checkin') &&
              activeSection !== 'checkIn' &&
              activeSection !== 'destination'
            }
          />
          {/* dates */}
          <div
            className={`${getSectionClasses('checkIn')}`}
            onClick={() => chooseSection('checkIn')}
            onMouseEnter={() => setHoveredSection('checkIn')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <SearchCalendar
              onUpdateCalendar={onUpdateCalendar}
              onUpdateFlexible={onUpdateFlexible}
              onUpdateMonths={onUpdateMonths}
              onUpdateActiveTab={onUpdateActiveTab}
              calendarState={state.dates}
              monthStyle="flex flex-row gap-5"
              lang={lang}
              compactMode={compactModeLocal}
              dividerCondition={
                shouldShowDivider('checkin-checkout') &&
                activeSection !== 'checkIn'
              }
            ></SearchCalendar>
          </div>
          <SearchDivider
            show={
              shouldShowDivider('checkout-guests') &&
              activeSection !== 'checkIn' &&
              activeSection !== 'guests'
            }
          />
          {/* guest */}
          <div
            className={`${getSectionClasses('guests')}`}
            onClick={() => chooseSection('guests')}
            onMouseEnter={() => setHoveredSection('guests')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <GuestCounter
              guestCount={guestCount}
              onUpdate={onUpdateGuest}
              subtitle={getGuestSubtitle(translate(t, t.search.who))}
              lang={lang}
              dropdownSize="w-xs"
              dropdownAlign="dropdown-start"
              compactMode={compactModeLocal}
            ></GuestCounter>
          </div>
          <div
            className={`mr-2 flex h-full items-center ${compactModeLocal ? 'py-1' : 'py-2'}`}
          >
            <button
              className="btn btn-primary h-full rounded-full"
              onClick={onSearch}
              data-testid="button-search-listing"
            >
              <p className="flex items-center justify-center gap-1">
                {!compactMode ? translate(t, t.search.search) : ''}
                <SearchIcon className="h-4 w-4" />
              </p>
            </button>
          </div>
        </div>
      </div>
      <SearchBarModal
        state={state}
        onUpdateCalendar={onUpdateCalendar}
        onUpdateFlexible={onUpdateFlexible}
        onUpdateMonths={onUpdateMonths}
        onUpdateDestination={onUpdateDestination}
        onUpdateGuest={onUpdateGuest}
        onUpdateActiveTab={onUpdateActiveTab}
        onSearch={onSearch}
        lang={lang}
        t={t}
      />
    </section>
  );
};

export default SearchBar;

import React, { useState, type Dispatch, type SetStateAction } from 'react';
import SearchDestination from './SearchDestination.tsx';
import SearchCalendar from './SearchCalendar.tsx';
import { translate, type SupportedLanguages } from '@/utils/i18n.ts';
import type {
  Flexible,
  Guests,
  SearchCalendarTab,
  SearchState,
} from '@/types/search.ts';
import { useSearch } from '@/components/React/Hooks/useSearch.ts';
import GuestCounter from '@/components/React/GuestCounter.tsx';
import SearchIcon from '/src/icons/search.svg?react';
import FlagOutlineIcon from '/src/icons/flag-outline.svg?react';
import CalendarIcon from '/src/icons/calendar.svg?react';
import UsersIcon from '/src/icons/users.svg?react';
import ChevronDownIcon from '/src/icons/chevron-down.svg?react';

interface SearchBarModalProps {
  state: SearchState;
  t: ReturnType<typeof translate>;
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
  lang: SupportedLanguages;
}
//TODO: Modificar segun el diseño del movil
const SearchBarModal: React.FC<SearchBarModalProps> = ({
  state,
  lang,
  t,
  onUpdateCalendar,
  onUpdateDestination,
  onUpdateGuest,
  onSearch,
  onUpdateMonths,
  onUpdateFlexible,
  onUpdateActiveTab,
}) => {
  const { destination, guestCount, dates } = state;
  const { getGuestSubtitle } = useSearch(guestCount, t);
  const [showDestine, setShowDestine] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [showGuest, setShowGuest] = useState(false);
  const handleButtonClick = (setter: Dispatch<SetStateAction<boolean>>) => {
    setShowDestine(setter === setShowDestine);
    setShowDate(setter === setShowDate);
    setShowGuest(setter === setShowGuest);
  };

  return (
    <dialog id="mobile_search" className="modal">
      <div className="modal-box relative max-h-[100vh] max-w-md rounded-[40px] bg-[var(--color-base-150)]">
        <div className="border-base-200 sticky top-0 z-10 border-b bg-[var(--color-base-150)]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-center text-xl font-bold">{t.search.search}</p>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-soft btn-primary">
                ✕
              </button>
            </form>
          </div>
        </div>
        <div className="my-4 max-h-[70vh] overflow-y-auto">
          <div className="flex w-full flex-col gap-y-8">
            {showDestine ? (
              <SearchDestination
                googleDescription={destination.googleDescription}
                userInput={destination.userInput}
                onUpdate={onUpdateDestination}
                title={translate(t, t.search.whereDoYouWantToGo)}
                lang={lang}
                ismobile={true}
              />
            ) : (
              <button
                onClick={() => handleButtonClick(setShowDestine)}
                className="bg-base-200 flex h-16 items-center justify-between rounded-2xl px-6"
              >
                <div className="flex items-center gap-2">
                  <FlagOutlineIcon className="h-5 w-5"></FlagOutlineIcon>
                  {t.search.where}
                </div>
                <ChevronDownIcon className="h-5 w-5"></ChevronDownIcon>
              </button>
            )}
            {showDate ? (
              <SearchCalendar
                onUpdateCalendar={onUpdateCalendar}
                onUpdateFlexible={onUpdateFlexible}
                onUpdateMonths={onUpdateMonths}
                onUpdateActiveTab={onUpdateActiveTab}
                calendarState={dates}
                monthStyle="flex flex-col gap-5 w-full"
                lang={lang}
                dividerCondition={false}
                ismobile={true}
              />
            ) : (
              <button
                onClick={() => handleButtonClick(setShowDate)}
                className="bg-base-200 flex h-16 items-center justify-between rounded-2xl px-6"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5"></CalendarIcon>
                  {t.search.when}
                </div>
                <ChevronDownIcon className="h-5 w-5"></ChevronDownIcon>
              </button>
            )}
            {showGuest ? (
              <GuestCounter
                guestCount={guestCount}
                onUpdate={onUpdateGuest}
                subtitle={getGuestSubtitle(translate(t, t.search.addGuests))}
                lang={lang}
                dropdownSize="w-md"
                dropdownAlign="dropdown-start"
                ismobile={true}
              ></GuestCounter>
            ) : (
              <button
                onClick={() => handleButtonClick(setShowGuest)}
                className="bg-base-200 flex h-16 items-center justify-between rounded-2xl px-6"
              >
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-5 w-5"></UsersIcon>
                  {t.search.who}
                </div>
                <ChevronDownIcon className="h-5 w-5"></ChevronDownIcon>
              </button>
            )}
          </div>
        </div>
        <div className="border-base-200 sticky bottom-0 z-10 border-t bg-[var(--color-base-150)]">
          <div className="flex justify-between p-3">
            <form method="dialog">
              <button className="btn btn-soft btn-primary rounded-full">
                {t.search.close}
              </button>
            </form>
            <button
              className="btn btn-primary flex items-center justify-center gap-2 rounded-full text-sm"
              onClick={onSearch}
              data-testid="button-search-mobile"
            >
              {translate(t, t.search.search)}
              <SearchIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default SearchBarModal;

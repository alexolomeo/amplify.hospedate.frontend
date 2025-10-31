import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n.ts';
import React, { useMemo } from 'react';
import { Flexible, SearchCalendarTab } from '@/types/search';
import TabsMenu from './Calendar/TabsMenu';
import { formatDate } from '@/utils/dateUtils';

interface CalendarState {
  checkIn: Date | null;
  checkOut: Date | null;
  monthlyStart: Date;
  monthlyEnd: Date;
  flexible: Flexible | null;
  activeTab: SearchCalendarTab;
}

interface SearchCalendarProps {
  calendarState: CalendarState;
  monthStyle: string;
  lang?: SupportedLanguages;
  onUpdateCalendar: (checkIn: Date | null, checkout: Date | null) => void;
  onUpdateMonths: (monthStartDate: Date, monthEndDate: Date) => void;
  onUpdateFlexible: (flexible: Flexible) => void;
  onUpdateActiveTab: (updateActiveTab: SearchCalendarTab) => void;
  compactMode?: boolean;
  dividerCondition?: boolean;
  ismobile?: boolean;
}

const SearchCalendar: React.FC<SearchCalendarProps> = ({
  calendarState,
  monthStyle,
  lang = 'es',
  onUpdateCalendar,
  onUpdateMonths,
  onUpdateFlexible,
  onUpdateActiveTab,
  compactMode = false,
  ismobile = false,
  dividerCondition,
}) => {
  const t = getTranslation(lang);
  const { checkIn, checkOut, activeTab, monthlyStart, monthlyEnd, flexible } =
    calendarState;

  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case SearchCalendarTab.Calendar:
        return (
          <>
            <div tabIndex={0} role="button" className="w-19 truncate">
              {!compactMode && (
                <p className="search_label">{t.search.arrival}</p>
              )}
              {checkIn ? (
                <p className="search_input pt-0.5">
                  {checkIn.toLocaleDateString()}
                </p>
              ) : (
                <p className="search_input truncate">{t.search.addDate}</p>
              )}
            </div>
            {dividerCondition ? (
              <div className="outline-base-200 h-5 w-0 outline"></div>
            ) : (
              <div className="h-5 w-0"></div>
            )}
            <div tabIndex={0} role="button" className="w-19 truncate">
              {!compactMode && (
                <p className="search_label">{t.search.departure}</p>
              )}
              {checkOut ? (
                <p className="search_input pt-0.5">
                  {checkOut.toLocaleDateString()}
                </p>
              ) : (
                <p className="search_input truncate">{t.search.addDate}</p>
              )}
            </div>
          </>
        );

      case SearchCalendarTab.Months:
        return (
          <div tabIndex={0} role="button" className="w-40 truncate">
            {!compactMode && <p className="search_label">{t.search.when}</p>}
            {monthlyStart && monthlyEnd ? (
              <p className="search_input pt-0.5">
                {`${formatDate(monthlyStart, lang)} - ${formatDate(monthlyEnd, lang)}`}
              </p>
            ) : (
              <p className="search_input">{t.search.addDate}</p>
            )}
          </div>
        );

      case SearchCalendarTab.Flexible:
        return (
          <div tabIndex={0} role="button" className="w-40 truncate">
            {!compactMode && <p className="search_label">{t.search.when}</p>}
            {flexible ? (
              <p className="search_input pt-0.5">
                {translate(t, `search.dates.${flexible.toLowerCase()}`)}
              </p>
            ) : (
              <p className="search_input">{t.search.addDate}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  }, [
    activeTab,
    checkIn,
    checkOut,
    compactMode,
    dividerCondition,
    flexible,
    lang,
    monthlyEnd,
    monthlyStart,
    t,
  ]);

  return ismobile ? (
    <div className="flex w-full flex-col gap-2 px-1">
      <p className="text-lg font-bold">{t.search.dates.whenIsYourTrip}</p>
      <TabsMenu
        calendarState={calendarState}
        monthStyle={monthStyle}
        lang={lang}
        onUpdateCalendar={onUpdateCalendar}
        onUpdateMonths={onUpdateMonths}
        onUpdateFlexible={onUpdateFlexible}
        onUpdateActiveTab={onUpdateActiveTab}
        numberMonths={1}
        ismobile={ismobile}
      ></TabsMenu>
    </div>
  ) : (
    <div className="dropdown dropdown-center h-full w-full">
      <div className="ml-1 flex h-full w-full items-center justify-center gap-x-3">
        {renderTabContent}
      </div>
      <div
        tabIndex={0}
        className="card card-lg dropdown-content rounded-box z-1 mt-7 w-2xl items-center justify-center bg-[var(--color-base-150)] shadow-sm"
      >
        <div className="py-8">
          <TabsMenu
            calendarState={calendarState}
            monthStyle={monthStyle}
            lang={lang}
            onUpdateCalendar={onUpdateCalendar}
            onUpdateMonths={onUpdateMonths}
            onUpdateFlexible={onUpdateFlexible}
            onUpdateActiveTab={onUpdateActiveTab}
            numberMonths={2}
          ></TabsMenu>
        </div>
      </div>
    </div>
  );
};

export default SearchCalendar;

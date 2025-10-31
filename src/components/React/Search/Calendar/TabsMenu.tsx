import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import React from 'react';

import { Flexible, SearchCalendarTab } from '@/types/search';
import TabCalendar from './TabCalendar';
import TabMonths from './TabMonths';
import TabFlexible from './TabFlexible';

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
  numberMonths?: number;
  ismobile?: boolean;
}

const TabsMenu: React.FC<SearchCalendarProps> = ({
  calendarState,
  monthStyle,
  lang = 'es',
  onUpdateCalendar,
  onUpdateMonths,
  onUpdateFlexible,
  onUpdateActiveTab,
  numberMonths = 2,
  ismobile = false,
}) => {
  const t = getTranslation(lang);
  const { activeTab } = calendarState;
  const handleTabClick = (tab: SearchCalendarTab) => {
    onUpdateActiveTab(tab);
  };

  return (
    <div className="tabs tabs-border w-full items-center justify-center">
      <button
        type="button"
        className={`tab ${activeTab === SearchCalendarTab.Calendar ? 'tab-active' : ''} ${ismobile ? 'flex-1' : ''}`}
        onClick={() => handleTabClick(SearchCalendarTab.Calendar)}
        aria-label={t.search.dates.dates}
        data-testid="test-search-calendar-date"
      >
        {t.search.dates.dates}
      </button>
      {activeTab === SearchCalendarTab.Calendar && (
        <TabCalendar
          monthStyle={monthStyle}
          lang={lang}
          onUpdate={onUpdateCalendar}
          check_in_date={calendarState.checkIn}
          check_out_date={calendarState.checkOut}
          numberMonths={numberMonths}
          ismobile={ismobile}
        />
      )}
      <button
        type="button"
        className={`tab ${activeTab === SearchCalendarTab.Months ? 'tab-active' : ''} ${ismobile ? 'flex-1' : ''}`}
        onClick={() => handleTabClick(SearchCalendarTab.Months)}
        aria-label={t.search.dates.months}
        data-testid="test-search-calendar-month"
      >
        {t.search.dates.months}
      </button>
      {activeTab === SearchCalendarTab.Months && (
        <TabMonths
          lang={lang}
          onUpdate={onUpdateMonths}
          startMonth={calendarState.monthlyStart}
          endMonth={calendarState.monthlyEnd}
        />
      )}
      <button
        type="button"
        className={`tab ${activeTab === SearchCalendarTab.Flexible ? 'tab-active' : ''} ${ismobile ? 'flex-1' : ''}`}
        onClick={() => handleTabClick(SearchCalendarTab.Flexible)}
        aria-label={t.search.dates.flexible}
        data-testid="test-search-calendar-flexible"
      >
        {t.search.dates.flexible}
      </button>
      {activeTab === SearchCalendarTab.Flexible && (
        <TabFlexible
          flexible={calendarState.flexible}
          lang={lang}
          onUpdate={onUpdateFlexible}
        />
      )}
    </div>
  );
};

export default TabsMenu;

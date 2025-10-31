import React, { useEffect, useState } from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import { getGuestTrips } from '@/services/users';
import TimelineTripsPanel from './TimelineTripsPanel';
import CurrentTripsPanel from './CurrentTripsPanel';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorState from '../Common/ErrorState';
import { getTripStatus } from '@/utils/trips';
import { useFetch } from '../Hooks/useFetch';

interface TripsPanelProps {
  lang: SupportedLanguages;
  t: ReturnType<typeof translate>;
}

const tabKeys = ['current', 'past', 'cancelled', 'rejected'] as const;
type TabKey = (typeof tabKeys)[number];

const TripsPanel: React.FC<TripsPanelProps> = ({ lang, t }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('current');
  const {
    data: trips,
    isLoading,
    error,
    isRetrying,
    fetchData,
    retry,
  } = useFetch(getGuestTrips);

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const tab = params.get('tab');
    if (tabKeys.includes(tab as TabKey)) {
      setActiveTab(tab as TabKey);
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', activeTab);
    window.history.replaceState({}, '', url.toString());
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabLabels = {
    current: t?.trips?.tabs?.current ?? 'Current',
    past: t?.trips?.tabs?.past ?? 'Past',
    cancelled: t?.trips?.tabs?.cancelled ?? 'Cancelled',
    rejected: t?.trips?.tabs?.rejected ?? 'Rejected',
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="flex items-center justify-center py-20">
        <LoadingSpinner className={'h-8 w-8'} lang={lang} />
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={retry}
        isRetrying={isRetrying}
        lang={lang}
      />
    );
  }

  if (!trips) return null;

  // Handlers for TimelineTripsPanel
  const handleReviewClick = (tripId: number) => {
    console.log('Review clicked for trip:', tripId);
    // Handle review functionality
  };

  const handleHeartClick = (tripId: number) => {
    console.log('Heart clicked for trip:', tripId);
    // Handle wishlist functionality
  };

  return (
    <section>
      {/* Navigation Bar - Horizontal tab layout */}
      <div className="relative mb-8 flex w-full flex-col items-stretch sm:flex-row sm:items-stretch sm:justify-start sm:gap-0">
        {tabKeys.map((key) => (
          <div
            key={key}
            className="relative my-2 flex flex-1 cursor-pointer flex-col items-center justify-center gap-0 text-center sm:max-w-[200px]"
            onClick={() => {
              setActiveTab(key);
            }}
          >
            <div className="relative flex h-8 flex-shrink-0 flex-row items-center justify-center gap-2 px-4">
              <div
                className={`text-base-content relative flex items-center justify-center text-center text-sm leading-5 ${
                  activeTab === key ? 'font-semibold' : 'font-normal'
                }`}
              >
                {tabLabels[key]}
              </div>
            </div>
            {/* Underline for each tab */}
            <div
              className={`relative h-0.5 flex-shrink-0 self-stretch ${
                activeTab === key
                  ? 'bg-base-content opacity-100'
                  : 'bg-neutral opacity-20'
              } transition-all duration-200`}
            />
          </div>
        ))}
      </div>

      {/* Content Section */}
      <main className="min-h-sm flex items-start justify-center">
        {activeTab === 'past' && (
          <TimelineTripsPanel
            lang={lang}
            t={t}
            trips={trips.finished}
            variant="finished"
            onReviewClick={handleReviewClick}
            onHeartClick={handleHeartClick}
          />
        )}
        {activeTab === 'current' && (
          <CurrentTripsPanel
            lang={lang}
            t={t}
            trips={trips.scheduled}
            getTripStatus={getTripStatus}
          />
        )}
        {activeTab === 'cancelled' && (
          <TimelineTripsPanel
            lang={lang}
            t={t}
            trips={trips.cancelled}
            variant="cancelled"
            onHeartClick={handleHeartClick}
            emptyStateMessage={t.trips.content.cancelled}
          />
        )}
        {activeTab === 'rejected' && (
          <TimelineTripsPanel
            lang={lang}
            t={t}
            trips={trips.rejected}
            variant="rejected"
            onHeartClick={handleHeartClick}
            emptyStateMessage={t.trips.content.rejected}
          />
        )}
      </main>
    </section>
  );
};

export default TripsPanel;

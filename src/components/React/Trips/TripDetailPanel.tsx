import React from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import { getTripDetail } from '@/services/users';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorState from '../Common/ErrorState';
import { useFetch } from '../Hooks/useFetch';
import TripDetailGuestPage from './TripDetailGuestPage';
import TripDetailHostPage from './TripDetailHostPage';
import { useStore } from '@nanostores/react';
import { $userStore } from '@/stores/userStore';
import { AuthEventEmitter } from '@/utils/authEventEmitter';

interface TripDetailPanelProps {
  lang: SupportedLanguages;
  t: ReturnType<typeof translate>;
  tripId?: string;
  isHost?: boolean; // Determines whether to show host or guest view for the trip
}

const TripDetailPanel: React.FC<TripDetailPanelProps> = (props) => {
  const { lang, tripId, isHost } = props;
  const user = useStore($userStore);
  const currentUserId = user?.id ?? null;
  // Memoize the fetcher function to prevent infinite re-renders
  const fetcher = React.useCallback(() => {
    if (!tripId) {
      throw new Error('Trip ID is required');
    }
    return getTripDetail(tripId);
  }, [tripId]);

  const {
    data: tripDetail,
    isLoading,
    error,
    isRetrying,
    fetchData,
    retry,
  } = useFetch(fetcher);

  React.useEffect(() => {
    if (tripId) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  if (isLoading) {
    return (
      <section className="flex items-center justify-center py-20">
        <LoadingSpinner className={'h-8 w-8'} lang={lang} />
      </section>
    );
  }

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
  if (!tripDetail) return null;

  const isAuthorized =
    !!currentUserId &&
    (isHost
      ? currentUserId === tripDetail.host.id
      : currentUserId === tripDetail.guest.id);

  if (!isAuthorized) {
    AuthEventEmitter.emit('route.forbidden');
    return null;
  }

  if (isHost) {
    return (
      <TripDetailHostPage
        {...props}
        tripDetail={tripDetail}
        fetchTripDetail={fetchData}
      />
    );
  } else {
    return <TripDetailGuestPage {...props} tripDetail={tripDetail} />;
  }
};

export default TripDetailPanel;

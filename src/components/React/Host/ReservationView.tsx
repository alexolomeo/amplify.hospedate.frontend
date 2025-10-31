import type { Reservation } from '@/types/reservation';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useEffect, useState } from 'react';
interface Props {
  lang?: SupportedLanguages;
}
const ReservationView: React.FC<Props> = ({ lang = 'es' }) => {
  const t = getTranslation(lang);
  const views = [
    { label: t.hostReservations.views.upcoming, value: 'upcoming' },
    { label: t.hostReservations.views.completed, value: 'completed' },
    { label: t.hostReservations.views.cancelled, value: 'cancelled' },
    { label: t.hostReservations.views.all, value: 'all' },
  ] as const;
  const [view, setView] = useState<(typeof views)[number]['value']>('upcoming');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // TODO: call api
      setReservations([]);
      setLoading(false);
    }, 1000);
  }, [view]);

  const renderReservations = () => {
    if (loading) {
      return <div className="text-center">{t.hostReservations.loading}</div>;
    }
    if (reservations.length === 0) {
      switch (view) {
        case 'upcoming':
          return (
            <div className="text-center">
              <p className="font-semibold">
                {t.hostReservations.noUpcomingReservations}
                <br />
                <a href="" className="underline">
                  {t.hostReservations.seeAllReservations}
                </a>
              </p>
            </div>
          );
        case 'completed':
        case 'cancelled':
          return (
            <div className="text-center">
              <span className="font-semibold">
                {t.hostReservations.noResultsFound}
              </span>
              <br />
              <span>{t.hostReservations.tryDifferentFilter}</span>
            </div>
          );
        case 'all':
          return (
            <div className="text-center">
              <span className="font-semibold">
                {t.hostReservations.noReservations}
              </span>
            </div>
          );
        default:
          return null;
      }
    }
    return (
      <div className="grid gap-4">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="rounded-lg border p-4 shadow">
            <h3 className="font-semibold">{reservation.title}</h3>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="mx-auto my-5 w-screen max-w-5xl md:my-10 lg:my-15 xl:max-w-6xl 2xl:max-w-7xl">
      <h1 className="text-xl font-semibold sm:text-lg md:text-3xl">
        {t.hostReservations.title}
      </h1>
      <p className="my-5 flex gap-x-2 border-b-2 border-gray-300">
        {views.map((item) => (
          <span
            key={item.value}
            className={`group m-1 flex cursor-pointer gap-x-2 rounded-md text-sm/6 ${view === item.value ? 'font-semibold underline underline-offset-11' : 'bg-base-100'}`}
            onClick={() => setView(item.value)}
          >
            {item.label}
          </span>
        ))}
      </p>
      {renderReservations()}
      {/* {view && <div>{view}</div>} */}
    </section>
  );
};
export default ReservationView;

import { useStore } from '@nanostores/react';
import { $userStore } from '@/stores/userStore';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import { useEffect, useState } from 'react';
import type { Listing } from '@/types/host/listing';
import { fetchHostListings } from '@/services/host/listings';
import ModalSelectListing from './Calendar/ModalSelectListing';
import { ResponsiveImage } from '../Common/ResponsiveImage';
import ReservationEvents from './Today/ReservationEvents';
import { WelcomeSkeleton } from './Today/TodaySkeleton';

interface Props {
  lang: SupportedLanguages;
}

export default function Dashboard({ lang }: Props) {
  const [isClient, setIsClient] = useState(false);
  const user = useStore($userStore);
  const t = getTranslation(lang);
  const [isModalListingOpen, setIsModalListingOpen] = useState<boolean>(false);
  const [selectedListings, setSelectedListings] = useState<Listing[] | null>(
    null
  );
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const getListings = async () => {
      try {
        const data = await fetchHostListings();
        const results = data?.results || [];
        setListings(results);

        let initial: Listing[] = [];

        let persistedIds: number[] = [];
        if (user?.id) {
          try {
            const raw = localStorage.getItem(
              `host:${user.id}:selectedListingIds`
            );
            const parsed = raw ? JSON.parse(raw) : [];
            if (Array.isArray(parsed)) {
              persistedIds = parsed.filter((n: unknown) =>
                Number.isFinite(n as number)
              );
            }
          } catch {
            /* noop */
          }
        }

        if (persistedIds.length > 0) {
          const idSet = new Set(persistedIds);
          initial = results.filter((r) => idSet.has(r.id));
        }

        if (initial.length === 0) {
          const firstPublished = results.find((r) => r.status === 'PUBLISHED');
          const firstUnlisted = results.find((r) => r.status === 'UNLISTED');
          initial = firstPublished
            ? [firstPublished]
            : firstUnlisted
              ? [firstUnlisted]
              : results.length > 0
                ? [results[0]]
                : [];

          if (user?.id) {
            try {
              localStorage.setItem(
                `host:${user.id}:selectedListingIds`,
                JSON.stringify(initial.map((l) => l.id))
              );
            } catch {
              /* noop */
            }
          }
        }

        setSelectedListings(initial);
      } catch (error) {
        console.error('[useCalendarListing] Error fetching listings:', error);
        setSelectedListings([]);
      }
    };
    getListings();
  }, [user?.id]);

  if (!isClient || selectedListings === null) {
    return (
      <div className="mx-auto my-5 w-screen space-y-14 px-4 md:my-10 lg:my-15 xl:max-w-6xl 2xl:max-w-7xl">
        <WelcomeSkeleton></WelcomeSkeleton>
      </div>
    );
  }

  const welcomeMessage = user
    ? translate(t, 'today.welcomeMessage', { name: user.firstName })
    : t.commonComponents.loadingSpinner;

  const handleListingSelect = (list: Listing[]) => {
    setSelectedListings(list);
    if (user?.id) {
      try {
        localStorage.setItem(
          `host:${user.id}:selectedListingIds`,
          JSON.stringify(list.map((l) => l.id))
        );
      } catch {
        /* noop */
      }
    }
  };

  const fallbackPhoto = {
    original: '/images/host/listings/fallback-card-image.webp',
    srcsetWebp: '',
    srcsetAvif: '',
  };

  return (
    <>
      <section className="mx-auto my-5 w-screen space-y-14 px-4 md:my-10 lg:my-15 xl:max-w-6xl 2xl:max-w-7xl">
        <h1 className="text-3xl font-semibold sm:text-lg md:text-3xl">
          {welcomeMessage}
        </h1>

        <div className="flex flex-col gap-8">
          <div className="flex justify-between">
            <h1 className="text-2xl font-medium">
              {t.today.reservationsHeader}
            </h1>

            <button
              onClick={() => setIsModalListingOpen(true)}
              className="btn-secondary btn btn-outline relative rounded-full"
            >
              {selectedListings.length > 0 ? (
                <div className="flex w-auto items-center space-x-1">
                  {selectedListings.slice(0, 2).map((listing) => (
                    <div
                      key={listing.id}
                      className="h-6 w-6 flex-none overflow-hidden rounded-full"
                    >
                      <ResponsiveImage
                        photo={listing.photo || fallbackPhoto}
                        alt={`listing-${listing.id}`}
                        className="h-6 w-6 object-cover"
                      />
                    </div>
                  ))}
                  {selectedListings.length > 2 && (
                    <div className="border-secondary flex h-6 w-6 flex-none items-center justify-center rounded-full border text-xs font-semibold">
                      +{selectedListings.length - 2}
                    </div>
                  )}
                </div>
              ) : (
                <p>{t.today.selectListing}</p>
              )}
            </button>
          </div>

          {selectedListings.length > 0 ? (
            <ReservationEvents lang={lang} listings={selectedListings} />
          ) : (
            <div className="flex flex-col items-center">
              <img
                src="/images/checkList.webp"
                alt="step1"
                className="h-32 w-48 rounded-[40px] object-cover"
              />
              <p>{t.today.noEvents}</p>
            </div>
          )}
        </div>
      </section>

      <ModalSelectListing
        open={isModalListingOpen}
        onClose={() => setIsModalListingOpen(false)}
        listings={listings}
        selectedListings={selectedListings ?? []}
        handleListingsSelect={handleListingSelect}
        multiple={true}
        lang={lang}
      />
    </>
  );
}

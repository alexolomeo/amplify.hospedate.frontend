import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIsMobile } from '@/components/React/Hooks/useIsMobile';
import { useAvailableHeight } from '@/components/React/Hooks/useAvailableHeight';
import ConversationList, { type ConversationListApi } from './ConversationList';
import type { MessageHistoryApi } from './MessageHistory';
import MessageHistory from './MessageHistory';
import MessageInput from './MessageInput';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import type { ListingDetail } from '@/types/listing/listing';
import { fetchListingById } from '@/services/listings';
import ConversationTripDetails from '@/components/React/Messages/ConversationTripDetails';
import { AnimatePresence, motion } from 'framer-motion';
import type { ConversationVM } from '@/adapters/messages.ts';
import { fetchConversationHistoryASC } from '@/services/conversations.ts';
import { getTripDetail } from '@/services/users';
import type { TripDetail } from '@/types/tripDetail';
import { ConversationType } from '@/types/message';
import { useStore } from '@nanostores/react';
import { $userStore } from '@/stores/userStore';

interface Props {
  lang?: SupportedLanguages;
  initialConversationId?: string;
}

export default function MessagesContainer({
  lang = 'es',
  initialConversationId,
}: Props) {
  const t = getTranslation(lang);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationVM | null>(null);

  const isMobile = useIsMobile(767);
  const availableHeight = useAvailableHeight('header');
  const height =
    selectedConversation !== null && isMobile
      ? '100dvh'
      : availableHeight
        ? `${availableHeight}px`
        : undefined;

  const [showTripDetails, setShowTripDetails] = useState(false);
  const [loadingTripDetails, setLoadingTripDetails] = useState(false);
  const [noConversations, setNoConversations] = useState(false);
  const [deepLinkError, setDeepLinkError] = useState<string | null>(null);
  const [selectedListingInfo, setSelectedListingInfo] =
    useState<ListingDetail | null>(null);
  const [selectedTripDetails, setSelectedTripDetails] =
    useState<TripDetail | null>(null);

  const getConversationIdFromPath = useCallback(
    (pathname: string): string | null => {
      const parts = pathname.split('/').filter(Boolean); // ["users","messages","123"]
      const idx = parts.findIndex((p) => p === 'messages');
      return idx >= 0 && parts[idx + 1] ? parts[idx + 1] : null;
    },
    []
  );

  const [routeId, setRouteId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return initialConversationId ?? null;
    return (
      initialConversationId ??
      getConversationIdFromPath(window.location.pathname)
    );
  });

  const listRef = useRef<ConversationListApi | null>(null);
  const didDeepLinkRef = useRef(false);
  const historyRef = useRef<MessageHistoryApi | null>(null);
  const routeIdRef = useRef<string | null>(routeId);

  const user = useStore($userStore);
  const currentUserId = user?.id ?? null;

  const basePath = useMemo(() => {
    if (typeof window === 'undefined') return '/users/messages';
    const path = window.location.pathname;
    if (path.startsWith('/hosting/messages')) return '/hosting/messages';
    return '/users/messages';
  }, []);

  const normalizePath = useCallback((p: string) => p.replace(/\/+$/, ''), []);

  useEffect(() => {
    routeIdRef.current = routeId;
  }, [routeId]);

  /**
   * Minimal, fully-typed placeholder so the UI can render while data loads.
   * Chosen defaults are neutral and safe for all views.
   */
  function makeGhostVM(id: string | number): ConversationVM {
    const now = new Date().toISOString();
    return {
      id: Number(id),
      conversationType: ConversationType.HOSTING, // neutral default
      createdAt: now,
      updatedAt: now,

      // list-related
      lastMessage: null,
      participants: [],
      listing: null,
      trip: null,

      // flags & counters
      unreadCount: 0,
      muted: false,
      archived: false,
      starred: false,

      // VM extras used by UI
      placeImage: null,
      // `location` is optional in ConversationVM; omit or set to undefined
    };
  }

  const pushConversationUrl = useCallback(
    (convId: string) => {
      if (typeof window === 'undefined') return;
      const expected = `${basePath}/${convId}`;
      if (window.location.pathname !== expected) {
        window.history.pushState({ convId }, '', expected);
      }
    },
    [basePath]
  );

  const replaceToBase = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname !== basePath) {
      window.history.pushState({}, '', basePath);
    }
  }, [basePath]);

  const probeConversationExists = useCallback(
    async (chatId: string | number) => {
      try {
        await fetchConversationHistoryASC(chatId, { limit: 1, offset: 0 });
        return true; // If the request succeeds, the conversation exists/accessible.
      } catch {
        return false;
      }
    },
    []
  );

  const selectFirstFromList = useCallback(
    (list: ConversationVM[]) => {
      if (typeof window === 'undefined') return;
      if (isMobile) return;
      if (normalizePath(window.location.pathname) !== basePath) return;
      const first = list?.[0];
      if (!first) return;
      setSelectedConversation(first);
      setRouteId(String(first.id));
      pushConversationUrl(String(first.id));
    },
    [basePath, isMobile, normalizePath, pushConversationUrl]
  );

  const selectByIdDeep = useCallback(
    async (id: string) => {
      setDeepLinkError(null);
      pushConversationUrl(String(id));

      const exists = await probeConversationExists(id);
      if (!exists) {
        setSelectedConversation(null);
        setDeepLinkError(t.messages.errors.couldNotOpenConversation);
        return;
      }

      const foundLocal = listRef.current?.getLocal?.(id);
      if (foundLocal) {
        setSelectedConversation(foundLocal);
        return;
      }

      const minimal = makeGhostVM(id);
      setSelectedConversation(minimal);
    },
    [probeConversationExists, pushConversationUrl]
  );

  // Handle back/forward navigation: deep load on popstate
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onPopState = () => {
      const id = getConversationIdFromPath(window.location.pathname);
      setDeepLinkError(null);
      if (!id) {
        didDeepLinkRef.current = false;
        setSelectedConversation(null);
        setShowTripDetails(false);
        setRouteId(null);
        return;
      }
      setRouteId(id);
      void selectByIdDeep(id);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [getConversationIdFromPath, selectByIdDeep]);

  useEffect(() => {
    if (!routeId) return;
    if (
      selectedConversation &&
      String(selectedConversation.id) === String(routeId)
    )
      return;
    setDeepLinkError(null);
    void selectByIdDeep(routeId);
  }, [routeId, selectByIdDeep, selectedConversation]);

  useEffect(() => {
    async function prefetch() {
      setSelectedListingInfo(null);
      setSelectedTripDetails(null);

      if (!selectedConversation) {
        setLoadingTripDetails(false);
        return;
      }

      const tripId = selectedConversation.trip?.id ?? null;
      const listingId = selectedConversation.listing?.id ?? null;

      if (!tripId && !listingId) {
        setLoadingTripDetails(false);
        return;
      }

      setLoadingTripDetails(true);

      let tripRes: PromiseSettledResult<TripDetail> | undefined;
      let listingRes: PromiseSettledResult<ListingDetail | null> | undefined;

      // Always skip global 404 redirect for these prefetches
      const opts = { skipGlobal404Redirect: true as const };

      if (tripId && listingId) {
        const [tRes, lRes] = await Promise.allSettled([
          getTripDetail(String(tripId), opts),
          fetchListingById(Number(listingId), opts),
        ]);
        tripRes = tRes;
        listingRes = lRes;
      } else if (tripId) {
        [tripRes] = await Promise.allSettled([
          getTripDetail(String(tripId), opts),
        ]);
      } else if (listingId) {
        [listingRes] = await Promise.allSettled([
          fetchListingById(Number(listingId), opts),
        ]);
      }

      if (tripRes && tripRes.status === 'fulfilled') {
        setSelectedTripDetails(tripRes.value);
      }

      if (listingRes && listingRes.status === 'fulfilled') {
        setSelectedListingInfo(listingRes.value);
      }

      setLoadingTripDetails(false);
    }

    void prefetch();
  }, [selectedConversation]);

  // Ensure routeId matches the client URL after hydration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = getConversationIdFromPath(window.location.pathname);
    if (id && id !== routeIdRef.current) {
      setRouteId(id);
    }
  }, [getConversationIdFromPath]);

  // Avoid rendering children that require a number until we have it
  if (currentUserId == null) {
    return (
      <div className="text-neutral flex w-full items-center justify-center py-10"></div>
    );
  }
  if (noConversations) {
    return (
      <div className="text-neutral flex w-full items-center justify-center py-10">
        {t.messages.noConversations}
      </div>
    );
  }

  return (
    <div
      style={{
        height: height,
        minHeight: selectedConversation && isMobile ? '100vh' : undefined,
      }}
      className="flex w-full flex-col overflow-y-auto md:flex-row"
    >
      {(!isMobile || selectedConversation === null) && (
        <div className="flex w-full flex-col px-4 pt-5 md:w-[17rem] md:px-0 md:pr-6 lg:w-[21rem]">
          <div className="sticky top-0 z-10 bg-white pb-3">
            <div className="mb-4 flex items-center justify-start">
              <h2 className="text-2xl leading-8 font-bold">
                {t.messages.title}
              </h2>
            </div>
          </div>
          <div data-scroll-root className="min-h-0 flex-1 overflow-y-auto">
            <ConversationList
              ref={listRef}
              onReady={(allConversations) => {
                if (typeof window === 'undefined') return;

                const rawPath = window.location.pathname;
                const path = normalizePath(rawPath);
                const idInUrl = getConversationIdFromPath(rawPath);

                // If there is an ID in URL → deep link (no auto-select)
                if (idInUrl) {
                  if (!didDeepLinkRef.current) {
                    didDeepLinkRef.current = true;
                    void selectByIdDeep(idInUrl);
                  }
                  return;
                }

                // If NO ID and we are in inbox
                if (!didDeepLinkRef.current && path === basePath) {
                  didDeepLinkRef.current = true;

                  // NEW: render a simple empty state if list is empty
                  if (!allConversations || allConversations.length === 0) {
                    setNoConversations(true);
                    return; // do not auto-select anything
                  }
                  selectFirstFromList(allConversations);
                }
              }}
              onSelect={(conv) => {
                setNoConversations(false);
                setDeepLinkError(null);
                setSelectedListingInfo(null);
                setSelectedTripDetails(null);
                setSelectedConversation(conv);
                setRouteId(String(conv.id));
                pushConversationUrl(String(conv.id));
              }}
              currentUserId={currentUserId}
              lang={lang}
              selectedConversationId={selectedConversation?.id ?? null}
            />
          </div>
        </div>
      )}

      {/* History + Input */}
      <AnimatePresence mode="wait">
        {isMobile && selectedConversation !== null && (
          <motion.div
            key={selectedConversation.id}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed inset-0 z-0 flex h-[100dvh] w-full flex-col bg-white md:hidden"
          >
            <MessageHistory
              ref={historyRef}
              conversation={selectedConversation}
              lang={lang}
              currentUserId={currentUserId}
              participants={selectedConversation.participants}
              onBack={() => {
                setSelectedConversation(null);
                setRouteId(null);
                replaceToBase();
              }}
              onShowTripListingInfo={() => setShowTripDetails(true)}
              loadingTripDetails={loadingTripDetails}
            />
            <MessageInput
              conversationId={selectedConversation.id}
              lang={lang}
              onSend={async (e) => {
                if (e.type === 'text' && typeof e.content === 'string') {
                  await historyRef.current?.sendText(e.content);
                } else if (e.type === 'image' && e.content instanceof File) {
                  await historyRef.current?.sendImage(e.content);
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isMobile && selectedConversation !== null && (
        <div className="hidden h-screen w-full flex-1 flex-col md:flex md:h-auto">
          <MessageHistory
            ref={historyRef}
            conversation={selectedConversation}
            lang={lang}
            currentUserId={currentUserId}
            participants={selectedConversation.participants}
            onBack={() => {
              setSelectedConversation(null);
              setRouteId(null);
              replaceToBase();
            }}
            onShowTripListingInfo={() => setShowTripDetails(true)}
            loadingTripDetails={loadingTripDetails}
          />
          <MessageInput
            conversationId={selectedConversation.id}
            lang={lang}
            onSend={async (e) => {
              if (e.type === 'text' && typeof e.content === 'string') {
                await historyRef.current?.sendText(e.content);
              } else if (e.type === 'image' && e.content instanceof File) {
                await historyRef.current?.sendImage(e.content);
              }
            }}
          />
        </div>
      )}

      {!isMobile && selectedConversation === null && deepLinkError && (
        <div className="hidden h-full w-full flex-1 items-center justify-center md:flex">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-red-600">{deepLinkError}</div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isMobile && !!deepLinkError && (
          <motion.div
            key="deeplink-error-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:hidden"
            aria-live="assertive"
            role="dialog"
            aria-modal="true"
            aria-label={t.common.error}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => {
                setDeepLinkError(null);
                setRouteId(null);
                replaceToBase();
              }}
            />
            {/* Card */}
            <motion.div
              initial={{ y: 24, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 24, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className="relative w-full max-w-sm rounded-2xl bg-[var(--color-base-150)] p-4 shadow-xl"
            >
              <div className="mb-2 text-base font-semibold">
                {deepLinkError}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-primary rounded-full px-4 py-2 text-sm font-medium text-white"
                  onClick={() => {
                    setDeepLinkError(null);
                    setRouteId(null);
                    replaceToBase();
                  }}
                >
                  OK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trip details: only render with real data */}
      <AnimatePresence mode="wait">
        {(!!selectedConversation || !isMobile) &&
          (selectedTripDetails || selectedListingInfo) &&
          showTripDetails &&
          (isMobile ? (
            <motion.div
              key="trip-details-mobile"
              initial={{ y: '100%', opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.7 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed inset-0 z-10 flex h-[100dvh] w-full flex-col overflow-y-auto bg-white shadow-2xl"
              style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
            >
              <ConversationTripDetails
                selectedConversation={selectedConversation}
                tripDetail={selectedTripDetails}
                listingDetail={selectedListingInfo}
                lang={lang}
                onClose={() => setShowTripDetails(false)}
                currentUserId={currentUserId}
              />
            </motion.div>
          ) : (
            <motion.div
              key={
                selectedTripDetails?.title ??
                selectedListingInfo?.title ??
                'trip-details-desktop'
              }
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="relative h-full"
            >
              <ConversationTripDetails
                selectedConversation={selectedConversation}
                tripDetail={selectedTripDetails}
                listingDetail={selectedListingInfo}
                lang={lang}
                onClose={() => setShowTripDetails(false)}
                currentUserId={currentUserId}
              />
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}

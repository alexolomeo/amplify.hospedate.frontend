import React, { forwardRef, useImperativeHandle } from 'react';
import ConversationCard, {
  type ConversationCardAvatar,
} from './ConversationCard';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import {
  getConversationParticipants,
  type WithOptionalPhoto,
} from '@/components/React/Utils/getConversationParticipants';
import { fetchConversations } from '@/services/conversations';
import {
  type ConversationVM,
  getLastMessagePreview,
  mapApiConversationToVM,
} from '@/adapters/messages.ts';
import ConversationCardSkeleton from '@/components/React/Messages/Skeletons/ConversationCardSkeleton.tsx';
// TODO: uncomment when decide the behavior of this list
// import { getConversationChannelName } from '@/services/realtime/channels';
// import { useAblyChannels } from '@/components/React/Hooks/useAblyChannel';
// import { fetchConversationById } from '@/services/conversations';
// import type { UserMessageDTO } from '@/types/realtime';
import { LayoutGroup, motion } from 'framer-motion';
import { formatFriendlyDateRange } from '@/utils/dateUtils.ts';

export interface ConversationListApi {
  getLocal: (id: string | number) => ConversationVM | undefined;
  setForceLoading: (v: boolean) => void;
}

interface ConversationListProps {
  onSelect: (conversation: ConversationVM) => void;
  currentUserId: number;
  lang?: SupportedLanguages;
  onReady?: (conversations: ConversationVM[]) => void;
  selectedConversationId?: number | null;
}

const LIMIT = 10 as const;

function buildAvatarsFromParticipants(
  participants: ConversationVM['participants'],
  currentUserId: number
): ConversationCardAvatar[] {
  return participants
    .filter((p) => p.id !== currentUserId)
    .slice(0, 2)
    .map((p) => ({
      photo: p.photo ?? null,
      username: p.name ?? null,
    }));
}

const ConversationList = forwardRef<ConversationListApi, ConversationListProps>(
  function ConversationList(
    { onSelect, currentUserId, lang = 'es', onReady, selectedConversationId },
    ref
  ) {
    const t = getTranslation(lang);

    const [conversations, setConversations] = React.useState<ConversationVM[]>(
      []
    );
    const [selectedId, setSelectedId] = React.useState<number | null>(null);
    const [initialLoading, setInitialLoading] = React.useState(true);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const [forceLoading, setForceLoading] = React.useState(false);

    const isFetchingRef = React.useRef(false);
    const offsetRef = React.useRef(0);

    const conversationsRef = React.useRef<ConversationVM[]>([]);
    // TODO: uncomment when decide the behavior of this list
    // const setAndSyncRef = (
    //   updater: (prev: ConversationVM[]) => ConversationVM[]
    // ) => {
    //   setConversations((prev) => {
    //     const next = updater(prev);
    //     conversationsRef.current = next;
    //     return next;
    //   });
    // };
    const hasMoreRef = React.useRef(true);

    const [error, setError] = React.useState<string | null>(null);
    const calledReadyRef = React.useRef(false);
    const sentinelRef = React.useRef<HTMLDivElement | null>(null);

    // const [highlightedId, setHighlightedId] = React.useState<number | null>(
    //   null
    // );

    React.useEffect(() => {
      setSelectedId(selectedConversationId ?? null);
    }, [selectedConversationId]);

    const retryFirstPage = async (): Promise<void> => {
      setError(null);
      setConversations([]);
      conversationsRef.current = [];
      offsetRef.current = 0;
      setHasMore(true);
      hasMoreRef.current = true;
      await fetchNextPage();
    };

    // TODO: uncomment when decide the behavior of this list
    // function promoteWithHighlight(incoming: ConversationVM) {
    //   setHighlightedId(incoming.id);
    //   setAndSyncRef((prev) => {
    //     const filtered = prev.filter((c) => c.id !== incoming.id);
    //     return [incoming, ...filtered];
    //   });
    //   // Clear highlight after a short delay
    //   window.setTimeout(
    //     () => setHighlightedId((id) => (id === incoming.id ? null : id)),
    //     900
    //   );
    // }

    React.useEffect(() => {
      if (!calledReadyRef.current && !initialLoading) {
        calledReadyRef.current = true;
        onReady?.(conversations);
      }
    }, [initialLoading, conversations, onReady]);

    const fetchNextPage = React.useCallback(async (): Promise<void> => {
      if (isFetchingRef.current || !hasMoreRef.current) return;

      const nextOffset = offsetRef.current;
      isFetchingRef.current = true;

      if (nextOffset === 0) {
        setError(null);
        setInitialLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const data = await fetchConversations({
          limit: LIMIT,
          offset: nextOffset,
        });
        const mapped = (data.results ?? []).map(mapApiConversationToVM);

        setConversations((prev) => {
          const map = new Map<number, ConversationVM>(
            prev.map((c) => [c.id, c])
          );
          for (const item of mapped) map.set(item.id, item);
          const merged = Array.from(map.values());
          conversationsRef.current = merged;
          return merged;
        });

        offsetRef.current = nextOffset + LIMIT;

        const more = data.next !== null && mapped.length > 0;
        setHasMore(more);
        hasMoreRef.current = more;
      } catch {
        setError('No se pudieron cargar las conversaciones.');
        setHasMore(false);
        hasMoreRef.current = false;
      } finally {
        isFetchingRef.current = false;
        setInitialLoading(false);
        setLoadingMore(false);
      }
    }, []);

    useImperativeHandle(
      ref,
      (): ConversationListApi => ({
        getLocal: (id) =>
          conversationsRef.current.find((c) => String(c.id) === String(id)),
        setForceLoading: (v) => setForceLoading(v),
      }),
      []
    );

    React.useEffect(() => {
      let cancelled = false;
      (async () => {
        if (!cancelled) await fetchNextPage();
      })();
      return () => {
        cancelled = true;
      };
    }, [fetchNextPage]);

    React.useEffect(() => {
      const el = sentinelRef.current;
      if (!el || !hasMoreRef.current) return;

      const handler: IntersectionObserverCallback = ([entry]) => {
        if (
          entry.isIntersecting &&
          !isFetchingRef.current &&
          hasMoreRef.current
        ) {
          fetchNextPage();
        }
      };

      const io = new IntersectionObserver(handler, {
        root: null,
        rootMargin: '400px',
        threshold: 0,
      });
      io.observe(el);
      return () => io.disconnect();
    }, [fetchNextPage]);

    function handleSelect(conversation: ConversationVM): void {
      setSelectedId(conversation.id);
      onSelect(conversation);
    }

    const showInitialLoader =
      conversationsRef.current.length === 0 && (initialLoading || forceLoading);

    // TODO: uncomment when decide the behavior of this list
    // Build channel list for currently loaded conversations
    // const channelNames = React.useMemo(
    //   () => conversationsRef.current.map((c) => getConversationChannelName(c)),
    //   [conversations] // triggers recalculation when list changes
    // );

    // Handle Ably 'new_message' events for any of the channels we listen to
    // useAblyChannels(
    //   channelNames,
    //   (msg) => {
    //     try {
    //       const data =
    //         typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
    //       const payload = (data ?? {}) as Partial<UserMessageDTO>;
    //
    //       const chatId = payload.chat_id;
    //       if (!chatId) return;
    //
    //       // Build a minimal "incoming conversation view" to update lastMessage
    //       const incomingLast =
    //         payload.sent_at || payload.created_at || new Date().toISOString();
    //
    //       // If the conversation is already in-memory: promote using current data + new lastMessage
    //       const local = conversationsRef.current.find((c) => c.id === chatId);
    //       if (local) {
    //         const promoted: ConversationVM = {
    //           ...local,
    //           lastMessage: {
    //             id: payload.id ?? local.lastMessage?.id ?? -1,
    //             messageType: 'USER',
    //             content: payload.content ?? local.lastMessage?.content ?? '',
    //             media: payload.media ?? undefined,
    //             createdAt: incomingLast,
    //             senderId:
    //               payload.sender_id ?? local.lastMessage?.senderId ?? null,
    //           },
    //           updatedAt: incomingLast,
    //         };
    //         promoteWithHighlight(promoted);
    //         return;
    //       }
    //
    //       // Not in the current page(s): fetch lightweight and insert on top
    //       (async () => {
    //         try {
    //           const fresh = await fetchConversationById(Number(chatId));
    //           // Ensure lastMessage reflects the event if backend returns stale data
    //           const withForcedLast: ConversationVM = {
    //             ...fresh,
    //             lastMessage: {
    //               id: payload.id ?? fresh.lastMessage?.id ?? -1,
    //               messageType: 'USER',
    //               content: payload.content ?? fresh.lastMessage?.content ?? '',
    //               media: payload.media ?? fresh.lastMessage?.media,
    //               createdAt: incomingLast,
    //               senderId:
    //                 payload.sender_id ?? fresh.lastMessage?.senderId ?? null,
    //             },
    //             updatedAt: incomingLast,
    //           };
    //           promoteWithHighlight(withForcedLast);
    //         } catch (e) {
    //           console.error(
    //             '[Conversations][fetchConversationById] failed:',
    //             e
    //           );
    //         }
    //       })();
    //     } catch (e) {
    //       console.error('[Ably][ConversationList] handler failed:', e);
    //     }
    //   },
    //   { events: ['new_message'] }
    // );

    return (
      <div className="flex flex-col gap-2">
        {showInitialLoader && (
          <div className="flex flex-col gap-2 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <ConversationCardSkeleton key={i} />
            ))}
          </div>
        )}

        {conversations.length === 0 && error && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="text-red-600">{t.messages.errors.failLoad}</div>
            <button
              onClick={retryFirstPage}
              className="bg-primary hover:bg-secondary cursor-pointer rounded-full px-4 py-2 text-white"
            >
              {t.messages.errors.retry}
            </button>
          </div>
        )}
        <LayoutGroup>
          {conversations.map((conv) => {
            const participantsForPreview: WithOptionalPhoto[] =
              conv.participants.map((p) => ({
                id: p.id,
                name: p.name,
                avatar: p.photo?.original ?? '',
                photo: p.photo ?? null,
                participantType: p.participantType,
              }));

            const { name } = getConversationParticipants(
              participantsForPreview,
              currentUserId,
              t
            );

            const avatars = buildAvatarsFromParticipants(
              conv.participants,
              currentUserId
            );

            const lastMessage = conv.lastMessage;
            if (!lastMessage) return null;

            let messageSender: string | undefined;
            if (lastMessage.senderId != null) {
              const sender = conv.participants.find(
                (p) => p.id === lastMessage.senderId
              );
              messageSender =
                lastMessage.senderId === currentUserId
                  ? t.messages.you
                  : sender?.name;
            }

            const date =
              formatFriendlyDateRange(
                conv.trip?.checkInDate ?? null,
                conv.trip?.checkOutDate ?? null,
                lang
              ) ?? '';

            return (
              <motion.div
                key={conv.id}
                layout
                layoutId={`conv-${conv.id}`}
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: 520,
                  damping: 38,
                  mass: 0.55,
                }}
                // TODO: uncomment when decide the behavior of this list
                // animate={{
                //   backgroundColor:
                //     highlightedId === conv.id
                //       ? 'rgba(109, 158, 54, 0.40)'
                //       : 'rgba(0,0,0,0)',
                // }}
                className="rounded-2xl"
              >
                <ConversationCard
                  name={name}
                  placeImage={conv.placeImage}
                  avatars={avatars}
                  message={getLastMessagePreview(lastMessage, lang)}
                  messageType={lastMessage.messageType}
                  messageSender={messageSender}
                  date={date}
                  location={conv.location ?? ''}
                  onClick={() => handleSelect(conv)}
                  selected={selectedId === conv.id}
                />
              </motion.div>
            );
          })}
        </LayoutGroup>

        <div ref={sentinelRef} className="h-2" />

        {hasMore && loadingMore && (
          <div className="flex flex-col gap-2 py-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <ConversationCardSkeleton key={i} />
            ))}
          </div>
        )}
        {conversations.length > 0 && error && (
          <div className="flex items-center justify-between gap-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            <span>{t.messages.errors.failLoad}</span>
            <button
              onClick={async () => {
                setError(null);
                setHasMore(true);
                hasMoreRef.current = true;
                await fetchNextPage();
              }}
              className="cursor-pointer underline"
            >
              {t.messages.errors.retry}
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default ConversationList;

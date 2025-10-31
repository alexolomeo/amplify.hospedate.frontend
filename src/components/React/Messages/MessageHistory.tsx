import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import {
  fetchConversationHistoryASC,
  sendImageMessage,
  sendTextMessage,
} from '@/services/conversations';

import type { ConversationVM, HistoryMessageVM } from '@/adapters/messages';
import { mapApiMessageToVM } from '@/adapters/messages';
import type {
  MediaPicture,
  Participant,
  SendImageMessageResponse,
  SendTextMessageResponse,
} from '@/types/message';
import { MessageType } from '@/types/message';

import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import {
  getConversationParticipants,
  type WithOptionalPhoto,
} from '@/components/React/Utils/getConversationParticipants';
import '@/styles/message.css';
import { AnimatePresence } from 'framer-motion';
import MessageHistorySkeleton from '@/components/React/Messages/Skeletons/MessageHistorySkeleton.tsx';
import MessageBubbleSkeleton from '@/components/React/Messages/Skeletons/MessageBubbleSkeleton.tsx';
import AvatarDisplay from '@/components/React/Common/AvatarDisplay';
import { mediaPictureToPhoto } from '@/adapters/image.ts';
import { useAblyChannel } from '@/components/React/Hooks/useAblyChannel';
import type { UserMessageDTO } from '@/types/realtime';
import { getConversationChannelName } from '@/services/realtime/channels.ts';
import { mapUserMessageDTOToHistoryVM } from '@/adapters/realtime.ts';
import ChatHeader from '@/components/React/Messages/MessageHistory/ChatHeader.tsx';
import MessageBubble from '@/components/React/Messages/MessageHistory/MessageBubble.tsx';
import ImageViewer from '@/components/React/Messages/MessageHistory/ImageViewer.tsx';
import ScrollToBottomButton from '@/components/React/Messages/MessageHistory/ScrollToBottomButton.tsx';

export interface MessageHistoryApi {
  sendText: (content: string) => Promise<void>;
  sendImage: (file: File) => Promise<void>;
}

interface Props {
  lang?: SupportedLanguages;
  conversation: ConversationVM | null;
  currentUserId: number;
  participants: Participant[];
  onBack: () => void;
  onShowTripListingInfo: () => void;
  loadingTripDetails?: boolean;
}

const localeMap: Record<SupportedLanguages, string> = {
  es: 'es-BO',
  en: 'en-US',
};

type LocalDelivery =
  | { status: 'sending'; tempId: number; file?: File }
  | { status: 'sent' }
  | { status: 'error'; tempId: number; file?: File };

function getLocalFile(ld?: LocalDelivery): File | undefined {
  return ld && (ld.status === 'sending' || ld.status === 'error')
    ? ld.file
    : undefined;
}

function getBottomGap(el: HTMLElement | null): number {
  if (!el) return 0;
  return el.scrollHeight - el.scrollTop - el.clientHeight;
}

function getScrolledUpRatio(el: HTMLElement | null): number {
  if (!el) return 0;
  const scrollable = el.scrollHeight - el.clientHeight;
  if (scrollable <= 0) return 0;
  const gap = Math.max(el.scrollHeight - el.scrollTop - el.clientHeight, 0);
  return Math.min(gap / scrollable, 1);
}

type HistoryBubble = HistoryMessageVM & { _local?: LocalDelivery };

const EMPTY_IMG_SRC = '/images/messages/empty-message.svg';
const PAGE_SIZE = 20 as const;
const TOP_TRIGGER_PX = 64 as const;
const USER_SCROLL_UP_PX = 48 as const;

const MessageHistory = forwardRef<MessageHistoryApi, Props>(
  function MessageHistory(
    {
      conversation,
      lang = 'es',
      currentUserId,
      participants,
      onBack,
      onShowTripListingInfo,
      loadingTripDetails,
    }: Props,
    ref
  ) {
    const t = getTranslation(lang);

    // State
    const [messages, setMessages] = React.useState<HistoryBubble[]>([]);
    const [loadingInitial, setLoadingInitial] = React.useState(false);
    const [loadingOlder, setLoadingOlder] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [viewer, setViewer] = React.useState<null | {
      msg: HistoryBubble;
      photo?: MediaPicture;
      file?: File;
    }>(null);
    const [viewerObjectUrl, setViewerObjectUrl] = React.useState<string | null>(
      null
    );
    const [showScrollToBottom, setShowScrollToBottom] = React.useState(false);
    const [newIncomingCount, setNewIncomingCount] = React.useState(0);

    // Pagination state (backward: older pages)
    const [offset, setOffset] = React.useState(0);
    const [hasMoreOlder, setHasMoreOlder] = React.useState(true);
    const [pagingReady, setPagingReady] = React.useState(false);

    // Refs for fine-grained control
    const isFetchingRef = React.useRef(false);
    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const topSentinelRef = React.useRef<HTMLDivElement | null>(null);
    const didScrollToBottomRef = React.useRef(false);
    const [olderError, setOlderError] = React.useState<string | null>(null);
    const [userScrolledUp, setUserScrolledUp] = React.useState(false);
    const lastScrollTopRef = React.useRef(0);

    const lastAppendedIdRef = React.useRef<number | null>(null);
    const [showLoadingTripDetails, setShowLoadingTripDetails] =
      React.useState(false);

    const participantById = React.useMemo(
      () => new Map(participants.map((p) => [p.id, p])),
      [participants]
    );

    const getSenderName = React.useCallback(
      (id?: number): string | undefined => {
        return id ? participantById.get(id)?.name : undefined;
      },
      [participantById]
    );

    const getAvatarDataByUserId = (
      id?: number
    ): { photo: MediaPicture | null; username: string | null } => {
      if (!id) return { photo: null, username: null };
      const p = participantById.get(id);
      return { photo: p?.photo ?? null, username: p?.name ?? null };
    };

    const loadInitialHistory = React.useCallback(async () => {
      setLoadingInitial(true);
      setError(null);
      setOlderError(null);
      setHasMoreOlder(true);
      setOffset(0);
      didScrollToBottomRef.current = false;
      isFetchingRef.current = false;
      lastAppendedIdRef.current = null;

      if (!conversation?.id) {
        setLoadingInitial(false);
        return;
      }

      try {
        // With DESC API, offset=0 already returns the newest messages
        const page = await fetchConversationHistoryASC(conversation.id, {
          limit: PAGE_SIZE,
          offset: 0,
        });

        const mapped = (page.results ?? []).map((m) =>
          mapApiMessageToVM(m, currentUserId)
        );

        setMessages(mapped);

        // Keep track of current "offset window". For DESC, older messages live at higher offsets.
        setOffset(0);

        // If `next` exists, there are older messages to fetch
        setHasMoreOlder(Boolean(page.next));
      } catch {
        setError('Failed to load messages');
        setHasMoreOlder(false);
      } finally {
        setLoadingInitial(false);
      }
    }, [conversation?.id, currentUserId]);

    // Initial + on conversation change
    React.useEffect(() => {
      void loadInitialHistory();
    }, [loadInitialHistory]);

    function openImageViewer(msg: HistoryBubble): void {
      setViewer({
        msg,
        photo: msg.media,
        file: getLocalFile(msg._local),
      });
    }

    const mapSendImageResponseToVM = React.useCallback(
      (r: SendImageMessageResponse): HistoryMessageVM => ({
        id: r.id,
        messageType: MessageType.USER,
        content: undefined,
        media: r.media ?? undefined,
        createdAt: r.createdAt,
        sentAt: r.sentAt,
        sender: { id: r.senderId, name: getSenderName(r.senderId) ?? '' },
        readAt: null,
        deliveredAt: null,
        systemType: null,
      }),
      [getSenderName]
    );

    const mapSendTextResponseToVM = React.useCallback(
      (r: SendTextMessageResponse): HistoryMessageVM => ({
        id: r.id,
        messageType: MessageType.USER,
        content: r.content,
        media: undefined,
        createdAt: r.createdAt,
        sentAt: r.sentAt,
        sender: { id: r.senderId, name: getSenderName(r.senderId) ?? '' },
        readAt: null,
        deliveredAt: null,
        systemType: null,
      }),
      [getSenderName]
    );

    const scrollToBottom = React.useCallback((): void => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }, []);

    const scrollToBottomNextTick = React.useCallback((): void => {
      requestAnimationFrame(scrollToBottom);
    }, [scrollToBottom]);

    const isAtBottom = React.useCallback((): boolean => {
      const el = scrollRef.current;
      if (!el) return true;
      const threshold = 32;
      return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    }, []);

    const closeViewer = (): void => setViewer(null);

    React.useEffect(() => {
      if (!viewer) return;
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeViewer();
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', onKey);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKey);
      };
    }, [viewer]);

    React.useEffect(() => {
      // Do not force-scroll when loading older pages
      if (loadingOlder) return;

      const last = messages.length ? messages[messages.length - 1].id : null;
      if (last === null || last === lastAppendedIdRef.current) return;

      lastAppendedIdRef.current = last;

      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (!el) return;

        // Do not auto-scroll if the "down arrow" should be visible (>=15% from bottom)
        // or is currently visible (defensive double-check).
        const ratio = getScrolledUpRatio(el);
        if (showScrollToBottom || ratio >= 0.15) return;

        // Safe to snap to bottom (user is effectively at/near bottom)
        el.scrollTop = el.scrollHeight;
      });
    }, [messages, loadingOlder, showScrollToBottom]);

    // Hide global header on mobile while in chat
    useEffect(() => {
      document.body.classList.add('hide-global-header-mobile');
      return () => {
        document.body.classList.remove('hide-global-header-mobile');
      };
    }, []);

    useAblyChannel(
      conversation ? getConversationChannelName(conversation) : '',
      (msg) => {
        try {
          const data = msg?.data as Partial<UserMessageDTO> | undefined;
          if (!data) return;

          // Guard: ensure it belongs to this conversation
          if (conversation?.id && data.chat_id !== conversation.id) {
            return;
          }

          // Only treat as message when payload.type === 'USER'
          // TODO: refactor this
          if (data.type !== 'USER') {
            return;
          }

          // Map and merge
          const mapped = mapUserMessageDTOToHistoryVM(
            data as UserMessageDTO,
            currentUserId,
            getSenderName
          );

          setMessages((prev) => {
            // Deduplicate by id
            if (prev.some((m) => m.id === mapped.id)) return prev;
            return [...prev, mapped];
          });

          // Decide scroll behavior using the same 15% rule used by the scroll listener
          const el = scrollRef.current;
          const gap = getBottomGap(el);
          const ratio = getScrolledUpRatio(el); // 0..1 from bottom

          // If user is sufficiently away from bottom (>=15%), do NOT autoscroll
          if (ratio >= 0.15) {
            // User is away from bottom: accumulate counter and ensure arrow is visible
            setNewIncomingCount((n) => n + 1);
            setShowScrollToBottom(true);
          } else {
            // Near bottom: allow a gentle autoscroll if really close (<= ~70px)
            if (gap <= 70) {
              requestAnimationFrame(smoothScrollToBottom);
              setNewIncomingCount(0);
            } else {
              // Edge case: ratio < 0.15 but still not close enough; treat as away
              setNewIncomingCount((n) => n + 1);
              setShowScrollToBottom(true);
            }
          }
        } catch (err) {
          console.error('[Event][ERR] handler failed:', err);
        }
      },
      { events: ['new_message'] }
    );

    const sendText = React.useCallback(
      async (content: string) => {
        if (!conversation?.id) return;
        const trimmed = content.trim();
        if (!trimmed) return;

        const tempId = -Date.now();
        const nowIso = new Date().toISOString();
        const stickToBottom = isAtBottom();

        const optimistic: HistoryBubble = {
          id: tempId,
          messageType: MessageType.USER,
          content: trimmed,
          media: undefined,
          createdAt: nowIso,
          sentAt: nowIso,
          sender: {
            id: currentUserId,
            name: getSenderName(currentUserId) ?? '',
          },
          readAt: null,
          deliveredAt: null,
          systemType: null,
          _local: { status: 'sending', tempId },
        };
        setMessages((prev) => [...prev, optimistic]);
        if (stickToBottom) requestAnimationFrame(scrollToBottom);

        try {
          const resp = await sendTextMessage(conversation.id, {
            content: trimmed,
          });
          const real = mapSendTextResponseToVM(resp);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...real, _local: { status: 'sent' } } : m
            )
          );
          if (stickToBottom) requestAnimationFrame(scrollToBottom);
        } catch {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId
                ? { ...m, _local: { status: 'error', tempId } }
                : m
            )
          );
          scrollToBottomNextTick();
        }
      },
      [
        conversation?.id,
        isAtBottom,
        currentUserId,
        getSenderName,
        scrollToBottom,
        mapSendTextResponseToVM,
        scrollToBottomNextTick,
      ]
    );

    const sendImage = React.useCallback(
      async (file: File) => {
        if (!conversation?.id) return;

        const tempId = -Date.now();
        const nowIso = new Date().toISOString();
        const stickToBottom = isAtBottom();

        // Temporary blob URL while waiting for server media
        const objectUrl = URL.createObjectURL(file);

        const optimistic: HistoryBubble = {
          id: tempId,
          messageType: MessageType.USER,
          content: undefined,
          media: {
            original: objectUrl,
            srcsetAvif: objectUrl,
            srcsetWebp: objectUrl,
          },
          createdAt: nowIso,
          sentAt: nowIso,
          sender: {
            id: currentUserId,
            name: getSenderName(currentUserId) ?? '',
          },
          readAt: null,
          deliveredAt: null,
          systemType: null,
          _local: { status: 'sending', tempId, file },
        };

        setMessages((prev) => [...prev, optimistic]);
        if (stickToBottom) requestAnimationFrame(scrollToBottom);

        try {
          const resp = await sendImageMessage(conversation.id, file);
          const real = mapSendImageResponseToVM(resp);
          URL.revokeObjectURL(objectUrl);

          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...real, _local: { status: 'sent' } } : m
            )
          );
          if (stickToBottom) requestAnimationFrame(scrollToBottom);
        } catch {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId
                ? { ...m, _local: { status: 'error', tempId, file } }
                : m
            )
          );
        }
      },
      [
        conversation?.id,
        currentUserId,
        mapSendImageResponseToVM,
        isAtBottom,
        scrollToBottom,
        getSenderName,
      ]
    );

    useImperativeHandle(ref, () => ({ sendText, sendImage }), [
      sendText,
      sendImage,
    ]);

    const retrySend = async (failedTempId: number): Promise<void> => {
      if (!conversation?.id) return;

      const failed = messages.find((m) => m.id === failedTempId);
      if (!failed) return;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === failedTempId
            ? {
                ...m,
                _local: {
                  status: 'sending',
                  tempId: failedTempId,
                  file: getLocalFile(failed._local),
                },
              }
            : m
        )
      );

      try {
        if (getLocalFile(failed._local)) {
          const resp = await sendImageMessage(
            conversation.id,
            getLocalFile(failed._local)!
          );
          const real = mapSendImageResponseToVM(resp);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === failedTempId
                ? { ...real, _local: { status: 'sent' } }
                : m
            )
          );
        } else {
          const resp = await sendTextMessage(conversation.id, {
            content: failed.content ?? '',
          });
          const real = mapSendTextResponseToVM(resp);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === failedTempId
                ? { ...real, _local: { status: 'sent' } }
                : m
            )
          );
        }
        requestAnimationFrame(scrollToBottom);
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === failedTempId
              ? {
                  ...m,
                  _local: {
                    status: 'error',
                    tempId: failedTempId,
                    file: getLocalFile(failed._local),
                  },
                }
              : m
          )
        );
      }
    };

    // Smoothly scroll to bottom
    const smoothScrollToBottom = React.useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, []);

    // Reveal newest messages, clear badges/flags
    const revealNewest = React.useCallback(() => {
      setNewIncomingCount(0);
      smoothScrollToBottom();
    }, [smoothScrollToBottom]);

    const handleClickShowTripDetails = (): void => {
      setShowLoadingTripDetails(true);
      onShowTripListingInfo();
    };
    React.useEffect(() => {
      if (!loadingTripDetails) setShowLoadingTripDetails(false);
    }, [loadingTripDetails]);

    const participantsPreview = React.useMemo<WithOptionalPhoto[]>(
      () =>
        participants.map((p) => ({
          id: p.id,
          name: p.name,
          avatar: p.photo?.original ?? '',
          photo: p.photo ?? null,
          participantType: p.participantType,
        })),
      [participants]
    );

    const headerAvatars = React.useMemo(
      () => participants.filter((p) => p.id !== currentUserId).slice(0, 2),
      [participants, currentUserId]
    );

    // After initial load, scroll to bottom once
    React.useEffect(() => {
      if (loadingInitial) return;
      if (didScrollToBottomRef.current) return;
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
      didScrollToBottomRef.current = true;
      lastScrollTopRef.current = el.scrollTop;
      setPagingReady(true);
      setShowScrollToBottom(false); // ensure hidden after initial snap
    }, [loadingInitial, messages.length]);

    React.useEffect(() => {
      if (!viewer?.file) {
        setViewerObjectUrl(null);
        return;
      }
      const url = URL.createObjectURL(viewer.file);
      setViewerObjectUrl(url);

      // Revoke when file changes or on unmount
      return () => {
        URL.revokeObjectURL(url);
        setViewerObjectUrl(null);
      };
    }, [viewer?.file]);

    // Fetch older page when top sentinel becomes visible
    const fetchOlder = React.useCallback(async (): Promise<void> => {
      if (!conversation?.id) return;
      if (!hasMoreOlder) return;
      if (isFetchingRef.current) return;
      if (olderError) return;

      // For DESC API: older messages are at higher offsets
      const nextOffset = offset + PAGE_SIZE;

      const sc = scrollRef.current;
      const prevScrollHeight = sc?.scrollHeight ?? 0;
      const prevScrollTop = sc?.scrollTop ?? 0;

      isFetchingRef.current = true;
      setLoadingOlder(true);
      setOlderError(null);
      try {
        const data = await fetchConversationHistoryASC(conversation.id, {
          limit: PAGE_SIZE,
          offset: nextOffset,
        });

        const mapped = (data.results ?? []).map((m) =>
          mapApiMessageToVM(m, currentUserId)
        );

        setMessages((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          const older = mapped.filter((m) => !ids.has(m.id));
          // PREPEND older messages so they appear ABOVE the current ones
          return [...older, ...prev];
        });

        setOffset(nextOffset);
        setHasMoreOlder(Boolean(data.next));

        requestAnimationFrame(() => {
          const newH = sc?.scrollHeight ?? prevScrollHeight;
          if (sc) sc.scrollTop = prevScrollTop + (newH - prevScrollHeight);
        });
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar más mensajes.';
        setOlderError(msg);
      } finally {
        setLoadingOlder(false);
        isFetchingRef.current = false;
      }
    }, [conversation?.id, currentUserId, hasMoreOlder, offset, olderError]);

    React.useEffect(() => {
      const root = scrollRef.current;
      const target = topSentinelRef.current;
      if (!root || !target) return;
      if (!pagingReady) return;
      if (!hasMoreOlder) return;
      if (olderError) return;

      const onIntersect: IntersectionObserverCallback = (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        if ((root.scrollTop ?? 9999) > TOP_TRIGGER_PX) return;
        if (!loadingInitial && !loadingOlder) {
          void fetchOlder();
        }
      };

      const io = new IntersectionObserver(onIntersect, {
        root,
        threshold: 1,
        rootMargin: '0px',
      });

      io.observe(target);
      return () => io.disconnect();
    }, [
      fetchOlder,
      hasMoreOlder,
      loadingInitial,
      loadingOlder,
      olderError,
      pagingReady,
      userScrolledUp,
    ]);

    // ---- listen for real upward scrolling to "arm" pagination ----
    React.useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;

      // Only care after initial layout is ready
      if (!pagingReady) return;

      const onScroll = () => {
        const prev = lastScrollTopRef.current || 0;
        const cur = el.scrollTop;

        // User scrolled up by a meaningful delta -> allow pagination
        if (cur < prev - USER_SCROLL_UP_PX) {
          setUserScrolledUp(true);
        }

        const ratio = getScrolledUpRatio(el);
        // Show when user has scrolled up >= 15% from bottom
        setShowScrollToBottom(ratio >= 0.15);

        // If user reached bottom, clear the counter
        if (getBottomGap(el) <= 8) {
          setNewIncomingCount(0);
        }

        lastScrollTopRef.current = cur;
      };

      el.addEventListener('scroll', onScroll, { passive: true });
      return () => el.removeEventListener('scroll', onScroll);
    }, [pagingReady]);

    const goToBottomTitle = React.useMemo(() => {
      if (newIncomingCount > 0) {
        const tpl =
          newIncomingCount === 1
            ? t.messages.goToBottomWithCount_one
            : t.messages.goToBottomWithCount_other;
        return tpl.replace('{count}', String(newIncomingCount));
      }
      return t.messages.goToBottom;
    }, [newIncomingCount, t.messages]);

    const isSkeletonHeader = participants.length === 0;

    const headerAvatarElement = isSkeletonHeader ? (
      <div className="flex gap-2">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
      </div>
    ) : (
      headerAvatars.map((p, i) => (
        <div
          key={p.id ?? i}
          className="border-base-200 -ml-3 h-10 w-10 overflow-hidden rounded-full border-2 first:ml-0"
          style={{ zIndex: 10 - i }}
        >
          <AvatarDisplay
            profilePicture={p.photo ? mediaPictureToPhoto(p.photo) : null}
            username={p.name ?? null}
            size="h-10 w-10"
            sizeText="text-base"
          />
        </div>
      ))
    );

    // ---------- Render ----------
    if (!conversation?.id) {
      return (
        <div className="flex flex-1 items-center justify-center px-4 text-gray-400 select-none md:px-0">
          {t.messages.selectConversation}
        </div>
      );
    }

    if (loadingInitial) {
      return (
        <div className="flex h-screen flex-1 flex-col px-4 md:h-auto md:px-0">
          <div className="md:bg-base-100 hidden w-full md:sticky md:top-0 md:z-10 md:flex md:items-center md:justify-between md:border-b md:border-gray-200 md:py-6">
            <div className="w-20" />
            <div className="flex flex-col items-center text-center">
              <div className="h-4 w-40 animate-pulse rounded bg-gray-200 [animation-duration:.8s]" />
              <div className="mx-auto mt-2 h-3 w-28 animate-pulse rounded bg-gray-200 [animation-duration:.8s]" />
            </div>
            <div className="w-20">
              <div className="h-7 w-20 animate-pulse rounded-full bg-gray-200 [animation-duration:.8s]" />
            </div>
          </div>

          <div className="overflow-y-auto px-4 md:px-10">
            <div className="h-6" />
            <MessageHistorySkeleton count={8} />
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center md:px-0">
          <div className="text-red-600">{t.messages.errors.failLoad}</div>
          <button
            onClick={loadInitialHistory}
            className="bg-primary hover:bg-secondary cursor-pointer rounded-full px-4 py-2 text-white"
          >
            {t.messages.errors.retry}
          </button>
        </div>
      );
    }

    if (!messages || messages.length === 0) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center px-4 select-none md:px-0">
          <img
            src={EMPTY_IMG_SRC}
            alt={t.messages.startConversation}
            className="mb-6 h-40 w-40 opacity-70"
          />
          <div className="font-primary text-center text-lg text-gray-500">
            {t.messages.startConversation}
          </div>
        </div>
      );
    }

    return (
      <div className="relative flex h-full flex-1 flex-col overflow-y-auto">
        <ChatHeader
          isSkeleton={isSkeletonHeader}
          title={
            getConversationParticipants(participantsPreview, currentUserId, t)
              .name
          }
          checkInDate={conversation.trip?.checkInDate ?? null}
          checkOutDate={conversation.trip?.checkOutDate ?? null}
          location={conversation.location ?? null}
          headerAvatars={headerAvatarElement}
          onBack={onBack}
          onShowTripListingInfo={handleClickShowTripDetails}
          loadingTripDetails={!!loadingTripDetails}
          showLoadingTripDetails={showLoadingTripDetails}
          actionLabel={t.messages.showTripDetails}
          backAriaLabel={t.common.back}
        />
        {/* Chat content (scroll root) */}
        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-4 md:px-10"
        >
          {/* Sentinel + loader top */}
          {userScrolledUp && <div ref={topSentinelRef} className="h-6" />}

          {olderError && (
            <div className="mb-2 flex items-center justify-between gap-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              <span>{t.messages.errors.failLoad}</span>
              <button
                onClick={() => {
                  setOlderError(null);
                  void fetchOlder();
                }}
                className="cursor-pointer underline"
              >
                {t.messages.errors.retry}
              </button>
            </div>
          )}

          {hasMoreOlder && loadingOlder && !olderError && (
            <div className="flex w-full flex-col gap-2 py-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <MessageBubbleSkeleton
                  key={i}
                  align={i % 2 === 0 ? 'left' : 'right'}
                  showAvatar
                />
              ))}
            </div>
          )}

          <div className="flex flex-col pt-2">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => {
                const isMe = msg.sender?.id === currentUserId;
                const prevMsg = i > 0 ? messages[i - 1] : null;
                const isFirstOfBlock =
                  !prevMsg || prevMsg.sender?.id !== msg.sender?.id;
                const timeLabel = new Date(msg.createdAt).toLocaleTimeString(
                  localeMap[lang as SupportedLanguages] || 'es-BO',
                  { hour: '2-digit', minute: '2-digit' }
                );
                return (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    isMe={isMe}
                    isFirstOfBlock={isFirstOfBlock}
                    timeLabel={timeLabel}
                    onOpenImage={openImageViewer}
                    onRetry={retrySend}
                    avatar={getAvatarDataByUserId(msg.sender?.id)}
                    lang={lang}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Fullscreen Image Viewer */}
        <ImageViewer
          open={Boolean(viewer)}
          onClose={() => setViewer(null)}
          sender={viewer ? getAvatarDataByUserId(viewer.msg.sender?.id) : null}
          objectUrl={viewer?.file ? (viewerObjectUrl ?? undefined) : undefined}
          photo={!viewer?.file ? viewer?.photo : undefined}
        />
        {/* Bottom-right: "Scroll to bottom" arrow with the counter badge */}
        <ScrollToBottomButton
          visible={showScrollToBottom}
          count={newIncomingCount}
          title={goToBottomTitle}
          onClick={revealNewest}
        />
      </div>
    );
  }
);

export default MessageHistory;

import type {
  ConversationListItem as ApiConversation,
  ConversationType,
  HistoryMessage,
  LastMessage,
  Listing,
  MediaPicture,
  Participant,
  Trip,
  ISODateTime,
} from '@/types/message';
import { MessageType, SystemType } from '@/types/message';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';

/**
 * Conversation ViewModel consumed by UI components.
 * - `lastMessage` allows `null` because the UI handles empty placeholders.
 * - Date fields use ISO string aliases for clarity.
 */
export type ConversationVM = {
  id: number;
  participants: Participant[];
  lastMessage: LastMessage | null;
  placeImage?: MediaPicture | null;
  location?: string;
  trip?: Trip | null;
  listing?: Listing | null;
  conversationType: ConversationType;
  unreadCount: number;
  muted: boolean;
  archived: boolean;
  starred: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

// ---------- Type guards ----------

function hasMedia(
  m: LastMessage | null
): m is LastMessage & { media: MediaPicture } {
  return !!m && typeof m.media === 'object' && m.media !== null;
}

function hasText(
  m: LastMessage | null
): m is LastMessage & { content: string } {
  const c = m?.content;
  return typeof c === 'string' && c.trim().length > 0;
}

/**
 * Produces a short preview string suitable for conversation cards.
 */
export function getLastMessagePreview(
  last: LastMessage | null,
  lang: SupportedLanguages = 'es'
): string {
  const t = getTranslation(lang);
  if (hasText(last)) return last.content;
  if (hasMedia(last)) return t.messages.photo;

  if (last && last.messageType === MessageType.SYSTEM) {
    switch (last.systemType) {
      case SystemType.TRIP_CONFIRMED:
        return '[Trip confirmed]';
      case SystemType.TRIP_CANCELLED:
        return '[Trip cancelled]';
      default:
        return last.content ?? '';
    }
  }

  return '';
}

/**
 * Maps API conversation list item to the internal VM.
 */
export function mapApiConversationToVM(c: ApiConversation): ConversationVM {
  const location = c.listing?.city ?? undefined;

  return {
    id: c.id,
    participants: c.participants,
    lastMessage: c.lastMessage ?? null,
    placeImage: c.listing?.photo ?? null,
    location,
    listing: c.listing ?? null,
    trip: c.trip ?? null,
    conversationType: c.conversationType,
    unreadCount: c.unreadCount,
    muted: c.muted,
    archived: c.archived,
    starred: c.starred,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

// ---------- Message History VM ----------

export type HistoryMessageVM = {
  id: number;
  messageType: MessageType;
  content?: string;
  media?: MediaPicture;
  createdAt: ISODateTime;
  sentAt: ISODateTime;
  sender?: { id: number; name: string };
  readAt?: ISODateTime | null;
  deliveredAt?: ISODateTime | null; // kept for UI; backend may not provide it yet
  systemType?: SystemType | null;
};

/**
 * Maps API history message item to the internal VM.
 */
export function mapApiMessageToVM(
  m: HistoryMessage,
  currentUserId: number
): HistoryMessageVM {
  const reads = Array.isArray(m.read) ? m.read : [];
  const myRead = reads.find((r) => r.userId === currentUserId);

  return {
    id: m.id,
    messageType: m.messageType,
    content: m.content ?? undefined,
    media: m.media ?? undefined,
    createdAt: m.createdAt,
    sentAt: m.sentAt,
    sender: m.sender ? { id: m.sender.id, name: m.sender.name } : undefined,
    readAt: myRead?.readAt ?? null,
    deliveredAt: null,
    systemType: m.systemType ?? null,
  };
}

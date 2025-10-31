// ======================================================================
// Conversations — APIDog strict typings (List conversations)
// ======================================================================

/** ISO date string, e.g. "YYYY-MM-DD". Still a `string` at runtime. */
export type ISODate = string;

/** ISO datetime string, e.g. "2025-09-01T12:34:56Z". Still a `string` at runtime. */
export type ISODateTime = string;

/** Closed enums (no loose string unions). */
export enum ConversationType {
  HOSTING = 'HOSTING',
  TRAVELING = 'TRAVELING',
  SUPPORT = 'SUPPORT',
}

export enum MessageType {
  SYSTEM = 'SYSTEM',
  USER = 'USER',
}

export enum ParticipantType {
  HOST = 'HOST',
  GUEST = 'GUEST',
  INVITE = 'INVITE',
}

export enum SystemType {
  TRIP_CANCELLED = 'TRIP_CANCELLED',
  TRIP_CONFIRMED = 'TRIP_CONFIRMED',
}

export interface ConversationParticipantPreview {
  id: number;
  name: string;
  participantType: ParticipantType;
  /** Avatar URL or path. */
  avatar: string;
}

// ----------------------------------------------------------------------
// Shared primitives
// ----------------------------------------------------------------------

/** Image with variants for `<picture>` (AVIF/WebP). */
export interface MediaPicture {
  original: string;
  srcsetAvif: string;
  srcsetWebp: string;
}

/** Rigid empty object (backend sends `{}`); disallows extra keys. */
export type EmptyObject = { readonly [K in never]: never };

/** Utility to enforce XOR between two shapes. */
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T & Without<U, T>) | (U & Without<T, U>);

// ----------------------------------------------------------------------
// Generic pagination
// ----------------------------------------------------------------------

export interface Paginated<T> {
  count: number;
  limit: number;
  offset: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ----------------------------------------------------------------------
// Entities for conversation list
// ----------------------------------------------------------------------

export interface Listing {
  id: number;
  city: string;
  title: string;
  photo: MediaPicture;
}

export interface Trip {
  id: number;
  checkInDate: ISODate;
  checkOutDate: ISODate;
}

export interface Participant {
  id: number;
  name: string;
  participantType: ParticipantType;
  /** Optional and may be null. */
  photo?: MediaPicture | null;
}

// ----------------------------------------------------------------------
// LastMessage with XOR (content vs media)
//  - ApiDog: content OR media but NOT both
//  - Also tolerant for missing or null values
// ----------------------------------------------------------------------

interface LastMessageBase {
  id: number;
  createdAt: ISODateTime;
  messageType: MessageType;
  senderId: number | null;
  systemType?: SystemType | null;
  payload?: EmptyObject | null;
}

/** Text-only (no media). */
type LastMessageWithText = {
  content: string;
  media?: null;
};

/** Media-only (no text). */
type LastMessageWithMedia = {
  media: MediaPicture;
  content?: null;
};

/** Tolerant case (neither present) for null/missing payloads. */
type LastMessageEmpty = {
  content?: null;
  media?: null;
};

export type LastMessage =
  | (LastMessageBase & XOR<LastMessageWithText, LastMessageWithMedia>)
  | (LastMessageBase & LastMessageEmpty);

// ----------------------------------------------------------------------
// Conversation (list item)
// ----------------------------------------------------------------------

export interface ConversationListItem {
  id: number;

  /** ApiDog: enum (HOSTING | TRAVELING | SUPPORT). */
  conversationType: ConversationType;

  createdAt: ISODateTime;
  updatedAt: ISODateTime;

  lastMessage: LastMessage;

  participants: Participant[];

  /** Optional and may be null (e.g., SUPPORT threads). */
  listing?: Listing | null;

  /** Optional (some conversations may not be tied to a trip). */
  trip?: Trip | null;

  /**
   * Backend v1: always 0, but kept as a number for future evolution.
   * Not reliable/usable in v1.
   */
  unreadCount: number;

  muted: boolean;
  archived: boolean;
  starred: boolean;
}

/** Main list response. */
export type ConversationListResponse = Paginated<ConversationListItem>;

// ======================================================================
// Conversation History — APIDog strict typings (message history)
// ======================================================================

export enum ReactionEnum {
  CLAP = 'CLAP',
  DISLIKE = 'DISLIKE',
  LAUGH = 'LAUGH',
  LIKE = 'LIKE',
  LOVE = 'LOVE',
}

export interface ReactionElement {
  userId: number;
  reaction: ReactionEnum;
}

export interface ReadReceipt {
  userId: number;
  readAt: ISODateTime;
}

export interface Sender {
  id: number;
  name: string;
  /** Optional; may be omitted by backend. */
  averageResponseTimeInMinutes?: number;
}

/**
 * ApiDog: in history, `content` and `media` may co-exist; XOR is not enforced.
 * `payload` is `{}` or `null`. `read` and `reactions` are arrays (v1: empty).
 */
export interface HistoryMessage {
  id: number;
  messageType: MessageType;
  createdAt: ISODateTime;
  sentAt: ISODateTime;
  sender?: Sender | null;
  content?: string | null;
  media?: MediaPicture | null;
  systemType?: SystemType | null;
  payload?: EmptyObject | null;
  reactions?: ReactionElement[] | null;
  read?: ReadReceipt[] | null;
}

/** Paginated message history. */
export type MessageHistory = Paginated<HistoryMessage>;

// --- Send message (text) ---
export interface SendTextMessageBody {
  content: string;
}

/**
 * Response from /socials/chats/{chat_id}/messages/text
 * Notes:
 * - `type` mirrors backend naming (not `messageType`) for API compatibility.
 * - ISO fields remain `string` aliases for readability and consistency.
 */
export interface SendTextMessageResponse {
  chatId: number;
  content: string;
  createdAt: ISODateTime;
  id: number;
  senderId: number;
  sentAt: ISODateTime;
  type: MessageType;
  updatedAt: ISODateTime;
}

/**
 * Response from /socials/chats/{chat_id}/messages/image (or similar).
 * Notes:
 * - `type` is a literal here per sample contract.
 */
export interface SendImageMessageResponse {
  chatId: number;
  createdAt: ISODateTime;
  id: number;
  media: MediaPicture | null;
  senderId: number;
  sentAt: ISODateTime;
  type: MessageType;
  updatedAt: ISODateTime;
}

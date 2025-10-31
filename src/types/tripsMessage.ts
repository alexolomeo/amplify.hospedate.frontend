export interface TripsMessageModel {
  archived: boolean;
  /**
   * Values: enum of ConversationType (HOSTING, TRAVELING, SUPPORT).
   */
  conversationType: string;
  createdAt: string;
  id: number;
  lastMessage: LastMessage;
  listing: Listing;
  muted: boolean;
  participants: Participant[];
  starred: boolean;
  /**
   * Optional (some messages do not have a trip).
   */
  trip?: Trip;
  /**
   * These are the messages that this user has not read in this conversation. See explanation at:
   * https://hackmd.io/fAe6ZoWRSnmG2wIeLl6BuA?view#7-Listar-conversaciones
   */
  unreadCount: number;
  updatedAt: string;
}

export interface LastMessage {
  /**
   * A message will have either content or media but not both
   */
  content?: string;
  createdAt: string;
  id: number;
  /**
   * A message will have either content or media but not both
   */
  media?: MediaPicture;
  /**
   * On the frontend, system messages could be displayed in a different color.
   */
  messageType: MessageType;
  /**
   * Additional information (does not have a fixed structure, it’s a generic JSON).
   */
  payload: { [key: string]: string } | null;
  senderId: number | null;
  /**
   * Indicates which type of "system message" the frontend should display.
   */
  systemType?: string;
}

/**
 * A message will have either content or media but not both
 *
 * MediaPicture
 *
 * It’s the main photo of the listing that appears on the homepage.
 */
export interface MediaPicture {
  original: string;
  srcsetAvif: string;
  srcsetWebp: string;
}

/**
 * On the frontend, system messages could be displayed in a different color.
 */
export enum MessageType {
  System = 'SYSTEM',
  User = 'USER',
}

export interface Listing {
  city: string;
  id: number;
  /**
   * It’s the main photo of the listing that appears on the homepage.
   */
  photo: MediaPicture;
  title: string;
}

export interface Participant {
  id: number;
  name: string;
  participantType: ParticipantType;
  photo?: MediaPicture;
}

export enum ParticipantType {
  Guest = 'GUEST',
  Host = 'HOST',
  Invite = 'INVITE',
}

/**
 * Optional (some messages do not have a trip).
 */
export interface Trip {
  checkInDate: string;
  checkOutDate: string;
  id: number;
  reservationCode: string;
}

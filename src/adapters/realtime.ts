import type { UserMessageDTO, PhotoDTO } from '@/types/realtime';
import type { HistoryMessageVM } from '@/adapters/messages';
import {
  type LastMessage,
  type MediaPicture,
  MessageType,
} from '@/types/message';

function mapPhoto(dto?: PhotoDTO | null): MediaPicture | undefined {
  if (!dto) return undefined;
  const original = dto.original ?? '';
  return {
    original,
    srcsetWebp: dto.srcset_webp ?? original,
    srcsetAvif: dto.srcset_avif ?? original,
  };
}

/** Map incoming UserMessageDTO to the message VM used in MessageHistory */
export function mapUserMessageDTOToHistoryVM(
  m: UserMessageDTO,
  _currentUserId: number,
  getSenderName: (id?: number) => string | undefined
): HistoryMessageVM {
  return {
    id: m.id,
    messageType: MessageType.USER, // TODO: update when SYSTEM is available
    content: m.content ?? undefined,
    media: mapPhoto(m.media),
    createdAt: m.created_at,
    sentAt: m.sent_at,
    sender: { id: m.sender_id, name: getSenderName(m.sender_id) ?? '' },
    readAt: null,
    deliveredAt: null,
    systemType: null,
  };
}

/** Map to the lightweight shape you use in ConversationList.lastMessage */
export function mapUserMessageDTOToLastMessage(m: UserMessageDTO): LastMessage {
  return {
    id: m.id,
    content: m.content ?? null,
    media: null,
    createdAt: m.created_at,
    senderId: m.sender_id,
    messageType: MessageType.USER,
  };
}

import type { ConversationVM } from '@/adapters/messages';
import type { SupportedLanguages } from '@/utils/i18n';

export function getConversationChannelName(
  conv: Pick<ConversationVM, 'id' | 'conversationType'>
): string {
  return `chat_hosting_${conv.id}`; //TODO: update to the right channel
}

export function getConversationsFeedForUser(userId: number | string): string {
  return `conversations_user_${userId}`;
}

export function getNotificationsFeedForUser(
  userId: number | string,
  lang: SupportedLanguages = 'es'
): string {
  return `notifications_user_${userId}_${lang}`;
}

export function getPaymentChannelForBooking(tripId: number | string): string {
  return `booking_${tripId}`;
}

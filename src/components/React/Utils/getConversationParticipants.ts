import type {
  MediaPicture,
  ConversationParticipantPreview,
} from '@/types/message';

// Minimal i18n shape required by this helper
type I18nLite = {
  messages: {
    andXMore: string;
  };
};

export type WithOptionalPhoto = ConversationParticipantPreview & {
  photo?: MediaPicture | null;
};

export function getConversationParticipants(
  participants: WithOptionalPhoto[],
  currentUserId: number,
  t: I18nLite,
  maxAvatars: number = 2
) {
  const others = participants.filter((p) => p.id !== currentUserId);

  let name = '';
  if (others.length === 1) {
    name = others[0].name;
  } else if (others.length === 2) {
    name = `${others[0].name}, ${others[1].name}`;
  } else if (others.length > 2) {
    name = `${others[0].name}, ${others[1].name} ${t.messages.andXMore.replace(
      '{count}',
      String(others.length - 2)
    )}`;
  }

  // Keep old string avatars for backward compatibility
  const avatars = others.slice(0, maxAvatars).map((p) => p.avatar);

  // New: photos array for <ResponsiveImage />
  const photos = others
    .slice(0, maxAvatars)
    .map((p) => p.photo ?? null)
    .filter((ph): ph is MediaPicture => ph != null);

  return { name, avatars, photos };
}

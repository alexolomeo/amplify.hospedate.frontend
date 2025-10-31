import AvatarDisplay from '@/components/React/Common/AvatarDisplay';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import { type MediaPicture, MessageType } from '@/types/message';
import { mediaPictureToPhoto } from '@/adapters/image.ts';

export type ConversationCardAvatar = {
  photo: MediaPicture | null;
  username: string | null;
};

interface ConversationCardProps {
  name: string;
  placeImage?: MediaPicture | null;
  avatars?: ReadonlyArray<ConversationCardAvatar>;
  message: string;
  messageType: MessageType;
  messageSender?: string;
  date: string;
  location: string;
  onClick?: () => void;
  selected?: boolean;
}

export default function ConversationCard({
  name,
  placeImage,
  avatars = [],
  message,
  messageType,
  messageSender,
  date,
  location,
  onClick,
  selected = false,
}: ConversationCardProps) {
  const placePhoto = placeImage ? mediaPictureToPhoto(placeImage) : null;

  const rootClasses =
    'flex w-full items-center gap-4 rounded-2xl p-3 transition cursor-pointer ' +
    (selected
      ? 'border border-[var(--color-base-300)] bg-[var(--color-base-150)]'
      : 'hover:bg-base-200');

  const messageClasses =
    'font-primary line-clamp-2 text-xs leading-4 font-normal ' +
    (messageType === MessageType.SYSTEM
      ? 'text-neutral-400'
      : 'text-neutral-900');

  return (
    <button
      type="button"
      onClick={onClick}
      className={rootClasses}
      aria-pressed={selected}
    >
      {/* Place image with up to two overlapping avatars */}
      <div className="relative h-14 w-14 shrink-0">
        {placePhoto ? (
          <ResponsiveImage
            photo={placePhoto}
            alt="Place"
            className="block h-14 w-14 rounded-2xl object-cover"
            sizes="56px"
            loading="lazy"
          />
        ) : (
          <div
            className="bg-base-300 h-14 w-14 rounded-2xl"
            aria-label="No image available"
          />
        )}

        {/* Avatar 1 */}
        {avatars[0] && (
          <div
            className={`absolute ${
              avatars.length === 1 ? '-top-2 -right-2' : '-top-3 -right-1'
            } flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow`}
          >
            <AvatarDisplay
              profilePicture={
                avatars[0].photo ? mediaPictureToPhoto(avatars[0].photo) : null
              }
              username={avatars[0].username ?? null}
              size="h-8 w-8"
              sizeText="text-base"
            />
          </div>
        )}

        {/* Avatar 2 */}
        {avatars[1] && (
          <div
            className="absolute top-2 -right-4 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow"
            style={{ zIndex: 1 }}
          >
            <AvatarDisplay
              profilePicture={
                avatars[1].photo ? mediaPictureToPhoto(avatars[1].photo) : null
              }
              username={avatars[1].username ?? null}
              size="h-8 w-8"
              sizeText="text-base"
            />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col text-start">
        <div className="font-primary truncate text-base leading-6 font-normal">
          {name}
        </div>

        <div className={messageClasses}>
          {messageSender ? (
            <span className="font-semibold">{messageSender}: </span>
          ) : null}
          {message}
        </div>

        <div className="truncate text-xs text-neutral-500">
          {date ? `${date} • ${location}` : location}
        </div>
      </div>
    </button>
  );
}

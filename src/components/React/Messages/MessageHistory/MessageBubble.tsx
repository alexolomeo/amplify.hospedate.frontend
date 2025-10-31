import React from 'react';
import { motion, type Transition } from 'framer-motion';
import { MessageType } from '@/types/message';
import AvatarDisplay from '@/components/React/Common/AvatarDisplay';
import { mediaPictureToPhoto } from '@/adapters/image';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import type { HistoryMessageVM } from '@/adapters/messages';
import type { MediaPicture } from '@/types/message';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

export type LocalDelivery =
  | { status: 'sending'; tempId: number; file?: File }
  | { status: 'sent' }
  | { status: 'error'; tempId: number; file?: File };

export type HistoryBubble = HistoryMessageVM & { _local?: LocalDelivery };

interface Props {
  msg: HistoryBubble;
  isMe: boolean;
  isFirstOfBlock: boolean;
  avatar?: { photo: MediaPicture | null; username: string | null };
  timeLabel: string;
  onOpenImage: (msg: HistoryBubble) => void;
  onRetry: (failedTempId: number) => void;
  meTailClass?: string;
  otherTailClass?: string;
  lang?: SupportedLanguages;
}

const spring: Transition = {
  type: 'spring',
  stiffness: 520,
  damping: 34,
  mass: 0.55,
};

function classJoin(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const MessageBubble: React.FC<Props> = React.memo(function MessageBubble({
  msg,
  isMe,
  isFirstOfBlock,
  avatar,
  timeLabel,
  onOpenImage,
  onRetry,
  meTailClass = 'bubble-tail-right',
  otherTailClass = 'bubble-tail-left',
  lang = 'es',
}) {
  const t = getTranslation(lang);

  if (msg.messageType === MessageType.SYSTEM) {
    return (
      <motion.div
        layout="position"
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={spring}
        className="mx-auto flex w-full justify-center"
      >
        <div className="mx-auto flex w-full max-w-xs justify-center py-2 md:max-w-xl">
          <span className="text-neutral bg-neutral-content/40 rounded-full px-3 py-1 text-xs">
            {msg.content ?? t.messages.systemMessage}
          </span>
        </div>
      </motion.div>
    );
  }

  const local = msg._local;
  const isSending = local?.status === 'sending';
  const isError = local?.status === 'error';
  return (
    <motion.div
      layout="position"
      initial={{ y: 28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={spring}
      className={classJoin(
        'flex w-full items-end',
        isMe ? 'justify-end' : 'justify-start',
        isFirstOfBlock ? 'mt-10' : 'mt-2'
      )}
    >
      <div className="flex max-w-[72vw] flex-col md:max-w-[28rem]">
        {isFirstOfBlock && (
          <div
            className={classJoin(
              'mb-1 flex items-center',
              isMe && 'justify-start'
            )}
          >
            <span
              className={classJoin(
                'text-neutral text-xs',
                !isMe && 'ml-12',
                'mr-2'
              )}
            >
              {msg.sender?.name}
            </span>
            <span className="text-neutral text-xs opacity-40">{timeLabel}</span>
          </div>
        )}

        <div
          className={classJoin(
            'flex items-end',
            isMe ? 'justify-end' : 'justify-start'
          )}
        >
          <div
            className={classJoin(
              'flex items-end gap-2',
              isMe && 'flex-row-reverse'
            )}
          >
            {isFirstOfBlock ? (
              <div className="h-10 w-10 shrink-0">
                <AvatarDisplay
                  profilePicture={
                    avatar?.photo ? mediaPictureToPhoto(avatar.photo) : null
                  }
                  username={avatar?.username ?? null}
                  size="h-10 w-10"
                  sizeText="text-base"
                />
              </div>
            ) : (
              <div className="h-10 w-10 shrink-0" />
            )}

            {msg.media ? (
              <div
                className={classJoin(
                  'flex w-full flex-col',
                  isMe ? 'items-end' : 'items-start'
                )}
              >
                <div
                  className={classJoin(
                    'flex overflow-hidden',
                    isMe ? 'justify-end' : 'justify-start',
                    isSending && 'animate-pulse opacity-60',
                    isError && 'bg-red-50 ring-1 ring-red-300'
                  )}
                >
                  <div
                    role="button"
                    aria-label={t.messages.viewImage}
                    className="cursor-zoom-in"
                    onClick={() => onOpenImage(msg)}
                  >
                    <ResponsiveImage
                      photo={msg.media}
                      alt={
                        msg.sender?.name
                          ? t.messages.photoBy.replace(
                              '{name}',
                              msg.sender.name
                            )
                          : t.messages.photoAlt
                      }
                      className="block max-h-[30vh] max-w-[40vw] rounded-2xl object-contain md:max-w-[28rem]"
                      loading="lazy"
                      sizes="240px"
                    />
                  </div>
                </div>

                {msg.content && (
                  <div
                    className={classJoin(
                      'font-primary relative rounded-2xl px-[1rem] py-[0.5rem] text-base leading-6 whitespace-pre-line text-gray-900',
                      isMe
                        ? `bg-secondary-content ${!isError && meTailClass} ml-auto`
                        : `${!isError && otherTailClass} bg-[var(--color-base-150)]`,
                      isSending && 'animate-pulse opacity-60',
                      isError && 'bg-red-50 ring-1 ring-red-300'
                    )}
                  >
                    {msg.content}
                  </div>
                )}
              </div>
            ) : (
              <div
                className={classJoin(
                  'font-primary relative min-h-10 rounded-2xl px-[1rem] py-[0.5rem] text-base leading-6 whitespace-pre-line text-gray-900 transition-opacity',
                  isMe
                    ? `bg-secondary-content ${!isError && meTailClass} ml-auto`
                    : `${!isError && otherTailClass} bg-[var(--color-base-150)]`,
                  isSending && 'animate-pulse opacity-60',
                  isError && 'bg-red-50 ring-1 ring-red-300'
                )}
              >
                {msg.content}
              </div>
            )}
          </div>
        </div>

        <div
          className={classJoin(
            'text-neutral mt-1 text-left text-xs',
            !isMe && 'ml-12'
          )}
        >
          {isError ? (
            <div className="flex items-center justify-end gap-2 text-red-500">
              <span>{t.messages.errors.couldNotSend}</span>
              <button
                type="button"
                className="cursor-pointer underline"
                onClick={() => onRetry((local?.tempId as number) ?? -1)}
              >
                Retry
              </button>
            </div>
          ) : msg.readAt ? (
            <span>
              {t.messages.seenAt}{' '}
              {new Date(msg.readAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          ) : msg.deliveredAt ? (
            <span>{t.messages.delivered}</span>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
});

export default MessageBubble;

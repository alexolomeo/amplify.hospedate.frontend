import React, { useState } from 'react';
import Modal from '../Common/Modal';
import CloseIcon from '/src/icons/x-mark-mini.svg?react';
import AvatarDisplay from '../Common/AvatarDisplay';
import type { Photo } from '@/types/listing/space';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';

interface ModalMessageProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  userDescription: string;
  avatarPhoto?: Photo | null;
  onSend: (message: string) => void;
  sendButtonText?: string;
  placeholder?: string;
  lang: SupportedLanguages;
  title?: string;
  isHost?: boolean;
  sending?: boolean;
}

export default function ModalMessage({
  open,
  onClose,
  userName,
  userDescription,
  avatarPhoto,
  onSend,
  sendButtonText,
  placeholder,
  lang,
  title,
  isHost,
  sending,
}: ModalMessageProps) {
  const t = getTranslation(lang);
  const [message, setMessage] = useState('');
  const defaultTitle = isHost
    ? t.commonComponents.messageModal.talkToGuest
    : t.commonComponents.messageModal.talkToHost;
  const modalTitle = title ? title : defaultTitle;
  const modalPlaceholder = placeholder
    ? placeholder
    : translate(t, `commonComponents.messageModal.placeHolder`, {
        name: userName,
      });
  const modalButtonText = sendButtonText
    ? sendButtonText
    : t.commonComponents.messageModal.sendMessage;

  function handleSend() {
    if (message.trim()) {
      onSend(message);
    }
  }

  function closeModal() {
    setMessage('');
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={closeModal}
      title={modalTitle}
      showCancelButton={false}
      topLeftButton={false}
      widthClass="md:max-w-md"
      heightClass="md:max-h-lg"
      titleClass="text-xl leading-7 font-semibold"
      footerPaddingClass="px-5 pt-2 pb-2 md:px-3 md:pt-4 md:pb-4"
    >
      <div className="w-full">
        <CloseIcon
          className="absolute top-4 right-10 mt-1 h-6 w-6 cursor-pointer md:top-6 md:mt-0"
          onClick={closeModal}
        />
        <div className="mb-4 flex items-center gap-4">
          <AvatarDisplay
            profilePicture={avatarPhoto}
            username={userName}
            size="h-14 w-14"
            sizeText="text-lg"
          />
          <div className="flex flex-col">
            <span className="text-base-content text-base font-semibold">
              {userName}
            </span>
            <span className="text-base-content/70 mt-1 text-xs">
              {userDescription}
            </span>
          </div>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={modalPlaceholder}
            className="border-base-content/20 bg-base-100 text-base-content focus:border-primary w-full rounded-lg border px-3 py-4 text-sm outline-none"
            aria-label={`Message to ${userName}`}
          />
        </div>
        <div className="flex w-full justify-end">
          <button
            onClick={handleSend}
            className={`bg-primary text-primary-content flex h-10 min-w-[120px] ${!!message.trim() && 'cursor-pointer'} items-center justify-center rounded-full px-4 text-sm shadow-sm disabled:opacity-60`}
            disabled={!message.trim()}
            aria-describedby={
              !message.trim() ? 'sendButtonDisabledDesc' : undefined
            }
          >
            {sending
              ? t.commonComponents.messageModal.sending
              : modalButtonText}
          </button>
          {!message.trim() && (
            <span id="sendButtonDisabledDesc" className="sr-only">
              {t.commonComponents.messageModal.disabledReason}
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
}

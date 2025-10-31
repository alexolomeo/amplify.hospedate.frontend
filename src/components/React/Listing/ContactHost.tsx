import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { $auth } from '@/stores/auth';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import { sendMessageByListing } from '@/services/conversations';
import ChevronRightIcon from '/src/icons/chevron-right-mini.svg?react';
import ModalMessage from '../Common/ModalMessage';
import type { Host } from '@/types/listing/host';
import { navigate } from 'astro/virtual-modules/transitions-router.js';

interface Props {
  lang?: SupportedLanguages;
  listingId: number;
  host: Host;
}

const ContactHost: React.FC<Props> = ({ lang = 'es', listingId, host }) => {
  const { accessToken } = useStore($auth);
  const isLoggedIn = !!accessToken;
  const t = getTranslation(lang);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showModalMessage, setShowModalMessage] = useState(false);

  const handleCreateConversation = async (message: string) => {
    if (!message || message.trim() === '') return;
    setSending(true);
    setError(null);
    try {
      const chat = await sendMessageByListing(listingId, {
        content: message,
      });
      const chatId = chat?.id;

      if (!chatId) {
        console.error('No valid chat ID');
        return;
      }
      navigate(`/users/messages/${chatId}`);
    } catch (error) {
      setSending(false);
      setShowModalMessage(false);
      setError(t.listingDetail.host.errorMessage);
      console.error('Error creating chat message:', error);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <button
        onClick={() => setShowModalMessage(true)}
        disabled={sending}
        className="btn btn-primary flex h-12 items-center rounded-full font-normal"
      >
        {sending ? t.listingDetail.host.sending : t.listingDetail.host.contact}
        <ChevronRightIcon className="h-5 w-5"></ChevronRightIcon>
      </button>
      {error && <p className="text-error mt-2 text-sm">{error}</p>}
      <ModalMessage
        open={showModalMessage}
        onClose={() => setShowModalMessage(false)}
        avatarPhoto={host.profilePicture}
        onSend={handleCreateConversation}
        sending={sending}
        lang={lang}
        userName={host.username}
        userDescription={translate(
          t,
          'commonComponents.messageModal.descriptionHost',
          {
            name: host.username,
          }
        )}
      />
    </div>
  );
};

export default ContactHost;

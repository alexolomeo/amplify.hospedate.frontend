export type MessageTypeEnum = 'USER' | 'SYSTEM'; // extend if needed

export type PhotoDTO = {
  original: string;
  srcset_webp?: string | null;
  srcset_avif?: string | null;
};

export type UserMessageDTO = {
  id: number;
  content?: string | null;
  media?: PhotoDTO | null;
  sender_id: number;
  chat_id: number;
  created_at: string; // ISO
  updated_at: string; // ISO
  sent_at: string; // ISO
  type: MessageTypeEnum;
};

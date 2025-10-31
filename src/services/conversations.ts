import api from '@/utils/api';
import type {
  ConversationListResponse,
  MessageHistory,
  SendImageMessageResponse,
  SendTextMessageBody,
  SendTextMessageResponse,
} from '@/types/message';
import { postFormData } from '@/utils/http';
import type { TripsMessageModel } from '@/types/tripsMessage';

export interface QueryParamsConversations {
  readonly limit: number;
  readonly offset?: number;
}

/** Build a URLSearchParams enforcing expected semantics for limit/offset. */
function buildQuery(params: QueryParamsConversations): URLSearchParams {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, raw]) => {
    if (raw === undefined || raw === null) return;

    if (typeof raw === 'number') {
      // limit must be > 0, offset must be >= 0
      if ((key === 'offset' && raw >= 0) || (key === 'limit' && raw > 0)) {
        query.append(key, String(raw));
      }
      return;
    }

    query.append(key, String(raw));
  });
  return query;
}

export const fetchConversations = async (
  params: QueryParamsConversations
): Promise<ConversationListResponse> => {
  const queryParams = buildQuery(params);
  const url = `/socials/chats?${queryParams.toString()}`;

  try {
    const { data } = await api.get<ConversationListResponse>(url);
    return data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

export const fetchConversationHistory = async (
  chatId: number | string,
  params: QueryParamsConversations
): Promise<MessageHistory> => {
  const queryParams = buildQuery(params);
  const url = `/socials/chats/${chatId}?${queryParams.toString()}`;

  try {
    const { data } = await api.get<MessageHistory>(url);
    return data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

export const fetchConversationHistoryASC = async (
  chatId: number | string,
  params: QueryParamsConversations
): Promise<MessageHistory> => {
  const page = await fetchConversationHistory(chatId, params);
  // Normalize page results to ASC (oldest -> newest) without changing pagination metadata
  const ascResults = (page.results ?? []).slice().reverse();
  return { ...page, results: ascResults };
};

export const sendTextMessage = async (
  chatId: number | string,
  body: SendTextMessageBody
): Promise<SendTextMessageResponse> => {
  const url = `/socials/chats/${chatId}/messages/text`;
  const { data } = await api.post<SendTextMessageResponse>(url, body);
  return data;
};

export const sendImageMessage = async (
  chatId: number | string,
  file: File
): Promise<SendImageMessageResponse> => {
  const form = new FormData();
  form.append('photo', file, file.name);

  const { data } = await postFormData<SendImageMessageResponse>(
    `/socials/chats/${chatId}/messages/media`,
    form
  );
  return data;
};

export const sendMessageByListing = async (
  listing_id: string | number,
  body: SendTextMessageBody
): Promise<TripsMessageModel> => {
  const url = `/socials/listings/${listing_id}/messages/text`;
  const { data } = await api.post<TripsMessageModel>(url, body);
  return data;
};

import { Realtime } from 'ably';

export type AblyChannel = ReturnType<Realtime['channels']['get']>;

let _client: Realtime | null = null;

export function getAblyClient(): Realtime {
  if (_client) return _client;

  _client = new Realtime({
    key: import.meta.env.PUBLIC_ABLY_API_KEY,
    disconnectedRetryTimeout: 2000,
    realtimeRequestTimeout: 10_000,
    closeOnUnload: true,
  });

  return _client;
}

/** Convenience accessor for channels, ensures singleton usage. */
export function getAblyChannel(name: string): AblyChannel {
  const client = getAblyClient();
  return client.channels.get(name);
}

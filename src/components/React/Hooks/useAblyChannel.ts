import { useEffect, useRef } from 'react';
import type { Message } from 'ably';
import { getAblyChannel, type AblyChannel } from '@/services/realtime/ably';

// Single-channel
type Handler = (message: Message) => void;

interface UseAblyChannelOptions {
  /** Subscribe to one or more event names, e.g. ['new_message'] */
  events?: string[];
}

/**
 * Single-channel subscription with auto cleanup.
 */
export function useAblyChannel(
  channelName: string,
  handler: Handler,
  options: UseAblyChannelOptions = {}
) {
  const { events } = options;
  const savedHandler = useRef<Handler>(handler);
  savedHandler.current = handler;

  useEffect(() => {
    if (!channelName) return;

    const channel: AblyChannel = getAblyChannel(channelName);
    const callback = (msg: Message) => savedHandler.current(msg);

    // subscribe() is async in v2; we can ignore the promise intentionally
    if (events && events.length > 0) {
      events.forEach((e) => {
        void channel.subscribe(e, callback);
      });
    } else {
      void channel.subscribe(callback);
    }

    return () => {
      if (events && events.length > 0) {
        events.forEach((e) => channel.unsubscribe(e, callback));
      } else {
        channel.unsubscribe(callback);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName, JSON.stringify(events)]);
}

/**
 * Multi-channel subscription with diffing.
 * Subscribes/unsubscribes incrementally as the channels array changes.
 */
export function useAblyChannels(
  channelNames: string[],
  handler: Handler,
  options: UseAblyChannelOptions = {}
) {
  const { events } = options;
  const savedHandler = useRef<Handler>(handler);
  savedHandler.current = handler;

  const activeRef = useRef<
    Map<string, { channel: AblyChannel; callback: Handler }>
  >(new Map());

  useEffect(() => {
    const nextSet = new Set(channelNames.filter(Boolean));
    const active = activeRef.current;

    // Unsubscribe channels no longer present
    for (const [name, { channel, callback }] of active) {
      if (!nextSet.has(name)) {
        if (events && events.length > 0) {
          events.forEach((e) => channel.unsubscribe(e, callback));
        } else {
          channel.unsubscribe(callback);
        }
        active.delete(name);
      }
    }

    // Subscribe new channels
    for (const name of nextSet) {
      if (active.has(name)) continue;
      const channel: AblyChannel = getAblyChannel(name);
      const callback = (msg: Message) => savedHandler.current(msg);

      if (events && events.length > 0) {
        events.forEach((e) => {
          void channel.subscribe(e, callback);
        });
      } else {
        void channel.subscribe(callback);
      }

      active.set(name, { channel, callback });
    }

    // Cleanup uses the local snapshot
    return () => {
      for (const [, { channel, callback }] of active) {
        if (events && events.length > 0) {
          events.forEach((e) => channel.unsubscribe(e, callback));
        } else {
          channel.unsubscribe(callback);
        }
      }
      active.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(channelNames), JSON.stringify(events)]);
}

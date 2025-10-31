import { useEffect, useRef } from 'react';
import { refreshTimezoneIfNeeded } from '@/stores/timezoneStore';
import { $auth } from '@/stores/auth';

export default function TimezoneBootstrap() {
  const prevTokenRef = useRef<string | null>($auth.get().accessToken);

  useEffect(() => {
    // (A) On client load: detect if needed (auto)
    refreshTimezoneIfNeeded();

    // (B) Login / Logout: based on accessToken changes
    const off = $auth.listen((state) => {
      const curr = state.accessToken;
      const prev = prevTokenRef.current;

      // LOGIN: null -> string
      if (!prev && curr) {
        refreshTimezoneIfNeeded();
      }

      prevTokenRef.current = curr;
    });

    return () => {
      off();
    };
  }, []);

  return null;
}

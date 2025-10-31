import { useEffect, useState, useRef } from 'react';

export function useThrottle<T>(value: T, delay = 500): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExec = now - lastExecuted.current;

    if (timeSinceLastExec >= delay) {
      setThrottledValue(value);
      lastExecuted.current = now;
    } else {
      const timeout = setTimeout(() => {
        setThrottledValue(value);
        lastExecuted.current = Date.now();
      }, delay - timeSinceLastExec);

      return () => clearTimeout(timeout);
    }
  }, [value, delay]);

  return throttledValue;
}

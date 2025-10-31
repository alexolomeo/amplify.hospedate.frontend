import { useState, useEffect, useCallback } from 'react';

export function useModalParam(
  paramName: string,
  paramValue: string,
  options?: { disabled?: boolean }
) {
  const { disabled } = options ?? {};
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (disabled) return;
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      setIsOpen(params.get(paramName) === paramValue);
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, [paramName, paramValue, disabled]);

  const open = useCallback(() => {
    if (disabled) return;
    const params = new URLSearchParams(window.location.search);
    params.set(paramName, paramValue);
    window.history.replaceState({}, '', `?${params.toString()}`);
    setIsOpen(true);
  }, [paramName, paramValue, disabled]);

  const close = useCallback(() => {
    if (disabled) return;
    const params = new URLSearchParams(window.location.search);
    params.delete(paramName);
    const qs = params.toString();
    window.history.pushState({}, '', qs ? `?${qs}` : window.location.pathname);
    setIsOpen(false);
  }, [paramName, disabled]);

  return { isOpen, open, close };
}

import { useCallback, useEffect, useRef, useState } from 'react';
import ConfirmDiscardModal from '@/components/React/Host/EditListing/ConfirmDiscardModal';
import type { SupportedLanguages } from '@/utils/i18n';

type Resolver = (v: boolean) => void;

export function useConfirmDiscardDialog(lang: SupportedLanguages = 'es') {
  const [open, setOpen] = useState(false);

  const resolverRef = useRef<Resolver | null>(null);
  const pendingPromiseRef = useRef<Promise<boolean> | null>(null);

  const confirm = useCallback((): Promise<boolean> => {
    if (open && pendingPromiseRef.current) {
      return pendingPromiseRef.current;
    }

    setOpen(true);

    const p = new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });

    pendingPromiseRef.current = p.finally(() => {
      pendingPromiseRef.current = null;
    });

    return p;
  }, [open]);

  const resolveAndReset = useCallback((value: boolean) => {
    if (resolverRef.current) {
      resolverRef.current(value);
      resolverRef.current = null;
    }
    setOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    resolveAndReset(false);
  }, [resolveAndReset]);

  const handleDiscard = useCallback(() => {
    resolveAndReset(true);
  }, [resolveAndReset]);

  useEffect(() => {
    return () => {
      if (resolverRef.current) {
        resolverRef.current(false);
        resolverRef.current = null;
      }
      pendingPromiseRef.current = null;
    };
  }, []);

  const dialogNode = (
    <ConfirmDiscardModal
      open={open}
      lang={lang}
      onCancel={handleCancel}
      onDiscard={handleDiscard}
    />
  );

  return { confirm, dialogNode };
}

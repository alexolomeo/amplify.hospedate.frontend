import { $userStore } from '@/stores/userStore';
import { AuthEventEmitter } from '@/utils/authEventEmitter';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useStore } from '@nanostores/react';
import { useEffect, useState, useCallback } from 'react';

interface Props {
  lang?: SupportedLanguages;
}

export default function RoleBasedAction({ lang = 'es' }: Props) {
  const [hasMounted, setHasMounted] = useState(false);
  const user = useStore($userStore);
  const t = getTranslation(lang);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleOpenLogin = useCallback(() => {
    const redirect = location.pathname || '/';
    AuthEventEmitter.emit('ui.openAuth', { redirect });
  }, []);
  if (!hasMounted) return null;

  const href = user?.isHost ? '/hosting' : '/listing/create';
  const label = user?.isHost ? t.header.hostMode : t.header.addProperty;

  return (
    <a
      href={user ? href : undefined}
      onClick={(e) => {
        if (!user) {
          e.preventDefault();
          handleOpenLogin();
        }
      }}
      className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-[16px] px-2 text-xs font-semibold text-[var(--color-base-content)] transition-colors"
    >
      {label}
    </a>
  );
}

import React, { useEffect, useState } from 'react';
import type { PolicyReqs } from '@/policies/authPolicy';
import { checkPolicy } from '@/policies/authPolicy';
import {
  extractStatusAndCode,
  sessionService,
} from '@/services/SessionService';
import { fetchUserMe } from '@/services/users';
import { AuthEventEmitter } from '@/utils/authEventEmitter';
import { policyBarrier } from '@/utils/policyBarrier';

type Props = {
  requires?: PolicyReqs;
  /** (opcional) HTML id de un contenedor a mostrar/ocultar como skeleton */
  fallbackId?: string;
  contentId?: string;
};

const ProtectedGate: React.FC<Props> = ({
  requires = {},
  fallbackId,
  contentId,
}) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    policyBarrier.setChecking(true);

    const done = () => policyBarrier.setChecking(false);
    const redirectWithReturn = (to: string) => {
      const redirect = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.assign(`${to}?redirect=${redirect}`);
      }
    };

    const run = async () => {
      try {
        let token = sessionService.getAccessToken();

        if (!token) {
          if (sessionService.userMightBeLoggedIn) {
            await sessionService.refreshWithLock();
            token = sessionService.getAccessToken();
          } else {
            done();
            redirectWithReturn('/auth');
            return;
          }
        }

        const me = await fetchUserMe();
        const res = checkPolicy(me, requires);
        if (!mounted) return;

        if (res.ok) {
          done();
          setReady(true);
        } else {
          done();
          redirectWithReturn(res.redirectTo);
        }
      } catch (err: unknown) {
        if (!mounted) return;
        done();
        const { status } = extractStatusAndCode(err);
        if (status === 401) {
          redirectWithReturn('/auth');
        }
      }
    };

    run();

    const handleAuthRequired = () => {
      done();
      redirectWithReturn('/auth');
    };

    AuthEventEmitter.on('auth.required', handleAuthRequired);

    return () => {
      mounted = false;
      done();
      AuthEventEmitter.off('auth.required', handleAuthRequired);
    };
  }, [requires]);

  useEffect(() => {
    const fb = fallbackId ? document.getElementById(fallbackId) : null;
    const ct = contentId ? document.getElementById(contentId) : null;

    if (fb) fb.style.display = ready ? 'none' : '';
    if (ct) ct.style.display = ready ? '' : 'none';

    return () => {
      if (fb) fb.style.display = '';
      if (ct) ct.style.display = 'none';
    };
  }, [fallbackId, contentId, ready]);

  return null;
};

export default ProtectedGate;

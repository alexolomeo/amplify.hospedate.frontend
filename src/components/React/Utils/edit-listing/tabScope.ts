export type TabId = string & { readonly __brand: 'TabId' };
export type RuntimeId = string & { readonly __brand: 'RuntimeId' };

function safeRandomUUID(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return `rnd_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function ensureTabId(): TabId {
  if (typeof window === 'undefined') {
    return 'ssr-tab' as TabId;
  }
  const KEY = 'host.tabId';
  const stored = window.sessionStorage.getItem(KEY);
  if (stored && stored.length > 0) {
    return stored as TabId;
  }
  const fresh = safeRandomUUID() as TabId;
  window.sessionStorage.setItem(KEY, fresh);
  return fresh;
}

function makeRuntimeId(): RuntimeId {
  return safeRandomUUID() as RuntimeId;
}

export function getTabScope() {
  const tabId = ensureTabId();
  const runtimeId = makeRuntimeId();

  function persistKey(
    base: string,
    { includeRuntime = false }: { includeRuntime?: boolean } = {}
  ) {
    if (includeRuntime) {
      return `${base}.v2.${tabId}.${runtimeId}`;
    }
    return `${base}.v2.${tabId}`;
  }

  return { tabId, runtimeId, persistKey };
}

import React from 'react';
import clsx from 'clsx';
import type { SidebarMeta } from './sidebarMetaBySlug';

export type AmenityItem = { key?: string; label: string; icon?: string };
export type SubValue = string | AmenityItem[];

export function renderSub(sub: SubValue | undefined, meta?: SidebarMeta) {
  if (sub == null) return null;

  const layout = meta?.subtextLayout ?? 'text';
  const baseClass = meta?.subtextClassName;

  const iconUrlMap: Record<string, string> = {
    ...(meta?.itemIconUrlMap ?? {}),
  };

  if (typeof sub === 'string') {
    if (layout === 'stack' || layout === 'bullets') {
      const parts = (
        meta?.subtextSplitOn ? sub.split(meta.subtextSplitOn) : [sub]
      )
        .map((p) => p.trim())
        .filter(Boolean);

      if (layout === 'stack') {
        return (
          <div className={clsx('mt-1 text-xs', baseClass)}>
            {parts.map((p, i) => (
              <div key={i}>{p}</div>
            ))}
          </div>
        );
      }

      return (
        <ul
          className={clsx(
            'mt-1 flex list-none flex-col gap-1 pl-0 text-xs',
            baseClass
          )}
        >
          {parts.map((token, i) => {
            const IconCmp = meta?.subtextItemIconMap?.[token];
            const url = iconUrlMap[token];
            return (
              <li key={`${token}-${i}`} className="flex items-center gap-2">
                {IconCmp ? (
                  <IconCmp
                    className={clsx('h-4 w-4', meta?.subtextItemIconClassName)}
                  />
                ) : url ? (
                  <img
                    src={url}
                    alt={token}
                    className={clsx(
                      'h-4 w-4 object-contain',
                      meta?.subtextItemImgClassName
                    )}
                    loading="lazy"
                  />
                ) : null}
                <span>{token}</span>
              </li>
            );
          })}
        </ul>
      );
    }

    return <div className={clsx('mt-1 text-xs', baseClass)}>{sub}</div>;
  }

  return (
    <ul
      className={clsx(
        'mt-1 flex list-none flex-col gap-1 pl-0 text-xs',
        baseClass
      )}
    >
      {sub.map((it) => {
        const token = it.key ?? it.label;
        const IconCmp = token ? meta?.subtextItemIconMap?.[token] : undefined;
        const url = it.icon ?? (token ? iconUrlMap[token] : undefined);

        return (
          <li key={`${token}-${it.label}`} className="flex items-center gap-2">
            {IconCmp ? (
              <IconCmp
                className={clsx('h-4 w-4', meta?.subtextItemIconClassName)}
              />
            ) : url ? (
              <img
                src={url}
                alt={it.label}
                className={clsx(
                  'h-4 w-4 object-contain',
                  meta?.subtextItemImgClassName
                )}
                loading="lazy"
              />
            ) : null}
            <span>{it.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

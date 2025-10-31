export type LayoutMode = 'FULL' | 'SIDEBAR_ONLY' | 'FOOTER_ONLY' | 'FULL_WIDTH';

export const LAYOUT_BY_MODE = {
  FULL: { showSidebar: true, showFooter: true },
  SIDEBAR_ONLY: { showSidebar: true, showFooter: false },
  FOOTER_ONLY: { showSidebar: false, showFooter: true },
  FULL_WIDTH: { showSidebar: false, showFooter: false },
} as const;

export type LayoutConfig = (typeof LAYOUT_BY_MODE)[keyof typeof LAYOUT_BY_MODE];

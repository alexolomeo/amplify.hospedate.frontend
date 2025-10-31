import mitt from 'mitt';

export type AuthEvents = {
  'auth.required': { status: number; url?: string };
  'auth.loginSuccess': void;
  'auth.sessionReady': void;
  'auth.logout': void;
  'auth.refreshFailed': void;
  'auth.socialToken': string;
  'ui.openAuth': { redirect?: string } | void;

  'route.notfound': void;
  'route.forbidden': void;
  'auth.unrecoverable': { status?: number; code?: string };
};

const emitter = mitt<AuthEvents>();

export const AuthEventEmitter = {
  on: emitter.on,
  off: emitter.off,
  emit: emitter.emit,
};

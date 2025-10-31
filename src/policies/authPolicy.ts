export type Capability = 'registerCompleted' | 'identityVerified' | 'host';

export type PolicyReqs = Partial<Record<Capability, boolean>>;

export type PolicyCheck =
  | { ok: true }
  | { ok: false; reason: Capability; redirectTo: string };

export function checkPolicy(
  userMe: {
    isRegisterCompleted?: boolean;
    identityVerified?: boolean;
    isHost?: boolean;
  } | null,
  reqs: PolicyReqs
): PolicyCheck {
  if (reqs.registerCompleted && !userMe?.isRegisterCompleted) {
    return {
      ok: false,
      reason: 'registerCompleted',
      redirectTo: '/auth',
    };
  }
  if (reqs.identityVerified && !userMe?.identityVerified) {
    return {
      ok: false,
      reason: 'identityVerified',
      redirectTo: '/', //TODO: Tal vez sea bueno llevarlo al perfil
    };
  }
  if (reqs.host && !userMe?.isHost) {
    return { ok: false, reason: 'host', redirectTo: '/' }; // //TODO: Tal vez sea bueno una Pagina para que se haga host
  }
  return { ok: true };
}

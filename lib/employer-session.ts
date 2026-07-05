export type EmployerPaywallState = {
  freeMessagesSent: number;
  hasUnlockedPremium: boolean;
  hasUnlockedProfile: boolean;
};

/** @deprecated Use EmployerPaywallState — kept for gradual migration. */
export type EmployerSession = EmployerPaywallState;

export const FREE_MESSAGE_LIMIT = 3;

export const INITIAL_EMPLOYER_PAYWALL: EmployerPaywallState = {
  freeMessagesSent: 0,
  hasUnlockedPremium: false,
  hasUnlockedProfile: false,
};

/** @deprecated Use INITIAL_EMPLOYER_PAYWALL */
export const INITIAL_EMPLOYER_SESSION = INITIAL_EMPLOYER_PAYWALL;

const STORAGE_KEY = "housemaid-employer-paywall";

export function loadEmployerPaywallState(): EmployerPaywallState {
  if (typeof window === "undefined") return INITIAL_EMPLOYER_PAYWALL;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_EMPLOYER_PAYWALL;
    const parsed = JSON.parse(raw) as Partial<EmployerPaywallState>;
    return {
      ...INITIAL_EMPLOYER_PAYWALL,
      freeMessagesSent: parsed.freeMessagesSent ?? 0,
      hasUnlockedPremium: parsed.hasUnlockedPremium ?? false,
      hasUnlockedProfile: parsed.hasUnlockedProfile ?? false,
    };
  } catch {
    return INITIAL_EMPLOYER_PAYWALL;
  }
}

/** @deprecated Use loadEmployerPaywallState */
export function loadEmployerSession(): EmployerPaywallState {
  return loadEmployerPaywallState();
}

export function saveEmployerPaywallState(state: EmployerPaywallState) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Overwrite quota fields from DB; preserve profile-unlock flag in sessionStorage. */
export function hydrateEmployerPaywallFromDb(
  freeMessagesUsed: number,
  hasUnlockedPremium: boolean
): EmployerPaywallState {
  const existing = loadEmployerPaywallState();
  const state: EmployerPaywallState = {
    freeMessagesSent: freeMessagesUsed,
    hasUnlockedPremium,
    hasUnlockedProfile: existing.hasUnlockedProfile,
  };
  saveEmployerPaywallState(state);
  return state;
}

/** @deprecated Use saveEmployerPaywallState */
export function saveEmployerSession(state: EmployerPaywallState) {
  saveEmployerPaywallState(state);
}

export function canSendFreeMessage(state: EmployerPaywallState): boolean {
  return (
    state.hasUnlockedPremium || state.freeMessagesSent < FREE_MESSAGE_LIMIT
  );
}

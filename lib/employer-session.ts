export type EmployerSession = {
  hasAccount: boolean;
  fullName: string;
  email: string;
  freeMessagesSent: number;
  hasUnlockedPremium: boolean;
  hasUnlockedProfile: boolean;
};

export const FREE_MESSAGE_LIMIT = 3;

export const INITIAL_EMPLOYER_SESSION: EmployerSession = {
  hasAccount: false,
  fullName: "",
  email: "",
  freeMessagesSent: 0,
  hasUnlockedPremium: false,
  hasUnlockedProfile: false,
};

const STORAGE_KEY = "housemaid-employer-session";

export function loadEmployerSession(): EmployerSession {
  if (typeof window === "undefined") return INITIAL_EMPLOYER_SESSION;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_EMPLOYER_SESSION;
    return { ...INITIAL_EMPLOYER_SESSION, ...JSON.parse(raw) };
  } catch {
    return INITIAL_EMPLOYER_SESSION;
  }
}

export function saveEmployerSession(session: EmployerSession) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function canSendFreeMessage(session: EmployerSession): boolean {
  return (
    session.hasUnlockedPremium ||
    session.freeMessagesSent < FREE_MESSAGE_LIMIT
  );
}

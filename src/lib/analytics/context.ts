import { getSessionId, getDeviceId, getUserId } from "@amplitude/unified";
import { loadSession, hasActiveSubscription, isLoggedIn } from "../session";

const ANON_KEY = "ampli-daily-anonymous-id";
const DEMO_RUN_KEY = "ampli-daily-demo-run-id";

export type AccountState = "anonymous" | "registered" | "trial" | "paid" | "canceled" | "expired";

export function getOrCreateAnonymousId(): string {
  const existing = localStorage.getItem(ANON_KEY);
  if (existing) {
    return existing;
  }
  const id = crypto.randomUUID();
  localStorage.setItem(ANON_KEY, id);
  return id;
}

export function getDemoRunId(): string {
  const existing = sessionStorage.getItem(DEMO_RUN_KEY);
  if (existing) {
    return existing;
  }
  const id = crypto.randomUUID();
  sessionStorage.setItem(DEMO_RUN_KEY, id);
  return id;
}

export function resolveAccountState(): AccountState {
  const session = loadSession();
  if (!isLoggedIn()) {
    return "anonymous";
  }
  if (session.subscription.status === "canceled") {
    return "canceled";
  }
  if (session.subscription.status === "expired") {
    return "expired";
  }
  if (hasActiveSubscription()) {
    return "paid";
  }
  return "registered";
}

export function buildCommonProperties(dataOrigin: "interactive_demo" | "seeded_history" = "interactive_demo") {
  const session = loadSession();
  const readerId = getUserId() ?? session.loggedInUserId;
  const ampSession = getSessionId();
  return {
    event_id: crypto.randomUUID(),
    schema_version: 1,
    occurred_at: new Date().toISOString(),
    anonymous_id: getOrCreateAnonymousId(),
    reader_id: readerId ?? null,
    session_id: ampSession != null ? String(ampSession) : getDemoRunId(),
    account_state: resolveAccountState(),
    data_origin: dataOrigin,
    is_simulated: true,
    is_forced_variant: false,
    demo_run_id: getDemoRunId(),
  };
}

export function readerIdentityLabel(): { anonymous_id: string; reader_id: string | null } {
  const session = loadSession();
  return {
    anonymous_id: getOrCreateAnonymousId(),
    reader_id: session.loggedInUserId,
  };
}

export function refreshAnonymousIdAfterReset(): void {
  const id = crypto.randomUUID();
  localStorage.setItem(ANON_KEY, id);
}

export function getDeviceIdForSmoke(): string | undefined {
  return getDeviceId();
}
import { getPersonaById, resolvePersonaIdForEmail, type Persona } from "./personas";
import { getPlanById } from "./plans";

export const SESSION_STORAGE_KEY = "ampli-daily-session";
export const SESSION_SCHEMA_VERSION = 2;

export type SubscriptionStatus = "none" | "active" | "canceled" | "expired";

export type SessionState = {
  schemaVersion: number;
  activePersonaId: string;
  loggedInUserId: string | null;
  displayName: string | null;
  email: string | null;
  subscription: {
    planId: string | null;
    status: SubscriptionStatus;
    startedAt: string | null;
    renewalDate: string | null;
    usedIntroOffer: boolean;
    cancellationReason: string | null;
  };
  savedArticleIds: string[];
  followedAuthorSlugs: string[];
  engagement: {
    articlesRead: number;
    lastVisitAt: string | null;
  };
  billingProfile: {
    name: string;
    email: string;
    cardLast4: string;
  };
  demoTimeOffsetDays: number;
  deviceLabel: string;
  secondaryDeviceLabel: string | null;
  pendingCheckoutPlanId: string | null;
  pendingIntroOffer: boolean;
};

const CANCELLATION_REASONS = [
  "too_expensive",
  "not_reading_enough",
  "temporary_break",
  "switching_tool",
  "other",
] as const;

export type CancellationReason = (typeof CANCELLATION_REASONS)[number];

export function cancellationReasonLabels(): Record<CancellationReason, string> {
  return {
    too_expensive: "Too expensive",
    not_reading_enough: "Not reading enough",
    temporary_break: "Taking a break",
    switching_tool: "Switching to another source",
    other: "Other",
  };
}

function defaultState(): SessionState {
  return {
    schemaVersion: SESSION_SCHEMA_VERSION,
    activePersonaId: "anonymous",
    loggedInUserId: null,
    displayName: null,
    email: null,
    subscription: {
      planId: null,
      status: "none",
      startedAt: null,
      renewalDate: null,
      usedIntroOffer: false,
      cancellationReason: null,
    },
    savedArticleIds: [],
    followedAuthorSlugs: [],
    engagement: {
      articlesRead: 0,
      lastVisitAt: null,
    },
    billingProfile: {
      name: "Demo Reader",
      email: "reader-demo@ampliyorker.test",
      cardLast4: "4242",
    },
    demoTimeOffsetDays: 0,
    deviceLabel: "This browser",
    secondaryDeviceLabel: null,
    pendingCheckoutPlanId: null,
    pendingIntroOffer: false,
  };
}

function parseState(raw: string | null): SessionState {
  if (!raw) {
    return defaultState();
  }
  try {
    const parsed = JSON.parse(raw) as Partial<SessionState>;
    if (parsed.schemaVersion !== SESSION_SCHEMA_VERSION) {
      return defaultState();
    }
    return { ...defaultState(), ...parsed, subscription: { ...defaultState().subscription, ...parsed.subscription } };
  } catch {
    return defaultState();
  }
}

export function loadSession(): SessionState {
  return parseState(localStorage.getItem(SESSION_STORAGE_KEY));
}

export function saveSession(state: SessionState): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ ...state, schemaVersion: SESSION_SCHEMA_VERSION }));
}

export function updateSession(mutator: (state: SessionState) => SessionState): SessionState {
  const next = mutator(loadSession());
  saveSession(next);
  return next;
}

export function isLoggedIn(): boolean {
  const session = loadSession();
  return session.loggedInUserId !== null && session.activePersonaId !== "anonymous";
}

export function hasActiveSubscription(): boolean {
  const session = loadSession();
  if (session.subscription.status !== "active") {
    return false;
  }
  const renewal = session.subscription.renewalDate;
  if (!renewal) {
    return false;
  }
  const effectiveNow = addDays(new Date(), session.demoTimeOffsetDays);
  return effectiveNow <= new Date(renewal);
}

export function normalizeLoginEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Demo-only: any non-empty password is accepted; not validated against a server. */
export function isDemoPasswordValid(password: string): boolean {
  return password.trim().length > 0;
}

export function loginWithCredentials(
  email: string,
  password: string,
  options?: { displayName?: string },
): SessionState | null {
  if (!isDemoPasswordValid(password)) {
    return null;
  }
  const normalizedEmail = normalizeLoginEmail(email);
  if (!normalizedEmail.includes("@")) {
    return null;
  }
  const personaId = resolvePersonaIdForEmail(normalizedEmail);
  const persona = getPersonaById(personaId);
  if (!persona || persona.id === "anonymous") {
    return null;
  }
  const displayName =
    options?.displayName?.trim() || persona.presetDisplayName || persona.label;
  return updateSession((state) => {
    const next: SessionState = {
      ...state,
      activePersonaId: persona.id,
      loggedInUserId: normalizedEmail,
      displayName,
      email: normalizedEmail,
      subscription: { ...state.subscription },
      engagement: { ...state.engagement },
    };
    if (persona.seedEngagementArticlesRead !== undefined) {
      next.engagement.articlesRead = persona.seedEngagementArticlesRead;
    }
    if (persona.seedDaysSinceLastVisit !== undefined) {
      const last = addDays(new Date(), -persona.seedDaysSinceLastVisit);
      next.engagement.lastVisitAt = last.toISOString();
    }
    next.billingProfile = {
      ...next.billingProfile,
      name: displayName,
      email: normalizedEmail,
    };
    return next;
  });
}

export function logout(): SessionState {
  return updateSession((state) => ({
    ...defaultState(),
    engagement: state.engagement,
    demoTimeOffsetDays: state.demoTimeOffsetDays,
    deviceLabel: state.deviceLabel,
    secondaryDeviceLabel: state.secondaryDeviceLabel,
  }));
}

export function resetDemoData(): SessionState {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key === SESSION_STORAGE_KEY) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
  return defaultState();
}

export function recordVisit(): void {
  updateSession((state) => ({
    ...state,
    engagement: { ...state.engagement, lastVisitAt: effectiveNow(state).toISOString() },
  }));
}

export function incrementArticlesRead(): void {
  updateSession((state) => ({
    ...state,
    engagement: { ...state.engagement, articlesRead: state.engagement.articlesRead + 1 },
  }));
}

export function toggleSaveArticle(articleId: string): boolean {
  let saved = false;
  updateSession((state) => {
    const has = state.savedArticleIds.includes(articleId);
    const savedArticleIds = has
      ? state.savedArticleIds.filter((id) => id !== articleId)
      : [...state.savedArticleIds, articleId];
    saved = !has;
    return { ...state, savedArticleIds };
  });
  return saved;
}

export function isArticleSaved(articleId: string): boolean {
  return loadSession().savedArticleIds.includes(articleId);
}

export function toggleFollowAuthor(slug: string): boolean {
  let followed = false;
  updateSession((state) => {
    const has = state.followedAuthorSlugs.includes(slug);
    const followedAuthorSlugs = has
      ? state.followedAuthorSlugs.filter((id) => id !== slug)
      : [...state.followedAuthorSlugs, slug];
    followed = !has;
    return { ...state, followedAuthorSlugs };
  });
  return followed;
}

export function isAuthorFollowed(slug: string): boolean {
  return loadSession().followedAuthorSlugs.includes(slug);
}

export function setPendingCheckout(planId: string, introOffer: boolean): void {
  updateSession((state) => ({
    ...state,
    pendingCheckoutPlanId: planId,
    pendingIntroOffer: introOffer,
  }));
}

export function completeCheckout(): SessionState {
  return updateSession((state) => {
    const planId = state.pendingCheckoutPlanId ?? "monthly";
    const plan = getPlanById(planId);
    const started = effectiveNow(state);
    const renewal = addDays(started, plan?.renewalIntervalDays ?? 30);
    return {
      ...state,
      pendingCheckoutPlanId: null,
      subscription: {
        planId,
        status: "active",
        startedAt: started.toISOString(),
        renewalDate: renewal.toISOString(),
        usedIntroOffer: state.pendingIntroOffer,
        cancellationReason: null,
      },
    };
  });
}

export function cancelSubscription(reason: CancellationReason): SessionState {
  return updateSession((state) => ({
    ...state,
    subscription: {
      ...state.subscription,
      status: "canceled",
      cancellationReason: reason,
    },
  }));
}

export function updateBillingProfile(profile: Partial<SessionState["billingProfile"]>): void {
  updateSession((state) => ({
    ...state,
    billingProfile: { ...state.billingProfile, ...profile },
  }));
}

export function changePlan(planId: string): void {
  const plan = getPlanById(planId);
  if (!plan) {
    return;
  }
  updateSession((state) => {
    const renewal = addDays(effectiveNow(state), plan.renewalIntervalDays);
    return {
      ...state,
      subscription: {
        ...state.subscription,
        planId,
        renewalDate: renewal.toISOString(),
        status: state.subscription.status === "canceled" ? "active" : state.subscription.status,
        cancellationReason: null,
      },
    };
  });
}

export function advanceDemoTime(days: number): void {
  updateSession((state) => {
    const nextOffset = state.demoTimeOffsetDays + days;
    let subscription = { ...state.subscription };
    if (subscription.renewalDate && subscription.status === "active") {
      const renewal = new Date(subscription.renewalDate);
      const effective = addDays(new Date(), nextOffset);
      if (effective > renewal) {
        subscription = { ...subscription, status: "expired" };
      }
    }
    return { ...state, demoTimeOffsetDays: nextOffset, subscription };
  });
}

export function applySecondaryDeviceLabel(): void {
  updateSession((state) => ({
    ...state,
    secondaryDeviceLabel: "Simulated tablet — local only",
  }));
}

export function exportPersonaSnapshot(): string {
  const session = loadSession();
  const payload = {
    label: "Simulated persona export (local demo only)",
    exportedAt: new Date().toISOString(),
    session,
  };
  return JSON.stringify(payload, null, 2);
}

export function shouldShowRetentionOffer(): boolean {
  const session = loadSession();
  if (session.activePersonaId === "declining-engagement") {
    return true;
  }
  const last = session.engagement.lastVisitAt;
  if (!last) {
    return false;
  }
  const daysSince = daysBetween(new Date(last), effectiveNow(session));
  return session.engagement.articlesRead <= 3 && daysSince >= 7;
}

export function effectiveNow(state: SessionState = loadSession()): Date {
  return addDays(new Date(), state.demoTimeOffsetDays);
}

export function formatRenewalDate(): string {
  const session = loadSession();
  if (!session.subscription.renewalDate) {
    return "—";
  }
  const adjusted = new Date(session.subscription.renewalDate);
  return adjusted.toLocaleDateString(undefined, { dateStyle: "medium" });
}

export function getActivePersona(): Persona {
  const session = loadSession();
  return getPersonaById(session.activePersonaId) ?? getPersonaById("anonymous")!;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export { CANCELLATION_REASONS };

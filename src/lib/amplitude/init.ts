import { initAll, setUserId, reset } from "@amplitude/unified";
import { getOrCreateAnonymousId, refreshAnonymousIdAfterReset } from "../analytics/context";
import { loadSession, isLoggedIn } from "../session";

let initialized = false;
let initAttempted = false;

const MASK_SELECTORS = [
  "input",
  "textarea",
  "select",
  "#header-search-input",
  "#search-input",
  "#pay-name",
  "#pay-card",
  "#pay-exp",
  "#bill-name",
  "#bill-email",
  "#bill-card",
  "#newsletter-email",
  ".discovery-chat",
  ".account-support-chat",
  "[data-chat-transcript]",
];

export function isAmplitudeReady(): boolean {
  return initialized;
}

export function ensureAmplitudeIdentity(): void {
  if (!initialized) {
    return;
  }
  const session = loadSession();
  if (isLoggedIn() && session.loggedInUserId) {
    setUserId(session.loggedInUserId);
    return;
  }
}

export async function initAmplitude(): Promise<void> {
  if (initAttempted) {
    return;
  }
  initAttempted = true;
  const apiKey = import.meta.env.VITE_AMPLITUDE_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[Amplitude] VITE_AMPLITUDE_API_KEY missing — instrumentation disabled.");
    return;
  }
  getOrCreateAnonymousId();
  await initAll(apiKey, {
    serverZone: "US",
    analytics: {
      autocapture: false,
      defaultTracking: false,
    },
    sessionReplay: {
      sampleRate: 1,
      privacyConfig: {
        defaultMaskLevel: "conservative",
        maskSelector: MASK_SELECTORS,
      },
    },
    engagement: {},
  });
  initialized = true;
  ensureAmplitudeIdentity();
}

export function resetAmplitudeIdentity(): void {
  if (!initialized) {
    return;
  }
  reset();
  refreshAnonymousIdAfterReset();
  ensureAmplitudeIdentity();
}
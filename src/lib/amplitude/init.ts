import { Types, initAll, reset, setDeviceId, setUserId } from "@amplitude/unified";
import { getOrCreateAnonymousId, refreshAnonymousIdAfterReset } from "../analytics/context";
import { isPrecisionTrackedElement } from "../analytics/precision";
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
  "#chat-input",
  "#account-chat-input",
  ".ask-daily-panel",
  ".ask-daily-fab",
  "[data-ask-daily]",
  ".account-support-chat",
  "[data-chat-transcript]",
];

const REPLAY_SAMPLE_RATE = Math.min(
  1,
  Math.max(0, Number(import.meta.env.VITE_AMPLITUDE_REPLAY_SAMPLE_RATE ?? 0.25) || 0.25),
);

const WEB_EXPERIMENT_DEPLOYMENT_KEY = import.meta.env.VITE_AMPLITUDE_WEB_EXPERIMENT_DEPLOYMENT_KEY?.trim();
const ENGAGEMENT_ENABLED = import.meta.env.VITE_AMPLITUDE_ENGAGEMENT_ENABLED === "true";

export function isAmplitudeReady(): boolean {
  return initialized;
}

export function ensureAmplitudeIdentity(): void {
  if (!initialized) {
    return;
  }
  const anonId = getOrCreateAnonymousId();
  setDeviceId(anonId);
  const session = loadSession();
  if (isLoggedIn() && session.loggedInUserId) {
    setUserId(session.loggedInUserId);
    return;
  }
  setUserId(undefined);
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

  const defaultAllowlist = Types.DEFAULT_CSS_SELECTOR_ALLOWLIST ?? [
    "a",
    "button",
    "input",
    "select",
    "textarea",
    "label",
    "[contenteditable='true']",
    "[data-amp-default-track]",
    ".amp-default-track",
  ];

  await initAll(apiKey, {
    serverZone: "US",
    analytics: {
      autocapture: {
        attribution: true,
        sessions: true,
        pageViews: {
          trackHistoryChanges: "all",
        },
        formInteractions: false,
        fileDownloads: false,
        pageUrlEnrichment: true,
        elementInteractions: {
          cssSelectorAllowlist: [...defaultAllowlist],
          actionClickAllowlist: [],
          shouldTrackEventResolver: (_actionType, element) => !isPrecisionTrackedElement(element),
        },
      },
      identityStorage: "localStorage",
    },
    sessionReplay: {
      sampleRate: REPLAY_SAMPLE_RATE,
      privacyConfig: {
        defaultMaskLevel: "conservative",
        maskSelector: MASK_SELECTORS,
      },
    },
    ...(WEB_EXPERIMENT_DEPLOYMENT_KEY
      ? {
          experiment: {
            deploymentKey: WEB_EXPERIMENT_DEPLOYMENT_KEY,
            fetchOnStart: false,
            automaticExposureTracking: false,
          },
        }
      : {}),
    engagement: ENGAGEMENT_ENABLED
      ? {}
      : {
          skip: true,
        },
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
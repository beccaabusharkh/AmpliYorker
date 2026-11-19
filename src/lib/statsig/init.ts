import { StatsigClient } from "@statsig/js-client";
import { StatsigAutoCapturePlugin } from "@statsig/web-analytics";
import { readerIdentityLabel, resolveAccountState } from "../analytics/context";
import { isLoggedIn } from "../session";
import { ensureAmplitudeIdentity } from "../amplitude/init";
import { bindStatsigClient, refreshLocalAssignments } from "./evaluate";
import { readForcedAssignments } from "./overrides";
import { resolveStatsigEnvTier } from "./env-tier";

let client: StatsigClient | null = null;
let initAttempted = false;
let initialized = false;

const INIT_TIMEOUT_MS = 2500;

export function isStatsigReady(): boolean {
  return initialized || readForcedAssignments().length > 0;
}

export function getStatsigClient(): StatsigClient | null {
  return initialized && client ? client : null;
}

export async function initStatsig(): Promise<void> {
  if (initAttempted) {
    return;
  }
  initAttempted = true;
  refreshLocalAssignments();

  const clientKey = import.meta.env.VITE_STATSIG_CLIENT_KEY?.trim();
  if (!clientKey) {
    console.warn("[Statsig] VITE_STATSIG_CLIENT_KEY missing — using local defaults.");
    bindStatsigClient(null, false);
    return;
  }

  const tier = resolveStatsigEnvTier();
  client = new StatsigClient(clientKey, buildStatsigUser(), {
    environment: { tier },
    plugins: [new StatsigAutoCapturePlugin()],
  });

  try {
    const outcome = await Promise.race([
      client.initializeAsync().then(() => "ready" as const),
      new Promise<"timeout">((resolve) => setTimeout(() => resolve("timeout"), INIT_TIMEOUT_MS)),
    ]);
    if (outcome === "timeout") {
      console.warn("[Statsig] initialize timed out — using defaults.");
      bindStatsigClient(null, false);
      return;
    }
    initialized = true;
    bindStatsigClient(client, true);
  } catch (error) {
    console.warn("[Statsig] initialize failed — using defaults.", error);
    bindStatsigClient(null, false);
  }
}

export function buildStatsigUser() {
  const identity = readerIdentityLabel();
  return {
    userID: identity.reader_id ?? identity.anonymous_id,
    customIDs: {
      amplitude_device_id: identity.anonymous_id,
    },
    custom: {
      account_state: resolveAccountState(),
      is_logged_in: isLoggedIn(),
    },
  };
}

export async function syncStatsigIdentity(): Promise<void> {
  ensureAmplitudeIdentity();
  if (!client || !initialized) {
    refreshLocalAssignments();
    return;
  }
  await client.updateUserAsync(buildStatsigUser());
}
import { StatsigClient } from "@statsig/js-client";
import { readerIdentityLabel } from "../analytics/context";
import { loadSession, isLoggedIn } from "../session";
import { ensureAmplitudeIdentity } from "../amplitude/init";
import { bindStatsigClient, refreshLocalAssignments } from "./evaluate";
import { readForcedAssignments } from "./overrides";

let client: StatsigClient | null = null;
let initAttempted = false;
let initialized = false;

const INIT_TIMEOUT_MS = 2500;

export function isStatsigReady(): boolean {
  return initialized || readForcedAssignments().length > 0;
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

  const identity = readerIdentityLabel();
  const session = loadSession();
  const user = {
    userID: identity.reader_id ?? identity.anonymous_id,
    customIDs: {
      amplitude_device_id: identity.anonymous_id,
    },
    custom: {
      account_state: session.subscription.status,
      is_logged_in: isLoggedIn(),
    },
  };

  client = new StatsigClient(clientKey, user, {
    environment: { tier: "development" },
  });

  try {
    await Promise.race([
      client.initializeAsync(),
      new Promise<"timeout">((resolve) => setTimeout(() => resolve("timeout"), INIT_TIMEOUT_MS)),
    ]);
    initialized = true;
    bindStatsigClient(client, true);
  } catch (error) {
    console.warn("[Statsig] initialize failed — using defaults.", error);
    bindStatsigClient(null, false);
  }
}

export async function syncStatsigIdentity(): Promise<void> {
  ensureAmplitudeIdentity();
  if (!client || !initialized) {
    refreshLocalAssignments();
    return;
  }
  const identity = readerIdentityLabel();
  const session = loadSession();
  await client.updateUserAsync({
    userID: identity.reader_id ?? identity.anonymous_id,
    customIDs: {
      amplitude_device_id: identity.anonymous_id,
    },
    custom: {
      account_state: session.subscription.status,
      is_logged_in: isLoggedIn(),
    },
  });
}
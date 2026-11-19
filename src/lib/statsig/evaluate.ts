import type { StatsigClient } from "@statsig/js-client";
import {
  DEFAULT_VARIANTS,
  STATSIG_EXPERIMENTS,
  STATSIG_GATES,
  type HomeRecommendationVariant,
  type RetentionTreatmentVariant,
  type SubscriptionMessageVariant,
  type SubscriptionOfferVariant,
} from "./catalog";
import { isForced, readForcedAssignments } from "./overrides";
import { recordExposure } from "./exposures";

let client: StatsigClient | null = null;
let ready = false;

export function getStatsigClientForParams(): StatsigClient | null {
  return ready ? client : null;
}

const localValues: Record<string, string> = { ...DEFAULT_VARIANTS };

export function bindStatsigClient(instance: StatsigClient | null, initialized: boolean): void {
  client = instance;
  ready = initialized;
  applyForcedToLocal();
}

function applyForcedToLocal(): void {
  readForcedAssignments().forEach((item) => {
    localValues[item.gateOrExperiment] = item.value;
  });
}

function resolveValue(gateOrExperiment: string, fallback: string): { value: string; forced: boolean } {
  const forced = readForcedAssignments().find((item) => item.gateOrExperiment === gateOrExperiment);
  if (forced) {
    return { value: forced.value, forced: true };
  }
  if (ready && client) {
    try {
      const gateValues = Object.values(STATSIG_GATES) as string[];
      if (gateValues.includes(gateOrExperiment)) {
        const gate = client.checkGate(gateOrExperiment as (typeof STATSIG_GATES)[keyof typeof STATSIG_GATES], {
          disableExposureLog: true,
        });
        return { value: gate ? "true" : "false", forced: false };
      }
      const exp = client.getExperiment(gateOrExperiment, { disableExposureLog: true });
      const variant = exp.get("variant", fallback);
      return { value: String(variant), forced: false };
    } catch {
      return { value: localValues[gateOrExperiment] ?? fallback, forced: false };
    }
  }
  return { value: localValues[gateOrExperiment] ?? fallback, forced: false };
}

export function getGateValue(gateName: string, surface: string): boolean {
  const { value, forced } = resolveValue(gateName, DEFAULT_VARIANTS[gateName] ?? "false");
  recordExposure(gateName, value, surface, forced, "enabled");
  return value === "true";
}

export function getExperimentVariant<T extends string>(
  experimentName: string,
  surface: string,
  fallback: T,
): { variant: T; forced: boolean } {
  const { value, forced } = resolveValue(experimentName, fallback);
  recordExposure(experimentName, value, surface, forced);
  return { variant: value as T, forced: forced || isForced(experimentName) };
}

export function getSubscriptionMessageVariant(surface: string): SubscriptionMessageVariant {
  const { variant } = getExperimentVariant<SubscriptionMessageVariant>(
    STATSIG_EXPERIMENTS.subscriptionMessage,
    surface,
    "control",
  );
  return variant === "urgency" ? "urgency" : "control";
}

export function getSubscriptionOfferVariant(surface: string): SubscriptionOfferVariant {
  const { variant } = getExperimentVariant<SubscriptionOfferVariant>(
    STATSIG_EXPERIMENTS.subscriptionOffer,
    surface,
    "control",
  );
  return variant === "intro_badge" ? "intro_badge" : "control";
}

export function getHomeRecommendationVariant(surface: string): HomeRecommendationVariant {
  const { variant } = getExperimentVariant<HomeRecommendationVariant>(
    STATSIG_EXPERIMENTS.homeRecommendations,
    surface,
    "control",
  );
  return variant === "editors_picks" ? "editors_picks" : "control";
}

export function getRetentionTreatmentVariant(surface: string): RetentionTreatmentVariant {
  const { variant } = getExperimentVariant<RetentionTreatmentVariant>(
    STATSIG_EXPERIMENTS.retentionTreatment,
    surface,
    "control",
  );
  return variant === "win_back" ? "win_back" : "control";
}

export function refreshLocalAssignments(): void {
  applyForcedToLocal();
}
import type { StatsigClient } from "@statsig/js-client";
import { amplitudeEventToStatsigName, toStatsigMetadata } from "./event-names";
import { getStatsigClient, isStatsigReady } from "./init";

export { amplitudeEventToStatsigName, toStatsigMetadata } from "./event-names";

export function trackStatsigMirror(
  eventName: string,
  properties: Record<string, unknown> = {},
  value?: string | number,
): void {
  if (!isStatsigReady()) {
    return;
  }
  const client = getStatsigClient();
  if (!client) {
    return;
  }
  const statsigName = amplitudeEventToStatsigName(eventName);
  const metadata = toStatsigMetadata(properties);
  try {
    client.logEvent(statsigName, value, metadata);
  } catch (error) {
    console.warn("[Statsig] logEvent failed", statsigName, error);
  }
}

export function getStatsigClientForDiagnostics(): StatsigClient | null {
  return getStatsigClient();
}
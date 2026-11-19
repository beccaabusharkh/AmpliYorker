import { track } from "@amplitude/unified";
import { buildCommonProperties } from "./context";
import { isAmplitudeReady } from "../amplitude/init";
import { trackStatsigMirror } from "../statsig/events";

export function trackDemoEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
  dataOrigin: "interactive_demo" | "seeded_history" = "interactive_demo",
  insertId?: string,
): void {
  const common = buildCommonProperties(dataOrigin);
  const payload = {
    ...common,
    ...properties,
  };
  const dedupeKey = insertId ?? String(common.event_id);
  if (isAmplitudeReady()) {
    track(eventName, payload, { insert_id: dedupeKey });
  }
  trackStatsigMirror(eventName, payload);
}
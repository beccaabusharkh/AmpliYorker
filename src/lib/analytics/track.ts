import { track } from "@amplitude/unified";
import { buildCommonProperties } from "./context";
import { isAmplitudeReady } from "../amplitude/init";

export function trackDemoEvent(
  eventName: string,
  properties: Record<string, unknown> = {},
  dataOrigin: "interactive_demo" | "seeded_history" = "interactive_demo",
): void {
  if (!isAmplitudeReady()) {
    return;
  }
  const payload = {
    ...buildCommonProperties(dataOrigin),
    ...properties,
  };
  track(eventName, payload);
}
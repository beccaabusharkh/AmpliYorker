import { Identify, identify } from "@amplitude/unified";
import { isAmplitudeReady } from "../amplitude/init";
import { resolveNewsletterUserProperties } from "../session";
import { syncStatsigIdentity } from "../statsig/init";

/**
 * Sync newsletter targeting fields to Amplitude user properties and Statsig custom fields.
 * Statsig growth tests: target `newsletter_subscriber` === false to exclude existing subscribers.
 */
export function syncReaderUserProperties(): void {
  const props = resolveNewsletterUserProperties();
  if (isAmplitudeReady()) {
    const update = new Identify();
    update.set("newsletter_subscriber", props.newsletter_subscriber);
    update.set("newsletter_id", props.newsletter_id);
    identify(update);
  }
  void syncStatsigIdentity();
}
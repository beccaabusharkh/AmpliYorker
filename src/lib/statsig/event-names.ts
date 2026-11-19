/** Amplitude display name → Statsig custom mirror (snake_case; not Web Analytics `auto_capture::`). */
export function amplitudeEventToStatsigName(eventName: string): string {
  return eventName
    .replace(/[[\]]/g, " ")
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .toLowerCase();
}

export function toStatsigMetadata(properties: Record<string, unknown>): Record<string, string> {
  const metadata: Record<string, string> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value === null || value === undefined) {
      continue;
    }
    if (typeof value === "string") {
      metadata[key] = value;
    } else if (typeof value === "number" || typeof value === "boolean") {
      metadata[key] = String(value);
    } else {
      metadata[key] = JSON.stringify(value);
    }
  }
  return metadata;
}
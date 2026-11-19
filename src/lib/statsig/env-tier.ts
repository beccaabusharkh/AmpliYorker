export const STATSIG_ENV_TIERS = ["development", "staging", "production"] as const;
export type StatsigEnvTier = (typeof STATSIG_ENV_TIERS)[number];

/** Pages CI should set secret `VITE_STATSIG_ENV_TIER=production`. Local dev defaults to development when unset. */
export function resolveStatsigEnvTier(): StatsigEnvTier {
  const raw = import.meta.env.VITE_STATSIG_ENV_TIER?.trim();
  if (raw && (STATSIG_ENV_TIERS as readonly string[]).includes(raw)) {
    return raw as StatsigEnvTier;
  }
  return import.meta.env.PROD ? "production" : "development";
}
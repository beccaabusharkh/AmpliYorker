const PLAN_FEATURES: Record<string, string[]> = {
  monthly: [
    "Unlimited simulated article access",
    "Daily briefing newsletter (demo)",
    "Save articles for later",
  ],
  annual: [
    "Everything in Digital Monthly",
    "Annual billing — simulated savings",
    "Priority access to long-form features",
  ],
  premium: [
    "Everything in Digital Annual",
    "Simulated audio editions + deep dives",
    "Premium briefings and field notes",
  ],
};

export function getPlanFeatureBullets(planId: string): string[] {
  return PLAN_FEATURES[planId] ?? PLAN_FEATURES.monthly;
}

export const SUBSCRIBE_PLAN_ORDER = ["annual", "monthly", "premium"] as const;
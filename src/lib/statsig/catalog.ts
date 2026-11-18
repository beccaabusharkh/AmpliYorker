export const STATSIG_GATES = {
  premiumPaywallScroll: "premium_paywall_after_scroll",
} as const;

export const STATSIG_EXPERIMENTS = {
  subscriptionMessage: "subscription_message_copy",
  subscriptionOffer: "subscription_offer_framing",
  homeRecommendations: "home_recommendation_strategy",
  retentionTreatment: "retention_renewal_treatment",
} as const;

export type SubscriptionMessageVariant = "control" | "urgency";
export type SubscriptionOfferVariant = "control" | "intro_badge";
export type HomeRecommendationVariant = "control" | "editors_picks";
export type RetentionTreatmentVariant = "control" | "win_back";

export const DEFAULT_VARIANTS: Record<string, string> = {
  [STATSIG_GATES.premiumPaywallScroll]: "false",
  [STATSIG_EXPERIMENTS.subscriptionMessage]: "control",
  [STATSIG_EXPERIMENTS.subscriptionOffer]: "control",
  [STATSIG_EXPERIMENTS.homeRecommendations]: "control",
  [STATSIG_EXPERIMENTS.retentionTreatment]: "control",
};

export const SUBSCRIPTION_MESSAGE_COPY: Record<SubscriptionMessageVariant, string> = {
  control: "Simulated paywall — choose a plan and complete simulated checkout to unlock.",
  urgency:
    "Limited-time reader offer — unlock premium briefs now to keep your experiment evaluation streak.",
};

export const RETENTION_COPY: Record<RetentionTreatmentVariant, { title: string; body: string }> = {
  control: {
    title: "Simulated renewal reminder",
    body: "We noticed lighter reading lately — here's an introductory-style offer if you resubscribe.",
  },
  win_back: {
    title: "Win-back experiment cohort",
    body: "Your engagement dipped — try a Statsig-modeled renewal offer before access lapses.",
  },
};
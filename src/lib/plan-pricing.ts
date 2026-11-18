export function getPlanAmountUsd(planId: string, introOffer: boolean): number {
  if (planId === "monthly") {
    return introOffer ? 1 : 12;
  }
  if (planId === "annual") {
    return introOffer ? 79 : 99;
  }
  if (planId === "premium") {
    return introOffer ? 119 : 149;
  }
  return introOffer ? 1 : 12;
}

export function getBillingPeriod(planId: string): "monthly" | "annual" {
  return planId === "monthly" ? "monthly" : "annual";
}
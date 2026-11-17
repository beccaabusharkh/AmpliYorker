import plansData from "../data/plans.json";

export type Plan = {
  id: string;
  name: string;
  cadence: string;
  priceLabel: string;
  introOfferLabel: string;
  renewalIntervalDays: number;
};

export const plans: Plan[] = plansData as Plan[];

export function getPlanById(id: string): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

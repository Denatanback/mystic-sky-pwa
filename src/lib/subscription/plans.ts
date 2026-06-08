export type PaidPlanId = "intro_3_day" | "monthly" | "three_month" | "six_month";

export type StripePriceEnvKey =
  | "STRIPE_PRICE_INTRO_3_DAY"
  | "STRIPE_PRICE_MONTHLY"
  | "STRIPE_PRICE_3_MONTH"
  | "STRIPE_PRICE_6_MONTH";

export type PaidPlan = {
  id: PaidPlanId;
  name: string;
  description: string;
  priceLabel: string;
  billingLabel: string;
  stripePriceEnvKey: StripePriceEnvKey;
};

export const paidPlans: PaidPlan[] = [
  {
    id: "intro_3_day",
    name: "3-day introductory access",
    description: "Open full eLuna access for your first 3 days.",
    priceLabel: "$1.00 USD",
    billingLabel: "3-day introductory access",
    stripePriceEnvKey: "STRIPE_PRICE_INTRO_3_DAY",
  },
  {
    id: "monthly",
    name: "Monthly Premium",
    description: "Continue with monthly full access to eLuna.",
    priceLabel: "$29.99 USD/month",
    billingLabel: "Billed monthly",
    stripePriceEnvKey: "STRIPE_PRICE_MONTHLY",
  },
  {
    id: "three_month",
    name: "3-Month Premium",
    description: "Full eLuna access for a 3-month subscription period.",
    priceLabel: "$59.99 USD every 3 months",
    billingLabel: "Billed every 3 months",
    stripePriceEnvKey: "STRIPE_PRICE_3_MONTH",
  },
  {
    id: "six_month",
    name: "6-Month Premium",
    description: "Full eLuna access for a 6-month subscription period.",
    priceLabel: "$89.99 USD every 6 months",
    billingLabel: "Billed every 6 months",
    stripePriceEnvKey: "STRIPE_PRICE_6_MONTH",
  },
];

export function getPaidPlan(planId: string | null | undefined): PaidPlan | null {
  return paidPlans.find((plan) => plan.id === planId) ?? null;
}

export function isPaidPlanId(planId: string | null | undefined): planId is PaidPlanId {
  return Boolean(getPaidPlan(planId));
}

export function getStripePriceIdForPlan(plan: PaidPlan) {
  return process.env[plan.stripePriceEnvKey]?.trim() || null;
}

export function getPlanByStripePriceId(priceId: string | null | undefined): PaidPlan | null {
  if (!priceId) return null;
  return paidPlans.find((plan) => getStripePriceIdForPlan(plan) === priceId) ?? null;
}

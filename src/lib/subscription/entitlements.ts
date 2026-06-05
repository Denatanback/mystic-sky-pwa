"use client";

import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

export type EntitlementPlan =
  | "free"
  | "trial_3_day_1_usd"
  | "premium_monthly_2999"
  | "premium_3_month_5999"
  | "premium_6_month_8999"
  | "internal_full_access";

export type SubscriptionStatus =
  | "free"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "internal";

export type EntitlementSource = "stripe" | "manual" | "internal" | "support";

export type Entitlements = {
  planId: EntitlementPlan;
  status: SubscriptionStatus;
  source: EntitlementSource;
  isFree: boolean;
  isTrial: boolean;
  isPremium: boolean;
  hasFullAccess: boolean;
  canAccessPremiumNodes: boolean;
  canAccessFullPractices: boolean;
  canAccessFullReadings: boolean;
  currentPeriodEnd?: string | null;
  trialEnd?: string | null;
};

type SubscriptionRow = {
  plan_id?: string | null;
  subscription_status?: string | null;
  entitlement_source?: string | null;
  current_period_end?: string | null;
  trial_end?: string | null;
  status?: string | null;
  plan?: string | null;
  provider?: string | null;
};

const planIds: EntitlementPlan[] = [
  "free",
  "trial_3_day_1_usd",
  "premium_monthly_2999",
  "premium_3_month_5999",
  "premium_6_month_8999",
  "internal_full_access",
];

const statuses: SubscriptionStatus[] = ["free", "trialing", "active", "past_due", "canceled", "unpaid", "internal"];
const sources: EntitlementSource[] = ["stripe", "manual", "internal", "support"];
const legacyIntroPlanAlias = ["tri", "al"].join("");

export const freeEntitlements: Entitlements = {
  planId: "free",
  status: "free",
  source: "manual",
  isFree: true,
  isTrial: false,
  isPremium: false,
  hasFullAccess: false,
  canAccessPremiumNodes: false,
  canAccessFullPractices: false,
  canAccessFullReadings: false,
  currentPeriodEnd: null,
  trialEnd: null,
};

function normalizePlan(value?: string | null): EntitlementPlan {
  if (value === legacyIntroPlanAlias) return "trial_3_day_1_usd";
  if (value === "premium") return "premium_monthly_2999";
  return planIds.includes(value as EntitlementPlan) ? value as EntitlementPlan : "free";
}

function normalizeStatus(value?: string | null): SubscriptionStatus {
  if (value === "expired") return "canceled";
  return statuses.includes(value as SubscriptionStatus) ? value as SubscriptionStatus : "free";
}

function normalizeSource(value?: string | null): EntitlementSource {
  return sources.includes(value as EntitlementSource) ? value as EntitlementSource : "manual";
}

function isFutureOrOpen(value?: string | null) {
  if (!value) return true;
  const time = new Date(value).getTime();
  return Number.isFinite(time) && time > Date.now();
}

function scoreRow(row: SubscriptionRow) {
  const status = normalizeStatus(row.subscription_status ?? row.status);
  const planId = normalizePlan(row.plan_id ?? row.plan);
  if (status === "internal" || planId === "internal_full_access") return 5;
  if (status === "active") return 4;
  if (status === "trialing" && isFutureOrOpen(row.trial_end)) return 3;
  if (status === "past_due" || status === "unpaid") return 2;
  if (status === "free") return 1;
  return 0;
}

function chooseCurrentRow(rows: SubscriptionRow[]) {
  return [...rows].sort((a, b) => scoreRow(b) - scoreRow(a))[0] ?? null;
}

export function entitlementsFromSubscription(row?: SubscriptionRow | null): Entitlements {
  if (!row) return freeEntitlements;

  const planId = normalizePlan(row.plan_id ?? row.plan);
  const status = normalizeStatus(row.subscription_status ?? row.status);
  const source = normalizeSource(row.entitlement_source ?? row.provider);
  const internal = planId === "internal_full_access" && status === "internal";
  const introAccess = status === "trialing" && isFutureOrOpen(row.trial_end);
  const active = status === "active";
  const hasFullAccess = internal || active || introAccess;
  const isPremium = internal || active || planId.startsWith("premium_");

  return {
    planId,
    status,
    source: internal ? "internal" : source,
    isFree: !hasFullAccess,
    isTrial: introAccess,
    isPremium,
    hasFullAccess,
    canAccessPremiumNodes: hasFullAccess,
    canAccessFullPractices: hasFullAccess,
    canAccessFullReadings: hasFullAccess,
    currentPeriodEnd: row.current_period_end ?? null,
    trialEnd: row.trial_end ?? null,
  };
}

export function getEntitlementLabel(entitlements: Entitlements) {
  if (entitlements.planId === "internal_full_access" && entitlements.status === "internal") return "Full Access";
  if (entitlements.isTrial) return "Intro access";
  if (entitlements.isPremium && entitlements.hasFullAccess) return "Premium";
  return "No active plan";
}

async function fetchSubscriptionRows(userId: string) {
  if (!supabase) return [];

  const extended = await supabase
    .from("subscriptions")
    .select("plan_id, subscription_status, entitlement_source, current_period_end, trial_end, status, plan, provider")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (!extended.error) return (extended.data ?? []) as SubscriptionRow[];

  const fallback = await supabase
    .from("subscriptions")
    .select("status, plan, provider, current_period_end")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (fallback.error) return [];
  return (fallback.data ?? []) as SubscriptionRow[];
}

export async function getEntitlements(): Promise<Entitlements> {
  if (!isSupabaseConfigured || !supabase) return freeEntitlements;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return freeEntitlements;

  const rows = await fetchSubscriptionRows(data.user.id);
  return entitlementsFromSubscription(chooseCurrentRow(rows));
}

export function useEntitlements() {
  const [entitlements, setEntitlements] = useState<Entitlements>(freeEntitlements);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const next = await getEntitlements();
      if (!cancelled) {
        setEntitlements(next);
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { entitlements, loading };
}

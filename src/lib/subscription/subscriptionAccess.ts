import { getMockUser } from "@/lib/mockAuth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { entitlementsFromSubscription } from "@/lib/subscription/entitlements";

export type SubscriptionStatus = "free" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | "internal";

const premiumStatuses: SubscriptionStatus[] = ["active", "trialing", "internal"];

export function canAccessPremiumByStatus(status?: string | null) {
  return premiumStatuses.includes(status as SubscriptionStatus);
}

export async function hasPremiumAccess(userId?: string | null): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || !userId) {
    // Mock mode keeps the current UI behavior: premium nodes stay locked unless
    // a later local entitlement layer explicitly enables them.
    return false;
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan_id, subscription_status, entitlement_source, current_period_end, trial_end, status, plan, provider")
    .eq("user_id", userId)
    .limit(10);

  if (error) return false;
  return Boolean(data?.some((row) => entitlementsFromSubscription(row).hasFullAccess));
}

export function getMockSubscriptionLabel() {
  return getMockUser() ? "No active plan" : "Guest";
}

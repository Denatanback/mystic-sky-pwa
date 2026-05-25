import { getMockUser } from "@/lib/mockAuth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

export type SubscriptionStatus = "free" | "trialing" | "active" | "past_due" | "canceled" | "expired";

const premiumStatuses: SubscriptionStatus[] = ["active", "trialing"];

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
    .select("status")
    .eq("user_id", userId)
    .in("status", premiumStatuses)
    .limit(1);

  if (error) return false;
  return Boolean(data?.length);
}

export function getMockSubscriptionLabel() {
  return getMockUser() ? "Free" : "Guest";
}


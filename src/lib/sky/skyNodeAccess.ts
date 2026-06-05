import type { Entitlements } from "@/lib/subscription/entitlements";

export type SkyDisciplineKey = "astrology" | "numerology" | "pastlife" | "soulmate" | "humandesign" | "spiritual";

export function canAccessSkyNode(input: {
  discipline: SkyDisciplineKey;
  nodeId: number;
  entitlements: Pick<Entitlements, "hasFullAccess">;
}) {
  return input.entitlements.hasFullAccess;
}

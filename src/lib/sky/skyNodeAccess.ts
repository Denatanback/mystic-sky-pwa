import type { Entitlements } from "@/lib/subscription/entitlements";

export type SkyDisciplineKey = "astrology" | "numerology" | "pastlife" | "soulmate" | "humandesign" | "spiritual";

const freeNodeMatrix: Partial<Record<SkyDisciplineKey, number[]>> = {
  astrology: [1],
  numerology: [1],
};

export function canAccessSkyNode(input: {
  discipline: SkyDisciplineKey;
  nodeId: number;
  entitlements: Pick<Entitlements, "hasFullAccess">;
}) {
  if (input.entitlements.hasFullAccess) return true;
  return freeNodeMatrix[input.discipline]?.includes(input.nodeId) ?? false;
}

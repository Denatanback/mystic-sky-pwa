"use client";

import { completeNode, getNodeState } from "@/lib/nodeProgress";

export type SupportedClaimType = "past_life_role" | "soulmate_type";

export type RawPrelandClaim =
  | {
      claimType: "past_life_role";
      payload: { role: string };
      claimId?: string;
      source?: string;
    }
  | {
      claimType: "soulmate_type";
      payload: { soulmateType: string };
      claimId?: string;
      source?: string;
    };

export type ValidPrelandClaim = {
  claimType: SupportedClaimType;
  discipline: "pastlife" | "soulmate";
  nodeId: 1;
  route: "/sky/pastlife/1" | "/sky/soulmate/1";
  resultTitle: "Past Life Role" | "Soulmate Type";
  resultId: string;
  payloadKey: "pastLifeRole" | "soulmateType";
  progressPayload: Record<string, unknown>;
  afterContinueHref: "/sky/pastlife" | "/sky/soulmate";
  claimId: string;
  source: string;
};

const CLAIM_STORAGE_KEY = "eluna.prelandClaim";
const APPLIED_CLAIM_STORAGE_KEY = "eluna.appliedPrelandClaim";

const PAST_LIFE_ROLES = new Set([
  "healer",
  "warrior",
  "priestess",
  "priest",
  "scientist",
  "artist",
  "explorer",
  "teacher",
  "ruler",
]);

const SOULMATE_TYPES = new Set([
  "protector",
  "adventurer",
  "mystic",
  "creator",
  "intellectual",
  "healer",
]);

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeId(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase().replace(/\s+/g, "_") : "";
}

function readJsonClaim(raw: string | null): RawPrelandClaim | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RawPrelandClaim;
  } catch {
    return null;
  }
}

function readBase64Claim(raw: string | null): RawPrelandClaim | null {
  if (!raw) return null;
  try {
    return JSON.parse(atob(raw)) as RawPrelandClaim;
  } catch {
    return null;
  }
}

function detectQueryClaim(): RawPrelandClaim | null {
  if (!isBrowser()) return null;
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("claim");
  const fromEncoded = readBase64Claim(encoded) ?? readJsonClaim(encoded);
  if (fromEncoded) return { ...fromEncoded, source: fromEncoded.source ?? "query" };

  const claimType = params.get("claimType");
  if (claimType === "past_life_role") {
    return {
      claimType,
      payload: { role: params.get("role") ?? "" },
      claimId: params.get("claimId") ?? undefined,
      source: "query",
    };
  }
  if (claimType === "soulmate_type") {
    return {
      claimType,
      payload: { soulmateType: params.get("soulmateType") ?? "" },
      claimId: params.get("claimId") ?? undefined,
      source: "query",
    };
  }
  return null;
}

export function writeMockClaim(claim: RawPrelandClaim) {
  if (!isBrowser()) return;
  localStorage.setItem(CLAIM_STORAGE_KEY, JSON.stringify({ ...claim, source: claim.source ?? "localStorage" }));
}

export function detectClaim(): RawPrelandClaim | null {
  if (!isBrowser()) return null;
  const queryClaim = detectQueryClaim();
  if (queryClaim) return queryClaim;
  const stored = readJsonClaim(localStorage.getItem(CLAIM_STORAGE_KEY));
  return stored ? { ...stored, source: stored.source ?? "localStorage" } : null;
}

export function validateClaim(claim: RawPrelandClaim | null): ValidPrelandClaim | null {
  if (!claim) return null;

  if (claim.claimType === "past_life_role") {
    const resultId = normalizeId(claim.payload.role);
    if (!PAST_LIFE_ROLES.has(resultId)) return null;
    return {
      claimType: "past_life_role",
      discipline: "pastlife",
      nodeId: 1,
      route: "/sky/pastlife/1",
      resultTitle: "Past Life Role",
      resultId,
      payloadKey: "pastLifeRole",
      progressPayload: {
        pastLifeRole: resultId,
        soulAge: resultId,
        source: "preland",
        claimId: claim.claimId ?? `local-${claim.claimType}-${resultId}`,
      },
      afterContinueHref: "/sky/pastlife",
      claimId: claim.claimId ?? `local-${claim.claimType}-${resultId}`,
      source: claim.source ?? "localStorage",
    };
  }

  if (claim.claimType === "soulmate_type") {
    const resultId = normalizeId(claim.payload.soulmateType);
    if (!SOULMATE_TYPES.has(resultId)) return null;
    return {
      claimType: "soulmate_type",
      discipline: "soulmate",
      nodeId: 1,
      route: "/sky/soulmate/1",
      resultTitle: "Soulmate Type",
      resultId,
      payloadKey: "soulmateType",
      progressPayload: {
        soulmateType: resultId,
        venusSign: resultId,
        source: "preland",
        claimId: claim.claimId ?? `local-${claim.claimType}-${resultId}`,
      },
      afterContinueHref: "/sky/soulmate",
      claimId: claim.claimId ?? `local-${claim.claimType}-${resultId}`,
      source: claim.source ?? "localStorage",
    };
  }

  return null;
}

export function applyClaimToProgress(claim: ValidPrelandClaim) {
  const existing = getNodeState(claim.discipline, claim.nodeId);
  completeNode(claim.discipline, claim.nodeId, {
    ...(existing.result ?? {}),
    ...claim.progressPayload,
    claimedAt: new Date().toISOString(),
  });
  if (isBrowser()) {
    localStorage.setItem(APPLIED_CLAIM_STORAGE_KEY, JSON.stringify({
      claimId: claim.claimId,
      claimType: claim.claimType,
      discipline: claim.discipline,
      nodeId: claim.nodeId,
      resultId: claim.resultId,
      appliedAt: new Date().toISOString(),
    }));
  }
}

export function clearClaim() {
  if (!isBrowser()) return;
  localStorage.removeItem(CLAIM_STORAGE_KEY);
  const url = new URL(window.location.href);
  ["claim", "claimType", "role", "soulmateType", "claimId"].forEach((key) => url.searchParams.delete(key));
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

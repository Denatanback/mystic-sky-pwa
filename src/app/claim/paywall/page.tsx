"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";
import {
  detectClaim,
  syncPendingClaimToServer,
  validateClaim,
  applyClaimToProgress,
} from "@/lib/claims/claimFlow";
import { getPrelandContext } from "@/lib/funnel/prelandContext";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PendingClaimRow = {
  id: string;
  claim_type: string;
  claim_id: string | null;
  funnel: string | null;
  offer: string | null;
  payload: Record<string, unknown>;
};

type AccessStatusResponse = {
  active: boolean;
  pendingClaim: {
    id: string;
    claimType: string;
    claimId: string | null;
    funnel: string | null;
    offer: string | null;
    payload: Record<string, unknown>;
  } | null;
  redirectTo: string | null;
};

type PageState = "loading" | "paywall" | "redirecting" | "no_claim";

// ---------------------------------------------------------------------------
// Copy
// ---------------------------------------------------------------------------

type PaywallCopy = {
  headline: string;
  eyebrow: string;
  subtitle: string;
  discountBadge: string;
  priceLabel: string;
  regularPrice: string;
  ctaLabel: string;
};

function resolvePaywallCopy(claimType: string | null, funnel: string | null): PaywallCopy {
  const key = claimType ?? funnel ?? "";

  if (key === "past_life_role" || funnel === "pastlife") {
    return {
      eyebrow: "Your reading is ready",
      headline: "Your Past Life Reading is ready",
      subtitle:
        "We found the role your soul carried before this life. Unlock your full Past Life profile, karmic patterns, hidden gifts, and your next soul lesson.",
      discountBadge: "Your preland discount has been applied",
      priceLabel: "3-day access for $1",
      regularPrice: "Regular price: $5",
      ctaLabel: "Unlock my Past Life reading",
    };
  }

  if (
    key === "soulmate_type" ||
    funnel === "soulmate" ||
    funnel === "soulmatev" ||
    funnel === "soulmatew"
  ) {
    return {
      eyebrow: "Your reading is ready",
      headline: "Your Soulmate Type is ready",
      subtitle:
        "We've prepared your relationship archetype and the emotional pattern that shapes who you attract. Unlock your full Soulmate reading, compatibility clues, attraction signals, and deeper relationship guidance.",
      discountBadge: "Your preland discount has been applied",
      priceLabel: "3-day access for $1",
      regularPrice: "Regular price: $5",
      ctaLabel: "Unlock my Soulmate reading",
    };
  }

  // Fallback
  return {
    eyebrow: "Your reading is ready",
    headline: "Your personal reading is ready",
    subtitle:
      "Unlock your full personalized path, deeper insights, and guided progression.",
    discountBadge: "",
    priceLabel: "3-day access for $1",
    regularPrice: "",
    ctaLabel: "Unlock my reading",
  };
}

// ---------------------------------------------------------------------------
// Destination mapping
// ---------------------------------------------------------------------------

function resolveDestination(claimType: string | null, funnel: string | null): string {
  if (claimType === "past_life_role" || funnel === "pastlife") return "/sky/pastlife/1";
  if (
    claimType === "soulmate_type" ||
    funnel === "soulmate" ||
    funnel === "soulmatev" ||
    funnel === "soulmatew"
  )
    return "/sky/soulmate/1";
  return "/home";
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function ClaimPaywallPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>("loading");
  const [claim, setClaim] = useState<PendingClaimRow | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [introAlreadyUsed, setIntroAlreadyUsed] = useState(false);
  const initDone = useRef(false);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    void (async () => {
      // 1. Sync any localStorage claim to the server (covers OAuth post-redirect users)
      await syncPendingClaimToServer();

      // 2. Check server-side access + pending claim together
      let statusRes: AccessStatusResponse | null = null;
      try {
        const res = await fetch("/api/access/status");
        if (res.status === 401) {
          router.replace("/login?returnTo=/claim/paywall");
          return;
        }
        if (res.ok) statusRes = (await res.json()) as AccessStatusResponse;
      } catch {
        // fall through
      }

      // 3. Fetch pending claim from DB
      let pendingClaim: PendingClaimRow | null = null;
      try {
        const res = await fetch("/api/claims/pending");
        if (res.ok) {
          const json = (await res.json()) as { claim: PendingClaimRow | null };
          pendingClaim = json.claim ?? null;
        }
      } catch {
        // ignore
      }

      // If no server claim, fall back to localStorage
      if (!pendingClaim) {
        const localClaim = validateClaim(detectClaim());
        if (!localClaim) {
          setState("no_claim");
          router.replace("/home");
          return;
        }
      }

      // 4. If user already has active access, apply claim and redirect to discipline
      if (statusRes?.active && pendingClaim) {
        const validClaim =
          pendingClaim.claim_type === "past_life_role"
            ? validateClaim({
                claimType: "past_life_role",
                payload: { role: (pendingClaim.payload?.role as string) ?? "" },
                claimId: pendingClaim.claim_id ?? undefined,
                funnel: pendingClaim.funnel ?? undefined,
                source: "db",
              })
            : pendingClaim.claim_type === "soulmate_type"
            ? validateClaim({
                claimType: "soulmate_type",
                payload: { soulmateType: (pendingClaim.payload?.soulmateType as string) ?? "" },
                claimId: pendingClaim.claim_id ?? undefined,
                funnel: pendingClaim.funnel ?? undefined,
                source: "db",
              })
            : null;
        if (validClaim) {
          applyClaimToProgress(validClaim);
          await fetch("/api/claims/pending", { method: "DELETE" }).catch(() => null);
        }
        const dest = resolveDestination(pendingClaim.claim_type, pendingClaim.funnel);
        setState("redirecting");
        router.replace(dest);
        return;
      }

      if (pendingClaim) {
        setClaim(pendingClaim);
        setState("paywall");
      } else {
        setState("no_claim");
        router.replace("/home");
      }
    })();
  }, [router]);

  async function handleCheckout() {
    if (!claim) return;
    setCheckoutError("");
    setCheckoutLoading(true);

    const prelandCtx = getPrelandContext();
    const planId = introAlreadyUsed ? "monthly" : "intro_3_day";

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          claimId: claim.claim_id ?? undefined,
          claimType: claim.claim_type ?? undefined,
          funnelId: claim.funnel ?? undefined,
          offer: "intro_3_day",
          utmSource: prelandCtx.utm_source ?? undefined,
          utmCampaign: prelandCtx.utm_campaign ?? undefined,
          subid: prelandCtx.ad_id ?? undefined,
          clickId: prelandCtx.campaign_id ?? undefined,
        }),
      });

      const payload = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
        introAlreadyUsed?: boolean;
        alreadyActive?: boolean;
      };

      if (!res.ok || !payload.url) {
        if (payload.introAlreadyUsed) {
          setIntroAlreadyUsed(true);
          setCheckoutError(
            "The introductory offer was already used. Switched to monthly plan — click again to continue."
          );
          setCheckoutLoading(false);
          return;
        }
        if (payload.alreadyActive) {
          setCheckoutError("You already have active access. Redirecting…");
          setTimeout(() => {
            const dest = resolveDestination(claim.claim_type, claim.funnel);
            router.replace(dest);
          }, 1500);
          setCheckoutLoading(false);
          return;
        }
        setCheckoutError(payload.error ?? "Could not start checkout. Please try again.");
        setCheckoutLoading(false);
        return;
      }

      window.location.href = payload.url;
    } catch {
      setCheckoutError("Could not start checkout. Please try again.");
      setCheckoutLoading(false);
    }
  }

  // ---- Shared styles ----
  const containerStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 2,
    width: "min(100%, 460px)",
    margin: "0 auto",
    border: "1px solid rgba(216,168,95,.26)",
    borderRadius: 28,
    background:
      "radial-gradient(circle at 18% 0%, rgba(216,168,95,.12), transparent 38%), rgba(12,8,28,.88)",
    boxShadow: "0 22px 56px rgba(0,0,0,.46)",
    padding: "28px 20px 32px",
    textAlign: "center",
  };

  // ---- Loading / redirecting state ----
  if (state !== "paywall" || !claim) {
    return (
      <main
        className="app no-nav"
        style={{ minHeight: "100dvh", padding: "24px 18px 40px", display: "grid", alignItems: "center" }}
      >
        <StarField />
        <section style={containerStyle}>
          <div style={{ display: "grid", justifyItems: "center", marginBottom: 20 }}>
            <Logo variant="auth" />
          </div>
          <div
            style={{
              width: 36, height: 36, margin: "0 auto",
              borderRadius: "50%",
              border: "3px solid rgba(216,168,95,.18)",
              borderTopColor: "var(--gold)",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 16 }}>
            Preparing your reading…
          </p>
        </section>
      </main>
    );
  }

  // ---- Paywall state ----
  const copy = resolvePaywallCopy(claim.claim_type, claim.funnel);
  const showIntro = !introAlreadyUsed;

  return (
    <main
      className="app no-nav"
      style={{ minHeight: "100dvh", padding: "24px 18px 40px", display: "grid", alignItems: "center" }}
    >
      <StarField />
      <section style={containerStyle}>
        {/* Logo */}
        <div style={{ display: "grid", justifyItems: "center", marginBottom: 20 }}>
          <Logo variant="auth" />
        </div>

        {/* Eyebrow */}
        <p
          style={{
            color: "var(--gold)", fontSize: 10, fontWeight: 900,
            letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 10,
          }}
        >
          {copy.eyebrow}
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)", color: "var(--text)",
            fontSize: 28, fontWeight: 600, lineHeight: 1.1, marginBottom: 14,
          }}
        >
          {copy.headline}
        </h1>

        {/* Subtitle */}
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.62, marginBottom: 22 }}>
          {copy.subtitle}
        </p>

        {/* Discount / price banner */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(216,168,95,.20), rgba(216,168,95,.07))",
            border: "1px solid rgba(216,168,95,.32)",
            borderRadius: 14, padding: "12px 16px", marginBottom: 22,
            display: "flex", flexDirection: "column", gap: 4,
          }}
        >
          {copy.discountBadge && showIntro && (
            <p
              style={{
                color: "var(--gold)", fontSize: 11, fontWeight: 900,
                letterSpacing: ".08em", textTransform: "uppercase", margin: 0,
              }}
            >
              ✦ {copy.discountBadge}
            </p>
          )}
          <p
            style={{
              color: "var(--text)", fontSize: 24, fontWeight: 700,
              margin: 0, fontFamily: "var(--font-display)",
            }}
          >
            {showIntro ? copy.priceLabel : "$5.99 / month"}
          </p>
          {copy.regularPrice && showIntro && (
            <p style={{ color: "var(--muted-2)", fontSize: 12, textDecoration: "line-through", margin: 0 }}>
              {copy.regularPrice}
            </p>
          )}
          {introAlreadyUsed && (
            <p style={{ color: "var(--muted)", fontSize: 11, margin: 0 }}>
              Intro offer already used — regular monthly plan shown
            </p>
          )}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={() => void handleCheckout()}
          disabled={checkoutLoading}
          style={{
            width: "100%", minHeight: 52, borderRadius: 999,
            background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
            color: "#fff", fontSize: 16, fontWeight: 900,
            fontFamily: "var(--font-ui)", border: "none",
            cursor: checkoutLoading ? "default" : "pointer",
            opacity: checkoutLoading ? 0.72 : 1,
            boxShadow: "0 8px 28px rgba(90,32,144,.45), inset 0 1px 0 rgba(255,255,255,.12)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            marginBottom: 10, transition: "opacity .2s",
          }}
        >
          {checkoutLoading ? (
            <>
              <span
                style={{
                  width: 16, height: 16, borderRadius: "50%",
                  border: "2px solid rgba(255,255,255,.3)",
                  borderTopColor: "#fff",
                  animation: "spin 0.8s linear infinite",
                  flexShrink: 0,
                }}
              />
              Preparing checkout…
            </>
          ) : copy.ctaLabel}
        </button>

        {/* Error */}
        {checkoutError && (
          <p style={{ color: "var(--danger)", fontSize: 12, lineHeight: 1.45, margin: "6px 0 0", textAlign: "center" }}>
            {checkoutError}
          </p>
        )}

        {/* Trust line */}
        <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.5, marginTop: 14 }}>
          Secured by Stripe · Cancel anytime · No hidden fees
        </p>

        {/* Maybe later */}
        <button
          type="button"
          onClick={() => router.push("/home")}
          style={{
            background: "transparent", border: "none",
            color: "var(--muted-2)", fontSize: 11, cursor: "pointer",
            marginTop: 8, padding: "4px 8px",
            textDecoration: "underline", textUnderlineOffset: 2,
          }}
        >
          Maybe later
        </button>
      </section>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";
import { getPrelandContext } from "@/lib/funnel/prelandContext";

type AccessStatusResponse = {
  active: boolean;
  pendingClaim: { id: string; claimType: string; funnel: string | null } | null;
};

type PageState = "loading" | "paywall" | "redirecting";

export default function PaywallPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>("loading");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [introAlreadyUsed, setIntroAlreadyUsed] = useState(false);
  const initDone = useRef(false);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;

    void (async () => {
      try {
        const res = await fetch("/api/access/status");
        if (res.status === 401) {
          // Not authenticated — send to register
          router.replace("/register");
          return;
        }
        if (res.ok) {
          const json = (await res.json()) as AccessStatusResponse;
          // If already active, skip paywall
          if (json.active) {
            setState("redirecting");
            router.replace("/home");
            return;
          }
          // If they actually have a pending claim, send to the personalised paywall
          if (json.pendingClaim) {
            setState("redirecting");
            router.replace("/claim/paywall");
            return;
          }
        }
      } catch {
        // fall through and show paywall
      }
      setState("paywall");
    })();
  }, [router]);

  async function handleCheckout() {
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
            "The introductory offer was already used. Switched to monthly — click again to continue."
          );
          setCheckoutLoading(false);
          return;
        }
        if (payload.alreadyActive) {
          setState("redirecting");
          router.replace("/home");
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

  if (state !== "paywall") {
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
            Preparing your path…
          </p>
        </section>
      </main>
    );
  }

  const showIntro = !introAlreadyUsed;

  return (
    <main
      className="app no-nav"
      style={{ minHeight: "100dvh", padding: "24px 18px 40px", display: "grid", alignItems: "center" }}
    >
      <StarField />
      <section style={containerStyle}>
        {/* Logo */}
        <div style={{ display: "grid", justifyItems: "center", marginBottom: 22 }}>
          <Logo variant="auth" />
        </div>

        {/* Stars decoration */}
        <p
          style={{
            color: "var(--gold)", fontSize: 22, letterSpacing: ".3em",
            marginBottom: 14, lineHeight: 1,
          }}
        >
          ✦ ✦ ✦
        </p>

        {/* Eyebrow */}
        <p
          style={{
            color: "var(--gold)", fontSize: 10, fontWeight: 900,
            letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 10,
          }}
        >
          Your path is ready
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)", color: "var(--text)",
            fontSize: 30, fontWeight: 600, lineHeight: 1.08, marginBottom: 14,
          }}
        >
          Unlock your personal star path
        </h1>

        {/* Subtitle */}
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.65, marginBottom: 24 }}>
          Your personalized astrology, numerology, Human Design, soulmate, past life, and spiritual
          guidance are ready. Start your journey today.
        </p>

        {/* What's included */}
        <div
          style={{
            border: "1px solid rgba(216,168,95,.16)",
            borderRadius: 16, padding: "14px 16px", marginBottom: 22,
            background: "rgba(216,168,95,.05)",
            textAlign: "left",
            display: "grid", gap: 8,
          }}
        >
          {[
            "Daily personalized readings",
            "Full Sky Map — astrology, numerology, Human Design",
            "Past Life & Soulmate insights",
            "Practices, affirmations & rituals",
            "Weekly and monthly soul reports",
          ].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--gold)", fontSize: 13, flexShrink: 0 }}>✦</span>
              <span style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Price banner */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(216,168,95,.22), rgba(216,168,95,.07))",
            border: "1px solid rgba(216,168,95,.32)",
            borderRadius: 14, padding: "12px 16px", marginBottom: 22,
            display: "flex", flexDirection: "column", gap: 4,
          }}
        >
          <p
            style={{
              color: "var(--text)", fontSize: 24, fontWeight: 700,
              margin: 0, fontFamily: "var(--font-display)",
            }}
          >
            {showIntro ? "3-day access for $1" : "$5.99 / month"}
          </p>
          {showIntro && (
            <p style={{ color: "var(--muted)", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
              Then continue with your selected plan.
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
          ) : (
            "Start my journey"
          )}
        </button>

        {checkoutError && (
          <p style={{ color: "var(--danger)", fontSize: 12, lineHeight: 1.45, margin: "6px 0 0", textAlign: "center" }}>
            {checkoutError}
          </p>
        )}

        <p style={{ color: "var(--muted-2)", fontSize: 11, lineHeight: 1.5, marginTop: 14 }}>
          Secured by Stripe · Cancel anytime · No hidden fees
        </p>
      </section>
    </main>
  );
}

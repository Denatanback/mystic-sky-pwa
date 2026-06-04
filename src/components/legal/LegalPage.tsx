"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { StarField } from "@/components/app-shell/StarField";
import { BILLING_SUPPORT_MAILTO, REFUND_SUPPORT_MAILTO, SUPPORT_EMAIL_ADDRESS, SUPPORT_MAILTO, type LegalDocument } from "@/lib/legal/legalContent";

type LegalPageProps = {
  document: LegalDocument;
};

const cardStyle: CSSProperties = {
  border: "1px solid rgba(216,168,95,.20)",
  borderRadius: 24,
  background: "rgba(12,8,28,.72)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 18px 48px rgba(0,0,0,.30)",
};

function supportHrefForDocument(document: LegalDocument) {
  if (document.slug === "money-back") return REFUND_SUPPORT_MAILTO;
  if (document.slug === "billing" || document.slug === "cancellation") return BILLING_SUPPORT_MAILTO;
  return SUPPORT_MAILTO;
}

function validateReturnTo(value: string | null) {
  if (!value) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (value.includes("http://") || value.includes("https://")) return null;
  return value;
}

function getReturnToFromLocation() {
  if (typeof window === "undefined") return null;
  return validateReturnTo(new URLSearchParams(window.location.search).get("returnTo"));
}

function isSafeInternalReferrer() {
  if (typeof document === "undefined" || typeof window === "undefined" || !document.referrer) return false;
  try {
    return new URL(document.referrer).origin === window.location.origin;
  } catch {
    return false;
  }
}

function legalHref(path: string, returnTo: string) {
  return `${path}?returnTo=${encodeURIComponent(returnTo)}`;
}

function renderInlineLinks(text: string, supportHref: string, returnTo: string) {
  const parts = text.split(SUPPORT_EMAIL_ADDRESS);
  const linkedEmail = parts.flatMap((part, index) => {
    if (index === parts.length - 1) return [part];
    return [
      part,
      <a key={`email-${index}`} href={supportHref} style={{ color: "var(--gold-2)", fontWeight: 800, textDecoration: "none", overflowWrap: "anywhere" }}>
        {SUPPORT_EMAIL_ADDRESS}
      </a>,
    ];
  });

  return linkedEmail.flatMap((part, index) => {
    if (typeof part !== "string") return [part];
    const moneyParts = part.split("Money-Back Policy");
    return moneyParts.flatMap((moneyPart, moneyIndex) => {
      if (moneyIndex === moneyParts.length - 1) return [moneyPart];
      return [
        moneyPart,
        <Link key={`money-${index}-${moneyIndex}`} href={legalHref("/money-back", returnTo)} style={{ color: "var(--gold-2)", fontWeight: 800, textDecoration: "none" }}>
          Money-Back Policy
        </Link>,
      ];
    });
  });
}

export function LegalPage({ document }: LegalPageProps) {
  const router = useRouter();
  const supportHref = supportHrefForDocument(document);
  const [returnTo, setReturnTo] = useState("/");

  useEffect(() => {
    setReturnTo(getReturnToFromLocation() ?? "/");
  }, []);

  function goBack() {
    const safeReturnTo = getReturnToFromLocation();
    if (safeReturnTo) {
      router.push(safeReturnTo);
      return;
    }

    if (isSafeInternalReferrer()) {
      router.back();
      return;
    }

    router.push("/");
  }

  return (
    <main className="app no-nav" style={{ minHeight: "100dvh", padding: "0 18px 40px" }}>
      <StarField />
      <div style={{ position: "relative", zIndex: 2, width: "min(100%, 820px)", margin: "0 auto", paddingTop: 18 }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
          <button type="button" onClick={goBack} aria-label="Back" style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", display: "grid", placeItems: "center", color: "var(--text)", textDecoration: "none", flexShrink: 0, cursor: "pointer" }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5m0 0 7 7m-7-7 7-7" /></svg>
          </button>
          <Link href="/settings" style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 900, textDecoration: "none" }}>
            Settings
          </Link>
        </header>

        <article style={{ ...cardStyle, padding: "24px 18px" }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 8 }}>Legal</p>
          <h1 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 36, fontWeight: 600, lineHeight: 1.04, marginBottom: 8 }}>{document.title}</h1>
          <p style={{ color: "var(--muted-2)", fontSize: 13, lineHeight: 1.5, marginBottom: 20 }}>{document.effectiveDate}</p>

          <div style={{ display: "grid", gap: 20 }}>
            {document.sections.map((section, index) => (
              <section key={`${section.title}-${index}`} style={{ borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,.08)", paddingTop: index === 0 ? 0 : 18 }}>
                <h2 style={{ color: "var(--gold-2)", fontSize: 18, lineHeight: 1.22, fontWeight: 900, marginBottom: 10 }}>{section.title}</h2>
                <div style={{ display: "grid", gap: 9 }}>
                  {section.body.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex} style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.68 }}>{renderInlineLinks(paragraph, supportHref, returnTo)}</p>
                  ))}
                </div>
                {section.bullets && (
                  <ul style={{ display: "grid", gap: 8, margin: "11px 0 0 18px", padding: 0 }}>
                    {section.bullets.map((bullet) => (
                      <li key={bullet} style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, paddingLeft: 2 }}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <section style={{ border: "1px solid rgba(216,168,95,.18)", borderRadius: 18, background: "rgba(216,168,95,.07)", padding: 14, marginTop: 24 }}>
            <p style={{ color: "var(--gold-2)", fontSize: 13, fontWeight: 900, marginBottom: 5 }}>Contact support</p>
            <a href={supportHref} style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.5, fontWeight: 800, textDecoration: "none", overflowWrap: "anywhere" }}>
              {SUPPORT_EMAIL_ADDRESS}
            </a>
          </section>
        </article>
      </div>
    </main>
  );
}

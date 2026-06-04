import Link from "next/link";
import type { CSSProperties } from "react";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";
import { SUPPORT_EMAIL_ADDRESS } from "@/lib/legal/legalContent";

const supportHref = "mailto:support@myeluna.com?subject=eLuna%20Support";
const billingSupportHref = "mailto:support@myeluna.com?subject=eLuna%20Billing%20Question";

const productBullets = [
  "Daily readings and reflection prompts",
  "Symbolic cards and guidance",
  "Personal Sky Map insights",
  "Affirmations and practices",
  "Journal and progress features",
];

const plans = [
  { name: "Free preview", price: "$0", note: "Limited preview access after account creation." },
  { name: "3-day introductory access", price: "$1", note: "Temporary access to paid digital features during the intro period." },
  { name: "Monthly subscription", price: "$29.99/month", note: "Renews monthly unless cancelled." },
  { name: "3-month subscription", price: "$59.99 every 3 months", note: "Renews every 3 months unless cancelled." },
  { name: "6-month subscription", price: "$89.99 every 6 months", note: "Renews every 6 months unless cancelled." },
];

const footerLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Billing Terms", href: "/billing" },
  { label: "Refund Policy", href: "/money-back" },
  { label: "Cancellation Policy", href: "/cancellation" },
  { label: "Fulfillment Policy", href: "/delivery" },
];

const sectionStyle: CSSProperties = {
  border: "1px solid rgba(216,168,95,.18)",
  borderRadius: 24,
  background: "rgba(12,8,28,.72)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 18px 48px rgba(0,0,0,.28)",
  padding: "22px 18px",
};

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 7 }}>
        {eyebrow}
      </p>
      <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: "clamp(26px, 8vw, 38px)", fontWeight: 600, lineHeight: 1.06 }}>
        {title}
      </h2>
    </div>
  );
}

export default function WelcomeHeadPage() {
  return (
    <main className="app no-nav" style={{ minHeight: "100dvh", padding: "0 18px 42px", overflowX: "hidden" }}>
      <StarField />
      <div style={{ position: "relative", zIndex: 2, width: "min(100%, 920px)", margin: "0 auto", paddingTop: 18 }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 28 }}>
          <Logo variant="header" priority />
          <Link href="/login" style={{ color: "var(--gold-2)", fontSize: 13, fontWeight: 900, textDecoration: "none" }}>
            Sign in
          </Link>
        </header>

        <section style={{ display: "grid", gap: 24, minHeight: "min(680px, calc(100dvh - 64px))", alignContent: "center", padding: "26px 0 36px" }}>
          <div style={{ display: "grid", gap: 16, maxWidth: 720 }}>
            <p style={{ color: "var(--gold)", fontSize: 11, fontWeight: 900, letterSpacing: ".16em", textTransform: "uppercase" }}>
              eLuna digital subscription app
            </p>
            <h1 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: "clamp(44px, 13vw, 78px)", fontWeight: 600, lineHeight: .96 }}>
              AI-powered self-reflection for your inner world
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "clamp(15px, 4vw, 18px)", lineHeight: 1.62, maxWidth: 680 }}>
              eLuna helps you pause, reflect, and explore symbolic guidance through daily readings, personal insights, and AI-powered reflection tools.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/register" style={{ minHeight: 52, borderRadius: 999, padding: "0 22px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: "#fff", fontSize: 15, fontWeight: 900, textDecoration: "none", boxShadow: "0 8px 28px rgba(90,32,144,.45)" }}>
              Create account
            </Link>
            <Link href="/login" style={{ minHeight: 52, borderRadius: 999, padding: "0 22px", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(216,168,95,.30)", background: "rgba(255,255,255,.05)", color: "var(--text)", fontSize: 15, fontWeight: 900, textDecoration: "none" }}>
              Sign in
            </Link>
          </div>

          <p style={{ color: "var(--muted-2)", fontSize: 12, lineHeight: 1.55, maxWidth: 620 }}>
            eLuna is for self-reflection and entertainment. It is not medical, legal, financial, psychological, or crisis advice.
          </p>
        </section>

        <div style={{ display: "grid", gap: 18 }}>
          <section style={sectionStyle}>
            <SectionTitle eyebrow="Product" title="What is eLuna?" />
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>
              eLuna is a digital subscription app that provides AI-powered readings, daily symbolic guidance, personal reflection prompts, affirmations, and spiritual self-awareness tools. The app is designed for personal reflection and entertainment, not professional advice.
            </p>
            <ul style={{ display: "grid", gap: 9, margin: "0 0 0 18px", padding: 0 }}>
              {productBullets.map((item) => (
                <li key={item} style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.55, paddingLeft: 2 }}>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section style={sectionStyle}>
            <SectionTitle eyebrow="Pricing" title="Subscription options" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
              {plans.map((plan) => (
                <article key={plan.name} style={{ border: "1px solid rgba(255,255,255,.10)", borderRadius: 18, background: "rgba(255,255,255,.04)", padding: 14 }}>
                  <h3 style={{ color: "var(--text)", fontSize: 15, lineHeight: 1.28, fontWeight: 900, marginBottom: 7 }}>{plan.name}</h3>
                  <p style={{ color: "var(--gold-2)", fontSize: 20, lineHeight: 1.15, fontWeight: 900, marginBottom: 8 }}>{plan.price}</p>
                  <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.55 }}>{plan.note}</p>
                </article>
              ))}
            </div>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.65, marginTop: 14 }}>
              Subscriptions renew automatically unless cancelled. For cancellation, refund, or billing questions, contact{" "}
              <a href={billingSupportHref} style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none", overflowWrap: "anywhere" }}>
                {SUPPORT_EMAIL_ADDRESS}
              </a>
              .
            </p>
            <Link href="/register" style={{ marginTop: 14, minHeight: 48, borderRadius: 999, padding: "0 18px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(216,168,95,.12)", border: "1px solid rgba(216,168,95,.24)", color: "var(--gold-2)", fontSize: 14, fontWeight: 900, textDecoration: "none" }}>
              Create account to continue
            </Link>
          </section>

          <section style={sectionStyle}>
            <SectionTitle eyebrow="Fulfillment" title="Digital delivery" />
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
              eLuna is a digital service. After account creation and successful subscription activation, access to paid digital features is delivered through the user's eLuna account. No physical goods are shipped.
            </p>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 10 }}>
              Free preview features are available after account creation. Paid features become available after subscription activation.
            </p>
          </section>

          <section style={sectionStyle}>
            <SectionTitle eyebrow="Support" title="Cancellation and refunds" />
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
              Users can request cancellation by contacting{" "}
              <a href={billingSupportHref} style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none", overflowWrap: "anywhere" }}>
                {SUPPORT_EMAIL_ADDRESS}
              </a>
              . Cancellation requests should include the email address associated with the eLuna account.
            </p>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 10 }}>
              Refund requests should be sent to{" "}
              <a href={billingSupportHref} style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none", overflowWrap: "anywhere" }}>
                {SUPPORT_EMAIL_ADDRESS}
              </a>
              . Each request is reviewed according to account status, subscription activity, and applicable law. If approved, refunds are processed back to the original payment method where possible.
            </p>
          </section>

          <section style={sectionStyle}>
            <SectionTitle eyebrow="Company" title="Company details" />
            {/* TODO: Replace these placeholders with real company details before Stripe review. */}
            <dl style={{ display: "grid", gap: 10, margin: 0 }}>
              {[
                ["Legal name", "[LEGAL COMPANY NAME]"],
                ["Registered address", "[REGISTERED ADDRESS]"],
                ["Country", "[COUNTRY]"],
                ["Contact", SUPPORT_EMAIL_ADDRESS],
                ["Website", "https://www.myeluna.com"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "grid", gridTemplateColumns: "minmax(120px, .4fr) 1fr", gap: 10, alignItems: "baseline" }}>
                  <dt style={{ color: "var(--muted-2)", fontSize: 12, fontWeight: 900 }}>{label}</dt>
                  <dd style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.55, margin: 0, overflowWrap: "anywhere" }}>
                    {label === "Contact" ? (
                      <a href={supportHref} style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none" }}>{value}</a>
                    ) : label === "Website" ? (
                      <a href="https://www.myeluna.com" style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none" }}>{value}</a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p style={{ color: "var(--muted-2)", fontSize: 12, lineHeight: 1.55, marginTop: 12 }}>
              Before Stripe review these placeholders must be replaced with real company details.
            </p>
          </section>
        </div>

        <footer style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 14px", padding: "28px 0 0", color: "var(--muted-2)", fontSize: 12 }}>
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none" }}>
              {link.label}
            </Link>
          ))}
          <a href={supportHref} style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none", overflowWrap: "anywhere" }}>
            Support
          </a>
        </footer>
      </div>
    </main>
  );
}

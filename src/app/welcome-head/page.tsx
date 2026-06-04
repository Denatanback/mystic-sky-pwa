import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";
import { SUPPORT_EMAIL_ADDRESS } from "@/lib/legal/legalContent";

const appLoginUrl = "https://www.myeluna.com/login";
const appRegisterUrl = "https://www.myeluna.com/register";
const supportHref = "mailto:support@myeluna.com?subject=eLuna%20Support";
const billingSupportHref = "mailto:support@myeluna.com?subject=eLuna%20Billing%20Question";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const trustBullets = [
  "Digital subscription service",
  "Secure payment flow",
  "Support: support@myeluna.com",
  "No physical goods shipped",
];

const previewCards = [
  {
    title: "Today's reading",
    tag: "Daily guidance",
    body: "A focused symbolic theme, reflection prompt, and next step for the day.",
    icon: "moon",
  },
  {
    title: "Symbolic card",
    tag: "Card insight",
    body: "A personal card draw with meaning, action, and reflection space.",
    icon: "star",
  },
  {
    title: "Sky Map",
    tag: "Personal path",
    body: "A visual map of astrology-inspired, numerology-inspired, and soul-path insights.",
    icon: "orbit",
  },
  {
    title: "Practices",
    tag: "Affirmations",
    body: "Guided practices, affirmations, and journal prompts for self-awareness.",
    icon: "spark",
  },
];

const features = [
  {
    title: "Daily readings and reflection prompts",
    body: "Start each day with a clear symbolic reading and a grounded question for personal reflection.",
  },
  {
    title: "Symbolic cards and guidance",
    body: "Draw a card, explore its meaning, and save a simple action or reflection.",
  },
  {
    title: "Personal Sky Map insights",
    body: "Explore a structured map of personal themes, unlocks, and deeper symbolic signals.",
  },
  {
    title: "Affirmations and practices",
    body: "Use guided affirmations and short practices to turn insight into a daily ritual.",
  },
  {
    title: "Journal and progress features",
    body: "Keep a visible record of reflections, progress, and return moments over time.",
  },
  {
    title: "AI-powered reflection tools",
    body: "Use AI-assisted prompts to explore patterns, questions, and self-awareness themes.",
  },
];

const steps = [
  ["Create your account", "Start with email or Google and enter the eLuna app."],
  ["Add your birth details and preferences", "Share optional birth time, birth place, and focus areas for personalization."],
  ["Explore your daily guidance and Sky Map", "Open daily readings, cards, practices, and symbolic path previews."],
  ["Unlock deeper readings with a subscription", "Use a paid plan to access deeper digital guidance and premium features."],
];

const plans = [
  {
    name: "Free preview",
    price: "$0",
    bullets: ["Basic daily guidance preview", "Limited daily card preview", "Starter Sky Map preview"],
  },
  {
    name: "Introductory access",
    price: "$1 / 3 days",
    highlighted: true,
    bullets: ["Full access for 3 days", "Daily readings", "Sky Map insights", "Practices and affirmations"],
  },
  {
    name: "Monthly",
    price: "$29.99 / month",
    bullets: ["Full eLuna access", "Daily readings", "Personal insights", "Journal and progress features"],
  },
  {
    name: "3-month plan",
    price: "$59.99 every 3 months",
    subprice: "$19.99/month equivalent",
    bullets: ["Full eLuna access", "Longer access period", "Daily readings and practices"],
  },
  {
    name: "6-month plan",
    price: "$89.99 every 6 months",
    subprice: "$14.99/month equivalent",
    bullets: ["Full eLuna access", "Best current value", "Daily readings and practices"],
  },
];

const faqs = [
  {
    question: "What is eLuna?",
    answer: "eLuna is an AI-powered self-reflection and symbolic guidance app for daily personal insight.",
  },
  {
    question: "Is eLuna a medical, legal, financial, or psychological service?",
    answer: "No. eLuna is for self-reflection and entertainment only. It is not professional advice.",
  },
  {
    question: "Is this a digital product?",
    answer: "Yes. eLuna is a digital subscription service. No physical goods are shipped.",
  },
  {
    question: "How do I access paid features?",
    answer: "Paid features are delivered through your eLuna account after subscription activation.",
  },
  {
    question: "How do I cancel?",
    answer: "Contact support@myeluna.com with the email address linked to your account.",
  },
  {
    question: "How do I request a refund?",
    answer: "Contact support@myeluna.com. Refund requests are reviewed according to account status, subscription activity, and applicable law.",
  },
];

const footerLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Billing Terms", href: "/billing" },
  { label: "Refund Policy", href: "/money-back" },
  { label: "Cancellation Policy", href: "/cancellation" },
  { label: "Fulfillment Policy", href: "/delivery" },
];

const pageWrap: CSSProperties = {
  width: "min(100%, 1180px)",
  margin: "0 auto",
  padding: "0 22px",
  position: "relative",
  zIndex: 2,
};

const sectionShell: CSSProperties = {
  border: "1px solid rgba(216,168,95,.18)",
  borderRadius: 28,
  background: "linear-gradient(145deg, rgba(16,10,36,.86), rgba(8,6,22,.72))",
  boxShadow: "0 24px 70px rgba(0,0,0,.34)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
};

function GoldLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none", overflowWrap: "anywhere" }}>
      {children}
    </a>
  );
}

function SectionHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div style={{ display: "grid", gap: 10, maxWidth: 760, marginBottom: 22 }}>
      <p style={{ color: "var(--gold)", fontSize: 11, fontWeight: 900, letterSpacing: ".16em", textTransform: "uppercase" }}>{eyebrow}</p>
      <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 600, lineHeight: 1 }}>
        {title}
      </h2>
      {body && <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.7 }}>{body}</p>}
    </div>
  );
}

function PreviewIcon({ type }: { type: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (type === "moon") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" {...common}>
        <path d="M20 14.6A8 8 0 0 1 9.4 4 8.5 8.5 0 1 0 20 14.6Z" />
      </svg>
    );
  }
  if (type === "orbit") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M3 12c3-6 15-6 18 0-3 6-15 6-18 0Z" />
        <path d="M12 3c6 3 6 15 0 18-6-3-6-15 0-18Z" />
      </svg>
    );
  }
  if (type === "spark") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" {...common}>
        <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z" />
        <path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...common}>
      <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3Z" />
    </svg>
  );
}

function ProductPreview() {
  return (
    <div style={{ position: "relative", minHeight: 520, display: "grid", placeItems: "center" }}>
      <div style={{ position: "absolute", width: "72%", aspectRatio: "1", borderRadius: "50%", background: "radial-gradient(circle, rgba(128,64,192,.26), rgba(216,168,95,.08) 42%, transparent 70%)", filter: "blur(4px)" }} />
      <div style={{ ...sectionShell, width: "min(100%, 430px)", padding: 18, borderRadius: 34, position: "relative" }}>
        <div style={{ width: 46, height: 5, borderRadius: 999, background: "rgba(255,255,255,.16)", margin: "0 auto 18px" }} />
        <div style={{ display: "grid", gap: 13 }}>
          <div style={{ border: "1px solid rgba(216,168,95,.24)", borderRadius: 24, padding: 18, background: "linear-gradient(145deg, rgba(128,64,192,.24), rgba(255,255,255,.05))" }}>
            <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 8 }}>Today</p>
            <h3 style={{ color: "var(--text)", fontSize: 25, fontFamily: "var(--font-display)", fontWeight: 600, lineHeight: 1.08, marginBottom: 8 }}>
              A quieter signal before the next step
            </h3>
            <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
              Pause, name the pattern, and choose one grounded action for the day.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            {previewCards.map((card) => (
              <article key={card.title} style={{ border: "1px solid rgba(255,255,255,.10)", borderRadius: 20, background: "rgba(255,255,255,.055)", padding: 14, minHeight: 154 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", color: "var(--gold-2)", background: "rgba(216,168,95,.10)", border: "1px solid rgba(216,168,95,.18)", marginBottom: 10 }}>
                  <PreviewIcon type={card.icon} />
                </div>
                <p style={{ color: "var(--gold)", fontSize: 9, fontWeight: 900, letterSpacing: ".11em", textTransform: "uppercase", marginBottom: 5 }}>{card.tag}</p>
                <h4 style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.22, fontWeight: 900, marginBottom: 6 }}>{card.title}</h4>
                <p style={{ color: "var(--muted)", fontSize: 11, lineHeight: 1.45 }}>{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WelcomeHeadPage() {
  return (
    <main className="app no-nav" style={{ width: "100vw", maxWidth: "none", minHeight: "100dvh", padding: 0, border: "none", overflowX: "hidden", background: "radial-gradient(circle at 18% 10%, rgba(128,64,192,.18), transparent 30%), radial-gradient(circle at 86% 8%, rgba(216,168,95,.10), transparent 28%), #070816" }}>
      <StarField />

      <div style={pageWrap}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "20px 0", position: "relative", zIndex: 3 }}>
          <Link href="/" aria-label="eLuna home" style={{ textDecoration: "none" }}>
            <Logo variant="header" priority />
          </Link>
          <nav aria-label="Page navigation" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "10px 18px" }}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} style={{ color: "var(--muted)", fontSize: 13, fontWeight: 800, textDecoration: "none" }}>
                {link.label}
              </a>
            ))}
          </nav>
          <a href={appLoginUrl} style={{ minHeight: 40, borderRadius: 999, padding: "0 16px", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(216,168,95,.28)", background: "rgba(255,255,255,.05)", color: "var(--gold-2)", fontSize: 13, fontWeight: 900, textDecoration: "none", whiteSpace: "nowrap" }}>
            Sign in
          </a>
        </header>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 390px), 1fr))", gap: 34, alignItems: "center", padding: "54px 0 72px" }}>
          <div style={{ display: "grid", gap: 20 }}>
            <p style={{ color: "var(--gold)", fontSize: 11, fontWeight: 900, letterSpacing: ".16em", textTransform: "uppercase" }}>ELUNA DIGITAL SUBSCRIPTION APP</p>
            <h1 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: "clamp(46px, 7vw, 76px)", fontWeight: 600, lineHeight: 1.02, maxWidth: 760 }}>
              AI-powered self-reflection for your inner world
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.7, maxWidth: 660 }}>
              eLuna helps you pause, reflect, and explore symbolic guidance through daily readings, personal insights, and AI-powered reflection tools.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href={appRegisterUrl} style={{ minHeight: 54, borderRadius: 999, padding: "0 24px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #8d55d6 0%, #5a2090 100%)", color: "#fff", fontSize: 15, fontWeight: 900, textDecoration: "none", boxShadow: "0 14px 34px rgba(90,32,144,.45)" }}>
                Create account
              </a>
              <a href={appLoginUrl} style={{ minHeight: 54, borderRadius: 999, padding: "0 24px", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(216,168,95,.30)", background: "rgba(255,255,255,.05)", color: "var(--text)", fontSize: 15, fontWeight: 900, textDecoration: "none" }}>
                Sign in
              </a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10, maxWidth: 670 }}>
              {trustBullets.map((item) => (
                <div key={item} style={{ border: "1px solid rgba(255,255,255,.10)", borderRadius: 16, background: "rgba(255,255,255,.045)", padding: "11px 12px", color: "var(--muted)", fontSize: 12, lineHeight: 1.45 }}>
                  {item === "Support: support@myeluna.com" ? (
                    <>
                      Support: <GoldLink href={supportHref}>{SUPPORT_EMAIL_ADDRESS}</GoldLink>
                    </>
                  ) : (
                    item
                  )}
                </div>
              ))}
            </div>
            <p style={{ color: "var(--muted-2)", fontSize: 12, lineHeight: 1.6, maxWidth: 620 }}>
              eLuna is for self-reflection and entertainment. It is not medical, legal, financial, psychological, or crisis advice.
            </p>
          </div>

          <ProductPreview />
        </section>

        <section id="product" style={{ ...sectionShell, padding: "34px 26px", marginBottom: 22 }}>
          <SectionHeader
            eyebrow="Product"
            title="What is eLuna?"
            body="eLuna is a digital subscription app that provides AI-powered readings, daily symbolic guidance, personal reflection prompts, affirmations, and spiritual self-awareness tools. The app is designed for personal reflection and entertainment, not professional advice."
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
            {features.map((feature) => (
              <article key={feature.title} style={{ border: "1px solid rgba(255,255,255,.10)", borderRadius: 20, background: "rgba(255,255,255,.045)", padding: 18 }}>
                <h3 style={{ color: "var(--text)", fontSize: 17, lineHeight: 1.25, fontWeight: 900, marginBottom: 8 }}>{feature.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.65 }}>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ padding: "42px 0" }}>
          <SectionHeader eyebrow="How it works" title="Digital access in four steps" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
            {steps.map(([title, body], index) => (
              <article key={title} style={{ ...sectionShell, padding: 18, minHeight: 174 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", display: "grid", placeItems: "center", background: "rgba(216,168,95,.12)", border: "1px solid rgba(216,168,95,.22)", color: "var(--gold-2)", fontWeight: 900, marginBottom: 14 }}>
                  {index + 1}
                </div>
                <h3 style={{ color: "var(--text)", fontSize: 17, fontWeight: 900, lineHeight: 1.24, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.62 }}>{body}</p>
              </article>
            ))}
          </div>
          <p style={{ color: "var(--muted-2)", fontSize: 13, lineHeight: 1.65, marginTop: 14 }}>
            Access is delivered digitally through your eLuna account. No physical products are shipped.
          </p>
        </section>

        <section id="pricing" style={{ ...sectionShell, padding: "34px 26px", marginBottom: 22 }}>
          <SectionHeader eyebrow="Pricing" title="Simple digital subscription pricing" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
            {plans.map((plan) => (
              <article key={plan.name} style={{ border: plan.highlighted ? "1px solid rgba(216,168,95,.38)" : "1px solid rgba(255,255,255,.10)", borderRadius: 22, background: plan.highlighted ? "linear-gradient(145deg, rgba(128,64,192,.25), rgba(216,168,95,.08))" : "rgba(255,255,255,.045)", padding: 18, display: "grid", gap: 12 }}>
                <div>
                  <h3 style={{ color: "var(--text)", fontSize: 18, lineHeight: 1.22, fontWeight: 900, marginBottom: 8 }}>{plan.name}</h3>
                  <p style={{ color: "var(--gold-2)", fontSize: 24, lineHeight: 1.12, fontWeight: 900 }}>{plan.price}</p>
                  {plan.subprice && <p style={{ color: "var(--muted-2)", fontSize: 12, lineHeight: 1.5, marginTop: 5 }}>{plan.subprice}</p>}
                </div>
                <ul style={{ display: "grid", gap: 8, margin: "0 0 0 17px", padding: 0 }}>
                  {plan.bullets.map((bullet) => (
                    <li key={bullet} style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5, paddingLeft: 2 }}>
                      {bullet}
                    </li>
                  ))}
                </ul>
                <a href={appRegisterUrl} style={{ minHeight: 44, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 16px", background: "rgba(216,168,95,.12)", border: "1px solid rgba(216,168,95,.24)", color: "var(--gold-2)", fontSize: 13, fontWeight: 900, textDecoration: "none" }}>
                  Create account
                </a>
              </article>
            ))}
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.65, marginTop: 16 }}>
            Subscriptions renew automatically unless cancelled. For cancellation, refund, or billing questions, contact{" "}
            <GoldLink href={billingSupportHref}>{SUPPORT_EMAIL_ADDRESS}</GoldLink>.
          </p>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: 18, padding: "22px 0 42px" }}>
          <article style={{ ...sectionShell, padding: 24 }}>
            <SectionHeader eyebrow="Fulfillment" title="Digital delivery" />
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
              eLuna is a digital service. After account creation and successful subscription activation, access to paid digital features is delivered through the user's eLuna account. No physical goods are shipped.
            </p>
            <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, marginTop: 10 }}>
              Free preview features are available after account creation. Paid features become available after subscription activation.
            </p>
          </article>
          <article style={{ ...sectionShell, padding: 24 }}>
            <SectionHeader eyebrow="Billing support" title="Cancellation and refunds" />
            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ border: "1px solid rgba(255,255,255,.10)", borderRadius: 18, background: "rgba(255,255,255,.04)", padding: 15 }}>
                <h3 style={{ color: "var(--text)", fontSize: 16, fontWeight: 900, marginBottom: 7 }}>Cancellation</h3>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.65 }}>
                  Users can request cancellation by contacting <GoldLink href={billingSupportHref}>{SUPPORT_EMAIL_ADDRESS}</GoldLink>. Cancellation requests should include the email address associated with the eLuna account.
                </p>
              </div>
              <div style={{ border: "1px solid rgba(255,255,255,.10)", borderRadius: 18, background: "rgba(255,255,255,.04)", padding: 15 }}>
                <h3 style={{ color: "var(--text)", fontSize: 16, fontWeight: 900, marginBottom: 7 }}>Refunds</h3>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.65 }}>
                  Refund requests should be sent to <GoldLink href={billingSupportHref}>{SUPPORT_EMAIL_ADDRESS}</GoldLink>. Each request is reviewed according to account status, subscription activity, and applicable law. If approved, refunds are processed back to the original payment method where possible.
                </p>
              </div>
            </div>
          </article>
        </section>

        <section id="faq" style={{ ...sectionShell, padding: "34px 26px", marginBottom: 22 }}>
          <SectionHeader eyebrow="FAQ" title="Questions reviewers and customers ask" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {faqs.map((faq) => (
              <article key={faq.question} style={{ border: "1px solid rgba(255,255,255,.10)", borderRadius: 18, background: "rgba(255,255,255,.04)", padding: 16 }}>
                <h3 style={{ color: "var(--text)", fontSize: 15, fontWeight: 900, lineHeight: 1.3, marginBottom: 8 }}>{faq.question}</h3>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.65 }}>
                  {faq.answer.includes(SUPPORT_EMAIL_ADDRESS) ? (
                    <>
                      {faq.answer.split(SUPPORT_EMAIL_ADDRESS)[0]}
                      <GoldLink href={supportHref}>{SUPPORT_EMAIL_ADDRESS}</GoldLink>
                      {faq.answer.split(SUPPORT_EMAIL_ADDRESS)[1]}
                    </>
                  ) : (
                    faq.answer
                  )}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" style={{ ...sectionShell, padding: "30px 26px", marginBottom: 24 }}>
          <SectionHeader eyebrow="Company details" title="Official contact and business details" />
          {/* TODO: Replace company details before Stripe review with the exact details used in the Stripe account. */}
          <dl style={{ display: "grid", gap: 12, margin: 0 }}>
            {[
              ["Legal name", "[LEGAL COMPANY NAME]"],
              ["Registered address", "[REGISTERED ADDRESS]"],
              ["Country", "[COUNTRY]"],
              ["Contact", SUPPORT_EMAIL_ADDRESS],
              ["Website", "https://www.myeluna.com"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "minmax(138px, .34fr) 1fr", gap: 12, alignItems: "baseline" }}>
                <dt style={{ color: "var(--muted-2)", fontSize: 12, fontWeight: 900 }}>{label}</dt>
                <dd style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.55, margin: 0, overflowWrap: "anywhere" }}>
                  {label === "Contact" ? (
                    <GoldLink href={supportHref}>{value}</GoldLink>
                  ) : label === "Website" ? (
                    <a href="https://www.myeluna.com" style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none" }}>{value}</a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <p style={{ color: "var(--muted-2)", fontSize: 12, lineHeight: 1.55, marginTop: 14 }}>
            Replace these placeholders with the exact legal company details used in the Stripe account before review.
          </p>
        </section>

        <footer style={{ display: "grid", gap: 14, justifyItems: "center", padding: "24px 0 38px", color: "var(--muted-2)", fontSize: 12 }}>
          <nav aria-label="Policy links" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 14px" }}>
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
            <a href={supportHref} style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none" }}>
              Support
            </a>
          </nav>
          <p style={{ textAlign: "center", lineHeight: 1.55 }}>
            © eLuna. Digital AI-powered self-reflection subscription service.
          </p>
        </footer>
      </div>
    </main>
  );
}

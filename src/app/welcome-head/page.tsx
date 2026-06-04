import Link from "next/link";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Logo } from "@/components/Logo";
import {
  COMPANY_COUNTRY,
  COMPANY_REGISTRATION_NUMBER,
  GLOBAL_DISCLAIMER,
  LEGAL_ENTITY_ADDRESS,
  LEGAL_ENTITY_NAME,
  SUPPORT_EMAIL_ADDRESS,
  WEBSITE_URL,
} from "@/lib/legal/legalContent";

const appLoginUrl = "https://www.myeluna.com/login";
const appRegisterUrl = "https://www.myeluna.com/register";
const supportHref = "mailto:support@myeluna.com?subject=eLuna%20Support";
const billingSupportHref = "mailto:support@myeluna.com?subject=eLuna%20Billing%20Question";

const heroVisualImage = "/assets/landing/eluna-hero-product.png";
const featureCollageImage = "/assets/landing/eluna-feature-collage.png";
const finalCtaImage = "/assets/landing/eluna-final-cta-phones.png";
const desktopBackgroundImage = "/assets/landing/eluna-bg-desktop.png";
const mobileBackgroundImage = "/assets/landing/eluna-bg-mobile.png";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const trustItems = [
  "Digital subscription",
  "Secure payment",
  "No physical goods",
  "Support: support@myeluna.com",
];

const features = [
  ["Daily readings", "Clear daily symbolic guidance with reflection prompts and a grounded next step.", "moon"],
  ["Symbolic cards", "Draw a card, explore its meaning, and capture a simple action or reflection.", "card"],
  ["Personal Sky Map", "A structured map of astrology-inspired, numerology-inspired, and soul-path insights.", "orbit"],
  ["Affirmations & practices", "Guided practices and affirmations designed for repeat daily use.", "spark"],
  ["Journal & progress", "A personal space for saved reflections, practice entries, and visible progress.", "journal"],
  ["AI reflection tools", "AI-powered prompts that help users explore patterns and self-awareness themes.", "ai"],
];

const proofBenefits = [
  ["Daily symbolic guidance", "A calm daily ritual with reading, card, action, and reflection."],
  ["Personal insight map", "A visual path that makes the product feel ongoing, not one-and-done."],
  ["Reflection journal", "A simple account-based record for thoughts, prompts, and progress."],
];

const steps = [
  ["Create your account", "Start with an eLuna account and enter the app."],
  ["Add your birth details", "Share birth date, optional birth time, place, and preferences."],
  ["Explore daily guidance", "Open daily readings, cards, practices, and your Sky Map."],
  ["Unlock deeper readings", "Use a subscription for deeper digital guidance and premium features."],
];

const plans = [
  {
    name: "Free preview",
    price: "$0 USD",
    period: "Preview access",
    icon: "moon",
    bullets: ["Basic daily guidance preview", "Limited daily card preview", "Starter Sky Map preview"],
  },
  {
    name: "Introductory access",
    price: "$1.00 USD",
    period: "3-day access",
    icon: "spark",
    featured: true,
    bullets: ["Full access for 3 days", "Daily readings", "Sky Map insights", "Practices and affirmations"],
  },
  {
    name: "Monthly",
    price: "$29.99 USD",
    period: "per month",
    icon: "star",
    bullets: ["Full eLuna access", "Daily readings", "Personal insights", "Journal and progress features"],
  },
  {
    name: "3-month plan",
    price: "$59.99 USD",
    period: "every 3 months",
    subprice: "$19.99 USD/month equivalent",
    icon: "orbit",
    bullets: ["Full eLuna access", "Longer access period", "Daily readings and practices"],
  },
  {
    name: "6-month plan",
    price: "$89.99 USD",
    period: "every 6 months",
    subprice: "$14.99 USD/month equivalent",
    icon: "shield",
    bullets: ["Full eLuna access", "Best current value", "Daily readings and practices"],
  },
];

const complianceCards = [
  {
    title: "Digital delivery",
    icon: "device",
    body: "eLuna is a digital service. After account creation and successful subscription activation, access to paid digital features is delivered through the user's eLuna account. No physical goods are shipped.",
  },
  {
    title: "Cancellation",
    icon: "mail",
    body: "Users can request cancellation by contacting support@myeluna.com. Cancellation requests should include the email address associated with the eLuna account.",
  },
  {
    title: "Refunds",
    icon: "receipt",
    body: "Refund requests should be sent to support@myeluna.com. Each request is reviewed according to account status, subscription activity, and applicable law.",
  },
  {
    title: "Support",
    icon: "support",
    body: "For billing, refund, cancellation, or account questions, contact support@myeluna.com.",
  },
];

const faqs = [
  ["What is eLuna?", "eLuna is a digital subscription app that provides AI-powered self-reflection experiences, symbolic guidance, daily readings, personal insight prompts, and journaling-style tools."],
  ["Is eLuna a digital product?", "Yes. eLuna is a digital subscription service. No physical goods are shipped."],
  ["What do I get with a subscription?", "A subscription unlocks deeper daily readings, Sky Map insights, practices, affirmations, and account-based digital access to premium features."],
  ["How do I access paid features?", "Paid features are delivered through your eLuna account after subscription activation."],
  ["How do I cancel?", "Contact support@myeluna.com with the email address linked to your account."],
  ["How do I request a refund?", "Contact support@myeluna.com. Refund requests are reviewed according to account status, subscription activity, and applicable law."],
  ["Is eLuna medical, legal, financial, or psychological advice?", GLOBAL_DISCLAIMER],
];

const footerLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Billing Terms", href: "/billing" },
  { label: "Refund Policy", href: "/money-back" },
  { label: "Cancellation Policy", href: "/cancellation" },
  { label: "Fulfillment Policy", href: "/delivery" },
  { label: "Support / Contact", href: "/support" },
];

const pageWrap: CSSProperties = {
  width: "min(100%, 1220px)",
  margin: "0 auto",
  padding: "0 24px",
  position: "relative",
  zIndex: 2,
};

const glassPanel: CSSProperties = {
  border: "1px solid rgba(216,168,95,.13)",
  borderRadius: 24,
  background: "linear-gradient(145deg, rgba(24,16,50,.44), rgba(8,7,22,.28))",
  boxShadow: "0 18px 50px rgba(0,0,0,.20)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};

function GoldLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} style={{ color: "var(--gold-2)", fontWeight: 850, textDecoration: "none", overflowWrap: "anywhere" }}>
      {children}
    </a>
  );
}

function SmartText({ text, href = supportHref }: { text: string; href?: string }) {
  if (!text.includes(SUPPORT_EMAIL_ADDRESS)) return <>{text}</>;
  const [before, after] = text.split(SUPPORT_EMAIL_ADDRESS);
  return (
    <>
      {before}
      <GoldLink href={href}>{SUPPORT_EMAIL_ADDRESS}</GoldLink>
      {after}
    </>
  );
}

function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const props = { width: size, height: size, viewBox: "0 0 24 24", ...common };

  if (name === "moon") return <svg {...props}><path d="M20 14.4A8 8 0 1 1 9.6 4a7 7 0 0 0 10.4 10.4Z" /></svg>;
  if (name === "card") return <svg {...props}><rect x="6" y="3" width="12" height="18" rx="2" /><path d="M10 8h4M10 12h4M10 16h2" /></svg>;
  if (name === "orbit") return <svg {...props}><circle cx="12" cy="12" r="2.5" /><path d="M3 12c3-5.5 15-5.5 18 0-3 5.5-15 5.5-18 0Z" /><path d="M12 3c5.5 3 5.5 15 0 18-5.5-3-5.5-15 0-18Z" /></svg>;
  if (name === "spark") return <svg {...props}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="M19 16l.7 1.8L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></svg>;
  if (name === "journal") return <svg {...props}><path d="M6 4h11a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1Z" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>;
  if (name === "ai") return <svg {...props}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /><circle cx="12" cy="12" r="4" /></svg>;
  if (name === "star") return <svg {...props}><path d="M12 3l2.7 5.5 6.1.9-4.4 4.2 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.2 6.1-.9L12 3Z" /></svg>;
  if (name === "shield") return <svg {...props}><path d="M12 3l7 3v5c0 5-3.2 8.5-7 10-3.8-1.5-7-5-7-10V6l7-3Z" /><path d="M9 12l2 2 4-5" /></svg>;
  if (name === "device") return <svg {...props}><rect x="6" y="3" width="12" height="18" rx="2" /><path d="M10 17h4" /></svg>;
  if (name === "mail") return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 7 9-7" /></svg>;
  if (name === "receipt") return <svg {...props}><path d="M7 3h10v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4V3Z" /><path d="M10 8h4M10 12h4M10 16h2" /></svg>;
  return <svg {...props}><circle cx="12" cy="12" r="8" /><path d="M9.5 12.5 11 14l4-5" /></svg>;
}

function IconFrame({ icon, compact = false }: { icon: string; compact?: boolean }) {
  return (
    <div style={{ width: compact ? 42 : 48, height: compact ? 42 : 48, borderRadius: compact ? 15 : 17, display: "grid", placeItems: "center", color: "var(--gold-2)", background: "linear-gradient(145deg, rgba(216,168,95,.13), rgba(128,64,192,.10))", border: "1px solid rgba(216,168,95,.22)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.08)" }}>
      <Icon name={icon} size={compact ? 19 : 22} />
    </div>
  );
}

function SectionHeader({ eyebrow, title, body, centered = false }: { eyebrow: string; title: string; body?: string; centered?: boolean }) {
  return (
    <div style={{ display: "grid", gap: 10, maxWidth: 760, margin: centered ? "0 auto 26px" : "0 0 26px", textAlign: centered ? "center" : "left" }}>
      <p style={{ color: "var(--gold)", fontSize: 11, fontWeight: 900, letterSpacing: ".16em", textTransform: "uppercase" }}>{eyebrow}</p>
      <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: "clamp(32px, 5vw, 50px)", fontWeight: 600, lineHeight: 1.04 }}>
        {title}
      </h2>
      {body && <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.68 }}>{body}</p>}
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="hero-visual" style={{ position: "relative", width: "min(100%, 650px)", minHeight: 520, margin: "0 auto" }}>
      <div style={{ position: "absolute", inset: "5% 0 2% 6%", borderRadius: "50%", background: "radial-gradient(circle at 52% 44%, rgba(141,85,214,.36), transparent 57%), radial-gradient(circle at 62% 70%, rgba(216,168,95,.18), transparent 56%)", filter: "blur(26px)" }} />
      <div style={{ position: "absolute", right: "2%", bottom: "1%", width: "86%", height: 56, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,.52), transparent 68%)", filter: "blur(7px)" }} />
      <Image
        src={heroVisualImage}
        alt="eLuna app preview with daily reflection screens"
        width={920}
        height={940}
        priority
        sizes="(max-width: 760px) 94vw, 48vw"
        style={{
          position: "relative",
          zIndex: 1,
          display: "block",
          width: "112%",
          maxWidth: "none",
          height: "auto",
          marginLeft: "-4%",
          filter: "drop-shadow(0 32px 70px rgba(0,0,0,.48)) drop-shadow(0 0 42px rgba(128,64,192,.22))",
          clipPath: "ellipse(43% 50% at 55% 56%)",
          maskImage: "radial-gradient(ellipse 56% 82% at 53% 56%, #000 0%, #000 54%, rgba(0,0,0,.74) 64%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 56% 82% at 53% 56%, #000 0%, #000 54%, rgba(0,0,0,.74) 64%, transparent 78%)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-2%",
          zIndex: 2,
          pointerEvents: "none",
          background:
            "linear-gradient(180deg, #070613 0%, rgba(7,6,19,.72) 9%, transparent 25%), linear-gradient(90deg, #070613 0%, rgba(7,6,19,.76) 13%, transparent 34%), linear-gradient(270deg, #070613 0%, rgba(7,6,19,.54) 8%, transparent 22%), linear-gradient(0deg, rgba(7,6,19,.28) 0%, transparent 18%)",
        }}
      />
    </div>
  );
}

function FeatureCollage() {
  return (
    <div style={{ position: "relative", width: "min(100%, 590px)", margin: "0 auto" }}>
      <div style={{ position: "absolute", inset: "8% -8% -6%", borderRadius: 48, background: "radial-gradient(circle at 48% 48%, rgba(128,64,192,.20), transparent 62%), radial-gradient(circle at 76% 72%, rgba(216,168,95,.10), transparent 55%)", filter: "blur(18px)" }} />
      <div className="proof-visual" style={{ position: "relative", aspectRatio: "4 / 3", borderRadius: 34, overflow: "hidden", padding: 16, background: "linear-gradient(145deg, rgba(255,255,255,.075), rgba(255,255,255,.025))", boxShadow: "0 26px 70px rgba(0,0,0,.26), inset 0 1px 0 rgba(255,255,255,.10)" }}>
        <Image
          src={featureCollageImage}
          alt="eLuna product feature collage"
          fill
          sizes="(max-width: 760px) 92vw, 46vw"
          style={{ objectFit: "contain", objectPosition: "center center", padding: 16 }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(7,8,22,.04), transparent 68%, rgba(7,8,22,.10))" }} />
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.08), inset 0 -18px 42px rgba(7,8,22,.12)" }} />
      </div>
    </div>
  );
}

function FinalCta() {
  return (
    <section style={{ position: "relative", overflow: "hidden", borderRadius: 36, border: "1px solid rgba(216,168,95,.18)", background: "radial-gradient(circle at 78% 50%, rgba(141,85,214,.20), transparent 35%), linear-gradient(135deg, rgba(20,13,47,.70), rgba(8,7,22,.58))", boxShadow: "0 26px 70px rgba(0,0,0,.28)", margin: "28px 0 18px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: 18, alignItems: "center", padding: "clamp(24px, 5vw, 40px)" }}>
        <div style={{ display: "grid", gap: 14, maxWidth: 560, position: "relative", zIndex: 2 }}>
          <p style={{ color: "var(--gold)", fontSize: 11, fontWeight: 900, letterSpacing: ".16em", textTransform: "uppercase" }}>Start with a free preview</p>
          <h2 style={{ color: "var(--text)", fontFamily: "var(--font-display)", fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.04, fontWeight: 600 }}>Start your eLuna journey today</h2>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.7 }}>
            Create your account and begin with a free preview. Paid features unlock after subscription activation.
          </p>
          <div>
            <a href={appRegisterUrl} style={{ minHeight: 50, borderRadius: 999, padding: "0 22px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #8d55d6 0%, #5a2090 100%)", color: "#fff", fontSize: 14, fontWeight: 900, textDecoration: "none", boxShadow: "0 14px 34px rgba(90,32,144,.40)" }}>
              Create account
            </a>
          </div>
        </div>
        <div className="cta-phones" style={{ position: "relative", minHeight: 320 }}>
          <div style={{ position: "absolute", inset: "2% -6% 0 8%", borderRadius: "50%", background: "radial-gradient(circle at 58% 54%, rgba(216,168,95,.18), transparent 54%), radial-gradient(circle at 44% 42%, rgba(141,85,214,.28), transparent 62%)", filter: "blur(20px)" }} />
          <div style={{ position: "relative", width: "100%", height: 320, overflow: "visible" }}>
            <Image
              src={finalCtaImage}
              alt="eLuna app screens preview"
              width={760}
              height={950}
              sizes="(max-width: 760px) 86vw, 42vw"
              style={{
                display: "block",
                width: "108%",
                maxWidth: "none",
                height: "auto",
                marginLeft: "-4%",
                transform: "translateY(-11%)",
                filter: "drop-shadow(0 28px 52px rgba(0,0,0,.42))",
              }}
            />
            <div style={{ position: "absolute", right: 12, bottom: 12, width: "min(58%, 260px)", height: 1, background: "linear-gradient(90deg, transparent, rgba(216,168,95,.52), transparent)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WelcomeHeadPage() {
  return (
    <main className="app no-nav welcome-head-page" style={{ width: "100vw", maxWidth: "none", minHeight: "100dvh", padding: 0, border: "none", overflowX: "hidden", background: "#070613" }}>
      <style>{`
        .welcome-head-page {
          position: relative;
          background-image:
            linear-gradient(180deg, rgba(8,5,20,.45), rgba(8,5,20,.86) 45%, #070613 100%),
            url("${desktopBackgroundImage}");
          background-repeat: no-repeat;
          background-size: 100% auto;
          background-position: top center;
        }

        .welcome-head-page::before,
        .welcome-head-page::after {
          content: "";
          position: absolute;
          pointer-events: none;
          z-index: 1;
        }

        .welcome-head-page::before {
          inset: 0;
          background:
            radial-gradient(circle at 73% 18%, rgba(137,78,214,.22), transparent 26%),
            radial-gradient(circle at 87% 70%, rgba(216,168,95,.10), transparent 24%),
            linear-gradient(180deg, transparent 0%, rgba(7,6,19,.34) 38%, rgba(7,6,19,.92) 100%);
        }

        .welcome-head-page::after {
          top: 620px;
          left: 0;
          right: 0;
          height: 480px;
          background: linear-gradient(180deg, rgba(7,6,19,0), rgba(7,6,19,.88) 58%, rgba(7,6,19,0));
        }

        .hero-section {
          display: grid;
          grid-template-columns: minmax(0, 1.06fr) minmax(360px, .94fr);
          gap: clamp(24px, 4vw, 48px);
          align-items: center;
          padding: 46px 0 84px;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 14px;
        }

        .feature-card {
          min-height: 158px;
          padding: 18px;
        }

        @media (max-width: 980px) {
          .feature-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .welcome-head-page {
            background-image:
              linear-gradient(180deg, rgba(8,5,20,.34), rgba(8,5,20,.82) 42%, #070613 100%),
              url("${mobileBackgroundImage}");
            background-size: 100% auto;
            background-position: top center;
          }

          .welcome-head-page::before {
            background:
              radial-gradient(circle at 55% 21%, rgba(137,78,214,.18), transparent 38%),
              linear-gradient(180deg, transparent 0%, rgba(7,6,19,.62) 44%, rgba(7,6,19,.96) 100%);
          }

          .hero-section {
            grid-template-columns: 1fr;
            padding: 24px 0 62px;
          }

          .hero-visual {
            min-height: auto !important;
            margin-top: 4px !important;
          }

          .hero-visual img {
            width: 100% !important;
            margin-left: 0 !important;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }

          .feature-card {
            min-height: auto;
            padding: 16px;
          }

          .proof-visual {
            border-radius: 26px !important;
          }

          .cta-phones {
            min-height: 230px !important;
          }

          .cta-phones > div:last-child {
            height: 230px !important;
          }
        }
      `}</style>

      <div style={pageWrap}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, padding: "22px 0", position: "relative", zIndex: 3 }}>
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
          <a href={appLoginUrl} style={{ minHeight: 40, borderRadius: 999, padding: "0 16px", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(216,168,95,.28)", background: "rgba(255,255,255,.045)", color: "var(--gold-2)", fontSize: 13, fontWeight: 900, textDecoration: "none", whiteSpace: "nowrap" }}>
            Sign in
          </a>
        </header>

        <section className="hero-section">
          <div style={{ display: "grid", gap: 19, maxWidth: 660 }}>
            <p style={{ color: "var(--gold)", fontSize: 11, fontWeight: 900, letterSpacing: ".16em", textTransform: "uppercase" }}>ELUNA DIGITAL SUBSCRIPTION APP</p>
            <h1 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: "clamp(42px, 5.7vw, 70px)", fontWeight: 600, lineHeight: 1.03, maxWidth: 640 }}>
              AI-powered self-reflection for your inner world
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.65, maxWidth: 570 }}>
              eLuna helps you pause, reflect, and explore symbolic guidance through daily readings, personal insights, and AI-powered reflection tools.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href={appRegisterUrl} style={{ minHeight: 52, borderRadius: 999, padding: "0 23px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #8d55d6 0%, #5a2090 100%)", color: "#fff", fontSize: 15, fontWeight: 900, textDecoration: "none", boxShadow: "0 14px 34px rgba(90,32,144,.40)" }}>
                Create account
              </a>
              <a href={appLoginUrl} style={{ minHeight: 52, borderRadius: 999, padding: "0 23px", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(216,168,95,.30)", background: "rgba(255,255,255,.045)", color: "var(--text)", fontSize: 15, fontWeight: 900, textDecoration: "none" }}>
                Sign in
              </a>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 620 }}>
              {trustItems.map((item) => (
                <div key={item} style={{ border: "1px solid rgba(216,168,95,.16)", borderRadius: 999, background: "rgba(255,255,255,.035)", padding: "9px 12px", color: "var(--muted)", fontSize: 12, lineHeight: 1.35 }}>
                  <SmartText text={item} />
                </div>
              ))}
            </div>
            <p style={{ color: "var(--muted-2)", fontSize: 12, lineHeight: 1.6, maxWidth: 600 }}>
              {GLOBAL_DISCLAIMER}
            </p>
          </div>

          <div style={{ display: "grid", placeItems: "center" }}>
            <HeroVisual />
          </div>
        </section>

        <section id="product" style={{ padding: "36px 0", scrollMarginTop: 24 }}>
          <SectionHeader
            eyebrow="Product"
            title="What is eLuna?"
            body="eLuna is a digital subscription app that provides AI-powered self-reflection experiences, symbolic guidance, daily readings, personal insight prompts, and journaling-style tools. The service is designed for personal reflection and entertainment, not for professional advice or guaranteed predictions."
            centered
          />
          <div className="feature-grid">
            {features.map(([title, body, icon]) => (
              <article key={title} className="feature-card" style={{ ...glassPanel, display: "grid", alignContent: "start", gap: 11 }}>
                <IconFrame icon={icon} compact />
                <h3 style={{ color: "var(--text)", fontSize: 16, lineHeight: 1.25, fontWeight: 900 }}>{title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 12.5, lineHeight: 1.58 }}>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 390px), 1fr))", gap: 30, alignItems: "center", padding: "34px 0 46px" }}>
          <FeatureCollage />
          <div>
            <SectionHeader eyebrow="Product proof" title="Your daily reflection space, all in one app" body="The public landing shows how eLuna delivers a real digital experience: daily guidance, structured personal insight, and a journal-friendly rhythm." />
            <div style={{ display: "grid", gap: 12 }}>
              {proofBenefits.map(([title, body], index) => (
                <article key={title} style={{ ...glassPanel, padding: 18, display: "grid", gridTemplateColumns: "auto 1fr", gap: 14, alignItems: "start" }}>
                  <IconFrame icon={index === 0 ? "moon" : index === 1 ? "orbit" : "journal"} compact />
                  <div>
                    <h3 style={{ color: "var(--text)", fontSize: 16, fontWeight: 900, lineHeight: 1.25, marginBottom: 5 }}>{title}</h3>
                    <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>{body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" style={{ padding: "30px 0 42px", scrollMarginTop: 24 }}>
          <SectionHeader eyebrow="How it works" title="Digital access in four steps" centered />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))", gap: 14 }}>
            {steps.map(([title, body], index) => (
              <article key={title} style={{ ...glassPanel, padding: 18, minHeight: 180 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 13, display: "grid", placeItems: "center", color: "var(--gold-2)", background: "rgba(216,168,95,.10)", border: "1px solid rgba(216,168,95,.22)", fontWeight: 900 }}>{index + 1}</div>
                  <div style={{ height: 1, flex: 1, background: "rgba(216,168,95,.18)" }} />
                </div>
                <h3 style={{ color: "var(--text)", fontSize: 16, fontWeight: 900, lineHeight: 1.25, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.58 }}>{body}</p>
              </article>
            ))}
          </div>
          <p style={{ color: "var(--muted-2)", fontSize: 13, lineHeight: 1.65, margin: "14px auto 0", textAlign: "center", maxWidth: 720 }}>
            Access is delivered digitally through your eLuna account. No physical products are shipped.
          </p>
        </section>

        <section id="pricing" style={{ padding: "36px 0", scrollMarginTop: 24 }}>
          <SectionHeader eyebrow="Pricing" title="Simple digital subscription pricing" body="Create an account first. Paid access is only activated after subscription checkout is available and completed." centered />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 16, alignItems: "stretch" }}>
            {plans.slice(0, 3).map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 16, marginTop: 16, width: "min(100%, 780px)", marginLeft: "auto", marginRight: "auto" }}>
            {plans.slice(3).map((plan) => (
              <PlanCard key={plan.name} plan={plan} compact />
            ))}
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.65, margin: "16px auto 0", textAlign: "center", maxWidth: 820 }}>
            Subscriptions renew automatically unless cancelled. Prices are shown in USD. For cancellation, refund, or billing questions, contact{" "}
            <GoldLink href={billingSupportHref}>{SUPPORT_EMAIL_ADDRESS}</GoldLink>.
          </p>
        </section>

        <section style={{ padding: "34px 0" }}>
          <SectionHeader eyebrow="Trust and policies" title="Digital delivery, support, cancellation, and refunds" centered />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 245px), 1fr))", gap: 14 }}>
            {complianceCards.map((card) => (
              <article key={card.title} style={{ ...glassPanel, padding: 18, minHeight: 230 }}>
                <IconFrame icon={card.icon} />
                <h3 style={{ color: "var(--text)", fontSize: 17, fontWeight: 900, lineHeight: 1.25, margin: "14px 0 8px" }}>{card.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>
                  <SmartText text={card.body} href={billingSupportHref} />
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" style={{ padding: "30px 0 38px", scrollMarginTop: 24 }}>
          <SectionHeader eyebrow="FAQ" title="Clear answers for a digital subscription" centered />
          <div style={{ display: "grid", gap: 10, width: "min(100%, 900px)", margin: "0 auto" }}>
            {faqs.map(([question, answer]) => (
              <details key={question} style={{ border: "1px solid rgba(255,255,255,.09)", borderRadius: 18, background: "rgba(255,255,255,.035)", padding: "0 16px" }}>
                <summary style={{ cursor: "pointer", color: "var(--text)", fontSize: 15, fontWeight: 900, lineHeight: 1.35, padding: "16px 0", listStyle: "none" }}>{question}</summary>
                <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.62, padding: "0 0 16px" }}>
                  <SmartText text={answer} href={supportHref} />
                </p>
              </details>
            ))}
          </div>
        </section>

        <FinalCta />

        <section id="contact" style={{ ...glassPanel, padding: "26px 24px", margin: "16px 0 26px", scrollMarginTop: 24 }}>
          <SectionHeader eyebrow="Company details" title="Official contact and business details" body="These details are visible for customers and payment review and should match the Stripe account." />
          <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: 12, margin: 0 }}>
            {[
              ["Legal name", LEGAL_ENTITY_NAME],
              ["Registered address", LEGAL_ENTITY_ADDRESS],
              ["Registration number", COMPANY_REGISTRATION_NUMBER],
              ["Country", COMPANY_COUNTRY],
              ["Contact", SUPPORT_EMAIL_ADDRESS],
              ["Website", WEBSITE_URL],
            ].map(([label, value]) => (
              <div key={label} style={{ border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, background: "rgba(255,255,255,.035)", padding: 14 }}>
                <dt style={{ color: "var(--muted-2)", fontSize: 11, fontWeight: 900, marginBottom: 5 }}>{label}</dt>
                <dd style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.5, margin: 0, overflowWrap: "anywhere" }}>
                  {label === "Contact" ? (
                    <GoldLink href={supportHref}>{value}</GoldLink>
                  ) : label === "Website" ? (
                    <a href={WEBSITE_URL} style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none" }}>{value}</a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <footer style={{ display: "grid", gap: 14, justifyItems: "center", padding: "24px 0 38px", color: "var(--muted-2)", fontSize: 12 }}>
          <nav aria-label="Policy links" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 14px" }}>
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{ color: "var(--gold-2)", fontWeight: 900, textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
          </nav>
          <p style={{ textAlign: "center", lineHeight: 1.55 }}>© eLuna. Digital AI-powered self-reflection subscription service.</p>
          <p style={{ textAlign: "center", lineHeight: 1.55, maxWidth: 760 }}>{GLOBAL_DISCLAIMER}</p>
        </footer>
      </div>
    </main>
  );
}

function PlanCard({ plan, compact = false }: { plan: (typeof plans)[number]; compact?: boolean }) {
  return (
    <article style={{ ...glassPanel, padding: compact ? 18 : 20, minHeight: compact ? 260 : 330, display: "grid", gap: 14, border: plan.featured ? "1px solid rgba(216,168,95,.34)" : glassPanel.border, background: plan.featured ? "linear-gradient(145deg, rgba(128,64,192,.22), rgba(216,168,95,.08))" : glassPanel.background }}>
      <div>
        <IconFrame icon={plan.icon} compact />
        <h3 style={{ color: "var(--text)", fontSize: 18, lineHeight: 1.22, fontWeight: 900, margin: "14px 0 8px" }}>{plan.name}</h3>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <p style={{ color: "var(--gold-2)", fontSize: compact ? 25 : 29, lineHeight: 1.05, fontWeight: 900 }}>{plan.price}</p>
          <p style={{ color: "var(--muted-2)", fontSize: 12, lineHeight: 1.4 }}>{plan.period}</p>
        </div>
        {plan.subprice && <p style={{ color: "var(--muted-2)", fontSize: 12, lineHeight: 1.5, marginTop: 6 }}>{plan.subprice}</p>}
      </div>
      <ul style={{ display: "grid", gap: 8, margin: "0 0 0 17px", padding: 0 }}>
        {plan.bullets.map((bullet) => (
          <li key={bullet} style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5, paddingLeft: 2 }}>{bullet}</li>
        ))}
      </ul>
      <a href={appRegisterUrl} style={{ minHeight: 44, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 16px", background: plan.featured ? "linear-gradient(135deg, #8d55d6 0%, #5a2090 100%)" : "rgba(216,168,95,.10)", border: plan.featured ? "none" : "1px solid rgba(216,168,95,.22)", color: plan.featured ? "#fff" : "var(--gold-2)", fontSize: 13, fontWeight: 900, textDecoration: "none", alignSelf: "end" }}>
        Create account
      </a>
    </article>
  );
}

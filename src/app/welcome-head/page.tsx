import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Logo } from "@/components/Logo";
import {
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
const footerAddress = LEGAL_ENTITY_ADDRESS.replace("54-62", "54–62");

const desktopBackgroundImage = "/assets/landing/eluna-bg-desktop.png";
const mobileBackgroundImage = "/assets/landing/eluna-bg-mobile.png";
const constellationOverlayImage = "/assets/landing/eluna-constellation-overlay-clean.png";
const zodiacHaloImage = "/assets/landing/eluna-zodiac-halo-clean.png";
const heroPhonesImage = "/assets/landing/eluna-hero-phones-transparent.png";
const skyMapScreenImage = "/assets/landing/eluna-phone-sky-map.png";
const ctaStarMapCardImage = "/assets/welcome-head/eluna-star-map-card.png";
const ctaStarSkyBackgroundImage = "/assets/welcome-head/eluna-star-sky-background.png";
const testimonialEmilyImage = "/assets/testimonials/testimonial-emily.png";
const testimonialJasonImage = "/assets/testimonials/testimonial-jason.png";
const testimonialLaurenImage = "/assets/testimonials/testimonial-lauren.png";

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

const testimonials = [
  {
    image: testimonialEmilyImage,
    name: "Emily R.",
    location: "Austin, TX",
    tag: "Daily ritual",
    quote:
      "eLuna feels less like a regular horoscope app and more like a guided astrology journey. I like opening it each day, checking my reflection, and seeing what new theme it gives me to think about.",
  },
  {
    image: testimonialJasonImage,
    name: "Jason M.",
    location: "Seattle, WA",
    tag: "Sky Map explorer",
    quote:
      "The Sky Map makes the experience feel like a quest. It gives me a simple reason to come back, unlock another layer, and reflect on patterns I usually do not stop to notice.",
  },
  {
    image: testimonialLaurenImage,
    name: "Lauren T.",
    location: "Chicago, IL",
    tag: "Personal insight",
    quote:
      "I started out of curiosity, but the daily guidance and symbolic cards made it feel personal. It is a calm little routine that helps me pause and think about myself in a different way.",
  },
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

function SkyMapMini({ compact = false }: { compact?: boolean }) {
  return (
    <div className="sky-map-mini" style={{ width: compact ? 116 : 150, height: compact ? 116 : 150 }}>
      <span className="sky-ring ring-one" />
      <span className="sky-ring ring-two" />
      <span className="sky-dot dot-one" />
      <span className="sky-dot dot-two" />
      <span className="sky-dot dot-three" />
      <span className="sky-dot dot-four" />
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M30 72 48 45 70 58 91 34" />
        <path d="M48 45 58 83 70 58" />
      </svg>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="hero-visual" aria-label="eLuna product mockup scene">
      <div className="scene-glow main" />
      <div className="scene-glow gold" />
      <div className="constellation-layer hero-constellation" />
      <div className="zodiac-halo hero-halo" />
      <div className="scene-shadow" />
      <img className="hero-phones-image" src={heroPhonesImage} alt="eLuna app screens showing daily guidance and a personal sky map" draggable={false} />
    </div>
  );
}

function ProductProofVisual() {
  return (
    <div className="proof-scene" aria-label="eLuna product dashboard preview">
      <div className="scene-glow main" />
      <div className="constellation-layer proof-constellation" />
      <div className="zodiac-halo proof-halo" />
      <div className="proof-panel">
        <div className="proof-panel-top">
          <span>Today in eLuna</span>
          <span>Account-based access</span>
        </div>
        <div className="proof-layout">
          <div className="proof-daily">
            <p>Guidance for today</p>
            <h3>Reflect on the pattern that keeps returning.</h3>
            <span className="mock-cta">Daily preview</span>
          </div>
          <div className="proof-side">
            <div className="proof-card small">
              <Icon name="card" size={18} />
              <span>Daily card</span>
            </div>
            <div className="proof-card small">
              <Icon name="journal" size={18} />
              <span>Reflection journal</span>
            </div>
          </div>
        </div>
        <div className="proof-bottom">
          <SkyMapMini compact />
          <div>
            <p>Personal Sky Map</p>
            <span>Constellation-style insight and progress cues.</span>
          </div>
        </div>
      </div>
      <div className="proof-phone-layer" aria-hidden="true">
        <img className="proof-phone-image proof-phone-sky" src={skyMapScreenImage} alt="" draggable={false} />
      </div>
    </div>
  );
}

function FinalCta() {
  return (
    <section className="final-cta-section">
      <img className="final-cta-sky" src={ctaStarSkyBackgroundImage} alt="" aria-hidden="true" draggable={false} />
      <div className="final-cta-vignette" aria-hidden="true" />
      <div className="final-cta-grid">
        <div className="final-cta-copy">
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
        <div className="cta-astro-scene final-cta-visual" aria-hidden="true">
          <div className="scene-glow main" />
          <div className="scene-glow gold" />
          <div className="constellation-layer cta-constellation" />
          <div className="zodiac-halo cta-halo" />
          <div className="final-cta-orbit" />
          <div className="final-cta-card" />
          <div className="final-cta-mini-card">
            <Icon name="spark" size={24} />
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
          font-family: var(--font-sans), Manrope, system-ui, sans-serif;
          background-image:
            linear-gradient(180deg, rgba(8,5,20,.35), rgba(8,5,20,.82) 45%, #070613 100%),
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
          grid-template-columns: minmax(0, .98fr) minmax(440px, 1.02fr);
          gap: clamp(22px, 3.2vw, 42px);
          align-items: center;
          padding: 46px 0 84px;
        }

        .hero-section h1,
        .welcome-head-page h2 {
          text-wrap: balance;
        }

        .welcome-head-page p {
          text-wrap: pretty;
        }

        .hero-visual,
        .proof-scene,
        .cta-astro-scene {
          position: relative;
          isolation: isolate;
          pointer-events: none;
        }

        .hero-visual {
          width: min(100%, 670px);
          min-height: clamp(560px, 46vw, 680px);
          margin: 0 auto;
        }

        .hero-phones-image {
          position: absolute;
          right: -38px;
          top: -12px;
          z-index: 3;
          width: min(112%, 720px);
          height: clamp(560px, 48vw, 680px);
          max-height: 680px;
          object-fit: contain;
          object-position: center;
          user-select: none;
          pointer-events: none;
          filter:
            drop-shadow(0 38px 78px rgba(0,0,0,.50))
            drop-shadow(0 0 38px rgba(141,85,214,.25))
            drop-shadow(0 0 16px rgba(216,168,95,.12));
          animation: phoneFloat 7.5s ease-in-out infinite;
        }

        .scene-glow {
          position: absolute;
          pointer-events: none;
          z-index: 0;
          border-radius: 999px;
          filter: blur(24px);
        }

        .scene-glow.main {
          inset: 6% -1% 10% 4%;
          background: radial-gradient(circle at 55% 45%, rgba(141,85,214,.42), transparent 61%);
        }

        .scene-glow.gold {
          right: 0;
          bottom: 9%;
          width: 340px;
          height: 260px;
          background: radial-gradient(circle, rgba(216,168,95,.19), transparent 62%);
        }

        .scene-shadow {
          position: absolute;
          right: 2%;
          bottom: 4%;
          width: 82%;
          height: 68px;
          border-radius: 999px;
          background: radial-gradient(ellipse, rgba(0,0,0,.50), transparent 70%);
          filter: blur(8px);
          z-index: 0;
        }

        .constellation-layer,
        .zodiac-halo {
          position: absolute;
          pointer-events: none;
          background-repeat: no-repeat;
          background-position: center;
          background-size: contain;
          mix-blend-mode: screen;
          z-index: 1;
        }

        .constellation-layer {
          background-image: url("${constellationOverlayImage}");
          opacity: .24;
          animation: constellationDrift 18s ease-in-out infinite alternate;
        }

        .zodiac-halo {
          background-image: url("${zodiacHaloImage}");
          opacity: .30;
          animation: haloRotate 42s linear infinite;
          transform-origin: center;
        }

        .hero-constellation {
          inset: 1% -5% 16% 2%;
        }

        .hero-halo {
          width: 490px;
          height: 490px;
          right: 36px;
          top: 40px;
          opacity: .26;
        }

        .proof-constellation {
          inset: 0 2% 8% 0;
          opacity: .20;
        }

        .proof-halo {
          width: 340px;
          height: 340px;
          left: 32px;
          top: 30px;
          opacity: .22;
        }

        .cta-constellation {
          inset: 0 -6% 0 4%;
          opacity: .22;
        }

        .cta-halo {
          width: 300px;
          height: 300px;
          right: 74px;
          top: 4px;
          opacity: .22;
        }

        .proof-phone-layer {
          position: absolute;
          right: 42px;
          bottom: -20px;
          width: 184px;
          height: 286px;
          z-index: 3;
          pointer-events: none;
          user-select: none;
          overflow: visible;
        }

        .proof-phone-image {
          position: absolute;
          display: block;
          width: auto;
          height: auto;
          max-width: none;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          filter: drop-shadow(0 30px 46px rgba(0,0,0,.42)) drop-shadow(0 0 22px rgba(141,85,214,.18));
          animation: phoneFloat 7.5s ease-in-out infinite;
        }

        .proof-phone-sky {
          right: 0;
          bottom: 0;
          width: 176px;
          transform: rotate(4deg);
          transform-origin: bottom right;
        }

        .proof-daily p,
        .proof-bottom p {
          color: var(--gold);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .proof-card span,
        .proof-bottom span {
          color: var(--muted);
          font-size: 10px;
          line-height: 1.45;
        }

        .mock-cta {
          width: fit-content;
          min-height: 34px;
          border-radius: 999px;
          margin-top: 12px;
          border: 1px solid rgba(216,168,95,.18);
          color: var(--gold-2);
          font-size: 10px;
          font-weight: 900;
          background: rgba(216,168,95,.08);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 12px;
          text-align: center;
        }

        .symbolic-orbit {
          position: absolute;
          inset: 22px;
          border-radius: 999px;
          border: 1px solid rgba(216,168,95,.18);
        }

        .sky-map-mini {
          position: relative;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: radial-gradient(circle, rgba(128,64,192,.26), rgba(8,7,22,.16) 58%, rgba(216,168,95,.06));
          border: 1px solid rgba(216,168,95,.18);
        }

        .sky-map-mini svg {
          width: 78%;
          height: 78%;
          stroke: rgba(216,168,95,.88);
          stroke-width: 1.6;
          fill: none;
          filter: drop-shadow(0 0 8px rgba(216,168,95,.35));
        }

        .sky-ring,
        .sky-dot {
          position: absolute;
          border-radius: 999px;
        }

        .sky-ring {
          border: 1px solid rgba(255,255,255,.10);
        }

        .ring-one {
          inset: 18%;
        }

        .ring-two {
          inset: 31%;
        }

        .sky-dot {
          width: 5px;
          height: 5px;
          background: var(--gold-2);
          box-shadow: 0 0 14px rgba(216,168,95,.70);
        }

        .dot-one { left: 25%; top: 58%; }
        .dot-two { left: 42%; top: 35%; }
        .dot-three { right: 28%; top: 46%; }
        .dot-four { right: 17%; top: 24%; }

        .proof-scene {
          min-height: 450px;
        }

        .proof-panel {
          position: relative;
          width: min(100%, 520px);
          min-height: 340px;
          margin: 42px auto 0;
          border-radius: 32px;
          padding: 20px;
          background: linear-gradient(145deg, rgba(24,16,50,.58), rgba(8,7,22,.36));
          border: 1px solid rgba(216,168,95,.14);
          box-shadow: 0 26px 70px rgba(0,0,0,.28);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          z-index: 1;
        }

        .proof-panel-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: var(--muted-2);
          font-size: 11px;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .proof-layout {
          display: grid;
          grid-template-columns: 1.2fr .8fr;
          gap: 14px;
        }

        .proof-daily,
        .proof-card,
        .proof-bottom {
          border: 1px solid rgba(255,255,255,.09);
          background: rgba(255,255,255,.04);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.05);
        }

        .proof-daily {
          min-height: 164px;
          border-radius: 24px;
          padding: 18px;
        }

        .proof-daily h3 {
          color: var(--text);
          font-family: var(--font-display);
          font-size: 28px;
          line-height: 1.04;
          font-weight: 600;
          margin: 10px 0 16px;
        }

        .proof-side {
          display: grid;
          gap: 12px;
        }

        .proof-card.small {
          min-height: 76px;
          border-radius: 20px;
          padding: 14px;
          display: grid;
          align-content: center;
          gap: 8px;
          color: var(--gold-2);
        }

        .proof-bottom {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 16px;
          align-items: center;
          margin-top: 14px;
          border-radius: 24px;
          padding: 14px;
        }

        .cta-astro-scene {
          min-height: 300px;
          display: grid;
          place-items: center;
        }

        .final-cta-section {
          position: relative;
          overflow: hidden;
          border-radius: 36px;
          border: 1px solid rgba(216,168,95,.18);
          background:
            radial-gradient(circle at 82% 50%, rgba(141,85,214,.20), transparent 36%),
            linear-gradient(135deg, rgba(20,13,47,.74), rgba(8,7,22,.64));
          box-shadow: 0 26px 70px rgba(0,0,0,.28);
          margin: 28px 0 18px;
        }

        .final-cta-sky {
          position: absolute;
          inset: -18% -9% -16% 34%;
          width: 76%;
          height: 136%;
          object-fit: cover;
          opacity: .34;
          filter: saturate(.92) contrast(1.04);
          mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.62) 24%, #000 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, rgba(0,0,0,.62) 24%, #000 100%);
          pointer-events: none;
          user-select: none;
        }

        .final-cta-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 72% 46%, rgba(216,168,95,.12), transparent 23%),
            radial-gradient(circle at 88% 66%, rgba(141,85,214,.16), transparent 34%),
            linear-gradient(90deg, rgba(8,7,22,.82) 0%, rgba(8,7,22,.42) 48%, rgba(8,7,22,.74) 100%);
          z-index: 1;
        }

        .final-cta-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(0, 1.02fr) minmax(300px, .82fr);
          gap: 18px;
          align-items: center;
          padding: clamp(24px, 5vw, 40px);
        }

        .final-cta-copy {
          display: grid;
          gap: 14px;
          max-width: 560px;
          position: relative;
          z-index: 3;
        }

        .final-cta-visual {
          min-height: 320px;
        }

        .final-cta-orbit {
          position: absolute;
          right: 9%;
          top: 10%;
          width: min(78%, 320px);
          aspect-ratio: 1;
          border-radius: 999px;
          border: 1px solid rgba(216,168,95,.16);
          background: radial-gradient(circle, rgba(141,85,214,.16), transparent 58%);
          box-shadow: inset 0 0 34px rgba(216,168,95,.055), 0 0 44px rgba(141,85,214,.12);
          z-index: 1;
        }

        .final-cta-card {
          position: absolute;
          right: 17%;
          top: 3%;
          width: clamp(150px, 19vw, 224px);
          aspect-ratio: .58;
          border-radius: 28px;
          z-index: 3;
          background-image: url("${ctaStarMapCardImage}");
          background-position: center;
          background-repeat: no-repeat;
          background-size: 132% auto;
          transform: rotate(6deg);
          box-shadow: 0 28px 64px rgba(0,0,0,.42), 0 0 34px rgba(216,168,95,.10);
          filter: saturate(.98) contrast(1.03);
          overflow: hidden;
          pointer-events: none;
        }

        .final-cta-mini-card {
          position: absolute;
          left: 17%;
          bottom: 17%;
          z-index: 4;
          width: 94px;
          height: 122px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          color: var(--gold-2);
          background:
            radial-gradient(circle at 50% 30%, rgba(216,168,95,.16), transparent 42%),
            linear-gradient(145deg, rgba(24,16,50,.62), rgba(8,7,22,.42));
          border: 1px solid rgba(216,168,95,.18);
          box-shadow: 0 22px 50px rgba(0,0,0,.30), inset 0 1px 0 rgba(255,255,255,.08);
          transform: rotate(-10deg);
        }

        .cta-symbolic-card {
          position: absolute;
          right: 18%;
          top: 20%;
          z-index: 2;
          width: 116px;
          height: 156px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          color: var(--gold-2);
          background:
            radial-gradient(circle at 50% 26%, rgba(216,168,95,.18), transparent 42%),
            linear-gradient(145deg, rgba(24,16,50,.60), rgba(8,7,22,.40));
          border: 1px solid rgba(216,168,95,.20);
          box-shadow: 0 24px 58px rgba(0,0,0,.26), inset 0 1px 0 rgba(255,255,255,.08);
          transform: rotate(9deg);
        }

        .cta-symbolic-card span {
          position: absolute;
          inset: 16px;
          border-radius: 18px;
          border: 1px solid rgba(216,168,95,.13);
        }

        .cta-astro-scene .sky-map-mini {
          width: 168px !important;
          height: 168px !important;
          z-index: 2;
          transform: translate(-58px, 46px);
          box-shadow: 0 20px 54px rgba(0,0,0,.22);
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 14px;
        }

        .testimonials-section {
          position: relative;
          padding: 42px 0 50px;
          scroll-margin-top: 24px;
        }

        .testimonials-section::before {
          content: "";
          position: absolute;
          inset: -38px -24px -22px;
          pointer-events: none;
          background:
            radial-gradient(circle at 48% 8%, rgba(216,168,95,.12), transparent 24%),
            radial-gradient(circle at 18% 44%, rgba(141,85,214,.15), transparent 31%),
            radial-gradient(circle at 82% 54%, rgba(216,168,95,.08), transparent 28%);
          opacity: .95;
          z-index: -1;
        }

        .testimonials-section::after {
          content: "";
          position: absolute;
          inset: 0 -14px;
          pointer-events: none;
          background-image: url("${constellationOverlayImage}");
          background-position: center;
          background-repeat: no-repeat;
          background-size: min(880px, 100%) auto;
          opacity: .10;
          mix-blend-mode: screen;
          z-index: -1;
        }

        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          align-items: stretch;
        }

        .testimonial-card {
          min-height: 332px;
          padding: 20px;
          display: grid;
          align-content: start;
          gap: 18px;
          border-radius: 24px;
          border: 1px solid rgba(216,168,95,.16);
          background:
            radial-gradient(circle at 20% 0%, rgba(216,168,95,.08), transparent 30%),
            linear-gradient(145deg, rgba(24,16,50,.50), rgba(8,7,22,.34));
          box-shadow: 0 22px 58px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.055);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-3px);
          border-color: rgba(216,168,95,.25);
          box-shadow: 0 26px 64px rgba(0,0,0,.28), 0 0 30px rgba(141,85,214,.10), inset 0 1px 0 rgba(255,255,255,.065);
        }

        .testimonial-person {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 13px;
          align-items: center;
          min-width: 0;
        }

        .testimonial-avatar {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          object-fit: cover;
          border: 1px solid rgba(216,168,95,.34);
          box-shadow: 0 0 0 4px rgba(216,168,95,.045), 0 12px 26px rgba(0,0,0,.22);
          user-select: none;
          pointer-events: none;
        }

        .testimonial-name {
          color: var(--text);
          font-size: 17px;
          line-height: 1.25;
          font-weight: 900;
        }

        .testimonial-location {
          color: var(--muted-2);
          font-size: 13px;
          line-height: 1.45;
          margin-top: 2px;
        }

        .testimonial-tag {
          width: fit-content;
          border-radius: 999px;
          border: 1px solid rgba(216,168,95,.20);
          background: rgba(216,168,95,.08);
          color: var(--gold-2);
          font-size: 13px;
          line-height: 1;
          font-weight: 850;
          padding: 8px 10px;
        }

        .testimonial-stars {
          color: var(--gold-2);
          font-size: 13px;
          letter-spacing: .08em;
          opacity: .82;
        }

        .testimonial-quote {
          color: var(--muted);
          font-size: 16px;
          line-height: 1.66;
        }

        .feature-card {
          min-height: 158px;
          padding: 18px;
        }

        .contact-footer-area {
          position: relative;
          margin: 20px 0 0;
          padding: 34px 0 44px;
        }

        .contact-footer-area::before {
          content: "";
          position: absolute;
          inset: 0 -24px;
          pointer-events: none;
          background:
            radial-gradient(circle at 18% 18%, rgba(216,168,95,.10), transparent 24%),
            radial-gradient(circle at 78% 10%, rgba(141,85,214,.16), transparent 30%);
          opacity: .9;
        }

        .contact-support-panel,
        .footer-shell {
          position: relative;
          z-index: 1;
        }

        .contact-support-panel {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(260px, 360px);
          gap: 20px;
          align-items: center;
          padding: 24px;
          border-radius: 28px;
          border: 1px solid rgba(216,168,95,.14);
          background: linear-gradient(145deg, rgba(24,16,50,.34), rgba(8,7,22,.22));
          box-shadow: 0 20px 58px rgba(0,0,0,.22);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .contact-support-card {
          display: grid;
          gap: 8px;
          padding: 18px;
          border-radius: 22px;
          border: 1px solid rgba(216,168,95,.16);
          background: rgba(255,255,255,.035);
        }

        .contact-support-card p,
        .footer-column h3 {
          color: var(--gold);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .contact-support-card a,
        .footer-column a,
        .footer-legal-note a {
          color: var(--gold-2);
          font-weight: 900;
          text-decoration: none;
          overflow-wrap: anywhere;
        }

        .contact-support-card span,
        .footer-column span,
        .footer-brand p,
        .footer-bottom p,
        .footer-legal-note {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.62;
        }

        .footer-shell {
          margin-top: 18px;
          padding: 26px 0 0;
          border-top: 1px solid rgba(216,168,95,.13);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: minmax(220px, 1.35fr) repeat(4, minmax(140px, 1fr));
          gap: 22px;
          align-items: start;
          padding: 8px 0 26px;
        }

        .footer-brand {
          display: grid;
          gap: 12px;
          max-width: 300px;
        }

        .footer-column {
          display: grid;
          gap: 9px;
          align-content: start;
        }

        .footer-column a,
        .footer-column span {
          font-size: 13px;
          line-height: 1.5;
        }

        .footer-bottom {
          display: grid;
          gap: 10px;
          padding: 18px 0 0;
          border-top: 1px solid rgba(255,255,255,.08);
          color: var(--muted-2);
          text-align: center;
        }

        .footer-legal-note {
          width: min(100%, 980px);
          margin: 0 auto;
          color: var(--muted-2);
          font-size: 11.5px;
        }

        @keyframes phoneFloat {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -10px; }
        }

        @keyframes haloRotate {
          from { rotate: 0deg; }
          to { rotate: 360deg; }
        }

        @keyframes constellationDrift {
          from { translate: -8px -4px; opacity: .18; }
          to { translate: 10px 6px; opacity: .30; }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-phones-image,
          .proof-phone-image,
          .zodiac-halo,
          .constellation-layer {
            animation: none !important;
          }
        }

        @media (max-width: 980px) {
          .feature-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .testimonial-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .footer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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
            width: min(100%, 500px);
            min-height: 410px !important;
            margin-top: 4px !important;
          }

          .hero-halo {
            width: 330px;
            height: 330px;
            right: 8px;
            top: 48px;
            opacity: .22;
          }

          .hero-constellation {
            inset: 8% -18% 18% -8%;
            opacity: .18;
          }

          .hero-phones-image {
            right: -8%;
            top: 10px;
            width: 116%;
            height: 390px;
            max-height: 390px;
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

          .proof-scene {
            min-height: 500px;
          }

          .proof-halo {
            width: 260px;
            height: 260px;
            left: 18px;
            top: 42px;
          }

          .proof-panel {
            margin-top: 18px;
            padding: 16px;
            min-height: 330px;
          }

          .proof-layout {
            grid-template-columns: 1fr;
          }

          .proof-phone-layer {
            display: none;
          }

          .final-cta-sky {
            inset: 26% -24% -8% 0;
            width: 128%;
            height: 82%;
            opacity: .28;
            mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,.86) 22%, #000 100%);
            -webkit-mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,.86) 22%, #000 100%);
          }

          .final-cta-vignette {
            background:
              radial-gradient(circle at 70% 76%, rgba(216,168,95,.13), transparent 28%),
              linear-gradient(180deg, rgba(8,7,22,.88) 0%, rgba(8,7,22,.58) 58%, rgba(8,7,22,.82) 100%);
          }

          .final-cta-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .final-cta-visual {
            min-height: 220px !important;
          }

          .cta-astro-scene {
            min-height: 210px !important;
          }

          .cta-halo {
            width: 220px;
            height: 220px;
            right: 42px;
          }

          .cta-symbolic-card {
            right: 12%;
            top: 12%;
            width: 96px;
            height: 130px;
            border-radius: 22px;
          }

          .final-cta-card {
            right: 13%;
            top: 6%;
            width: clamp(132px, 42vw, 170px);
            border-radius: 24px;
          }

          .final-cta-orbit {
            right: 4%;
            top: 12%;
            width: min(72%, 230px);
          }

          .final-cta-mini-card {
            left: 14%;
            bottom: 16%;
            width: 76px;
            height: 98px;
            border-radius: 20px;
          }

          .cta-astro-scene .sky-map-mini {
            width: 132px !important;
            height: 132px !important;
            transform: translate(-42px, 36px);
          }

          .testimonial-grid {
            grid-template-columns: 1fr;
          }

          .testimonial-card {
            min-height: auto;
            padding: 18px;
          }

          .testimonial-avatar {
            width: 58px;
            height: 58px;
          }

          .contact-footer-area {
            padding: 26px 0 34px;
          }

          .contact-support-panel {
            grid-template-columns: 1fr;
            padding: 18px;
            border-radius: 24px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
          }

          .footer-grid {
            gap: 18px;
          }

          .footer-brand {
            max-width: none;
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
          <ProductProofVisual />
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

        <section className="testimonials-section">
          <SectionHeader
            eyebrow="USER IMPRESSIONS"
            title="Why people keep coming back to eLuna"
            body="A daily astrology-inspired experience that feels personal, engaging, and easy to return to."
            centered
          />
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="testimonial-card">
                <div className="testimonial-person">
                  <img className="testimonial-avatar" src={testimonial.image} alt={`${testimonial.name} portrait`} draggable={false} />
                  <div>
                    <h3 className="testimonial-name">{testimonial.name}</h3>
                    <p className="testimonial-location">{testimonial.location}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <span className="testimonial-tag">{testimonial.tag}</span>
                  <span className="testimonial-stars" aria-hidden="true">*****</span>
                </div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" style={{ padding: "36px 0", scrollMarginTop: 24 }}>
          <SectionHeader eyebrow="Pricing" title="Simple digital subscription pricing" body="Create an account first. Paid access is activated inside your account after subscription checkout is completed." centered />
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

        <section id="contact" className="contact-footer-area" style={{ scrollMarginTop: 24 }}>
          <div className="contact-support-panel">
            <div style={{ display: "grid", gap: 10 }}>
              <p style={{ color: "var(--gold)", fontSize: 11, fontWeight: 900, letterSpacing: ".16em", textTransform: "uppercase" }}>Contact</p>
              <h2 style={{ color: "var(--text)", fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4.5vw, 48px)", lineHeight: 1.04, fontWeight: 600 }}>Contact & support</h2>
              <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.68, maxWidth: 650 }}>
                Questions about payments, subscriptions, refunds, data usage, or account access? Contact eLuna support.
              </p>
            </div>
            <div className="contact-support-card">
              <p>Support email</p>
              <a href={supportHref}>{SUPPORT_EMAIL_ADDRESS}</a>
              <span>Typical response time: 2–3 business days</span>
            </div>
          </div>

          <footer className="footer-shell">
            <div className="footer-grid">
              <div className="footer-brand">
                <Logo variant="header" />
                <p>AI-powered self-reflection for your inner world.</p>
              </div>
              <nav className="footer-column" aria-label="Product links">
                <h3>Product</h3>
                <a href="#product">About eLuna</a>
                <a href="#how-it-works">How it works</a>
                <a href="#pricing">Pricing</a>
                <a href="#faq">FAQ</a>
              </nav>
              <div className="footer-column">
                <h3>Features</h3>
                <span>Daily readings</span>
                <span>Symbolic cards</span>
                <span>Personal Sky Map</span>
                <span>Reflection tools</span>
              </div>
              <nav className="footer-column" aria-label="Legal links">
                <h3>Legal</h3>
                {footerLinks.slice(0, 6).map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="footer-column">
                <h3>Contact</h3>
                <Link href="/support">Support / Contact</Link>
                <a href={supportHref}>{SUPPORT_EMAIL_ADDRESS}</a>
                <span>Response time: 2–3 business days</span>
              </div>
            </div>

            <div className="footer-bottom">
              <p>© 2026 eLuna. Digital AI-powered self-reflection subscription service.</p>
              <p className="footer-legal-note">
                {LEGAL_ENTITY_NAME} · {footerAddress} · Support: <a href={supportHref}>{SUPPORT_EMAIL_ADDRESS}</a> · Website: <a href={WEBSITE_URL}>{WEBSITE_URL}</a>
              </p>
              <p>{GLOBAL_DISCLAIMER}</p>
            </div>
          </footer>
        </section>
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

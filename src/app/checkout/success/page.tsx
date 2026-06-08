import Link from "next/link";
import { Logo } from "@/components/Logo";
import { StarField } from "@/components/app-shell/StarField";

export default function CheckoutSuccessPage() {
  return (
    <main className="app no-nav" style={{ minHeight: "100dvh", padding: "24px 18px 40px", display: "grid", alignItems: "center" }}>
      <StarField />
      <section style={{ position: "relative", zIndex: 2, width: "min(100%, 460px)", margin: "0 auto", border: "1px solid rgba(216,168,95,.26)", borderRadius: 28, background: "radial-gradient(circle at 18% 0%, rgba(216,168,95,.14), transparent 36%), rgba(12,8,28,.86)", boxShadow: "0 22px 56px rgba(0,0,0,.42)", padding: "26px 20px", textAlign: "center" }}>
        <div style={{ display: "grid", justifyItems: "center", marginBottom: 18 }}><Logo variant="auth" /></div>
        <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".13em", textTransform: "uppercase", marginBottom: 9 }}>Checkout received</p>
        <h1 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 34, fontWeight: 600, lineHeight: 1.05, marginBottom: 10 }}>Your payment is being confirmed.</h1>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>Access is activated after Stripe confirms your subscription.</p>
        <div style={{ display: "grid", gap: 10 }}>
          <Link href="/home" style={{ minHeight: 46, borderRadius: 999, background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)", color: "#fff", fontSize: 14, fontWeight: 900, textDecoration: "none", display: "grid", placeItems: "center", boxShadow: "0 10px 28px rgba(90,32,144,.38)" }}>Go to eLuna</Link>
          <Link href="/profile" style={{ minHeight: 42, borderRadius: 999, border: "1px solid rgba(216,168,95,.24)", background: "rgba(216,168,95,.07)", color: "var(--gold-2)", fontSize: 13, fontWeight: 900, textDecoration: "none", display: "grid", placeItems: "center" }}>Check access</Link>
        </div>
      </section>
    </main>
  );
}

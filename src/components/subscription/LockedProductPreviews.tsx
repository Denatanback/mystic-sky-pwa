"use client";

import type { CSSProperties } from "react";

const cardStyle: CSSProperties = {
  border: "1px solid rgba(216,168,95,.20)",
  borderRadius: 22,
  background: "rgba(12,8,28,.64)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 14px 34px rgba(0,0,0,.24)",
};

const primaryButtonStyle: CSSProperties = {
  minHeight: 42,
  borderRadius: 999,
  border: "none",
  background: "linear-gradient(135deg, #8040c0 0%, #5a2090 100%)",
  color: "#fff",
  fontSize: 13,
  fontWeight: 900,
  fontFamily: "var(--font-ui)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 16px",
  boxShadow: "0 10px 28px rgba(90,32,144,.36)",
};

const mutedButtonStyle: CSSProperties = {
  minHeight: 38,
  borderRadius: 999,
  border: "1px solid rgba(216,168,95,.22)",
  background: "rgba(216,168,95,.07)",
  color: "var(--gold-2)",
  fontSize: 12,
  fontWeight: 900,
  fontFamily: "var(--font-ui)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 13px",
};

function Eyebrow({ children }: { children: string }) {
  return (
    <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>
      {children}
    </p>
  );
}

function LockBadge({ label = "Locked" }: { label?: string }) {
  return (
    <span style={{ border: "1px solid rgba(216,168,95,.24)", borderRadius: 999, color: "var(--gold-2)", background: "rgba(216,168,95,.07)", padding: "5px 9px", fontSize: 10, fontWeight: 900, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function MiniProgress() {
  return (
    <section style={{ ...cardStyle, padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
        <div>
          <Eyebrow>Your streak</Eyebrow>
          <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.45 }}>Complete daily actions to keep your path active.</p>
        </div>
        <LockBadge label="0 days" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
        {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
          <div key={`${day}-${index}`} style={{ textAlign: "center" }}>
            <p style={{ fontSize: 10, color: index === 4 ? "var(--gold-2)" : "var(--muted-2)", fontWeight: 800, marginBottom: 6 }}>{day}</p>
            <span style={{ width: 14, height: 14, borderRadius: "50%", margin: "0 auto", display: "block", border: `1px solid ${index === 4 ? "rgba(216,168,95,.82)" : "rgba(255,255,255,.16)"}`, background: index < 2 ? "var(--gold-2)" : "rgba(255,255,255,.04)", boxShadow: index === 4 ? "0 0 0 4px rgba(216,168,95,.08)" : "none" }} />
          </div>
        ))}
      </div>
    </section>
  );
}

function PracticeCard({ image, title, text, meta }: { image: string; title: string; text: string; meta: string }) {
  return (
    <section style={{ ...cardStyle, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <img src={image} alt="" style={{ width: 86, height: 86, borderRadius: 20, objectFit: "cover", filter: "drop-shadow(0 16px 22px rgba(0,0,0,.28))" }} draggable={false} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", marginBottom: 5 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 23, color: "var(--text)", fontWeight: 600, lineHeight: 1.1 }}>{title}</h2>
            <LockBadge />
          </div>
          <p style={{ color: "var(--gold-2)", fontSize: 12, fontWeight: 800, marginBottom: 7 }}>{meta}</p>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>{text}</p>
          <span style={mutedButtonStyle}>Unlock</span>
        </div>
      </div>
    </section>
  );
}

export function LockedHomePreview() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <MiniProgress />
      <section style={{ ...cardStyle, padding: 18, borderColor: "rgba(216,168,95,.30)", background: "linear-gradient(145deg, rgba(22,13,54,.82), rgba(10,6,28,.70))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
          <Eyebrow>Guidance for today</Eyebrow>
          <LockBadge label="Today" />
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text)", fontWeight: 600, lineHeight: 1.08, marginBottom: 8 }}>Notice what pulls your attention</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>Your daily reading, card, practice, and path progress open here.</p>
        <span style={{ ...primaryButtonStyle, width: "100%" }}>Open today's reading</span>
      </section>
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          ["/assets/home/eluna-todays-reading-icon.png", "Today's reading", "Open your personal insight."],
          ["/assets/home/eluna-daily-card-icon.png", "Daily card", "Reveal today's symbol."],
        ].map(([image, title, text]) => (
          <div key={title} style={{ ...cardStyle, padding: 14, minHeight: 220, display: "flex", flexDirection: "column" }}>
            <img src={image} alt="" style={{ width: "min(100%, 118px)", height: 112, objectFit: "contain", alignSelf: "center", marginBottom: 9, filter: "drop-shadow(0 16px 24px rgba(90,32,144,.34))" }} draggable={false} />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 21, color: "var(--text)", fontWeight: 600, marginBottom: 6 }}>{title}</h2>
            <p style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.45, flex: 1 }}>{text}</p>
            <LockBadge />
          </div>
        ))}
      </section>
      <section style={{ ...cardStyle, padding: 16 }}>
        <Eyebrow>Today&apos;s progress</Eyebrow>
        {["Reading", "Practice", "Affirmation", "Daily card"].map((label, index) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,.06)" }}>
            <span style={{ color: "var(--text)", fontSize: 13, fontWeight: 800 }}>{label}</span>
            <span style={{ color: "var(--muted-2)", fontSize: 12, fontWeight: 800 }}>Ready</span>
          </div>
        ))}
      </section>
    </div>
  );
}

export function LockedPracticesPreview() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ marginBottom: 2 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: 600, color: "var(--text)", lineHeight: 1.05, marginBottom: 6 }}>Practices</h1>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.55 }}>Small daily actions that keep your path active.</p>
      </section>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {["Today", "My", "Library"].map((item, index) => (
          <span key={item} style={{ height: 40, borderRadius: 999, border: `1px solid ${index === 0 ? "rgba(216,168,95,.45)" : "rgba(255,255,255,.10)"}`, background: index === 0 ? "rgba(216,168,95,.12)" : "rgba(255,255,255,.04)", color: index === 0 ? "var(--gold-2)" : "var(--muted)", fontSize: 13, fontWeight: 800, display: "grid", placeItems: "center" }}>{item}</span>
        ))}
      </div>
      <PracticeCard image="/assets/practice-icons/breathing-practice-icon.webp" title="Breathing practice" meta="2 minutes" text="Ground your attention with a short breath sequence." />
      <PracticeCard image="/assets/practice-icons/symbol-practice-icon.webp" title="Symbol practice" meta="Daily card" text="Draw one symbol for today and save what it mirrors." />
      <section style={{ ...cardStyle, padding: 16, borderColor: "rgba(216,168,95,.32)", background: "radial-gradient(circle at 18% 0%, rgba(216,168,95,.14), transparent 36%), rgba(12,8,28,.66)" }}>
        <Eyebrow>eLuna Oracle</Eyebrow>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, color: "var(--text)", fontWeight: 600, lineHeight: 1.1, marginBottom: 7 }}>Premium guidance is coming soon</h2>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, marginBottom: 12 }}>Future Oracle guidance will live here after server-side access and history are ready.</p>
        <LockBadge label="Coming soon" />
      </section>
      <section style={{ ...cardStyle, padding: 16 }}>
        <Eyebrow>Unlock more practices</Eyebrow>
        {["Personal card pattern", "Past-life affirmation", "Relationship ritual", "Weekly soul report"].map((label, index) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "9px 0", borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,.06)" }}>
            <span style={{ color: "var(--text)", fontSize: 13 }}>{label}</span>
            <span style={{ color: "var(--muted-2)", fontSize: 11 }}>Upcoming</span>
          </div>
        ))}
      </section>
    </div>
  );
}

export function LockedDailyCardPreview() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ ...cardStyle, padding: "20px 18px 18px", textAlign: "center", background: "radial-gradient(circle at 50% 0%, rgba(216,168,95,.13), transparent 34%), rgba(12,8,28,.68)" }}>
        <Eyebrow>Today&apos;s card</Eyebrow>
        <img src="/assets/daily-cards/card-16-the-celestial-compass.webp" alt="" style={{ width: "min(76vw, 238px)", maxHeight: 330, objectFit: "contain", margin: "0 auto 16px", display: "block", filter: "drop-shadow(0 24px 34px rgba(0,0,0,.36)) drop-shadow(0 0 22px rgba(216,168,95,.15))" }} draggable={false} />
        <h1 style={{ fontFamily: "var(--font-display)", color: "var(--text)", fontSize: 34, fontWeight: 600, lineHeight: 1.05, marginBottom: 8 }}>The Celestial Compass</h1>
        <LockBadge label="Locked" />
      </section>
      {["Meaning", "Action", "Reflection question"].map((title) => (
        <section key={title} style={{ ...cardStyle, padding: 16 }}>
          <Eyebrow>{title}</Eyebrow>
          <p style={{ color: "var(--text)", fontSize: 14, lineHeight: 1.6 }}>A guided interpretation and reflection prompt appears here after access is active.</p>
        </section>
      ))}
      <section style={{ ...cardStyle, padding: 16 }}>
        <Eyebrow>Your reflection</Eyebrow>
        <div style={{ minHeight: 110, borderRadius: 16, border: "1px solid rgba(216,168,95,.20)", background: "rgba(255,255,255,.05)", padding: 12, marginBottom: 12, color: "var(--muted)", fontSize: 14 }}>What did this card mirror today?</div>
        <span style={{ ...primaryButtonStyle, width: "100%" }}>Save reflection</span>
      </section>
    </div>
  );
}

export function LockedPathPreview() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ ...cardStyle, padding: 18 }}>
        <Eyebrow>Luna Path</Eyebrow>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, color: "var(--text)", fontWeight: 600, lineHeight: 1.05, marginBottom: 8 }}>Your first signal is waiting</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>Daily readings, rituals, and symbolic actions open levels over time.</p>
      </section>
      <section style={{ ...cardStyle, padding: 16 }}>
        <Eyebrow>Path levels</Eyebrow>
        {[
          ["1", "First signal", "Ready"],
          ["2", "Personal card pattern", "Tomorrow"],
          ["3", "Past-life signal", "Locked"],
          ["5", "Relationship insight", "Locked"],
        ].map(([day, label, status], index) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "42px 1fr auto", gap: 10, alignItems: "center", padding: "11px 0", borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,.06)" }}>
            <span style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(216,168,95,.24)", display: "grid", placeItems: "center", color: "var(--gold-2)", fontSize: 12, fontWeight: 900 }}>D{day}</span>
            <span style={{ color: "var(--text)", fontSize: 13, fontWeight: 800 }}>{label}</span>
            <span style={{ color: status === "Ready" ? "var(--gold-2)" : "var(--muted-2)", fontSize: 11, fontWeight: 800 }}>{status}</span>
          </div>
        ))}
      </section>
      <section style={{ ...cardStyle, padding: 16 }}>
        <Eyebrow>Daily rituals</Eyebrow>
        {["Open reading", "Complete practice", "Repeat affirmation", "Draw card"].map((label) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderTop: label === "Open reading" ? "none" : "1px solid rgba(255,255,255,.06)" }}>
            <span style={{ color: "var(--text)", fontSize: 13 }}>{label}</span>
            <LockBadge label="Ready" />
          </div>
        ))}
      </section>
      <section style={{ ...cardStyle, padding: 16 }}>
        <Eyebrow>Oracle</Eyebrow>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, color: "var(--text)", fontWeight: 600, lineHeight: 1.1, marginBottom: 7 }}>Coming soon</h2>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>Oracle guidance is previewed as a future premium feature.</p>
      </section>
    </div>
  );
}

export function LockedSkyPreview() {
  const nodes = [
    ["Sun Sign", "Active", 50, 13],
    ["Life Path", "Available", 20, 29],
    ["Energy Rhythm", "Locked", 80, 29],
    ["Past Life", "Premium", 20, 55],
    ["Soulmate", "Premium", 80, 55],
    ["Weekly Report", "Locked", 28, 79],
    ["Grounding", "Locked", 68, 79],
  ] as const;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ ...cardStyle, padding: "18px 18px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, color: "var(--text)", fontWeight: 600, lineHeight: 1.05, marginBottom: 8 }}>Your Sky Map</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>Complete daily practices to unlock deeper insights across your personal map.</p>
        <span style={primaryButtonStyle}>Continue today&apos;s path</span>
      </section>
      <section style={{ ...cardStyle, padding: 13 }}>
        <Eyebrow>Node status legend</Eyebrow>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
          {["Active", "Available", "Locked", "Premium"].map((label) => <LockBadge key={label} label={label} />)}
        </div>
      </section>
      <div style={{ position: "relative", height: 430, borderRadius: 24, overflow: "hidden", border: "1px solid rgba(216,168,95,.15)", background: "#06040f" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 45%, rgba(90,40,180,.35), transparent 32%), radial-gradient(circle at 20% 65%, rgba(50,70,200,.18), transparent 25%), #06040f" }} />
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 250, height: 250, borderRadius: "50%", overflow: "hidden" }}>
          <img src="/assets/sky-background/sky-background-woman.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, transparent 28%, rgba(6,4,15,.72) 66%, rgba(6,4,15,.98) 100%)" }} />
        </div>
        {[286, 246, 206].map((size, index) => <div key={size} style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: size, height: size, borderRadius: "50%", border: `1px solid rgba(216,168,95,${0.06 + index * 0.03})` }} />)}
        {nodes.map(([title, status, x, y], index) => (
          <div key={title} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)", width: 82, minHeight: 82, display: "grid", justifyItems: "center", gap: 3, zIndex: 5 }}>
            <div style={{ width: index === 0 ? 60 : 52, height: index === 0 ? 60 : 52, borderRadius: "50%", border: "1px solid rgba(216,168,95,.32)", background: "radial-gradient(circle, rgba(216,168,95,.18), rgba(90,32,144,.30))", display: "grid", placeItems: "center", color: "var(--gold-2)", fontWeight: 900 }}>{index + 1}</div>
            <p style={{ textAlign: "center", color: status === "Locked" || status === "Premium" ? "var(--muted-2)" : "var(--text)", fontSize: 9.5, lineHeight: 1.2, fontWeight: 800 }}>{title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LockedJournalPreview() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ ...cardStyle, padding: 18 }}>
        <Eyebrow>Journal</Eyebrow>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, color: "var(--text)", fontWeight: 600, lineHeight: 1.05, marginBottom: 8 }}>Your reflection archive</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>Daily card notes, readings, and practice reflections gather here.</p>
      </section>
      {["Today's reading note", "Daily card reflection", "Practice signal"].map((title, index) => (
        <section key={title} style={{ ...cardStyle, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
            <Eyebrow>{index === 0 ? "Recent" : "Saved"}</Eyebrow>
            <LockBadge />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 23, color: "var(--text)", fontWeight: 600, lineHeight: 1.1, marginBottom: 7 }}>{title}</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>A private saved entry preview appears in this space.</p>
        </section>
      ))}
    </div>
  );
}

export function LockedCardsPreview() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ ...cardStyle, padding: 18 }}>
        <Eyebrow>Cards</Eyebrow>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 34, color: "var(--text)", fontWeight: 600, lineHeight: 1.05, marginBottom: 8 }}>Symbolic card readings</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>Explore spreads, daily cards, and reflection prompts.</p>
      </section>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        {[
          "/assets/daily-cards/card-01-the-quiet-star.webp",
          "/assets/daily-cards/card-05-the-moonlit-tide.webp",
          "/assets/daily-cards/card-13-the-first-spark.webp",
        ].map((image) => (
          <div key={image} style={{ ...cardStyle, padding: 8, aspectRatio: "3 / 4", display: "grid", placeItems: "center" }}>
            <img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 16px 20px rgba(0,0,0,.32))" }} draggable={false} />
          </div>
        ))}
      </section>
      {["Daily card", "Three-card spread", "Reflection archive"].map((title) => (
        <section key={title} style={{ ...cardStyle, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <Eyebrow>Reading</Eyebrow>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 23, color: "var(--text)", fontWeight: 600, lineHeight: 1.1 }}>{title}</h2>
          </div>
          <LockBadge />
        </section>
      ))}
    </div>
  );
}

export function getLockedProductPreview(pathname: string) {
  if (pathname.startsWith("/practices")) return <LockedPracticesPreview />;
  if (pathname.startsWith("/daily-card")) return <LockedDailyCardPreview />;
  if (pathname.startsWith("/sky")) return <LockedSkyPreview />;
  if (pathname.startsWith("/path")) return <LockedPathPreview />;
  if (pathname.startsWith("/journal")) return <LockedJournalPreview />;
  if (pathname.startsWith("/cards")) return <LockedCardsPreview />;
  return <LockedHomePreview />;
}

export function CooldownNodeMessage() {
  return (
    <div style={{ textAlign: "center", padding: "40px 16px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>&#9203;</div>
      <p style={{ color: "var(--gold-2)", fontSize: 13, fontWeight: 900, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>
        Opens tomorrow
      </p>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 27, fontWeight: 600, color: "var(--text)", lineHeight: 1.12, marginBottom: 8 }}>
        This point is opening
      </h2>
      <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>
        Your next point opens on your next calendar day. Explore another direction while this one settles into your map.
      </p>
    </div>
  );
}

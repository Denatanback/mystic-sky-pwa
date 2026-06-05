"use client";

import Link from "next/link";
import { lunaCardStyle, lunaPrimaryButtonStyle, LunaGlyph } from "./shared";

export function OraclePreviewCard() {
  return (
    <section style={{ ...lunaCardStyle, padding: 16, background: "radial-gradient(circle at 82% 0%, rgba(141,85,214,.18), transparent 34%), rgba(12,8,28,.64)" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <LunaGlyph />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "var(--gold)", fontSize: 10, fontWeight: 900, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 7 }}>Preview</p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 25, color: "var(--text)", fontWeight: 600, lineHeight: 1.1, marginBottom: 7 }}>Оракул eLuna</h2>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55, marginBottom: 13 }}>Оракул доступен в Практиках. Продолжай Лунный путь, чтобы зарабатывать токены для глубоких ответов.</p>
          <Link href="/practices#oracle" style={{ ...lunaPrimaryButtonStyle, minHeight: 40 }}>Перейти к Оракулу</Link>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useState, useRef, useEffect } from "react";
import { useLang } from "@/lib/i18n";

export function LangToggle() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 50 }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Switch language"
        style={{
          display: "flex", alignItems: "center", gap: 4,
          height: 32, padding: "0 10px",
          borderRadius: 999,
          background: "rgba(255,255,255,.06)",
          border: "1px solid rgba(216,168,95,.25)",
          color: "var(--gold-2)",
          fontSize: 12, fontWeight: 600, letterSpacing: ".05em",
          cursor: "pointer", fontFamily: "var(--font-sans)",
          transition: "background .15s",
        }}
      >
        {lang.toUpperCase()}
        <svg
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0,
          minWidth: 90,
          background: "rgba(14,10,34,.95)",
          border: "1px solid rgba(216,168,95,.28)",
          borderRadius: 12,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,.5)",
        }}>
          {(["en", "ru"] as const).map(l => (
            <button
              key={l}
              onClick={() => { setLang(l); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", padding: "10px 14px",
                background: lang === l ? "rgba(216,168,95,.12)" : "transparent",
                border: "none",
                borderBottom: l === "en" ? "1px solid rgba(255,255,255,.06)" : "none",
                color: lang === l ? "var(--gold-2)" : "var(--muted)",
                fontSize: 13, fontWeight: lang === l ? 600 : 400,
                cursor: "pointer", fontFamily: "var(--font-sans)",
                textAlign: "left", transition: "background .15s",
              }}
            >
              {lang === l && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
              {l === "en" ? "English" : "Русский"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

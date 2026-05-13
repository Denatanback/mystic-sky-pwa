"use client";
import { useState } from "react";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";
import { useLang } from "@/lib/i18n";

const MOON_PHASES = ["\u{1F311}","\u{1F312}","\u{1F313}","\u{1F314}","\u{1F315}","\u{1F316}","\u{1F317}","\u{1F318}"];

function IconPen() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>; }
function IconChevron() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>; }
function IconSparkle() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>; }

export default function JournalPage() {
  const { t } = useLang();
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeTag, setActiveTag] = useState<"All" | "Insight" | "Node" | "Card">(t.journal.all);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const ENTRIES = [
    { id: 1, dayLabel: t.journal.all === "All" ? "Today" : "Сегодня",    title: t.journal.all === "All" ? "Intuition without rush" : "Интуиция без спешки",     text: t.journal.all === "All" ? "I noticed the answer didn't come right away, but after a pause. The body knew before the mind." : "Я заметил/а, что ответ появился не сразу, а после паузы.", tag: t.journal.insight, tagColor: "var(--blue)", moon: MOON_PHASES[4], accentColor: "rgba(131,184,207,.12)", borderColor: "rgba(131,184,207,.25)" },
    { id: 2, dayLabel: t.journal.all === "All" ? "Yesterday" : "Вчера",  title: t.journal.all === "All" ? "Theme of boundaries" : "Тема границ", text: t.journal.all === "All" ? "Today it was important not to agree automatically. A pause before answering works." : "Сегодня было важно не соглашаться автоматически.", tag: t.journal.node, tagColor: "var(--rose)", moon: MOON_PHASES[3], accentColor: "rgba(200,128,165,.10)", borderColor: "rgba(200,128,165,.22)" },
    { id: 3, dayLabel: t.journal.all === "All" ? "May 10" : "10 мая", title: t.journal.all === "All" ? "Card: Threshold" : "Карта: Порог", text: t.journal.all === "All" ? "I linger in the old state out of habit. The card showed this precisely." : "Задерживаюсь в старом состоянии из-за привычки.", tag: t.journal.card, tagColor: "var(--gold)", moon: MOON_PHASES[2], accentColor: "rgba(216,168,95,.08)", borderColor: "rgba(216,168,95,.22)" },
    { id: 4, dayLabel: t.journal.all === "All" ? "May 7" : "7 мая",   title: t.journal.all === "All" ? "Fatigue as a signal" : "Усталость как сигнал", text: t.journal.all === "All" ? "I noticed fatigue comes when I act out of habit, not my own will." : "Заметила, что усталость приходит, когда действую не из своей воли.", tag: t.journal.insight, tagColor: "var(--blue)", moon: MOON_PHASES[1], accentColor: "rgba(131,184,207,.08)", borderColor: "rgba(131,184,207,.18)" },
  ];
  const TAGS = [t.journal.all, t.journal.insight, t.journal.node, t.journal.card];

  const filtered = activeTag === t.journal.all ? ENTRIES : ENTRIES.filter(e => e.tag === activeTag);
  function handleSave() { if (!note.trim()) return; setSaved(true); setTimeout(() => { setSaved(false); setNote(""); }, 1800); }

  return (
    <div className="app">
      <StarField />
      <div className="content">
        <header className="header">
          <div className="screen-title"><h1>{t.journal.title}</h1><p>{t.journal.subtitle}</p></div>
          <button className="icon-btn" aria-label="New entry"><IconPen /></button>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
          {[{ val: "12", label: t.journal.daysStreak, color: "var(--gold)" }, { val: "9", label: t.journal.entries, color: "var(--rose)" }, { val: "3", label: t.journal.nodes, color: "var(--blue)" }].map(s => (
            <div key={s.label} style={{ background: "transparent", border: "1px solid rgba(216,168,95,.18)", borderRadius: "var(--radius-md)", padding: "12px 10px", textAlign: "center", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "var(--font-serif)", lineHeight: 1.1 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "transparent", border: "1px solid rgba(216,168,95,.22)", borderRadius: "var(--radius-lg)", padding: "18px 18px 16px", marginBottom: 20, backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ color: "var(--gold)", opacity: .7 }}><IconSparkle /></span>
            <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>{t.journal.quickNote}</span>
          </div>
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder={t.journal.placeholder} rows={3}
            style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid var(--line-soft)", borderRadius: "var(--radius-sm)", color: "var(--text)", fontSize: 14, lineHeight: 1.6, padding: "12px 14px", resize: "none", outline: "none", transition: "border-color .2s", fontFamily: "var(--font-sans)" }}
            onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = "rgba(216,168,95,.4)"; }}
            onBlur={e  => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--line-soft)"; }}
          />
          <button className="btn primary" onClick={handleSave} style={{ marginTop: 12, width: "100%", opacity: note.trim() ? 1 : 0.45, transition: "opacity .2s" }}>
            {saved ? t.journal.saved : t.journal.save}
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
          {TAGS.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)} style={{ flexShrink: 0, background: activeTag === tag ? "rgba(216,168,95,.18)" : "rgba(255,255,255,.04)", border: `1px solid ${activeTag === tag ? "rgba(216,168,95,.45)" : "var(--line-soft)"}`, borderRadius: 20, color: activeTag === tag ? "var(--gold)" : "var(--muted)", fontSize: 13, fontWeight: activeTag === tag ? 600 : 400, padding: "6px 14px", cursor: "pointer", transition: "all .18s", whiteSpace: "nowrap" }}>{tag}</button>
          ))}
        </div>

        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>{t.journal.recent}</h2>
            <a href="#" style={{ fontSize: 12, color: "var(--gold)", opacity: .8 }}>{t.journal.archive}</a>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(entry => {
              const isOpen = expandedId === entry.id;
              return (
                <article key={entry.id} onClick={() => setExpandedId(isOpen ? null : entry.id)} style={{ background: entry.accentColor, border: `1px solid ${entry.borderColor}`, borderRadius: "var(--radius-lg)", padding: "16px 16px 14px", cursor: "pointer", backdropFilter: "blur(6px)", transition: "transform .15s" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{entry.moon}</span>
                      <span style={{ fontSize: 12, color: "var(--muted-2)" }}>{entry.dayLabel}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: entry.tagColor, background: `${entry.tagColor}22`, border: `1px solid ${entry.tagColor}44`, borderRadius: 10, padding: "2px 10px" }}>{entry.tag}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", lineHeight: 1.3 }}>{entry.title}</h3>
                    <span style={{ color: "var(--muted-2)", flexShrink: 0, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform .2s", marginTop: 2 }}><IconChevron /></span>
                  </div>
                  {isOpen ? <p style={{ marginTop: 10, fontSize: 13, color: "var(--muted)", lineHeight: 1.65, borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 10 }}>&ldquo;{entry.text}&rdquo;</p>
                    : <p style={{ marginTop: 6, fontSize: 13, color: "var(--muted-2)", lineHeight: 1.5 }}>{entry.text.length > 80 ? entry.text.slice(0, 80) + "..." : entry.text}</p>}
                </article>
              );
            })}
          </div>
        </section>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--muted-2)" }}><div style={{ fontSize: 32, marginBottom: 12 }}>&#10022;</div><p style={{ fontSize: 14 }}>{t.journal.empty}</p></div>}
      </div>
      <BottomNav />
    </div>
  );
}

"use client";
import { useState } from "react";
import { StarField } from "@/components/app-shell/StarField";
import { BottomNav } from "@/components/app-shell/BottomNav";

const MOON_PHASES = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];

const ENTRIES = [
  {
    id: 1, day: 12, dayLabel: "Сегодня",
    title: "Интуиция без спешки",
    text: "Я заметил/а, что ответ появился не сразу, а после паузы. Тело знало раньше ума.",
    tag: "Инсайт", tagColor: "var(--blue)",
    moon: MOON_PHASES[4],
    accentColor: "rgba(131,184,207,.12)",
    borderColor: "rgba(131,184,207,.25)",
  },
  {
    id: 2, day: 11, dayLabel: "Вчера",
    title: "Тема границ",
    text: "Сегодня было важно не соглашаться автоматически. Пауза перед ответом работает.",
    tag: "Узел", tagColor: "var(--rose)",
    moon: MOON_PHASES[3],
    accentColor: "rgba(200,128,165,.10)",
    borderColor: "rgba(200,128,165,.22)",
  },
  {
    id: 3, day: 10, dayLabel: "10 мая",
    title: "Карта: Порог",
    text: "Похоже, я задерживаюсь в старом состоянии из-за привычки. Карта показала это точно.",
    tag: "Карта", tagColor: "var(--gold)",
    moon: MOON_PHASES[2],
    accentColor: "rgba(216,168,95,.08)",
    borderColor: "rgba(216,168,95,.22)",
  },
  {
    id: 4, day: 7, dayLabel: "7 мая",
    title: "Усталость как сигнал",
    text: "Заметила, что усталость всегда приходит, когда действую не из своей воли.",
    tag: "Инсайт", tagColor: "var(--blue)",
    moon: MOON_PHASES[1],
    accentColor: "rgba(131,184,207,.08)",
    borderColor: "rgba(131,184,207,.18)",
  },
];

const TAGS = ["Все", "Инсайт", "Узел", "Карта"];

function IconPen() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function IconSparkle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}

export default function JournalPage() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [activeTag, setActiveTag] = useState("Все");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = activeTag === "Все"
    ? ENTRIES
    : ENTRIES.filter(e => e.tag === activeTag);

  function handleSave() {
    if (!note.trim()) return;
    setSaved(true);
    setTimeout(() => { setSaved(false); setNote(""); }, 1800);
  }

  return (
    <div className="app">
      <StarField />
      <div className="content">

        <header className="header">
          <div className="screen-title">
            <h1>Журнал</h1>
            <p>Заметки, ответы и наблюдения.</p>
          </div>
          <button className="icon-btn" aria-label="Новая запись">
            <IconPen />
          </button>
        </header>

        {/* stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
          {[
            { val: "12", label: "дней подряд", color: "var(--gold)" },
            { val: "9",  label: "записей",     color: "var(--rose)" },
            { val: "3",  label: "узла",        color: "var(--blue)" },
          ].map(s => (
            <div key={s.label} style={{
              background: "rgba(17,20,40,.80)",
              border: "1px solid rgba(255,255,255,.07)",
              borderRadius: "var(--radius-md)",
              padding: "12px 10px",
              textAlign: "center",
              backdropFilter: "blur(6px)",
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "var(--font-serif)", lineHeight: 1.1 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* quick note */}
        <div style={{
          background: "rgba(17,20,40,.85)",
          border: "1px solid rgba(216,168,95,.18)",
          borderRadius: "var(--radius-lg)",
          padding: "18px 18px 16px",
          marginBottom: 20,
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ color: "var(--gold)", opacity: .7 }}><IconSparkle /></span>
            <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>Быстрая запись</span>
          </div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Что сегодня стало заметнее?"
            rows={3}
            style={{
              width: "100%",
              background: "rgba(255,255,255,.04)",
              border: "1px solid var(--line-soft)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text)",
              fontSize: 14,
              lineHeight: 1.6,
              padding: "12px 14px",
              resize: "none",
              outline: "none",
              transition: "border-color .2s",
              fontFamily: "var(--font-sans)",
            }}
            onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = "rgba(216,168,95,.4)"; }}
            onBlur={e => { (e.target as HTMLTextAreaElement).style.borderColor = "var(--line-soft)"; }}
          />
          <button
            className="btn primary"
            onClick={handleSave}
            style={{ marginTop: 12, width: "100%", opacity: note.trim() ? 1 : 0.45, transition: "opacity .2s" }}
          >
            {saved ? "Сохранено" : "Сохранить запись"}
          </button>
        </div>

        {/* filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
          {TAGS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              style={{
                flexShrink: 0,
                background: activeTag === t ? "rgba(216,168,95,.18)" : "rgba(255,255,255,.04)",
                border: `1px solid ${activeTag === t ? "rgba(216,168,95,.45)" : "var(--line-soft)"}`,
                borderRadius: 20,
                color: activeTag === t ? "var(--gold)" : "var(--muted)",
                fontSize: 13,
                fontWeight: activeTag === t ? 600 : 400,
                padding: "6px 14px",
                cursor: "pointer",
                transition: "all .18s",
                whiteSpace: "nowrap",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* entries */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>Последние записи</h2>
            <a href="#" style={{ fontSize: 12, color: "var(--gold)", opacity: .8 }}>Архив</a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(entry => {
              const isOpen = expandedId === entry.id;
              return (
                <article
                  key={entry.id}
                  onClick={() => setExpandedId(isOpen ? null : entry.id)}
                  style={{
                    background: entry.accentColor,
                    border: `1px solid ${entry.borderColor}`,
                    borderRadius: "var(--radius-lg)",
                    padding: "16px 16px 14px",
                    cursor: "pointer",
                    backdropFilter: "blur(6px)",
                    transition: "transform .15s",
                  }}
                >
                  {/* date + tag row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{entry.moon}</span>
                      <span style={{ fontSize: 12, color: "var(--muted-2)" }}>{entry.dayLabel}</span>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: entry.tagColor,
                      background: `${entry.tagColor}22`,
                      border: `1px solid ${entry.tagColor}44`,
                      borderRadius: 10,
                      padding: "2px 10px",
                    }}>
                      {entry.tag}
                    </span>
                  </div>

                  {/* title + chevron */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", lineHeight: 1.3 }}>
                      {entry.title}
                    </h3>
                    <span style={{
                      color: "var(--muted-2)", flexShrink: 0,
                      transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform .2s",
                      marginTop: 2,
                    }}>
                      <IconChevron />
                    </span>
                  </div>

                  {/* body */}
                  {isOpen ? (
                    <p style={{
                      marginTop: 10, fontSize: 13, color: "var(--muted)", lineHeight: 1.65,
                      borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 10,
                    }}>
                      &ldquo;{entry.text}&rdquo;
                    </p>
                  ) : (
                    <p style={{ marginTop: 6, fontSize: 13, color: "var(--muted-2)", lineHeight: 1.5 }}>
                      {entry.text.length > 80 ? entry.text.slice(0, 80) + "..." : entry.text}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--muted-2)" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
            <p style={{ fontSize: 14 }}>Пока нет записей в этой категории.</p>
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  );
}

export function SectionHeading({ title, eyebrow }: { title: string; eyebrow?: string }) {
  return (
    <header className="mb-6 text-center">
      {eyebrow ? <p className="mb-2 font-serif text-sm uppercase tracking-[0.36em] text-[var(--gold)]">{eyebrow}</p> : null}
      <h1 className="page-title">{title}</h1>
    </header>
  );
}

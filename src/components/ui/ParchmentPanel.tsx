import type { CSSProperties } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  icon?: string;
  style?: CSSProperties;
};

export function ParchmentPanel({ children, className = "", icon, style }: Props) {
  return (
    <section
      className={["parchment-panel", className].filter(Boolean).join(" ")}
      style={style}
    >
      {icon && <span className="panel-icon" aria-hidden="true">{icon}</span>}
      {children}
    </section>
  );
}

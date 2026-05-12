import Link from "next/link";

type Props = {
  href?: string;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  variant?: "primary" | "ghost";
};

export function OrnateButton({ href, children, className = "", type = "button", variant = "primary" }: Props) {
  const base = variant === "primary"
    ? "ornate-btn parchment"
    : "ornate-btn ornate-btn-ghost";
  const cls = [base, className].filter(Boolean).join(" ");
  const inner = (
    <>
      <span className="ornate-btn-deco" aria-hidden="true">✦</span>
      <span>{children}</span>
      <span className="ornate-btn-deco" aria-hidden="true">✦</span>
    </>
  );
  if (href) return <Link className={cls} href={href}>{inner}</Link>;
  return <button className={cls} type={type}>{inner}</button>;
}

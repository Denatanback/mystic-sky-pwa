type LogoVariant = "header" | "auth" | "hero";

const WIDTHS: Record<LogoVariant, string> = {
  header: "clamp(120px, 28vw, 180px)",
  auth:   "clamp(160px, 42vw, 260px)",
  hero:   "clamp(180px, 48vw, 300px)",
};

interface LogoProps {
  variant: LogoVariant;
  priority?: boolean;
}

export function Logo({ variant, priority = false }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/logo/eluna-logo-full.png"
      alt="Eluna"
      loading={priority ? "eager" : "lazy"}
      style={{
        display: "block",
        width: WIDTHS[variant],
        height: "auto",
        maxWidth: "100%",
        objectFit: "contain",
        objectPosition: "center",
        flexShrink: 0,
      }}
    />
  );
}

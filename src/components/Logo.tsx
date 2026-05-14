type LogoVariant = "header" | "auth" | "hero";

const WIDTHS: Record<LogoVariant, string> = {
  header: "clamp(96px, 24vw, 150px)",
  auth:   "clamp(120px, 34vw, 210px)",
  hero:   "clamp(150px, 42vw, 260px)",
};

interface LogoProps {
  variant: LogoVariant;
  priority?: boolean;
}

export function Logo({ variant, priority = false }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/logo/eluna-logo-cropped.png"
      alt="Eluna"
      loading={priority ? "eager" : "lazy"}
      style={{
        display: "block",
        width: WIDTHS[variant],
        height: "auto",
        objectFit: "contain",
        objectPosition: "center",
        flexShrink: 0,
        maxWidth: "100%",
      }}
    />
  );
}

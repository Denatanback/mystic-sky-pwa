import Image from "next/image";

type LogoVariant = "header" | "auth" | "hero";

interface LogoProps {
  variant: LogoVariant;
  priority?: boolean;
}

export function Logo({ variant, priority = false }: LogoProps) {
  return (
    <Image
      src="/assets/logo/eluna-logo-cropped.png"
      alt="Eluna"
      width={1242}
      height={200}
      className={`eluna-logo eluna-logo--${variant}`}
      priority={priority}
      style={{ width: undefined }} // let CSS class control width
    />
  );
}

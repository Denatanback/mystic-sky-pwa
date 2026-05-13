"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { appRoutes } from "@/lib/routes";
import { useLang } from "@/lib/i18n";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLang();
  return (
    <nav className="bottom-nav">
      {appRoutes.map(({ href, labelKey, icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        const label = t.nav[labelKey as keyof typeof t.nav];
        return (
          <Link key={href} href={href} className={`nav-item${active ? " active" : ""}`} aria-label={label}>
            <span className={`nav-dot${active ? " visible" : ""}`} />
            <span className={`nav-icon-wrap${active ? " active" : ""}`}>
              <Image src={icon} alt={label} width={36} height={36} style={{ objectFit: "contain" }} />
            </span>
            <span className="nav-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

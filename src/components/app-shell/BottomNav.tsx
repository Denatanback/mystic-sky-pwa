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
      <nav className="bottom-nav" aria-label="Primary navigation">
        {appRoutes.map(({ href, labelKey, icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          const isSky = href === "/sky";
          const isPractices = href === "/practices";
          const label = isPractices ? "Practices" : t.nav[labelKey as keyof typeof t.nav];
          const className = `nav-item${active ? " active" : ""}${isSky ? " nav-item--sky" : ""}`;
          const content = (
            <>
              <span className={`nav-dot${active ? " visible" : ""}`} />
              <span className={`nav-icon-wrap${active ? " active" : ""}`}>
                <Image src={icon} alt={label} width={isSky ? 38 : 34} height={isSky ? 38 : 34} style={{ objectFit: "contain" }} />
              </span>
              <span className="nav-label">{label}</span>
            </>
          );

          return (
            <Link key={href} href={href} className={className} aria-label={label}>
              {content}
            </Link>
          );
        })}
      </nav>
  );
}

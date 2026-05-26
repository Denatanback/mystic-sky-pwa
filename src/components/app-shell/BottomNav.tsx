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
          const isToday = href === "/today";
          const isPractices = href === "/practices";
          const label = isPractices ? "Practices" : t.nav[labelKey as keyof typeof t.nav];
          const className = `nav-item${active ? " active" : ""}${isToday ? " nav-item--primary" : ""}`;
          const content = (
            <>
              <span className={`nav-dot${active ? " visible" : ""}`} />
              <span className={`nav-icon-wrap${active ? " active" : ""}`}>
                {isToday ? (
                  <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v5" />
                    <path d="M12 16v5" />
                    <path d="M3 12h5" />
                    <path d="M16 12h5" />
                    <path d="m6.6 6.6 2.2 2.2" />
                    <path d="m15.2 15.2 2.2 2.2" />
                    <path d="m17.4 6.6-2.2 2.2" />
                    <path d="m8.8 15.2-2.2 2.2" />
                  </svg>
                ) : (
                  <Image src={icon} alt={label} width={34} height={34} style={{ objectFit: "contain" }} />
                )}
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

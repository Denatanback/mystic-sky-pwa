"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { appRoutes } from "@/lib/routes";

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav">
      {appRoutes.map(({ href, label, iconActive, iconInactive }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link key={href} href={href} className={`nav-item${active ? " active" : ""}`} aria-label={label}>
            <Image
              src={active ? iconActive : iconInactive}
              alt={label}
              width={28}
              height={28}
              style={{ objectFit: "contain" }}
            />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

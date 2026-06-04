import Link from "next/link";
import { SUPPORT_EMAIL_ADDRESS } from "@/lib/legal/legalContent";

type PolicyFooterLinksProps = {
  returnTo: string;
};

const links = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Billing", href: "/billing" },
  { label: "Refund", href: "/money-back" },
  { label: "Cancellation", href: "/cancellation" },
  { label: "Delivery", href: "/delivery" },
  { label: "Support", href: "/support" },
];

function legalHref(path: string, returnTo: string) {
  return `${path}?returnTo=${encodeURIComponent(returnTo)}`;
}

export function PolicyFooterLinks({ returnTo }: PolicyFooterLinksProps) {
  return (
    <nav
      aria-label="Legal and support links"
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "8px 12px",
        color: "var(--muted-2)",
        fontSize: 11,
        lineHeight: 1.5,
        marginTop: 14,
      }}
    >
      {links.map((link) => (
        <Link key={link.href} href={legalHref(link.href, returnTo)} style={{ color: "var(--gold-2)", fontWeight: 800, textDecoration: "none" }}>
          {link.label}
        </Link>
      ))}
      <a href="mailto:support@myeluna.com?subject=eLuna%20Support" style={{ color: "var(--gold-2)", fontWeight: 800, textDecoration: "none", overflowWrap: "anywhere" }}>
        {SUPPORT_EMAIL_ADDRESS}
      </a>
    </nav>
  );
}

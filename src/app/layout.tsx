import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Lora, Manrope } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { GuideProvider } from "@/components/guide/GuideProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700"],
});
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-ui",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});
const lora = Lora({
  subsets: ["latin", "cyrillic"],
  variable: "--font-reading",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Eluna",
  description: "Your personal star path -- daily insights, sky map, practices and journal.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Eluna", statusBarStyle: "black-translucent" },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png",   sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png",   sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icons/favicon-32.png",
  },
};
export const viewport: Viewport = {
  themeColor: "#070816",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${lora.variable}`}>
      <body>
        <LanguageProvider><GuideProvider>{children}</GuideProvider></LanguageProvider>
      </body>
    </html>
  );
}

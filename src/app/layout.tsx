import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
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
      { url: "/favicon.jpg", type: "image/jpeg" },
    ],
    apple: [
      { url: "/favicon.jpg", type: "image/jpeg" },
    ],
    shortcut: "/favicon.jpg",
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
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}

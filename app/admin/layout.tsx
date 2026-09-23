import type { Metadata } from "next";
import { site } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Admin", template: "%s | Admin" },
  description: "Portfolio content administration.",
  robots: { index: false, follow: false },
};

/**
 * Independent root layout for /admin (see Next.js "multiple root layouts").
 * Deliberately excludes the public site's Navbar/Footer/3D/cursor/loader —
 * the back office prioritizes clarity and speed over the marketing chrome.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-svh bg-bg font-sans text-fg antialiased">{children}</body>
    </html>
  );
}

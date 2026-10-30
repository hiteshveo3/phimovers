import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DEFAULT_OG_IMAGE, SITE } from "@/lib/seo";

// The app router only serves private screens now (staff /admin, customer /client, /auth, the /track
// redirect and the 404). The public site lives in pages/ with the kit shell, so this root layout adds no
// public chrome (the kit AppNav is the only tab bar) and loads the kit fonts instead of a second set.
const KIT_FONTS =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500&family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Phi Movers",
  description: "London removals, man and van, packing and storage across all 32 boroughs.",
  manifest: "/site.webmanifest",
  // Every app-router screen is private or an error page; layouts below may set their own titles.
  robots: { index: false, follow: false },
  openGraph: {
    siteName: "Phi Movers",
    locale: "en_GB",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Phi Movers" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#9fe870",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={KIT_FONTS} />
      </head>
      <body className="bg-base font-sans antialiased">{children}</body>
    </html>
  );
}

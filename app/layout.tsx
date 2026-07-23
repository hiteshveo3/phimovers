import type { Metadata } from "next";
import { Manrope, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-grotesk",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-serif",
  display: "swap",
});

const SITE = "https://phimovers.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Phi Movers — London removals across all 32 boroughs",
  description:
    "Professional, fully insured house and office removals, packing and storage across all 32 London boroughs. Get a free, fixed-price quote in minutes.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Phi Movers — London removals across all 32 boroughs",
    description:
      "Fully insured house & office removals, packing and storage across every London borough. Free fixed-price quotes.",
    url: SITE,
    siteName: "Phi Movers",
    locale: "en_GB",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, alt: "Phi Movers" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Phi Movers — London removals across all 32 boroughs",
    description:
      "Fully insured house & office removals, packing and storage across every London borough. Free fixed-price quotes.",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-base font-sans antialiased pb-16 lg:pb-0">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Phi Movers — London removals across all 32 boroughs",
  description:
    "Professional, fully insured house and office removals, packing and storage across all 32 London boroughs. Get a free, fixed-price quote in minutes.",
  openGraph: {
    title: "Phi Movers — London removals across all 32 boroughs",
    description:
      "Fully insured house & office removals, packing and storage across every London borough. Free fixed-price quotes.",
    type: "website",
  },
};

const themeScript = `
(function () {
  try {
    var t = localStorage.getItem('theme');
    var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (!t && m)) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-base font-sans antialiased pb-16 lg:pb-0">
        {children}
        <BottomNav />
      </body>
    </html>
  );
}

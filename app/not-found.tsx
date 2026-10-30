import type { Metadata } from "next";
import NotFound from "../kit/components/NotFoundPage";

// The same kit 404 as pages/404.tsx, so an unmatched URL looks the same whichever router answers it.
// DcPage's next/head tags do nothing in the app router; the title and noindex come from this metadata,
// and the kit fonts from app/layout.tsx.
export const metadata: Metadata = {
  title: "Page not found | Phi Movers",
  robots: { index: false, follow: false },
};

export default NotFound;

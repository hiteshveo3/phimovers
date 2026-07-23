import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { COMPANY, getLegalDoc } from "@/lib/legal";

const doc = getLegalDoc("cookies")!;

export const metadata: Metadata = {
  title: `${doc.title} — ${COMPANY.tradingName}`,
  description: doc.subtitle,
  alternates: { canonical: `${COMPANY.site}/${doc.slug}` },
};

export default function Page() {
  return <LegalPage doc={doc} />;
}

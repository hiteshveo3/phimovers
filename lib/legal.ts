import {
  PHONE_DISPLAY,
  PHONE_HREF,
  SITE_URL,
  COMPANY_LEGAL_NAME,
  EMAIL,
} from "@/lib/contact";

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "h3"; text: string }
  | { type: "note"; text: string };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  slug: string;
  icon: string;
  title: string;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
};

/* ---------------------------------------------------------------------------
 * Company details — UPDATE these with your real registered details before
 * going live (company number, VAT number, registered office and ICO ref).
 * ------------------------------------------------------------------------ */
export const COMPANY = {
  legalName: COMPANY_LEGAL_NAME,
  tradingName: "Phi Movers",
  companyNo: "12345678",
  vatNo: "GB 123 4567 89",
  address:
    "Phi Movers Ltd, 71–75 Shelton Street, Covent Garden, London, WC2H 9JQ, United Kingdom",
  emailGeneral: EMAIL,
  emailPrivacy: EMAIL,
  phoneDisplay: PHONE_DISPLAY,
  phoneHref: PHONE_HREF,
  site: SITE_URL,
  icoRef: "ZB123456",
};

export const UPDATED = "1 July 2026";

export const legalNav: { slug: string; label: string; icon: string }[] = [
  { slug: "privacy", label: "Privacy Policy", icon: "lock" },
  { slug: "cookies", label: "Cookie Policy", icon: "cookie" },
  { slug: "terms", label: "Terms & Conditions", icon: "doc" },
  { slug: "complaints", label: "Complaints Procedure", icon: "edit" },
  { slug: "accessibility", label: "Accessibility", icon: "accessibility" },
];

const MAILTO_PRIVACY = `<a class="font-semibold text-[#163300] underline" href="mailto:${COMPANY.emailPrivacy}">${COMPANY.emailPrivacy}</a>`;
const MAILTO_GENERAL = `<a class="font-semibold text-[#163300] underline" href="mailto:${COMPANY.emailGeneral}">${COMPANY.emailGeneral}</a>`;
const ICO_LINK = `<a class="font-semibold text-[#163300] underline" href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>`;

/* =========================================================================
 * PRIVACY POLICY
 * ====================================================================== */
const privacy: LegalDoc = {
  slug: "privacy",
  icon: "lock",
  title: "Privacy Policy",
  subtitle:
    "How Phi Movers collects, uses and protects your personal data when you use our website and removals services.",
  updated: UPDATED,
  sections: [
    {
      id: "who-we-are",
      title: "Who we are",
      blocks: [
        {
          type: "p",
          text: `This Privacy Policy explains how ${COMPANY.legalName} (trading as ${COMPANY.tradingName}, &ldquo;we&rdquo;, &ldquo;us&rdquo; or &ldquo;our&rdquo;) collects and uses your personal information when you visit ${COMPANY.site}, request a quote, or book a removal, packing or storage service with us.`,
        },
        {
          type: "p",
          text: `We are the &ldquo;data controller&rdquo; of your personal data under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.`,
        },
        {
          type: "ul",
          items: [
            `<strong>Registered company:</strong> ${COMPANY.legalName} (Company No. ${COMPANY.companyNo})`,
            `<strong>Registered office:</strong> ${COMPANY.address}`,
            `<strong>ICO registration:</strong> ${COMPANY.icoRef}`,
            `<strong>Data protection contact:</strong> ${MAILTO_PRIVACY}`,
          ],
        },
      ],
    },
    {
      id: "information-we-collect",
      title: "Information we collect",
      blocks: [
        {
          type: "p",
          text: "We only collect the information we need to give you an accurate quote and deliver your move safely. This may include:",
        },
        { type: "h3", text: "Information you give us" },
        {
          type: "ul",
          items: [
            "Contact details — your name, email address and phone number.",
            "Move details — collection and delivery addresses, property type, floor/access details, inventory of items, and preferred dates.",
            "Correspondence — messages you send us by email, phone, WhatsApp or our contact and quote forms.",
            "Payment information — processed securely by our payment provider; we do not store full card details on our systems.",
          ],
        },
        { type: "h3", text: "Information we collect automatically" },
        {
          type: "ul",
          items: [
            "Technical data — IP address, browser type, device information and operating system.",
            "Usage data — pages you visit, links you click and how you interact with the site.",
            "Cookies and similar technologies — see our <a class='font-semibold text-[#163300] underline' href='/cookies'>Cookie Policy</a> for full details.",
          ],
        },
      ],
    },
    {
      id: "how-we-use",
      title: "How we use your information",
      blocks: [
        {
          type: "p",
          text: "We use your personal data for the following purposes, each with a lawful basis under the UK GDPR:",
        },
        {
          type: "ul",
          items: [
            "<strong>To provide quotes and deliver your move</strong> — to prepare estimates, schedule crews and complete your removal (lawful basis: performance of a contract).",
            "<strong>To communicate with you</strong> — to answer enquiries, confirm bookings and send service updates (lawful basis: contract / legitimate interests).",
            "<strong>To take payment</strong> — to process deposits and balances (lawful basis: contract).",
            "<strong>To improve our website and services</strong> — analytics and service development (lawful basis: legitimate interests).",
            "<strong>For marketing</strong> — to send offers and news where you have opted in (lawful basis: consent). You can unsubscribe at any time.",
            "<strong>To meet legal obligations</strong> — accounting, tax and insurance requirements (lawful basis: legal obligation).",
          ],
        },
      ],
    },
    {
      id: "sharing",
      title: "Sharing your information",
      blocks: [
        {
          type: "p",
          text: "We never sell your personal data. We only share it with trusted parties who help us run our business, and only as far as necessary:",
        },
        {
          type: "ul",
          items: [
            "Our moving crews and vetted subcontractors who carry out your move.",
            "Payment processors to take secure payments.",
            "IT, hosting, analytics and communication providers who operate our systems.",
            "Insurers and professional advisers where required.",
            "Law enforcement or regulators where we are legally required to do so.",
          ],
        },
        {
          type: "note",
          text: "All our processors are bound by contracts that require them to protect your data and use it only for the purposes we specify.",
        },
      ],
    },
    {
      id: "transfers",
      title: "International transfers",
      blocks: [
        {
          type: "p",
          text: "We aim to keep your data within the UK and European Economic Area (EEA). Where a provider processes data outside these areas, we ensure appropriate safeguards are in place — such as UK adequacy regulations or the International Data Transfer Agreement (IDTA) / Standard Contractual Clauses.",
        },
      ],
    },
    {
      id: "retention",
      title: "How long we keep your information",
      blocks: [
        {
          type: "p",
          text: "We keep your personal data only for as long as necessary for the purposes it was collected:",
        },
        {
          type: "ul",
          items: [
            "Quote enquiries that don't lead to a booking — up to 12 months.",
            "Booking and job records — for the duration of our contract plus up to 6 years to meet accounting and legal requirements.",
            "Marketing data — until you unsubscribe or withdraw consent.",
          ],
        },
      ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      blocks: [
        {
          type: "p",
          text: "Under UK data protection law you have the following rights, which you can exercise free of charge:",
        },
        {
          type: "ul",
          items: [
            "<strong>Access</strong> — request a copy of the personal data we hold about you.",
            "<strong>Rectification</strong> — ask us to correct inaccurate or incomplete data.",
            "<strong>Erasure</strong> — ask us to delete your data where there is no legal reason to keep it.",
            "<strong>Restriction</strong> — ask us to limit how we use your data.",
            "<strong>Portability</strong> — receive your data in a portable format.",
            "<strong>Objection</strong> — object to processing based on legitimate interests or direct marketing.",
            "<strong>Withdraw consent</strong> — where we rely on consent, you can withdraw it at any time.",
          ],
        },
        {
          type: "p",
          text: `To exercise any of these rights, contact us at ${MAILTO_PRIVACY}. We will respond within one month.`,
        },
      ],
    },
    {
      id: "security",
      title: "How we protect your data",
      blocks: [
        {
          type: "p",
          text: "We use appropriate technical and organisational measures to keep your data secure, including encryption in transit (HTTPS), access controls, and staff training. While no online transmission is ever completely secure, we take every reasonable step to protect your information.",
        },
      ],
    },
    {
      id: "children",
      title: "Children's privacy",
      blocks: [
        {
          type: "p",
          text: "Our services are intended for adults. We do not knowingly collect personal data from children under 16. If you believe a child has provided us with data, please contact us and we will delete it.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: [
        {
          type: "p",
          text: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised &ldquo;last updated&rdquo; date. Significant changes will be communicated to you where appropriate.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact us & complaints",
      blocks: [
        {
          type: "p",
          text: `If you have any questions about this policy or how we handle your data, contact us at ${MAILTO_PRIVACY} or write to ${COMPANY.address}.`,
        },
        {
          type: "p",
          text: `You also have the right to complain to the Information Commissioner's Office (ICO), the UK regulator for data protection, at ${ICO_LINK} or by calling 0303 123 1113.`,
        },
      ],
    },
  ],
};

/* =========================================================================
 * COOKIE POLICY
 * ====================================================================== */
const cookies: LegalDoc = {
  slug: "cookies",
  icon: "cookie",
  title: "Cookie Policy",
  subtitle:
    "What cookies are, how Phi Movers uses them, and how you can control them.",
  updated: UPDATED,
  sections: [
    {
      id: "what-are-cookies",
      title: "What are cookies?",
      blocks: [
        {
          type: "p",
          text: "Cookies are small text files placed on your device when you visit a website. They help the site work, remember your preferences, and give us insight into how the site is used. Similar technologies such as pixels and local storage work in the same way, and we refer to all of them as &ldquo;cookies&rdquo; in this policy.",
        },
      ],
    },
    {
      id: "how-we-use",
      title: "How we use cookies",
      blocks: [
        {
          type: "p",
          text: "We use cookies to keep our website secure and running smoothly, to understand how visitors use it so we can improve it, and — with your consent — to measure the performance of our marketing.",
        },
      ],
    },
    {
      id: "types",
      title: "Types of cookies we use",
      blocks: [
        { type: "h3", text: "Strictly necessary cookies" },
        {
          type: "p",
          text: "These are essential for the website to function — for example remembering items in a quote or keeping the site secure. They cannot be switched off in our systems.",
        },
        { type: "h3", text: "Performance & analytics cookies" },
        {
          type: "p",
          text: "These help us count visits and traffic sources so we can measure and improve site performance. All information is aggregated and anonymous.",
        },
        { type: "h3", text: "Functional cookies" },
        {
          type: "p",
          text: "These remember choices you make (such as your region or preferences) to give you a more personal experience.",
        },
        { type: "h3", text: "Marketing cookies" },
        {
          type: "p",
          text: "These may be set by us or our advertising partners to build a profile of your interests and show you relevant ads. They are only used where you have given consent.",
        },
      ],
    },
    {
      id: "third-party",
      title: "Third-party cookies",
      blocks: [
        {
          type: "p",
          text: "Some cookies are placed by third parties that provide services on our behalf, such as analytics providers and, where enabled, advertising and social media platforms. These providers have their own privacy and cookie policies.",
        },
      ],
    },
    {
      id: "managing",
      title: "Managing your cookies",
      blocks: [
        {
          type: "p",
          text: "You can accept or reject non-essential cookies at any time through our cookie banner, where available. You can also control cookies through your browser settings:",
        },
        {
          type: "ul",
          items: [
            "Delete cookies already stored on your device.",
            "Block all or some cookies from being set.",
            "Set your browser to warn you before a cookie is stored.",
          ],
        },
        {
          type: "note",
          text: "Blocking strictly necessary cookies may mean parts of the website no longer work correctly.",
        },
      ],
    },
    {
      id: "do-not-track",
      title: "Do Not Track",
      blocks: [
        {
          type: "p",
          text: "Some browsers offer a &ldquo;Do Not Track&rdquo; (DNT) signal. As there is no common industry standard for DNT, we currently respond to it through the cookie preferences you set on our site.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: [
        {
          type: "p",
          text: "We may update this Cookie Policy as our website and the technologies we use change. Please check this page periodically for the latest version.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact us",
      blocks: [
        {
          type: "p",
          text: `Questions about our use of cookies? Email us at ${MAILTO_PRIVACY}. For more on how we handle personal data, see our <a class='font-semibold text-[#163300] underline' href='/privacy'>Privacy Policy</a>.`,
        },
      ],
    },
  ],
};

/* =========================================================================
 * TERMS & CONDITIONS
 * ====================================================================== */
const terms: LegalDoc = {
  slug: "terms",
  icon: "doc",
  title: "Terms & Conditions",
  subtitle:
    "The terms that apply when you use our website and book removals, packing or storage services with Phi Movers.",
  updated: UPDATED,
  sections: [
    {
      id: "about",
      title: "About these terms",
      blocks: [
        {
          type: "p",
          text: `These Terms &amp; Conditions form the agreement between you and ${COMPANY.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;). They apply to your use of ${COMPANY.site} and to any quote, booking or service you receive from us. By using our website or booking a service, you accept these terms.`,
        },
        {
          type: "p",
          text: "Please read them carefully and save a copy for your records. If anything is unclear, contact us before booking.",
        },
      ],
    },
    {
      id: "website",
      title: "Using our website",
      blocks: [
        {
          type: "p",
          text: "You may use our website for lawful purposes only. You agree not to misuse it, attempt to gain unauthorised access, or introduce anything harmful. Content on the site is provided for general information and may change without notice.",
        },
      ],
    },
    {
      id: "quotes",
      title: "Quotes & estimates",
      blocks: [
        {
          type: "p",
          text: "Quotes are based on the information you give us about your move. They are valid for the period stated and assume reasonable access at both addresses. If the actual job differs materially from what was described — for example extra items, difficult access, waiting time or parking restrictions — the price may be adjusted, and we will tell you before any additional charge applies where possible.",
        },
      ],
    },
    {
      id: "bookings",
      title: "Bookings, deposits & payment",
      blocks: [
        {
          type: "ul",
          items: [
            "A booking is confirmed once you accept your quote and we acknowledge it.",
            "A deposit may be required to secure your date; the balance is due as set out in your booking confirmation.",
            "We accept the payment methods shown at checkout. Prices include VAT where applicable.",
            "We reserve the right to withhold delivery of goods until outstanding payment is received.",
          ],
        },
      ],
    },
    {
      id: "your-responsibilities",
      title: "Your responsibilities",
      blocks: [
        {
          type: "p",
          text: "To help your move go smoothly and safely, you agree to:",
        },
        {
          type: "ul",
          items: [
            "Provide accurate details about your items, addresses and access.",
            "Arrange parking and any permits or lift bookings needed at both properties.",
            "Ensure items are ready and, unless you have booked our packing service, properly packed.",
            "Be present (or appoint someone) to give directions and check nothing is left behind.",
          ],
        },
        { type: "h3", text: "Items we cannot move" },
        {
          type: "p",
          text: "For safety and legal reasons we cannot transport certain items, including hazardous or flammable materials, illegal goods, perishable food, plants, or live animals. Please tell us in advance about high-value items so appropriate cover can be arranged.",
        },
      ],
    },
    {
      id: "our-service",
      title: "Our service",
      blocks: [
        {
          type: "p",
          text: "We will carry out your move with reasonable care and skill, using suitably trained crews. We will handle your belongings responsibly and aim to arrive within the agreed window. Timings are estimates and can be affected by traffic, weather and access.",
        },
      ],
    },
    {
      id: "liability",
      title: "Liability, insurance & claims",
      blocks: [
        {
          type: "p",
          text: "We carry Goods in Transit and Public Liability insurance. In the unlikely event of loss or damage caused by our negligence, our liability is limited as set out in your booking documentation and subject to the terms of our insurance.",
        },
        {
          type: "ul",
          items: [
            "Claims must be notified in writing as soon as possible, and normally within 7 days of delivery.",
            "We are not liable for damage to items packed by you (owner-packed cartons), unless caused by our negligence.",
            "We are not liable for indirect or consequential losses, or for delays outside our reasonable control.",
          ],
        },
        {
          type: "note",
          text: "Nothing in these terms limits your statutory rights as a consumer, or our liability for death or personal injury caused by our negligence.",
        },
      ],
    },
    {
      id: "cancellations",
      title: "Cancellations & rescheduling",
      blocks: [
        {
          type: "p",
          text: "You may cancel or reschedule your booking by contacting us. Charges may apply depending on how much notice you give, as set out in your booking confirmation. Where you have a statutory right to cancel under consumer regulations, we will honour it.",
        },
      ],
    },
    {
      id: "force-majeure",
      title: "Events outside our control",
      blocks: [
        {
          type: "p",
          text: "We are not responsible for failure or delay caused by events beyond our reasonable control, including severe weather, accidents, road closures, strikes or other force majeure events. If such an event occurs, we will contact you to arrange a new time.",
        },
      ],
    },
    {
      id: "ip",
      title: "Intellectual property",
      blocks: [
        {
          type: "p",
          text: "All content on our website — including text, logos, images and design — is owned by us or our licensors and is protected by law. You may not reproduce it without our permission.",
        },
      ],
    },
    {
      id: "governing-law",
      title: "Complaints & governing law",
      blocks: [
        {
          type: "p",
          text: `We hope you'll be delighted with your move. If something goes wrong, please see our <a class='font-semibold text-[#163300] underline' href='/complaints'>Complaints Procedure</a>. These terms are governed by the laws of England and Wales, and any disputes will be subject to the courts of England and Wales.`,
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      blocks: [
        {
          type: "p",
          text: "We may update these terms from time to time. The version that applies to your booking is the one in force when you place it. Continued use of our website means you accept the current terms.",
        },
      ],
    },
  ],
};

/* =========================================================================
 * COMPLAINTS PROCEDURE
 * ====================================================================== */
const complaints: LegalDoc = {
  slug: "complaints",
  icon: "edit",
  title: "Complaints Procedure",
  subtitle:
    "We take every concern seriously. Here's exactly how to raise a complaint and what you can expect from us.",
  updated: UPDATED,
  sections: [
    {
      id: "commitment",
      title: "Our commitment",
      blocks: [
        {
          type: "p",
          text: "We work hard to give every customer a smooth, stress-free move — but we know things can occasionally go wrong. When they do, we promise to listen, respond quickly and put things right fairly.",
        },
      ],
    },
    {
      id: "how-to-raise",
      title: "How to raise a complaint",
      blocks: [
        {
          type: "p",
          text: "Please get in touch as soon as possible so we can help. Include your booking reference, the date of your move and a clear description of the problem, along with any photos.",
        },
        {
          type: "ul",
          items: [
            `<strong>Email:</strong> ${MAILTO_GENERAL}`,
            `<strong>Phone:</strong> <a class='font-semibold text-[#163300] underline' href='${COMPANY.phoneHref}'>${COMPANY.phoneDisplay}</a>`,
            `<strong>Post:</strong> ${COMPANY.address}`,
          ],
        },
      ],
    },
    {
      id: "what-happens",
      title: "What happens next",
      blocks: [
        {
          type: "ul",
          items: [
            "<strong>Acknowledgement within 3 working days</strong> — we'll confirm we've received your complaint and who is handling it.",
            "<strong>Investigation</strong> — we'll look into what happened, speak to the crew involved and review the details.",
            "<strong>Full response within 14 working days</strong> — we'll explain our findings and any resolution. If we need more time, we'll tell you why and give a new date.",
          ],
        },
      ],
    },
    {
      id: "escalation",
      title: "If you're not satisfied",
      blocks: [
        {
          type: "p",
          text: "If our response doesn't resolve things, let us know and your complaint will be escalated to a senior manager for a final review. We'll always try to reach a fair outcome directly with you first.",
        },
      ],
    },
    {
      id: "adr",
      title: "Alternative dispute resolution",
      blocks: [
        {
          type: "p",
          text: "If we can't resolve your complaint between us, you may be able to refer it to an independent Alternative Dispute Resolution (ADR) scheme. We'll provide the relevant ADR details on request where a suitable scheme applies to your booking.",
        },
        {
          type: "note",
          text: "You can also seek free advice from Citizens Advice on 0808 223 1133 or via their consumer helpline.",
        },
      ],
    },
    {
      id: "contact",
      title: "Contact details",
      blocks: [
        {
          type: "p",
          text: `Complaints team — ${MAILTO_GENERAL} · <a class='font-semibold text-[#163300] underline' href='${COMPANY.phoneHref}'>${COMPANY.phoneDisplay}</a>. We're here to help.`,
        },
      ],
    },
  ],
};

/* =========================================================================
 * ACCESSIBILITY STATEMENT
 * ====================================================================== */
const accessibility: LegalDoc = {
  slug: "accessibility",
  icon: "accessibility",
  title: "Accessibility Statement",
  subtitle:
    "We want everyone to be able to use the Phi Movers website easily, whatever their ability or technology.",
  updated: UPDATED,
  sections: [
    {
      id: "commitment",
      title: "Our commitment",
      blocks: [
        {
          type: "p",
          text: "We are committed to making our website accessible and inclusive for all users, including people who rely on assistive technologies such as screen readers, keyboard navigation or screen magnification.",
        },
      ],
    },
    {
      id: "conformance",
      title: "Conformance status",
      blocks: [
        {
          type: "p",
          text: "We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. These guidelines explain how to make web content more accessible for people with disabilities. We regularly review our site against this standard.",
        },
      ],
    },
    {
      id: "measures",
      title: "What we do to support accessibility",
      blocks: [
        {
          type: "ul",
          items: [
            "Use clear, consistent layout and readable text with strong colour contrast.",
            "Provide descriptive text alternatives for meaningful images.",
            "Ensure the site can be navigated by keyboard and works with screen readers.",
            "Use semantic headings and labels so content is easy to follow.",
            "Design responsively so the site works on phones, tablets and desktops.",
          ],
        },
      ],
    },
    {
      id: "limitations",
      title: "Known limitations",
      blocks: [
        {
          type: "p",
          text: "Despite our best efforts, some content may not yet be fully accessible — for example certain third-party embeds or older documents. We are working to fix these. If you find a barrier, please tell us so we can prioritise it.",
        },
      ],
    },
    {
      id: "compatibility",
      title: "Compatibility",
      blocks: [
        {
          type: "p",
          text: "Our website is designed to work with recent versions of major browsers (Chrome, Edge, Firefox and Safari) and common assistive technologies. Using the latest version of your browser and assistive software will give the best experience.",
        },
      ],
    },
    {
      id: "feedback",
      title: "Feedback & contact",
      blocks: [
        {
          type: "p",
          text: `If you have trouble accessing any part of our website, or need information in a different format, please contact us at ${MAILTO_GENERAL} or call <a class='font-semibold text-[#163300] underline' href='${COMPANY.phoneHref}'>${COMPANY.phoneDisplay}</a>. We aim to respond within 5 working days.`,
        },
      ],
    },
    {
      id: "enforcement",
      title: "Enforcement",
      blocks: [
        {
          type: "p",
          text: "If you contact us with a complaint about accessibility and are not happy with our response, you can contact the Equality and Human Rights Commission (EHRC), which is responsible for enforcing accessibility standards in the UK.",
        },
      ],
    },
    {
      id: "statement",
      title: "About this statement",
      blocks: [
        {
          type: "p",
          text: `This statement was last reviewed on ${UPDATED}. We review it regularly as we improve the site.`,
        },
      ],
    },
  ],
};

export const legalDocs: Record<string, LegalDoc> = {
  privacy,
  cookies,
  terms,
  complaints,
  accessibility,
};

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs[slug];
}

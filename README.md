# Phi Movers

London removals website, staff dashboard and client portal for Phi Movers (phimovers.co.uk).
Next.js 14, React 18, Firebase (Auth + Firestore). The Android app lives in the sibling folder `../phimovers-app`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

Copy `.env.example` to `.env.local` and fill what you need. Everything optional is switched off when its value is empty.

## How it is organised

```
pages/    Public site (Pages Router): /, /services, /areas, /blog, /pricing, /reviews, /contact, legal pages
app/      Staff dashboard (/admin), client portal (/client), auth, API routes, sitemap, robots
kit/      The shared UI kit: header, footer, mobile tab bar, cookie card, blocks, price calculator, assistant
lib/      Content and data: services, areas, blog, reviews, legal, SEO, leads, Firebase
components/admin, components/client   Dashboard and portal components
docs/     Firebase ops, dashboard, Flutter app notes
```

Business facts (phone, email, address, rates, hours) are set once in `lib/contact.ts` and `kit/site-facts.ts`.
Every public page is wrapped in `DcPage` (`kit/components/DcPage.tsx`).

## Features

- Quote requests are saved as leads in Firestore and shown live in `/admin`.
- `/admin`: overview, leads (list and board), calendar, invoices (PDF), settings. See `docs/ADMIN_DASHBOARD.md`.
- Invoice PDFs use the "Ticket" layout from Alpha Movers (Figtree fonts in `lib/admin/fonts`, bank card, remittance slip, legal footer). Bank details: `INVOICE_BANK_*` env; company number: `COMPANY_NUMBER` in `lib/contact.ts`.
- A booking marked Completed gets a draft invoice automatically (`lib/admin/invoice-auto.ts`); jobs completed in the app are drafted when `/admin/invoices` opens.
- "Ask AI" on the dashboard answers questions about live leads, bookings and invoices (Gemini), and drafts payment reminders from an invoice. `/admin/chats` shows and exports the "Ask Phi" chats.
- Two-step sign-in (authenticator app, backup codes, trusted browsers) is opt-in per staff member in Settings. Publish the updated `firestore.rules` so the data checks it too.
- WhatsApp sits next to Get a quote everywhere, plus a floating button (`kit/components/WhatsApp.tsx`).
- `/client`: customers follow their quotes.
- "Ask Phi" assistant: needs `GEMINI_API_KEY` and a Firebase service account; otherwise it shows call and email options.
- Analytics stays off until `NEXT_PUBLIC_GA_ID` is set and the visitor accepts cookies.

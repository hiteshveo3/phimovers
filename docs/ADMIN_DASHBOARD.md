# Staff dashboard (`/admin`)

Alpha-style staff dashboard for Phi Movers. Everything lives under `/admin` (App Router) and is isolated from the public pages: the design tokens and fonts are injected by `app/admin/layout.tsx` from `lib/admin/admin-css.ts`, so they only exist while `/admin` is mounted.

## Screens
| URL | What |
| --- | --- |
| `/admin` | Overview: KPIs, pipeline, leads-over-time chart (14/30 days), top pages/sources, top services, recent leads with quick actions |
| `/admin/leads` | List + Board (Kanban) toggle, search, status/urgent/mine/unassigned filters, CSV export, bulk "mark contacted" |
| `/admin/leads/[id]` | Lead detail: call / SMS / email, message templates, status, quote, move date, assignee, notes, activity, "Create invoice" |
| `/admin/jobs` | Calendar: booked moves by week (optionally quoted too) |
| `/admin/invoices` | Invoices: create from a lead (`?lead=<id>`), items, discount, optional VAT (off by default), optional 40 GBP deposit, payments, PDF |
| `/admin/settings` | Account, new-lead sound toggle, staff list, CSV export, security status |
| `/admin/login` | Staff sign-in (Google or email, staff allowlist kept) |

Phone layout: top bar + bottom tab bar (Home, Leads, Jobs, Invoices, More). Wide screens: collapsible sidebar.

WhatsApp is removed from the admin and the client portal; replies are Call / SMS (`sms:`) / Email (`mailto:`).

## Invoices
* Stored in the Firestore collection `invoices` (staff only, see `firestore.rules`; no composite index needed, it is ordered by `createdAt` only).
* Numbers are `PHI-INV-<year>-0001`, one more than the highest of that year.
* PDF: `POST /api/admin/invoices/pdf` (`app/api/admin/invoices/pdf/route.ts`). It verifies the Firebase ID token with the Admin SDK and requires the `staff` claim or an allowlisted, verified staff email (`lib/admin/require-staff.ts`, `lib/admin/claims.ts`). Totals/status are recomputed on the server. Needs `FIREBASE_SERVICE_ACCOUNT_JSON` (server only).
* Bank details are never hard-coded. Set the server-only env `INVOICE_BANK_DETAILS` (plain text, `\n` or real new lines) to print a "How to pay" box on the PDF. Empty by default, so the box is omitted.
* Business name, phone, email and address come from `kit/site-facts.ts`.
* Model/maths: `lib/admin/invoice-model.ts` (pure). PDF builder: `lib/admin/invoice-pdf.ts` (pdf-lib). Browser service: `lib/admin/invoices.ts`.

## Deploy checklist
1. Publish `firestore.rules` (adds the `invoices` staff-only rule).
2. Set `FIREBASE_SERVICE_ACCOUNT_JSON` (already needed for `sync-claims`) and optionally `INVOICE_BANK_DETAILS`.
3. `NEXT_PUBLIC_ADMIN_EMAILS` for extra staff (owner email is always allowed).

## Demo mode (development only, default OFF)
Preview the logged-in UI without Firebase keys, using sample leads and invoices held in memory (nothing is saved):

* set `NEXT_PUBLIC_ADMIN_DEMO=1` and restart `npm run dev`, or
* without a restart, on localhost run in the browser console: `localStorage.setItem("phi-admin-demo","1")` and reload `/admin` (remove it with `localStorage.removeItem("phi-admin-demo")`).

Both are ignored in production builds (`NODE_ENV === "production"`). With the env flag the PDF route skips the token check in development only; otherwise PDFs need the real service account.

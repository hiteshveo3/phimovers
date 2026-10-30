# Phi Movers — 404 upgrades taken from Alpha Movers

Compiled 21 October 2026 from a side-by-side code comparison of:

- **Alpha (reference):** `C:\Alpha Movers Website\alpha-movers-website-main` (site, booking, admin, API),
  `C:\Alpha Movers Website\alpha-movers-app` (Flutter app + `functions/`) and `alpha-movers-android` (store listing).
- **Phi (target):** this repo, working tree on branch `alpha-ui-port` (uncommitted), and the sibling Flutter app
  `..\phimovers-app`.

Phi already carries most of Alpha's public shell in `kit/` as identical copies (`SiteHeader`, `blocks-css.ts`,
`PageKit.tsx`, `HomeMotion.tsx`, `FleetArt.tsx`, `Illustrations.tsx`, the AppNav tab bar and sheet, Ctrl/⌘K search,
cookie consent, the WhatsApp buttons, the Ask assistant panel). Those are listed once under *Already in Phi — keep*
and are not repeated as points.

**What carries over:** layout, components, behaviour, motion, flows, admin features, backend rules.
**What does not:** Alpha's facts. Every phone number, email, address, hour, rate, rating, insurance figure and
policy comes from Phi's own `kit/site-facts.ts` / `lib/contact.ts`. Nothing here asks anyone to invent a fact.

## How to read this

- **P1** (67) — a live bug, lost leads, wrong facts, or a security hole. Do first.
- **P2** (265) — do in the next release.
- **P3** (72) — polish.
- *needs owner* (44) — needs a fact, photo, link, account or decision only the owner has.
- After each point, `Alpha:` names the file, component or rule it comes from (or the Alpha audit item).
- Paths without a prefix are in this repo; `app/…` in `..\phimovers-app` is marked *(app)*.

## Status — 21 October 2026

List written; nothing below has been worked through yet. The invoice work running in a parallel session
(`app/admin/invoices`, `lib/admin/invoice-*`) may close some of section T. Re-check a point against the code
before starting it — the Phi tree was changing while this list was compiled.

## The 30 to do first

263 · 264 · 253 · 242 · 383 · 384 · 1 · 2 · 3 · 5 · 46 · 71 · 131 · 201 · 202 · 187 · 188 · 122 · 193 · 207 · 208 · 174 · 213 · 299 · 300 · 301 · 279 · 321 · 332 · 360

In short: stop the quote form losing leads and stop the browser setting prices; fix the facts that are wrong
(review links, rating count, deposit message, Alpha's manifest); add real photos; clean the sitemap and schema;
add security headers; give customers a public `/book` page and booking emails; make staff 2FA mandatory and move
invoice saving and numbering to the server.

## Already in Phi — keep

Alpha's BASE_CSS tokens, palette, fonts (Bricolage / Instrument Sans / IBM Plex Mono) and tabular numerals; the
header with utility strip, scroll shrink, OpenNow and search; services and areas mega menus; tab bar and menu sheet
with safe areas; floating WhatsApp; the footer wordmark; homepage hero shell, `Words`, `Odo`, regions rows,
`PriceExplorer`, `FleetArt` vans; services-index search and chips; `FaqList` + FAQPage schema; blog index, contents
rail and side card; cookie consent; `NotFoundPage`; breadcrumbs and canonicals from `DcPage`; click tracking in
`GoogleAnalytics.tsx`; the Ask assistant with voice, live voice, read-aloud, photos, saved chats and signed prices;
the office AI assistant and AI invoice reminder; a richer booking lifecycle than Alpha (accepted / en route / in
progress); leads Kanban, SLA badges, crew management, services/price editor, weekly calendar; chats export;
Google sign-in and password reset for customers; release signing that fails without a key and `allowBackup=false`
in the app.

---

## A. Business facts and honesty (1–14)

Alpha keeps every claim in one facts file and shows only what can be checked. Phi has the file but several facts are
missing, copied or inconsistent.

1. **P1** Replace `GOOGLE_REVIEWS` (today the same URL as `GOOGLE_DIRECTIONS`) with the real Google Business Profile review link. — Alpha: `src/site-facts.ts` `GOOGLE_REVIEWS`. *needs owner*
2. **P1** Make the rating honest: `RATING` says 4.9 from 148 while the site holds about 10 reviews. Use the count shown on the Google profile, or the count you can show. — Alpha: site-facts comment "only confirmed facts". *needs owner*
3. **P1** Decide one deposit policy. `PhiCalculator` and site-facts say "£40 deposit to book", the office AI prompt repeats it, and the booking form says "Nothing is charged now". — Alpha: one message everywhere ("pay after the job"). *needs owner*
4. **P2** Fill `COMPANY_NUMBER` in `lib/contact.ts` and export `COMPANY_NO` + `COMPANIES_HOUSE_URL` from `kit/site-facts.ts`. — Alpha: `COMPANY_NO`. *needs owner*
5. **P1** Add the insured amount (goods in transit, public liability) as `INSURANCE` and use it in `insuredChip`, `CLOSING_FACTS` and the trust line instead of "Fully insured". — Alpha: `INSURANCE.goodsInTransit`. *needs owner*
6. **P1** Add `CANCELLATION` / `CANCELLATION_TEXT` and read it on pricing, FAQ, terms and booking; today the pricing card hard-codes it. — Alpha: site-facts `CANCELLATION`. *needs owner*
7. **P2** Add a `NEVER_CHARGED` list only if it is true for Phi (stairs, weekends, ULEZ…), or leave it out on purpose. — Alpha: `NEVER_CHARGED`. *needs owner*
8. **P2** Add `BOOKING_POLICIES` (billing step, notice, cancellation, cover) to site-facts and show them at booking. — Alpha: `src/booking/model.ts` `BOOKING_POLICIES`.
9. **P2** Add `TRUSTPILOT` (if Phi has a profile) next to `GOOGLE_REVIEWS`. — Alpha: site-facts `TRUSTPILOT`. *needs owner*
10. **P2** Remove hard-coded prices from prose in `kit/components/ServiceDetail.tsx` ("£55 sofa", "£50/hour") and read `RATES` / `HELPER_RATE`. — Alpha: `rateLine`, `HOIST`.
11. **P2** Build the OpenNow text ("until 9pm / opens 7am") and `CtaNote` ("7am–9pm") from `HOURS` / `HOURS_TEXT`. — Alpha: `OpenNow.tsx`.
12. **P2** Pick one host (`www.` or apex) and use it in `kit/site-facts.ts`, `lib/contact.ts`, `app/robots.ts`, `app/sitemap.ts` and Vercel. — Alpha: `SITE = https://www.alphamovers.co.uk` everywhere.
13. **P2** Delete or derive `lib/data.ts` prices ("Studio from £299", "2-Bed from £499") and its picsum images; they disagree with `RATES`. — Alpha: one source in site-facts.
14. **P2** Add Phi's real social profiles (Facebook, Instagram, TikTok, YouTube…) as constants for the footer and `sameAs`. — Alpha: site-facts socials. *needs owner*

## B. Design system and base CSS (15–24)

15. **P2** Fold `ServiceDetail` SV_CSS shadows (`0 1px 3px`, `0 1px 2px`) into the one shadow token. — Alpha: `docs/premium-minimal-100.md` #4–6.
16. **P2** Fold `PhiCalculator` PHI_CALC_CSS radii into the radius scale. — Alpha: premium-minimal #5.
17. **P2** Restyle public `/track` with kit tokens, or move it into `pages/`; it uses the old Tailwind/Manrope system in `app/globals.css`. — Alpha: one design system only.
18. **P2** Stop loading Manrope and Source Serif in `app/layout.tsx` for public routes; use the kit fonts. — Alpha: `_document.tsx` fonts only.
19. **P3** Self-host the three fonts as woff2 under `/public/brand/fonts/`. — Alpha: premium-minimal #3.
20. **P2** Drop `components/BottomNav.tsx` and `BodyPad.tsx` from `app/layout.tsx` on public routes; use kit `AppNav`. — Alpha: one tab bar.
21. **P3** Remove `@hugeicons/*` from `transpilePackages` and dependencies once app routes no longer use it; the kit uses iconsax. — Alpha: one icon set.
22. **P2** Pin `@hugeicons/core-free-icons` (today `"latest"`) until it is removed. — Alpha: pinned versions.
23. **P3** Write `docs/DESIGN.md` for Phi (tokens, card and chip types, motion tiers, do-not list) so later ports stay on system. — Alpha: house rules at the top of `DcPage.tsx` and `blocks-css.ts`.
24. **P3** Keep internal links slash-free consistently (Phi has no `trailingSlash`); sweep leftovers such as `/book/`. — Alpha: `trailingSlash: true`, applied everywhere.

## C. Header, menus, phone chrome, footer (25–44)

25. **P2** Fix the primary CTA's `aria-current={current('/contact#quote')}` — a pathname never contains `#`; compare with `/contact` (or `/book` once it exists). — Alpha: `SiteHeader.tsx` `current('/book/')`.
26. **P2** Point the header primary button at the public booking page once N-section `/book` exists. — Alpha: header "Book" → `/book/`.
27. **P3** Add the calculator page to the header search index `SITE_PAGES` when it exists (today `/pricing#calculator`). — Alpha: `SITE_PAGES` "calculator estimate".
28. **P2** Give "Central London" in the areas mega menu a real page instead of `/areas#central`. — Alpha: region hub `/areas-we-cover/central-london/`.
29. **P2** Add "My quotes" (`/client`) and "Track" (`/track`) to the AppNav menu sheet; its comment says they are there but they are not. — Alpha: sheet link `/my-bookings/`.
30. **P2** Check the floating WhatsApp button does not overlap the `AssistantLauncher` on phones. — Alpha: `.am-wa` stacked above the launcher.
31. **P2** Cap the service sticky bar `.sv-nav` at five links (today 10+). — Alpha: `enhance-service.ts` `sectionNav`.
32. **P2** Raise `.sv-nav a` tap targets from 34px to 44px. — Alpha: premium-minimal #89.
33. **P1** Fix the footer Help column "Get a quote" link to `/book`, which 404s today. — Alpha: footer links to live routes only.
34. **P2** Footer trust line: add company number, insured amount, Google rating link and Trustpilot. — Alpha: `.dc-foot-trust`. *needs owner*
35. **P2** Footer "Fully insured" links to `/terms`; link it to the new `/insurance` page. — Alpha: footer → `/insurance/`.
36. **P1** Footer social row: Phi shows Google Maps only; add the real profiles from item 14. — Alpha: footer socials. *needs owner*
37. **P1** Footer About block: add the legal company name and company number. — Alpha: "Company no., registered 2026". *needs owner*
38. **P2** Footer Company column: add Insurance, Trust & verification and Customer care. — Alpha: `SiteFooter` Company column.
39. **P2** Footer: add a "Site map" link to `/all-pages`. — Alpha: footer → `/all-pages/`.
40. **P2** Footer: add "My bookings" and "Delete account" links once those pages exist. — Alpha: footer Help column.
41. **P3** Focus header (booking pages): match Alpha's minimal header with back link and phone. — Alpha: `FocusHeader` in `book.tsx`.
42. **P3** Announcement band editable by the office, shown under the header on site and app. — Alpha: app `announcement_sheet.dart`, `announcement_band.dart`.
43. **P3** Account menu on phones as a drawer with Esc, scroll lock and `aria-modal`; check `ClientShell`. — Alpha: `my-bookings.tsx` drawer.
44. **P3** Show the signed-in customer's name / "My bookings" in the header when logged in. — Alpha: header session chip.

## D. Homepage (45–60)

45. **P2** H1 with the from-price: "Removals and man and van in London from £{RATES[0].hourly}/hr" with `Odo`. — Alpha: hero H1 "… from £90".
46. **P1** Crew avatars strip uses review avatars labelled as crew — misleading. Use real Phi crew/van photos or remove it. — Alpha: `/alpha-movers-webp/crew/crew-1..5.webp`. *needs owner*
47. **P2** Offer pill: replace "Fully insured · all 32 boroughs" with a concrete Phi promise (fixed quote, first 10 miles free). — Alpha: `ih-offer`.
48. **P3** Consider dropping the `ih-hero-cta` button row; Alpha's hero is search + trust chips only. — Alpha: premium-minimal #23.
49. **P2** Hero trust chips: add the insured amount once confirmed. — Alpha: hero chips. *needs owner*
50. **P2** Services section: benefit title and one-line lead instead of "Our services". — Alpha: "Every London move, one accountable crew".
51. **P3** "How it works" eyebrow "Simple 3-Step Process" → sentence case. — Alpha: sentence-case eyebrows.
52. **P3** Consider a fourth step (on the day / after) to match Alpha's ring. — Alpha: four-step ring.
53. **P2** Vans section: add a "Prices by van" link to `/pricing`. — Alpha: vans "Prices by van".
54. **P2** Reviews section: Google score card with `Odo`, linking out to the profile. — Alpha: two score cards. *needs owner*
55. **P2** Reviews section: Trustpilot card if Phi has a profile. — Alpha: Trustpilot card. *needs owner*
56. **P2** FAQ: link "More answers" to the new help page. — Alpha: → `/customer-care/`.
57. **P1** Closing panel: add the WhatsApp button (zero `WHATSAPP_URL` uses in `pages/index.tsx`). — Alpha: closing panel Book + WhatsApp.
58. **P2** Closing panel: "or call … 7am to 9pm" with hours from `HOURS_TEXT`. — Alpha: closing "or call".
59. **P2** Homepage title and description: include the from-price and rating. — Alpha: "House Removals & Man and Van London from £90 | Alpha Movers".
60. **P3** "Where we work most" featured boroughs block on the homepage areas section. — Alpha: homepage areas.

## E. Services index and service pages (61–84)

61. **P2** Services index: three photo cards for the most-booked services with price. — Alpha: `.sv-top`, `.sv-card-price`.
62. **P2** Services index: "What every job includes" four cards. — Alpha: `.sv-incl`.
63. **P2** Services index: "Not sure which one you need?" block → calculator. — Alpha: services index closing block.
64. **P1** Services index: read `?q=` into the search box; the WebSite `SearchAction` points there and the page ignores it. — Alpha: search reads query.
65. **P2** Service hero live price card: van segments, hours stepper, live total; "Quoted on the call" for quote-only services. — Alpha: `enhance-service.ts` `priceCardHtml`.
66. **P2** "What it costs" table built from site-facts instead of prose prices. — Alpha: `costTableHtml`.
67. **P2** Tick lists: show four, rest in `<details>`. — Alpha: `shortChecks`.
68. **P2** "Before you book" card per service family (parking, lift, boxes). — Alpha: `beforeYouBook`.
69. **P2** One CTA per card: hero, `InlineCta`, `SideCard`, `CtaBand`, `#quote` and `.sv-nav-book` all say "Get a quote"; drop mid-page duplicates, make call a text link. — Alpha: `demoteCtas`.
70. **P2** Hero trust chips: add a lime "from £X" price chip. — Alpha: service hero chips.
71. **P1** Add real photos for every service slug in `/public/services/` (only `house-removal(s).jpg` exist; others show the icon fallback). — Alpha: `Photo` per service. *needs owner*
72. **P2** Related services: hairline text rows, or fix their broken photos. — Alpha: premium-minimal #42.
73. **P2** Service schema `provider`: reference `{ '@id': SITE + '/#business' }` instead of an inline `MovingCompany`. — Alpha: one entity `@id`.
74. **P2** Service CTAs carry the service into `/book?service=`. — Alpha: `bookLinks`.
75. **P1** Show "Quoted on the call" instead of a total for office, packing, storage and similar services. — Alpha: `SERVICES` pricing mode `quote`.
76. **P2** Hoist services: price range and floor choice from a `HOIST` constant, if Phi offers hoisting. — Alpha: `HOIST`, `HOIST_FLOORS`. *needs owner*
77. **P3** Flagship long-form house-removals page with 13 sections and a table. — Alpha: `/services/house-removals-london/`.
78. **P2** Service FAQs from one `page-faqs` lookup (see item 127). — Alpha: `getFaqsForPath`.
79. **P2** Service pages link to related guides in prose. — Alpha: `linkGuidesInProse`.
80. **P3** Reduced-motion rule for `ServiceDetail` transitions. — Alpha: blocks-css reduced motion.
81. **P2** `og:image` per service from its photo. — Alpha: per-page OG.
82. **P2** Specialist service pages (`lib/seoSpecialist*.ts`) use the same price card and cost table. — Alpha: one service template.
83. **P3** Service page "Typical job" worked example (hours × van). — Alpha: service cost examples.
84. **P3** Service pages end with nearby boroughs for that service. — Alpha: area-service cross links.

## F. Pricing and calculator (85–104)

85. **P1** One calculator: homepage uses `PriceExplorer`, `/pricing` uses `PhiCalculator`. Merge them. — Alpha: `PriceExplorer` on both; premium-minimal #52.
86. **P1** One price model for calculator, booking and chat (today three: `estimate.ts` ranges, `PhiCalculator` mileage + extras, `priceFor()` without mileage). — Alpha: `estimate.ts` + `quote()` from `RATES`.
87. **P1** `/pricing` reads `?van=&hours=&helpers=` — the share link from `PriceExplorer` points there and is ignored. — Alpha: pricing reads its share params.
88. **P2** Rename the calculator localStorage key `am-calc` to `phi-calc`. — Alpha's own key.
89. **P1** Calculator → quote/book link carries van, hours and helpers (today `/contact#quote` drops them, and nothing reads `am-calc`). — Alpha: `/book/?hours&van`.
90. **P2** "Hours and totals" table, two to eight hours. — Alpha: pricing `#rate-card`.
91. **P2** "Price your job" picker ("What are you moving?"). — Alpha: pricing `#your-job`.
92. **P2** "Typical London moves" tiles from `RATES`. — Alpha: `#typical`, `pp-tiles`.
93. **P2** "What moves the price" (stairs, distance, parking, packing). — Alpha: `#changes`.
94. **P2** "Starting prices for every service" from the catalogue `shortPrice`. — Alpha: `#services`, `pp-groups`.
95. **P2** Explicit "Included / quoted separately" split. — Alpha: `pp-covers`.
96. **P2** Payment section with Phi's real terms and a Mon–Sun open row. — Alpha: `pp-pay`, `pp-days`. *needs owner*
97. **P2** Pricing hero from-price with `Odo`. — Alpha: `pp-range`, `pp-facts`.
98. **P2** 30-minute overrun billing example under the hour bars. — Alpha: `PricingBlocks.tsx` `OverrunExample`.
99. **P2** `/moving-cost-calculator` step wizard, or delete the unused `kit/estimate.ts`. — Alpha: `moving-cost-calculator.tsx` (`StepDots`, `Picks`, breakdown).
100. **P2** Mileage beyond the free miles in booking and chat too, or remove it from the calculator. — Phi's own `FREE_MILES`, `PER_MILE`.
101. **P2** Hoist range in the estimate if hoisting is offered. — Alpha: `estimate.ts` `EXTRAS`. *needs owner*
102. **P3** Reduced-motion rule for PHI_CALC_CSS. — Alpha: blocks-css.
103. **P2** Pricing FAQ from site-facts (deposit, cancellation, payment). — Alpha: pricing FAQ.
104. **P3** Pricing page `aria-live` total kept after the merge. — Alpha: calculator `aria-live`.

## G. Areas and towns (105–118)

105. **P2** Areas index: "Where we work most" featured boroughs block. — Alpha: areas index.
106. **P2** Region hub pages with their own template (borough list, nearest boroughs, typical move) for central, east, north, south and west. — Alpha: `src/region-hubs.ts`.
107. **P1** Add `/areas/central-london`; today the region links to `/areas#central`. — Alpha: `/areas-we-cover/central-london/`.
108. **P2** Move "Leamington Spa" and "Warwick" out of London "Regions & Key Hubs" in `lib/areas.ts` `areaRegions` into `/removals` towns. — Alpha: London-only regions.
109. **P2** Borough pages: `MapEmbed` or a static map image. — Alpha: Ilford page map; premium-minimal #49.
110. **P2** Borough pages: hero photo (local or van). — Alpha: borough `Photo`. *needs owner*
111. **P2** Borough pages: "Typical move here" price table from `RATES`. — Alpha: Ilford `dc-table`.
112. **P3** Borough pages: "Moving out of X, or into it" section. — Alpha: borough in/out section.
113. **P2** Borough × service pages: reuse the hero price card (item 65) and cost table (item 66). — Alpha: `build-area-phi-html` + `enhanceServicePage`.
114. **P1** Sitemap lists all ~990 combos; list only evidence-backed combos (`EVIDENCE_BACKED_COMBOS`) and noindex or leave out the thin rest. — Alpha: `publicSitePages`, canonical-equals-path rule.
115. **P2** Area schema `provider` → `/#business` `@id` instead of inline `MovingCompany` (`pages/areas/[borough].tsx`, `pages/removals/*`). — Alpha: one entity.
116. **P2** Hand-written flagship page for Phi's home borough (`/areas/barking-and-dagenham`): map, photo, prices, local parking. — Alpha: Ilford flagship page. *needs owner*
117. **P3** Town pages (`lib/towns/*`) checked for thin, near-duplicate copy before they are indexed. — Alpha: `location_mismatch_audit.csv`.
118. **P3** Delete `new_areas.ts.txt` and `gen_script.js` after their output is merged. — Alpha: no generator leftovers in repo root.

## H. Reviews and FAQ (119–130)

119. **P2** Review-source links (Google, Trustpilot) on the reviews page. — Alpha: `.rv-links`. *needs owner*
120. **P2** "What people mention most" themes from Phi reviews (add tags to `kit/reviews.ts`). — Alpha: `REVIEW_THEMES`.
121. **P2** Honest source line: say where the reviews come from and that they are unedited. — Alpha: reviews lead.
122. **P1** Remove self-served `Review` + `AggregateRating` markup from `pages/reviews.tsx` (count = page reviews, while `lib/seo.ts` says 148). — Alpha: removed, `seo-audit-100-metrics.md` #69.
123. **P1** Check `/public/reviews/*.jpg` avatars are real customers; otherwise use `initials()`. — Alpha: removed synthetic faces, audit #59/#96. *needs owner*
124. **P2** Reviews moderation in admin (approve / hide). — Alpha app: `reviews_tab.dart`.
125. **P2** Review request link after a completed job points to the real Google review URL. — Alpha: booking done → Google reviews.
126. **P3** "Show all N questions" on long FAQ lists. — Alpha: homepage FAQ.
127. **P2** One `lib/page-faqs.ts` lookup mapping FAQs to paths so visible FAQs and schema stay together. — Alpha: `src/page-faqs.ts` `getFaqsForPath`.
128. **P2** FAQ / help hub page (`/help`) collecting the answers. — Alpha: `/customer-care/`.
129. **P2** Booking FAQ block on the booking page. — Alpha: `book.tsx` `FAQS`.
130. **P3** FAQ answers that quote facts read them from site-facts (deposit, hours, cover). — Alpha: FAQ built from facts.

## I. Blog (131–145)

131. **P1** Add cover images: `blogCover()` returns `/blog/{cover}.jpg` and `public/blog/` does not exist, so every card shows the fallback and `og:image` 404s. — Alpha: blog covers. *needs owner*
132. **P2** "Key takeaways" box on articles (`takeaways` field). — Alpha: `BlogDataArticle` `takeaways`.
133. **P2** Published and updated dates shown, with `dateModified` in schema. — Alpha: blog article dates.
134. **P2** FAQs per post with FAQPage schema. — Alpha: `post.faqs`.
135. **P2** Related posts scored by category and topic instead of "first three". — Alpha: `blog-related.ts`.
136. **P2** "You might also need" block linking services and boroughs. — Alpha: `RelatedPages`, `getRelatedPages`.
137. **P2** In-text links from guides to money pages. — Alpha: `linkGuidesInProse`, `addReadingLine`.
138. **P3** Author pages wrapped in `ProfilePage` schema. — Alpha: author `ProfilePage`.
139. **P2** Breadcrumbs Blog › Category (linked) › Title (today the last crumb is the category). — Alpha: blog crumbs.
140. **P2** `BlogPosting` publisher → `/#business` `@id` instead of an inline `Organization` with `logo.png`. — Alpha: `/#organization`.
141. **P1** Filter the blog index and sitemap by `getArticle` (26 posts listed vs about 25 articles built → 404s). — Alpha: only built posts listed.
142. **P3** More guides on London cost, parking, permits and checklists (Phi ~26 vs Alpha 60+). — Alpha: `blog-data`, `blog-posts-*`, `blog-research`.
143. **P3** Under-linked guides list fed into related blocks. — Alpha: `UNDER_LINKED_GUIDES`.
144. **P3** `article:published_time` and `og:type=article` on posts. — Alpha seo plan.
145. **P3** Blog cards: reading time from word count. — Alpha: blog cards.

## J. Company pages, legal, 404 and missing routes (146–165)

146. **P2** About hero: `HeroButtons` and a crew photo. — Alpha: `about.tsx`. *needs owner*
147. **P1** About "The facts you can check": Companies House, Google profile, insurance and address rows with external icons. — Alpha: `ab-rows`. *needs owner*
148. **P2** Contact: add a WhatsApp row and "What to have ready". — Alpha: `contact.tsx`.
149. **P2** Contact: use `GOOGLE_DIRECTIONS` from site-facts instead of an inline maps URL, and stop reading `lib/contact` directly. — Alpha: contact reads site-facts.
150. **P3** Contact title "Call or WhatsApp {phone}". — Alpha: contact H1.
151. **P2** Privacy policy covers the quote form, booking, Ask Phi chat, voice and photos, and the app. — Alpha: `privacy-policy.tsx` booking/chat/app sections.
152. **P2** 404 robots: `noindex, follow` (Phi `DcPage` writes `noindex, nofollow`). — Alpha: audit #85.
153. **P2** `app/not-found.tsx` renders `NotFoundPage` with `next/head`, which does nothing in the app router; rely on `pages/404` or rebuild it. — Alpha: one 404.
154. **P1** Public booking page `/book` (see section N). — Alpha: `src/pages/book.tsx`.
155. **P2** `/my-bookings` alias or clear links to `/client`. — Alpha: `/my-bookings/`.
156. **P1** `/delete-account` public page (required for Google Play). — Alpha: `src/pages/delete-account.tsx`.
157. **P2** `/insurance` one-number insurance page. — Alpha: `/insurance/`, premium #84. *needs owner*
158. **P2** `/trust` verifiable facts page. — Alpha: `/trust-and-verification/`, premium #83. *needs owner*
159. **P2** `/help` customer-care hub (same as item 128). — Alpha: `/customer-care/`.
160. **P3** `/download-app` once the Android app is live. — Alpha: `/download-app/`.
161. **P2** `/all-pages` HTML site directory. — Alpha: `/all-pages/`.
162. **P2** Rebuild `/track` (today it redirects to `/client`) as a reference + phone lookup. — Alpha: `/api/booking/mine.ts`.
163. **P3** Complaints page links the cancellation and claims process. — Alpha: customer-care claims.
164. **P3** Damage claim page/form with photos. — Alpha: `damageMail`, PRD claims.
165. **P2** Set `NEXT_PUBLIC_GA_ID` on Vercel; analytics is off until then. — Alpha: GA live. *needs owner*

## K. Motion, accessibility, performance (166–180)

166. **P3** `data-reveal` and `Words` headlines on area, about, contact and reviews pages. — Alpha: inner-page motion.
167. **P2** `Photo` fallback renders `aria-hidden` when `alt=""` (today an empty `role="img"` label). — Alpha: `Photo`.
168. **P2** Booking and quote forms: proper radio groups with arrow keys instead of `aria-pressed` buttons. — Alpha: `Chips` `role=radio`.
169. **P2** Per-field errors with `aria-invalid`, focus the first error, `role=alert`. — Alpha: `validateStep`.
170. **P3** Loading skeletons with `aria-busy` instead of "Loading…" text in the client portal. — Alpha: my-bookings skeletons.
171. **P3** Audit chips and footer links for 44px tap targets. — Alpha: premium #89.
172. **P1** `Photo` back to `<picture>` with AVIF + WebP at 320/480/640 and `fetchPriority="high"` when eager. — Alpha: `Photo`.
173. **P2** Image pipeline script to make AVIF/WebP. — Alpha: `scripts/optimize-images.mjs`.
174. **P1** Restrict `images.remotePatterns` (`hostname: "**"` is an open image proxy) to Firebase Storage and own hosts. — Alpha: fixed hosts.
175. **P2** Long-cache `Cache-Control: immutable` for `/brand`, images, `/vendor`, favicons. — Alpha: `vercel.json` headers.
176. **P3** Route CSS budget check. — Alpha: CSS budget scripts, `seo-phase-8-css-performance.md`.
177. **P2** Web Vitals (LCP, INP, CLS) reported: check `initializeAnalytics` / `useAnalyticsPageViews` are called on public pages. — Alpha: `analytics.ts`, phase 9.
178. **P3** Default 1200×630 OG image (today `/logo.png` 256×256). — Alpha: 4:3 photo OG. *needs owner*
179. **P3** `og:site_name` and `og:locale=en_GB` in `DcPage`. — Alpha seo plan.
180. **P3** Print stylesheet check on pricing and booking confirmation. — Alpha: BASE_CSS print.

## L. Technical SEO (181–198)

181. **P1** Add `middleware.ts` with a 301 map for old Phi URLs (old app-router / WordPress paths from Search Console) and alias slugs. — Alpha: `src/middleware.ts`.
182. **P2** Middleware returns 404 for internal / lab routes on the live host. — Alpha: middleware lab block.
183. **P2** `vercel.json` (or `next.config` `redirects()`) for the remaining redirects. — Alpha: 33 redirects in `vercel.json`.
184. **P2** robots: explicit allow block for AI crawlers (GPTBot, Google-Extended, ClaudeBot, PerplexityBot). — Alpha: `src/app/robots.ts`.
185. **P2** robots: drop the non-standard `host` line. — Alpha robots.
186. **P2** robots: also disallow `/track`, `/auth`, `/api`. — Alpha robots.
187. **P1** Remove `/client` from the sitemap (priority 0.55) — robots disallows it. — Alpha: sitemap = indexable pages only.
188. **P1** Delete `public/sitemap.xml` (1,518 URLs, 17 Oct); it competes with `app/sitemap.ts` for `/sitemap.xml`. — Alpha: one sitemap.
189. **P1** Drop `lastModified: now` on every URL; only blog posts get a real date. — Alpha: audit #8.
190. **P2** Drop boilerplate `priority` / `changefreq`. — Alpha: audit #9.
191. **P2** Write `public/llms.txt` from site-facts (entity, services, prices, links). — Alpha: `public/llms.txt`.
192. **P1** Complete `organizationJsonLd` in `lib/seo.ts`: `contactPoint`, `sameAs`, `hasMap`, `paymentAccepted`, `foundingDate`, `identifier`, `areaServed` Greater London — built from site-facts, not hard-coded. — Alpha: `LocalBusinessSchema.tsx` `@graph`.
193. **P1** Remove `AggregateRating` from the business node in `lib/seo.ts`. — Alpha: audit #69.
194. **P2** Reference one `@id` (`/#business`) from every page's schema. — Alpha: `#organization` everywhere.
195. **P2** Canonical overrides for alias service slugs and area combos. — Alpha: canonical rule.
196. **P2** Strict SEO audit in the build: broken links, one H1, title length, schema parse. — Alpha: `scripts/seo-audit.mjs`, `audit-rendered-links.ts`, `npm run seo:audit:strict`.
197. **P3** Post-deploy live monitor (key routes, headers, canonical). — Alpha: `scripts/seo-live-monitor.mjs`.
198. **P2** Submit the cleaned sitemap in Search Console after deploy. — Alpha: phase 6b monitoring. *needs owner*

## M. Analytics, PWA and security headers (199–212)

199. **P2** `generate_lead` event only after the quote save succeeds, with a submission ID and no personal data. — Alpha: `seo-phase-9-measurement-conversions.md`.
200. **P2** `booking_request` event after a server-confirmed booking. — Alpha: phase 9.
201. **P1** Rewrite `public/site.webmanifest` — it is Alpha's file (name "Alpha Movers", `/brand/alpha-movers-icon-*` icons that don't exist, shortcuts to `/book/` and `/my-bookings/`). — Alpha's own manifest.
202. **P1** Add `<link rel="manifest">` to `pages/_document.tsx`. — Alpha: `_document.tsx`.
203. **P2** Favicons: `favicon.ico` plus 16 and 32 PNGs (today one 256×256 PNG). — Alpha: audit #78.
204. **P2** True 180×180 apple-touch-icon (today 256×256). — Alpha icon set.
205. **P2** 192 and 512 icons, `any` + `maskable`. — Alpha manifest icons.
206. **P3** `/public/brand` folder with Phi icon set, Google logo for the review chip, social SVGs. — Alpha: `/public/brand`.
207. **P1** Baseline security headers in `next.config.mjs` `headers()`: `X-Content-Type-Options`, `X-Frame-Options SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy camera=(), microphone=(self), geolocation=()`. — Alpha: `next.config.mjs`, `vercel.json`.
208. **P1** Content-Security-Policy allowing self, GA/GTM, Google Fonts, postcodes.io, Gemini wss, Maps frames, plus Firebase (`*.googleapis.com`, `*.firebaseio.com`, identitytoolkit, reCAPTCHA). — Alpha: `vercel.json` CSP.
209. **P2** HSTS header. — Alpha: phase 7 security release.
210. **P2** Release and rollback runbook (`docs/release.md`). — Alpha: `seo-phase-7-security-release.md`.
211. **P2** `public/.well-known/assetlinks.json` for verified Android App Links. — Alpha: `public/.well-known/assetlinks.json`.
212. **P3** Consent-gated analytics events for the Ask assistant kept in sync with GA4 config. — Alpha: `kit/analytics.ts` events.

## N. Public booking flow (213–262)

Alpha's `/book` is a public six-step wizard with live slots and a server that sets the price. Phi's booking lives only
behind login at `/client/bookings/new`, is one long form, and the browser writes the price.

213. **P1** Public `/book` page with focus layout and FAQ. — Alpha: `src/pages/book.tsx`.
214. **P1** Guests fill in everything; sign-in or verification only at the review step. — Alpha: `BookingFlow` `needsSignIn`.
215. **P2** Six steps: service, property, details, date and time, address, review. — Alpha: `src/booking/model.ts` `STEPS`.
216. **P2** Current step in the URL (`?step=`, shallow routing) so Back works. — Alpha: `BookingFlow`.
217. **P2** Progress bar, "Step X of Y", "Next: …". — Alpha: booking header.
218. **P2** Step rail you can jump along up to the first unfinished step. — Alpha: `StepRail`, `reach`.
219. **P2** Live summary panel with `aria-live` price chip. — Alpha: `bf-sum`.
220. **P2** Draft saved on the device and restored on reload. — Alpha: `sessionStorage` draft.
221. **P3** "Email me a link to finish later" with a 14-day server draft. — Alpha: `api/booking/resume.ts`, `emailResumeLink`.
222. **P2** Prefill from URL (`?service&van&hours&size&kind&date&time&from&to`). — Alpha: book.tsx query prefill.
223. **P2** WhatsApp hand-off at any step with the draft typed in. — Alpha: `bookingWaText`.
224. **P2** Email fallback if the backend is down (503). — Alpha: `mailtoFallback`.
225. **P2** Service step separate from van choice: Moves / Items & hoisting / Packing & more tabs with "Most booked" tags. — Alpha: `SERVICES`, `TABS`.
226. **P2** Three pricing modes: hourly, range, quoted on a call. — Alpha: service `pricing`.
227. **P2** Property step: flat or house, then size. — Alpha: property step.
228. **P2** Suggested van and hours from home size. — Alpha: `suggestion()`, `SIZE_TEAM`.
229. **P2** 4–5 bedroom moves sent to a quoted path. — Alpha: `isTwoVans`.
230. **P2** Hours in half-hour steps 2–10 with +/- stepper and quick picks. — Alpha: hours stepper.
231. **P2** Job description required (≥10 characters) for quoted services. — Alpha: `validateStep`.
232. **P2** Seed default add-ons (dismantle, packing, boxes); `serviceSettings` add-ons are empty by default. — Alpha: extras list.
233. **P3** Heavy items list lined up with Alpha's nine (sofa, washing machine, bed, desk, motorbike…). — Alpha: heavy items.
234. **P2** Single-address services (storage, crates, packing, assembly) skip the drop-off address. — Alpha: `oneAddress`.
235. **P2** Same-day booking with 2 hours' notice. — Alpha: `NOTICE_MINUTES`. *needs owner*
236. **P2** Booking horizon of 90 days. — Alpha: `BOOK_AHEAD_DAYS`.
237. **P1** Dates in Europe/London (Phi uses browser local time and UTC `toISOString` for the minimum date). — Alpha: `londonNow`.
238. **P2** Half-hour start times 08:00–18:00 grouped Morning / Afternoon / Evening. — Alpha: `SLOT_GROUPS`. *needs owner*
239. **P2** 14-day strip plus "More dates" calendar instead of a native date input. — Alpha: day strip.
240. **P2** First open day and time picked automatically. — Alpha: `firstOpening`.
241. **P2** Live availability: taken starts greyed out from a slots API. — Alpha: `/api/booking/slots`, `slot-cells.ts`.
242. **P1** Double-booking protection: claim 30-minute cells in a transaction, return 409 and send the customer back to pick a time. — Alpha: `slotTaken`.
243. **P3** "Finishes by" time. — Alpha: `finishesBy`.
244. **P2** Postcode lookup on postcodes.io to fill the town, with a London borough check. — Alpha: `boroughFor`.
245. **P2** Full UK postcode validation and formatting. — Alpha: `POSTCODE`, `formatPostcode`.
246. **P3** Hide "lift" on the ground floor. — Alpha: floor/lift radios.
247. **P2** Parking per address with three fixed answers. — Alpha: `PARKING`.
248. **P3** Note chips (permit, no lift, narrow stairs, dismantle, fragile). — Alpha: note chips.
249. **P2** UK mobile mask and normalisation. — Alpha: `maskMobile`, `normalisePhone`.
250. **P1** Required terms checkbox at review. — Alpha: `consent`.
251. **P2** Policies shown at review (from item 8). — Alpha: `BOOKING_POLICIES`.
252. **P2** Submit errors mapped: 400 to the step, 401 sign in again, 429 too many, 503 fallback. — Alpha: submit handling.
253. **P1** Create bookings through a server API that recalculates the price; rules must stop customers writing any `totalPrice >= 0`. — Alpha: `/api/booking/submit` `cleanDraft` + `quote()`; app AUDIT S3.
254. **P2** Price labelled estimate / range / quoted until the office confirms (`priceEstimate` flag). — Alpha: price kinds.
255. **P2** Price breakdown lines (first 2 hours, extra hours). — Alpha: summary lines.
256. **P1** Booking numbers unique: issue on the server or check in a transaction (`makeBookingNumber` never checks). — Alpha: `booking-number.ts`, `createBooking` loop.
257. **P2** Rate limit booking submits by IP and verified contact. — Alpha: `tooMany`.
258. **P2** Phone or email one-time code before submit. — Alpha: `api/booking/code.ts`.
259. **P3** Book again with the earlier move filled in. — Alpha PRD.
260. **P3** Saved addresses that prefill booking (`users/{uid}/addresses`). — Alpha PRD.
261. **P2** Booking page analytics: step views and drop-off. — Alpha: phase 9.
262. **P2** Link `/book` from header, footer, calculator, service pages and Ask Phi. — Alpha: all CTAs → `/book/`.

## O. Quote form and confirmation (263–278)

263. **P1** Quote form silently drops leads when Firebase is not configured (`setDone(true)` without saving). Post to a server API with an email fallback, or show call/WhatsApp. — Alpha: no silent success.
264. **P1** Send leads through a rate-limited server API (today the client writes `leads` with no rate limit or App Check). — Alpha: `tooMany`.
265. **P2** Merge `components/QuoteForm.tsx` and `kit/components/QuoteForm.tsx`; delete the old one. — Alpha: one form.
266. **P2** Show the reference (`trackCode`) after sending. — Alpha: `makeRef` on done screen.
267. **P2** Floor and lift for both addresses, plus packing. — Alpha: quote fields.
268. **P2** "Anything awkward?" notes box. — Alpha: quote notes.
269. **P2** Attach the guide price to the lead. — Alpha: `estimate(sizeIndex).range`.
270. **P2** Full postcode and UK phone checks (today 2 characters and 7 digits). — Alpha: validators.
271. **P2** Day chips: Flexible, Today, Tomorrow, then 14 days. — Alpha: day chips.
272. **P3** "Copy summary" and "Change my answers" on the done screen. — Alpha: done screen.
273. **P2** Callback picker with time windows. — Alpha: `CallbackPicker`.
274. **P2** Prefill `?service`, `?size`, `?from` from the URL. — Alpha: prefill.
275. **P2** Booking done screen: big reference, "not confirmed yet", emailed note, "What happens next". — Alpha: `BookingFlow` `done`.
276. **P2** Add to calendar (.ics). — Alpha: `downloadIcs`.
277. **P2** "Track this booking" link with the reference. — Alpha: done → my-bookings.
278. **P2** WhatsApp or call with the reference typed in. — Alpha: done links.

## P. Customer portal (279–298)

279. **P1** `claim-leads` attaches leads by matching an unverified phone, so anyone can claim another person's leads. Require a verified phone or email. — Alpha: verified email session.
280. **P2** Booking list filters Upcoming / Past / Cancelled / All with counts. — Alpha: `my-bookings.tsx`.
281. **P2** Search and a "next move" card. — Alpha: my-bookings.
282. **P3** Empty-state text per filter. — Alpha: my-bookings.
283. **P2** "On the day" stage when a confirmed booking's date arrives. — Alpha: `stageOf`.
284. **P3** Copy reference with clipboard fallback. — Alpha: copy ref.
285. **P2** Footer text for every status (what happens next, change rules). — Alpha: `STATUS_NOTICE`.
286. **P2** Change request for time and scope, not only date, with a "Change request received" state. — Alpha PRD.
287. **P2** Cancel in a dialog that shows the cancellation terms (today `window.prompt`). — Alpha: cancel via office with terms.
288. **P2** Quote detail shows the `trackCode`. — Alpha: reference on every view.
289. **P2** Accept / Decline a quote with 7-day expiry, turning it into a booking. — Alpha PRD quote lifecycle.
290. **P2** Payments tab ("what's owed", policies, a row per booking). — Alpha: my-bookings `payments`.
291. **P2** Customer invoices list with PDF download through a token-checked route. — Alpha: PRD, app `features/invoices`.
292. **P2** Bank transfer details on unpaid completed bookings. — Alpha: invoice bank card. *needs owner*
293. **P2** Notification bell and inbox reading `subscribeMyNotifications` (written today but never shown). — Alpha: in-app notices.
294. **P2** Damage report after the job with photos. — Alpha: `damageMail`.
295. **P2** Real Google review link after completion (item 1). — Alpha: done → Google.
296. **P2** In-account delete action that removes or anonymises profile, leads, bookings and photos. — Alpha app: `functions/src/account.ts`.
297. **P2** Booking chat thread with the office per booking. — Alpha app: `booking_chat_screen.dart`.
298. **P3** Customer profile: saved phone verified badge. — Alpha PRD.

## Q. Emails and notifications (299–310)

299. **P1** Booking request email to the customer (reference, rows, next steps, button). — Alpha: `emailCustomer`.
300. **P1** New booking email to the office with Call/Email buttons (today `adminAlerts` only). — Alpha: `emailOffice`.
301. **P1** Customer and office emails for every website quote-form lead (today only chat leads email). — Alpha: lead emails.
302. **P2** Shared email layout with preheader, plain-text part and `reply_to` office. — Alpha: `emailFrame`, app `email-design.ts`.
303. **P2** Emails on confirmed, re-priced, moved, cancelled, crew assigned — next to each `notifyUser`. — Alpha app: `payment.ts`, `staff-notices.ts`.
304. **P2** Reminder 24 hours before the move. — Alpha app: `functions/src/reminders.ts`.
305. **P2** Review request 24 hours after completion, sent once. — Alpha PRD.
306. **P2** Chat price follow-up email plus a daily cron with `CRON_SECRET`. — Alpha: `assistant/server/followups.ts`, `vercel.json` crons.
307. **P2** Automatic overdue invoice reminders, at most once per stage. — Alpha app: `reminders.ts`, `payment.ts`.
308. **P2** Email the invoice PDF to the customer (today only a `mailto:`). — Alpha: `api/admin/invoices` action `email`.
309. **P2** Web push for status changes (FCM tokens on `users/{uid}`). — Alpha app: `push_notification_service.dart`.
310. **P2** Set `RESEND_API_KEY` or Zoho SMTP and `LEADS_NOTIFY_EMAIL` on Vercel. — Alpha: email env. *needs owner*

## R. Ask Phi assistant (311–320)

311. **P2** Link chats and leads to the Firebase user when signed in (today anonymous per browser). — Alpha: one shared session.
312. **P2** `saveChatLead` sets `ownerUid` when signed in (today `null`). — Alpha: owned chat leads.
313. **P2** Price card books a real booking for signed-in clients (today a lead). — Alpha: `app/api/chat/book/route.ts`.
314. **P2** Chat checkout fields: property, floor, lift, hoist floor, description. — Alpha: chat checkout.
315. **P2** Slot availability in chat checkout from the shared slots API. — Alpha: `timeFree`.
316. **P2** "Open the full booking page" with the move filled in (today static `QUOTE_HREF`). — Alpha: `bookingHref(quote)`.
317. **P2** Price card policy notes once policies are in site-facts. — Alpha: price card notes.
318. **P2** Feed cancellation, insurance, company number and never-charged into `lib/assistant/knowledge.ts`. — Alpha: `assistant/server/knowledge.ts`.
319. **P2** Rate limits keyed by IP as well as the anonymous cookie. — Alpha: IP + email limits.
320. **P3** "Request a callback" after failures or the turn limit. — Alpha PRD (12 turns, 5 retries). Set `GEMINI_API_KEY` on Vercel. *needs owner*

## S. Staff sign-in, 2FA and roles (321–338)

321. **P1** Mandatory authenticator 2FA for every staff and owner account (today opt-in in `lib/admin/staff-2fa.ts`). — Alpha: `src/admin/server.ts`.
322. **P2** Emailed six-digit code step at staff sign-in, or Google + TOTP only. — Alpha: `admin.tsx` SignIn steps.
323. **P2** Server-side sessions per device: 30-minute idle, 12-hour max, bound to the user agent. — Alpha: `startSession`, `IDLE_MINUTES`.
324. **P2** Idle auto-sign-out after 30 minutes in `AdminAuthProvider.tsx`. — Alpha: `IDLE_MS`.
325. **P2** Signed-in devices list and "Sign out other devices" (`revokeRefreshTokens`). — Alpha: `Devices`, `signOutOthers`.
326. **P2** Change password in Settings, ending other sessions. — Alpha: `ChangePassword`.
327. **P2** Sign-in alert email with time, device and IP. — Alpha: `alertSignIn`.
328. **P2** Lockout 1 hour after 5 wrong tries, and email the office (today 15 minutes, staff only). — Alpha: `wrongTry`, `alertLocked`.
329. **P2** Every security change emails both the staff member and the owner. — Alpha: `alertChange`.
330. **P2** Password rule ≥10 characters with a letter and a number, for staff and crew (crew route accepts 8). — Alpha: `PASSWORD_MIN`.
331. **P3** Same-origin check on admin POSTs. — Alpha: `sameOrigin`.
332. **P1** Remove-staff action that clears the `staff` claim, revokes tokens and disables the account (`sync-claims` only ever adds). — Alpha: `office-account.ts`.
333. **P2** Staff list in Settings read from Auth claims / roles, with add and remove. — Alpha: `listOfficeAdmins`.
334. **P2** Roles (owner / ops / finance / mover) gating invoices and price edits. — Alpha PRD permissions matrix.
335. **P1** Empty `NEXT_PUBLIC_ADMIN_EMAILS` must fail closed in production (`isStaffEmail` returns true today). — Alpha: fail-closed staff check.
336. **P2** Bootstrap email hard-coded in `firestore.rules`, `storage.rules`, `lib/admin/claims.ts`: rely on the claim, require `email_verified`. — Alpha: one constant.
337. **P2** Server-only `ADMIN_EMAILS` (the `NEXT_PUBLIC_` list is public). — Alpha `.env.example`.
338. **P3** 2FA test-vector self-test script. — Alpha: `scripts/admin-2fa-selftest.mjs`.

## T. Admin dashboard, bookings and invoices (339–368)

339. **P2** Money pills on Overview: owed, overdue, paid this month. — Alpha: `hm-pill`.
340. **P2** "Coming up" next five jobs with call buttons on Overview. — Alpha: `hm-tl`.
341. **P3** Quick-action tiles (New invoice, Jobs, Unpaid, Customers). — Alpha: `hm-actions`.
342. **P3** Time-of-day greeting with London date. — Alpha: `greeting()`.
343. **P2** `/admin/reports`: revenue by `paidAt`, jobs per month, lead conversion. — Alpha app: `reports_tab.dart`, `office_figures.dart`.
344. **P3** Marketer commission ledger (attribution on leads/bookings, idempotent ledger). — Alpha PRD. *needs owner*
345. **P2** `/admin/customers` merging leads, bookings and chats. — Alpha: `CustomerList`.
346. **P2** Customers CSV with formula-injection escaping; check the leads CSV escapes too. — Alpha: `downloadCustomers`.
347. **P2** Bookings CSV export. — Alpha: bookings `?download=1`.
348. **P3** Invoices + payments CSV by date range for the accountant.
349. **P1** One status-transition table enforced in UI and `firestore.rules` (today `setBookingStatus` writes any status). — Alpha: `STATUS_MOVES`.
350. **P1** Status, price and payment history with actor email on every staff write. — Alpha: booking history; app AUDIT D3.
351. **P2** Block or double-confirm price edits after paid, completed or cancelled. — Alpha app AUDIT D11.
352. **P1** No hard delete of paid bookings; soft-delete / archive. — Alpha app AUDIT D12.
353. **P2** `paidAt` and `paidBy` on payment. — Alpha app AUDIT D10.
354. **P2** Crew slot clash check when assigning a mover. — Alpha: `slot-cells.ts`.
355. **P2** Mover must step accepted → en route → in progress → completed in the rules. — Alpha: job steps.
356. **P2** Mover reads limited to active jobs or ~7 days after completion. — Alpha app AUDIT S14.
357. **P1** Move `adminNote` to a staff-only subcollection (customers and movers can read it today). — Alpha: `bookingsPrivate`, AUDIT S13.
358. **P1** Same for lead `notes`, `activity` (staff emails) and `assignedTo` — owners can read the whole lead. — Alpha: private office data.
359. **P2** Booking chat inbox for the office. — Alpha app: `messages_tab.dart`, `office_chat.dart`.
360. **P1** Save, void and number invoices through `POST /api/admin/invoices` with a transaction counter (today the browser writes and `nextNumber` races). — Alpha: `src/app/api/admin/invoices/route.ts`.
361. **P1** Invoice rules: `allow write: if false` once writes go through the API, or validate fields. — Alpha: server-only invoices.
362. **P2** Draft invoices for completed jobs made on the server (today `invoice-auto.ts` is client-side and runs only when the page opens). — Alpha: `draftInvoicesForCompletedJobs`.
363. **P3** Toast after "Done": "Draft invoice X ready" with a link. — Alpha: `admin.tsx` notice.
364. **P2** Invoice events carry the editor's email; lock edits on paid invoices (revisions only). — Alpha PRD append-only invoices.
365. **P3** Invoice layout choice (Alpha has six; Phi one) only if the owner wants it. — Alpha: `invoice-layouts.ts`. *needs owner*
366. **P1** Set `INVOICE_BANK_*` and `FIREBASE_SERVICE_ACCOUNT_JSON` on Vercel (PDFs, claims, `/track`, chats need it). — Alpha env. *needs owner*
367. **P2** Rate limit and daily cap on `/api/admin/assistant` and the invoice reminder route. — Alpha app AUDIT S6.
368. **P3** Sound/toast for new bookings and chats, like new leads. — Phi's `NewLeadToast`.

## U. Backend, rules and operations (369–386)

369. **P1** Publish the new `firestore.rules`, `storage.rules` and `firestore.indexes.json`. — Alpha: rules deployed with release. *needs owner*
370. **P2** Enforce App Check on Firestore, Storage, Auth, and verify `X-Firebase-AppCheck` on `/api/chat/*`. — Alpha app AUDIT.
371. **P2** Add `twoStepPassed()` to `office()` in `storage.rules`. — Phi's own Firestore rule.
372. **P2** `adminAlerts` create must check the booking exists and belongs to the caller. — Alpha: owner checks.
373. **P2** Run the admin queries and add the indexes Firestore asks for (invoices, `adminAlerts` read + createdAt). — Alpha indexes.
374. **P2** Firestore scheduled backups or PITR, with restore steps in `docs/FIREBASE_OPS.md`. *needs owner*
375. **P2** `CRON_SECRET` and `OFFICE_EMAIL` in `.env.example` and Vercel. — Alpha `.env.example`.
376. **P3** Check `scripts/push-vercel-env.ps1` never pushes `.env.local` secrets to Preview; document it.
377. **P3** Separate dev Firebase project for testing rules and functions. — Alpha PRD architecture. *needs owner*
378. **P2** Server functions (Firebase Functions or Next API) for deletion, numbering, push, email and reminders. — Alpha app: `functions/src/*`.
379. **P2** Unit tests for `invoice-model.ts`, `staff-2fa-record.ts`, `leads/stats.ts`. — Alpha: `invoice_model_test`, selftest.
380. **P2** Firestore rules tests with the emulator. — Alpha app tests.
381. **P3** Sentry or Vercel log drains for `/api/*`, alerts on 5xx and Gemini spend.
382. **P3** Keep the admin demo mode dev-only and add a test for the guard. — Phi `requireStaff`.
383. **P1** Commit the `alpha-ui-port` work (165 changed files) and open a PR before more work lands on top. — Alpha: one PR per change.
384. **P1** `npm run build` clean, then deploy to Vercel (live is still `7f41b17`). — Alpha release flow.
385. **P2** Remove repo-root leftovers (`PHI_Movers_SEO_Keyword_Intelligence_Database.xlsx`) from the commit. — Alpha keeps data out of git.
386. **P3** Run Alpha's app audit (`AUDIT-2026-10-14.md`) against Phi's rules and app and file the results. — Alpha app audit.

## V. Android app — `..\phimovers-app` (387–404)

387. **P1** Office 2FA code screen in the app (enrolled staff are locked out by rules once their pass expires). — Alpha app: `office_code_screen.dart`, `OFFICE-2FA.md`.
388. **P2** Office invoices tab (list, edit, PDF) via the web API. — Alpha app: `invoices_tab.dart`.
389. **P2** Team screen: add crew, suspend, reset authenticator. — Alpha app: `people_tabs.dart`.
390. **P3** Services and price editor in the app. — Alpha app: `catalog_tabs.dart`.
391. **P3** Office figures card (jobs, revenue, unpaid). — Alpha app: `office_figures.dart`.
392. **P2** Mover "on my way" location share and ETA. — Alpha app: `job_steps.dart`, `team_location.dart`.
393. **P2** Ask Phi chat screen calling `/api/chat`, with the first-use AI data notice. — Alpha app: `features/ai`, `ai_data_notice.dart`.
394. **P2** Address picker with postcode lookup and "use my location". — Alpha app: `address_picker_screen.dart`.
395. **P2** Booking success screen and deep link. — Alpha app: `booking_success_screen.dart`.
396. **P2** FCM push (`firebase_messaging`), taps open `/booking/:id`. — Alpha app: `push_notification_service.dart`.
397. **P2** Offline banner and friendly error mapping. — Alpha app: `connection_provider.dart`, `friendly_error.dart`.
398. **P2** In-app review prompt after a completed job. — Alpha app: `in_app_review`.
399. **P2** Crashlytics and analytics behind consent; update Data safety. — Alpha app: `analytics_consent.dart`.
400. **P2** Biometric app lock and FLAG_SECURE on staff screens; secure storage for the 2FA trust token. — Alpha app: `app_lock.dart`, `flutter_secure_storage`.
401. **P2** Verified App Links (`autoVerify`, `app_links`) and `otpauth://` hand-off. — Alpha app manifest, `deep_link_service.dart`.
402. **P2** R8/ProGuard rules and a monochrome launcher icon layer. — Alpha app: `proguard-rules.pro`, AUDIT R26.
403. **P1** Release keystore + `key.properties`, build number bump, and Play listing assets (512 icon, 1024×500 graphic, screenshots); Data safety must declare booking photos. — Alpha: `alpha-movers-android/store-listing/`. *needs owner*
404. **P3** iOS project and more tests (staff sign-in, 2FA, mover steps, booking validation, logout). — Alpha app: `ios/`, 25 test files.

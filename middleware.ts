import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Old and alias URLs → the page that answers them now (301). Every target is a built page; check
// app/sitemap.ts or the pages/ routes before adding one. Fixed page aliases (/about-us, /privacy-policy…)
// live in vercel.json; this file holds the slug aliases that also carry a sub-path.
//
// The move from the app router to pages/ kept every public URL (checked against the 17 Oct sitemap), so
// there are no old Phi routes to map today. Add Search Console 404s here as they show up.

/** Short or differently spelt borough slugs → the borough page slug. Applies to /areas/x and /areas/x/service. */
const AREA_ALIASES: Record<string, string> = {
  "barking-dagenham": "barking-and-dagenham",
  "hammersmith-fulham": "hammersmith-and-fulham",
  hammersmith: "hammersmith-and-fulham",
  "kensington-chelsea": "kensington-and-chelsea",
  kensington: "kensington-and-chelsea",
  kingston: "kingston-upon-thames",
  richmond: "richmond-upon-thames",
  "st-johns-wood": "st-john-s-wood",
};

/** Common service names typed at the top level or under /services → the service page. */
const SERVICE_ALIASES: Record<string, string> = {
  "/man-and-van": "/services/man-and-van",
  "/man-with-a-van": "/services/man-and-van",
  "/house-removals": "/services/house-removals",
  "/office-removals": "/services/office-removals",
  "/flat-removals": "/services/flat-removals",
  "/sofa-delivery": "/services/sofa-delivery",
  "/house-clearance": "/services/house-clearance",
  "/packing-services": "/services/full-packing-service",
  "/storage": "/services/secure-storage",
  "/services/man-with-a-van": "/services/man-and-van",
  "/services/packing-services": "/services/full-packing-service",
  "/services/storage": "/services/secure-storage",
  "/services/student-removals": "/services/student-moves",
  "/services/same-day-removals": "/services/same-day-move",
};

// Working pages (design labs, illustration sheets) stay reachable locally and on preview deployments,
// but the live domain answers them with the 404 page.
const LIVE_HOST = /(^|\.)phimovers\.co\.uk(:\d+)?$/;
const LAB_PATHS = /^\/(design-lab|ux-lab|illustrations|lab)(\/|$)/;

function aliasTarget(pathname: string): string | null {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const fixed = SERVICE_ALIASES[path];
  if (fixed) return fixed;
  const m = path.match(/^\/areas\/([^/]+)(\/[^/]+)?$/);
  if (m && AREA_ALIASES[m[1]]) return `/areas/${AREA_ALIASES[m[1]]}${m[2] ?? ""}`;
  return null;
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const host = (request.headers.get("host") || "").toLowerCase();
  if (LIVE_HOST.test(host) && LAB_PATHS.test(url.pathname)) {
    url.pathname = "/404";
    return NextResponse.rewrite(url, { status: 404 });
  }

  const target = aliasTarget(url.pathname);
  if (target) {
    // Same-origin target built from the validated request URL, never from the raw Host header.
    url.pathname = target;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except API routes, Next internals and files with an extension (icons, images, vendor assets).
  matcher: ["/((?!api/|_next/|.*\\.[a-zA-Z0-9]+$).*)"],
};

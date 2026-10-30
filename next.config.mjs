// Content-Security-Policy. Every external host the site loads, by feature:
// - Google Fonts (pages/_document.tsx, app/layout.tsx, admin) — style + font.
// - GA4 / gtag (kit/components/GoogleAnalytics.tsx) — script, connect, img.
// - Firebase Auth, Firestore, Storage, App Check (lib/firebase/client.ts) — *.googleapis.com (identitytoolkit,
//   securetoken, firestore, firebasestorage, content-firebaseappcheck), *.firebaseio.com, the auth iframe on
//   *.firebaseapp.com, apis.google.com for Google sign-in popups, and reCAPTCHA v3 for App Check.
// - Ask assistant live voice (kit/components/assistant/audio.ts) — wss to generativelanguage.googleapis.com.
// - Office map embed (DcPage MapEmbed) — maps.google.com / www.google.com frames.
// - postcodes.io for postcode lookups.
// Shipped as Report-Only first: violations show in the browser console without breaking anything. Switch the
// header name to `Content-Security-Policy` once a release shows no reports (see docs/release.md).
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://apis.google.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' data: blob: https:",
  "connect-src 'self' https://*.googleapis.com wss://generativelanguage.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.firebaseapp.com https://*.firebasestorage.app https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://www.google.com https://api.postcodes.io",
  "frame-src 'self' https://www.google.com https://maps.google.com https://recaptcha.google.com https://*.firebaseapp.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
].join("; ");

const LONG_CACHE = "public, max-age=31536000, immutable";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Bundle the icon packages with the app instead of as a separate server
  // vendor chunk. This avoids the Next 14 dev error
  // "Cannot find module './vendor-chunks/@hugeicons.js'" that breaks
  // generateStaticParams / SSR for pages using these client components.
  // Still needed: components/icons.tsx (client portal, /auth) uses Hugeicons.
  transpilePackages: ["@hugeicons/react", "@hugeicons/core-free-icons"],
  experimental: {
    outputFileTracingIncludes: {
      // Invoice PDFs read their fonts and the logo from disk (lib/admin/invoice-assets.ts).
      "/api/admin/**/*": ["./lib/admin/fonts/*.ttf", "./public/logo.png"],
    },
  },
  images: {
    // No open image proxy: only Firebase Storage (customer photos) and our own hosts.
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "*.firebasestorage.app" },
      { protocol: "https", hostname: "www.phimovers.co.uk" },
      { protocol: "https", hostname: "phimovers.co.uk" },
    ],
  },
  headers: async () => [
    { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: LONG_CACHE }] },
    { source: "/vendor/:path*", headers: [{ key: "Cache-Control", value: LONG_CACHE }] },
    {
      // Photos keep their names when replaced, so they get a long but not immutable cache.
      source: "/:dir(services|reviews|team)/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }],
    },
    {
      source: "/:file(favicon\\.ico|favicon-16x16\\.png|favicon-32x32\\.png|apple-touch-icon\\.png|logo\\.png|site\\.webmanifest)",
      headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
    },
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        // microphone=(self): voice messages and live voice in the Ask assistant.
        { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=()" },
        { key: "Strict-Transport-Security", value: "max-age=31536000" },
        { key: "Content-Security-Policy-Report-Only", value: CSP },
      ],
    },
  ],
  // Host redirects are handled in Vercel (apex → www). Do not add www↔apex
  // redirects here — they fight Vercel and can create a loop. Old-URL 301s
  // live in middleware.ts.
};

export default nextConfig;

# Release and rollback

How a change reaches https://www.phimovers.co.uk and how to undo it. Vercel builds every push; a push or merge
to `main` becomes the production deployment. The apex `phimovers.co.uk` redirects to `www` in Vercel's domain
settings — never add a host redirect in `next.config.mjs` or `middleware.ts` (it loops).

## Before merging to main

1. `npx tsc --noEmit -p .` — no type errors.
2. `npx next build` — the build must finish; it prerenders every pages/ route, so a missing blog article or
   combo shows up here.
3. Check `.env` changes are also set in Vercel (Project → Settings → Environment Variables) for Production.
   Anything starting `NEXT_PUBLIC_` is baked in at build time, so changing one needs a redeploy.
4. Open the Vercel preview URL for the branch and click through: home, a service, an area, a blog post,
   pricing, contact quote form, the Ask assistant (text and voice), `/client/login`, `/admin/login`.

## After the production deploy

Run against the live host (replace the path to spot-check others):

```sh
curl -sI https://www.phimovers.co.uk/ | grep -iE "^(http|strict|x-frame|x-content|referrer|permissions|content-security)"
curl -sI https://phimovers.co.uk/ | grep -i "^location"          # → https://www.phimovers.co.uk/
curl -s https://www.phimovers.co.uk/robots.txt
curl -s https://www.phimovers.co.uk/sitemap.xml | grep -c "<loc>"
curl -sI https://www.phimovers.co.uk/about-us | grep -i "^location"   # → /about (vercel.json)
curl -sI https://www.phimovers.co.uk/areas/kingston | grep -i "^location"   # → /areas/kingston-upon-thames (middleware.ts)
curl -sI https://www.phimovers.co.uk/brand/phi-movers-icon-192.png | grep -i cache-control   # immutable
```

Then in Google Search Console: resubmit `https://www.phimovers.co.uk/sitemap.xml` when the sitemap changed,
and watch Pages → Not found for old URLs to add to `middleware.ts`.

## Security headers

Set in `next.config.mjs` `headers()`: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy` (microphone allowed for the assistant's voice), `Strict-Transport-Security` and the
Content-Security-Policy.

The CSP ships as **`Content-Security-Policy-Report-Only`**. To enforce it:

1. On the live site, open DevTools → Console on home, a service page with the map, contact (quote form),
   the assistant (send a photo, record a voice note, start live voice), `/client/login` (Google sign-in and
   email sign-in) and `/admin`. Every blocked request is logged as a CSP report-only violation.
2. Add any missing host to the matching directive in `next.config.mjs` (the comment above `CSP` lists what
   each host is for). New third-party scripts, frames or APIs always need an entry there.
3. When a full click-through shows no violations, rename the header key to `Content-Security-Policy`,
   release, and repeat the click-through on the live site.

HSTS is `max-age=31536000` without `includeSubDomains` or `preload`. Add those only once every subdomain of
phimovers.co.uk is HTTPS-only; preload cannot be undone quickly.

## Rollback

- **Fast:** Vercel → Project → Deployments → pick the last good production deployment → **Instant Rollback**
  (or "Promote to Production"). Takes seconds, no rebuild. Environment variable changes are not rolled back
  with it — undo those by hand.
- **Lasting:** `git revert <bad commit>` on `main` and push, so the next deploy does not bring the problem back.
- **CSP breaks something after enforcing:** change the key back to `Content-Security-Policy-Report-Only` and
  release (or roll back as above), then fix the directive.
- **Redirect loop or wrong redirect:** roll back first, then check `vercel.json`, `middleware.ts` and the
  Vercel domain settings together — only Vercel may redirect between apex and www.
- Firestore rules and indexes deploy separately (`firebase deploy --only firestore:rules`); roll those back by
  redeploying the previous `firestore.rules` from git. See `docs/FIREBASE_OPS.md`.

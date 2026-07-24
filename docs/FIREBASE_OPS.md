# Firebase ops (Phi Movers)

## 1) Redeploy Firestore rules (required after this upgrade)

Console → Firestore → Rules → paste `firestore.rules` → Publish  
Or CLI: `firebase deploy --only firestore:rules`

Staff access now needs `request.auth.token.staff == true` **or** email `phimoves@gmail.com`.

## 2) Service account (custom claims + /track API)

1. Firebase Console → Project settings → **Service accounts**
2. **Generate new private key** → download JSON
3. Put the **entire JSON as one line** in:
   - `.env.local` → `FIREBASE_SERVICE_ACCOUNT_JSON={...}`
   - Vercel → Environment Variables → same name (Production + Preview + Development)
4. Restart `npm run dev` / redeploy Vercel
5. Sign out/in of `/admin` once — claim `staff: true` is set automatically

Never commit the JSON file.

## 3) App Check (spam protection) — Console steps

1. Firebase Console → **App Check**
2. Register your **Web** app → provider **reCAPTCHA v3**
3. Create a reCAPTCHA v3 key in Google reCAPTCHA admin for:
   - `localhost`
   - `phimovers.co.uk`
   - `www.phimovers.co.uk`
4. Paste site key into env:
   - `NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY=...`
5. In App Check → APIs → enforce for **Firestore** / **Auth** only after testing (start in monitoring mode)
6. Optional debug token for local: App Check → Manage debug tokens

Code already initializes App Check when the site key env is present.

## 4) Auth email templates

Console → Authentication → Templates

- **Password reset**: paste HTML from `docs/auth-email-password-reset.html`
- Subject suggestion: `Reset your Phi Movers admin password`
- From name: `Phi Movers`
- Keep Firebase placeholders: `%LINK%`, `%EMAIL%`, `%DISPLAY_NAME%`

## 5) Public customer dashboard

URL: `/track`  
Customers use **tracking code + phone**. Needs service account (step 2).

## 6) Vercel env checklist

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_ADMIN_EMAILS
FIREBASE_SERVICE_ACCOUNT_JSON
NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY   (optional until App Check on)
```

# Custom branded password reset emails

Firebase Auth templates are **locked** on this project, so we send resets ourselves:

1. `POST /api/auth/forgot-password` builds a Firebase reset link (Admin SDK)
2. Emails Phi Movers HTML via **Resend** (or SMTP)

## Setup (pick one)

### Option A — Resend (recommended)

1. Create account at https://resend.com  
2. Add + verify domain `phimovers.co.uk`  
3. Create API key  
4. Env (`.env.local` + Vercel):

```
RESEND_API_KEY=re_xxxx
EMAIL_FROM=Phi Movers <info@phimovers.co.uk>
```

### Option B — SMTP (your mailbox)

```
SMTP_HOST=smtp.yourhost.com
SMTP_PORT=587
SMTP_USER=info@phimovers.co.uk
SMTP_PASS=your-app-password
EMAIL_FROM=Phi Movers <info@phimovers.co.uk>
```

Also needs: `FIREBASE_SERVICE_ACCOUNT_JSON` (already set).

## Test

1. Restart `npm run dev` / redeploy Vercel after env  
2. `/client/login` → Forgot?  
3. Inbox should show branded **Phi Movers** HTML, subject `Reset your Phi Movers password`

# Auth email branding fix

Your reset email still said `project-567315268945` because Firebase uses the
**public-facing project name**, not only the template HTML.

## Do this in Firebase Console

1. **Project settings** (gear) → **General**
2. **Public-facing name** → set to: `Phi Movers`
3. Save

4. **Authentication → Templates → Password reset**
5. Confirm:
   - Sender name: `Phi Movers`
   - Subject: `Reset your Phi Movers password`
   - Message: paste `docs/auth-email-password-reset.html` again
6. Click **Save** (important)

7. Send a fresh “Forgot password” from `/client/login` and check the new email.

If the body is still the plain Firebase default, the template did not save —
re-open Password reset (not Email verification) and Save again.

Email verification body is locked by Firebase (“cannot be edited”); only
sender name / subject can change there.

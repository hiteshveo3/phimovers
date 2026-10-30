# Phi Movers Android app (Flutter)

## Where it lives

`C:\Users\Sameer Ahmad Basra\Downloads\phimovers-main\phimovers-app` (a sibling of this repo, not inside it).
Package / application id `uk.co.phimovers.app`. Same look as the Alpha Movers app, branded for Phi.
Full details: that folder's `README.md` (run, preview mode, release signing) and `PLAY-STORE.md`.

## Configure Firebase

The app uses **this site's Firebase project** (`phi-movers`): Firestore `users/{uid}` and `leads/{id}`,
Auth email + password. There is no second database.

1. Firebase console > Project settings > Add app > Android, package `uk.co.phimovers.app`.
2. Save the downloaded file as `phimovers-app/android/app/google-services.json` (the build applies the
   Google services plugin when it exists). Without the file the app still runs, in a labelled
   **PREVIEW MODE** with sample data (nothing is read from or written to Firestore).
3. Auth > Email/Password must be enabled (it already is for the website).
4. Staff: the `staff` custom claim (`POST /api/admin/sync-claims`) or the allow-listed address in
   `firestore.rules` (`phimoves@gmail.com`), the same test the app uses to show the staff screens.
5. `POST /api/client/claim-leads` is called best-effort after sign-in/registration with the user's
   Firebase ID token, so earlier website quotes with the same phone are attached to the account.
   It needs the Admin SDK configured on the deployed site.

## Firestore rules the app relies on (current `firestore.rules`, unchanged)

- `leads` create: requires `name, phone, from, to, propertySize, service, source, status`;
  `status == 'new'`; `priority in ['normal','urgent']`; `ownerUid` null or the caller's uid.
  The app sends exactly the website's `createLead` fields plus `source: "app"`.
- `leads` read: owner (`ownerUid == uid`) or staff. The app queries `where ownerUid == uid` **without**
  `orderBy` (sorted on the phone), so no composite index is needed.
- `leads` update/delete: staff only (status, priority, assignee, quote, notes, each with an activity entry).
- `users/{uid}` read/create/update by that user with `role == 'client'`; delete is forbidden.

## Recommended rule / backend changes (not applied; the dashboard agent may be editing the rules)

1. **Customers can read staff-internal fields.** Because the owner may read the whole lead document, they
   can read `notes`, `activity` (with staff emails) and `assignedTo`. The app never displays them, but the
   data is reachable by anyone with the account's token. Safer: keep internal notes and activity in a
   `leads/{id}/internal` subcollection readable by staff only, or serve customers a `PublicLeadView`
   (see `lib/leads/types.ts`) from a server route.
2. **Account deletion.** The app deletes the Firebase Auth user and empties `users/{uid}` (`name`, `phone`,
   `email` cleared, `deleted: true`) because `allow delete: if false`. To remove data fully, either allow
   `delete: if request.auth.uid == uid` on `users`, or add a Cloud Function on user delete that deletes
   the profile and clears `ownerUid`, name, phone and email on that user's leads. The app's dialog tells
   the customer that sent quote requests are kept unless they email info@phimovers.co.uk.
3. **Track-code lookup without login** is only possible for quotes created on the same phone (the code is
   stored locally) or under the signed-in account. A public lookup needs a server route, for example
   `GET /api/track?code=ABC234` returning a `PublicLeadView`, plus (optionally) a trackCode-only rate limit.
4. **Server-side validation.** Rules only check presence and `status`. Consider rules that also forbid
   client-supplied `quoteAmount`, `assignedTo`, `lostReason`, `notes`, `tags` on create, so a modified
   client cannot write them (the shipped app never does).

## Not done in the app

Google sign-in, push notifications while the app is closed (staff get a local notification while it is
open), iOS.

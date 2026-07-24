# Client portal + Flutter (same backend)

## Web URLs

- Client login / dashboard: `/client`
- Staff admin: `/admin`

## Auth

- Email + password
- Google Sign-In
- Name + phone **required** (complete-profile gate after Google)

## Firestore collections (stable for Flutter)

### `users/{uid}`

```
uid, email, name, phone, phoneNorm, role ("client"|"staff"),
photoURL?, createdAt, updatedAt
```

### `leads/{id}`

Existing lead fields + `ownerUid` (Firebase Auth uid of client).

Clients may **read** only where `ownerUid == auth.uid`.
Staff (custom claim / bootstrap email) full access.

## APIs

- `POST /api/client/claim-leads` — Bearer token; attaches orphan leads matching phone
- `POST /api/admin/sync-claims` — staff claim only

## Flutter later

Use the **same Firebase project** (`phi-movers`):

1. Enable Android/iOS apps in Firebase
2. Auth: Email + Google
3. Firestore: `users` + `leads` with same rules
4. After login, upsert `users/{uid}` then query `leads` where `ownerUid == uid`

Do not invent a second database — web and app share one source of truth.

# Bookings (Alpha Movers style) — shared contract for web + Flutter

Same Firebase project (`phi-movers`). Web and the Flutter app read/write the
**same documents**; keep field names exactly as below.

Modelled on the live Alpha Movers project (`alpha-movers-group-limited`):
`bookings`, `users` (roles), `notifications`, `reviews`, `services`,
`serviceSettings`, `adminAlerts`, plus Storage folders for photos.

## Roles

| Who | How the rules know |
| --- | --- |
| **Admin / staff** | custom claim `staff == true` or email `phimoves@gmail.com` (unchanged, see `firestore.rules` `isStaff()`) |
| **Customer** | `users/{uid}.role == "client"` (what the web/app already write). Alpha's word `"customer"` is read as the same thing. |
| **Mover (crew)** | `users/{uid}.role == "mover"`, `status != "suspended"`. Created by an admin only (web `/admin/movers`, uses the Admin SDK). |

`users/{uid}` extra optional fields: `status` ("active" | "suspended"),
`fcmTokens` (string[]), `notificationsEnabled` (bool), `skills` (string[]),
`adminNote`. A user can never change their own `role`, `status`, `skills`, `adminNote`.

## `bookings/{bookingId}`

Document id = Firestore auto id. All dates are Firestore `Timestamp`
(web may also send ISO strings when reading; always write Timestamp).

```
bookingNumber     string   "PHI-" + 6 chars from ABCDEFGHJKLMNPQRSTUVWXYZ23456789 (customer-visible reference)
customerId        string   auth uid of the customer           (required)
customerName      string                                       (required)
customerPhone     string                                       (required)
customerEmail     string
serviceId         string   services/{id} or site slug e.g. "man-and-van"
serviceName       string
serviceCategory   string   e.g. "Home & Flat Moves"
hours             int      booked hours
moversCount       int      crew size
basePrice         number   GBP
addonsPrice       number   GBP
selectedAddons    [ {id, name, price} ]
totalPrice        number   GBP = basePrice + addonsPrice   (admin may override)
scheduledDate     Timestamp  (date of move, 00:00 UK)
scheduledTime     string   "09:00 AM"
addressLine       string   pickup address (+ postcode)
toAddressLine     string   drop-off address (+ postcode)
fromFloor         string   "Ground" | "1st" | "2nd" ...
toFloor           string
fromLift          bool
toLift            bool
parking           string   free text / choice
heavyItems        string[]
specialInstructions string
requestPhotos     string[] Storage download URLs   (customer uploads)
requestPhotoPaths string[] Storage paths (request_photos/{uid}/{bookingId}/{file})
jobPhotos         [ {url, path, kind: "before"|"after", by, at} ]  (mover uploads)
status            string   pending | confirmed | accepted | en_route | in_progress | completed | cancelled
paymentStatus     string   unpaid | paid | refunded
paymentMethod     string   bank_transfer | cash | card
moverId           string|null   uid of the assigned mover
moverName         string|null
acceptedAt        Timestamp|null   mover accepted the job
enRouteAt         Timestamp|null
startedAt         Timestamp|null
completedAt       Timestamp|null
cancelledAt       Timestamp|null
cancelReason      string|null
moveRequestedAt   Timestamp|null   customer asked to change the date
moveRequestedFrom Timestamp|null   the date they asked to move to
adminNote         string|null      staff only (never shown to customer)
createdAt         Timestamp
updatedAt         Timestamp
```

### Lifecycle

```
pending ──admin confirms──▶ confirmed ──admin assigns mover──▶ (moverId set)
   │                                   mover accepts ▶ accepted ▶ en_route ▶ in_progress ▶ completed
   └─customer or admin cancels ▶ cancelled
```

Who may do what (enforced by `firestore.rules`):

* **Customer**: create a booking for themselves (`status:"pending"`,
  `paymentStatus:"unpaid"`, `moverId:null`); read their own; while `pending`
  they may cancel it, and while not completed/cancelled they may only ask for a
  new date (`moveRequestedAt`, `moveRequestedFrom`).
* **Mover**: read bookings where `moverId == uid`; update only `status`
  (accepted → en_route → in_progress → completed), `acceptedAt`, `enRouteAt`,
  `startedAt`, `completedAt`, `jobPhotos`, `updatedAt`.
* **Admin**: everything (confirm, assign `moverId`/`moverName`, price,
  payment, notes, delete).

## Other collections

* `notifications/{id}`: `userId`, `title`, `body`, `type`
  ("booking" | "job" | "payment" | "system"), `bookingId?`, `isRead` (false),
  `createdAt`, `updatedAt` (**ISO-8601 strings**, unlike bookings which use Timestamps). Created by admin (or by the web server on booking
  events); owner reads, marks read (`isRead`,`updatedAt` only) and deletes.
* `adminAlerts/{id}`: `type` ("new_booking" | "change_request" | "cancelled"),
  `bookingId`, `title`, `body`, `read` (false), `createdAt`. A customer may
  **create** one for their own booking (that is how staff hear about it);
  only admin reads/updates/deletes.
* `reviews/{id}`: `customerId`, `bookingId`, `rating` (1–5), `comment`,
  `createdAt`. A customer may create one for their own completed booking.
* `services/{id}` (public read, admin write): `name`, `category`, `description`,
  `hourlyPrice` (van + driver, £/hr), `helperHourPrice` (each extra helper, £/hr,
  default 20), `minHours` (default 2), `helperOptions` (int[] of helper counts,
  0 = driver only), `active`, `sortOrder`. **Booking price** =
  `max(hours, minHours) * (hourlyPrice + helpers * helperHourPrice)` plus add-ons;
  `moversCount` on a booking = 1 driver + helpers. When the collection is empty
  both clients fall back to the same three vans as `kit/site-facts.ts` RATES:
  small-van 50, transit-van 55, luton-van 65, helper 20, min 2 hours.
* `serviceSettings/default` (single doc; public read, admin write): `addons` [{id,name,price}],
  `timeSlots` string[], `maxMovers`, `notice`.
* `users/{uid}/addresses/{id}` and `users/{uid}/settings/{id}`: owner or admin.

## Storage (bucket `phi-movers.firebasestorage.app`)

Images only, ≤ 8 MB, nobody can list a folder.

| Path | Who writes | Who reads |
| --- | --- | --- |
| `profile_photos/{uid}/{file}` | that user | any signed-in user |
| `request_photos/{uid}/{bookingId}/{file}` | that customer | that customer + admin |
| `job_photos/{bookingId}/{uid}/{file}` | that mover (or admin) | that mover + admin |

## Indexes

`bookings`: `customerId ASC, createdAt DESC` · `moverId ASC, scheduledDate ASC` ·
`status ASC, scheduledDate ASC`. `notifications`: `userId ASC, createdAt DESC`.
(see `firestore.indexes.json`)

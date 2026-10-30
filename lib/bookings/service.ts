"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { getFirebaseAuth, getFirebaseDb, getFirebaseStorageClient } from "@/lib/firebase/client";
import {
  NO_ANNOUNCEMENT,
  type Announcement,
  gbp,
  makeBookingNumber,
  type Booking,
  type BookingHistoryEntry,
  type BookingInput,
  type BookingNotification,
  type BookingPrivate,
  type BookingStatus,
  type Mover,
  type PaymentMethod,
  type PaymentStatus,
  type ServiceItem,
  type ServiceSettings,
} from "@/lib/bookings/types";
import { canHardDelete, canStaffMove, statusAfterAssign, statusMoveRefusal } from "@/lib/bookings/status";

const BOOKINGS = "bookings";
/** Staff-only twin of each booking: the office note, and the history subcollection (firestore.rules). */
const PRIVATE = "bookingsPrivate";
const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

type Raw = Record<string, unknown>;

/** Timestamp | ISO string | null → ISO string | null */
function iso(v: unknown): string | null {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (typeof v === "object" && "toDate" in (v as object)) {
    return (v as { toDate: () => Date }).toDate().toISOString();
  }
  return null;
}

const str = (v: unknown, d = "") => (v == null ? d : String(v));
const num = (v: unknown, d = 0) => (typeof v === "number" ? v : Number(v) || d);
const strArr = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);

export function mapBooking(id: string, d: Raw): Booking {
  const created = iso(d.createdAt) ?? new Date().toISOString();
  return {
    id,
    bookingNumber: str(d.bookingNumber, id.slice(0, 8).toUpperCase()),
    customerId: str(d.customerId),
    customerName: str(d.customerName),
    customerPhone: str(d.customerPhone),
    customerEmail: str(d.customerEmail),
    serviceId: str(d.serviceId),
    serviceName: str(d.serviceName),
    serviceCategory: str(d.serviceCategory),
    hours: num(d.hours, 2),
    moversCount: num(d.moversCount, 1),
    basePrice: num(d.basePrice),
    addonsPrice: num(d.addonsPrice),
    selectedAddons: Array.isArray(d.selectedAddons)
      ? (d.selectedAddons as Raw[]).map((a) => ({
          id: str(a.id),
          name: str(a.name),
          price: num(a.price),
        }))
      : [],
    totalPrice: num(d.totalPrice),
    scheduledDate: iso(d.scheduledDate) ?? created,
    scheduledTime: str(d.scheduledTime),
    addressLine: str(d.addressLine),
    toAddressLine: str(d.toAddressLine),
    fromFloor: str(d.fromFloor),
    toFloor: str(d.toFloor),
    fromLift: d.fromLift === true,
    toLift: d.toLift === true,
    parking: str(d.parking),
    heavyItems: strArr(d.heavyItems),
    specialInstructions: str(d.specialInstructions),
    requestPhotos: strArr(d.requestPhotos),
    requestPhotoPaths: strArr(d.requestPhotoPaths),
    jobPhotos: Array.isArray(d.jobPhotos)
      ? (d.jobPhotos as Raw[]).map((p) => ({
          url: str(p.url),
          path: str(p.path),
          kind: p.kind === "after" ? "after" : "before",
          by: str(p.by),
          at: iso(p.at) ?? "",
        }))
      : [],
    status: (str(d.status, "pending") as BookingStatus),
    paymentStatus: str(d.paymentStatus, "unpaid") as PaymentStatus,
    paymentMethod: str(d.paymentMethod, "bank_transfer") as PaymentMethod,
    moverId: d.moverId ? str(d.moverId) : null,
    moverName: d.moverName ? str(d.moverName) : null,
    acceptedAt: iso(d.acceptedAt),
    enRouteAt: iso(d.enRouteAt),
    startedAt: iso(d.startedAt),
    completedAt: iso(d.completedAt),
    cancelledAt: iso(d.cancelledAt),
    cancelReason: d.cancelReason ? str(d.cancelReason) : null,
    moveRequestedAt: iso(d.moveRequestedAt),
    moveRequestedFrom: iso(d.moveRequestedFrom),
    adminNote: d.adminNote ? str(d.adminNote) : null,
    priceIsEstimate: d.priceIsEstimate !== false,
    paidAt: iso(d.paidAt),
    paidBy: d.paidBy ? str(d.paidBy) : null,
    archived: d.archived === true,
    archivedAt: iso(d.archivedAt),
    archivedBy: d.archivedBy ? str(d.archivedBy) : null,
    updatedBy: d.updatedBy ? str(d.updatedBy) : null,
    createdAt: created,
    updatedAt: iso(d.updatedAt) ?? created,
  };
}

// ------------------------------------------------------------------ reads

/** Staff: every booking, newest first. */
export function subscribeBookings(
  onData: (rows: Booking[]) => void,
  onError?: (e: Error) => void,
): Unsubscribe {
  const q = query(collection(getFirebaseDb(), BOOKINGS), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (s) => onData(s.docs.map((d) => mapBooking(d.id, d.data() as Raw))),
    (e) => onError?.(e),
  );
}

/** Customer portal: only this customer's bookings. */
export function subscribeClientBookings(
  uid: string,
  onData: (rows: Booking[]) => void,
  onError?: (e: Error) => void,
): Unsubscribe {
  const q = query(
    collection(getFirebaseDb(), BOOKINGS),
    where("customerId", "==", uid),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(
    q,
    (s) => onData(s.docs.map((d) => mapBooking(d.id, d.data() as Raw))),
    (e) => onError?.(e),
  );
}

export function subscribeBooking(
  id: string,
  onData: (b: Booking | null) => void,
  onError?: (e: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(getFirebaseDb(), BOOKINGS, id),
    (s) => onData(s.exists() ? mapBooking(s.id, s.data() as Raw) : null),
    (e) => onError?.(e),
  );
}

export async function listMovers(): Promise<Mover[]> {
  const snap = await getDocs(
    query(collection(getFirebaseDb(), "users"), where("role", "==", "mover")),
  );
  return snap.docs.map((d) => {
    const x = d.data() as Raw;
    return {
      uid: d.id,
      name: str(x.name),
      email: str(x.email),
      phone: str(x.phone),
      status: x.status === "suspended" ? "suspended" : "active",
    };
  });
}

// ------------------------------------------------------------------ notifications / alerts

export async function notifyUser(
  userId: string,
  title: string,
  body: string,
  bookingId?: string,
  type: BookingNotification["type"] = "booking",
) {
  const now = new Date().toISOString();
  await addDoc(collection(getFirebaseDb(), "notifications"), {
    userId,
    title,
    body,
    type,
    bookingId: bookingId ?? null,
    isRead: false,
    createdAt: now,
    updatedAt: now,
  });
}

async function alertOffice(
  type: "new_booking" | "change_request" | "cancelled",
  b: { id: string; bookingNumber: string; customerName: string },
  title: string,
) {
  try {
    await addDoc(collection(getFirebaseDb(), "adminAlerts"), {
      type,
      bookingId: b.id,
      bookingNumber: b.bookingNumber,
      title,
      body: `${b.customerName} · ${b.bookingNumber}`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  } catch {
    /* the booking itself already saved; the alert is best effort */
  }
}

export function subscribeAdminAlerts(
  onData: (rows: { id: string; type: string; title: string; body: string; bookingId: string; read: boolean; createdAt: string }[]) => void,
  onError?: (e: Error) => void,
): Unsubscribe {
  const q = query(collection(getFirebaseDb(), "adminAlerts"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (s) =>
      onData(
        s.docs.slice(0, 50).map((d) => {
          const x = d.data() as Raw;
          return {
            id: d.id,
            type: str(x.type),
            title: str(x.title),
            body: str(x.body),
            bookingId: str(x.bookingId),
            read: x.read === true,
            createdAt: iso(x.createdAt) ?? "",
          };
        }),
      ),
    (e) => onError?.(e),
  );
}

export async function markAlertRead(id: string) {
  await updateDoc(doc(getFirebaseDb(), "adminAlerts", id), { read: true });
}

// ------------------------------------------------------------------ customer

export function validatePhotos(files: File[]): string | null {
  if (files.length > MAX_PHOTOS) return `Attach up to ${MAX_PHOTOS} photos.`;
  for (const f of files) {
    if (!f.type.startsWith("image/")) return `${f.name} is not an image.`;
    if (f.size >= MAX_PHOTO_BYTES) return `${f.name} is over 8 MB.`;
  }
  return null;
}

/**
 * Customer books a move. Photos are uploaded first under
 * request_photos/{uid}/{bookingId}/, then the booking is written once.
 */
export async function createBooking(
  input: BookingInput,
  photos: File[] = [],
): Promise<{ id: string; bookingNumber: string }> {
  const bad = validatePhotos(photos);
  if (bad) throw new Error(bad);

  const db = getFirebaseDb();
  const ref = doc(collection(db, BOOKINGS));
  const bookingNumber = makeBookingNumber();

  const requestPhotos: string[] = [];
  const requestPhotoPaths: string[] = [];
  for (const [i, file] of photos.entries()) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `request_photos/${input.customerId}/${ref.id}/${Date.now()}_${i}.${ext || "jpg"}`;
    const r = storageRef(getFirebaseStorageClient(), path);
    await uploadBytes(r, file, { contentType: file.type });
    requestPhotos.push(await getDownloadURL(r));
    requestPhotoPaths.push(path);
  }

  const addonsPrice = input.selectedAddons.reduce((n, a) => n + a.price, 0);
  const now = Timestamp.now();
  const date = new Date(input.scheduledDate);
  date.setHours(0, 0, 0, 0);

  await setDoc(ref, {
    bookingNumber,
    customerId: input.customerId,
    customerName: input.customerName.trim(),
    customerPhone: input.customerPhone.trim(),
    customerEmail: input.customerEmail?.trim() || "",
    serviceId: input.serviceId,
    serviceName: input.serviceName,
    serviceCategory: input.serviceCategory,
    hours: input.hours,
    moversCount: input.moversCount,
    basePrice: input.basePrice,
    addonsPrice,
    selectedAddons: input.selectedAddons,
    totalPrice: input.basePrice + addonsPrice,
    scheduledDate: Timestamp.fromDate(date),
    scheduledTime: input.scheduledTime,
    addressLine: input.addressLine.trim(),
    toAddressLine: input.toAddressLine.trim(),
    fromFloor: input.fromFloor,
    toFloor: input.toFloor,
    fromLift: input.fromLift,
    toLift: input.toLift,
    parking: input.parking.trim(),
    heavyItems: input.heavyItems,
    specialInstructions: input.specialInstructions.trim(),
    requestPhotos,
    requestPhotoPaths,
    jobPhotos: [],
    status: "pending",
    paymentStatus: "unpaid",
    paymentMethod: input.paymentMethod,
    moverId: null,
    moverName: null,
    acceptedAt: null,
    enRouteAt: null,
    startedAt: null,
    completedAt: null,
    cancelledAt: null,
    cancelReason: null,
    moveRequestedAt: null,
    moveRequestedFrom: null,
    adminNote: null,
    // The price the customer saw is a guide until the office confirms it (firestore.rules).
    priceIsEstimate: true,
    createdAt: now,
    updatedAt: now,
    createdAtServer: serverTimestamp(),
  });

  await alertOffice(
    "new_booking",
    { id: ref.id, bookingNumber, customerName: input.customerName },
    "New booking request",
  );
  return { id: ref.id, bookingNumber };
}

/** Customer cancels while the booking is still pending (rules enforce this). */
export async function cancelOwnBooking(b: Booking, reason: string) {
  await updateDoc(doc(getFirebaseDb(), BOOKINGS, b.id), {
    status: "cancelled",
    cancelledAt: Timestamp.now(),
    cancelReason: reason.trim() || "Cancelled by customer",
    updatedAt: Timestamp.now(),
  });
  await alertOffice("cancelled", b, "Booking cancelled by customer");
}

/** Customer asks for another date; staff decide. */
export async function requestMove(b: Booking, newDate: Date) {
  const d = new Date(newDate);
  d.setHours(0, 0, 0, 0);
  await updateDoc(doc(getFirebaseDb(), BOOKINGS, b.id), {
    moveRequestedAt: Timestamp.now(),
    moveRequestedFrom: Timestamp.fromDate(d),
    updatedAt: Timestamp.now(),
  });
  await alertOffice("change_request", b, "Customer asked to change the date");
}

export async function createReview(
  b: Booking,
  rating: number,
  comment: string,
) {
  await addDoc(collection(getFirebaseDb(), "reviews"), {
    customerId: b.customerId,
    bookingId: b.id,
    rating: Math.round(rating),
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
  });
}

export function subscribeMyNotifications(
  uid: string,
  onData: (rows: BookingNotification[]) => void,
  onError?: (e: Error) => void,
): Unsubscribe {
  const q = query(
    collection(getFirebaseDb(), "notifications"),
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(
    q,
    (s) =>
      onData(
        s.docs.map((d) => {
          const x = d.data() as Raw;
          return {
            id: d.id,
            userId: str(x.userId),
            title: str(x.title),
            body: str(x.body),
            type: str(x.type, "booking") as BookingNotification["type"],
            bookingId: x.bookingId ? str(x.bookingId) : undefined,
            isRead: x.isRead === true,
            createdAt: iso(x.createdAt) ?? "",
          };
        }),
      ),
    (e) => onError?.(e),
  );
}

export async function markNotificationRead(id: string) {
  await updateDoc(doc(getFirebaseDb(), "notifications", id), {
    isRead: true,
    updatedAt: new Date().toISOString(),
  });
}

// ------------------------------------------------------------------ staff
// Every office write goes through write(): the booking change, `updatedBy`, and one history entry per
// changed field in bookingsPrivate/{id}/history ({field, from, to, by, at}), in one batch, so a change and
// its history land together. The rules require `by` to be the writer's own email.

function staffEmail(): string {
  return getFirebaseAuth().currentUser?.email?.toLowerCase() ?? "unknown";
}

type Change = Omit<BookingHistoryEntry, "id" | "by" | "at">;

async function write(id: string, data: Raw, changes: Change[] = []) {
  const db = getFirebaseDb();
  const by = staffEmail();
  const batch = writeBatch(db);
  batch.update(doc(db, BOOKINGS, id), { ...data, updatedAt: Timestamp.now(), updatedBy: by });
  const at = new Date().toISOString();
  for (const c of changes) {
    batch.set(doc(collection(db, PRIVATE, id, "history")), { ...c, by, at });
  }
  await batch.commit();
}

const STATUS_COPY: Partial<Record<BookingStatus, [string, string]>> = {
  confirmed: ["Booking confirmed", "Your move is confirmed. We will assign your crew shortly."],
  cancelled: ["Booking cancelled", "Your booking has been cancelled. Call us if this is a surprise."],
  completed: ["Move completed", "Thanks for moving with Phi Movers. Tell us how it went."],
};

/** Only the moves in lib/bookings/status.ts STAFF_MOVES (the rules refuse the rest too). */
export async function setBookingStatus(
  b: Booking,
  status: BookingStatus,
  reason?: string,
) {
  if (!canStaffMove(b.status, status)) throw new Error(statusMoveRefusal(b.status));
  if (status === b.status) return;
  const now = Timestamp.now();
  const stamp: Raw = {};
  if (status === "accepted") stamp.acceptedAt = now;
  if (status === "en_route") stamp.enRouteAt = now;
  if (status === "in_progress") stamp.startedAt = now;
  if (status === "completed") stamp.completedAt = now;
  if (status === "cancelled") {
    stamp.cancelledAt = now;
    stamp.cancelReason = reason?.trim() || "Cancelled by Phi Movers";
  }
  if (status === "pending") {
    // Reopened: the old finish stamps go, so the timeline reads true.
    Object.assign(stamp, { completedAt: null, cancelledAt: null, cancelReason: null });
  }
  await write(b.id, { status, ...stamp }, [{ field: "status", from: b.status, to: status }]);
  const copy = STATUS_COPY[status];
  if (copy) {
    await notifyUser(
      b.customerId,
      copy[0],
      `${copy[1]} (${b.bookingNumber})`,
      b.id,
    ).catch(() => undefined);
  }
}

/**
 * Assigns (or unassigns) crew. As in the app: a pending booking becomes confirmed, and an accepted one goes
 * back to confirmed until the new mover accepts.
 */
export async function assignMover(b: Booking, mover: Mover | null) {
  const next = statusAfterAssign(b.status);
  const changes: Change[] = [{ field: "mover", from: b.moverName, to: mover?.name ?? null }];
  if (next !== b.status) changes.push({ field: "status", from: b.status, to: next });
  await write(
    b.id,
    {
      moverId: mover?.uid ?? null,
      moverName: mover?.name ?? null,
      ...(next !== b.status ? { status: next, acceptedAt: null } : {}),
    },
    changes,
  );
  if (mover) {
    await notifyUser(
      mover.uid,
      "New job assigned",
      `${b.bookingNumber} · ${b.addressLine} → ${b.toAddressLine}`,
      b.id,
      "job",
    ).catch(() => undefined);
    await notifyUser(
      b.customerId,
      "Crew assigned",
      `${mover.name} will handle your move (${b.bookingNumber}).`,
      b.id,
    ).catch(() => undefined);
  }
}

/** Sets the confirmed price (no longer an estimate). The page double-confirms when priceLocked(). */
export async function setBookingPrice(b: Booking, total: number) {
  const price = Math.max(0, Math.round(total * 100) / 100);
  await write(b.id, { totalPrice: price, priceIsEstimate: false }, [
    { field: "price", from: gbp(b.totalPrice), to: gbp(price) },
  ]);
  await notifyUser(
    b.customerId,
    "Price updated",
    `Your booking ${b.bookingNumber} total is now £${price.toFixed(2)}.`,
    b.id,
    "payment",
  ).catch(() => undefined);
}

/** Payment, with `paidAt` / `paidBy` when it becomes paid (cleared when it goes back to unpaid). */
export async function setBookingPayment(
  b: Booking,
  paymentStatus: PaymentStatus,
  paymentMethod: PaymentMethod,
) {
  const paid: Raw =
    paymentStatus === "paid"
      ? { paidAt: Timestamp.now(), paidBy: staffEmail() }
      : paymentStatus === "unpaid"
        ? { paidAt: null, paidBy: null }
        : {};
  await write(b.id, { paymentStatus, paymentMethod, ...paid }, [
    { field: "payment", from: `${b.paymentStatus} (${b.paymentMethod})`, to: `${paymentStatus} (${paymentMethod})` },
  ]);
  if (paymentStatus === "paid") {
    await notifyUser(
      b.customerId,
      "Payment received",
      `Thank you. Payment for ${b.bookingNumber} is recorded.`,
      b.id,
      "payment",
    ).catch(() => undefined);
  }
}

/** The office note goes to bookingsPrivate/{id}; the old note on the booking itself is cleared. */
export async function setBookingNote(b: Booking, note: string) {
  const db = getFirebaseDb();
  const by = staffEmail();
  const batch = writeBatch(db);
  batch.set(
    doc(db, PRIVATE, b.id),
    { adminNote: note.trim() || null, updatedAt: new Date().toISOString(), updatedBy: by },
    { merge: true },
  );
  if (b.adminNote !== null) batch.update(doc(db, BOOKINGS, b.id), { adminNote: null, updatedBy: by });
  batch.set(doc(collection(db, PRIVATE, b.id, "history")), {
    field: "note",
    from: null,
    to: note.trim() ? "edited" : "cleared",
    by,
    at: new Date().toISOString(),
  });
  await batch.commit();
}

/** The office side of a booking: its note (the legacy field when there is no private one) and history. */
export function subscribeBookingPrivate(
  b: Pick<Booking, "id" | "adminNote">,
  onData: (p: BookingPrivate) => void,
  onError?: (e: Error) => void,
): Unsubscribe {
  const db = getFirebaseDb();
  let note: string | null | undefined;
  let history: BookingHistoryEntry[] = [];
  const push = () => onData({ adminNote: note ?? b.adminNote, history });
  const offNote = onSnapshot(
    doc(db, PRIVATE, b.id),
    (s) => {
      const d = (s.data() ?? {}) as Raw;
      note = "adminNote" in d ? (d.adminNote ? str(d.adminNote) : null) : undefined;
      push();
    },
    (e) => onError?.(e),
  );
  const offHistory = onSnapshot(
    query(collection(db, PRIVATE, b.id, "history"), orderBy("at", "desc")),
    (s) => {
      history = s.docs.map((d) => {
        const x = d.data() as Raw;
        return {
          id: d.id,
          field: str(x.field, "status") as BookingHistoryEntry["field"],
          from: x.from == null ? null : str(x.from),
          to: x.to == null ? null : str(x.to),
          by: str(x.by),
          at: str(x.at),
        };
      });
      push();
    },
    (e) => onError?.(e),
  );
  return () => {
    offNote();
    offHistory();
  };
}

export async function approveDateChange(b: Booking) {
  if (!b.moveRequestedFrom) return;
  await write(
    b.id,
    {
      scheduledDate: Timestamp.fromDate(new Date(b.moveRequestedFrom)),
      moveRequestedAt: null,
      moveRequestedFrom: null,
    },
    [{ field: "date", from: b.scheduledDate.slice(0, 10), to: b.moveRequestedFrom.slice(0, 10) }],
  );
  await notifyUser(
    b.customerId,
    "New date confirmed",
    `Your move ${b.bookingNumber} has moved to the date you asked for.`,
    b.id,
  ).catch(() => undefined);
}

export async function declineDateChange(b: Booking) {
  await write(b.id, { moveRequestedAt: null, moveRequestedFrom: null });
  await notifyUser(
    b.customerId,
    "Date change not possible",
    `We could not move ${b.bookingNumber}. Your original date stands. Call us to talk it through.`,
    b.id,
  ).catch(() => undefined);
}

/** Soft delete: the booking stays (and the customer still sees it); the office lists hide it. */
export async function archiveBooking(b: Booking, archived: boolean) {
  await write(
    b.id,
    archived
      ? { archived: true, archivedAt: Timestamp.now(), archivedBy: staffEmail() }
      : { archived: false, archivedAt: null, archivedBy: null },
    [{ field: "archived", from: String(b.archived), to: String(archived) }],
  );
}

/** Hard delete, only for unpaid bookings (firestore.rules refuses paid and refunded ones). */
export async function deleteBooking(b: Booking) {
  if (!canHardDelete(b)) throw new Error("A paid booking is kept for the records. Archive it instead.");
  for (const path of b.requestPhotoPaths) {
    await deleteObject(storageRef(getFirebaseStorageClient(), path)).catch(() => undefined);
  }
  await deleteDoc(doc(getFirebaseDb(), BOOKINGS, b.id));
}

// ------------------------------------------------------------------ catalogue

export function mapService(id: string, d: Raw): ServiceItem {
  return {
    id,
    name: str(d.name),
    category: str(d.category, "Home & Flat Moves"),
    description: str(d.description),
    hourlyPrice: num(d.hourlyPrice),
    helperHourPrice: num(d.helperHourPrice, 20),
    minHours: num(d.minHours, 2),
    helperOptions: Array.isArray(d.helperOptions)
      ? (d.helperOptions as unknown[]).map((n) => num(n, 0))
      : [0, 1, 2],
    active: d.active !== false,
    sortOrder: num(d.sortOrder),
  };
}

export function subscribeServices(
  onData: (rows: ServiceItem[]) => void,
  onError?: (e: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(getFirebaseDb(), "services"),
    (s) =>
      onData(
        s.docs
          .map((d) => mapService(d.id, d.data() as Raw))
          .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
      ),
    (e) => onError?.(e),
  );
}

export async function saveService(s: ServiceItem) {
  const { id, ...rest } = s;
  await setDoc(doc(getFirebaseDb(), "services", id), rest, { merge: true });
}

export async function removeService(id: string) {
  await deleteDoc(doc(getFirebaseDb(), "services", id));
}

/** serviceSettings/default.announcement (the band the site and app show; point 42). */
export function mapAnnouncement(v: unknown): Announcement {
  if (!v || typeof v !== "object") return { ...NO_ANNOUNCEMENT };
  const a = v as Raw;
  return {
    on: a.on === true,
    text: str(a.text).slice(0, 200),
    href: str(a.href).slice(0, 300),
    tone: a.tone === "alert" ? "alert" : "info",
    until: iso(a.until) ?? "",
  };
}

export function subscribeServiceSettings(
  onData: (s: ServiceSettings) => void,
  onError?: (e: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(getFirebaseDb(), "serviceSettings", "default"),
    (s) => {
      const d = (s.data() ?? {}) as Raw;
      onData({
        addons: Array.isArray(d.addons)
          ? (d.addons as Raw[]).map((a) => ({
              id: str(a.id),
              name: str(a.name),
              price: num(a.price),
            }))
          : [],
        timeSlots: strArr(d.timeSlots),
        maxMovers: num(d.maxMovers, 4),
        notice: str(d.notice),
        announcement: mapAnnouncement(d.announcement),
      });
    },
    (e) => onError?.(e),
  );
}

/** Addons, slots and limits (owner / finance in the rules). The announcement is saved on its own. */
export async function saveServiceSettings(s: ServiceSettings) {
  const { announcement: _band, ...rest } = s;
  void _band;
  await setDoc(doc(getFirebaseDb(), "serviceSettings", "default"), rest, { merge: true });
}

/** The announcement band; any staff role may change it (firestore.rules). */
export async function saveAnnouncement(a: Announcement) {
  await setDoc(
    doc(getFirebaseDb(), "serviceSettings", "default"),
    { announcement: { ...a, text: a.text.trim().slice(0, 200), href: a.href.trim().slice(0, 300) }, updatedAt: new Date().toISOString() },
    { merge: true },
  );
}

// ------------------------------------------------------------------ reviews (office moderation)

export type ReviewStatus = "pending" | "approved" | "hidden";
export type BookingReview = {
  id: string;
  customerId: string;
  bookingId: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  moderatedBy: string | null;
  createdAt: string;
};

/** Staff: every review, newest first (Alpha app's reviews_tab). */
export function subscribeReviews(
  onData: (rows: BookingReview[]) => void,
  onError?: (e: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(getFirebaseDb(), "reviews"), orderBy("createdAt", "desc")),
    (s) =>
      onData(
        s.docs.map((d) => {
          const x = d.data() as Raw;
          return {
            id: d.id,
            customerId: str(x.customerId),
            bookingId: str(x.bookingId),
            rating: num(x.rating),
            comment: str(x.comment),
            status: x.status === "approved" || x.status === "hidden" ? x.status : "pending",
            moderatedBy: x.moderatedBy ? str(x.moderatedBy) : null,
            createdAt: iso(x.createdAt) ?? "",
          };
        }),
      ),
    (e) => onError?.(e),
  );
}

/** Approve (may be shown on the site) or hide. The public site reads approved ones on the server. */
export async function setReviewStatus(id: string, status: ReviewStatus) {
  await updateDoc(doc(getFirebaseDb(), "reviews", id), {
    status,
    moderatedBy: staffEmail(),
    moderatedAt: new Date().toISOString(),
  });
}

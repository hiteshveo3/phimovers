/**
 * Bookings (Alpha Movers style). Field names are the contract shared with the
 * Flutter app — see docs/BOOKINGS.md and firestore.rules before changing any.
 */

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "accepted"
  | "en_route"
  | "in_progress"
  | "completed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "paid" | "refunded";
export type PaymentMethod = "bank_transfer" | "cash" | "card";

export type BookingAddon = { id: string; name: string; price: number };

export type JobPhoto = {
  url: string;
  path: string;
  kind: "before" | "after";
  by: string;
  at: string;
};

export type Booking = {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  hours: number;
  moversCount: number;
  basePrice: number;
  addonsPrice: number;
  selectedAddons: BookingAddon[];
  totalPrice: number;
  /** ISO string (date of the move). */
  scheduledDate: string;
  scheduledTime: string;
  addressLine: string;
  toAddressLine: string;
  fromFloor: string;
  toFloor: string;
  fromLift: boolean;
  toLift: boolean;
  parking: string;
  heavyItems: string[];
  specialInstructions: string;
  requestPhotos: string[];
  requestPhotoPaths: string[];
  jobPhotos: JobPhoto[];
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  moverId: string | null;
  moverName: string | null;
  acceptedAt: string | null;
  enRouteAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  moveRequestedAt: string | null;
  moveRequestedFrom: string | null;
  /**
   * Legacy only: the office note now lives in bookingsPrivate/{id} (staff only), because customers and
   * movers can read this document. Read it when the private note is empty; never write it.
   */
  adminNote: string | null;
  /** The price the customer saw is an estimate until the office confirms it (always true on create). */
  priceIsEstimate: boolean;
  /** When and by whom (staff email) the payment was recorded (AUDIT D10). */
  paidAt: string | null;
  paidBy: string | null;
  /** Soft delete (AUDIT D12): hidden from the office lists, never removed. */
  archived: boolean;
  archivedAt: string | null;
  archivedBy: string | null;
  /** Staff email of the last office change. */
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

/** One entry of bookingsPrivate/{id}/history (staff only, append-only in the rules). */
export type BookingHistoryEntry = {
  id: string;
  field: "status" | "price" | "payment" | "mover" | "date" | "archived" | "note";
  from: string | null;
  to: string | null;
  /** Staff email; the rules require it to be the writer's own. */
  by: string;
  at: string;
};

/** bookingsPrivate/{id}: what only the office may read. */
export type BookingPrivate = {
  adminNote: string | null;
  history: BookingHistoryEntry[];
};

export type BookingInput = {
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  hours: number;
  moversCount: number;
  basePrice: number;
  selectedAddons: BookingAddon[];
  scheduledDate: Date;
  scheduledTime: string;
  addressLine: string;
  toAddressLine: string;
  fromFloor: string;
  toFloor: string;
  fromLift: boolean;
  toLift: boolean;
  parking: string;
  heavyItems: string[];
  specialInstructions: string;
  paymentMethod: PaymentMethod;
};

export type Mover = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "suspended";
};

export type ServiceItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Van + driver, £ per hour. */
  hourlyPrice: number;
  /** Each extra helper, £ per hour. */
  helperHourPrice: number;
  minHours: number;
  /** Helper counts offered (0 = driver only). */
  helperOptions: number[];
  active: boolean;
  sortOrder: number;
};

export type ServiceSettings = {
  addons: BookingAddon[];
  timeSlots: string[];
  maxMovers: number;
  notice: string;
  /** The office announcement band under the header on the site and in the app (Alpha). */
  announcement?: Announcement;
};

export type Announcement = {
  on: boolean;
  text: string;
  /** Optional link: a site path ("/book") or an https URL. */
  href: string;
  /** "info" (lime) or "alert" (amber), as on Alpha. */
  tone: "info" | "alert";
  /** ISO date-time after which it stops showing; empty = no end. */
  until: string;
};

export const NO_ANNOUNCEMENT: Announcement = { on: false, text: "", href: "", tone: "info", until: "" };

/** Whether the band shows now: on, has text, not past its end. */
export const announcementLive = (a: Announcement, now = Date.now()) =>
  a.on && a.text.trim() !== "" && (!a.until || new Date(a.until).getTime() > now);

export type BookingNotification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: "booking" | "job" | "payment" | "system";
  bookingId?: string;
  isRead: boolean;
  createdAt: string;
};

export const BOOKING_STATUSES: {
  value: BookingStatus;
  label: string;
  /** css modifier for .ad-badge.bk-* (admin) */
  tone: string;
}[] = [
  { value: "pending", label: "Pending", tone: "bk-pending" },
  { value: "confirmed", label: "Confirmed", tone: "bk-confirmed" },
  { value: "accepted", label: "Crew accepted", tone: "bk-confirmed" },
  { value: "en_route", label: "On the way", tone: "bk-live" },
  { value: "in_progress", label: "In progress", tone: "bk-live" },
  { value: "completed", label: "Completed", tone: "bk-done" },
  { value: "cancelled", label: "Cancelled", tone: "bk-cancelled" },
];

export function bookingStatusMeta(status: BookingStatus) {
  return BOOKING_STATUSES.find((s) => s.value === status) ?? BOOKING_STATUSES[0];
}

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
];

export const FLOORS = ["Ground", "1st", "2nd", "3rd", "4th", "5th or higher"];

export const DEFAULT_TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

export const HEAVY_ITEMS = [
  "Piano",
  "Safe",
  "American fridge",
  "Large wardrobe",
  "Pool table",
  "Gym equipment",
];

/** Customer-visible reference, e.g. PHI-7KQ2MD. */
export function makeBookingNumber() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "PHI-";
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

/** Time price: (van + helpers) per hour, never fewer than minHours. */
export function priceFor(
  svc: Pick<ServiceItem, "hourlyPrice" | "helperHourPrice" | "minHours">,
  hours: number,
  helpers: number,
) {
  const h = Math.max(hours, svc.minHours);
  return h * (svc.hourlyPrice + helpers * svc.helperHourPrice);
}

/** Same figures as kit/site-facts.ts RATES; used until an admin saves services. */
export const DEFAULT_SERVICES: ServiceItem[] = [
  { id: "small-van", name: "Small van", category: "Home & Flat Moves", description: "Boxes and single items.", hourlyPrice: 50, helperHourPrice: 20, minHours: 2, helperOptions: [0, 1, 2], active: true, sortOrder: 1 },
  { id: "transit-van", name: "Transit van", category: "Home & Flat Moves", description: "A sofa or a studio move.", hourlyPrice: 55, helperHourPrice: 20, minHours: 2, helperOptions: [0, 1, 2, 3], active: true, sortOrder: 2 },
  { id: "luton-van", name: "Luton van", category: "Home & Flat Moves", description: "Flats and house moves.", hourlyPrice: 65, helperHourPrice: 20, minHours: 2, helperOptions: [1, 2, 3], active: true, sortOrder: 3 },
];

export function gbp(n: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export function formatMoveDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Next status an admin or mover would move a booking to. */
export const NEXT_STATUS: Partial<Record<BookingStatus, BookingStatus>> = {
  pending: "confirmed",
  confirmed: "accepted",
  accepted: "en_route",
  en_route: "in_progress",
  in_progress: "completed",
};

export function canCancel(b: Pick<Booking, "status">) {
  return b.status !== "completed" && b.status !== "cancelled";
}

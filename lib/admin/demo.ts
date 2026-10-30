/**
 * Development-only demo mode for the staff dashboard.
 *
 * Turn on with NEXT_PUBLIC_ADMIN_DEMO=1 (needs a dev-server restart) or, without a restart,
 * `localStorage.setItem("phi-admin-demo", "1")` on localhost. It is ALWAYS off in production builds.
 * It swaps Firebase for an in-memory store with sample leads, so the dashboard can be previewed
 * without keys. Nothing is written anywhere.
 */
import type { Lead, LeadActivity, LeadStatus } from "@/lib/leads/types";

export const DEMO_KEY = "phi-admin-demo";

export function isDemo(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  if (process.env.NEXT_PUBLIC_ADMIN_DEMO === "1") return true;
  try {
    return (
      typeof window !== "undefined" &&
      window.localStorage.getItem(DEMO_KEY) === "1"
    );
  } catch {
    return false;
  }
}

export const DEMO_USER = {
  uid: "demo-user",
  email: "demo@phimovers.test",
  displayName: "Demo Staff",
};

/* ---------------------------- sample leads ---------------------------- */

const DAY = 864e5;

function iso(offsetDays: number, hour = 10, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function ymd(offsetDays: number) {
  const d = new Date(Date.now() + offsetDays * DAY);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function act(text: string, at: string, type: LeadActivity["type"] = "status") {
  return { id: `a_${at}_${type}`, at, type, text };
}

type Seed = {
  n: string;
  p: string;
  e?: string;
  from: string;
  to: string;
  size: string;
  svc: string;
  src: string;
  st: LeadStatus;
  ago: number; // days ago created
  hr?: number;
  q?: string;
  move?: number; // days from today
  urgent?: boolean;
  who?: string;
  lost?: string;
};

const SEEDS: Seed[] = [
  { n: "Amelia Hart", p: "07700 900101", e: "amelia.hart@example.com", from: "E12 6PQ", to: "IG1 2AB", size: "2 bed flat", svc: "House & residential moves", src: "/services/house-removals", st: "new", ago: 0, hr: 0, urgent: true, move: 1 },
  { n: "Daniel Okafor", p: "07700 900102", from: "RM8 2UT", to: "SE15 4AL", size: "1 bed flat", svc: "Sofa, furniture & single items", src: "/", st: "new", ago: 0, hr: 6 },
  { n: "Priya Nair", p: "07700 900103", e: "priya.n@example.com", from: "N16 7XY", to: "N4 2QQ", size: "Studio", svc: "Man and van", src: "/areas/hackney", st: "new", ago: 1, hr: 9 },
  { n: "Tom Whitfield", p: "07700 900104", e: "tom.w@example.com", from: "IG11 8DD", to: "CM14 4AB", size: "3 bed house", svc: "House & residential moves", src: "/pricing", st: "contacted", ago: 1, hr: 14, who: "Demo Staff" },
  { n: "Grace Lin", p: "07700 900105", from: "E3 4TT", to: "E17 9PL", size: "2 bed flat", svc: "Packing & storage", src: "/services/packing-and-storage", st: "quoted", ago: 2, q: "£420", move: 6 },
  { n: "Hassan Ali", p: "07700 900106", e: "hassan.ali@example.com", from: "BR1 3EE", to: "DA5 1RT", size: "4 bed house", svc: "House & residential moves", src: "/areas/bromley", st: "booked", ago: 3, q: "£780", move: 2, who: "Demo Staff" },
  { n: "Sophie Clarke", p: "07700 900107", e: "sophie.c@example.com", from: "SW9 8HJ", to: "SW18 2PQ", size: "1 bed flat", svc: "Sofa, furniture & single items", src: "/services/furniture-delivery", st: "booked", ago: 4, q: "£160", move: 4 },
  { n: "Marcus Bell", p: "07700 900108", from: "W3 9FF", to: "UB1 1AA", size: "Small office", svc: "Business & office", src: "/services/office-removals", st: "quoted", ago: 4, q: "£1,150", move: 12 },
  { n: "Elena Rossi", p: "07700 900109", e: "elena.r@example.com", from: "NW6 3AB", to: "NW10 4CD", size: "2 bed flat", svc: "House & residential moves", src: "/", st: "booked", ago: 5, q: "£390", move: 9, who: "Demo Staff" },
  { n: "Jamal Brown", p: "07700 900110", from: "E6 1ZZ", to: "E13 0PP", size: "Studio", svc: "Man and van", src: "/areas/newham", st: "lost", ago: 6, q: "£140", lost: "Price too high" },
  { n: "Katie Moore", p: "07700 900111", e: "katie.m@example.com", from: "SE1 7TT", to: "SE23 3AA", size: "3 bed flat", svc: "House & residential moves", src: "/services/house-removals", st: "contacted", ago: 7, hr: 11 },
  { n: "Omar Sheikh", p: "07700 900112", from: "IG3 9AA", to: "RM1 3BB", size: "2 bed house", svc: "Specialist & vehicle", src: "/services/piano-removals", st: "quoted", ago: 8, q: "£520" },
  { n: "Rachel Green", p: "07700 900113", e: "rachel.g@example.com", from: "CR0 2AA", to: "KT1 1BB", size: "1 bed flat", svc: "Man and van", src: "/", st: "lost", ago: 9, lost: "Booked elsewhere" },
  { n: "Ben Taylor", p: "07700 900114", from: "TW1 3CC", to: "HA2 0DD", size: "Studio", svc: "Sofa, furniture & single items", src: "/areas/richmond-upon-thames", st: "booked", ago: 10, q: "£110", move: -2 },
  { n: "Nadia Khan", p: "07700 900115", e: "nadia.k@example.com", from: "E1 6AN", to: "E14 5AB", size: "2 bed flat", svc: "Packing & storage", src: "/pricing", st: "contacted", ago: 12, hr: 15 },
  { n: "Chris Evans", p: "07700 900116", from: "N1 9GU", to: "N22 6TT", size: "3 bed house", svc: "House & residential moves", src: "/", st: "lost", ago: 15, lost: "No reply" },
  { n: "Isla Murray", p: "07700 900117", e: "isla.m@example.com", from: "SW4 7AA", to: "SW2 5BB", size: "1 bed flat", svc: "Man and van", src: "/services/man-and-van", st: "booked", ago: 18, q: "£240", move: -9 },
  { n: "Victor Adeyemi", p: "07700 900118", from: "E15 2AB", to: "E7 8CD", size: "4 bed house", svc: "House & residential moves", src: "/areas/newham", st: "quoted", ago: 21, q: "£860" },
  { n: "Hannah Price", p: "07700 900119", e: "hannah.p@example.com", from: "SE9 1AA", to: "SE12 0BB", size: "2 bed flat", svc: "Business & office", src: "/services/office-removals", st: "lost", ago: 25, lost: "Date changed / cancelled" },
];

export function makeDemoLeads(): Lead[] {
  return SEEDS.map((s, i) => {
    const created = iso(-s.ago, s.hr ?? 10 + (i % 6), (i * 7) % 60);
    // "new today" leads should be recent: pin them to N hours ago
    const createdAt =
      s.ago === 0 && s.hr !== undefined
        ? new Date(Date.now() - (s.hr + 0.2) * 36e5).toISOString()
        : created;
    const base: Lead = {
      id: `demo${String(i + 1).padStart(2, "0")}`,
      name: s.n,
      phone: s.p,
      email: s.e,
      from: s.from,
      to: s.to,
      date: s.move !== undefined ? ymd(s.move) : undefined,
      propertySize: s.size,
      service: s.svc,
      source: s.src,
      status: s.st,
      priority: s.urgent ? "urgent" : "normal",
      assignedTo: s.who,
      tags: [],
      trackCode: `D${String(i + 1).padStart(2, "0")}XYZ`.slice(0, 6),
      createdAt,
      updatedAt: createdAt,
      notes:
        s.st === "quoted" || s.st === "booked"
          ? [
              {
                id: `n_${i}`,
                text: "Customer sent photos. Ground floor, easy parking.",
                createdAt,
                authorEmail: DEMO_USER.email,
              },
            ]
          : [],
      activity: [act("Lead created from website quote", createdAt, "created")],
      quoteAmount: s.q,
      lostReason: s.lost,
    };
    if (s.st !== "new")
      base.activity.push(act(`Status → ${s.st}`, createdAt, "status"));
    return base;
  });
}

/* ---------------------------- in-memory store ---------------------------- */

let leadStore: Lead[] | null = null;
const listeners = new Set<() => void>();

function store(): Lead[] {
  if (!leadStore) leadStore = makeDemoLeads();
  return leadStore;
}

function emit() {
  listeners.forEach((fn) => fn());
}

export function demoGetLeads(): Lead[] {
  return [...store()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function demoGetLead(id: string): Lead | null {
  return store().find((l) => l.id === id) ?? null;
}

export function demoSubscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function demoPatch(
  id: string,
  data: Record<string, unknown>,
  activity?: LeadActivity,
  note?: Lead["notes"][number],
) {
  leadStore = store().map((l) => {
    if (l.id !== id) return l;
    const next: Record<string, unknown> = { ...l };
    for (const [k, v] of Object.entries(data)) next[k] = v === null ? undefined : v;
    const out = next as unknown as Lead;
    if (activity) out.activity = [...l.activity, activity];
    if (note) out.notes = [...l.notes, note];
    return out;
  });
  emit();
}

export function demoDelete(id: string) {
  leadStore = store().filter((l) => l.id !== id);
  emit();
}

/* ---------------------------- invoices store ---------------------------- */

let invoiceStore: unknown[] | null = null;
const invListeners = new Set<() => void>();

export function demoInvoices<T>(seed: () => T[]): T[] {
  if (!invoiceStore) invoiceStore = seed();
  return invoiceStore as T[];
}

export function demoSetInvoices<T>(next: T[]) {
  invoiceStore = next;
  invListeners.forEach((fn) => fn());
}

export function demoSubscribeInvoices(fn: () => void): () => void {
  invListeners.add(fn);
  return () => {
    invListeners.delete(fn);
  };
}

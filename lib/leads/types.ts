export type LeadStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "booked"
  | "lost";

export type LeadPriority = "normal" | "urgent";

export type LeadNote = {
  id: string;
  text: string;
  createdAt: string;
  authorEmail?: string;
};

export type LeadActivity = {
  id: string;
  at: string;
  type: "status" | "priority" | "assignee" | "quote" | "note" | "created";
  text: string;
  authorEmail?: string;
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  from: string;
  to: string;
  date?: string;
  propertySize: string;
  service: string;
  source: string;
  status: LeadStatus;
  priority: LeadPriority;
  assignedTo?: string;
  tags: string[];
  trackCode: string;
  createdAt: string;
  updatedAt: string;
  notes: LeadNote[];
  activity: LeadActivity[];
  quoteAmount?: string;
  lostReason?: string;
};

export type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  from: string;
  to: string;
  date?: string;
  propertySize: string;
  service: string;
  source: string;
  priority?: LeadPriority;
};

export const LEAD_STATUSES: {
  value: LeadStatus;
  label: string;
  color: string;
}[] = [
  { value: "new", label: "New", color: "bg-[#9fe870] text-[#163300]" },
  {
    value: "contacted",
    label: "Contacted",
    color: "bg-[#163300]/10 text-[#163300]",
  },
  {
    value: "quoted",
    label: "Quoted",
    color: "bg-amber-100 text-amber-900",
  },
  {
    value: "booked",
    label: "Booked",
    color: "bg-emerald-100 text-emerald-900",
  },
  { value: "lost", label: "Lost", color: "bg-stone-200 text-stone-600" },
];

export function statusMeta(status: LeadStatus) {
  return LEAD_STATUSES.find((s) => s.value === status) ?? LEAD_STATUSES[0];
}

export function formatLeadTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function whatsappHrefForPhone(phone: string, text?: string) {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "44");
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/** Hours since created — for reply SLA. */
export function hoursSince(iso: string) {
  return (Date.now() - new Date(iso).getTime()) / 36e5;
}

export function slaLabel(lead: Lead): {
  label: string;
  tone: "ok" | "warn" | "late";
} {
  if (lead.status !== "new") return { label: "In progress", tone: "ok" };
  const h = hoursSince(lead.createdAt);
  if (h < 1) return { label: "Fresh", tone: "ok" };
  if (h < 4) return { label: `${Math.floor(h)}h waiting`, tone: "warn" };
  return { label: `${Math.floor(h)}h overdue`, tone: "late" };
}

export function isSameDay(iso: string, ref = new Date()) {
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

export function startOfWeek(ref = new Date()) {
  const d = new Date(ref);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** 6-char uppercase code for public quote tracking. */
export function makeTrackCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export function normalizePhoneDigits(phone: string) {
  return phone.replace(/\D/g, "").replace(/^0/, "44");
}

export function phonesMatch(a: string, b: string) {
  const x = normalizePhoneDigits(a);
  const y = normalizePhoneDigits(b);
  if (!x || !y) return false;
  return x === y || x.endsWith(y) || y.endsWith(x);
}

export type PublicLeadView = {
  trackCode: string;
  status: LeadStatus;
  service: string;
  from: string;
  to: string;
  date?: string;
  quoteAmount?: string;
  updatedAt: string;
  createdAt: string;
  nameFirst: string;
};

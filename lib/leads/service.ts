"use client";

import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import type {
  Lead,
  LeadActivity,
  LeadInput,
  LeadNote,
  LeadPriority,
  LeadStatus,
} from "@/lib/leads/types";
import { makeTrackCode } from "@/lib/leads/types";
import {
  demoDelete,
  demoGetLead,
  demoGetLeads,
  demoPatch,
  demoSubscribe,
  isDemo,
} from "@/lib/admin/demo";

const COL = "leads";
/** Staff-only twin of each lead (notes, activity, assignee); see "Office-only data" below. */
const PRIVATE = "leadsPrivate";

function mapLead(id: string, data: Record<string, unknown>): Lead {
  const notesRaw = Array.isArray(data.notes) ? data.notes : [];
  const notes: LeadNote[] = notesRaw.map((n, i) => {
    const note = n as Record<string, unknown>;
    return {
      id: String(note.id ?? `n_${i}`),
      text: String(note.text ?? ""),
      createdAt: String(note.createdAt ?? new Date().toISOString()),
      authorEmail: note.authorEmail ? String(note.authorEmail) : undefined,
    };
  });

  const activityRaw = Array.isArray(data.activity) ? data.activity : [];
  const activity: LeadActivity[] = activityRaw.map((a, i) => {
    const row = a as Record<string, unknown>;
    return {
      id: String(row.id ?? `a_${i}`),
      at: String(row.at ?? new Date().toISOString()),
      type: (row.type as LeadActivity["type"]) || "status",
      text: String(row.text ?? ""),
      authorEmail: row.authorEmail ? String(row.authorEmail) : undefined,
    };
  });

  const ts = (v: unknown, fallback: string) => {
    if (typeof v === "string") return v;
    if (v && typeof v === "object" && "toDate" in (v as object)) {
      return (v as { toDate: () => Date }).toDate().toISOString();
    }
    return fallback;
  };

  const createdAt = ts(data.createdAt, new Date().toISOString());

  return {
    id,
    name: String(data.name ?? ""),
    phone: String(data.phone ?? ""),
    email: data.email ? String(data.email) : undefined,
    from: String(data.from ?? ""),
    to: String(data.to ?? ""),
    date: data.date ? String(data.date) : undefined,
    propertySize: String(data.propertySize ?? ""),
    service: String(data.service ?? ""),
    source: String(data.source ?? "/"),
    status: (data.status as LeadStatus) || "new",
    priority: (data.priority as LeadPriority) || "normal",
    assignedTo: data.assignedTo ? String(data.assignedTo) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    trackCode: String(data.trackCode ?? ""),
    ownerUid: data.ownerUid ? String(data.ownerUid) : undefined,
    createdAt,
    updatedAt: ts(data.updatedAt, createdAt),
    notes,
    activity,
    quoteAmount: data.quoteAmount ? String(data.quoteAmount) : undefined,
    lostReason: data.lostReason ? String(data.lostReason) : undefined,
  };
}

function activityEntry(
  type: LeadActivity["type"],
  text: string,
  authorEmail?: string,
): LeadActivity {
  return {
    id: `a_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
    type,
    text,
    authorEmail,
  };
}

export async function createLead(
  input: LeadInput,
): Promise<{ id: string; trackCode: string }> {
  const db = getFirebaseDb();
  const now = new Date().toISOString();
  const priority = input.priority ?? "normal";
  const trackCode = makeTrackCode();
  const created = activityEntry("created", "Lead created from website quote");
  const ref = await addDoc(collection(db, COL), {
    name: input.name,
    phone: input.phone,
    email: input.email?.trim() || null,
    from: input.from,
    to: input.to,
    date: input.date || null,
    propertySize: input.propertySize,
    service: input.service,
    source: input.source,
    status: "new",
    priority,
    trackCode,
    ownerUid: input.ownerUid || null,
    tags: [],
    notes: [],
    activity: [created],
    assignedTo: null,
    quoteAmount: null,
    lostReason: null,
    createdAt: now,
    updatedAt: now,
    createdAtServer: serverTimestamp(),
  });
  return { id: ref.id, trackCode };
}

/* ------------------------------------------------------------------ */
/* Office-only data                                                     */
/* ------------------------------------------------------------------ */
// Notes, activity (with staff emails) and the assignee live in leadsPrivate/{leadId}, which only staff can
// read (firestore.rules), because a signed-in customer can read their whole lead document. Older leads
// still carry them on the lead itself: both are read and merged, new writes go to leadsPrivate only, and
// scripts/migrate-office-private.mjs moves the old fields across.

type LeadPrivate = { notes: LeadNote[]; activity: LeadActivity[]; assignedTo?: string | null };

function mapPrivate(data: Record<string, unknown> | undefined): LeadPrivate {
  if (!data) return { notes: [], activity: [] };
  const base = mapLead("", data);
  return {
    notes: base.notes,
    activity: base.activity,
    ...("assignedTo" in data ? { assignedTo: data.assignedTo ? String(data.assignedTo) : null } : {}),
  };
}

/** The lead with its office data: old fields on the lead first, then the private ones. */
function withPrivate(lead: Lead, p: LeadPrivate | undefined): Lead {
  if (!p) return lead;
  const byTime = <T,>(list: T[], at: (x: T) => string) => [...list].sort((a, b) => at(a).localeCompare(at(b)));
  return {
    ...lead,
    notes: byTime([...lead.notes, ...p.notes], (n) => n.createdAt),
    activity: byTime([...lead.activity, ...p.activity], (a) => a.at),
    assignedTo: p.assignedTo !== undefined ? p.assignedTo ?? undefined : lead.assignedTo,
  };
}

/** Firestore refuses undefined values (authorEmail may be missing). */
const clean = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

export function subscribeLeads(
  onData: (leads: Lead[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  if (isDemo()) {
    const push = () => onData(demoGetLeads());
    const t = setTimeout(push, 0);
    const off = demoSubscribe(push);
    return () => {
      clearTimeout(t);
      off();
    };
  }
  const db = getFirebaseDb();
  let leads: Lead[] | null = null;
  let office = new Map<string, LeadPrivate>();
  const push = () => {
    if (leads) onData(leads.map((l) => withPrivate(l, office.get(l.id))));
  };
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const offLeads = onSnapshot(
    q,
    (snap) => {
      leads = snap.docs.map((d) => mapLead(d.id, d.data() as Record<string, unknown>));
      push();
    },
    (err) => onError?.(err),
  );
  const offPrivate = onSnapshot(
    collection(db, PRIVATE),
    (snap) => {
      office = new Map(snap.docs.map((d) => [d.id, mapPrivate(d.data() as Record<string, unknown>)]));
      push();
    },
    // Rules not published yet: the leads still show, with their older on-document notes.
    (err) => console.warn("leadsPrivate unavailable", err),
  );
  return () => {
    offLeads();
    offPrivate();
  };
}

/** Client portal — only leads owned by this uid. Needs Firestore index. Never reads office data. */
export function subscribeClientLeads(
  ownerUid: string,
  onData: (leads: Lead[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const db = getFirebaseDb();
  const q = query(
    collection(db, COL),
    where("ownerUid", "==", ownerUid),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(
    q,
    (snap) => {
      onData(
        snap.docs.map((d) =>
          mapLead(d.id, d.data() as Record<string, unknown>),
        ),
      );
    },
    (err) => onError?.(err),
  );
}

export function subscribeLead(
  id: string,
  onData: (lead: Lead | null) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  if (isDemo()) {
    const push = () => onData(demoGetLead(id));
    const t = setTimeout(push, 0);
    const off = demoSubscribe(push);
    return () => {
      clearTimeout(t);
      off();
    };
  }
  const db = getFirebaseDb();
  let lead: Lead | null | undefined;
  let office: LeadPrivate | undefined;
  const push = () => {
    if (lead !== undefined) onData(lead && withPrivate(lead, office));
  };
  const offLead = onSnapshot(
    doc(db, COL, id),
    (snap) => {
      lead = snap.exists() ? mapLead(snap.id, snap.data() as Record<string, unknown>) : null;
      push();
    },
    (err) => onError?.(err),
  );
  const offPrivate = onSnapshot(
    doc(db, PRIVATE, id),
    (snap) => {
      office = snap.exists() ? mapPrivate(snap.data() as Record<string, unknown>) : undefined;
      push();
    },
    (err) => console.warn("leadsPrivate unavailable", err),
  );
  return () => {
    offLead();
    offPrivate();
  };
}

export async function getLeadOnce(id: string): Promise<Lead | null> {
  if (isDemo()) return demoGetLead(id);
  const db = getFirebaseDb();
  const [snap, priv] = await Promise.all([getDoc(doc(db, COL, id)), getDoc(doc(db, PRIVATE, id))]);
  if (!snap.exists()) return null;
  const lead = mapLead(snap.id, snap.data() as Record<string, unknown>);
  return priv.exists() ? withPrivate(lead, mapPrivate(priv.data() as Record<string, unknown>)) : lead;
}

/**
 * A staff change: `data` on the lead (status, priority, quote, date: what the customer may see), `office`
 * and the activity entry on leadsPrivate/{id}, in one batch.
 */
async function patch(
  id: string,
  data: Record<string, unknown>,
  activity?: LeadActivity,
  office: Record<string, unknown> = {},
) {
  if (isDemo()) {
    demoPatch(id, { ...data, ...office, updatedAt: new Date().toISOString() }, activity);
    return;
  }
  const db = getFirebaseDb();
  const now = new Date().toISOString();
  const batch = writeBatch(db);
  batch.update(doc(db, COL, id), { ...data, updatedAt: now });
  batch.set(
    doc(db, PRIVATE, id),
    { ...office, updatedAt: now, ...(activity ? { activity: arrayUnion(clean(activity)) } : {}) },
    { merge: true },
  );
  await batch.commit();
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  lostReason?: string,
  authorEmail?: string,
) {
  await patch(
    id,
    {
      status,
      lostReason: status === "lost" ? lostReason?.trim() || null : null,
    },
    activityEntry(
      "status",
      status === "lost" && lostReason?.trim()
        ? `Status → ${status} (${lostReason.trim()})`
        : `Status → ${status}`,
      authorEmail,
    ),
  );
}

export async function updateLeadPriority(
  id: string,
  priority: LeadPriority,
  authorEmail?: string,
) {
  await patch(
    id,
    { priority },
    activityEntry("priority", `Priority → ${priority}`, authorEmail),
  );
}

export async function updateLeadQuote(
  id: string,
  quoteAmount: string,
  authorEmail?: string,
) {
  const q = quoteAmount.trim();
  await patch(
    id,
    { quoteAmount: q || null },
    activityEntry("quote", q ? `Quote set to ${q}` : "Quote cleared", authorEmail),
  );
}

/** The assignee is office data: leadsPrivate, and the old field on the lead is cleared. */
export async function updateLeadAssignee(
  id: string,
  assignedTo: string,
  authorEmail?: string,
) {
  const a = assignedTo.trim();
  await patch(
    id,
    { assignedTo: null },
    activityEntry(
      "assignee",
      a ? `Assigned to ${a}` : "Unassigned",
      authorEmail,
    ),
    { assignedTo: a || null },
  );
}

export async function updateLeadDate(
  id: string,
  date: string,
  authorEmail?: string,
) {
  const d = date.trim();
  await patch(
    id,
    { date: d || null },
    activityEntry("quote", d ? `Move date set to ${d}` : "Move date cleared", authorEmail),
  );
}

export async function addLeadNote(
  id: string,
  text: string,
  authorEmail?: string,
) {
  const note: LeadNote = {
    id: `n_${Date.now()}`,
    text: text.trim(),
    createdAt: new Date().toISOString(),
    authorEmail,
  };
  if (isDemo()) {
    demoPatch(
      id,
      { updatedAt: new Date().toISOString() },
      activityEntry("note", "Note added", authorEmail),
      note,
    );
    return;
  }
  const db = getFirebaseDb();
  const now = new Date().toISOString();
  const batch = writeBatch(db);
  batch.update(doc(db, COL, id), { updatedAt: now });
  batch.set(
    doc(db, PRIVATE, id),
    {
      notes: arrayUnion(clean(note)),
      activity: arrayUnion(clean(activityEntry("note", "Note added", authorEmail))),
      updatedAt: now,
    },
    { merge: true },
  );
  await batch.commit();
}

export async function bulkUpdateLeadStatus(
  ids: string[],
  status: LeadStatus,
  authorEmail?: string,
) {
  if (ids.length === 0) return;
  if (isDemo()) {
    for (const id of ids)
      demoPatch(
        id,
        { status, lostReason: null, updatedAt: new Date().toISOString() },
        activityEntry("status", `Status → ${status} (bulk)`, authorEmail),
      );
    return;
  }
  const db = getFirebaseDb();
  // Firestore batches max 500 writes; two per lead.
  for (let i = 0; i < ids.length; i += 200) {
    const chunk = ids.slice(i, i + 200);
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    for (const id of chunk) {
      batch.update(doc(db, COL, id), {
        status,
        lostReason: null,
        updatedAt: now,
      });
      batch.set(
        doc(db, PRIVATE, id),
        {
          updatedAt: now,
          activity: arrayUnion(clean(activityEntry("status", `Status → ${status} (bulk)`, authorEmail))),
        },
        { merge: true },
      );
    }
    await batch.commit();
  }
}

export async function deleteLead(id: string) {
  if (isDemo()) {
    demoDelete(id);
    return;
  }
  const db = getFirebaseDb();
  const batch = writeBatch(db);
  batch.delete(doc(db, COL, id));
  batch.delete(doc(db, PRIVATE, id));
  await batch.commit();
}

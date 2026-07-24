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

const COL = "leads";

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

export function subscribeLeads(
  onData: (leads: Lead[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const db = getFirebaseDb();
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
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

/** Client portal — only leads owned by this uid. Needs Firestore index. */
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
  const db = getFirebaseDb();
  return onSnapshot(
    doc(db, COL, id),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      onData(mapLead(snap.id, snap.data() as Record<string, unknown>));
    },
    (err) => onError?.(err),
  );
}

export async function getLeadOnce(id: string): Promise<Lead | null> {
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return mapLead(snap.id, snap.data() as Record<string, unknown>);
}

async function patch(
  id: string,
  data: Record<string, unknown>,
  activity?: LeadActivity,
) {
  const db = getFirebaseDb();
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: new Date().toISOString(),
    ...(activity ? { activity: arrayUnion(activity) } : {}),
  });
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

export async function updateLeadAssignee(
  id: string,
  assignedTo: string,
  authorEmail?: string,
) {
  const a = assignedTo.trim();
  await patch(
    id,
    { assignedTo: a || null },
    activityEntry(
      "assignee",
      a ? `Assigned to ${a}` : "Unassigned",
      authorEmail,
    ),
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
  const db = getFirebaseDb();
  await updateDoc(doc(db, COL, id), {
    notes: arrayUnion(note),
    activity: arrayUnion(
      activityEntry("note", "Note added", authorEmail),
    ),
    updatedAt: new Date().toISOString(),
  });
}

export async function bulkUpdateLeadStatus(
  ids: string[],
  status: LeadStatus,
  authorEmail?: string,
) {
  if (ids.length === 0) return;
  const db = getFirebaseDb();
  // Firestore batches max 500
  for (let i = 0; i < ids.length; i += 450) {
    const chunk = ids.slice(i, i + 450);
    const batch = writeBatch(db);
    const now = new Date().toISOString();
    for (const id of chunk) {
      batch.update(doc(db, COL, id), {
        status,
        lostReason: null,
        updatedAt: now,
        activity: arrayUnion(
          activityEntry("status", `Status → ${status} (bulk)`, authorEmail),
        ),
      });
    }
    await batch.commit();
  }
}

export async function deleteLead(id: string) {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, COL, id));
}

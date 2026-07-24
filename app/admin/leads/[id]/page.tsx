"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import CopyPhoneButton from "@/components/admin/CopyPhoneButton";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import LostReasonSheet from "@/components/admin/LostReasonSheet";
import SlaBadge from "@/components/admin/SlaBadge";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { Icon } from "@/components/icons";
import {
  addLeadNote,
  deleteLead,
  subscribeLead,
  updateLeadAssignee,
  updateLeadPriority,
  updateLeadQuote,
  updateLeadStatus,
} from "@/lib/leads/service";
import { WA_TEMPLATES } from "@/lib/leads/templates";
import {
  formatLeadTime,
  LEAD_STATUSES,
  whatsappHrefForPhone,
  type Lead,
  type LeadStatus,
} from "@/lib/leads/types";

export default function AdminLeadDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const router = useRouter();
  const { user } = useAdminAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [quote, setQuote] = useState("");
  const [assignee, setAssignee] = useState("");
  const [busy, setBusy] = useState(false);
  const [lostOpen, setLostOpen] = useState(false);

  const author = user?.email ?? undefined;
  const me =
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    user?.email ||
    "";

  useEffect(() => {
    try {
      return subscribeLead(
        id,
        (row) => {
          setLead(row);
          if (row) {
            setQuote(row.quoteAmount ?? "");
            setAssignee(row.assignedTo ?? "");
          }
          if (row === null) setError("Lead not found");
        },
        (err) => setError(err.message),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  }, [id]);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  if (!lead && !error) {
    return (
      <p className="py-16 text-center text-sm text-muted">Loading lead…</p>
    );
  }

  if (!lead) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-muted">{error || "Not found"}</p>
        <button
          type="button"
          onClick={() => router.push("/admin/leads")}
          className="btn mt-4 bg-[#9fe870] px-4 text-[#163300]"
        >
          Back to leads
        </button>
      </div>
    );
  }

  const timeline = [
    ...lead.activity.map((a) => ({
      id: a.id,
      at: a.at,
      text: a.text,
      who: a.authorEmail,
      kind: "activity" as const,
    })),
    ...lead.notes.map((n) => ({
      id: n.id,
      at: n.createdAt,
      text: n.text,
      who: n.authorEmail,
      kind: "note" as const,
    })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <div className="mx-auto max-w-3xl space-y-4 pb-28 lg:space-y-6 lg:pb-6">
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-[#163300]"
      >
        <Icon name="arrowLeft" className="h-4 w-4" />
        Leads
      </Link>

      {error && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      )}

      <header className="rounded-2xl border border-line bg-surface p-4 lg:p-6">
        <div className="flex flex-wrap items-start gap-2">
          <h1 className="text-xl font-extrabold tracking-tight lg:text-2xl">
            {lead.name}
          </h1>
          <LeadStatusBadge status={lead.status} />
          {lead.priority === "urgent" && (
            <span className="rounded-pill bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800">
              Urgent
            </span>
          )}
          {lead.status === "new" && <SlaBadge lead={lead} />}
        </div>
        <p className="mt-1 text-xs text-muted">
          {formatLeadTime(lead.createdAt)} · Updated{" "}
          {formatLeadTime(lead.updatedAt)}
          {lead.trackCode ? ` · Track ${lead.trackCode}` : ""}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-[#163300]">{lead.phone}</p>
          <CopyPhoneButton phone={lead.phone} />
        </div>

        <div className="mt-4 hidden grid-cols-2 gap-2 lg:grid">
          <a
            href={`tel:${lead.phone}`}
            className="btn justify-center border border-line bg-surface py-3"
          >
            <Icon name="phone" className="h-4 w-4" />
            Call
          </a>
          <a
            href={whatsappHrefForPhone(
              lead.phone,
              WA_TEMPLATES[0].build(lead),
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn justify-center bg-[#9fe870] py-3 text-[#163300]"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            WhatsApp
          </a>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              run(() =>
                updateLeadPriority(
                  lead.id,
                  lead.priority === "urgent" ? "normal" : "urgent",
                  author,
                ),
              )
            }
            className="rounded-pill border border-line px-3 py-1.5 text-xs font-bold"
          >
            {lead.priority === "urgent" ? "Clear urgent" : "Mark urgent"}
          </button>
          {lead.status === "new" && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                run(() => updateLeadStatus(lead.id, "contacted", undefined, author))
              }
              className="rounded-pill bg-[#163300] px-3 py-1.5 text-xs font-bold text-[#9fe870]"
            >
              Mark contacted
            </button>
          )}
          {me && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                run(() => updateLeadAssignee(lead.id, me, author))
              }
              className="rounded-pill border border-line px-3 py-1.5 text-xs font-bold"
            >
              Assign to me
            </button>
          )}
        </div>
      </header>

      <section className="rounded-2xl border border-line bg-surface p-4 lg:p-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-muted">
          WhatsApp templates
        </h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {WA_TEMPLATES.map((t) => (
            <a
              key={t.id}
              href={whatsappHrefForPhone(lead.phone, t.build(lead))}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-line bg-[#f4f5f2] px-3 py-3 text-sm font-semibold text-[#163300] hover:bg-[#9fe870]/25"
            >
              {t.label}
            </a>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-4 lg:p-5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-muted">
            Contact
          </h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Phone</dt>
              <dd className="font-semibold text-[#163300]">{lead.phone}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="font-semibold">{lead.email || "—"}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4 lg:p-5">
          <h2 className="text-xs font-bold uppercase tracking-wide text-muted">
            Move
          </h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="text-muted">Route</dt>
              <dd className="font-semibold">
                {lead.from} → {lead.to}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Date</dt>
              <dd className="font-semibold">{lead.date || "Flexible"}</dd>
            </div>
            <div>
              <dt className="text-muted">Property</dt>
              <dd className="font-semibold">{lead.propertySize}</dd>
            </div>
            <div>
              <dt className="text-muted">Service</dt>
              <dd className="font-semibold">{lead.service}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4 lg:p-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-muted">
          Status
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {LEAD_STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              disabled={busy}
              onClick={() => {
                if (s.value === "lost") {
                  setLostOpen(true);
                  return;
                }
                run(() =>
                  updateLeadStatus(lead.id, s.value as LeadStatus, undefined, author),
                );
              }}
              className={
                "rounded-pill px-3.5 py-2 text-sm font-semibold " +
                (lead.status === s.value
                  ? "bg-[#163300] text-[#9fe870]"
                  : "border border-line bg-[#f4f5f2] text-[#163300]")
              }
            >
              {s.label}
            </button>
          ))}
        </div>
        {lead.lostReason && (
          <p className="mt-3 text-sm text-muted">
            Lost reason:{" "}
            <span className="font-semibold text-content">{lead.lostReason}</span>
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4 lg:p-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-muted">
          Quote & owner
        </h2>
        <div className="mt-3 space-y-3">
          <div className="flex gap-2">
            <input
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="e.g. £299"
              className="h-11 flex-1 rounded-xl border border-line bg-[#f6f6f4] px-3 text-sm text-[#163300] outline-none ring-[#9fe870] focus:ring-2"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                run(() => updateLeadQuote(lead.id, quote, author))
              }
              className="btn bg-[#9fe870] px-4 text-[#163300]"
            >
              Save
            </button>
          </div>
          <div className="flex gap-2">
            <input
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Assigned to (name)"
              className="h-11 flex-1 rounded-xl border border-line bg-[#f6f6f4] px-3 text-sm text-[#163300] outline-none ring-[#9fe870] focus:ring-2"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                run(() => updateLeadAssignee(lead.id, assignee, author))
              }
              className="btn border border-line bg-surface px-4"
            >
              Assign
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4 lg:p-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-muted">
          Activity & notes
        </h2>
        <ul className="mt-3 space-y-3">
          {timeline.length === 0 && (
            <li className="text-sm text-muted">Nothing yet.</li>
          )}
          {timeline.map((item) => (
            <li
              key={item.id}
              className={
                "rounded-xl border border-line px-3 py-2.5 " +
                (item.kind === "note" ? "bg-[#f4f5f2]" : "bg-surface")
              }
            >
              <p className="text-sm leading-relaxed text-[#163300]">
                {item.kind === "note" ? item.text : item.text}
              </p>
              <p className="mt-1 text-[11px] text-muted">
                {formatLeadTime(item.at)}
                {item.who ? ` · ${item.who}` : ""}
                {item.kind === "note" ? " · note" : ""}
              </p>
            </li>
          ))}
        </ul>
        <form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            if (!note.trim()) return;
            run(async () => {
              await addLeadNote(lead.id, note, author);
              setNote("");
            });
          }}
          className="mt-4 space-y-2"
        >
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add an internal note…"
            rows={3}
            className="w-full resize-none rounded-xl border border-line bg-[#f6f6f4] px-3 py-2.5 text-sm text-[#163300] outline-none ring-[#9fe870] focus:ring-2"
          />
          <button
            type="submit"
            disabled={busy || !note.trim()}
            className="btn w-full justify-center bg-[#163300] py-3 text-[#9fe870] disabled:opacity-50"
          >
            Add note
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-line bg-surface p-4 lg:p-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-muted">
          Source
        </h2>
        <p className="mt-2 text-sm">
          <Link
            href={lead.source}
            className="font-semibold text-[#163300] underline underline-offset-2"
          >
            {lead.source}
          </Link>
        </p>
      </section>

      <button
        type="button"
        disabled={busy}
        onClick={() => {
          if (!window.confirm("Delete this lead permanently?")) return;
          run(async () => {
            await deleteLead(lead.id);
            router.push("/admin/leads");
          });
        }}
        className="w-full rounded-2xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-800"
      >
        Delete lead
      </button>

      {/* Mobile sticky actions */}
      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-line bg-surface/95 px-3 py-2 backdrop-blur-sm lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
          <a
            href={`tel:${lead.phone}`}
            className="btn justify-center border border-line py-3 text-sm"
          >
            <Icon name="phone" className="h-4 w-4" />
            Call
          </a>
          <a
            href={whatsappHrefForPhone(
              lead.phone,
              WA_TEMPLATES[0].build(lead),
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn justify-center bg-[#9fe870] py-3 text-sm text-[#163300]"
          >
            <Icon name="whatsapp" className="h-4 w-4" />
            WA
          </a>
          <button
            type="button"
            disabled={busy || lead.status !== "new"}
            onClick={() =>
              run(() =>
                updateLeadStatus(lead.id, "contacted", undefined, author),
              )
            }
            className="btn justify-center bg-[#163300] py-3 text-sm text-[#9fe870] disabled:opacity-40"
          >
            Contacted
          </button>
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>

      <LostReasonSheet
        open={lostOpen}
        busy={busy}
        onClose={() => setLostOpen(false)}
        onConfirm={(reason) => {
          setLostOpen(false);
          run(() => updateLeadStatus(lead.id, "lost", reason, author));
        }}
      />
    </div>
  );
}

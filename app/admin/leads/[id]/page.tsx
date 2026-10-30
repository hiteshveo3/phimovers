"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft2 as BackIcon,
  Call as CallIcon,
  Copy as CopyIcon,
  Receipt21 as ReceiptIcon,
  Sms as MailIcon,
  Message as SmsIcon,
} from "iconsax-reactjs";
import CopyPhoneButton from "@/components/admin/CopyPhoneButton";
import LeadStatusBadge from "@/components/admin/LeadStatusBadge";
import LostReasonSheet from "@/components/admin/LostReasonSheet";
import SlaBadge from "@/components/admin/SlaBadge";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { Ico } from "@/kit/components/Ico";
import {
  addLeadNote,
  deleteLead,
  subscribeLead,
  updateLeadAssignee,
  updateLeadDate,
  updateLeadPriority,
  updateLeadQuote,
  updateLeadStatus,
} from "@/lib/leads/service";
import {
  MESSAGE_TEMPLATES,
  mailtoHref,
  smsHref,
  templateSubject,
} from "@/lib/leads/templates";
import {
  formatLeadTime,
  LEAD_STATUSES,
  type Lead,
  type LeadStatus,
} from "@/lib/leads/types";

export default function AdminLeadDetailPage() {
  const params = useParams()!;
  const id = String(params.id);
  const router = useRouter();
  const { user } = useAdminAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [quote, setQuote] = useState("");
  const [assignee, setAssignee] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [lostOpen, setLostOpen] = useState(false);
  const [tplId, setTplId] = useState(MESSAGE_TEMPLATES[0].id);
  const [copied, setCopied] = useState(false);

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
            setMoveDate(row.date ?? "");
            setError("");
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
    return <p className="ad-loading">Loading lead…</p>;
  }

  if (!lead) {
    return (
      <div className="ad-empty">
        <b>{error || "Not found"}</b>
        <button
          type="button"
          onClick={() => router.push("/admin/leads")}
          className="ad-btn lime"
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

  const tpl =
    MESSAGE_TEMPLATES.find((t) => t.id === tplId) ?? MESSAGE_TEMPLATES[0];
  const tplText = tpl.build(lead);
  const emailHref = lead.email
    ? mailtoHref(lead.email, templateSubject(lead), tplText)
    : "";

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(tplText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className="ad" style={{ paddingBottom: 90 }}>
      <Link href="/admin/leads" className="ad-link" style={{ justifySelf: "start" }}>
        <Ico icon={BackIcon} size={18} />
        Leads
      </Link>

      {error && (
        <p className="ad-banner" role="alert" style={{ margin: 0 }}>
          {error}
        </p>
      )}

      <header className="ad-card">
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <h1 style={{ marginRight: 4 }}>{lead.name}</h1>
          <LeadStatusBadge status={lead.status} />
          {lead.priority === "urgent" && <span className="ad-badge urgent">Urgent</span>}
          {lead.status === "new" && <SlaBadge lead={lead} />}
        </div>
        <p className="ad-sub">
          {formatLeadTime(lead.createdAt)} · Updated {formatLeadTime(lead.updatedAt)}
          {lead.trackCode ? ` · Track ${lead.trackCode}` : ""}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, margin: "14px 0" }}>
          <strong style={{ fontSize: 18 }}>{lead.phone}</strong>
          <CopyPhoneButton phone={lead.phone} />
        </div>

        <div className="ad-actions">
          <a href={`tel:${lead.phone}`} className="ad-btn lime">
            <Ico icon={CallIcon} size={18} />
            Call
          </a>
          <a href={smsHref(lead.phone)} className="ad-btn">
            <Ico icon={SmsIcon} size={18} />
            SMS
          </a>
          {lead.email ? (
            <a href={`mailto:${lead.email}`} className="ad-btn">
              <Ico icon={MailIcon} size={18} />
              Email
            </a>
          ) : (
            <span className="ad-btn" aria-disabled="true" title="No email address on this lead">
              <Ico icon={MailIcon} size={18} />
              Email
            </span>
          )}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          <button
            type="button"
            disabled={busy}
            className="ad-mini"
            onClick={() =>
              run(() =>
                updateLeadPriority(
                  lead.id,
                  lead.priority === "urgent" ? "normal" : "urgent",
                  author,
                ),
              )
            }
          >
            {lead.priority === "urgent" ? "Clear urgent" : "Mark urgent"}
          </button>
          {lead.status === "new" && (
            <button
              type="button"
              disabled={busy}
              className="ad-mini lime"
              onClick={() =>
                run(() => updateLeadStatus(lead.id, "contacted", undefined, author))
              }
            >
              Mark contacted
            </button>
          )}
          {me && (
            <button
              type="button"
              disabled={busy}
              className="ad-mini"
              onClick={() => run(() => updateLeadAssignee(lead.id, me, author))}
            >
              Assign to me
            </button>
          )}
          <Link href={`/admin/invoices?lead=${lead.id}`} className="ad-mini">
            <Ico icon={ReceiptIcon} size={14} />
            Create invoice
          </Link>
        </div>
      </header>

      <div className="ad-detail wide">
        <div className="ad-main">
          <section className="ad-card">
            <h2>Message templates</h2>
            <div className="ad-tpl">
              <div className="ad-tpl-list">
                {MESSAGE_TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="ad-chip"
                    aria-pressed={tplId === t.id}
                    onClick={() => setTplId(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <pre className="ad-tpl-box">{tplText}</pre>
              <div className="ad-kcard-acts">
                <a href={smsHref(lead.phone, tplText)} className="ad-mini lime">
                  <Ico icon={SmsIcon} size={14} />
                  Send by SMS
                </a>
                {emailHref ? (
                  <a href={emailHref} className="ad-mini">
                    <Ico icon={MailIcon} size={14} />
                    Send by email
                  </a>
                ) : (
                  <span className="ad-mini" aria-disabled="true" style={{ opacity: 0.5 }}>
                    No email address
                  </span>
                )}
                <button type="button" className="ad-mini" onClick={copyTemplate}>
                  <Ico icon={CopyIcon} size={14} />
                  {copied ? "Copied" : "Copy text"}
                </button>
              </div>
            </div>
          </section>

          <section className="ad-card">
            <h2>Activity and notes</h2>
            <ul className="ad-tl">
              {timeline.length === 0 && <li>Nothing yet.</li>}
              {timeline.map((item) => (
                <li key={item.id} className={item.kind === "note" ? "note" : ""}>
                  {item.text}
                  <small>
                    {formatLeadTime(item.at)}
                    {item.who ? ` · ${item.who}` : ""}
                    {item.kind === "note" ? " · note" : ""}
                  </small>
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
              style={{ display: "grid", gap: 10, marginTop: 14 }}
            >
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add an internal note…"
                rows={3}
                className="ad-textarea"
              />
              <button type="submit" disabled={busy || !note.trim()} className="ad-btn dark block">
                Add note
              </button>
            </form>
          </section>
        </div>

        <div className="ad-side">
          <section className="ad-card">
            <h2>Status</h2>
            <div className="ad-tpl-list">
              {LEAD_STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  disabled={busy}
                  className="ad-chip"
                  aria-pressed={lead.status === s.value}
                  onClick={() => {
                    if (s.value === "lost") {
                      setLostOpen(true);
                      return;
                    }
                    run(() =>
                      updateLeadStatus(lead.id, s.value as LeadStatus, undefined, author),
                    );
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {lead.lostReason && (
              <p className="ad-muted" style={{ margin: "12px 0 0" }}>
                Lost reason: <strong style={{ color: "var(--ink)" }}>{lead.lostReason}</strong>
              </p>
            )}
          </section>

          <section className="ad-card">
            <h2>Quote and owner</h2>
            <div style={{ display: "grid", gap: 10 }}>
              <div className="ad-inline">
                <input
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="e.g. £299"
                  className="ad-input"
                  aria-label="Quote amount"
                />
                <button
                  type="button"
                  disabled={busy}
                  className="ad-btn lime"
                  onClick={() => run(() => updateLeadQuote(lead.id, quote, author))}
                >
                  Save
                </button>
              </div>
              <div className="ad-inline">
                <input
                  type="date"
                  value={moveDate}
                  onChange={(e) => setMoveDate(e.target.value)}
                  className="ad-input"
                  aria-label="Move date"
                />
                <button
                  type="button"
                  disabled={busy}
                  className="ad-btn"
                  onClick={() => run(() => updateLeadDate(lead.id, moveDate, author))}
                >
                  Set date
                </button>
              </div>
              <div className="ad-inline">
                <input
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="Assigned to (name)"
                  className="ad-input"
                  aria-label="Assigned to"
                />
                <button
                  type="button"
                  disabled={busy}
                  className="ad-btn"
                  onClick={() => run(() => updateLeadAssignee(lead.id, assignee, author))}
                >
                  Assign
                </button>
              </div>
            </div>
          </section>

          <section className="ad-card">
            <h2>Contact</h2>
            <dl className="ad-dl">
              <dt>Phone</dt>
              <dd>{lead.phone}</dd>
              <dt>Email</dt>
              <dd>{lead.email || "—"}</dd>
            </dl>
          </section>

          <section className="ad-card">
            <h2>Move</h2>
            <dl className="ad-dl">
              <dt>Route</dt>
              <dd>
                {lead.from} → {lead.to}
              </dd>
              <dt>Date</dt>
              <dd>{lead.date || "Flexible"}</dd>
              <dt>Property</dt>
              <dd>{lead.propertySize}</dd>
              <dt>Service</dt>
              <dd>{lead.service}</dd>
              <dt>Source</dt>
              <dd>
                <Link href={lead.source} style={{ color: "var(--link)", textDecoration: "underline" }}>
                  {lead.source}
                </Link>
              </dd>
            </dl>
          </section>

          <button
            type="button"
            disabled={busy}
            className="ad-btn danger block"
            onClick={() => {
              if (!window.confirm("Delete this lead permanently?")) return;
              run(async () => {
                await deleteLead(lead.id);
                router.push("/admin/leads");
              });
            }}
          >
            Delete lead
          </button>
        </div>
      </div>

      {/* Phones: quick actions stay in reach above the tab bar */}
      <div className="ad-sticky">
        <div className="ad-actions">
          <a href={`tel:${lead.phone}`} className="ad-btn lime">
            <Ico icon={CallIcon} size={16} />
            Call
          </a>
          <a href={smsHref(lead.phone, tplText)} className="ad-btn">
            <Ico icon={SmsIcon} size={16} />
            SMS
          </a>
          {lead.email ? (
            <a href={emailHref} className="ad-btn">
              <Ico icon={MailIcon} size={16} />
              Email
            </a>
          ) : (
            <span className="ad-btn" aria-disabled="true">
              <Ico icon={MailIcon} size={16} />
              Email
            </span>
          )}
          <button
            type="button"
            disabled={busy || lead.status !== "new"}
            className="ad-btn dark"
            onClick={() =>
              run(() => updateLeadStatus(lead.id, "contacted", undefined, author))
            }
          >
            Contacted
          </button>
        </div>
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

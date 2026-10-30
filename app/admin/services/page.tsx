"use client";

import { useEffect, useState } from "react";
import {
  removeService,
  saveService,
  saveServiceSettings,
  subscribeServiceSettings,
  subscribeServices,
} from "@/lib/bookings/service";
import {
  DEFAULT_SERVICES,
  DEFAULT_TIME_SLOTS,
  gbp,
  type ServiceItem,
  type ServiceSettings,
} from "@/lib/bookings/types";
import AnnouncementEditor from "@/components/admin/AnnouncementEditor";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { can } from "@/lib/admin/roles";

const blank = (n: number): ServiceItem => ({
  id: "",
  name: "",
  category: "Home & Flat Moves",
  description: "",
  hourlyPrice: 55,
  helperHourPrice: 20,
  minHours: 2,
  helperOptions: [0, 1, 2],
  active: true,
  sortOrder: n,
});

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function AdminServicesPage() {
  const { role } = useAdminAuth();
  // Prices and add-ons: owner and finance (firestore.rules agrees). Every role can change the announcement.
  const prices = can(role, "prices");
  const [rows, setRows] = useState<ServiceItem[] | null>(null);
  const [settings, setSettings] = useState<ServiceSettings>({
    addons: [],
    timeSlots: DEFAULT_TIME_SLOTS,
    maxMovers: 4,
    notice: "",
  });
  const [edit, setEdit] = useState<ServiceItem | null>(null);
  const [helpers, setHelpers] = useState("");
  const [addons, setAddons] = useState("");
  const [slots, setSlots] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const a = subscribeServices(setRows, (e) => setError(e.message));
    const b = subscribeServiceSettings((s) => {
      setSettings(s);
      setAddons(s.addons.map((x) => `${x.name} = ${x.price}`).join("\n"));
      setSlots((s.timeSlots.length ? s.timeSlots : DEFAULT_TIME_SLOTS).join(", "));
    }, (e) => setError(e.message));
    return () => {
      a();
      b();
    };
  }, []);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "That did not save.");
    } finally {
      setBusy(false);
    }
  }

  function open(s: ServiceItem) {
    setEdit(s);
    setHelpers(s.helperOptions.join(", "));
  }

  const shown = rows && rows.length > 0 ? rows : null;

  if (!prices) {
    return (
      <div className="ad">
        <div>
          <p className="ad-eyebrow">Bookings</p>
          <h1>Services &amp; prices</h1>
          <p className="ad-sub">Prices are changed by the owner and finance. You can set the announcement band.</p>
        </div>
        <AnnouncementEditor />
      </div>
    );
  }

  return (
    <div className="ad">
      <AnnouncementEditor />
      <div className="ad-head">
        <div>
          <p className="ad-eyebrow">Bookings</p>
          <h1>Services &amp; prices</h1>
          <p className="ad-sub">
            What customers can book and what it costs: (van + helpers) per hour, minimum hours.
            Until you save something here the website and app use the published rates.
          </p>
        </div>
        <div className="ad-head-actions">
          {!shown && rows && (
            <button
              type="button"
              className="ad-btn"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  for (const s of DEFAULT_SERVICES) await saveService(s);
                })
              }
            >
              Load published rates
            </button>
          )}
          <button type="button" className="ad-btn lime" onClick={() => open(blank((rows?.length ?? 0) + 1))}>
            Add service
          </button>
        </div>
      </div>

      {error && (
        <p className="ad-banner err" role="alert">
          {error}
        </p>
      )}

      <div className="ad-list">
        {(shown ?? DEFAULT_SERVICES).map((s) => (
          <div key={s.id} className="ad-lead on-grey">
            <div className="ad-lead-main">
              <strong>
                {s.name}
                {!s.active && <span className="ad-badge bk-cancelled">Hidden</span>}
                {!shown && <span className="ad-badge bk-pending">Default</span>}
              </strong>
              <span>
                {gbp(s.hourlyPrice)}/h van + {gbp(s.helperHourPrice)}/h per helper · {s.minHours} h minimum
              </span>
              <span>{s.description}</span>
            </div>
            <button type="button" className="ad-btn sm" onClick={() => open(s)}>
              Edit
            </button>
          </div>
        ))}
      </div>

      {edit && (
        <section className="ad-card">
          <h2>{edit.id ? `Edit ${edit.name}` : "New service"}</h2>
          <div className="ad-two">
            <label className="ad-field">
              <span>Name</span>
              <input className="ad-input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} />
            </label>
            <label className="ad-field">
              <span>Category</span>
              <input className="ad-input" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} />
            </label>
            <label className="ad-field">
              <span>Van + driver (£ per hour)</span>
              <input className="ad-input" inputMode="decimal" value={edit.hourlyPrice} onChange={(e) => setEdit({ ...edit, hourlyPrice: Number(e.target.value) || 0 })} />
            </label>
            <label className="ad-field">
              <span>Each helper (£ per hour)</span>
              <input className="ad-input" inputMode="decimal" value={edit.helperHourPrice} onChange={(e) => setEdit({ ...edit, helperHourPrice: Number(e.target.value) || 0 })} />
            </label>
            <label className="ad-field">
              <span>Minimum hours</span>
              <input className="ad-input" inputMode="numeric" value={edit.minHours} onChange={(e) => setEdit({ ...edit, minHours: Number(e.target.value) || 1 })} />
            </label>
            <label className="ad-field">
              <span>Helper counts offered (comma separated, 0 = driver only)</span>
              <input className="ad-input" value={helpers} onChange={(e) => setHelpers(e.target.value)} />
            </label>
          </div>
          <label className="ad-field">
            <span>Short description</span>
            <input className="ad-input" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
          </label>
          <label className="ad-check">
            <input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} />
            Available to book
          </label>
          <div className="ad-head-actions" style={{ marginTop: 12 }}>
            <button
              type="button"
              className="ad-btn lime"
              disabled={busy || edit.name.trim().length < 2}
              onClick={() =>
                run(async () => {
                  const opts = helpers
                    .split(",")
                    .map((n) => Number(n.trim()))
                    .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);
                  await saveService({
                    ...edit,
                    id: edit.id || slug(edit.name),
                    helperOptions: opts.length ? [...new Set(opts)].sort() : [0],
                  });
                  setEdit(null);
                })
              }
            >
              Save
            </button>
            <button type="button" className="ad-btn" onClick={() => setEdit(null)}>
              Close
            </button>
            {edit.id && (
              <button
                type="button"
                className="ad-btn danger"
                disabled={busy}
                onClick={() => {
                  if (window.confirm(`Delete ${edit.name}? Existing bookings keep their details.`)) {
                    void run(async () => {
                      await removeService(edit.id);
                      setEdit(null);
                    });
                  }
                }}
              >
                Delete
              </button>
            )}
          </div>
        </section>
      )}

      <section className="ad-card">
        <h2>Add-ons, time slots &amp; notice</h2>
        <label className="ad-field">
          <span>Add-ons (one per line: name = price)</span>
          <textarea className="ad-textarea" value={addons} onChange={(e) => setAddons(e.target.value)} placeholder={"Packing materials = 25\nFurniture assembly = 40"} />
        </label>
        <label className="ad-field">
          <span>Time slots (comma separated)</span>
          <input className="ad-input" value={slots} onChange={(e) => setSlots(e.target.value)} />
        </label>
        <label className="ad-field">
          <span>Notice shown when booking (optional)</span>
          <input className="ad-input" value={settings.notice} onChange={(e) => setSettings({ ...settings, notice: e.target.value })} />
        </label>
        <button
          type="button"
          className="ad-btn lime"
          disabled={busy}
          onClick={() =>
            run(async () => {
              const parsed = addons
                .split("\n")
                .map((l) => l.split("="))
                .filter((p) => p.length === 2 && p[0].trim() && Number(p[1]) >= 0)
                .map((p) => ({ id: slug(p[0]), name: p[0].trim(), price: Number(p[1]) }));
              await saveServiceSettings({
                ...settings,
                addons: parsed,
                timeSlots: slots.split(",").map((s) => s.trim()).filter(Boolean),
              });
            })
          }
        >
          Save
        </button>
      </section>
    </div>
  );
}

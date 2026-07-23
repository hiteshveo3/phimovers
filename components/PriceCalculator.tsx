"use client";

import { useMemo, useState } from "react";
import { Icon } from "./icons";
import CalcSidebar from "./CalcSidebar";

// Change this (1-10) to switch the estimate sidebar design.
const SIDEBAR_VARIANT = 1;

const VANS = [
  { key: "small", label: "Small Van", rate: 50, hint: "Boxes, single items" },
  { key: "transit", label: "Transit Van", rate: 55, hint: "Sofa, studio moves" },
  { key: "luton", label: "Luton Van", rate: 65, hint: "Flats & house moves" },
];

const HELPER_RATE = 20;
const FREE_MILES = 10;
const PER_MILE = 1.5;
const ASSEMBLY_RATE = 25; // per hour per mover
const PACKING_RATE = 20; // per hour per mover
const DEPOSIT = 40;

type Opt = {
  key: string;
  label: string;
  hint: string;
  kind: "flat" | "perhour" | "percent";
  v: number;
};

const OPTIONS: Opt[] = [
  { key: "evening", label: "Evening after 7pm", hint: "+£10/hr", kind: "perhour", v: 10 },
  { key: "bankholiday", label: "Bank holiday", hint: "+20%", kind: "percent", v: 0.2 },
  { key: "sameday", label: "Same-day urgent booking", hint: "+£20", kind: "flat", v: 20 },
  { key: "heavy", label: "Heavy item (80kg+)", hint: "+£25", kind: "flat", v: 25 },
  { key: "fridge", label: "American fridge / freezer", hint: "+£30", kind: "flat", v: 30 },
  { key: "carry", label: "Carry distance over 30m", hint: "+£15", kind: "flat", v: 15 },
  { key: "nolift", label: "No lift above 2nd floor", hint: "+£15", kind: "flat", v: 15 },
  { key: "extrastop", label: "Extra collection / drop-off", hint: "+£15", kind: "flat", v: 15 },
];

const gbp = (n: number) =>
  "£" + n.toLocaleString("en-GB", { maximumFractionDigits: 2 });

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-content">
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-pill px-4 py-2 text-sm font-semibold transition-colors " +
        (active
          ? "bg-[#9fe870] text-[#163300] ring-1 ring-[#163300]/20"
          : "border border-line bg-surface text-content hover:border-[#163300]/40")
      }
    >
      {children}
    </button>
  );
}

function Stepper({
  value,
  onDec,
  onInc,
  suffix,
}: {
  value: string;
  onDec: () => void;
  onInc: () => void;
  suffix?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onDec}
        className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-content transition-colors hover:border-[#163300]/40 hover:bg-[#9fe870]/20"
        aria-label="Decrease"
      >
        <Icon name="minus" className="h-4 w-4" strokeWidth={2.4} />
      </button>
      <span className="min-w-[4ch] text-center text-lg font-extrabold text-content">
        {value}
        {suffix}
      </span>
      <button
        type="button"
        onClick={onInc}
        className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-content transition-colors hover:border-[#163300]/40 hover:bg-[#9fe870]/20"
        aria-label="Increase"
      >
        <Icon name="plus" className="h-4 w-4" strokeWidth={2.4} />
      </button>
    </div>
  );
}

export default function PriceCalculator() {
  const [van, setVan] = useState("transit");
  const [helpers, setHelpers] = useState(0);
  const [hours, setHours] = useState(2);
  const [miles, setMiles] = useState(5);
  const [assemblyHrs, setAssemblyHrs] = useState(0);
  const [packingHrs, setPackingHrs] = useState(0);
  const [sel, setSel] = useState<string[]>([]);

  const has = (k: string) => sel.includes(k);
  const toggle = (k: string) =>
    setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  const calc = useMemo(() => {
    const vanRate = VANS.find((v) => v.key === van)?.rate ?? 0;
    const movers = 1 + helpers;
    const evening = has("evening") ? 10 : 0;
    const hourly = vanRate + helpers * HELPER_RATE + evening;
    const labourBase = hourly * hours;
    const bh = has("bankholiday") ? labourBase * 0.2 : 0;
    const labour = labourBase + bh;
    const mileage = Math.max(0, miles - FREE_MILES) * PER_MILE;
    const assembly = assemblyHrs * ASSEMBLY_RATE * movers;
    const packing = packingHrs * PACKING_RATE * movers;
    const flat = OPTIONS.filter(
      (o) => o.kind === "flat" && has(o.key)
    ).reduce((s, o) => s + o.v, 0);
    const total = labour + mileage + assembly + packing + flat;
    return {
      vanRate,
      movers,
      hourly,
      labourBase,
      bh,
      mileage,
      assembly,
      packing,
      flat,
      total,
    };
  }, [van, helpers, hours, miles, assemblyHrs, packingHrs, sel]);

  const rows: [string, number][] = [
    [`Labour (${hours} hrs × ${gbp(calc.hourly)})`, calc.labourBase],
    ["Bank-holiday +20%", calc.bh],
    [`Mileage (${miles} mi)`, calc.mileage],
    [`Furniture assembly (${assemblyHrs}h × ${calc.movers})`, calc.assembly],
    [`Packing assistance (${packingHrs}h × ${calc.movers})`, calc.packing],
    ["Access & item extras", calc.flat],
  ];

  return (
    <div className="grid gap-6 md:grid-cols-[1.35fr_1fr] md:items-start">
      {/* Inputs */}
      <div className="space-y-8 rounded-[24px] bg-cream p-6 md:p-8">
        <Field label="Choose your van">
          <div className="grid gap-2 sm:grid-cols-3">
            {VANS.map((v) => {
              const active = van === v.key;
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setVan(v.key)}
                  className={
                    "rounded-2xl border px-4 py-3 text-left transition-colors " +
                    (active
                      ? "border-[#163300] bg-[#9fe870]"
                      : "border-line bg-surface hover:border-[#163300]/40")
                  }
                >
                  <span className="block text-sm font-bold text-[#163300]">
                    {v.label}
                  </span>
                  <span className="block text-xs text-[#163300]/70">
                    £{v.rate}/hr · {v.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Team size">
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((n) => (
                <Chip
                  key={n}
                  active={helpers === n}
                  onClick={() => setHelpers(n)}
                >
                  {n === 0 ? "Driver" : `+${n}`}
                </Chip>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-muted">
              1 mover included · each extra +£20/hr
            </p>
          </Field>

          <Field label={`Hours booked`}>
            <Stepper
              value={String(hours)}
              suffix=" hrs"
              onDec={() => setHours((h) => Math.max(2, h - 0.5))}
              onInc={() => setHours((h) => Math.min(10, h + 0.5))}
            />
            <p className="mt-1.5 text-xs text-muted">
              2-hour minimum · 30-min steps
            </p>
          </Field>
        </div>

        <Field label={`Journey distance — ${miles} miles`}>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={miles}
            onChange={(e) => setMiles(Number(e.target.value))}
            className="w-full accent-[#163300]"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted">
            <span>0 mi</span>
            <span>First {FREE_MILES} mi included · then £1.50/mi</span>
            <span>100 mi</span>
          </div>
        </Field>

        {/* Labour services */}
        <Field label="Labour services (per hour, per mover)">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm font-semibold text-content">
                Furniture assembly
              </p>
              <p className="mb-3 text-xs text-muted">£25/hr per mover</p>
              <Stepper
                value={String(assemblyHrs)}
                suffix=" h"
                onDec={() => setAssemblyHrs((h) => Math.max(0, h - 0.5))}
                onInc={() => setAssemblyHrs((h) => Math.min(8, h + 0.5))}
              />
            </div>
            <div className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-sm font-semibold text-content">
                Packing assistance
              </p>
              <p className="mb-3 text-xs text-muted">£20/hr per mover</p>
              <Stepper
                value={String(packingHrs)}
                suffix=" h"
                onDec={() => setPackingHrs((h) => Math.max(0, h - 0.5))}
                onInc={() => setPackingHrs((h) => Math.min(8, h + 0.5))}
              />
            </div>
          </div>
        </Field>

        {/* Options / extras */}
        <Field label="Timing, access & item extras">
          <div className="grid gap-2 sm:grid-cols-2">
            {OPTIONS.map((o) => {
              const active = has(o.key);
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => toggle(o.key)}
                  className={
                    "flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-colors " +
                    (active
                      ? "border-[#163300] bg-[#9fe870]"
                      : "border-line bg-surface hover:border-[#163300]/40")
                  }
                >
                  <span className="flex items-center gap-2 font-medium text-content">
                    <span
                      className={
                        "grid h-5 w-5 shrink-0 place-items-center rounded-md border " +
                        (active
                          ? "border-[#163300] bg-[#163300] text-[#9fe870]"
                          : "border-line text-transparent")
                      }
                    >
                      <Icon
                        name="check"
                        className="h-4 w-4"
                        size={13}
                        strokeWidth={2.4}
                      />
                    </span>
                    {o.label}
                  </span>
                  <span className="shrink-0 text-xs font-bold text-[#163300]">
                    {o.hint}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2.5 text-xs text-muted">
            Normal stairs are never charged. Extra stop is +£15 plus any added
            mileage/time. Piano or specialist items are quoted separately.
          </p>
        </Field>
      </div>

      {/* Summary */}
      <CalcSidebar
        variant={SIDEBAR_VARIANT}
        data={{
          total: calc.total,
          hourly: calc.hourly,
          movers: calc.movers,
          deposit: DEPOSIT,
          rows,
        }}
      />
    </div>
  );
}

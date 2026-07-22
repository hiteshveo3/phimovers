import Link from "next/link";
import { Icon } from "./icons";

export type CalcData = {
  total: number;
  hourly: number;
  movers: number;
  deposit: number;
  rows: [string, number][];
};

export const sidebarLabels: Record<number, string> = {
  1: "Bright green (default)",
  2: "Forest dark panel",
  3: "Clean white card",
  4: "Split header",
  5: "Receipt style",
  6: "Gradient panel",
  7: "Outlined ring total",
  8: "Compact pills",
  9: "Glassmorphism",
  10: "Total-focused bold",
};

export const gbp = (n: number) =>
  "£" + n.toLocaleString("en-GB", { maximumFractionDigits: 2 });

const STICKY = "md:sticky md:top-[61px]";

function Book({
  href = "/#quote",
  className,
}: {
  href?: string;
  className: string;
}) {
  return (
    <Link href={href} className={"btn w-full px-6 " + className}>
      Book this move
      <Icon name="arrowRight" className="h-4 w-4" />
    </Link>
  );
}

function Lines({
  rows,
  labelClass,
  valClass = "font-semibold",
}: {
  rows: [string, number][];
  labelClass: string;
  valClass?: string;
}) {
  return (
    <div className="space-y-2.5 text-sm">
      {rows.map(([l, v]) => (
        <div key={l} className="flex items-center justify-between gap-3">
          <span className={labelClass}>{l}</span>
          <span className={"shrink-0 " + valClass}>{v > 0 ? gbp(v) : "—"}</span>
        </div>
      ))}
    </div>
  );
}

export default function CalcSidebar({
  variant = 1,
  data,
  bookHref = "/#quote",
  sticky = true,
}: {
  variant?: number;
  data: CalcData;
  bookHref?: string;
  sticky?: boolean;
}) {
  const { total, hourly, movers, deposit, rows } = data;
  const s = sticky ? STICKY : "";
  const moverTxt = `${gbp(hourly)}/hour · ${movers} mover${movers > 1 ? "s" : ""}`;

  switch (variant) {
    /* 2 — Forest dark panel */
    case 2:
      return (
        <div className={"rounded-[24px] bg-[#163300] p-6 text-[#eafbe0] md:p-7 " + s}>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#9fe870] text-[#163300]">
              <Icon name="truck" className="h-5 w-5" />
            </span>
            <p className="text-sm font-bold">Your estimate</p>
          </div>
          <div className="mt-5 text-5xl font-extrabold tracking-tight text-[#9fe870]">
            {gbp(total)}
          </div>
          <p className="mt-1 text-xs text-[#eafbe0]/60">{moverTxt}</p>
          <div className="mt-6 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <Lines rows={rows} labelClass="text-[#eafbe0]/60" />
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-sm font-bold">Total</span>
              <span className="text-xl font-extrabold text-[#9fe870]">
                {gbp(total)}
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-[#9fe870] px-4 py-3 text-sm text-[#163300]">
            <span className="font-medium">Deposit to book</span>
            <span className="font-extrabold">{gbp(deposit)}</span>
          </div>
          <Book href={bookHref} className="mt-4 bg-[#9fe870] text-[#163300] hover:bg-[#8adb5c]" />
        </div>
      );

    /* 3 — Clean white card */
    case 3:
      return (
        <div className={"rounded-[24px] border border-line bg-surface p-6 md:p-7 " + s}>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            Your estimate
          </p>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-5xl font-extrabold tracking-tight text-[#163300]">
              {gbp(total)}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted">{moverTxt}</p>
          <div className="my-6 h-px bg-line" />
          <Lines rows={rows} labelClass="text-muted" valClass="font-semibold text-content" />
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
            <span className="text-sm font-bold text-content">Total</span>
            <span className="text-xl font-extrabold text-[#163300]">{gbp(total)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-cream px-4 py-3 text-sm text-content">
            <span className="font-medium">Deposit to book</span>
            <span className="font-extrabold text-[#163300]">{gbp(deposit)}</span>
          </div>
          <Book href={bookHref} className="mt-4 bg-[#163300] text-[#9fe870] hover:bg-[#0e2400]" />
        </div>
      );

    /* 4 — Split header */
    case 4:
      return (
        <div className={"overflow-hidden rounded-[24px] border border-line bg-surface " + s}>
          <div className="bg-[#163300] px-6 py-6 text-[#9fe870] md:px-7">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#9fe870]/70">
              Estimated total
            </p>
            <div className="mt-1 text-5xl font-extrabold tracking-tight">
              {gbp(total)}
            </div>
            <p className="mt-1 text-xs text-[#9fe870]/70">{moverTxt}</p>
          </div>
          <div className="p-6 md:p-7">
            <Lines rows={rows} labelClass="text-muted" valClass="font-semibold text-content" />
            <div className="mt-4 flex items-center justify-between rounded-xl bg-cream px-4 py-3 text-sm">
              <span className="font-medium text-content">Deposit to book</span>
              <span className="font-extrabold text-[#163300]">{gbp(deposit)}</span>
            </div>
            <Book href={bookHref} className="mt-4 bg-[#163300] text-[#9fe870] hover:bg-[#0e2400]" />
          </div>
        </div>
      );

    /* 5 — Receipt style */
    case 5:
      return (
        <div className={"rounded-[20px] border border-dashed border-[#163300]/30 bg-cream p-6 md:p-7 " + s}>
          <div className="flex items-center justify-between border-b border-dashed border-[#163300]/25 pb-3">
            <p className="text-sm font-bold uppercase tracking-widest text-[#163300]">
              Estimate
            </p>
            <Icon name="truck" className="h-5 w-5 text-[#163300]" />
          </div>
          <div className="mt-4">
            <Lines rows={rows} labelClass="text-muted" valClass="font-semibold text-content" />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#163300]/25 pt-3 text-content">
            <span className="text-sm font-bold uppercase tracking-widest">Total</span>
            <span className="text-2xl font-extrabold text-[#163300]">{gbp(total)}</span>
          </div>
          <p className="mt-1 text-right text-[11px] text-muted">{moverTxt}</p>
          <div className="mt-4 flex items-center justify-between border-t border-dashed border-[#163300]/25 pt-3 text-sm text-content">
            <span className="font-medium">Deposit due</span>
            <span className="font-extrabold text-[#163300]">{gbp(deposit)}</span>
          </div>
          <Book href={bookHref} className="mt-5 bg-[#163300] text-[#9fe870] hover:bg-[#0e2400]" />
        </div>
      );

    /* 6 — Gradient panel */
    case 6:
      return (
        <div
          className={
            "rounded-[24px] bg-gradient-to-br from-[#c8f6a6] via-[#9fe870] to-[#7ed155] p-6 text-[#163300] md:p-7 " +
            s
          }
        >
          <p className="text-sm font-bold">Your estimate</p>
          <div className="mt-4 text-5xl font-extrabold tracking-tight">
            {gbp(total)}
          </div>
          <p className="mt-1 text-xs font-medium text-[#163300]/70">{moverTxt}</p>
          <div className="mt-6 rounded-2xl bg-white/40 p-5 backdrop-blur-sm">
            <Lines rows={rows} labelClass="text-[#163300]/70" />
            <div className="mt-4 flex items-center justify-between border-t border-[#163300]/15 pt-3">
              <span className="text-sm font-bold">Total</span>
              <span className="text-xl font-extrabold">{gbp(total)}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-[#163300] px-4 py-3 text-sm text-[#9fe870]">
            <span className="font-medium">Deposit to book</span>
            <span className="font-extrabold">{gbp(deposit)}</span>
          </div>
          <Book href={bookHref} className="mt-4 bg-[#163300] text-[#9fe870] hover:bg-[#0e2400]" />
        </div>
      );

    /* 7 — Outlined ring total */
    case 7:
      return (
        <div className={"rounded-[24px] border-2 border-[#163300] bg-surface p-6 md:p-7 " + s}>
          <div className="rounded-2xl bg-[#9fe870] p-6 text-center text-[#163300]">
            <p className="text-xs font-bold uppercase tracking-wide">Estimated total</p>
            <div className="mt-2 text-5xl font-extrabold tracking-tight">
              {gbp(total)}
            </div>
            <p className="mt-1 text-xs font-medium text-[#163300]/70">{moverTxt}</p>
          </div>
          <div className="mt-6">
            <Lines rows={rows} labelClass="text-muted" valClass="font-semibold text-content" />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-sm text-content">
            <span className="font-medium">Deposit to book</span>
            <span className="font-extrabold text-[#163300]">{gbp(deposit)}</span>
          </div>
          <Book href={bookHref} className="mt-4 bg-[#163300] text-[#9fe870] hover:bg-[#0e2400]" />
        </div>
      );

    /* 8 — Compact pills */
    case 8:
      return (
        <div className={"rounded-[24px] bg-cream p-6 md:p-7 " + s}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-content">Your estimate</p>
            <span className="rounded-pill bg-[#163300] px-3 py-1 text-xs font-bold text-[#9fe870]">
              {movers} mover{movers > 1 ? "s" : ""}
            </span>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-4xl font-extrabold tracking-tight text-[#163300]">
              {gbp(total)}
            </span>
            <span className="rounded-pill bg-[#9fe870] px-3 py-1 text-xs font-bold text-[#163300]">
              {gbp(hourly)}/hr
            </span>
          </div>
          <div className="mt-5 space-y-2">
            {rows
              .filter(([, v]) => v > 0)
              .map(([l, v]) => (
                <div
                  key={l}
                  className="flex items-center justify-between rounded-pill bg-surface px-4 py-2 text-xs"
                >
                  <span className="text-muted">{l}</span>
                  <span className="font-bold text-content">{gbp(v)}</span>
                </div>
              ))}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-pill bg-[#163300] px-4 py-2.5 text-sm text-[#9fe870]">
            <span className="font-medium">Deposit</span>
            <span className="font-extrabold">{gbp(deposit)}</span>
          </div>
          <Book href={bookHref} className="mt-4 bg-[#163300] text-[#9fe870] hover:bg-[#0e2400]" />
        </div>
      );

    /* 9 — Glassmorphism */
    case 9:
      return (
        <div className={"relative overflow-hidden rounded-[24px] p-6 md:p-7 " + s}>
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-br from-[#9fe870] to-[#163300]"
          />
          <div className="rounded-2xl border border-white/40 bg-white/20 p-6 text-[#163300] shadow-soft backdrop-blur-md">
            <p className="text-sm font-bold">Your estimate</p>
            <div className="mt-3 text-5xl font-extrabold tracking-tight">
              {gbp(total)}
            </div>
            <p className="mt-1 text-xs font-medium text-[#163300]/70">{moverTxt}</p>
            <div className="mt-5 border-t border-[#163300]/15 pt-4">
              <Lines rows={rows} labelClass="text-[#163300]/70" />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[#163300]/15 pt-3">
              <span className="text-sm font-bold">Deposit to book</span>
              <span className="font-extrabold">{gbp(deposit)}</span>
            </div>
          </div>
          <Book
            href={bookHref}
            className="mt-4 border border-white/50 bg-white/25 text-[#163300] backdrop-blur-md hover:bg-white/40"
          />
        </div>
      );

    /* 10 — Total-focused bold */
    case 10:
      return (
        <div className={"rounded-[24px] bg-[#9fe870] p-7 text-center text-[#163300] md:p-8 " + s}>
          <p className="text-xs font-bold uppercase tracking-[0.2em]">
            You pay approx.
          </p>
          <div className="mt-3 text-6xl font-extrabold leading-none tracking-tight">
            {gbp(total)}
          </div>
          <p className="mt-3 text-sm font-medium text-[#163300]/75">{moverTxt}</p>
          <div className="mt-6 rounded-2xl bg-[#163300] px-5 py-4 text-left text-[#9fe870]">
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-80">Deposit to book</span>
              <span className="text-lg font-extrabold">{gbp(deposit)}</span>
            </div>
          </div>
          <Book
            href={bookHref}
            className="mt-4 bg-[#163300] text-[#9fe870] hover:bg-[#0e2400]"
          />
          <p className="mt-3 text-[11px] text-[#163300]/70">
            Balance due on the day — no hidden fees.
          </p>
        </div>
      );

    /* 1 — Bright green (default) */
    case 1:
    default:
      return (
        <div className={"rounded-[24px] bg-[#9fe870] p-6 text-[#163300] md:p-7 " + s}>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#163300] text-[#9fe870]">
              <Icon name="truck" className="h-5 w-5" />
            </span>
            <p className="text-sm font-bold">Your estimate</p>
          </div>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-5xl font-extrabold tracking-tight">
              {gbp(total)}
            </span>
            <span className="pb-2 text-xs font-medium text-[#163300]/70">
              approx.
            </span>
          </div>
          <p className="mt-1 text-xs font-medium text-[#163300]/70">{moverTxt}</p>
          <div className="mt-6 rounded-2xl bg-white/45 p-5 backdrop-blur-sm">
            <Lines rows={rows} labelClass="text-[#163300]/70" />
            <div className="mt-4 flex items-center justify-between border-t border-[#163300]/15 pt-3">
              <span className="text-sm font-bold">Total</span>
              <span className="text-xl font-extrabold">{gbp(total)}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-[#163300] px-4 py-3 text-sm text-[#9fe870]">
            <span className="font-medium">Deposit to book</span>
            <span className="font-extrabold">{gbp(deposit)}</span>
          </div>
          <Book href={bookHref} className="mt-4 bg-[#163300] text-[#9fe870] hover:bg-[#0e2400]" />
          <p className="mt-3 text-center text-[11px] text-[#163300]/70">
            Estimate only — deposit is deducted from your final balance.
          </p>
        </div>
      );
  }
}

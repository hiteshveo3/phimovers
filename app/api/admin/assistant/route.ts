import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin/require-staff";
import { officeAnswer } from "@/lib/admin/gemini-office";
import { env } from "@/lib/assistant/env";
import { capFromEnv, takeToken } from "@/lib/admin/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// eslint-disable-next-line no-control-regex
const CTRL = /[\u0000-\u0009\u000b-\u001f]/g;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(CTRL, " ").trim().slice(0, max) : "");

/**
 * The office assistant (Gemini) on the staff dashboard. Staff only:
 * POST { question, history } with `Authorization: Bearer <Firebase ID token>` returns { answer }.
 * Gemini reads the live leads, bookings and invoices, nothing else (lib/admin/gemini-office.ts).
 * Rate limited: 10 questions a minute per person, ADMIN_ASSISTANT_DAILY_CAP (default 300) a day for the
 * whole office (lib/admin/rate-limit.ts).
 */
export async function POST(req: NextRequest) {
  const who = await requireStaff(req);
  if (!who.ok) return NextResponse.json({ error: who.error }, { status: who.status });
  if (!env.geminiKey) return NextResponse.json({ error: "notConfigured" }, { status: 503 });

  const body = (await req.json().catch(() => null)) as { question?: unknown; history?: unknown } | null;
  const question = clean(body?.question, 500);
  if (!question) return NextResponse.json({ error: "empty" }, { status: 400 });
  const limit = await takeToken("assistant", who.uid, { perMinute: 10, perDay: capFromEnv("ADMIN_ASSISTANT_DAILY_CAP", 300) }).catch(
    () => ({ ok: true }) as const,
  );
  if (!limit.ok) {
    return NextResponse.json({ error: limit.error }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }
  // The last few questions and answers, so "and who else?" makes sense. Only text, capped.
  const history = (Array.isArray(body?.history) ? body.history : [])
    .slice(-4)
    .map((h) => ({ q: clean((h as { q?: unknown })?.q, 500), a: clean((h as { a?: unknown })?.a, 1500) }))
    .filter((h) => h.q && h.a);

  try {
    return NextResponse.json({ answer: await officeAnswer(question, history) }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("office assistant failed", err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}

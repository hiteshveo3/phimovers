import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/admin/require-staff";
import { quoteSummary } from "@/kit/assistant/quote";
import { firestoreReady } from "@/lib/assistant/env";
import { listJSON } from "@/lib/assistant/store";
import { hashId, type Conversation, type UserRecord } from "@/lib/assistant/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const iso = (ms: number) => new Date(ms).toISOString();

/**
 * Staff export of every saved "Ask Phi" chat: GET returns JSON for the dashboard (/admin/chats).
 * ?download=1 sends it as a file, ?anon=1 leaves out the first names customers gave.
 * Staff only (Firebase ID token in `Authorization: Bearer`).
 */
export async function GET(req: NextRequest) {
  const who = await requireStaff(req);
  if (!who.ok) return NextResponse.json({ error: who.error }, { status: who.status });

  const params = req.nextUrl.searchParams;
  const anon = params.get("anon") === "1";

  let users: UserRecord[];
  let convs: Conversation[];
  try {
    [users, convs] = await Promise.all([listJSON<UserRecord>("phi:u:"), listJSON<Conversation>("phi:c:")]);
  } catch (err) {
    console.error("chat export failed", err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const owner = new Map<string, UserRecord>();
  for (const u of users) for (const c of u.conversations) owner.set(c.id, u);

  const conversations = convs
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((c) => {
      const u = owner.get(c.id);
      const quotes = c.messages.flatMap((m) => (m.quote ? [quoteSummary(m.quote)] : []));
      return {
        id: c.id,
        startedAt: iso(c.createdAt),
        updatedAt: iso(c.updatedAt),
        customer: u ? { id: hashId(u.id).slice(0, 10), ...(anon ? {} : { name: u.name ?? null }) } : null,
        firstQuestion: c.title,
        customerMessages: c.messages.filter((m) => m.role === "user").length,
        quotes,
        messages: c.messages.map((m) => ({
          role: m.role === "user" ? "customer" : "phi",
          at: iso(m.at),
          text: m.content,
          ...(m.voice ? { voice: true } : {}),
          ...(m.photos ? { photos: m.photos } : {}),
          ...(m.quote ? { quote: quoteSummary(m.quote) } : {}),
          ...(m.table ? { table: m.table.title } : {}),
        })),
      };
    });

  const data = {
    exportedAt: iso(Date.now()),
    storage: firestoreReady() ? "firestore" : "memory",
    anonymised: anon,
    totals: {
      customers: users.length,
      customersWithName: users.filter((u) => u.name).length,
      conversations: conversations.length,
      customerMessages: conversations.reduce((n, c) => n + c.customerMessages, 0),
      quotesShown: conversations.reduce((n, c) => n + c.quotes.length, 0),
    },
    conversations,
  };

  if (params.get("download") !== "1") return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  const name = `phi-movers-chats-${data.exportedAt.slice(0, 10)}${anon ? "-anonymised" : ""}.json`;
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${name}"`,
    },
  });
}

// A quote the office sends stays open for QUOTE_DAYS days; after that the customer asks for a fresh one.
// Shared by the portal's quote page and /api/client/quotes.

export const QUOTE_DAYS = 7;

/** When the quote was sent: the latest "quote" activity line, else the lead's last update. */
export function quotedAt(activity: unknown, updatedAt: unknown): string | null {
  const lines = Array.isArray(activity) ? (activity as { type?: string; at?: string; text?: string }[]) : [];
  const last = lines.filter((a) => a.type === 'quote' && typeof a.at === 'string' && /Quote set/i.test(a.text ?? '')).pop();
  if (last?.at) return last.at;
  return typeof updatedAt === 'string' ? updatedAt : null;
}

export function quoteExpiry(activity: unknown, updatedAt: unknown): Date | null {
  const at = quotedAt(activity, updatedAt);
  return at ? new Date(Date.parse(at) + QUOTE_DAYS * 86_400_000) : null;
}

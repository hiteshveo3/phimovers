// The chat brain: Gemini with two tools (price_quote, show_table), streamed to the panel.
// A manual streaming loop, so each tool result (a price card, a table) reaches the browser
// the moment it is ready, while the text keeps streaming around it.

import type { Settings } from '../../kit/assistant/config';
import { normaliseInput, priceQuote, quoteKey, quoteSummary, type Quote } from '../../kit/assistant/quote';
import { env } from './env';
import { streamGenerate, type GeminiContent, type GeminiPart } from './gemini';
import { sign } from './http';
import { dynamicContext, PRICE_QUOTE_DESCRIPTION, PRICE_QUOTE_SCHEMA, stableSystemPrompt } from './knowledge';
import { cleanName, type StoredMessage, type Table } from './users';

export type ChatEvent =
  | { t: 'text'; d: string }
  | { t: 'quote'; quote: Quote }
  | { t: 'table'; table: Table }
  | { t: 'replies'; replies: string[] };

export type Photo = { data: string; mime: 'image/jpeg' | 'image/png' | 'image/webp' };

export type ChatResult = { text: string; quotes: Quote[]; tables: Table[]; replies: string[]; refused: boolean; name?: string };

const MAX_ROUNDS = 4;
/** Whole turn, tool rounds included; ends before the route's 60-second limit. */
const TURN_MS = 55_000;
/** Finish reasons that mean Gemini would not answer. */
const BLOCKED = new Set(['SAFETY', 'PROHIBITED_CONTENT', 'BLOCKLIST', 'SPII', 'IMAGE_SAFETY']);

let cachedPrompt = '';
const systemPrompt = () => (cachedPrompt ||= stableSystemPrompt());

export const signQuote = (q: Quote): Quote => ({ ...q, sig: sign(quoteKey(q)) });

/** Server-made quote from untrusted input (a tool call or the price card's buttons). */
export const makeQuote = (raw: Record<string, unknown>) => signQuote(priceQuote(normaliseInput(raw)));

const TOOLS = [
  {
    functionDeclarations: [
      { name: 'price_quote', description: PRICE_QUOTE_DESCRIPTION, parameters: PRICE_QUOTE_SCHEMA },
      {
        name: 'show_table',
        description: 'Shows a small table in the chat, for example vans compared by home size. Up to 6 rows and 4 columns of short text.',
        parameters: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            columns: { type: 'array', items: { type: 'string' } },
            rows: { type: 'array', items: { type: 'array', items: { type: 'string' } } },
          },
          required: ['title', 'rows'],
        },
      },
      {
        name: 'save_name',
        description: 'Saves the first name of the customer the moment they tell you it, so the office and later chats can use it.',
        parameters: { type: 'object', properties: { name: { type: 'string', description: 'First name only.' } }, required: ['name'] },
      },
    ],
  },
];

const cell = (v: unknown) => (typeof v === 'string' || typeof v === 'number' ? String(v).slice(0, 80) : '');

function cleanTable(raw: Record<string, unknown>): Table | null {
  if (typeof raw.title !== 'string' || !Array.isArray(raw.rows)) return null;
  const rows = raw.rows.filter(Array.isArray).slice(0, 8).map((r) => (r as unknown[]).slice(0, 5).map(cell));
  if (!rows.length) return null;
  const columns = Array.isArray(raw.columns) ? raw.columns.slice(0, 5).map(cell) : undefined;
  return { title: raw.title.slice(0, 80), columns, rows };
}

/** Earlier turns as plain text. Photos are not re-sent, and price cards come back as a one-line summary. */
function historyToContents(history: StoredMessage[]): GeminiContent[] {
  const out: GeminiContent[] = [];
  for (const m of history) {
    let text = m.content.trim();
    if (m.role === 'user') {
      if (m.voice) text = `(voice message) ${text}`;
      if (m.photos) text = `${text}\n[The customer sent ${m.photos} photo${m.photos > 1 ? 's' : ''} here.]`.trim();
    } else {
      if (m.quote) text = `${text}\n[Price card shown: ${quoteSummary(m.quote)}]`.trim();
      if (m.table) text = `${text}\n[Table shown: ${m.table.title}]`.trim();
    }
    if (!text) continue;
    if (!out.length && m.role === 'assistant') continue;
    out.push({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text }] });
  }
  return out;
}

/** Holds back the trailing "[[replies: …]]" line so it never shows in the chat. */
function replyFilter(emitText: (d: string) => void) {
  let pending = '';
  let replies: string[] = [];
  const parse = (line: string) => {
    const m = line.trim().match(/^\[\[replies:(.*)\]\]$/i);
    return m ? m[1].split('|').map((s) => s.trim()).filter((s) => s && s.length <= 40).slice(0, 4) : null;
  };
  const maybeMarker = (s: string) => {
    const t = s.trimStart();
    return t.startsWith('[[') || '[[replies:'.startsWith(t.slice(0, 10).toLowerCase());
  };
  return {
    push(d: string) {
      pending += d;
      let nl = pending.indexOf('\n');
      while (nl >= 0) {
        const line = pending.slice(0, nl + 1);
        pending = pending.slice(nl + 1);
        const r = parse(line);
        if (r) replies = r;
        else emitText(line);
        nl = pending.indexOf('\n');
      }
      if (pending && !maybeMarker(pending)) {
        emitText(pending);
        pending = '';
      }
    },
    end() {
      const r = parse(pending);
      if (r) replies = r;
      else if (pending) emitText(pending);
      pending = '';
      return replies;
    },
  };
}

export async function runChat(opts: {
  history: StoredMessage[];
  message: string;
  photos: Photo[];
  voice: boolean;
  settings: Settings;
  notes: string[];
  /** The customer's first name, when a past chat saved it. */
  name?: string;
  userId: string;
  emit: (e: ChatEvent) => void;
  signal?: AbortSignal;
}): Promise<ChatResult> {
  const deadline = AbortSignal.timeout(TURN_MS);
  const signal = opts.signal ? AbortSignal.any([opts.signal, deadline]) : deadline;
  const userText = `${opts.voice ? '(voice message) ' : ''}${opts.message}`.trim() || 'Please look at this.';
  const contents: GeminiContent[] = [
    ...historyToContents(opts.history),
    { role: 'user', parts: [...opts.photos.map((p): GeminiPart => ({ inlineData: { mimeType: p.mime, data: p.data } })), { text: userText }] },
  ];
  // The fixed prompt goes first, so Gemini's automatic prompt cache can reuse it between turns.
  const systemInstruction = { parts: [{ text: systemPrompt() }, { text: dynamicContext(opts.settings, opts.notes, 'chat', opts.name) }] };

  let text = '';
  const quotes: Quote[] = [];
  const tables: Table[] = [];
  let savedName: string | undefined;
  const filter = replyFilter((d) => {
    text += d;
    opts.emit({ t: 'text', d });
  });

  const runTool = (name: string, input: Record<string, unknown>): Record<string, unknown> => {
    if (name === 'price_quote') {
      const quote = makeQuote(input);
      quotes.push(quote);
      opts.emit({ t: 'quote', quote });
      return quote.onCall
        ? { shown: true, quoted_individually: true, note: 'This move is quoted individually by the team. Offer the Get a quote button on the card or the phone number.' }
        : { shown: true, summary: quoteSummary(quote), total_gbp: quote.total, hours: quote.hours, van: quote.vanLabel, lines: quote.lines };
    }
    if (name === 'show_table') {
      const table = cleanTable(input);
      if (!table) return { error: 'The table needs a title and at least one row of text cells.' };
      tables.push(table);
      opts.emit({ t: 'table', table });
      return { shown: true, note: 'The table is shown. Do not repeat it in text.' };
    }
    if (name === 'save_name') {
      const clean = cleanName(input.name);
      if (!clean) return { error: 'No name given.' };
      savedName = clean;
      return { saved: true, note: 'Use the name naturally. Do not mention that it was saved.' };
    }
    return { error: `Unknown tool ${name}` };
  };

  for (let round = 0; round < MAX_ROUNDS; round += 1) {
    // Every part is kept exactly as it arrived: Gemini needs its thought signatures back with the tool results.
    const parts: GeminiPart[] = [];
    let finish = '';
    let blocked = false;
    const chunks = streamGenerate(env.geminiChatModel, {
      systemInstruction,
      tools: TOOLS,
      generationConfig: { maxOutputTokens: 16000, thinkingConfig: { thinkingLevel: 'low' } },
      contents,
    }, signal);
    for await (const chunk of chunks) {
      if (chunk.promptFeedback?.blockReason) blocked = true;
      const candidate = chunk.candidates?.[0];
      if (candidate?.finishReason) finish = candidate.finishReason;
      for (const part of candidate?.content?.parts ?? []) {
        parts.push(part);
        if (part.text && !part.thought) filter.push(part.text);
      }
    }

    if (blocked || BLOCKED.has(finish)) {
      const replies = filter.end();
      return { text, quotes, tables, replies, refused: !text.trim() && !quotes.length, name: savedName };
    }
    // A tool call Gemini could not put together: re-issue the turn once.
    if (finish === 'MALFORMED_FUNCTION_CALL' && round === 0) continue;
    const calls = parts.flatMap((p) => (p.functionCall ? [p.functionCall] : []));
    if (!calls.length) break;

    // Separate the text before a tool call from the text after it.
    if (text && !text.endsWith('\n')) filter.push('\n\n');

    contents.push({ role: 'model', parts });
    contents.push({
      role: 'user',
      parts: calls.map((call) => ({
        functionResponse: { ...(call.id ? { id: call.id } : {}), name: call.name, response: runTool(call.name, call.args ?? {}) },
      })),
    });
  }

  const replies = filter.end();
  opts.emit({ t: 'replies', replies });
  return { text: text.trim(), quotes, tables, replies, refused: false, name: savedName };
}

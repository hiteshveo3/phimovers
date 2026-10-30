import { Fragment, type ReactNode } from 'react';
import type { Table } from '../../assistant/client';

// The small slice of Markdown the assistant is allowed to write: paragraphs, **bold**, lists and
// links to our own pages. Rendered as React elements, never as HTML.

const SAFE_LINK = /^(\/[\w\-./#?=&%]*|https:\/\/(www\.)?phimovers\.co\.uk[\w\-./#?=&%]*|https:\/\/wa\.me\/\d+|tel:\+?[\d ]+|mailto:[\w.+-]+@[\w.-]+)$/;

function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={`${key}b${i}`}>{m[1]}</strong>);
    else if (SAFE_LINK.test(m[3])) out.push(<a key={`${key}a${i}`} href={m[3]}>{m[2]}</a>);
    else out.push(m[2]);
    last = m.index + m[0].length;
    i += 1;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Markdown({ text }: { text: string }) {
  const blocks = text.replace(/\r/g, '').split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split('\n');
        if (lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
          return <ul key={bi}>{lines.map((l, li) => <li key={li}>{inline(l.replace(/^\s*[-*•]\s+/, ''), `${bi}-${li}`)}</li>)}</ul>;
        }
        if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
          return <ol key={bi}>{lines.map((l, li) => <li key={li}>{inline(l.replace(/^\s*\d+[.)]\s+/, ''), `${bi}-${li}`)}</li>)}</ol>;
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {inline(l.replace(/^#+\s*/, ''), `${bi}-${li}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

export function TableView({ table }: { table: Table }) {
  return (
    <figure className="amc-table">
      <figcaption>{table.title}</figcaption>
      <div className="amc-table-scroll">
        <table>
          {table.columns?.length ? (
            <thead><tr>{table.columns.map((c, i) => <th key={i} scope="col">{c}</th>)}</tr></thead>
          ) : null}
          <tbody>
            {table.rows.map((r, ri) => (
              <tr key={ri}>{r.map((c, ci) => (ci === 0 && table.columns?.length ? <th key={ci} scope="row">{c}</th> : <td key={ci}>{c}</td>))}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

/** Plain text of a message, for copying and downloading. */
export const plainText = (text: string) => text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)');

import { ArrowRight as ArrowRightIcon } from 'iconsax-reactjs';
import { Breadcrumbs, DcPage, NOTE, h1Style, icon, leadStyle } from './DcPage';
import { COMPANY, legalDocs, legalNav, type LegalBlock, type LegalDoc } from '../../lib/legal';

// Legal pages in the Alpha privacy-policy layout (title, updated line, dc-prose body), plus the old page's
// side navigation: the other legal pages and this page's sections.

const CSS = `
.lg{display:grid;grid-template-columns:240px minmax(0,1fr);gap:clamp(24px,4vw,56px);align-items:start;max-width:1216px;margin:0 auto;padding:clamp(24px,4vw,40px) 5vw clamp(30px,4vw,52px)}
.lg-side{position:sticky;top:84px;display:grid;gap:22px}
.lg-side p{margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--ink-60)}
.lg-side nav{display:grid;gap:2px}
.lg-side a{display:block;padding:8px 12px;border-radius:12px;font-size:14.5px;font-weight:500;color:var(--ink-72)}
.lg-side a:hover{background:var(--grey);color:var(--ink)}
.lg-side a[aria-current=page]{background:var(--lime);color:var(--ink);font-weight:600}
.lg-side .lg-num{color:var(--accent);margin-right:4px}
.lg-body.dc-prose{max-width:760px;padding:0}
.lg-body.dc-prose h2{font-size:clamp(22px,2.4vw,28px);margin:38px 0 12px}
.lg-body.dc-prose section:first-child h2{margin-top:0}
.lg-body .lg-note{margin:0 0 18px;padding:14px 16px;border-radius:14px;background:var(--green-soft);color:var(--ink)}
.lg-body .lg-note p{margin:0;color:var(--ink)}
.lg-contact{margin-top:36px;padding:20px;border-radius:20px;background:#fff;border:1px solid rgba(15,26,9,.05);box-shadow:var(--card-shadow)}
.lg-contact b{display:block;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:19px;margin-bottom:4px}
.lg-contact p{margin:0 0 12px;font-size:15px}
.lg-contact div{display:flex;flex-wrap:wrap;gap:10px}
.lg-hub{margin:0;padding:0;list-style:none;border-top:1px solid rgba(15,26,9,.1);max-width:760px}
.lg-hub a{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 0;border-bottom:1px solid rgba(15,26,9,.1);color:var(--ink)}
.lg-hub b{display:block;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:18px;letter-spacing:-.01em}
.lg-hub small{display:block;margin-top:2px;font-size:14px;line-height:1.5;color:var(--ink-68)}
.lg-hub svg{flex:none;color:var(--accent);transition:translate .2s ease}
.lg-hub a:hover svg{translate:4px 0}
.lg-co{max-width:760px;margin-top:32px;font-size:15px;line-height:1.6;color:var(--ink-72)}
.lg-co p{margin:0 0 4px}
@media (max-width:900px){.lg{grid-template-columns:1fr}.lg-side{position:static}.lg-side nav{display:flex;flex-wrap:wrap;gap:6px}.lg-side a{background:var(--band);padding:8px 13px;border-radius:999px;font-size:13.5px}}
`;

function Block({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case 'h3':
      return <h3>{block.text}</h3>;
    case 'ul':
      return <ul>{block.items.map((it) => <li key={it} dangerouslySetInnerHTML={{ __html: it }} />)}</ul>;
    case 'note':
      return <div className="lg-note" role="note"><p dangerouslySetInnerHTML={{ __html: block.text }} /></div>;
    default:
      return <p dangerouslySetInnerHTML={{ __html: block.text }} />;
  }
}

export function LegalView({ slug }: { slug: string }) {
  const doc: LegalDoc = legalDocs[slug];
  return (
    <DcPage
      title={`${doc.title} — ${COMPANY.tradingName}`}
      description={doc.subtitle}
      path={`/${doc.slug}`}
      canonical={`${COMPANY.site}/${doc.slug}`}
      crumbs={[{ name: 'Legal', path: '/legal' }, { name: doc.title, path: `/${doc.slug}` }]}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ padding: 'clamp(30px,5vw,56px) 5vw 0', maxWidth: 1216, margin: '0 auto' }}>
        <Breadcrumbs crumbs={[{ name: 'Legal', path: '/legal' }, { name: doc.title, path: `/${doc.slug}` }]} />
        <h1 style={{ ...h1Style('none', 'clamp(32px,4.2vw,48px)'), lineHeight: 1.05, margin: '0 0 12px' }}>{doc.title}</h1>
        <p style={leadStyle('60ch', '0 0 10px')}>{doc.subtitle}</p>
        <p style={{ margin: 0, fontSize: 15, color: NOTE }}>Last updated: {doc.updated} · {COMPANY.legalName}</p>
      </section>

      <div className="lg">
        <aside className="lg-side">
          <div>
            <p>Legal pages</p>
            <nav aria-label="Legal pages">
              {legalNav.map((l) => (
                <a key={l.slug} href={`/${l.slug}`} aria-current={l.slug === doc.slug ? 'page' : undefined}>{l.label}</a>
              ))}
            </nav>
          </div>
          <div>
            <p>On this page</p>
            <nav aria-label="On this page">
              {doc.sections.map((s, i) => (
                <a key={s.id} href={`#${s.id}`}><span className="lg-num">{i + 1}.</span> {s.title}</a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="dc-prose lg-body">
          {doc.sections.map((s, i) => (
            <section key={s.id} id={s.id}>
              <h2>{i + 1}. {s.title}</h2>
              {s.blocks.map((b, j) => <Block key={j} block={b} />)}
            </section>
          ))}
          <div className="lg-contact">
            <b>Need to talk to a human?</b>
            <p>Our London team is happy to help with any questions about this policy or your move.</p>
            <div>
              <a className="dc-btn dc-btn-lime" style={{ fontSize: 15, padding: '12px 20px' }} href={`mailto:${COMPANY.emailGeneral}`}>Email us</a>
              <a className="dc-btn dc-btn-white" style={{ fontSize: 15, padding: '12px 20px' }} href={COMPANY.phoneHref}>{COMPANY.phoneDisplay}</a>
            </div>
          </div>
        </article>
      </div>
    </DcPage>
  );
}

export function LegalHub() {
  return (
    <DcPage
      title={`Legal & Policies — ${COMPANY.tradingName}`}
      description="Privacy Policy, Cookie Policy, Terms & Conditions, Complaints Procedure and Accessibility Statement for Phi Movers."
      path="/legal"
      canonical={`${COMPANY.site}/legal`}
      crumbs={[{ name: 'Legal' }]}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ padding: 'clamp(30px,5vw,56px) 5vw clamp(30px,4vw,52px)', maxWidth: 1216, margin: '0 auto' }}>
        <Breadcrumbs crumbs={[{ name: 'Legal' }]} />
        <h1 style={{ ...h1Style('none', 'clamp(32px,4.2vw,48px)'), lineHeight: 1.05, margin: '0 0 12px' }}>Legal &amp; policies</h1>
        <p style={leadStyle('60ch', '0 0 26px')}>Everything about how we work, protect your data and put things right. If you can&apos;t find what you need, our team is one call away.</p>
        <ul className="lg-hub">
          {legalNav.map((l) => {
            const d = legalDocs[l.slug];
            return (
              <li key={l.slug}>
                <a href={`/${l.slug}`}><span><b>{d.title}</b><small>{d.subtitle}</small></span>{icon(ArrowRightIcon, 18)}</a>
              </li>
            );
          })}
        </ul>
        <div className="lg-co">
          <p><b>{COMPANY.legalName}</b></p>
          <p>{COMPANY.address}</p>
          {(COMPANY.companyNo || COMPANY.vatNo) && (
            <p>{[COMPANY.companyNo ? `Company No. ${COMPANY.companyNo}` : null, COMPANY.vatNo ? `VAT ${COMPANY.vatNo}` : null].filter(Boolean).join(' · ')}</p>
          )}
          <p><a className="dc-inline-link" href={`mailto:${COMPANY.emailGeneral}`}>{COMPANY.emailGeneral}</a> · <a className="dc-inline-link" href={COMPANY.phoneHref}>{COMPANY.phoneDisplay}</a></p>
        </div>
      </section>
    </DcPage>
  );
}

export default LegalView;

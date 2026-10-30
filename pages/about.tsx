import { ArrowRight as ArrowRightIcon, ExportSquare as ExportSquareIcon } from 'iconsax-reactjs';
import { Breadcrumbs, CtaBand, DcPage, band, h1Style, h2Style, icon, leadStyle } from '../kit/components/DcPage';
import { CALL_HREF, CALL_LABEL, EMAIL, EMAIL_HREF, SITE_URL } from '../lib/contact';

// Three values as hairline rows, how we work, ways to reach us, closing CTA.

const CSS = `
.ab-rows{margin:0;padding:0;list-style:none;border-top:1px solid rgba(15,26,9,.1)}
.ab-rows a,.ab-rows .ab-row{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 0;border-bottom:1px solid rgba(15,26,9,.1);color:var(--ink)}
.ab-rows b{display:block;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:17px;letter-spacing:-.01em}
.ab-rows small{display:block;margin-top:2px;font-size:13.5px;line-height:1.5;color:var(--ink-60)}
.ab-rows svg{flex:none;color:var(--accent);transition:translate .2s ease}
.ab-rows a:hover svg{translate:4px 0}
.ab-badge{display:inline-flex;margin:0 0 14px;padding:4px 12px;border-radius:999px;background:var(--lime);color:var(--ink);font-size:12.5px;font-weight:600}
.ab-steps{margin:0;padding:0;list-style:none;display:grid;gap:12px}
.ab-steps b{font-weight:600;color:var(--ink)}
`;

const values = [
  { title: 'Fixed prices, no surprises', text: 'You agree the quote before moving day — goods-in-transit and liability cover included as standard.' },
  { title: 'London specialists only', text: 'We know the boroughs, permits, stairs and loading bays — we don’t stretch outside the capital.' },
  { title: 'Friendly, experienced crews', text: 'Uniformed movers who protect floors, doors and furniture, then leave your new place ready to live in.' },
];

const steps = [
  { title: '1. Tell us the job', text: 'addresses and rooms, by phone or quote request.' },
  { title: '2. Get a fixed quote', text: 'usually within about one working hour.' },
  { title: '3. We move you', text: 'insured crew, careful loading, clear communication.' },
];

const reach = [
  { title: CALL_LABEL, href: CALL_HREF, external: false },
  { title: EMAIL, href: EMAIL_HREF, external: false },
];

export default function About() {
  return (
    <DcPage
      title="About Phi Movers — London Removals Team"
      description="Meet Phi Movers — a London-only removals company covering all 32 boroughs with fixed-price quotes, insured crews and stress-free moving days."
      path="/about"
      canonical={`${SITE_URL}/about`}
      crumbs={[{ name: 'About' }]}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ padding: 'clamp(28px,5vw,60px) 5vw' }}>
        <div style={{ maxWidth: 1216, margin: '0 auto' }}>
          <Breadcrumbs crumbs={[{ name: 'About' }]} />
          <span className="ab-badge">London-only removals</span>
          <h1 style={h1Style('19ch')}>Stress-free moves across every London borough</h1>
          <p style={leadStyle('56ch', '0')}>Phi Movers is a local removals company built for London living — flats, houses, offices and single items. We quote clearly by phone or quote request, turn up on time, and treat your home with care.</p>
        </div>
      </section>

      <section style={band(true, 'clamp(44px,6vw,72px) 5vw clamp(28px,4vw,52px)')}>
        <div style={{ maxWidth: 1216, margin: '0 auto' }}>
          <ul className="ab-rows" style={{ maxWidth: 720 }}>
            {values.map((v) => (
              <li key={v.title}>
                <h2 className="ab-row" style={{ margin: 0, font: 'inherit' }}><span><b>{v.title}</b><small>{v.text}</small></span></h2>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="dc-prose" style={{ maxWidth: 720, padding: 'clamp(28px,4vw,48px) 5vw' }}>
        <h2 className="dc-text">How we work</h2>
        <ol className="ab-steps">
          {steps.map((s) => (
            <li key={s.title} className="dc-text"><b>{s.title}</b> — {s.text}</li>
          ))}
        </ol>
      </div>

      <section style={band(true, 'clamp(28px,4vw,48px) 5vw clamp(44px,6vw,72px)')}>
        <div style={{ maxWidth: 1216, margin: '0 auto' }}>
          <h2 style={h2Style('0 0 8px', 'clamp(22px,2.6vw,30px)')}>Talk to us</h2>
          <p style={leadStyle('52ch', '0 0 18px')}>Prefer a quick chat? Call or email — one inbox for the whole team.</p>
          <ul className="ab-rows" style={{ maxWidth: 720 }}>
            {reach.map((f) => (
              <li key={f.title}>
                <a href={f.href} target={f.external ? '_blank' : undefined} rel={f.external ? 'noopener noreferrer' : undefined}>
                  <span><b>{f.title}</b></span>
                  {icon(f.external ? ExportSquareIcon : ArrowRightIcon, 18)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title="Ready to book your stress-free move?" text="Start your free quote in under a minute — we usually reply within about one working hour. No obligation, no hidden fees." />
    </DcPage>
  );
}

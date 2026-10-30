import { ArrowRight as ArrowRightIcon, ExportSquare as ExportSquareIcon } from 'iconsax-reactjs';
import { Breadcrumbs, DcPage, MapEmbed, band, bodySmall, h1Style, h2Style, icon, leadStyle } from '../kit/components/DcPage';
import QuoteForm from '../kit/components/QuoteForm';
import { ADDRESS, CALL_HREF, CALL_LABEL, EMAIL, EMAIL_HREF, SITE_URL } from '../lib/contact';

// Three hairline rows (phone, email, address), the quote form (#quote) and a short "what to include" list.

const CSS = `
.ct-rows{margin:0;padding:0;list-style:none;border-top:1px solid rgba(15,26,9,.1)}
.ct-rows a{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 0;border-bottom:1px solid rgba(15,26,9,.1);color:var(--ink)}
.ct-rows b{display:block;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:17px;letter-spacing:-.01em}
.ct-rows small{display:block;margin-top:2px;font-size:13.5px;color:var(--ink-60)}
.ct-rows svg{flex:none;color:var(--accent);transition:translate .2s ease}
.ct-rows a:hover svg{translate:4px 0}
.ct-list{margin:0;padding:0;list-style:none;border-top:1px solid rgba(15,26,9,.1);max-width:720px}
.ct-list li{padding:16px 0;border-bottom:1px solid rgba(15,26,9,.1)}
.ct-badge{display:inline-flex;margin:0 0 14px;padding:4px 12px;border-radius:999px;background:var(--lime);color:var(--ink);font-size:12.5px;font-weight:600}
.ct-quote{max-width:820px;margin:0 auto}
`;

const rows = [
  { title: 'Phone', text: 'Prefer to talk it through? We’re happy to help over a quick call.', href: CALL_HREF, label: CALL_LABEL, external: false },
  { title: 'Email', text: 'One inbox for quotes, bookings and support — we read every message.', href: EMAIL_HREF, label: EMAIL, external: false },
  { title: 'Office Address', text: ADDRESS, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`, label: 'View on Google Maps', external: true },
];

const include = [
  'Pick-up and drop-off postcodes',
  'Property type and floor / lift access',
  'Rough inventory or room photos',
  'Preferred date or flexibility window',
];

export default function Contact() {
  return (
    <DcPage
      title="Contact Phi Movers — Call or Email"
      description="Contact Phi Movers for a fixed-price London removals quote. Phone or email info@phimovers.co.uk — we usually reply within about one working hour."
      path="/contact"
      canonical={`${SITE_URL}/contact`}
      crumbs={[{ name: 'Contact' }]}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <section style={{ padding: 'clamp(30px,5vw,60px) 5vw clamp(24px,4vw,44px)' }}>
        <div style={{ maxWidth: 1216, margin: '0 auto' }}>
          <Breadcrumbs crumbs={[{ name: 'Contact' }]} />
          <span className="ct-badge">Usually reply within ~1 hour</span>
          <h1 style={h1Style('16ch')}>Contact Phi Movers</h1>
          <p style={leadStyle('52ch', '0 0 28px')}>Get a fixed-price quote for house removals, man &amp; van, sofa delivery or office moves across all 32 London boroughs.</p>
          <ul className="ct-rows" style={{ maxWidth: 720 }}>
            {rows.map((r) => (
              <li key={r.title}>
                <a href={r.href} target={r.external ? '_blank' : undefined} rel={r.external ? 'noopener noreferrer' : undefined} aria-label={`${r.title}: ${r.label}`}>
                  <span><b>{r.title}</b><small>{r.text}</small><small style={{ color: 'var(--ink)', fontWeight: 600 }}>{r.label}</small></span>
                  {icon(r.external ? ExportSquareIcon : ArrowRightIcon, 18)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section style={{ padding: '0 5vw clamp(24px,4vw,44px)' }}>
        <div style={{ maxWidth: 1216, margin: '0 auto' }}>
          <MapEmbed zoom={13} title="Map showing the Phi Movers base in Dagenham" aspectRatio="21/9" />
        </div>
      </section>

      <section id="quote" style={band(true)}>
        <div className="ct-quote">
          <QuoteForm />
        </div>
      </section>

      <section style={{ ...band(false), borderBottom: 0 }}>
        <div style={{ maxWidth: 1216, margin: '0 auto' }}>
          <h2 style={h2Style('0 0 18px', 'clamp(22px,2.6vw,30px)')}>What to include for a faster quote</h2>
          <ul className="ct-list">
            {include.map((t) => (
              <li key={t}><p style={bodySmall}>{t}</p></li>
            ))}
          </ul>
        </div>
      </section>
    </DcPage>
  );
}

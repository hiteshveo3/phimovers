import type { CSSProperties, ReactNode } from 'react';
import { Building as BuildingIcon, Call as CallIcon, ExportSquare as ExternalIcon, Location as LocationIcon, ShieldTick as ShieldTickIcon, Sms as SmsIcon, Star1 as StarIcon } from 'iconsax-reactjs';
import { BOOK, Breadcrumbs, CtaBand, DcPage } from '../kit/components/DcPage';
import { MOTION_CSS, Words, useHomeMotion } from '../kit/components/HomeMotion';
import { Eyebrow, Head, KIT_CSS, kitIcon } from '../kit/components/PageKit';
import { ADDRESS, BRAND, COMPANIES_HOUSE_URL, COMPANY_NAME, COMPANY_NO, EMAIL, GOOGLE_DIRECTIONS, GOOGLE_REVIEW_URL, HOURS_LONG, INSURED_TEXT, PHONE_DISPLAY, PHONE_TEL, RATING, SITE, SOCIALS, TRUSTPILOT_URL } from '../kit/site-facts';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

// Facts about the company that anyone can check somewhere else. A row only appears once its fact is filled
// in kit/site-facts.ts, so there is never a blank link or a placeholder number.
const TRUST_CSS = `
.tr-rows{margin:0;padding:0;list-style:none;border-top:1px solid var(--line)}
.tr-row{display:grid;grid-template-columns:38px minmax(0,1fr) auto;gap:4px 16px;align-items:center;padding:16px 0;border-bottom:1px solid var(--line)}
.tr-row>span:first-child{grid-row:span 2}
.tr-row b{font-size:15.5px;font-weight:600}
.tr-row small{grid-column:2;font-size:14px;line-height:1.5;color:var(--ink-68)}
.tr-row a.tr-check{grid-row:1 / span 2;grid-column:3;display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 14px;border-radius:999px;background:var(--band);font-size:13.5px;font-weight:600;white-space:nowrap}
.tr-row a.tr-check:hover{background:var(--green-soft)}
@media (max-width:640px){.tr-row{grid-template-columns:38px minmax(0,1fr)}.tr-row a.tr-check{grid-column:2;grid-row:auto;justify-self:start;margin-top:6px}}
`;

type Row = { ico: typeof BuildingIcon; title: string; text: ReactNode; href?: string; check?: string };
const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

const rows: Row[] = [
  { ico: BuildingIcon, title: COMPANY_NAME, text: COMPANY_NO ? `Registered in England and Wales, company number ${COMPANY_NO}.` : `The company behind ${BRAND}.`, ...(COMPANY_NO ? { href: COMPANIES_HOUSE_URL, check: 'Companies House' } : {}) },
  { ico: LocationIcon, title: 'Our address', text: ADDRESS, href: GOOGLE_DIRECTIONS, check: 'Google Maps' },
  ...(GOOGLE_REVIEW_URL ? [{ ico: StarIcon, title: `${RATING.score} on ${RATING.source}`, text: `From ${RATING.count} reviews on our Google profile.`, href: GOOGLE_REVIEW_URL, check: 'Google reviews' }] : []),
  ...(TRUSTPILOT_URL ? [{ ico: StarIcon, title: 'Trustpilot', text: 'Independent reviews from our customers.', href: TRUSTPILOT_URL, check: 'Trustpilot' }] : []),
  { ico: ShieldTickIcon, title: INSURED_TEXT, text: 'Goods in transit and public liability insurance on every move.', href: '/insurance', check: 'Our cover' },
  { ico: CallIcon, title: PHONE_DISPLAY, text: `Our own office, ${HOURS_LONG}.`, href: PHONE_TEL, check: 'Call' },
  { ico: SmsIcon, title: EMAIL, text: 'For quotes, bookings and anything in writing.', href: `mailto:${EMAIL}`, check: 'Email' },
];

export default function Trust() {
  useHomeMotion();
  const socials = SOCIALS.filter((s) => s.url);
  return (
    <DcPage
      title={`Trust and Verification | ${BRAND}`}
      description={`Facts about ${COMPANY_NAME} you can check: address, contact details, insurance${COMPANY_NO ? ', Companies House record' : ''} and review profiles.`}
      path="/trust"
      canonical={`${SITE}/trust`}
      crumbs={[{ name: 'Trust and verification' }]}
    >
      <style dangerouslySetInnerHTML={{ __html: MOTION_CSS + KIT_CSS + TRUST_CSS }} />
      <div className="pk">
        <section className="pk-hero">
          <div className="pk-wrap">
            <Breadcrumbs crumbs={[{ name: 'Trust and verification' }]} />
            <Eyebrow>Check us</Eyebrow>
            <h1 className="pk-h1 mo-title"><Words text="The facts you can check" /></h1>
            <p className="pk-hero-lead">Before you hand your belongings to anyone, check who they are. Every fact below links to somewhere you can verify it.</p>
          </div>
        </section>

        <section className="pk-sec" aria-labelledby="facts-h">
          <div className="pk-wrap pk-split">
            <div>
              <Head id="facts-h" eyebrow="Verify" title={`Who ${BRAND} is`} />
            </div>
            <ul className="tr-rows">
              {rows.map((r, i) => (
                <li key={r.title} className="tr-row" data-reveal="" style={{ '--i': i } as Vars}>
                  <span className="pk-ico">{kitIcon(r.ico, 19)}</span>
                  <b>{r.title}</b>
                  <small>{r.text}</small>
                  {r.href && r.check && (
                    <a href={r.href} className="tr-check" {...(r.href.startsWith('http') ? ext : {})}>{r.check}{r.href.startsWith('http') && kitIcon(ExternalIcon, 14)}</a>
                  )}
                </li>
              ))}
              {socials.map((s) => (
                <li key={s.url} className="tr-row">
                  <span className="pk-ico">{kitIcon(ExternalIcon, 18)}</span>
                  <b>{s.name}</b>
                  <small>Our {s.name} profile.</small>
                  <a href={s.url} className="tr-check" {...ext}>Open {kitIcon(ExternalIcon, 14)}</a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <CtaBand title="Happy with what you found?" text="Book online or ask us anything first." book={BOOK} />
    </DcPage>
  );
}

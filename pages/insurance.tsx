import type { CSSProperties } from 'react';
import { Box as BoxIcon, Building as BuildingIcon, DocumentText as DocumentIcon, ShieldTick as ShieldTickIcon, Warning2 as WarningIcon } from 'iconsax-reactjs';
import { BOOK, Breadcrumbs, CtaBand, DcPage, FaqList, faqSchema } from '../kit/components/DcPage';
import { MOTION_CSS, Odo, Words, useHomeMotion } from '../kit/components/HomeMotion';
import { Eyebrow, Head, KIT_CSS, kitIcon } from '../kit/components/PageKit';
import { BRAND, COMPANY_NAME, EMAIL, INSURANCE, INSURED_TEXT, SITE } from '../kit/site-facts';
import { getFaqsForPath } from '../lib/page-faqs';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

// One page on cover. The figures appear only once INSURANCE in kit/site-facts.ts is filled; until then the
// page says what is covered (from the terms in lib/legal.ts) without a number.
const INS_CSS = `
.in-figs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:clamp(24px,3vw,36px) 0 0;padding:0;list-style:none}
.in-fig{padding:clamp(20px,2.4vw,28px)}
.in-fig b{display:block;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:clamp(40px,4.6vw,58px);line-height:1;letter-spacing:-.03em;color:var(--accent)}
.in-fig span{display:block;margin-top:10px;font-size:15px;font-weight:600}
.in-fig small{display:block;margin-top:4px;font-size:13.5px;line-height:1.5;color:var(--ink-68)}
.in-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0;padding:0;list-style:none}
.in-card{padding:18px 20px;height:100%}
.in-card h3{margin:12px 0 6px;font-family:"Bricolage Grotesque",sans-serif;font-weight:500;font-size:18px;letter-spacing:-.01em}
.in-card p{margin:0;font-size:14.5px;line-height:1.55;color:var(--ink-68)}
.in-steps{margin:0;padding:0;list-style:none;counter-reset:s;display:grid;gap:12px}
.in-steps li{counter-increment:s;display:grid;grid-template-columns:36px minmax(0,1fr);gap:14px;align-items:start;padding:16px 18px}
.in-steps li::before{content:counter(s);display:grid;place-items:center;width:36px;height:36px;border-radius:999px;background:var(--lime);font-weight:600}
.in-steps p{margin:6px 0 0;font-size:15px;line-height:1.55;color:var(--ink-68)}
@media (max-width:760px){.in-figs,.in-cards{grid-template-columns:minmax(0,1fr)}}
`;

const gbp = (n: number) => `£${n.toLocaleString('en-GB')}`;
const figures = [
  INSURANCE.goodsInTransit ? { value: gbp(INSURANCE.goodsInTransit), label: 'Goods in transit', text: 'Your belongings while we load, carry and unload them.' } : null,
  INSURANCE.publicLiability ? { value: gbp(INSURANCE.publicLiability), label: 'Public liability', text: 'Damage to property or injury to people while we work.' } : null,
].filter((f): f is { value: string; label: string; text: string } => Boolean(f));

const COVERED = [
  { ico: BoxIcon, title: 'Goods in transit', text: 'Covers your belongings while they are in our care: loading, the journey and unloading.' },
  { ico: BuildingIcon, title: 'Public liability', text: 'Covers damage to the buildings we work in and injury to other people while we are on the job.' },
  { ico: WarningIcon, title: 'Tell us about high-value items', text: 'Let us know about anything of high value before the day so the right cover is in place.' },
  { ico: DocumentIcon, title: 'Packed by you', text: 'Boxes you pack yourself are covered for damage our crew causes, not for how they were packed.' },
];

const faqs = getFaqsForPath('/insurance');

export default function Insurance() {
  useHomeMotion();
  return (
    <DcPage
      title={`Removals Insurance: ${INSURED_TEXT} | ${BRAND}`}
      description={`${INSURED_TEXT}: goods in transit and public liability cover on every ${BRAND} move, what it covers and how to make a claim.`}
      path="/insurance"
      canonical={`${SITE}/insurance`}
      crumbs={[{ name: 'Insurance' }]}
      schema={[faqSchema(faqs)]}
    >
      <style dangerouslySetInnerHTML={{ __html: MOTION_CSS + KIT_CSS + INS_CSS }} />
      <div className="pk">
        <section className="pk-hero">
          <div className="pk-wrap">
            <Breadcrumbs crumbs={[{ name: 'Insurance' }]} />
            <Eyebrow>{kitIcon(ShieldTickIcon, 14)} Cover on every move</Eyebrow>
            <h1 className="pk-h1 mo-title"><Words text={`${INSURED_TEXT}, on every job`} /></h1>
            <p className="pk-hero-lead">{COMPANY_NAME} carries goods in transit and public liability insurance. It applies to every move, from a single item to a full house, at no extra charge.</p>
            {figures.length > 0 && (
              <ul className="in-figs">
                {figures.map((f, i) => (
                  <li key={f.label} className="pk-card in-fig" data-reveal="" style={{ '--i': i } as Vars}>
                    <b><Odo value={f.value} /></b>
                    <span>{f.label}</span>
                    <small>{f.text}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="pk-sec" aria-labelledby="covered-h">
          <div className="pk-wrap pk-split">
            <div>
              <Head id="covered-h" eyebrow="What it covers" title="What our insurance covers" lead={<>The full wording is in our <a href="/terms#liability" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>terms and conditions</a>.</>} />
            </div>
            <ul className="in-cards">
              {COVERED.map((c, i) => (
                <li key={c.title} data-reveal="" style={{ '--i': i } as Vars}>
                  <div className="pk-card in-card">
                    <span className="pk-ico">{kitIcon(c.ico, 20)}</span>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pk-sec" aria-labelledby="claim-h">
          <div className="pk-wrap">
            <div className="pk-band pk-split">
              <div>
                <Head id="claim-h" eyebrow="If something goes wrong" title="How to make a claim" />
              </div>
              <ol className="in-steps">
                <li className="pk-card"><div><b>Tell us in writing</b><p>Email {EMAIL} as soon as you can, normally within 7 days of the move.</p></div></li>
                <li className="pk-card"><div><b>Send photos</b><p>Photos of the item and the damage, and where it happened, help us settle it quickly.</p></div></li>
                <li className="pk-card"><div><b>We reply with next steps</b><p>We look at it with you and, where needed, with our insurer. If you are unhappy with the outcome, see our <a href="/complaints" style={{ textDecoration: 'underline' }}>complaints procedure</a>.</p></div></li>
              </ol>
            </div>
          </div>
        </section>

        <section className="pk-sec" aria-labelledby="ins-faq-h">
          <div className="pk-wrap pk-split">
            <div>
              <Head id="ins-faq-h" eyebrow="FAQ" title="Insurance questions" />
            </div>
            <FaqList items={faqs} idPrefix="ins-faq" />
          </div>
        </section>
      </div>

      <CtaBand title="Insured from the first box" text="Cover is included on every booking, whatever the size of the move." book={BOOK} />
    </DcPage>
  );
}

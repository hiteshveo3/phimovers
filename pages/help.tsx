import type { CSSProperties } from 'react';
import { ArrowRight as ArrowRightIcon, Call as CallIcon, DocumentText as DocumentIcon, MessageQuestion as QuestionIcon, ShieldTick as ShieldTickIcon, Sms as SmsIcon } from 'iconsax-reactjs';
import { BOOK, Breadcrumbs, CtaBand, DcPage, FaqList, faqSchema } from '../kit/components/DcPage';
import { MOTION_CSS, Words, useHomeMotion } from '../kit/components/HomeMotion';
import { Eyebrow, Head, KIT_CSS, kitIcon } from '../kit/components/PageKit';
import { WaIcon } from '../kit/components/WhatsApp';
import { EMAIL, HOURS_LONG, PHONE_DISPLAY, PHONE_TEL, RESPONSE_PROMISE, SITE, WHATSAPP_URL } from '../kit/site-facts';
import { FAQ_BANK, HELP_GROUPS, allFaqs } from '../lib/page-faqs';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

// Customer-care hub: every answer from lib/page-faqs.ts grouped by topic, the ways to reach the office and
// the policy pages. One FAQPage schema for the whole list.
const HELP_CSS = `
.hp-contact{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:26px 0 0;padding:0;list-style:none}
.hp-contact a{display:grid;grid-template-columns:38px minmax(0,1fr);gap:2px 14px;align-items:center;min-height:72px;padding:16px 18px;color:inherit}
.hp-contact a>span:first-child{grid-row:span 2}
.hp-contact b{font-size:15.5px;font-weight:600}
.hp-contact small{font-size:13.5px;color:var(--ink-68)}
.hp-jump{display:flex;flex-wrap:wrap;gap:8px;margin:22px 0 0;padding:0;list-style:none}
.hp-jump a{display:inline-flex;align-items:center;min-height:44px;padding:0 14px;border-radius:999px;background:#fff;box-shadow:var(--card-shadow);font-size:14px;font-weight:500}
.hp-jump a:hover{background:var(--green-soft)}
.hp-group{scroll-margin-top:110px}
.hp-docs{margin:0;padding:0;list-style:none;border-top:1px solid var(--line)}
.hp-docs a{display:flex;justify-content:space-between;align-items:center;gap:16px;min-height:56px;padding:12px 0;border-bottom:1px solid var(--line);color:var(--ink)}
.hp-docs b{font-weight:600}
.hp-docs small{display:block;font-size:13.5px;color:var(--ink-60)}
.hp-docs svg{flex:none;color:var(--accent)}
@media (max-width:860px){.hp-contact{grid-template-columns:minmax(0,1fr)}}
`;

const DOCS: [string, string, string][] = [
  ['Prices and calculator', 'Rate card, deposit and cancellation', '/pricing'],
  ['Insurance', 'What is covered and how to claim', '/insurance'],
  ['Trust and verification', 'Facts about the company you can check', '/trust'],
  ['Complaints', 'How to raise a problem and what happens next', '/complaints'],
  ['Terms and conditions', 'Bookings, liability and cancellations in full', '/terms'],
  ['Privacy policy', 'What we keep and why', '/privacy'],
  ['My bookings', 'See your quotes and bookings', '/my-bookings'],
];

const faqs = allFaqs();

export default function Help() {
  useHomeMotion();
  return (
    <DcPage
      title="Customer Care and FAQs | Phi Movers"
      description={`Answers on prices, deposits, cancellation, insurance and claims, plus every way to reach the Phi Movers office, ${HOURS_LONG}.`}
      path="/help"
      canonical={`${SITE}/help`}
      crumbs={[{ name: 'Help' }]}
      schema={[faqSchema(faqs)]}
    >
      <style dangerouslySetInnerHTML={{ __html: MOTION_CSS + KIT_CSS + HELP_CSS }} />
      <div className="pk">
        <section className="pk-hero">
          <div className="pk-wrap">
            <Breadcrumbs crumbs={[{ name: 'Help' }]} />
            <Eyebrow>Customer care</Eyebrow>
            <h1 className="pk-h1 mo-title"><Words text="How can we help?" /></h1>
            <p className="pk-hero-lead">Quick answers first, then the people who wrote them. Our office answers {HOURS_LONG}. {RESPONSE_PROMISE}.</p>
            <ul className="hp-contact">
              <li><a href={PHONE_TEL} className="pk-card"><span className="pk-ico">{kitIcon(CallIcon, 20)}</span><b>Call {PHONE_DISPLAY}</b><small>{HOURS_LONG}</small></a></li>
              <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="pk-card"><span className="pk-ico"><WaIcon size={20} /></span><b>WhatsApp us</b><small>Photos of large items help us price</small></a></li>
              <li><a href={`mailto:${EMAIL}`} className="pk-card"><span className="pk-ico">{kitIcon(SmsIcon, 20)}</span><b>{EMAIL}</b><small>For anything in writing, including claims</small></a></li>
            </ul>
            <ul className="hp-jump" aria-label="Topics">
              {HELP_GROUPS.map((g) => <li key={g.id}><a href={`#${g.id}`}>{g.title}</a></li>)}
            </ul>
          </div>
        </section>

        {HELP_GROUPS.map((g, gi) => (
          <section key={g.id} id={g.id} className="pk-sec hp-group" aria-labelledby={`${g.id}-h`}>
            <div className="pk-wrap pk-split">
              <div>
                <Head id={`${g.id}-h`} eyebrow={`${gi + 1} of ${HELP_GROUPS.length}`} title={g.title} />
              </div>
              <FaqList items={g.topics.map((t) => FAQ_BANK[t])} idPrefix={`help-${g.id}`} first={8} />
            </div>
          </section>
        ))}

        <section className="pk-sec" aria-labelledby="docs-h">
          <div className="pk-wrap pk-split">
            <div>
              <Head id="docs-h" eyebrow="Policies" title="The full wording" lead="Everything above in long form, plus your own bookings." />
            </div>
            <ul className="hp-docs">
              {DOCS.map(([title, text, href], i) => (
                <li key={href} data-reveal="" style={{ '--i': i } as Vars}>
                  <a href={href}>
                    <span style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <span className="pk-ico">{kitIcon(href === '/insurance' ? ShieldTickIcon : href === '/my-bookings' ? QuestionIcon : DocumentIcon, 18)}</span>
                      <span><b>{title}</b><small>{text}</small></span>
                    </span>
                    {kitIcon(ArrowRightIcon, 18)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <CtaBand title="Still have a question?" text={`Ask us when you book, or call ${PHONE_DISPLAY}. ${RESPONSE_PROMISE}.`} book={BOOK} />
    </DcPage>
  );
}

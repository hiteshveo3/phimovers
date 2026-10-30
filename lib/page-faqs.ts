// One FAQ lookup. Every answer that quotes a price, hour, deposit, cancellation rule or cover is built from
// kit/site-facts.ts, so the visible FAQ and the FAQPage schema on a page always say the same thing and a
// fact changed in site-facts changes every answer. Pages call getFaqsForPath(path) and pass the result to
// FaqList and faqSchema together.

import {
  BRAND,
  CANCELLATION_TEXT,
  COMPANY_NO,
  DEPOSIT_TEXT,
  EMAIL,
  FREE_MILES,
  HELPER_RATE,
  HOURS_LONG,
  INSURANCE,
  MIN_HOURS,
  PER_MILE,
  PHONE_DISPLAY,
  RATES,
  RESPONSE_PROMISE,
} from '../kit/site-facts';
import { BANK_HOLIDAY_PCT, EVENING_PER_HOUR } from '../kit/estimate';

export type PageFaq = { q: string; a: string };

const gbp = (n: number) => `£${n.toLocaleString('en-GB')}`;
const vanRates = RATES.map((r) => `${r.name.toLowerCase()} £${r.hourly}/hr`).join(', ');
const cover = [
  INSURANCE.goodsInTransit ? `goods in transit cover up to ${gbp(INSURANCE.goodsInTransit)}` : 'goods in transit insurance',
  INSURANCE.publicLiability ? `public liability cover up to ${gbp(INSURANCE.publicLiability)}` : 'public liability insurance',
].join(' and ');

/** Every answer, keyed by topic. */
export const FAQ_BANK = {
  price: { q: 'How much does a man and van cost?', a: `Our published rates are ${vanRates}, with a ${MIN_HOURS}-hour minimum. Each helper adds £${HELPER_RATE}/hr. After the first ${MIN_HOURS} hours, time is billed in 30-minute steps.` },
  minimum: { q: `Is there a minimum booking?`, a: `Yes, ${MIN_HOURS} hours. That covers the van, the crew and the travel either side. After that we bill in 30-minute steps, so nothing is rounded up to a full hour.` },
  fixed: { q: 'Can I get a fixed price instead of hourly?', a: `Yes. Send us the two addresses, the floors and what is moving and we send a fixed quote. ${RESPONSE_PROMISE}, ${HOURS_LONG}.` },
  mileage: { q: 'Do you charge for mileage?', a: `The first ${FREE_MILES} journey miles (collection to delivery) are included. After that it is £${PER_MILE.toFixed(2)} a mile. Long-distance jobs get a fixed quote.` },
  surcharges: { q: 'Do evenings or bank holidays cost more?', a: `Evening work after 7pm adds £${EVENING_PER_HOUR} an hour and bank holidays add ${Math.round(BANK_HOLIDAY_PCT * 100)}%.` },
  deposit: { q: 'Do I pay a deposit?', a: DEPOSIT_TEXT },
  cancellation: { q: 'Can I cancel or change the date?', a: `${CANCELLATION_TEXT} The full wording is in our terms and conditions.` },
  insurance: { q: 'Are my belongings insured?', a: `Yes. Every move is covered by ${cover}. Tell us about any high-value item before the day so the right cover is in place. Claims should be made in writing, normally within 7 days.` },
  hours: { q: 'When can I reach you?', a: `Our office answers ${HOURS_LONG}, bank holidays included. Call or WhatsApp ${PHONE_DISPLAY}, or email ${EMAIL}.` },
  reply: { q: 'How quickly will I get a quote?', a: `${RESPONSE_PROMISE} during office hours (${HOURS_LONG}). Photos of large items help us price faster.` },
  areas: { q: 'Which areas do you cover?', a: `All 32 London boroughs and the City of London, from our base in Dagenham. We also take long-distance moves from London across the UK, quoted individually.` },
  stairs: { q: 'Do you charge for stairs?', a: 'Normal stairs are never charged as a fee. Carrying up several floors takes longer, which shows in the hours. Tell us the floors and whether there is a lift when you ask for a quote.' },
  overrun: { q: 'What happens if a job runs over?', a: `Extra time is billed at the same hourly rate in 30-minute steps. Nothing else is added. The usual causes are unfinished packing, furniture still to dismantle and no parking near the door.` },
  parking: { q: 'Who arranges parking?', a: 'You do, at both addresses: a space, a permit or a council suspension, and any lift booking. If there is no legal parking, parking charges are passed on at cost.' },
  packing: { q: 'Can you pack for me?', a: 'Yes. We offer packing help by the hour and can bring boxes and materials, quoted separately.' },
  notice: { q: 'How far ahead should I book?', a: 'Two to four weeks ahead for end-of-month and weekend dates. We often take next-day and same-day jobs when a crew is free, so it is always worth asking.' },
  account: { q: 'Can I see my quotes and bookings online?', a: `Yes. Sign in to My bookings with the email you used for your quote to see its status, dates and messages from the office.` },
  company: { q: `Who is ${BRAND}?`, a: `${BRAND} is a London removals and man and van company based in Dagenham${COMPANY_NO ? `, registered at Companies House as company ${COMPANY_NO}` : ''}. You speak to our own office, not a call centre.` },
  claims: { q: 'How do I make a damage claim?', a: 'Tell us in writing as soon as possible, normally within 7 days of the move, with photos of the item and the damage. Email or use the complaints page and we reply with next steps.' },
} satisfies Record<string, PageFaq>;

export type FaqTopic = keyof typeof FAQ_BANK;

const pick = (...topics: FaqTopic[]): PageFaq[] => topics.map((t) => FAQ_BANK[t]);

/** Help hub sections: title plus the topics listed under it. */
export const HELP_GROUPS: { id: string; title: string; topics: FaqTopic[] }[] = [
  { id: 'prices', title: 'Prices and quotes', topics: ['price', 'minimum', 'fixed', 'mileage', 'surcharges', 'stairs', 'overrun', 'reply'] },
  { id: 'booking', title: 'Booking, deposit and changes', topics: ['deposit', 'cancellation', 'notice', 'account'] },
  { id: 'on-the-day', title: 'On the day', topics: ['parking', 'packing', 'areas'] },
  { id: 'cover', title: 'Insurance, claims and contact', topics: ['insurance', 'claims', 'company', 'hours'] },
];

const BY_PATH: [RegExp, FaqTopic[]][] = [
  [/^\/$/, ['price', 'fixed', 'deposit', 'insurance', 'areas', 'reply', 'cancellation', 'parking']],
  [/^\/pricing/, ['price', 'minimum', 'fixed', 'mileage', 'surcharges', 'deposit', 'cancellation', 'overrun', 'insurance']],
  [/^\/services\/(office|commercial|business)/, ['fixed', 'insurance', 'surcharges', 'deposit', 'cancellation']],
  [/^\/services/, ['price', 'fixed', 'insurance', 'stairs', 'deposit', 'cancellation']],
  [/^\/(areas|removals)/, ['price', 'areas', 'parking', 'insurance', 'reply']],
  [/^\/insurance/, ['insurance', 'claims', 'company']],
  [/^\/contact/, ['hours', 'reply', 'fixed', 'account']],
  [/^\/book/, ['deposit', 'cancellation', 'minimum', 'insurance', 'reply', 'account']],
];

/** FAQs for a path, most specific rule first. Visible list and FAQPage schema use the same result. */
export function getFaqsForPath(path: string): PageFaq[] {
  const hit = BY_PATH.find(([re]) => re.test(path));
  return hit ? pick(...hit[1]) : pick('price', 'fixed', 'insurance', 'reply');
}

export const allFaqs = (): PageFaq[] => HELP_GROUPS.flatMap((g) => pick(...g.topics));

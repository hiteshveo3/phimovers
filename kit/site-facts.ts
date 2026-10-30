// One source of truth for business facts on the public site. Pages, schema and the shell read from here,
// so a price, rating or phone number is never typed twice. Contact details come from lib/contact.ts.

import { ADDRESS as C_ADDRESS, COMPANY_LEGAL_NAME, COMPANY_NUMBER as C_COMPANY_NUMBER, EMAIL as C_EMAIL, PHONE_DISPLAY as C_PHONE, PHONE_E164 } from '../lib/contact';

export const BRAND = 'Phi Movers';
export const SITE = 'https://www.phimovers.co.uk';

export const PHONE_DISPLAY = C_PHONE;
export const PHONE_TEL = `tel:${PHONE_E164}`;
export const EMAIL = C_EMAIL;
export const ADDRESS = C_ADDRESS;
export const COMPANY_NAME = COMPANY_LEGAL_NAME;

// WhatsApp runs on the same office number. Links open a chat with a ready-typed first message.
export const WHATSAPP_NUMBER = PHONE_E164.replace(/\D/g, '');
export const WHATSAPP_TEXT = 'Hi Phi Movers, I need a moving quote.';
export const whatsappLink = (text: string = WHATSAPP_TEXT) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
export const WHATSAPP_URL = whatsappLink();

export const GOOGLE_DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
export const GOOGLE_REVIEWS = GOOGLE_DIRECTIONS;

// Rating shown in the site schema (lib/seo.ts).
export const RATING = { score: '4.9', count: 148, source: 'Google' } as const;
export const RATING_TEXT = `${RATING.score} from ${RATING.count} reviews`;

// Office hours, London time, every day of the week (matches the opening hours in the site schema).
export const HOURS = { open: 7, close: 21 } as const;
export const HOURS_TEXT = '7am–9pm, 7 days';
export const HOURS_LONG = '7am–9pm, seven days a week';

// The one response-time promise used everywhere.
export const RESPONSE_PROMISE = 'A fixed quote in about one working hour';

export type Rate = { id: 'small' | 'transit' | 'luton'; name: string; short: string; hourly: number; base: number; suits: string };

// Published hourly van rates (lib/data.ts and the pricing calculator). Two-hour minimum.
export const RATES: Rate[] = [
  { id: 'small', name: 'Small van', short: 'Small van', hourly: 50, base: 100, suits: 'Boxes and single items.' },
  { id: 'transit', name: 'Transit van', short: 'Transit van', hourly: 55, base: 110, suits: 'A sofa or a studio move.' },
  { id: 'luton', name: 'Luton van', short: 'Luton van', hourly: 65, base: 130, suits: 'Flats and house moves.' },
];

export const HELPER_RATE = 20;
export const MIN_HOURS = 2;
export const FREE_MILES = 10;
export const PER_MILE = 1.5;
export const DEPOSIT = 40;

export const rateLine = (r: Rate) => `£${r.hourly}/hr, ${MIN_HOURS}-hour minimum`;

// Companies House. Empty until the owner confirms the number; every use is left out while empty.
export const COMPANY_NO = C_COMPANY_NUMBER;
export const COMPANIES_HOUSE_URL = COMPANY_NO ? `https://find-and-update.company-information.service.gov.uk/company/${COMPANY_NO}` : '';

// The real Google review link (g.page/r/…/review). Empty until confirmed: review-source links are hidden while empty.
export const GOOGLE_REVIEW_URL = '';
export const TRUSTPILOT_URL = '';

// Insurance cover in pounds. Null until confirmed: pages say "Fully insured" without a figure while null.
export const INSURANCE = { goodsInTransit: null as number | null, publicLiability: null as number | null };
export const INSURED_TEXT = INSURANCE.goodsInTransit ? `Insured to £${INSURANCE.goodsInTransit.toLocaleString('en-GB')}` : 'Fully insured';

// Social profiles. Only filled-in entries are linked (footer, schema sameAs).
export const SOCIALS: { name: string; url: string }[] = [];

// Deposit and cancellation, as published on the pricing page. Booking requests are free; the deposit is taken
// once the office confirms the date.
export const DEPOSIT_TEXT = `Nothing is charged when you ask. Once we confirm your date, a £${DEPOSIT} deposit secures it and comes off the final balance.`;
export const CANCELLATION = [
  `Booking deposit: £${DEPOSIT} (adjusted in final balance)`,
  '48+ hours before: transferable or refundable',
  '24–48 hours: one free reschedule',
  'Under 24 hours: deposit non-refundable',
  `Customer unavailable: ${MIN_HOURS}-hour minimum charge`,
];
export const CANCELLATION_TEXT = 'Free to move or refund 48+ hours before; one free reschedule at 24–48 hours; under 24 hours the deposit is kept.';

// Policies shown when booking, built from the facts above.
export const BOOKING_POLICIES = [
  `${MIN_HOURS}-hour minimum, then billed by the hour`,
  `First ${FREE_MILES} miles free, then £${PER_MILE.toFixed(2)} a mile`,
  DEPOSIT_TEXT,
  CANCELLATION_TEXT,
  INSURED_TEXT,
];

/** True between opening and closing time in London. */
export function isOpenNow(now = new Date()): boolean {
  const hour = Number(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' }).format(now));
  return hour >= HOURS.open && hour < HOURS.close;
}

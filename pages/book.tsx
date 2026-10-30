import { DcPage, FaqList, type FaqItem } from '../kit/components/DcPage';
import { MOTION_CSS } from '../kit/components/HomeMotion';
import BookingFlow from '../lib/booking-flow/ui/BookingFlow';
import { BOOKING_CSS } from '../lib/booking-flow/ui/booking-css';
import { CANCELLATION_TEXT, DEPOSIT_TEXT, FREE_MILES, HELPER_RATE, HOURS_LONG, INSURED_TEXT, MIN_HOURS, PER_MILE, RATES } from '../kit/site-facts';
import { BOOK_AHEAD_DAYS } from '../lib/booking-flow/model';

// Book online: six steps with a live summary, the email checked only at the last step, then a reference.
// A focus page (logo, phone and the task: no menu or footer). noindex: a task page.
// Every answer below is built from kit/site-facts.ts.

const FAQS: FaqItem[] = [
  { q: 'How much does a move cost?', a: `${RATES.map((r) => `${r.name} £${r.hourly}/hr`).join(', ')}, plus £${HELPER_RATE}/hr for each extra helper, with a ${MIN_HOURS}-hour minimum. The total on this page is an estimate from those rates; we confirm the final price before the day.` },
  { q: 'Is there a charge for distance?', a: `The first ${FREE_MILES} miles are free, then it is £${PER_MILE.toFixed(2)} a mile.` },
  { q: 'Do I pay anything now?', a: DEPOSIT_TEXT },
  { q: 'What if I need to cancel or change the date?', a: CANCELLATION_TEXT },
  { q: 'Is my move insured?', a: `${INSURED_TEXT}.` },
  { q: 'How far ahead can I book?', a: `Up to ${BOOK_AHEAD_DAYS} days ahead online. For anything sooner, call us: we are open ${HOURS_LONG}.` },
  { q: 'Is my slot confirmed when I send the request?', a: 'Not yet. We check the van and crew and call you to confirm the time and the price. You can follow the request on the Track page with your reference.' },
];

export default function BookPage() {
  return (
    <DcPage
      title="Book a move online | Phi Movers"
      description="Book a London move online: choose the service, van and crew, see the estimate before you send, pick your day and time. We call to confirm."
      path="/book"
      crumbs={[{ name: 'Book online' }]}
      chrome="focus"
      noindex
    >
      <style dangerouslySetInnerHTML={{ __html: MOTION_CSS + BOOKING_CSS }} />
      <div className="bf-page">
        <div className="bf-wrap">
          <BookingFlow />
        </div>
        <section className="bf-faq" aria-labelledby="bf-faq-h">
          <h2 id="bf-faq-h">Questions we get asked</h2>
          <FaqList items={FAQS} idPrefix="bkfaq" />
        </section>
      </div>
    </DcPage>
  );
}

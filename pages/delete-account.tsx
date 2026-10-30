import { useEffect, useState } from 'react';
import { Breadcrumbs, DcPage, NOTE, h1Style } from '../kit/components/DcPage';
import { BRAND, COMPANY_NAME, COMPANY_NO, EMAIL, HOURS_LONG, PHONE_DISPLAY, PHONE_TEL } from '../kit/site-facts';

// How to delete a Phi Movers account (the My Phi web portal and the Android app share one account).
// Google Play asks for a page that says this, reachable without the app. The steps match the portal's
// Account page and /api/client/delete-account. After Alpha's delete-account.tsx; every fact is Phi's.
export default function DeleteAccount() {
  const [done, setDone] = useState(false);
  useEffect(() => setDone(new URLSearchParams(window.location.search).get('done') === '1'), []);
  return (
    <DcPage
      title={`Delete your ${BRAND} account`}
      description={`How to delete your ${BRAND} account: online, in the app, or by email or phone. What is deleted and what we keep.`}
      path="/delete-account"
      crumbs={[{ name: 'Delete your account' }]}
    >
      <section style={{ padding: 'clamp(30px,5vw,56px) 5vw 0' }}>
        <Breadcrumbs crumbs={[{ name: 'Delete your account' }]} />
        <h1 style={{ ...h1Style('none', 'clamp(32px,4.2vw,48px)'), lineHeight: 1.05, margin: '0 0 12px' }}>Delete your account</h1>
        <p style={{ margin: 0, fontSize: 15, color: NOTE }}>{BRAND} website and app · {COMPANY_NAME}{COMPANY_NO ? `, company no. ${COMPANY_NO}` : ''}</p>
      </section>

      <div className="dc-prose" style={{ maxWidth: 760, padding: 'clamp(24px,4vw,40px) 5vw clamp(30px,4vw,52px)' }}>
        {done && <p role="status"><strong>Your account has been deleted.</strong> Thank you for using {BRAND}.</p>}
        <p>You can delete the account you use for My Phi (the customer area of this website) and the {BRAND} app at any time. It is one account, so deleting it removes it from both. It cannot be undone.</p>

        <h2>Online</h2>
        <ol>
          <li>Sign in at <a href="/client/account">My Phi → Account</a>. If you signed in more than ten minutes ago, sign out and in again first.</li>
          <li>Under <strong>Delete my account</strong>, type DELETE and choose <strong>Delete for good</strong>.</li>
        </ol>
        <p>The account is deleted straight away and you are signed out.</p>

        <h2>Without signing in</h2>
        <p>Email <a href={`mailto:${EMAIL}?subject=Delete%20my%20account`}>{EMAIL}</a> from the email address you signed up with, with the subject “Delete my account”, or call <a href={PHONE_TEL}>{PHONE_DISPLAY}</a> ({HOURS_LONG}). We may ask you to confirm it is you before we delete anything, and we reply to confirm once it is done.</p>

        <h2>What is deleted</h2>
        <ul>
          <li>Your sign-in (email address and password, or the link to your Google account).</li>
          <li>Your profile: name, phone number and profile photo.</li>
          <li>Your saved addresses, settings and notifications.</li>
          <li>Photos you attached to booking requests.</li>
          <li>Your name, phone number and email on quote requests you sent us.</li>
        </ul>

        <h2>What we keep</h2>
        <p>Records of moves we have carried out for you, and their invoices, are kept for as long as UK tax and accounting rules require; your name, phone and email are removed from them in our booking system when you delete your account. If you have a move that is still to happen, call us first so we can cancel it or keep it for you: the online button will ask you to.</p>
        <p>Conversations with the Ask Phi assistant on this website are kept for this browser only. To remove them, open the assistant’s settings and choose “Delete my chat data”.</p>

        <h2>More</h2>
        <p>Our <a href="/privacy">privacy policy</a> explains what the website and the app collect, why, and your rights under UK GDPR.</p>
      </div>
    </DcPage>
  );
}

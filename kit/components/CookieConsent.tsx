'use client';

import { useEffect, useState } from 'react';

type Gtag = (command: 'consent', action: 'update', params: Record<string, 'granted' | 'denied'>) => void;

const KEY = 'phi-cookie-consent';

function readChoice(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function saveChoice(value: 'accepted' | 'denied') {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Private mode or blocked storage: the choice still applies for this page view.
  }
}

// Light card in the site palette (no dark panels): essential cookies always on, optional ones off unless accepted.
export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!readChoice()) setIsVisible(true);
  }, []);

  const gtag = () => (typeof window !== 'undefined' ? (window as unknown as { gtag?: Gtag }).gtag : undefined);

  const accept = () => {
    saveChoice('accepted');
    gtag()?.('consent', 'update', { analytics_storage: 'granted' });
    setIsVisible(false);
  };

  const reject = () => {
    saveChoice('denied');
    gtag()?.('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside role="region" aria-label="Cookie choices" className="am-cookie">
      <p className="am-cookie-title">Cookie choices</p>
      <p className="am-cookie-text">
        Essential cookies keep this site working. Analytics cookies stay off unless you accept them. <a href="/cookies">Cookie policy</a>
      </p>
      <div className="am-cookie-actions">
        <button type="button" onClick={reject} className="dc-btn dc-btn-white am-cookie-btn">Reject optional</button>
        <button type="button" onClick={accept} className="dc-btn dc-btn-lime am-cookie-btn">Accept optional</button>
      </div>
    </aside>
  );
}

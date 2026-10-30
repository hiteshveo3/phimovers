'use client';

import { useEffect, useRef, Suspense } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';

// Analytics stays off until a measurement ID is set in NEXT_PUBLIC_GA_ID.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

function AnalyticsRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPathRef = useRef<string>('');

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) return;

    const fullPath = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    if (lastTrackedPathRef.current === fullPath) return;
    lastTrackedPathRef.current = fullPath;

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: fullPath,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;
  return <GoogleAnalyticsInner />;
}

function GoogleAnalyticsInner() {
  const lastClickTimeRef = useRef<number>(0);

  // Sync existing stored cookie consent on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = localStorage.getItem('phi-cookie-consent');
    if (consent === 'accepted' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  }, []);

  // Global conversion click listener for phone, email and Trustpilot/Google review links
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;

      const anchor = target.closest('a');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.href;
      if (!href) return;

      const now = Date.now();
      // Deduplicate rapid consecutive clicks within 1000ms
      if (now - lastClickTimeRef.current < 1000) return;
      lastClickTimeRef.current = now;

      const ctaText = anchor.textContent?.replace(/\s+/g, ' ').trim().slice(0, 80) || 'CTA';
      const pagePath = window.location.pathname;

      if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)\//i.test(href)) {
        // Dedicated WhatsApp Lead Conversion
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'whatsapp_quote_click', {
            contact_method: 'whatsapp',
            cta_text: ctaText,
            page_path: pagePath,
            page_location: window.location.href,
          });
        }
      } else if (href.startsWith('tel:')) {
        // Dedicated Phone Call Lead Conversion
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'phone_call_click', {
            contact_method: 'phone',
            cta_text: ctaText,
            page_path: pagePath,
            page_location: window.location.href,
          });
        }
      } else if (href.startsWith('mailto:')) {
        // Dedicated Email Contact Conversion
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'email_click', {
            contact_method: 'email',
            cta_text: ctaText,
            page_path: pagePath,
          });
        }
      } else if (href.includes('google.com/maps') || href.includes('trustpilot.com')) {
        // Trust and Verification Click
        const source = href.includes('trustpilot.com') ? 'trustpilot' : 'google_maps';
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'review_source_click', {
            source,
            page_path: pagePath,
          });
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsRouteTracker />
      </Suspense>
      <Script
        id="ga4-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            // UK/GDPR Privacy Compliant Consent Mode v2 Default (denied until user consent)
            var hasConsent = false;
            try {
              hasConsent = localStorage.getItem('phi-cookie-consent') === 'accepted';
            } catch(e) {}

            gtag('consent', 'default', {
              'analytics_storage': hasConsent ? 'granted' : 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied'
            });
            gtag('js', new Date());
          `,
        }}
      />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false
            });
          `,
        }}
      />
    </>
  );
}

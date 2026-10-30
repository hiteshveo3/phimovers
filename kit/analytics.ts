import { useCallback, useEffect } from 'react';
import type { Metric } from 'web-vitals';

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? '';

type AnalyticsEventParams = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  params?: Record<string, string | number | boolean | null | undefined>;
};

type ReactGAModule = typeof import('react-ga4').default;

let analyticsStarted = false;
let historyPatched = false;
let webVitalsStarted = false;
let lastTrackedLocation = '';
let reactGaReady: Promise<ReactGAModule | null> | null = null;

function getCurrentPageLocation() {
  if (typeof window === 'undefined') return '';
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function ensureReactGA() {
  if (!reactGaReady) {
    reactGaReady = import('react-ga4')
      .then((mod) => {
        const ReactGA = mod.default;
        ReactGA.initialize(GA_MEASUREMENT_ID, {
          gtagOptions: {
            send_page_view: false,
          },
        });
        return ReactGA;
      })
      .catch(() => null);
  }
  return reactGaReady;
}

function whenBrowserIdle(callback: () => void) {
  if (typeof window === 'undefined') return;

  const schedule = () => {
    const idle = (window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;

    if (typeof idle === 'function') {
      idle(() => callback(), { timeout: 4000 });
      return;
    }
    globalThis.setTimeout(callback, 1800);
  };

  if (document.readyState === 'complete') {
    schedule();
    return;
  }

  window.addEventListener('load', schedule, { once: true });
}

function startWebVitalsReporting() {
  if (webVitalsStarted || typeof window === 'undefined') return;
  webVitalsStarted = true;

  const reportMetric = (metric: Metric) => {
    const pageLocation = metric.navigationURL || window.location.href;
    const metricUrl = new URL(pageLocation, window.location.href);
    trackEvent({
      action: metric.name,
      category: 'web_vitals',
      label: metric.id,
      value: metric.delta,
      params: {
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_rating: metric.rating,
        navigation_type: metric.navigationType,
        page_path: `${metricUrl.pathname}${metricUrl.search}${metricUrl.hash}`,
        page_location: pageLocation,
      },
    });
  };

  void import('web-vitals')
    .then(({ onCLS, onINP, onLCP }) => {
      onCLS(reportMetric);
      onINP(reportMetric);
      onLCP(reportMetric);
    })
    .catch(() => undefined);
}

/** Start analytics after first paint / idle so gtag does not compete with hydration. */
export function initializeAnalytics() {
  if (analyticsStarted || typeof window === 'undefined') return;
  analyticsStarted = true;

  whenBrowserIdle(() => {
    void ensureReactGA().then((ReactGA) => {
      if (!ReactGA) return;
      trackPageView();
      startWebVitalsReporting();
    });
  });
}

export function trackPageView(path = getCurrentPageLocation()) {
  if (!analyticsStarted || typeof window === 'undefined' || !path) return;
  if (path === lastTrackedLocation) return;

  lastTrackedLocation = path;

  void ensureReactGA().then((ReactGA) => {
    if (!ReactGA) return;
    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: document.title,
      location: window.location.href,
    });
  });
}

/** Sends through the gtag that GoogleAnalytics.tsx loads, so consent mode applies and page views are not counted twice. */
export function trackEvent({ action, category, label, value, params = {} }: AnalyticsEventParams) {
  if (typeof window === 'undefined' || !action) return;

  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== 'function') return;

  gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
    ...params,
  });
}

function patchHistoryForRouteTracking() {
  if (historyPatched || typeof window === 'undefined') return;

  const notifyRouteChange = () => {
    window.dispatchEvent(new Event('ga4-route-change'));
  };

  const originalPushState = window.history.pushState;
  const originalReplaceState = window.history.replaceState;

  window.history.pushState = function patchedPushState(...args) {
    originalPushState.apply(this, args);
    notifyRouteChange();
  };

  window.history.replaceState = function patchedReplaceState(...args) {
    originalReplaceState.apply(this, args);
    notifyRouteChange();
  };

  historyPatched = true;
}

export function useAnalyticsPageViews() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    initializeAnalytics();
    patchHistoryForRouteTracking();

    const handleRouteChange = () => {
      trackPageView();
    };
    const handleConversionClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.('a');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.href;
      const label = anchor.textContent?.replace(/\s+/g, ' ').trim().slice(0, 120) || href;
      const analyticsSource = anchor.dataset.analyticsSource;

      if (href.startsWith('tel:')) {
        trackEvent({
          action: 'click_to_call',
          category: 'conversion',
          label,
          params: { page_path: getCurrentPageLocation() },
        });
      } else if (href.startsWith('mailto:')) {
        trackEvent({
          action: 'email_click',
          category: 'conversion',
          label,
          params: { page_path: getCurrentPageLocation() },
        });
      } else if (new URL(href, window.location.href).pathname === '/contact/') {
        trackEvent({
          action: 'quote_page_click',
          category: 'conversion',
          label,
          params: { page_path: getCurrentPageLocation() },
        });
      } else if (analyticsSource) {
        trackEvent({
          action: 'source_verification_click',
          category: 'trust',
          label,
          params: {
            page_path: getCurrentPageLocation(),
            source: analyticsSource,
          },
        });
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('ga4-route-change', handleRouteChange);
    document.addEventListener('click', handleConversionClick);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('ga4-route-change', handleRouteChange);
      document.removeEventListener('click', handleConversionClick);
    };
  }, []);
}

export function useAnalytics() {
  const sendEvent = useCallback((event: AnalyticsEventParams) => {
    trackEvent(event);
  }, []);

  return {
    trackEvent: sendEvent,
    trackPageView,
  };
}

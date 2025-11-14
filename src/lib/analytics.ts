import { supabase } from "@/integrations/supabase/client";

// Generate or retrieve session ID
function getSessionId(): string {
  const key = 'technofy_session_id';
  let sessionId = sessionStorage.getItem(key);
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }
  
  return sessionId;
}

// Extract UTM parameters from URL
function getUTMParams(): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
  };
}

// Track page visit - Enabled by default
// Set VITE_ENABLE_ANALYTICS=false to disable
let analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS !== 'false';
let hasFailed = false;
let failureCount = 0;
const MAX_FAILURES = 3; // Stop trying after 3 consecutive failures

export async function trackPageVisit() {
  // Skip if analytics is disabled or has failed too many times
  if (!analyticsEnabled || (hasFailed && failureCount >= MAX_FAILURES)) return;
  
  try {
    const utmParams = getUTMParams();
    
    const { error } = await supabase.functions.invoke('track-visit', {
      body: {
        path: window.location.pathname,
        referrer: document.referrer || undefined,
        session_id: getSessionId(),
        user_agent: navigator.userAgent,
        ...utmParams,
      },
    });

    if (error) {
      failureCount++;
      if (failureCount >= MAX_FAILURES) {
        hasFailed = true;
        console.warn('Analytics tracking disabled after multiple failures. Edge function may not be deployed.');
      }
      return;
    }

    // Reset failure count on success
    failureCount = 0;
    hasFailed = false;
  } catch (error: any) {
    failureCount++;
    if (failureCount >= MAX_FAILURES) {
      hasFailed = true;
      console.warn('Analytics tracking disabled after multiple failures:', error.message);
    }
  }
}

// Initialize tracking on page load
let navigationObserver: ReturnType<typeof setInterval> | null = null;

export function initAnalytics() {
  // Only initialize if analytics is enabled
  if (!analyticsEnabled) return;
  
  // Track initial page visit
  trackPageVisit();

  // Track subsequent navigation (for SPAs)
  let lastPath = window.location.pathname;
  navigationObserver = setInterval(() => {
    if (!analyticsEnabled || hasFailed) {
      // Stop tracking if disabled
      if (navigationObserver) {
        clearInterval(navigationObserver);
        navigationObserver = null;
      }
      return;
    }
    
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      trackPageVisit();
    }
  }, 1000);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (navigationObserver) {
      clearInterval(navigationObserver);
    }
  });
}

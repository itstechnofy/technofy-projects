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

// Track page visit (silently fails if edge function not deployed)
let analyticsEnabled = true;

export async function trackPageVisit() {
  // Skip if analytics was disabled due to previous failures
  if (!analyticsEnabled) return;
  
  try {
    const utmParams = getUTMParams();
    
    await supabase.functions.invoke('track-visit', {
      body: {
        path: window.location.pathname,
        referrer: document.referrer || undefined,
        session_id: getSessionId(),
        user_agent: navigator.userAgent,
        ...utmParams,
      },
    });
  } catch (error: any) {
    // Disable analytics if function doesn't exist (404) or CORS error
    if (error?.message?.includes('CORS') || error?.status === 404 || error?.code === 'ERR_FAILED') {
      analyticsEnabled = false;
      // Only log in development
      if (import.meta.env.DEV) {
        console.debug('Analytics tracking disabled (edge function not deployed)');
      }
    }
    // Silently ignore other errors
  }
}

// Initialize tracking on page load
let navigationObserver: ReturnType<typeof setInterval> | null = null;

export function initAnalytics() {
  // Track initial page visit
  trackPageVisit();

  // Track subsequent navigation (for SPAs)
  let lastPath = window.location.pathname;
  navigationObserver = setInterval(() => {
    if (!analyticsEnabled) {
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

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

// Track page visit - Disabled by default until edge function is deployed
// Set VITE_ENABLE_ANALYTICS=true in environment variables to enable
let analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
let hasFailed = false;

export async function trackPageVisit() {
  // Skip if analytics is disabled or has previously failed
  if (!analyticsEnabled || hasFailed) return;
  
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
    // Disable analytics on any error (function not deployed, CORS, etc.)
    hasFailed = true;
    analyticsEnabled = false;
    // Silently fail - no console errors
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

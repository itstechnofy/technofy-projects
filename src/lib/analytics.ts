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

// Track page visit
export async function trackPageVisit() {
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
  } catch (error) {
    console.error('Failed to track visit:', error);
  }
}

// Initialize tracking on page load
export function initAnalytics() {
  // Track initial page visit
  trackPageVisit();

  // Track subsequent navigation (for SPAs)
  let lastPath = window.location.pathname;
  const observer = setInterval(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      trackPageVisit();
    }
  }, 1000);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(observer);
  });
}

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response> | Response): void;
};

// @ts-ignore - Deno URL import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VisitData {
  path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  session_id?: string;
  user_agent?: string;
}

interface GeoData {
  country?: string;
  region?: string;
  city?: string;
}

// Simple in-memory cache for IP geolocation (24h TTL)
const geoCache = new Map<string, { data: GeoData; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function getGeoLocation(ip: string): Promise<GeoData> {
  // Check cache first
  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    // Use ipapi.co for geolocation (free tier: 1000 requests/day)
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!response.ok) {
      console.error('Geo API error:', response.status);
      return {};
    }
    
    const data = await response.json();
    const geoData: GeoData = {
      country: data.country_name || null,
      region: data.region || null,
      city: data.city || null,
    };

    // Cache the result
    geoCache.set(ip, { data: geoData, timestamp: Date.now() });
    return geoData;
  } catch (error) {
    console.error('Geolocation error:', error);
    return {};
  }
}

function parseUserAgent(ua: string): { device: string; browser: string } {
  const device = /mobile/i.test(ua) ? 'mobile' : 'desktop';
  
  let browser = 'unknown';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  return { device, browser };
}

async function hashIP(ip: string, userAgent: string): Promise<string> {
  const salt = Deno.env.get('SECRET_SALT') || 'default-salt-change-in-production';
  const data = new TextEncoder().encode(ip + userAgent + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get IP address
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown';

    // Parse request body
    const body: VisitData = await req.json();
    const userAgent = body.user_agent || req.headers.get('user-agent') || 'unknown';

    // Parse device and browser from user agent
    const { device, browser } = parseUserAgent(userAgent);

    // Get geolocation data
    const geoData = ip !== 'unknown' ? await getGeoLocation(ip) : {};

    // Hash IP for privacy
    const ipHash = await hashIP(ip, userAgent);

    // Extract domain from referrer
    let referrerDomain: string | null = null;
    if (body.referrer) {
      try {
        const url = new URL(body.referrer);
        referrerDomain = url.hostname;
      } catch {
        referrerDomain = body.referrer;
      }
    }

    // Insert visit record
    const { error } = await supabase.from('visits').insert({
      path: body.path,
      referrer: referrerDomain,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      session_id: body.session_id,
      country: geoData.country,
      region: geoData.region,
      city: geoData.city,
      device,
      browser,
      ip_hash: ipHash,
      geo_source: 'ip',
    });

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to track visit' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('Visit tracked:', { path: body.path, country: geoData.country, device, browser });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

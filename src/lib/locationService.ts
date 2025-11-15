// Location service to get user's country and city via IP geolocation
// Uses multiple fallback APIs for maximum reliability

interface GeoLocation {
  country: string | null;
  region: string | null;
  city: string | null;
}

// Cache location to avoid multiple API calls
let cachedLocation: GeoLocation | null = null;
let locationPromise: Promise<GeoLocation> | null = null;

/**
 * Get user's location using IP-based geolocation
 * Uses multiple fallback APIs for maximum reliability
 */
export async function getUserLocation(): Promise<GeoLocation> {
  // Return cached location if available
  if (cachedLocation && cachedLocation.country) {
    console.log('📍 Using cached location:', cachedLocation);
    return cachedLocation;
  }

  // If already fetching, return the same promise
  if (locationPromise) {
    return locationPromise;
  }

  // Start fetching location with multiple fallbacks
  locationPromise = fetchLocationWithFallbacks();
  const location = await locationPromise;
  
  // Cache the result only if we got valid data
  if (location.country || location.city) {
    cachedLocation = location;
  }
  
  return location;
}

/**
 * Try multiple location APIs with fallbacks for maximum reliability
 */
async function fetchLocationWithFallbacks(): Promise<GeoLocation> {
  const apis = [
    // Primary: ipapi.co (1000 requests/day free)
    async (): Promise<GeoLocation | null> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        
        const response = await fetch('https://ipapi.co/json/', {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) return null;
        
        const data = await response.json();
        if (data.country_name || data.city) {
          return {
            country: data.country_name || null,
            region: data.region || null,
            city: data.city || null,
          };
        }
      } catch (error) {
        console.warn('📍 ipapi.co failed:', error);
      }
      return null;
    },
    
    // Fallback 1: ip-api.com (45 requests/minute free)
    async (): Promise<GeoLocation | null> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        
        const response = await fetch('https://ip-api.com/json/?fields=status,country,regionName,city', {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) return null;
        
        const data = await response.json();
        if (data.status === 'success' && (data.country || data.city)) {
          return {
            country: data.country || null,
            region: data.regionName || null,
            city: data.city || null,
          };
        }
      } catch (error) {
        console.warn('📍 ip-api.com failed:', error);
      }
      return null;
    },
    
    // Fallback 2: ipgeolocation.io (1000 requests/month free)
    async (): Promise<GeoLocation | null> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        
        const response = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=free', {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) return null;
        
        const data = await response.json();
        if (data.country_name || data.city) {
          return {
            country: data.country_name || null,
            region: data.state_prov || null,
            city: data.city || null,
          };
        }
      } catch (error) {
        console.warn('📍 ipgeolocation.io failed:', error);
      }
      return null;
    },
    
    // Fallback 3: geojs.io (no rate limit, but less accurate)
    async (): Promise<GeoLocation | null> => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('https://get.geojs.io/v1/ip/geo.json', {
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) return null;
        
        const data = await response.json();
        if (data.country || data.city) {
          return {
            country: data.country || null,
            region: data.region || null,
            city: data.city || null,
          };
        }
      } catch (error) {
        console.warn('📍 geojs.io failed:', error);
      }
      return null;
    },
  ];

  // Try each API in sequence until one succeeds
  for (const api of apis) {
    const result = await api();
    if (result && (result.country || result.city)) {
      console.log('✅ Location fetched successfully:', result);
      return result;
    }
  }

  // If all APIs failed, return empty location
  console.warn('⚠️ All location APIs failed, returning empty location');
  return { country: null, region: null, city: null };
}

/**
 * Clear cached location (useful for testing)
 */
export function clearLocationCache() {
  cachedLocation = null;
  locationPromise = null;
}


// Location service to get user's country and city via IP geolocation

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
 * Uses ipapi.co free API (1000 requests/day)
 */
export async function getUserLocation(): Promise<GeoLocation> {
  // Return cached location if available
  if (cachedLocation) {
    return cachedLocation;
  }

  // If already fetching, return the same promise
  if (locationPromise) {
    return locationPromise;
  }

  // Start fetching location
  locationPromise = fetchLocation();
  const location = await locationPromise;
  
  // Cache the result
  cachedLocation = location;
  
  return location;
}

async function fetchLocation(): Promise<GeoLocation> {
  try {
    // Use ipapi.co for geolocation (free tier: 1000 requests/day)
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn('Geo API error:', response.status, response.statusText);
      return { country: null, region: null, city: null };
    }
    
    const data = await response.json();
    
    // Log for debugging
    console.log('Location fetched:', { 
      country: data.country_name, 
      region: data.region, 
      city: data.city 
    });
    
    return {
      country: data.country_name || null,
      region: data.region || null,
      city: data.city || null,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn('Geolocation request timed out');
    } else {
      console.error('Geolocation error:', error);
    }
    return { country: null, region: null, city: null };
  }
}

/**
 * Clear cached location (useful for testing)
 */
export function clearLocationCache() {
  cachedLocation = null;
  locationPromise = null;
}


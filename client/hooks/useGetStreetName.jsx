import { useState, useEffect } from 'react';

export function useGetStreetName(lat, lng) {
  const [streetName, setStreetName] = useState(`${lat}, ${lng}`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retries, setRetries] = useState(0);
  const MAX_RETRIES = 2;

  useEffect(() => {
    if (!lat || !lng) return;
    
    let isMounted = true;
    let controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    const fetchStreetName = async () => {
      // Don't show loading if we have cached data and are just refreshing
      if (!streetName || streetName === `${lat}, ${lng}`) {
        setLoading(true);
      }
      setError(null);

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch street name: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        if (isMounted) {
          setStreetName(data.display_name || `${lat}, ${lng}`);
          setError(null);
          setRetries(0); // Reset retry counter on success
        }
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (isMounted) {
          console.error("Failed to get street name:", error);
          
          // Only set error if it's not an abort error or we've used all retries
          if (error.name !== 'AbortError' || retries >= MAX_RETRIES) {
            setError(error);
          }
          
          // Try to retry if it wasn't manually aborted and we haven't exceeded max retries
          if (error.name !== 'AbortError' && retries < MAX_RETRIES) {
            setRetries(prev => prev + 1);
            console.log(`Retrying street name fetch (${retries + 1}/${MAX_RETRIES})`);
            // Wait for a second before retrying
            setTimeout(() => {
              if (isMounted) fetchStreetName();
            }, 1000);
          } else {
            // Use fallback coordinates as the name
            setStreetName(`${lat}, ${lng}`);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStreetName();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [lat, lng, retries]);

  return { streetName, loading, error };
}

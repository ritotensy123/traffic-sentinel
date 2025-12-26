const API_KEY = import.meta.env.VITE_API_KEY || 'dev-api-key-traffic-sentinel-2025';

export async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      'X-API-Key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const json = await response.json();
  
  if (!json.success) {
    throw new Error(json.error || 'API request failed');
  }

  return json.data as T;
}


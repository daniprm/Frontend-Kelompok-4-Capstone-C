import { Destination } from '@/types';

// Function to load destinations (used by pages)
export async function loadDestinations(): Promise<Destination[]> {
  try {
    const response = await fetch('/api/destinations', {
      cache: 'force-cache',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }

    const data = await response.json();
    // destinations = data
    return data;
  } catch {
    return [];
  }
}

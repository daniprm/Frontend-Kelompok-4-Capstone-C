// API Service untuk mendapatkan rekomendasi rute

import { ApiResponse, UserLocation } from '@/types';

const API_BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
    : process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function generateRoutes(
  location: UserLocation
): Promise<ApiResponse> {
  try {
    const requestBody = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const response = await fetch(`${API_BASE_URL}/generate-routes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch route recommendations');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export type TransportMode = 'car' | 'bike' | 'foot';

export interface RouteInfo {
  distance: number; // in meters
  duration: number; // in seconds
  geometry: {
    coordinates: [number, number][];
  };
}

export async function getOSRMRoute(
  coordinates: [number, number][],
  profile: TransportMode = 'car'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  try {
    // Validate coordinates
    if (!coordinates || coordinates.length < 2) {
      throw new Error('At least 2 coordinates are required');
    }

    let osrmProfile: string;
    const baseUrl = 'https://router.project-osrm.org/route/v1';

    switch (profile) {
      case 'car':
        osrmProfile = 'car';
        break;
      case 'bike':
        // For motorcycle, use car profile (will adjust duration later)
        osrmProfile = 'car';
        break;
      case 'foot':
        osrmProfile = 'foot';
        break;
      default:
        osrmProfile = 'car';
    }

    // Format: longitude,latitude;longitude,latitude
    const coords = coordinates.map((c) => `${c[1]},${c[0]}`).join(';');

    const url = `${baseUrl}/${osrmProfile}/${coords}?overview=full&geometries=geojson&steps=true&annotations=true`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch OSRM route: ${response.status}`);
    }

    const data = await response.json();

    // Check if route was found
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found by OSRM');
    }

    // Adjust duration for motorcycle (typically 20% faster than car in urban areas)
    if (profile === 'bike' && data.routes && data.routes[0]) {
      data.routes[0].duration = data.routes[0].duration * 0.8;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

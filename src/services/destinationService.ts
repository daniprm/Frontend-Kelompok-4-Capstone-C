import { Destination } from '@/types';

interface BackendDestination {
  place_id: number;
  nama_destinasi: string;
  kategori: string[];
  latitude: number;
  longitude: number;
  alamat: string | null;
  image_url: string | null;
  deskripsi: string | null;
}

interface BackendResponse {
  success: boolean;
  total: number;
  data: BackendDestination[];
}

function transformBackendToDestination(
  backend: BackendDestination,
  index: number
): Destination {
  return {
    place_id: backend.place_id.toString(),
    order: index + 1,
    nama: backend.nama_destinasi,
    kategori: backend.kategori,
    coordinates: [backend.latitude, backend.longitude],
    alamat: backend.alamat || undefined,
    image_url: backend.image_url || undefined,
    deskripsi: backend.deskripsi || undefined,
    rating: undefined,
    jam_buka: undefined,
  };
}

export async function getDestinations(): Promise<Destination[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/destinations`, {
      cache: 'no-store', // Always fetch fresh data from backend
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch destinations: ${response.status}`);
    }

    const result: BackendResponse = await response.json();

    if (!result.success || !result.data) {
      throw new Error('Invalid response format from backend');
    }

    // Transform backend data to frontend Destination format
    return result.data.map((dest, index) =>
      transformBackendToDestination(dest, index)
    );
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

export async function getDestinationById(
  id: string
): Promise<Destination | null> {
  const destinations = await getDestinations();
  return destinations.find((dest) => dest.place_id === id) || null;
}

export async function getDestinationsByCategory(
  category: string
): Promise<Destination[]> {
  const destinations = await getDestinations();
  return destinations.filter((dest) => dest.kategori.includes(category));
}

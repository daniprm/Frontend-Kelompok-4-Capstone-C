import { Destination } from '@/types'
import { parseExternalAPIData } from '@/utils/jsonlParser'

// Helper to get the base URL for API calls
function getBaseUrl() {
  // In browser, use relative URL
  if (typeof window !== 'undefined') return ''
  
  // On server, use Vercel URL or localhost
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  
  // Fallback to localhost for local development
  return 'http://localhost:3000'
}

export async function getDestinations(): Promise<Destination[]> {
  try {
    const baseUrl = getBaseUrl()
    
    // Use Next.js API proxy instead of direct external API call
    const response = await fetch(`${baseUrl}/api/wisata?offset=0`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch destinations: ${response.status}`)
    }
    
    const apiData = await response.json()
    
    // Transform the external API data
    const destinations = parseExternalAPIData(apiData.data || [])
    
    return destinations
  } catch (error) {
    console.error('Error fetching destinations:', error)
    return []
  }
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  try {
    const baseUrl = getBaseUrl()
    
    // Use Next.js API proxy instead of direct external API call
    const response = await fetch(`${baseUrl}/api/wisata/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch destination: ${response.status}`)
    }
    
    const apiData = await response.json()
    
    // Transform single destination
    const kategoriArray = typeof apiData.kategori === 'string' 
      ? apiData.kategori.split(',').map((k: string) => k.trim())
      : Array.isArray(apiData.kategori) 
      ? apiData.kategori 
      : ['wisata']

    const destination: Destination = {
      place_id: apiData.restaurant_id?.toString() || id,
      order: apiData.restaurant_id || 0,
      nama: apiData.nama_destinasi || 'Nama tidak tersedia',
      kategori: kategoriArray,
      coordinates: [
        parseFloat(apiData.latitude) || -7.2575,
        parseFloat(apiData.longitude) || 112.7521
      ],
      deskripsi: apiData.deskripsi || `Destinasi wisata di Surabaya`,
      rating: apiData.rating || 4.0,
      alamat: apiData.alamat || 'Alamat belum tersedia, Surabaya',
      jam_buka: apiData.jam_buka || '08:00 - 22:00 WIB',
      image_url: apiData.image_url || `https://picsum.photos/seed/${apiData.nama_destinasi}/1920/800`
    }

    return destination
  } catch (error) {
    console.error('Error fetching destination:', error)
    return null
  }
}

export async function getDestinationsByCategory(category: string): Promise<Destination[]> {
  const destinations = await getDestinations()
  return destinations.filter(dest => dest.kategori.includes(category))
}
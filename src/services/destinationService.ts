import { Destination } from '@/types'
import { parseExternalAPIData } from '@/utils/jsonlParser'
export async function getDestinations(): Promise<Destination[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const response = await fetch(`${apiUrl}/wisata?offset=0`, {
      cache: 'no-store', // Changed to no-store for fresh data from external API
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
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
  const destinations = await getDestinations()
  return destinations.find(dest => dest.place_id === id) || null
}

export async function getDestinationsByCategory(category: string): Promise<Destination[]> {
  const destinations = await getDestinations()
  return destinations.filter(dest => dest.kategori.includes(category))
}
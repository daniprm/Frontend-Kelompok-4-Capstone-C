import { Destination } from '@/types'
import { parseExternalAPIData } from '@/utils/jsonlParser'

// This will be populated by the API
export let destinations: Destination[] = []

// Function to load destinations (used by pages)
export async function loadDestinations(): Promise<Destination[]> {
  try {
    // Fetch directly from external API
    const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL || 'http://localhost:8000'
    const response = await fetch(`${apiUrl}/wisata?offset=0`, {
      cache: 'no-store', // Changed to no-store for fresh data
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch destinations: ${response.status}`)
    }
    
    const apiData = await response.json()
    
    // Transform the external API data
    const transformedData = parseExternalAPIData(apiData.data || [])
    
    destinations = transformedData
    return transformedData
  } catch (error) {
    console.error('Error loading destinations:', error)
    return []
  }
}
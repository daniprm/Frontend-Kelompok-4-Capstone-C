import { Destination } from '@/types'

export async function getDestinations(): Promise<Destination[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/destinations`, {
      cache: 'force-cache' // Cache for better performance
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch destinations')
    }
    
    return await response.json()
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
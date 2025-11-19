import { Destination } from '@/types'

interface ExternalAPIItem {
  restaurant_id?: number
  place_id?: string
  nama_destinasi?: string
  kategori?: string | string[]
  latitude?: number
  longitude?: number
  deskripsi?: string
  rating?: number
  alamat?: string
  jam_buka?: string
  image_url?: string
}

function generateDefaultDescription(nama: string, kategori: string): string {
  return `${nama} adalah destinasi wisata yang berada di Surabaya dengan kategori ${kategori}.`
}

// Helper function to generate default rating
function generateDefaultRating(): number {
  return 4.0 + Math.random() * 0.5 // Random rating between 4.0 - 4.5
}

// Helper function to generate default image URL
function generateDefaultImageUrl(nama: string): string {
  return `https://picsum.photos/seed/${nama.replace(/[^a-zA-Z0-9]/g, '')}/800/600`
}

// Parse external API data
export function parseExternalAPIData(data: ExternalAPIItem[]): Destination[] {
  return data.map((item) => {
    // Parse kategori - handle both string and array formats
    let kategoriArray: string[] = []
    if (typeof item.kategori === 'string') {
      kategoriArray = item.kategori.split(',').map((k: string) => k.trim())
    } else if (Array.isArray(item.kategori)) {
      kategoriArray = item.kategori
    } else {
      kategoriArray = ['umum']
    }

    return {
      place_id: item.restaurant_id?.toString() || `dest-${Date.now()}-${Math.random()}`,
      order: item.restaurant_id || 0,
      nama: item.nama_destinasi || 'Nama tidak tersedia',
      kategori: kategoriArray,
      coordinates: [
        parseFloat(item.latitude !== undefined ? item.latitude.toString() : '') || -7.2575,
        parseFloat(item.longitude !== undefined ? item.longitude.toString() : '') || 112.7521
      ],
      deskripsi: item.deskripsi || generateDefaultDescription(
        item.nama_destinasi || 'destinasi',
        kategoriArray[0] || 'wisata'
      ),
      rating: item.rating || generateDefaultRating(),
      alamat: item.alamat || 'Alamat belum tersedia, Surabaya, Jawa Timur',
      jam_buka: item.jam_buka || '08:00 - 22:00 WIB',
      image_url: item.image_url || generateDefaultImageUrl(item.nama_destinasi || 'default')
    }
  })
}

export function parseJSONL(jsonlText: string): Destination[] {
  const lines = jsonlText.trim().split('\n')
  const destinations: Destination[] = []
  
  for (const line of lines) {
    if (line.trim()) {
      try {
        const rawDestination = JSON.parse(line.trim())
        
        // Apply default values for empty/null fields
        const destination: Destination = {
  place_id: rawDestination.restaurant_id?.toString() || rawDestination.place_id || '',
  order: rawDestination.restaurant_id || rawDestination.order || 0,
  nama: rawDestination.nama_destinasi || rawDestination.nama || 'Nama tidak tersedia',
  kategori: Array.isArray(rawDestination.kategori) 
    ? rawDestination.kategori 
    : rawDestination.kategori?.split(', ') || ['umum'],
  coordinates: [
    parseFloat(rawDestination.latitude) || -7.2575,
    parseFloat(rawDestination.longitude) || 112.7521
  ],
  deskripsi: rawDestination.deskripsi || 
    generateDefaultDescription(rawDestination.nama_destinasi || rawDestination.nama, rawDestination.kategori),
  rating: rawDestination.rating || generateDefaultRating(),
  alamat: rawDestination.alamat || 'Alamat belum tersedia, Surabaya, Jawa Timur',
  jam_buka: rawDestination.jam_buka || '08:00 - 22:00 WIB',
  image_url: rawDestination.image_url || generateDefaultImageUrl(rawDestination.nama_destinasi || rawDestination.nama)
}
        
        destinations.push(destination)
      } catch (error) {
        console.error('Error parsing JSONL line:', line, error)
      }
    }
  }
  
  return destinations
}

import { Destination } from '@/types'

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

// Helper function to generate default descriptions
// Helper function to generate default descriptions
function generateDefaultDescription(nama: string, kategori: string | string[]): string {
  const kategoriArray = Array.isArray(kategori) ? kategori : [kategori]
  const mainKategori = kategoriArray[0] || 'umum'
  
  const descriptions: Record<string, string> = {
    'makanan_berat': `${nama} adalah tempat makan yang menyajikan berbagai hidangan lengkap dan mengenyangkan. Cocok untuk makan siang atau malam bersama keluarga dan teman.`,
    'makanan_ringan': `${nama} menawarkan berbagai jajanan dan camilan lezat. Tempat yang tepat untuk ngemil atau mencari oleh-oleh khas Surabaya.`,
    'oleh_oleh': `${nama} adalah pusat oleh-oleh yang menyediakan berbagai produk khas Surabaya dan Jawa Timur. Pilihan terbaik untuk membeli kenang-kenangan.`,
    'mall': `${nama} adalah pusat perbelanjaan modern yang menyediakan berbagai kebutuhan keluarga, dari fashion hingga kuliner dalam satu tempat yang nyaman.`,
    'non_kuliner': `${nama} merupakan destinasi wisata menarik di Surabaya yang menawarkan pengalaman berkesan untuk dikunjungi bersama keluarga dan teman.`,
    'play': `${nama} adalah tempat rekreasi dan hiburan yang menyenangkan untuk menghabiskan waktu bersama keluarga dan teman-teman.`,
    'kantor_pariwisata': `${nama} menyediakan informasi lengkap tentang destinasi wisata dan layanan pariwisata di Surabaya dan sekitarnya.`,
    'all': `${nama} adalah destinasi serbaguna yang menawarkan berbagai fasilitas dan aktivitas untuk memenuhi kebutuhan pengunjung.`
  }
  
  return descriptions[mainKategori] || `${nama} adalah destinasi menarik yang patut dikunjungi saat berada di Surabaya. Menawarkan pengalaman yang berkesan untuk wisatawan.`
}

// Helper function to generate random rating between 4.0-4.8
function generateDefaultRating(): number {
  return Math.round((Math.random() * 0.8 + 4.0) * 10) / 10
}

// Helper function to generate default image URL
function generateDefaultImageUrl(nama: string): string {
  const cleanName = nama.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  return `https://picsum.photos/seed/${cleanName}/400/300`
}
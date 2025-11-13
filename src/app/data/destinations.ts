// import { Destination } from '@/types'

// export const destinations: Destination[] = [
//   {
//     place_id: 'pusat-oleh-oleh-bu-rudy',
//     order: 1,
//     nama: 'Pusat Oleh-Oleh Bu Rudy',
//     kategori: ['belanja', 'wisata_kuliner'],
//     coordinates: [-7.2575, 112.7521],
//     deskripsi: 'Pusat oleh-oleh khas Surabaya dengan berbagai pilihan makanan ringan dan kerajinan lokal.',
//     rating: 4.5,
//     alamat: 'Jl. Kembang Jepun No.1, Surabaya',
//     jam_buka: '08:00 - 21:00 WIB',
//   },
//   {
//     place_id: 'nasi-goreng-kambing',
//     order: 2,
//     nama: 'Nasi Goreng Kambing',
//     kategori: ['makanan_berat', 'halal', 'wisata_kuliner'],
//     coordinates: [-7.2456, 112.7378],
//     deskripsi: 'Kuliner legendaris Surabaya dengan cita rasa nasi goreng kambing yang khas dan lezat.',
//     rating: 4.7,
//     alamat: 'Jl. Walikota Mustajab No.35, Surabaya',
//     jam_buka: '18:00 - 02:00 WIB',
//   },
//   {
//     place_id: 'taman-bunga',
//     order: 3,
//     nama: 'Taman Bunga',
//     kategori: ['wisata_alam'],
//     coordinates: [-7.2389, 112.7289],
//     deskripsi: 'Taman indah dengan berbagai jenis bunga warna-warni, cocok untuk bersantai dan berfoto.',
//     rating: 4.3,
//     alamat: 'Jl. Ahmad Yani, Surabaya',
//     jam_buka: '06:00 - 18:00 WIB',
//   },
//   {
//     place_id: 'warung_mbak_anis',
//     order: 4,
//     nama: 'Warung Mbak Anis',
//     kategori: ['makanan_berat', 'halal', 'wisata_kuliner'],
//     coordinates: [-7.2500, 112.7400],
//     deskripsi: 'Warung makan sederhana yang menyajikan masakan rumahan khas Surabaya dengan cita rasa autentik.',
//     rating: 4.6,
//     alamat: 'Jl. Pahlawan No.10, Surabaya',
//     jam_buka: '10:00 - 20:00 WIB',
//   },
//   {
//     place_id: 'warung_mas_sugik',
//     order: 4,
//     nama: 'Warung Mas Sugik',
//     kategori: ['makanan_berat', 'halal', 'wisata_kuliner'],
//     coordinates: [-7.2500, 112.7400],
//     deskripsi: 'Warung makan sederhana yang menyajikan masakan rumahan khas Surabaya dengan cita rasa autentik.',
//     rating: 4.6,
//     alamat: 'Jl. Pahlawan No.10, Surabaya',
//     jam_buka: '10:00 - 20:00 WIB',
//   }
//   // Add more destinations as needed
// ]

import { Destination } from '@/types'

// This will be populated by the API
export let destinations: Destination[] = []

// Function to load destinations (used by pages)
export async function loadDestinations(): Promise<Destination[]> {
  try {
    const response = await fetch('/api/destinations', {
      cache: 'force-cache'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch destinations')
    }
    
    const data = await response.json()
    destinations = data
    return data
  } catch (error) {
    console.error('Error loading destinations:', error)
    return []
  }
}
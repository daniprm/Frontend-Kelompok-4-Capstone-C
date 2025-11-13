'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Destination } from '@/types';
import { getDestinations } from '@/services/destinationService';

// Dynamically import MapComponent to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  )
});

export default function DestinationDetailPage() {
  const params = useParams();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);

    async function loadDestination() {
      try {
        setLoading(true);
        setError(null);

        // Decode destination place_id from URL
        const placeId = decodeURIComponent(params.place_id as string);
        console.log('🔍 Looking for destination with place_id:', placeId);
        
        // Search by place_id directly
        const allDestinations = await getDestinations();
        console.log('📍 Available destinations:', allDestinations.length);
        console.log('📍 Sample place_ids:', allDestinations.slice(0, 5).map(d => d.place_id));
        
        const foundDestination = allDestinations.find(
          dest => dest.place_id === placeId
        );

        console.log('✅ Found destination:', foundDestination?.nama || 'Not found');

        if (foundDestination) {
          setDestination(foundDestination);
        } else {
          // Create a fallback destination if not found
          setDestination({
            place_id: 'not-found',
            order: 0,
            nama: `Destination with ID: ${placeId}`,
            kategori: ['wisata'],
            coordinates: [-7.2458, 112.7378],
            deskripsi: 'Informasi detail destinasi ini sedang dalam proses pembaruan. Silakan kembali lagi nanti untuk informasi yang lebih lengkap.',
            rating: 4.0,
            alamat: 'Alamat belum tersedia, Surabaya, Jawa Timur',
            jam_buka: '08:00 - 17:00 WIB',
            image_url: `https://picsum.photos/seed/${placeId}/1920/800`
          });
          setError(`Destinasi dengan ID "${placeId}" tidak ditemukan`);
        }
      } catch (err) {
        console.error('Error loading destination:', err);
        setError('Terjadi kesalahan saat memuat data destinasi');
        
        // Fallback destination
        const placeId = decodeURIComponent(params.place_id as string);
        setDestination({
          place_id: 'error-fallback',
          order: 0,
          nama: `Error loading destination: ${placeId}`,
          kategori: ['wisata'],
          coordinates: [-7.2458, 112.7378],
          deskripsi: 'Terjadi kesalahan saat memuat informasi destinasi. Silakan coba lagi nanti.',
          rating: 4.0,
          alamat: 'Alamat belum tersedia, Surabaya, Jawa Timur',
          jam_buka: '08:00 - 17:00 WIB',
          image_url: `https://picsum.photos/seed/${placeId}/1920/800`
        });
      } finally {
        setLoading(false);
      }
    }

    loadDestination();
  }, [params.place_id]); // Changed from params.name to params.place_id

  // Loading state
  if (loading || !destination) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Loading Header */}
        <div className="h-[400px] w-full bg-gray-300 animate-pulse"></div>
        
        <div className="container mx-auto px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-8 bg-gray-300 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-300 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                  <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categoryLabels: { [key: string]: string } = {
    makanan_berat: 'Makanan Berat',
    makanan_ringan: 'Makanan Ringan',
    halal: 'Halal',
    wisata_alam: 'Wisata Alam',
    wisata_budaya: 'Wisata Budaya',
    wisata_kuliner: 'Wisata Kuliner',
    oleh_oleh: 'Oleh-oleh',
    belanja: 'Belanja',
    hiburan: 'Hiburan',
    mall: 'Mall',
    non_kuliner: 'Non Kuliner',
    play: 'Bermain',
    kantor_pariwisata: 'Kantor Pariwisata',
    all: 'Semua',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-[400px] w-full">
        <img
          src={
            destination.image_url ||
            destination.gambar ||
            `https://picsum.photos/seed/${destination.nama}/1920/800`
          }
          alt={destination.nama}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Error Banner */}
        {error && (
          <div className="absolute top-20 left-6 right-6 md:left-12 md:right-12">
            <div className="bg-yellow-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              ⚠️ {error}
            </div>
          </div>
        )}

        {/* Breadcrumb */}
        <div className="absolute top-6 left-6 right-6 md:left-12 md:right-12">
          <div className="flex items-center gap-2 text-white">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <Link href="/lihat-semua" className="hover:underline">
              Destinasi
            </Link>
            <span>/</span>
            <span className="font-semibold">{destination.nama}</span>
          </div>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {destination.nama}
            </h1>
            <div className="flex flex-wrap gap-2">
              {destination.kategori.map((kat, idx) => (
                <span
                  key={idx}
                  className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm"
                >
                  {categoryLabels[kat] || kat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Rating & Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center gap-6 mb-6">
                {destination.rating && (
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">⭐</span>
                    <div>
                      <div className="text-2xl font-bold text-gray-800">
                        {destination.rating.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  </div>
                )}
                
                {/* Category badges */}
                <div className="flex flex-wrap gap-2">
                  {destination.kategori.map((kat, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {categoryLabels[kat] || kat}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Tentang Destinasi
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {destination.deskripsi}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.alamat && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <span className="text-2xl">📍</span>
                    <div>
                      <div className="font-semibold text-gray-800 mb-1">
                        Alamat
                      </div>
                      <div className="text-gray-600">{destination.alamat}</div>
                    </div>
                  </div>
                )}
                {destination.jam_buka && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <span className="text-2xl">🕐</span>
                    <div>
                      <div className="font-semibold text-gray-800 mb-1">
                        Jam Buka
                      </div>
                      <div className="text-gray-600">
                        {destination.jam_buka}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Lokasi</h2>
              <MapComponent
                destinations={[destination]}
                userLocation={destination.coordinates}
                height="400px"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Koordinat Lokasi
              </h3>
              <div className="space-y-3 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Latitude</div>
                  <div className="font-mono text-gray-800 bg-gray-50 p-2 rounded">
                    {destination.coordinates[0]}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Longitude</div>
                  <div className="font-mono text-gray-800 bg-gray-50 p-2 rounded">
                    {destination.coordinates[1]}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`https://www.google.com/maps?q=${destination.coordinates[0]},${destination.coordinates[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Buka di Google Maps
                </a>
                <Link
                  href="/routes"
                  className="block w-full text-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Buat Rute Perjalanan
                </Link>
                <Link
                  href="/lihat-semua"
                  className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Lihat Semua Destinasi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}